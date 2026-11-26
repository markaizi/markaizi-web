/**
 * Kasa hesapları — Mİ Asistan iOS uygulamasındaki "Ödemeler / Kasa" ekranının birebir
 * formülleri (23 Kas 2026'da canlı veriyle, uygulamanın ekran görüntüleriyle birebir doğrulandı).
 *
 * Saf fonksiyon: veritabanına dokunmaz; sunucu sayfası, istemci ve Telegram botu aynı
 * sonucu üretsin diye tek yerde. Ay sınırları İstanbul saatine göre.
 */

export type KasaDirection = "GELIR" | "GIDER" | "BORC" | "ALACAK";

export interface KasaCalcEntry {
  id: string;
  title: string;
  amount: number;
  direction: KasaDirection;
  category: string;
  status: "BEKLIYOR" | "ODENDI";
  dueDate: string; // ISO
  paidAt: string | null;
  isRecurring: boolean;
  clientId: string | null;
  clientName: string | null;
  clientSlug?: string | null;
  employeeId?: string | null;
  /** Kart / ek hesap limiti (v3.17.0) — yalnızca borç kartı kayıtlarında; tanımlı değilse null. */
  creditLimit?: number | null;
  /**
   * Kasa öncesi geçmiş kayıt (v3.7.0): 1 Ekim 2026 öncesi eski faturalardan Finans geçmişine alınan tahsilatlar.
   * Toplam gelire, yıllık gelire ve geçmiş aylara girer; KASADA KALAN hesabına girmez (31 Ekim kasa
   * denkleştirmesi bu dönemi zaten kapsıyor). legacyId "invoice:<id>" veya "gecmis:<firma>:<ay>" olan kayıtlar.
   */
  historical?: boolean;
}

export interface KasaCalcCardTx {
  id: string;
  entryId: string;
  entryTitle: string;
  title: string;
  amount: number;
  category: string;
  transactionDate: string;
}

/** Kart / ek hesap borcu kategorileri — bakiyesi harcamalarla büyür, "Ödeme yap" ile düşer. */
export const DEBT_CATEGORIES = ["kredi_karti", "ek_hesap", "borc_karti", "vergi_borcu"];

const TZ = "Europe/Istanbul";
export const monthOf = (iso: string) => new Date(iso).toLocaleDateString("en-CA", { timeZone: TZ }).slice(0, 7);
export const isIncoming = (d: KasaDirection) => d === "GELIR" || d === "ALACAK";
export const isDebt = (e: Pick<KasaCalcEntry, "category">) => DEBT_CATEGORIES.includes(e.category);

/**
 * Kart limiti (v3.17.0): limit tanımlı bir kart / ek hesap için kullanılan, kalan ve doluluk oranı.
 * Kalan eksiye düşebilir (limit aşımı) — kırpılmaz, ekranda uyarı olarak gösterilir.
 */
export function cardLimit(e: Pick<KasaCalcEntry, "amount" | "creditLimit">) {
  if (!e.creditLimit || e.creditLimit <= 0) return null;
  const available = Math.round((e.creditLimit - e.amount) * 100) / 100;
  return { limit: e.creditLimit, used: e.amount, available, pct: Math.min(100, Math.max(0, Math.round((e.amount / e.creditLimit) * 100))) };
}

/**
 * Yatırım (v3.16.0): kenara ayrılan para — gider, borç ya da alacak değildir; ayrı bir varlık kalemi olarak izlenir.
 * Kayıt KasaEntry'de `category: "yatirim"` ile tutulur (şema değişmedi):
 *   - status ODENDI   → para kasadan çıktı: `paidAt` tarihinde "Kasada Kalan"dan düşer.
 *   - status BEKLIYOR → kasa dışı kaynak: yalnızca Yatırım toplamında görünür, kasaya dokunmaz.
 * Ay giderine, yaklaşan ödemelere, borçlara ve geçmiş ayların gider toplamına hiçbir durumda girmez.
 */
export const INVESTMENT_CATEGORY = "yatirim";
export const isInvestment = (e: Pick<KasaCalcEntry, "category">) => e.category === INVESTMENT_CATEGORY;

