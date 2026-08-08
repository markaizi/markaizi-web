import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import EkonomiView, { type EkonomiData } from "@/components/EkonomiView";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Ekonomi — Admin",
};

function parseAmount(raw: string | null | undefined): number {
  if (!raw) return 0;
  const digits = raw.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(d: Date): string {
  return d.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });
}

const HISTORY_MONTHS = 12;

export default async function EkonomiPage() {
  const session = await getSession();
  if (!session) redirect("/musteri/giris?next=/musteri/admin/ekonomi");
  if (session.role !== "ADMIN") redirect("/musteri/admin");

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  const historyStart = new Date(now.getFullYear(), now.getMonth() - (HISTORY_MONTHS - 1), 1, 0, 0, 0, 0);

  const [paidInvoices, transactions, pendingInvoices] = await Promise.all([
    prisma.invoice.findMany({
      where: { paidAt: { gte: historyStart } },
      select: { id: true, amount: true, paidAt: true, period: true, client: { select: { name: true, slug: true } } },
      orderBy: { paidAt: "desc" },
    }),
    prisma.transaction.findMany({
      where: { date: { gte: historyStart } },
      select: { id: true, type: true, amount: true, description: true, date: true, payrollPayment: { select: { id: true } } },
      orderBy: { date: "desc" },
    }),
    prisma.invoice.findMany({
      where: { status: { in: ["BEKLIYOR", "GUNU_GELMEDI"] } },
      select: { amount: true },
    }),
  ]);

  // Aylık geçmiş — son HISTORY_MONTHS ay için gelir/gider toplamı
  const monthBuckets = new Map<string, { label: string; gelir: number; gider: number }>();
  for (let i = 0; i < HISTORY_MONTHS; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthBuckets.set(monthKey(d), { label: monthLabel(d), gelir: 0, gider: 0 });
  }
  for (const inv of paidInvoices) {
    if (!inv.paidAt) continue;
    const b = monthBuckets.get(monthKey(inv.paidAt));
    if (b) b.gelir += parseAmount(inv.amount);
  }
  for (const tx of transactions) {
    const b = monthBuckets.get(monthKey(tx.date));
    if (!b) continue;
    if (tx.type === "GELIR") b.gelir += parseAmount(tx.amount);
    else b.gider += parseAmount(tx.amount);
  }
  const monthlyHistory = Array.from(monthBuckets.entries())
    .map(([key, v]) => ({ key, label: v.label, gelir: v.gelir, gider: v.gider, net: v.gelir - v.gider }))
    .sort((a, b) => (a.key < b.key ? 1 : -1));

  const currentMonth = monthlyHistory[0] ?? { gelir: 0, gider: 0, net: 0 };
  const bekleyenFaturaToplam = pendingInvoices.reduce((s, i) => s + parseAmount(i.amount), 0);

  // Bu ayın birleşik hareket listesi (ödenen faturalar + transaction'lar)
  const feed = [
    ...paidInvoices
      .filter((i) => i.paidAt && i.paidAt >= monthStart && i.paidAt <= monthEnd)
      .map((i) => ({
        id: `inv-${i.id}`,
        type: "GELIR" as const,
        amount: parseAmount(i.amount),
        description: `${i.client.name} — ${i.period}`,
        date: i.paidAt!.toISOString(),
        deletable: false,
      })),
    ...transactions
      .filter((t) => t.date >= monthStart && t.date <= monthEnd)
      .map((t) => ({
        id: t.id,
        type: t.type,
        amount: parseAmount(t.amount),
        description: t.description,
        date: t.date.toISOString(),
        deletable: !t.payrollPayment,
      })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1));

  const data: EkonomiData = {
    currentMonthLabel: monthLabel(now),
    currentMonth: { gelir: currentMonth.gelir, gider: currentMonth.gider, net: currentMonth.net },
    bekleyenFaturaToplam,
    monthlyHistory,
    feed,
  };

  return <EkonomiView data={data} />;
}
