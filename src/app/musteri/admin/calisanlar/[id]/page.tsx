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
    paymentDay,
    currentPeriod: { key: currentPeriod.key, label: currentPeriod.label },
    currentLogs: currentLogs.map((l) => ({
      id: l.id,
      date: l.date.toISOString(),
      description: l.description,
      amount: l.amount,
    })),
    archivedSummary: archived.map((a) => ({
      key: a.period.key,
      label: a.period.label,
      count: a.items.length,
      total: a.items.reduce((s, i) => {
        const digits = (i.amount ?? "").replace(/[^\d]/g, "");
        return s + (digits ? parseInt(digits, 10) : 0);
      }, 0),
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
