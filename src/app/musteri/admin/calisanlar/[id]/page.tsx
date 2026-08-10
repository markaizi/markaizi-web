import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getCurrentPeriod, groupByPeriod } from "@/lib/workLogPeriods";
import AdminEmployeeDetail, { type EmployeeDetailData } from "@/components/AdminEmployeeDetail";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Çalışan — Admin",
};

function parseAmount(raw: string | null): number {
  if (!raw) return 0;
  const digits = raw.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

export default async function AdminEmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/musteri/giris?next=/musteri/admin/calisanlar");
  if (session.role !== "ADMIN") redirect("/musteri/admin");

  const { id } = await params;

  const [employee, allClients] = await Promise.all([
    prisma.user.findFirst({
      where: { id, role: "EMPLOYEE" },
      include: {
        assignments: { include: { client: { select: { id: true, slug: true, name: true } } } },
      },
    }),
    prisma.client.findMany({
      where: { active: true },
      select: { id: true, slug: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!employee) notFound();

  const paymentDay = employee.paymentDay ?? null;
  const currentPeriod = getCurrentPeriod(paymentDay);

  const [currentLogs, olderLogsLight] = await Promise.all([
    prisma.workLog.findMany({
      where: { userId: employee.id, date: { gte: currentPeriod.start, lte: currentPeriod.end } },
      orderBy: { date: "desc" },
    }),
    prisma.workLog.findMany({
      where: { userId: employee.id, date: { lt: currentPeriod.start } },
      select: { id: true, date: true, amount: true },
    }),
  ]);

  const { archived } = groupByPeriod(olderLogsLight, (l) => l.date, paymentDay);

  const payrollPayments = await prisma.payrollPayment.findMany({
    where: { userId: employee.id },
    orderBy: { date: "desc" },
  });
  const donemOdemeleri = payrollPayments.filter((p) => p.kind === "DONEM_ODEMESI");
  const avanslar = payrollPayments.filter((p) => p.kind === "AVANS");

  const data: EmployeeDetailData = {
    id: employee.id,
    username: employee.username ?? "",
    name: employee.name,
    email: employee.email,
    workflowAccess: employee.workflowAccess,
    workflowCanCreateCards: employee.workflowCanCreateCards,
    workflowCanDragCards: employee.workflowCanDragCards,
    workflowCanWriteRevisionNote: employee.workflowCanWriteRevisionNote,
    workflowCanDeleteAnyCard: employee.workflowCanDeleteAnyCard,
    workflowCanManageColumns: employee.workflowCanManageColumns,
    workflowSeeAllCards: employee.workflowSeeAllCards,
    paymentDay,
    currentPeriod: { key: currentPeriod.key, label: currentPeriod.label },
    currentLogs: currentLogs.map((l) => ({
      id: l.id,
      date: l.date.toISOString(),
      description: l.description,
      amount: l.amount,
    })),
    archivedSummary: archived.map((a) => {
      const total = a.items.reduce((s, i) => s + parseAmount(i.amount), 0);
      const advancesInPeriod = avanslar
        .filter((av) => av.date >= a.period.start && av.date <= a.period.end)
        .reduce((s, av) => s + parseAmount(av.amount), 0);
      const paid = donemOdemeleri.some((p) => p.periodKey === a.period.key);
      return {
        key: a.period.key,
        label: a.period.label,
        count: a.items.length,
        total,
        advancesInPeriod,
        remaining: Math.max(0, total - advancesInPeriod),
        paid,
      };
    }),
    paymentHistory: payrollPayments.map((p) => ({
      id: p.id,
      kind: p.kind,
      amount: parseAmount(p.amount),
      description: p.description,
      periodLabel: p.periodLabel,
      date: p.date.toISOString(),
    })),
    assignments: employee.assignments.map((a) => ({
      id: a.id,
      client: a.client,
      canViewContent: a.canViewContent,
      canManageContent: a.canManageContent,
      canViewUpdates: a.canViewUpdates,
      canManageUpdates: a.canManageUpdates,
      canViewInvoices: a.canViewInvoices,
      canManageInvoices: a.canManageInvoices,
    })),
  };

  return <AdminEmployeeDetail employee={data} allClients={allClients} />;
}
