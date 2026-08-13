import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getCurrentPeriod, getPeriodForDate, groupByPeriod } from "@/lib/workLogPeriods";
import EmployeeWorkLogs from "@/components/EmployeeWorkLogs";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "İş Kayıtlarım — markaizi",
};

function parseAmount(raw: string | null): number {
  if (!raw) return 0;
  const digits = raw.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

export default async function CalisanIsKayitlarimPage() {
  const session = await getSession();
  if (!session) redirect("/musteri/giris?next=/musteri/calisan/is-kayitlarim");
  if (session.role === "CLIENT") redirect(session.slug ? `/musteri/${session.slug}` : "/musteri/giris");
  if (session.role === "ADMIN") redirect("/musteri/admin");

  const user = await prisma.user.findUnique({ where: { id: session.uid }, select: { paymentDay: true } });
  const paymentDay = user?.paymentDay ?? null;
  const currentPeriod = getCurrentPeriod(paymentDay);

  const [currentLogs, olderLogsLight, avansPayments] = await Promise.all([
    prisma.workLog.findMany({
      where: { userId: session.uid, date: { gte: currentPeriod.start, lte: currentPeriod.end } },
      orderBy: { date: "desc" },
    }),
    prisma.workLog.findMany({
      where: { userId: session.uid, date: { lt: currentPeriod.start } },
      select: { id: true, date: true, amount: true },
    }),
    prisma.payrollPayment.findMany({
      where: { userId: session.uid, kind: "AVANS", date: { lt: currentPeriod.start } },
      select: { date: true, amount: true },
    }),
  ]);

  const { archived } = groupByPeriod(olderLogsLight, (l) => l.date, paymentDay);
  const archivedKeys = new Set(archived.map((a) => a.period.key));

  // İş kayıtları sistemi kurulmadan önceki dönemlerde (hiç iş kaydı yok) verilen
  // avanslar, o dönemin tek kazancı sayılır ve arşiv listesinde ayrı bir dönem
  // olarak görünür — iş kaydı olan bir dönemde avans zaten dönem kapamasıyla
  // WorkLog toplamına dahil edildiği için burada tekrar sayılmaz.
  const avansOnlyPeriods = new Map<string, { label: string; total: number }>();
  for (const p of avansPayments) {
    const period = getPeriodForDate(p.date, paymentDay);
    if (archivedKeys.has(period.key)) continue;
    const cur = avansOnlyPeriods.get(period.key);
    const amt = parseAmount(p.amount);
    if (cur) cur.total += amt;
    else avansOnlyPeriods.set(period.key, { label: period.label, total: amt });
  }

  const archivedSummary = [
    ...archived.map((a) => ({
      key: a.period.key,
      label: a.period.label,
      count: a.items.length,
      total: a.items.reduce((s, i) => s + parseAmount(i.amount), 0),
    })),
    ...Array.from(avansOnlyPeriods.entries()).map(([key, v]) => ({
      key, label: v.label, count: 1, total: v.total,
    })),
  ].sort((a, b) => b.key.localeCompare(a.key));

  return (
    <EmployeeWorkLogs
      employeeName={session.name}
      paymentDay={paymentDay}
      currentLogs={currentLogs.map((l) => ({
        id: l.id,
        date: l.date.toISOString(),
        description: l.description,
        amount: l.amount,
      }))}
      archivedSummary={archivedSummary}
    />
  );
}
