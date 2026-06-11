import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import AdminEmployeePanel, { type EmployeeData } from "@/components/AdminEmployeePanel";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Çalışanlar — Admin",
};

export default async function CalisanlarPage() {
  const session = await getSession();
  if (!session) redirect("/musteri/giris?next=/musteri/admin/calisanlar");
  if (session.role !== "ADMIN") redirect("/musteri/admin");

  const [employees, clients] = await Promise.all([
    prisma.user.findMany({
      where: { role: "EMPLOYEE", active: true },
      include: {
        assignments: { include: { client: { select: { id: true, slug: true, name: true } } } },
      },
      orderBy: { name: "asc" },
    }),
    prisma.client.findMany({
      where: { active: true },
      select: { id: true, slug: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const data: EmployeeData[] = employees.map((e) => ({
    id: e.id,
    username: e.username ?? "",
    name: e.name,
    email: e.email,
    assignments: e.assignments.map((a) => ({
      id: a.id,
      client: a.client,
      canViewCampaigns: a.canViewCampaigns,
      canManageContent: a.canManageContent,
      canManageUpdates: a.canManageUpdates,
      canViewInvoices: a.canViewInvoices,
    })),
  }));

  return <AdminEmployeePanel employees={data} allClients={clients} />;
}
