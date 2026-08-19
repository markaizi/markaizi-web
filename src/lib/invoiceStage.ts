/**
 * Fatura aşaması — vade tarihine göre HESAPLANIR, veritabanında saklanmaz.
 *
 * Neden: Invoice.status daha önce iki ayrı şeyi birden tutuyordu — "ödendi mi"
 * (gerçek durum) ve "vadesine göre nerede" (tarihin fonksiyonu). İkincisi
 * saklandığı için zamanla bayatlıyordu: vadesi 1 ay sonra olan fatura
 * "Bekliyor", vadesi 11 gün geçmiş fatura da "Bekliyor" görünüyordu ve hiçbir
 * şey bunları güncellemiyordu.
 *
 * Artık veritabanındaki status yalnızca ÖDENDİ / ÖDENMEDİ ayrımını tutar;
 * aşama her okumada buradan hesaplanır. Böylece sayfa ne zaman açılırsa açılsın
 * doğru olur ve zamanlanmış bir göreve (cron) ihtiyaç kalmaz.
 */

export type InvoiceStage = "ODENDI" | "GUNU_GELMEDI" | "BEKLIYOR" | "GECIKMEDI";

/** Vade gününden bu kadar gün sonra fatura "Gecikmede" sayılır. */
export const OVERDUE_GRACE_DAYS = 7;

export const INVOICE_STAGE_LABEL: Record<InvoiceStage, string> = {
  ODENDI: "Ödendi",
  GUNU_GELMEDI: "Günü Gelmedi",
  BEKLIYOR: "Bekliyor",
  GECIKMEDI: "Gecikmede",
};

export const INVOICE_STAGE_COLOR: Record<InvoiceStage, string> = {
  ODENDI: "#34d399",       // yeşil
  GUNU_GELMEDI: "#8a8a9a", // gri — henüz aksiyon gerekmiyor
  BEKLIYOR: "#fbbf24",     // sarı — tahsil edilmeli
  GECIKMEDI: "#f87171",    // kırmızı — gecikti
};

// Türkiye 2016'dan beri yıl boyu UTC+3 (yaz saati uygulaması yok).
const ISTANBUL_OFFSET_MS = 3 * 60 * 60 * 1000;

/**
 * "Bugün"ü Türkiye takvimine göre, gün başlangıcına yuvarlanmış olarak verir.
 * Sunucu UTC'de çalıştığı için bu olmadan gece yarısı ile 03:00 arasında bir
 * gün kayması olurdu.
 */
function istanbulStartOfToday(now: Date): number {
  const shifted = new Date(now.getTime() + ISTANBUL_OFFSET_MS);
  return Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate());
}

/** Vade tarihini gün başlangıcına yuvarlar (saat bilgisini yok sayar). */
function startOfDayUtc(d: Date): number {
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Faturanın görünen aşamasını hesaplar.
 *
 * - Ödenmişse → Ödendi
 * - Vade tarihi yoksa → Bekliyor (tarih bilgisi olmadan gecikme hesaplanamaz)
 * - Vade günü gelmemişse → Günü Gelmedi
 * - Vade günü geldi, üzerinden 7 günden az geçtiyse → Bekliyor
 * - 7 gün veya daha fazla geçtiyse → Gecikmede
 */
export function getInvoiceStage(
  invoice: { status: string; dueDate: Date | null },
  now: Date = new Date(),
  graceDays: number = OVERDUE_GRACE_DAYS
): InvoiceStage {
  if (invoice.status === "ODENDI") return "ODENDI";
  if (!invoice.dueDate) return "BEKLIYOR";

  const today = istanbulStartOfToday(now);
  const due = startOfDayUtc(invoice.dueDate);

  if (today < due) return "GUNU_GELMEDI";

  const daysPastDue = Math.floor((today - due) / DAY_MS);
  return daysPastDue >= graceDays ? "GECIKMEDI" : "BEKLIYOR";
}

/** Vade gününe kalan (negatifse geçen) gün sayısı. */
export function daysUntilDue(dueDate: Date, now: Date = new Date()): number {
  return Math.floor((startOfDayUtc(dueDate) - istanbulStartOfToday(now)) / DAY_MS);
}