/** "Eşya Ödemesi (3/9 - Aralık)" → { base: "Eşya Ödemesi", index: 3, total: 9 } */
export function parseInstallment(title: string): { base: string; index: number; total: number } | null {
  const m = title.match(/^(.*?)\s*\((\d+)\s*\/\s*(\d+)/);
  return m ? { base: m[1].trim(), index: Number(m[2]), total: Number(m[3]) } : null;
}

export interface InstallmentGroup {
  base: string;
  total: number;
  paidCount: number;
  remainingCount: number;
  remainingAmount: number;
  nextDue: string | null;
  entries: KasaCalcEntry[];
}

/** Giderin "bu ayın gideri" listesine girip girmediği: kart borcu bakiyeleri ve borç ödemeleri hariç. */
function isMonthlyExpense(e: KasaCalcEntry) {
  return (e.direction === "BORC" || e.direction === "GIDER") && !isDebt(e) && e.category !== "borc_odemesi";
}

export function computeKasa(allEntries: KasaCalcEntry[], cardTxs: KasaCalcCardTx[], nowIso: string) {
  const month = monthOf(nowIso);
  const sum = (list: { amount: number }[]) => list.reduce((a, x) => a + x.amount, 0);

  // Yatırımlar ayrı tutulur; aşağıdaki gelir / gider / borç hesaplarının hiçbirine girmez.
  const investments = allEntries.filter(isInvestment).sort((a, b) => b.dueDate.localeCompare(a.dueDate));
  const investedFromCash = investments.filter((e) => e.status === "ODENDI" && !e.historical);
  const entries = allEntries.filter((e) => !isInvestment(e));

  const paidIn = entries.filter((e) => e.status === "ODENDI" && isIncoming(e.direction));
  const paidOut = entries.filter((e) => e.status === "ODENDI" && !isIncoming(e.direction));
  // Kasa (nakit) yalnızca Kasa dönemi kayıtlarından hesaplanır — geçmiş kayıtlar hariç.
  const cashIn = paidIn.filter((e) => !e.historical);
  const cashOut = paidOut.filter((e) => !e.historical);
  const year = month.slice(0, 4);

  // Kart / hesap borçları
  const debtCards = entries.filter((e) => e.status === "BEKLIYOR" && isDebt(e));
  // Limitler — yalnızca limiti tanımlı kartlar toplanır (limitsiz kartın borcu "kullanılan"a girmez).
  const limited = debtCards.filter((e) => cardLimit(e));
  const limitTotal = limited.reduce((a, e) => a + (e.creditLimit ?? 0), 0);
  const limitUsed = sum(limited);

  // Taksitli borçlar — başlıktaki (n/N) ile gruplanır; ödenen sayısı = N − bekleyen taksit.
  const groupMap = new Map<string, KasaCalcEntry[]>();
  for (const e of entries) {
    if (e.direction !== "BORC") continue;
    const inst = parseInstallment(e.title);
    if (!inst) continue;
    groupMap.set(inst.base, [...(groupMap.get(inst.base) ?? []), e]);
  }
  const installments: InstallmentGroup[] = [...groupMap.entries()]
    .map(([base, list]) => {
      const sorted = [...list].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
      const pending = sorted.filter((e) => e.status === "BEKLIYOR");
      const total = Math.max(...sorted.map((e) => parseInstallment(e.title)!.total));
      return {
        base, total,
        paidCount: total - pending.length,
        remainingCount: pending.length,
        remainingAmount: sum(pending),
        nextDue: pending[0]?.dueDate ?? null,
        entries: sorted,
      };
    })
    .filter((g) => g.remainingCount > 0)
    .sort((a, b) => b.remainingAmount - a.remainingAmount);

  // Bu ay
  const collectedThisMonth = paidIn.filter((e) => e.paidAt && monthOf(e.paidAt) === month);
  const openReceivables = entries.filter((e) => e.status === "BEKLIYOR" && isIncoming(e.direction) && monthOf(e.dueDate) <= month);
  const monthExpenses = entries.filter((e) => isMonthlyExpense(e) && monthOf(e.dueDate) === month);
  const monthCardTxs = cardTxs.filter((t) => monthOf(t.transactionDate) === month);

  return {
    month,
    totalIncome: sum(paidIn), // tüm zamanlar (geçmiş kayıtlar dahil)
    yearIncome: sum(paidIn.filter((e) => e.paidAt && monthOf(e.paidAt).startsWith(year))), // İstanbul takvim yılı
    year,
    cash: sum(cashIn) - sum(cashOut) - sum(investedFromCash),
    investments,
    investmentTotal: sum(investments),
    investedFromCashTotal: sum(investedFromCash),
    debtTotal: sum(debtCards) + installments.reduce((a, g) => a + g.remainingAmount, 0),
    debtItemCount: debtCards.length + installments.length,
    debtCards,
    limitTotal,
    limitUsed,
    limitAvailable: Math.round((limitTotal - limitUsed) * 100) / 100,
    limitCardCount: limited.length,
    installments,
    monthIncomeTarget: sum(collectedThisMonth) + sum(openReceivables),
    collectedThisMonth,
    collectedTotal: sum(collectedThisMonth),
    openReceivables,
    openReceivablesTotal: sum(openReceivables),
    monthExpenses,
    monthCardTxs,
    monthExpenseTotal: sum(monthExpenses) + sum(monthCardTxs),
    monthExpenseCount: monthExpenses.length + monthCardTxs.length,
    pendingReceivablesAll: sum(entries.filter((e) => e.status === "BEKLIYOR" && isIncoming(e.direction))),
  };
}

/** Geçmiş aylar: tahsil edilen gelir, ay gideri (planlı gider + kart harcaması), net. */
export function monthlyHistory(entries: KasaCalcEntry[], cardTxs: KasaCalcCardTx[]) {
  const map = new Map<string, { gelir: number; gider: number }>();
  const bucket = (m: string) => map.get(m) ?? map.set(m, { gelir: 0, gider: 0 }).get(m)!;
  for (const e of entries) {
    if (isInvestment(e)) continue; // yatırım gelir de gider de değildir
    if (e.status === "ODENDI" && isIncoming(e.direction) && e.paidAt) bucket(monthOf(e.paidAt)).gelir += e.amount;
    if (isMonthlyExpense(e)) bucket(monthOf(e.dueDate)).gider += e.amount;
  }
  for (const t of cardTxs) bucket(monthOf(t.transactionDate)).gider += t.amount;
  return [...map.entries()]
    .map(([key, v]) => ({ key, ...v, net: v.gelir - v.gider }))
    .sort((a, b) => b.key.localeCompare(a.key));
}
