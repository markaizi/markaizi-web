import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import AdminEmployeePanel, { type EmployeeSummary } from "@/components/AdminEmployeePanel";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Çalışanlar — Admin",
};

export default async function CalisanlarPage() {
  const session = await getSession();
  if (!session) redirect("/musteri/giris?next=/musteri/admin/calisanlar");
  if (session.role !== "ADMIN") redirect("/musteri/admin");

  const employees = await prisma.user.findMany({
    where: { role: "EMPLOYEE", active: true },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      workflowAccess: true,
      _count: { select: { assignments: true, workLogs: { where: { amount: null } } } },
    },
    orderBy: { name: "asc" },
  });

  const data: EmployeeSummary[] = employees.map((e) => ({
    id: e.id,
    username: e.username ?? "",
    name: e.name,
    email: e.email,
    assignedCount: e._count.assignments,
    workflowAccess: e.workflowAccess,
    unpricedLogCount: e._count.workLogs,
  }));

  return <AdminEmployeePanel employees={data} />;
}
