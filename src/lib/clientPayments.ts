/**
 * Müşteri ödemeleri — TEK KAYNAK: Kasa (v3.5.0).
 *
 * Samet'in kararı (23 Kas 2026): Ekonomi, Ödemeler ve Kasa tek çatı altında; en doğru veri
 * Kasa. Bu yüzden müşterinin panelinde gördüğü "Fatura" listesi, admin firma detayındaki
 * fatura sekmesi, çalışan ekranı ve admin ana sayfa rozetleri artık buradan beslenir:
 *
 *  - 1 Ekim 2026 ve sonrası  → KasaEntry (direction ALACAK/GELIR, category "Müşteri Ödemesi", clientId dolu)
 *  - 1 Ekim 2026 öncesi      → eski Invoice tablosu, salt arşiv (Mİ Asistan Kasa'sı o tarihte başladı)
 *
 * Kasa'daki diğer alacaklar (ör. "borc_alacak" — kişisel verilen borç) müşteriye HİÇ gösterilmez.
 */
import { prisma } from "@/lib/db";
import { getInvoiceStage, OVERDUE_GRACE_DAYS, type InvoiceStage } from "@/lib/invoiceStage";

/** Kasa'nın başladığı gün — bu tarihten önceki ödemeler eski fatura arşivinden okunur. */
export const KASA_START = new Date("2026-10-01T00:00:00+03:00");
export const CLIENT_PAYMENT_CATEGORY = "Müşteri Ödemesi";

const TR_MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const TZ = "Europe/Istanbul";

export interface ClientPayment {
  id: string;
  source: "kasa" | "arsiv";
  period: string;      // müşteriye gösterilen etiket: "Kasım 2026 Ödemesi"
  amount: string;      // "25.000 ₺"
  amountNum: number;
  paid: boolean;
  stage: InvoiceStage;
  dueDate: string | null; // YYYY-MM-DD
  paidAt: string | null;
}

export const fmtTry = (n: number) => n.toLocaleString("tr-TR", { maximumFractionDigits: 2 }) + " ₺";
export const parseTry = (raw: string | null | undefined) => {
  if (!raw) return 0;
  const digits = raw.replace(/,\d{1,2}$/, "").replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
};
const ymd = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: TZ });

/**
 * Kasa başlığından müşteriye gösterilecek dönem etiketi: başlıktaki ay adından itibaren.
 * "Firma Adı Kasım Ödemesi" → "Kasım Ödemesi"; ay adı yoksa vade ayı kullanılır.
 */
export function periodLabel(title: string, dueDate: Date, clientName?: string | null): string {
  for (const m of TR_MONTHS) {
    const i = title.indexOf(` ${m}`);
    if (i >= 0) {
      const rest = title.slice(i + 1);
      const year = dueDate.toLocaleDateString("en-CA", { timeZone: TZ }).slice(0, 4);
      return rest.includes(year) ? rest : rest.replace(m, `${m} ${year}`);
    }
  }
  // Ay adı yok: özel başlıklı ödeme (ör. "Firma Adı Web Sitesi Domain Bedeli") → firma adı çıkarılmış başlık.
  if (clientName && title.startsWith(clientName) && title.length > clientName.length + 1) return title.slice(clientName.length).trim();
  const [y, mo] = ymd(dueDate).split("-").map(Number);
  return `${TR_MONTHS[mo - 1]} ${y} Ödemesi`;
}

const kasaWhere = (clientId?: string) => ({
  deletedAt: null,
  category: CLIENT_PAYMENT_CATEGORY,
  direction: { in: ["ALACAK" as const, "GELIR" as const] },
  clientId: clientId ?? { not: null },
});

