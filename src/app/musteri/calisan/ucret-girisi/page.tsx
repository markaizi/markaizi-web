import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getCurrentPeriod } from "@/lib/workLogPeriods";
import UcretGirisiView, { type EmployeeWorklogs } from "@/components/UcretGirisiView";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Ücret Girişi — markaizi",
};

export default async function UcretGirisiPage() {
  const session = await getSession();
  if (!session) redirect("/musteri/giris?next=/musteri/calisan/ucret-girisi");
  if (session.role === "CLIENT") redirect(session.slug ? `/musteri/${session.slug}` : "/musteri/giris");
  if (session.role === "ADMIN") redirect("/musteri/admin");

  const me = await prisma.user.findUnique({ where: { id: session.uid }, select: { adminCanPriceWorklogs: true } });
  if (!me?.adminCanPriceWorklogs) redirect("/musteri/calisan");

  const employees = await prisma.user.findMany({
    where: { role: "EMPLOYEE", active: true },
    select: { id: true, name: true, paymentDay: true },
    orderBy: { name: "asc" },
  });

  const allLogs = await prisma.workLog.findMany({
    where: { userId: { in: employees.map((e) => e.id) } },
    orderBy: { date: "desc" },
  });

  const data: EmployeeWorklogs[] = employees.map((e) => {
    const period = getCurrentPeriod(e.paymentDay);
    const logs = allLogs.filter((l) => l.userId === e.id && l.date >= period.start && l.date <= period.end);
    return {
      userId: e.id,
      name: e.name,
      periodLabel: period.label,
      logs: logs.map((l) => ({
        id: l.id,
        date: l.date.toISOString(),
        description: l.description,
        amount: l.amount,
        adminNote: l.adminNote,
      })),
    };
  });

  return <UcretGirisiView employees={data} />;
}
