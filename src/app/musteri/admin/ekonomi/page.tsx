import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import EkonomiView, { type EkonomiData } from "@/components/EkonomiView";
import { getInvoiceStage } from "@/lib/invoiceStage";
import { parseAmount, monthKey, monthLabel, getAllTimeSummary } from "@/lib/economy";
import { generateDueRecurringExpenses } from "@/lib/economyRecurring";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Ekonomi — Admin",
};

const HISTORY_MONTHS = 12;

export default async function EkonomiPage() {
  const session = await getSession();
  if (!session) redirect("/musteri/giris?next=/musteri/admin/ekonomi");
  const isAdmin = session.role === "ADMIN";
  if (!isAdmin) {
    if (session.role !== "EMPLOYEE") redirect("/musteri/giris");
    const me = await prisma.user.findUnique({ where: { id: session.uid }, select: { adminCanViewEconomy: true } });
    if (!me?.adminCanViewEconomy) redirect("/musteri/calisan");
  }

  // Düzenli giderlerin otomatik üretimi yalnızca admin görünümünde tetiklenir —
  // salt okunur çalışan erişimi hiçbir yazma işlemine yol açmamalı.
  if (isAdmin) {
    await generateDueRecurringExpenses().catch((e) => console.error("[ekonomi] düzenli gider üretimi başarısız:", e));
  }

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  const historyStart = new Date(now.getFullYear(), now.getMonth() - (HISTORY_MONTHS - 1), 1, 0, 0, 0, 0);

  const [paidInvoices, transactions, pendingInvoices, allTime, recurringExpenses, creditCards] = await Promise.all([
    prisma.invoice.findMany({
      where: { paidAt: { gte: historyStart } },
      select: { id: true, amount: true, paidAt: true, period: true, client: { select: { name: true, slug: true } } },
      orderBy: { paidAt: "desc" },
    }),
    prisma.transaction.findMany({
      where: { date: { gte: historyStart } },
      select: { id: true, type: true, amount: true, description: true, date: true, category: true, payrollPayment: { select: { id: true } } },
      orderBy: { date: "desc" },
    }),
    prisma.invoice.findMany({
      where: { status: { not: "ODENDI" } },
      select: { amount: true, dueDate: true, status: true },
    }),
    getAllTimeSummary(),
    prisma.recurringExpense.findMany({ orderBy: { dayOfMonth: "asc" } }),
    prisma.creditCard.findMany({ where: { active: true }, orderBy: { createdAt: "asc" } }),
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

  // Ödenmemiş faturalar vade tarihine göre üç gruba ayrılır — böylece vadesi
  // henüz gelmemiş faturalar "tahsil edilecek" rakamını şişirmez.
  const faturaOzet = {
    gunuGelmedi: { adet: 0, toplam: 0 },
    bekliyor: { adet: 0, toplam: 0 },
    gecikmede: { adet: 0, toplam: 0 },
  };
  for (const inv of pendingInvoices) {
    const stage = getInvoiceStage(inv);
    const bucket =
      stage === "GUNU_GELMEDI" ? faturaOzet.gunuGelmedi
      : stage === "GECIKMEDI" ? faturaOzet.gecikmede
      : faturaOzet.bekliyor;
    bucket.adet += 1;
    bucket.toplam += parseAmount(inv.amount);
  }
  // Şimdi tahsil edilmesi gerekenler: vadesi gelmiş (bekliyor) + gecikmiş.
  const bekleyenFaturaToplam = faturaOzet.bekliyor.toplam + faturaOzet.gecikmede.toplam;
  const gecikmisFaturaToplam = faturaOzet.gecikmede.toplam;

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
        category: null as string | null,
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
        category: t.category,
        deletable: !t.payrollPayment,
      })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1));

  const data: EkonomiData = {
    currentMonthLabel: monthLabel(now),
    currentMonth: { gelir: currentMonth.gelir, gider: currentMonth.gider, net: currentMonth.net },
    allTime,
    bekleyenFaturaToplam,
    gecikmisFaturaToplam,
    faturaOzet,
    monthlyHistory,
    feed,
    recurringExpenses: recurringExpenses.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      amount: r.amount,
      dayOfMonth: r.dayOfMonth,
      active: r.active,
    })),
    creditCards: creditCards.map((c) => ({
      id: c.id,
      name: c.name,
      bankName: c.bankName,
      limitAmount: parseAmount(c.limitAmount),
      currentDebt: parseAmount(c.currentDebt),
      statementDay: c.statementDay,
      dueDay: c.dueDay,
      note: c.note,
    })),
  };

  return <EkonomiView data={data} readOnly={!isAdmin} backHref={isAdmin ? "/musteri/admin" : "/musteri/calisan"} />;
}