/** Bir firmanın tüm ödemeleri — yeni → eski. */
export async function listClientPayments(clientId: string, graceDays?: number | null): Promise<ClientPayment[]> {
  const grace = graceDays ?? OVERDUE_GRACE_DAYS;
  const now = new Date();
  const [kasa, archive] = await Promise.all([
    prisma.kasaEntry.findMany({ where: kasaWhere(clientId), orderBy: { dueDate: "desc" }, include: { client: { select: { name: true } } } }),
    prisma.invoice.findMany({
      // Yalnızca vadesi Kasa başlangıcından önceki eski faturalar. Vadesiz ödenmiş faturalar (domain bedeli vb.) Kasa'ya
      // aktarıldı; vadesiz "Ekim Kalan" gibi bölünmüş kayıtlar ise Kasa'daki aylık kaydın parçası → gösterilmez (çift olmasın).
      where: { clientId, dueDate: { lt: KASA_START } },
      orderBy: { dueDate: "desc" },
    }),
  ]);
  // v3.7.0: ödenmiş eski faturalar Kasa'ya geçmiş kayıt olarak aktarıldı (legacyId "invoice:<id>") —
  // aynı ödeme iki kez görünmesin diye aktarılmış faturalar arşivden düşülür.
  // Çöp kutusundakiler dahil: aktarılıp sonradan çift olduğu için çöpe atılan kayıt arşivden geri gelmesin.
  const importedRows = await prisma.kasaEntry.findMany({
    where: { clientId, legacyId: { startsWith: "invoice:" } },
    select: { legacyId: true },
  });
  const imported = new Set(importedRows.map((e) => e.legacyId!.slice(8)));
  const archiveRest = archive.filter((i) => !imported.has(i.id));
  const fromKasa: ClientPayment[] = kasa.map((e) => {
    const status = e.status === "ODENDI" ? "ODENDI" : "BEKLIYOR";
    return {
      id: e.id, source: "kasa", period: periodLabel(e.title, e.dueDate, e.client?.name),
      amount: fmtTry(Number(e.amount)), amountNum: Number(e.amount), paid: status === "ODENDI",
      stage: getInvoiceStage({ status, dueDate: e.dueDate }, now, grace),
      dueDate: ymd(e.dueDate), paidAt: e.paidAt ? ymd(e.paidAt) : null,
    };
  });
  const fromArchive: ClientPayment[] = archiveRest.map((i) => ({
    id: i.id, source: "arsiv",
    // Eski kayıtlardaki genel "Aylık Ödeme" etiketi müşteriye ay adıyla gösterilir.
    period: i.dueDate && /^(Aylık|Haftalık|İki Haftalık) Ödeme$/i.test(i.period.trim()) ? periodLabel("", i.dueDate) : i.period, amount: i.amount, amountNum: parseTry(i.amount),
    paid: i.status === "ODENDI", stage: getInvoiceStage(i, now, grace),
    dueDate: i.dueDate ? ymd(i.dueDate) : null, paidAt: i.paidAt ? ymd(i.paidAt) : null,
  }));
  return [...fromKasa, ...fromArchive];
}

/** Admin ana sayfa rozetleri için: firma başına bekleyen / gecikmiş ödeme sayısı. */
export async function pendingPaymentCounts(clients: { id: string; overdueGraceDays: number | null }[]) {
  const rows = await prisma.kasaEntry.findMany({
    where: { ...kasaWhere(), status: "BEKLIYOR" },
    select: { clientId: true, dueDate: true },
  });
  const now = new Date();
  const map = new Map<string, { pending: number; overdue: number }>();
  for (const c of clients) map.set(c.id, { pending: 0, overdue: 0 });
  for (const r of rows) {
    const c = clients.find((x) => x.id === r.clientId);
    const slot = r.clientId ? map.get(r.clientId) : undefined;
    if (!c || !slot) continue;
    const stage = getInvoiceStage({ status: "BEKLIYOR", dueDate: r.dueDate }, now, c.overdueGraceDays ?? OVERDUE_GRACE_DAYS);
    if (stage === "BEKLIYOR" || stage === "GECIKMEDI") slot.pending++;
    if (stage === "GECIKMEDI") slot.overdue++;
  }
  return map;
}

/**
 * Aylık müşteri alacaklarını üretir (Mİ Asistan'ın yaptığı gibi): ücreti ve ödeme günü
 * girilmiş her aktif firma için bu ay (vadesi henüz geçmemişse) ve gelecek ay
 * "Müşteri Ödemesi" alacağı yoksa açar.
 * Ayda iki ödeme günü olan firmada (paymentDay2) ücret ikiye bölünür.
 * Tekrar çalıştırmak güvenlidir: aynı firma + aynı ay (+ aynı ödeme dilimi) varsa açmaz.
 */
