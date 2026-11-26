/**
 * Altın (gram) cinsinden borç — saf hesaplar (v3.18.0). Veritabanına dokunmaz; panel, sunucu ve bot aynı sonucu görsün
 * diye tek yerde. Kalan borç yalnızca gramı belli ödemelerle düşer; "kur bekleyen" ödeme (grams = null) kalanı değiştirmez.
 */
export interface GoldPaymentView {
  id: string;
  paidAt: string; // ISO
  grams: number | null; // null = kur bekliyor
  tlAmount: number | null;
  gramPrice: number | null;
  priceSource: string | null; // "otomatik" | "elle"
  note: string | null;
  auto: boolean; // otomatik kuralla, bir kasa kaydına bağlı olarak açıldı
}

export interface GoldDebtView {
  id: string;
  title: string;
  totalGrams: number;
  notes: string | null;
  autoMatch: string | null;
  autoShare: number | null;
  payments: GoldPaymentView[]; // eskiden yeniye
}

/** "5.837,20", "5837.2", "11500" → sayı (sunucudaki parseTrNumber ile aynı kural: binlik nokta, ondalık virgül). */
export const parseTr = (v: string) => (/\d/.test(v) ? Number(v.replace(/[^\d,.-]/g, "").replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", ".")) : NaN);

export const round2 = (n: number) => Math.round(n * 100) / 100;
export const fmtGr = (n: number) => `${n.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} gr`;

/** TL tutarını gram fiyatına bölerek gram (0,01 gr hassasiyet). */
export const gramsFor = (tl: number, gramPrice: number) => round2(tl / gramPrice);

/** Başlık eşleştirme: küçük harf, Türkçe karakterler sadeleştirilmiş, noktalama boşluk. */
export const normTitle = (s: string) =>
  s.toLocaleLowerCase("tr-TR").replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

export function goldSummary(d: GoldDebtView) {
  const sorted = [...d.payments].sort((a, b) => a.paidAt.localeCompare(b.paidAt));
  let remaining = d.totalGrams;
  // Her satırın yanında o ödemeden SONRA kalan borç — defter gibi tarih tarih okunur.
  const ledger = sorted.map((p) => {
    if (p.grams !== null) remaining = round2(remaining - p.grams);
    return { ...p, remainingAfter: p.grams === null ? null : remaining };
  });
  const paidGrams = round2(d.totalGrams - remaining);
  const lastPriced = [...sorted].reverse().find((p) => p.gramPrice);
  return {
    totalGrams: d.totalGrams,
    paidGrams,
    remainingGrams: Math.max(0, remaining),
    pendingCount: sorted.filter((p) => p.grams === null).length,
    pendingTl: sorted.filter((p) => p.grams === null).reduce((a, p) => a + (p.tlAmount ?? 0), 0),
    lastPrice: lastPriced?.gramPrice ?? null, // TL karşılığı tahmini için — canlı kur değildir
    ledger, // eskiden yeniye
  };
}

/** Kuralın insan diliyle özeti. */
export function goldRuleText(d: Pick<GoldDebtView, "autoMatch" | "autoShare">): string | null {
  if (!d.autoMatch || !d.autoShare) return null;
  const pct = Math.round(d.autoShare * 100);
  return `Başlığında “${d.autoMatch}” geçen bir gider ödendiğinde, tutarının %${pct}’${pct === 50 ? "si" : "i"} o günkü gram altın kuruyla grama çevrilip otomatik düşülür.`;
}
