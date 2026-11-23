import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { listClientPayments } from "@/lib/clientPayments";
import AdminClientDetail, { type ClientDetailData } from "@/components/AdminClientDetail";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  return {
    robots: { index: false, follow: false },
    title: `${slug} — Admin Yönetim`,
  };
}

export default async function AdminClientPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/musteri/giris?next=/musteri/admin");
  if (session.role !== "ADMIN") redirect("/musteri/admin");

  const { slug } = await params;

  const [client, unreadCount] = await Promise.all([
    prisma.client.findUnique({
      where: { slug },
      include: {
        updates: { orderBy: { date: "desc" } },
        contentItems: { orderBy: { scheduledDate: "desc" } },
        users: { where: { role: "CLIENT" }, select: { id: true, username: true, name: true, email: true } },
        // pdfData bilerek seçilmiyor — büyük binary alanı sayfa prop'larına taşımamak için;
        // varlığı yalnızca pdfFilename'in dolu olup olmadığından anlaşılır.
        adReports: {
          orderBy: { publishedAt: "desc" },
          select: {
            id: true, platform: true, month: true, spend: true, impressions: true,
            clicks: true, messages: true, summary: true, publishedAt: true, pdfFilename: true,
          },
        },
      },
    }),
    prisma.note.count({
      where: {
        client: { slug },
        authorId: { not: session.uid },
        reads: { none: { userId: session.uid } },
      },
    }),
  ]);

  if (!client) notFound();
  const [payments, agendaVisits, agendaTasks, agendaNotes] = await Promise.all([
    listClientPayments(client.id, client.overdueGraceDays),
    prisma.agendaEvent.findMany({
      where: { clientId: client.id, status: { not: "IPTAL" } }, orderBy: { startAt: "desc" }, take: 40,
      select: { id: true, title: true, startAt: true, status: true },
    }),
    prisma.agendaTask.findMany({
      where: { clientId: client.id, deletedAt: null }, orderBy: [{ status: "asc" }, { sortOrder: "asc" }],
      select: { id: true, title: true, status: true, priority: true, visibleToClient: true },
    }),
    prisma.agendaNote.findMany({
      where: { clientId: client.id, deletedAt: null }, orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
      select: { id: true, kind: true, title: true, content: true, visibleToClient: true },
    }),
  ]);

  const data: ClientDetailData = {
    id: client.id,
    slug: client.slug,
    name: client.name,
    invoiceNote: client.invoiceNote ?? "",
    contactPerson: client.contactPerson ?? "",
    contactEmail: client.contactEmail ?? "",
    contactPhone: client.contactPhone ?? "",
    billingAmount: client.billingAmount ?? "",
    billingPeriod: client.billingPeriod ?? "",
    billingIntervalDays: client.billingIntervalDays ?? null,
    overdueGraceDays: client.overdueGraceDays ?? null,
    paymentDay: client.paymentDay ?? null,
    paymentDay2: client.paymentDay2 ?? null,
    dailyMetaSpend: client.dailyMetaSpend ?? "",
    dailyGoogleSpend: client.dailyGoogleSpend ?? "",
    active: client.active,
    updates: client.updates.map((u) => ({
      id: u.id,
      kind: u.kind,
      text: u.text,
      date: u.date.toISOString().split("T")[0],
    })),
    // Kaynak: Kasa (1 Ekim 2026 sonrası) + eski fatura arşivi — bkz. src/lib/clientPayments.ts
    invoices: payments.map((p) => ({
      id: p.id, period: p.period, amount: p.amount, paid: p.paid, stage: p.stage, dueDate: p.dueDate,
    })),
    agenda: {
      visits: agendaVisits.map((v) => ({ ...v, startAt: v.startAt.toISOString() })).sort((a, b) => a.startAt.localeCompare(b.startAt)),
      tasks: agendaTasks,
      notes: agendaNotes,
    },
    contentItems: client.contentItems.map((ci) => ({
      id: ci.id,
      title: ci.title,
      description: ci.description ?? "",
      scheduledDate: ci.scheduledDate.toISOString().split("T")[0],
      status: ci.status,
      publishedAt: ci.publishedAt?.toISOString().split("T")[0] ?? null,
    })),
    users: client.users.map((u) => ({ ...u, username: u.username ?? null })),
    adReports: client.adReports.map((r) => ({
      id: r.id,
      platform: r.platform,
      month: r.month,
      spend: r.spend ?? "",
      impressions: r.impressions ?? "",
      clicks: r.clicks ?? "",
      messages: r.messages ?? "",
      summary: r.summary ?? "",
      publishedAt: r.publishedAt.toISOString(),
      hasPdf: !!r.pdfFilename,
      pdfFilename: r.pdfFilename ?? "",
    })),
  };

  return <AdminClientDetail data={data} unreadNoteCount={unreadCount} />;
}