export async function ensureClientReceivables(now = new Date(), opts: { dryRun?: boolean } = {}) {
  const planned: { title: string; amount: number; dueDate: string }[] = [];
  const clients = await prisma.client.findMany({
    where: { active: true, paymentDay: { not: null }, billingAmount: { not: null } },
    select: { id: true, name: true, billingAmount: true, billingPeriod: true, paymentDay: true, paymentDay2: true },
  });
  const [y, m] = ymd(now).split("-").map(Number);
  const months = [{ y, m }, { y: m === 12 ? y + 1 : y, m: m === 12 ? 1 : m + 1 }];
  let created = 0;
  const key = (yy: number, mm: number) => `${yy}-${String(mm).padStart(2, "0")}`;

  // Tek sorgu (v3.10.0): bu ay + gelecek ayın tüm müşteri ödemeleri. Çöp kutusundakiler DAHİL —
  // elle silinen aylık alacak "eksik" sayılıp yeniden açılmasın.
  const rangeStart = new Date(`${key(months[0].y, months[0].m)}-01T00:00:00+03:00`);
  const afterNext = months[1].m === 12 ? key(months[1].y + 1, 1) : key(months[1].y, months[1].m + 1);
  const rangeEnd = new Date(`${afterNext}-01T00:00:00+03:00`);
  const existingAll = await prisma.kasaEntry.findMany({
    where: {
      category: CLIENT_PAYMENT_CATEGORY, direction: { in: ["ALACAK", "GELIR"] },
      clientId: { in: clients.map((c) => c.id) }, dueDate: { gte: rangeStart, lt: rangeEnd },
    },
    select: { clientId: true, dueDate: true },
  });

  for (const c of clients) {
    if (c.billingPeriod && c.billingPeriod !== "AYLIK") continue;
    const fee = parseTry(c.billingAmount);
    if (!fee || !c.paymentDay) continue;
    const slots = c.paymentDay2 ? [c.paymentDay, c.paymentDay2] : [c.paymentDay];
    const share = Math.round(fee / slots.length);

    for (const { y: yy, m: mm } of months) {
      const existing = existingAll.filter((e) => e.clientId === c.id && ymd(e.dueDate).startsWith(key(yy, mm)));
      // Tek dilimli firmada o ay herhangi bir kayıt yeterli; iki dilimlide dilim sayısı kadar kayıt beklenir.
      if (existing.length >= slots.length) continue;
      const takenDays = existing.map((e) => Number(ymd(e.dueDate).slice(8)));
      for (const [i, day] of slots.entries()) {
        if (existing.length && slots.length === 1) break;
        if (takenDays.some((d) => Math.abs(d - day) <= 3)) continue;
        const dd = Math.min(day, 28);
        // Vadesi bugünden önce olan dilim geriye dönük açılmaz (yeni müşteriye sahte "gecikmede" çıkmasın).
        if (`${key(yy, mm)}-${String(dd).padStart(2, "0")}` < ymd(now)) continue;
        const data = {
          title: `${c.name} ${TR_MONTHS[mm - 1]} Ödemesi${slots.length > 1 ? ` (${i + 1}/${slots.length})` : ""}`,
          amount: share, direction: "ALACAK" as const, category: CLIENT_PAYMENT_CATEGORY, status: "BEKLIYOR" as const,
          dueDate: new Date(`${key(yy, mm)}-${String(dd).padStart(2, "0")}T10:00:00+03:00`),
          clientId: c.id,
        };
        planned.push({ title: data.title, amount: share, dueDate: ymd(data.dueDate) });
        if (!opts.dryRun) await prisma.kasaEntry.create({ data });
        created++;
      }
    }
  }
  return { created, planned };
}


/**
 * Çalışana yapılan ödemeler (v3.6.0): Finans'ta "Çalışan" seçilerek girilen Kasa kayıtları +
 * eski personel ödemeleri (PayrollPayment, Ağustos–Eylül 2026). Admin çalışan detayında ve
 * çalışanın kendi "Ödemelerim" ekranında salt okunur gösterilir.
 */
