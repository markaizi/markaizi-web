import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { listEmployeePayments } from "@/lib/clientPayments";
import AdminEmployeeDetail, { type EmployeeDetailData } from "@/components/AdminEmployeeDetail";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Çalışan — Admin",
};

export default async function AdminEmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/musteri/giris?next=/musteri/admin/calisanlar");
  if (session.role !== "ADMIN") redirect("/musteri/admin");

  const { id } = await params;
  const [employee, allClients] = await Promise.all([
    prisma.user.findFirst({
      where: { id, role: "EMPLOYEE" },
      include: { assignments: { include: { client: { select: { id: true, slug: true, name: true } } } } },
    }),
    prisma.client.findMany({ where: { active: true }, select: { id: true, slug: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  if (!employee) notFound();

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
    adminCompleteCardsScope: employee.adminCompleteCardsScope,
    // Maaş / avans: Finans'tan girilir, burada salt okunur (v3.6.0)
    payments: await listEmployeePayments(employee.id),
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
