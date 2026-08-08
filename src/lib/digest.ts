import { prisma } from "@/lib/db";
import { DigestEventType } from "@prisma/client";

// Anlık e-posta yerine olayları biriktirir — her akşam cron tek özet e-postası
// gönderir (bkz. /api/cron/daily-digest). Hata durumunda çağıran işlemi asla
// bloklamaz, sadece loglanır.
export async function logDigestEvent(type: DigestEventType, summary: string) {
  try {
    await prisma.digestEvent.create({ data: { type, summary } });
  } catch (e) {
    console.error("logDigestEvent başarısız:", e);
  }
}
