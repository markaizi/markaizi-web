import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getCurrentPeriod, groupByPeriod } from "@/lib/workLogPeriods";
import EmployeeWorkLogs from "@/components/EmployeeWorkLogs";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "İş Kayıtlarım — markaizi",
};

export default async function CalisanIsKayitlarimPage() {
  const session = await getSession();
  if (!session) redirect("/musteri/giris?next=/musteri/calisan/is-kayitlarim");
  if (session.role === "CLIENT") redirect(session.slug ? `/musteri/${session.slug}` : "/musteri/giris");
  if (session.role === "ADMIN") redirect("/musteri/admin");

  const user = await prisma.user.findUnique({ where: { id: session.uid }, select: { paymentDay: true } });
  const paymentDay = user?.paymentDay ?? null;
  const currentPeriod = getCurrentPeriod(paymentDay);

  const [currentLogs, olderLogsLight] = await Promise.all([
    prisma.workLog.findMany({
      where: { userId: session.uid, date: { gte: currentPeriod.start, lte: currentPeriod.end } },
      orderBy: { date: "desc" },
    }),
    prisma.workLog.findMany({
      where: { userId: session.uid, date: { lt: currentPeriod.start } },
      select: { id: true, date: true, amount: true },
    }),
  ]);

  const { archived } = groupByPeriod(olderLogsLight, (l) => l.date, paymentDay);

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
      archivedSummary={archived.map((a) => ({
        key: a.period.key,
        label: a.period.label,
        count: a.items.length,
        total: a.items.reduce((s, i) => {
          const digits = (i.amount ?? "").replace(/[^\d]/g, "");
          return s + (digits ? parseInt(digits, 10) : 0);
        }, 0),
      }))}
    />
  );
}
