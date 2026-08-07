// İş kayıtları için dönem (arşiv) hesaplama.
//
// paymentDay ayarlıysa (örn. 5): dönem, ödeme gününün ertesi gününden bir sonraki
// ayın ödeme gününe kadar sürer. Örn. paymentDay=5 için "6 Temmuz – 5 Ağustos".
// Ayın 6'sına geçildiğinde önceki dönem kapanır, yeni (mevcut) dönem başlar.
//
// paymentDay ayarlı değilse (null): dönem, sade takvim ayıdır.
//
// Dönemler DB'de saklanmaz — her zaman ilgili tarihten (veya "bugün"den) canlı
// hesaplanır. Böylece ödeme günü sonradan değiştirilirse geçmiş kayıtlar da
// otomatik olarak doğru dönemlere yeniden gruplanır; ayrıca "dönemi kapatan" bir
// arka plan işine (cron) ihtiyaç kalmaz.

export interface WorkPeriod {
  /** İstikrarlı, sıralanabilir anahtar — dönemin bitiş tarihi (yyyy-MM-dd). API'de "periodEnd" olarak kullanılır. */
  key: string;
  /** Görüntülenecek etiket, örn. "6 Temmuz – 5 Ağustos 2026" veya "Ağustos 2026". */
  label: string;
  /** Dönem başlangıcı, günün başı (00:00:00.000). */
  start: Date;
  /** Dönem bitişi, günün sonu (23:59:59.999) — dahil. */
  end: Date;
}

function daysInMonth(year: number, month0: number): number {
  return new Date(year, month0 + 1, 0).getDate();
}

function atStartOfDay(y: number, m0: number, d: number): Date {
  return new Date(y, m0, d, 0, 0, 0, 0);
}

function atEndOfDay(y: number, m0: number, d: number): Date {
  return new Date(y, m0, d, 23, 59, 59, 999);
}

const fmtDayMonth = (d: Date) => d.toLocaleDateString("tr-TR", { day: "numeric", month: "long" });
const fmtDayMonthYear = (d: Date) => d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
const fmtMonthYear = (d: Date) => d.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });
const isoDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Verilen tarihin (paymentDay'e göre) ait olduğu dönemin sınırlarını döner. */
export function getPeriodForDate(date: Date, paymentDay: number | null): WorkPeriod {
  if (!paymentDay) {
    const y = date.getFullYear();
    const m0 = date.getMonth();
    const start = atStartOfDay(y, m0, 1);
    const end = atEndOfDay(y, m0, daysInMonth(y, m0));
    return { key: isoDate(end), label: fmtMonthYear(start), start, end };
  }

  const dd = date.getDate();
  let endYear = date.getFullYear();
  let endMonth0 = date.getMonth();
  if (dd > paymentDay) {
    endMonth0 += 1;
    if (endMonth0 > 11) { endMonth0 = 0; endYear += 1; }
  }
  const endDay = Math.min(paymentDay, daysInMonth(endYear, endMonth0));
  const end = atEndOfDay(endYear, endMonth0, endDay);

  let startYear = endYear;
  let startMonth0 = endMonth0 - 1;
  if (startMonth0 < 0) { startMonth0 = 11; startYear -= 1; }
  const startDay = Math.min(paymentDay + 1, daysInMonth(startYear, startMonth0));
  const start = atStartOfDay(startYear, startMonth0, startDay);

  const label = `${fmtDayMonth(start)} – ${fmtDayMonthYear(end)}`;
  return { key: isoDate(end), label, start, end };
}

/** "Bugün"ün ait olduğu (henüz kapanmamış, düzenlenebilir) dönem. */
export function getCurrentPeriod(paymentDay: number | null, today: Date = new Date()): WorkPeriod {
  return getPeriodForDate(today, paymentDay);
}

/**
 * Verilen öğeleri (tarihine göre) dönemlere ayırır. `current`, bugünün ait
 * olduğu dönemdeki öğeleri içerir; `archived`, önceki dönemleri en yeniden
 * eskiye doğru sıralı döner.
 */
export function groupByPeriod<T>(
  items: T[],
  getDate: (item: T) => Date,
  paymentDay: number | null,
  today: Date = new Date()
): {
  current: { period: WorkPeriod; items: T[] };
  archived: { period: WorkPeriod; items: T[] }[];
} {
  const currentPeriod = getCurrentPeriod(paymentDay, today);
  const buckets = new Map<string, { period: WorkPeriod; items: T[] }>();

  for (const item of items) {
    const period = getPeriodForDate(getDate(item), paymentDay);
    let bucket = buckets.get(period.key);
    if (!bucket) {
      bucket = { period, items: [] };
      buckets.set(period.key, bucket);
    }
    bucket.items.push(item);
  }

  const current = buckets.get(currentPeriod.key) ?? { period: currentPeriod, items: [] };
  const archived = Array.from(buckets.values())
    .filter((b) => b.period.key !== currentPeriod.key)
    .sort((a, b) => b.period.end.getTime() - a.period.end.getTime());

  return { current, archived };
}
