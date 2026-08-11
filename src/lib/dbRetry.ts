import { Prisma } from "@prisma/client";

// Neon (serverless Postgres) zaman zaman kısa süreli bağlantı kesintisi yaşar —
// compute uyanması, bağlantı sıfırlanması, yönlendirme katmanında geçici
// sağlıksızlık gibi. Böyle bir anda panel sayfaları (hepsi force-dynamic, yani
// her istekte DB'ye gider) komple hata ekranına düşüyordu. Buradaki yardımcı,
// geçici bağlantı hatalarını yakalayıp işlemi birkaç kez yeniden dener.
//
// Yalnızca OKUMA işlemleri için kullanılır (bkz. db.ts) — gerekçesi orada.

// P1001 sunucuya ulaşılamadı · P1002 bağlantı zaman aşımı
// P1008 işlem zaman aşımı · P1017 sunucu bağlantıyı kapattı
const RETRYABLE_CODES = new Set(["P1001", "P1002", "P1008", "P1017"]);

export const MAX_ATTEMPTS = 4;

// Kademeli bekleme: ~150ms → ~400ms → ~900ms (toplam en kötü ~1.5sn ek gecikme).
// Bu, saniyeler süren kısa kesintileri kullanıcıya hiç yansıtmadan yutar; dakikalar
// süren gerçek bir kesintiyi kurtarmaz (kurtarmaya çalışmak da istek zaman aşımına
// yol açacağı için istenmez).
const BACKOFF_MS = [150, 400, 900];

export function isTransientConnectionError(error: unknown): boolean {
  // Bağlantı hiç kurulamadı — sorgu kesinlikle çalışmadı.
  if (error instanceof Prisma.PrismaClientInitializationError) return true;
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return RETRYABLE_CODES.has(error.code);
  }
  return false;
}

function sleep(ms: number): Promise<void> {
  // Aynı anda gelen isteklerin hep birlikte yeniden denemesini önlemek için
  // beklemeye rastgele bir pay (jitter) eklenir.
  const jittered = ms + Math.random() * ms * 0.3;
  return new Promise((resolve) => setTimeout(resolve, jittered));
}

// İşlemi çalıştırır; geçici bağlantı hatasında kademeli bekleyerek yeniden dener.
// Kalıcı hatalar (doğrulama, kısıt ihlali vb.) hiç beklenmeden olduğu gibi fırlatılır.
export async function runWithRetry<T>(
  operation: () => Promise<T>,
  label: string
): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await operation();
    } catch (error) {
      const canRetry = attempt < MAX_ATTEMPTS && isTransientConnectionError(error);
      if (!canRetry) throw error;

      console.warn(
        `[db] ${label} geçici bağlantı hatası — ` +
          `yeniden deneniyor (${attempt}/${MAX_ATTEMPTS - 1})`
      );
      await sleep(BACKOFF_MS[attempt - 1]);
    }
  }
}
