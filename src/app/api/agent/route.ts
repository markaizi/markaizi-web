import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { ACTIONS, AgentError } from "@/lib/agent";
import { AgendaRuleError } from "@/lib/agenda";
import { audit, titleOf } from "@/lib/audit";
import { rateLimit } from "@/lib/security";

export const runtime = "nodejs";

/**
 * Telegram + Claude botunun tek giriş noktası (v3.11.0).
 *   POST /api/agent   Authorization: Bearer <AGENT_TOKEN>   { "action": "ziyaret_ekle", "args": { … } }
 * - AGENT_TOKEN ortam değişkeni tanımlı değilse uç kapalıdır (503).
 * - Yalnızca src/lib/agent.ts'teki adlandırılmış işlemler çalışır; serbest sorgu / kalıcı silme yoktur.
 * - Her yazma işlemi (başarılı / başarısız) işlem kaydına yazılır.
 */
function authorized(req: NextRequest): boolean | null {
  const expected = process.env.AGENT_TOKEN;
  if (!expected || expected.length < 32) return null;
  const got = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const a = Buffer.from(got), b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  const auth = authorized(req);
  if (auth === null) return NextResponse.json({ error: "Bot ucu yapılandırılmamış." }, { status: 503 });
  if (!auth) {
    const rl = rateLimit("agent:bad", 10, 60_000); // yanlış token denemelerini yavaşlat
    return NextResponse.json({ error: "Yetkisiz." }, { status: rl.ok ? 401 : 429 });
  }
  const rl = rateLimit("agent:ok", 120, 60_000);
  if (!rl.ok) return NextResponse.json({ error: "Çok fazla istek." }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });

  const body = (await req.json().catch(() => null)) as { action?: unknown; args?: unknown } | null;
  const action = typeof body?.action === "string" ? body.action : "";
  const handler = ACTIONS[action];
  if (!handler) {
    return NextResponse.json({ error: `Bilinmeyen işlem "${action}".`, islemler: Object.keys(ACTIONS) }, { status: 400 });
  }
  const args = body?.args && typeof body.args === "object" && !Array.isArray(body.args) ? (body.args as Record<string, unknown>) : {};

  try {
    const result = await handler.run(args);
    if (handler.write) {
      const target = titleOf(result) ?? (result && typeof result === "object" && "baslik" in result ? String((result as { baslik: unknown }).baslik) : null);
      await audit({ source: "bot", actor: "telegram", action, target, detail: args });
    }
    return NextResponse.json({ ok: true, result });
  } catch (e) {
    let error = "İşlem yapılamadı.";
    let status = 500;
    if (e instanceof ZodError) { error = `Geçersiz veri: ${e.issues.map((i) => `${i.path.join(".")} ${i.message}`).join("; ")}`; status = 400; }
    else if (e instanceof AgentError || e instanceof AgendaRuleError) { error = e.message; status = 400; }
    else if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") { error = "Kayıt bulunamadı."; status = 404; }
    else console.error("[agent]", e);
    if (handler.write) await audit({ source: "bot", actor: "telegram", action, ok: false, detail: { istek: args, hata: error } });
    return NextResponse.json({ error }, { status });
  }
}
