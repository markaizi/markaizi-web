import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import EmployeeClientDetail, { type EmployeeClientData } from "@/components/EmployeeClientDetail";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  return { robots: { index: false, follow: false }, title: `${slug} — Çalışan` };
}

export default async function CalisanClientPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/musteri/giris");
  if (session.role === "CLIENT") redirect(session.slug ? `/musteri/${session.slug}` : "/musteri/giris");

  const { slug } = await params;

  if (session.role === "ADMIN") redirect(`/musteri/admin/${slug}`);

  // EMPLOYEE: sadece atanmış firmaya erişebilir
  const [assignment, employeeUser, unreadCount] = await Promise.all([
    prisma.assignment.findFirst({ where: { userId: session.uid, client: { slug } } }),
    prisma.user.findUnique({ where: { id: session.uid }, select: { canWriteNotes: true } }),
    prisma.note.count({
      where: {
        client: { slug },
        authorId: { not: session.uid },
        reads: { none: { userId: session.uid } },
      },
    }),
  ]);
  if (!assignment) redirect("/musteri/calisan");

  const client = await prisma.client.findUnique({
    where: { slug },
    include: {
      campaigns: { orderBy: [{ platform: "asc" }, { sortOrder: "asc" }] },
      updates: { orderBy: { date: "desc" }, take: 20 },
      contentItems: { orderBy: { scheduledDate: "desc" } },
      // Fatura görüntüleme yetkisi yoksa veri sayfaya hiç gönderilmez (sadece UI'da
      // gizlemek yetmez — sayfa kaynağından okunabilir olurdu).
      invoices: assignment.canViewInvoices ? { orderBy: { id: "desc" } } : false,
    },
  });

  if (!client) notFound();

  const data: EmployeeClientData = {
    slug: client.slug,
    name: client.name,
    canWriteNotes: employeeUser?.canWriteNotes ?? false,
    perms: {
      canViewCampaigns: assignment.canViewCampaigns,
      canManageCampaigns: assignment.canManageCampaigns,
      canViewContent: assignment.canViewContent,
      canManageContent: assignment.canManageContent,
      canViewUpdates: assignment.canViewUpdates,
      canManageUpdates: assignment.canManageUpdates,
      canViewInvoices: assignment.canViewInvoices,
      canManageInvoices: assignment.canManageInvoices,
    },
    campaigns: client.campaigns.map((c) => ({
      id: c.id,
      platform: c.platform,
      name: c.name,
      dailyBudget: c.dailyBudget,
      status: c.status,
      ongoing: c.ongoing,
    })),
    updates: client.updates.map((u) => ({
      id: u.id,
      kind: u.kind,
      text: u.text,
      date: u.date.toISOString().split("T")[0],
    })),
    contentItems: client.contentItems.map((ci) => ({
      id: ci.id,
      title: ci.title,
      description: ci.description ?? "",
      scheduledDate: ci.scheduledDate.toISOString().split("T")[0],
      status: ci.status,
      publishedAt: ci.publishedAt?.toISOString().split("T")[0] ?? null,
    })),
    invoices: (client.invoices ?? []).map((i) => ({
      id: i.id,
      period: i.period,
      amount: i.amount,
      status: i.status,
      dueDate: i.dueDate?.toISOString().split("T")[0] ?? null,
    })),
  };

  return <EmployeeClientDetail data={data} unreadNoteCount={unreadCount} />;
}
