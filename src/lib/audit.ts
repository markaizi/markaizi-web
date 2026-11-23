import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

/**
 * İşlem kaydı (v3.11.0). Ajanda + Finans'taki her yazma işlemi buraya düşer.
 * Kayıt yazılamazsa (ör. tablo henüz yok) asıl işlem ETKİLENMEZ — hata yutulur, loglanır.
 * detail içine parola / token gibi sırlar konmaz; yalnızca istek özeti.
 */
export async function audit(entry: {
  source: "panel" | "bot";
  actor?: string | null;
  action: string;
  target?: string | null;
  ok?: boolean;
  detail?: unknown;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        source: entry.source,
        actor: entry.actor ?? null,
        action: entry.action.slice(0, 80),
        target: entry.target ? String(entry.target).slice(0, 200) : null,
        ok: entry.ok ?? true,
        detail: entry.detail === undefined ? Prisma.JsonNull : (JSON.parse(JSON.stringify(entry.detail)) as Prisma.InputJsonValue),
      },
    });
  } catch (e) {
    console.error("[audit] kayıt yazılamadı:", e instanceof Error ? e.message : e);
  }
}

/** Bir kaydın insan tarafından okunur kısa adı (başlık) — target alanı için. */
export function titleOf(result: unknown): string | null {
  if (Array.isArray(result)) return result.length ? `${titleOf(result[0]) ?? "kayıt"} (+${result.length - 1})` : null;
  if (result && typeof result === "object" && "title" in result) return String((result as { title: unknown }).title);
  return null;
}
