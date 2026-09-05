/**
 * Ekonomi ekranı ve tarih aralığı raporu ortak yardımcıları — tutarlar
 * (Transaction/Invoice) serbest metin olarak tutulduğu için toplama işlemi
 * her zaman uygulama katmanında yapılır (bkz. Transaction modeli notu).
 */
import { prisma } from "@/lib/db";

export function parseAmount(raw: string | null | undefined): number {
  if (!raw) return 0;
  const digits = raw.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

export function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function monthLabel(d: Date): string {
  return d.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });
}

export interface EconomyFeedItem {
  id: string;
  type: "GELIR" | "GIDER";
  amount: number;
  description: string;
  date: string;
  category: string | null;
  deletable: boolean;
}

/**
 * Verilen [start, end] aralığındaki ödenen faturaları + elle/otomatik girilen
 * kayıtları birleştirip tek bir hareket listesi + toplamlar döner. Hem "Bu Ayın
 * Hareketleri" hem tarih aralığı raporu hem aylık geçmiş drill-down'ı bunu kullanır.
 */
export async function getRangeSummary(start: Date, end: Date) {
  const [paidInvoices, transactions] = await Promise.all([
    prisma.invoice.findMany({
      where: { paidAt: { gte: start, lte: end } },
      select: { id: true, amount: true, paidAt: true, period: true, client: { select: { name: true } } },
      orderBy: { paidAt: "desc" },
    }),
    prisma.transaction.findMany({
      where: { date: { gte: start, lte: end } },
      select: { id: true, type: true, amount: true, description: true, date: true, category: true, payrollPayment: { select: { id: true } } },
      orderBy: { date: "desc" },
    }),
  ]);

  const feed: EconomyFeedItem[] = [
    ...paidInvoices.map((i) => ({
      id: `inv-${i.id}`,
      type: "GELIR" as const,
      amount: parseAmount(i.amount),
      description: `${i.client.name} — ${i.period}`,
      date: i.paidAt!.toISOString(),
      category: null,
      deletable: false,
    })),
    ...transactions.map((t) => ({
      id: t.id,
      type: t.type as "GELIR" | "GIDER",
      amount: parseAmount(t.amount),
      description: t.description,
      date: t.date.toISOString(),
      category: t.category,
      deletable: !t.payrollPayment,
    })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1));

  const gelir = feed.filter((f) => f.type === "GELIR").reduce((s, f) => s + f.amount, 0);
  const gider = feed.filter((f) => f.type === "GIDER").reduce((s, f) => s + f.amount, 0);

  return { feed, gelir, gider, net: gelir - gider };
}

/** Tüm zamanların toplam gelir/gider/net rakamı — "genel kasada kalan" için. */
export async function getAllTimeSummary() {
  const [paidInvoices, transactions] = await Promise.all([
    prisma.invoice.findMany({ where: { paidAt: { not: null } }, select: { amount: true } }),
    prisma.transaction.findMany({ select: { type: true, amount: true } }),
  ]);

  let gelir = paidInvoices.reduce((s, i) => s + parseAmount(i.amount), 0);
  let gider = 0;
  for (const t of transactions) {
    if (t.type === "GELIR") gelir += parseAmount(t.amount);
    else gider += parseAmount(t.amount);
  }
  return { gelir, gider, net: gelir - gider };
}
