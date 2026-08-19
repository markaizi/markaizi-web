import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getInvoiceStage } from "@/lib/invoiceStage";
import AdminClientDetail, { type ClientDetailData } from "@/components/AdminClientDetail";

export const dynamic = "force-dynamic";

function parseAmount(raw: string | null): number {
  if (!raw) return 0;
  const digits = raw.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

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
        invoices: { orderBy: { id: "desc" } },
        contentItems: { orderBy: { scheduledDate: "desc" } },
        users: { where: { role: "CLIENT" }, select: { id: true, username: true, name: true, email: true } },
        adReports: { orderBy: { publishedAt: "desc" } },
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

  // Kârlılık: bu firmanın kartlarına bağlı, fiyatlandırılmış iş kayıtları toplamı.
  const [pricedLogs, unpricedWorkLogCount] = await Promise.all([
    prisma.workLog.findMany({
      where: { amount: { not: null }, workflowCard: { clientId: client.id } },
      select: { amount: true },
    }),
    prisma.workLog.count({
      where: { amount: null, workflowCard: { clientId: client.id } },
    }),
  ]);
  const laborCost = pricedLogs.reduce((s, l) => s + parseAmount(l.amount), 0);

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
    dailyMetaSpend: client.dailyMetaSpend ?? "",
    dailyGoogleSpend: client.dailyGoogleSpend ?? "",
    active: client.active,
    updates: client.updates.map((u) => ({
      id: u.id,
      kind: u.kind,
      text: u.text,
      date: u.date.toISOString().split("T")[0],
    })),
    invoices: client.invoices.map((i) => ({
      id: i.id,
      period: i.period,
      amount: i.amount,
      // Ödendi/ödenmedi saklanan durum; görünen aşama vade tarihinden hesaplanır.
      paid: i.status === "ODENDI",
      stage: getInvoiceStage(i),
      dueDate: i.dueDate?.toISOString().split("T")[0] ?? null,
    })),
    contentItems: client.contentItems.map((ci) => ({
      id: ci.id,
      title: ci.title,
      description: ci.description ?? "",
      scheduledDate: ci.scheduledDate.toISOString().split("T")[0],
      status: ci.status,
      publishedAt: ci.publishedAt?.toISOString().split("T")[0] ?? null,
    })),
    users: client.users.map((u) => ({ ...u, username: u.username ?? null })),
    laborCost,
    unpricedWorkLogCount,
    adReports: client.adReports.map((r) => ({
      id: r.id,
      platform: r.platform,
      month: r.month,
      spend: r.spend ?? "",
      impressions: r.impressions ?? "",
      clicks: r.clicks ?? "",
      summary: r.summary ?? "",
      publishedAt: r.publishedAt.toISOString(),
    })),
  };

  return <AdminClientDetail data={data} unreadNoteCount={unreadCount} />;
}
