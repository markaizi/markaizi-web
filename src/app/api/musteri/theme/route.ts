import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

// Panel görünüm tercihi — admin/çalışan/müşteri hepsi kendi Profilim sayfasından
// aynı endpoint'i kullanır, rol farkı yok. Cihazdan bağımsız kalsın diye DB'de tutulur.
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const me = await prisma.user.findUnique({ where: { id: session.uid }, select: { panelTheme: true } });
  return NextResponse.json({ theme: me?.panelTheme ?? "KOYU" });
}

const schema = z.object({ theme: z.enum(["KOYU", "AYDINLIK"]) });

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Geçersiz veri." }, { status: 400 });

  await prisma.user.update({ where: { id: session.uid }, data: { panelTheme: parsed.data.theme } });
  return NextResponse.json({ ok: true });
}