export async function listEmployeePayments(userId: string) {
  const [kasa, old] = await Promise.all([
    prisma.kasaEntry.findMany({
      where: { employeeId: userId, deletedAt: null },
      orderBy: { dueDate: "desc" },
      select: { id: true, title: true, amount: true, status: true, dueDate: true, paidAt: true },
    }),
    prisma.payrollPayment.findMany({ where: { userId }, orderBy: { date: "desc" } }),
  ]);
  return [
    ...kasa.map((k) => ({
      id: k.id, date: (k.paidAt ?? k.dueDate).toISOString(), title: k.title, amount: Number(k.amount),
      status: k.status, source: "kasa" as const,
    })),
    ...old.map((p) => ({
      id: p.id, date: p.date.toISOString(),
      title: p.kind === "AVANS" ? `Avans${p.description ? ` — ${p.description}` : ""}` : `Dönem ödemesi${p.periodLabel ? ` — ${p.periodLabel}` : ""}`,
      amount: parseTry(p.amount), status: "ODENDI" as const, source: "eski" as const,
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Firmanın ücreti veya ödeme günü değişince (ör. yeni yıl zammı) bekleyen GELECEK alacakları günceller.
 * Güvenlik kuralları — "bir şey yanlış gitmesin":
 *  - Yalnızca BEKLİYOR + vadesi bugün veya sonrası + "Müşteri Ödemesi" kayıtları.
 *  - Tutar, ESKİ standart dilim tutarına eşitse yeni dilim tutarına çekilir. Farklı tutarlı (kısmi kalan,
 *    elle girilmiş özel tutar) kayıtlara dokunulmaz, "atlananlar" listesinde döner.
 *  - Ödeme günü değiştiyse ve dilim sayısı aynıysa vade aynı ay içinde yeni güne taşınır.
 *  - Dilim sayısı değiştiyse (tek ↔ iki ödeme günü) mevcut kayıtlar değişmez, atlananlara yazılır.
 *  - Ödenmiş ve geçmiş/gecikmiş kayıtlar asla değişmez.
 * Değişiklikten sonra eksik aylar ensureClientReceivables ile yeni tutarla açılır.
 */
export async function repriceFutureReceivables(
  clientId: string,
  before: { fee: number; days: number[] },
  after: { fee: number; days: number[] },
  opts: { dryRun?: boolean } = {},
) {
  const updated: string[] = [];
  const skipped: string[] = [];
  if (!before.fee || !after.fee || !after.days.length) return { updated, skipped };
  const sameSlots = before.days.length === after.days.length || !before.days.length;
  const oldShare = Math.round(before.fee / Math.max(before.days.length, 1));
  const newShare = Math.round(after.fee / after.days.length);
  const todayStart = new Date(`${ymd(new Date())}T00:00:00+03:00`);

  const rows = await prisma.kasaEntry.findMany({
    where: { ...kasaWhere(clientId), status: "BEKLIYOR", dueDate: { gte: todayStart } },
    orderBy: { dueDate: "asc" },
  });
  for (const r of rows) {
    const amount = Number(r.amount);
    if (!sameSlots || Math.abs(amount - oldShare) > 0.5) { skipped.push(`${r.title} (${fmtTry(amount)})`); continue; }
    let dueDate = r.dueDate;
    if (before.days.length && before.days.join(",") !== after.days.join(",")) {
      const d = Number(ymd(r.dueDate).slice(8));
      const sortedOld = [...before.days].sort((a, b) => a - b);
      const slot = sortedOld.reduce((best, x, i) => (Math.abs(x - d) < Math.abs(sortedOld[best] - d) ? i : best), 0);
      const newDay = Math.min([...after.days].sort((a, b) => a - b)[slot], 28);
      dueDate = new Date(`${ymd(r.dueDate).slice(0, 8)}${String(newDay).padStart(2, "0")}T10:00:00+03:00`);
    }
    if (amount === newShare && dueDate.getTime() === r.dueDate.getTime()) continue;
    if (!opts.dryRun) await prisma.kasaEntry.update({ where: { id: r.id }, data: { amount: newShare, dueDate } });
    updated.push(`${r.title}: ${fmtTry(amount)} → ${fmtTry(newShare)}${dueDate !== r.dueDate ? ` · vade ${ymd(dueDate)}` : ""}`);
  }
  return { updated, skipped };
}
