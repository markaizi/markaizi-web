import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CampaignStatus, InvoiceStatus } from "@prisma/client";
import AdminPanel, { type AdminClientSummary } from "@/components/AdminPanel";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Admin Paneli — markaizi",
};

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/musteri/giris?next=/musteri/admin");
  if (session.role !== "ADMIN") {
    redirect(session.slug ? `/musteri/${session.slug}` : "/musteri/giris");
  }

  const today = new Date();

  const [rows, unreadNotes, employeeCount] = await Promise.all([
    prisma.client.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
      include: {
        campaigns: { select: { platform: true, status: true } },
        invoices: { select: { status: true, dueDate: true } },
      },
    }),
    prisma.note.groupBy({
      by: ["clientId"],
      where: {
        authorId: { not: session.uid },
        reads: { none: { userId: session.uid } },
      },
      _count: { id: true },
    }),
    prisma.user.count({ where: { role: "EMPLOYEE", active: true } }),
  ]);

  const unreadMap = new Map(unreadNotes.map((u) => [u.clientId, u._count.id]));

  const clients: AdminClientSummary[] = rows.map((c) => {
    const pendingInvoices = c.invoices.filter(i => i.status === InvoiceStatus.BEKLIYOR);
    const overdueInvoices = pendingInvoices.filter(i => i.dueDate && new Date(i.dueDate) < today);
    return {
      slug: c.slug,
      name: c.name,
      package: c.package,
      activeCampaignCount: c.campaigns.filter(x => x.status === CampaignStatus.AKTIF).length,
      totalCampaignCount: c.campaigns.length,
      pendingInvoiceCount: pendingInvoices.length,
      overdueInvoiceCount: overdueInvoices.length,
      unreadNoteCount: unreadMap.get(c.id) ?? 0,
    };
  });

  return <AdminPanel clients={clients} adminName={session.name} employeeCount={employeeCount} />;
}
