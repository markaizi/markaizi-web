import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { listClientPayments } from "@/lib/clientPayments";
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
  const [assignment, unreadCount] = await Promise.all([
    prisma.assignment.findFirst({ where: { userId: session.uid, client: { slug } } }),
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
      // Yetkisiz veri sayfaya hiç gönderilmez (RSC payload'ı sayfa kaynağından okunabilir).
      updates: assignment.canViewUpdates || assignment.canManageUpdates ? { orderBy: { date: "desc" }, take: 20 } : false,
      contentItems: assignment.canViewContent || assignment.canManageContent ? { orderBy: { scheduledDate: "desc" } } : false,
      adReports: {
        orderBy: { publishedAt: "desc" },
        select: {
          id: true, platform: true, month: true, spend: true, impressions: true,
          clicks: true, messages: true, summary: true, publishedAt: true, pdfFilename: true,
        },
      },
    },
  });

  if (!client) notFound();
  const payments = assignment.canViewInvoices ? await listClientPayments(client.id, client.overdueGraceDays) : [];

  const data: EmployeeClientData = {
    slug: client.slug,
    name: client.name,
    perms: {
      canViewContent: assignment.canViewContent,
      canManageContent: assignment.canManageContent,
      canViewUpdates: assignment.canViewUpdates,
      canManageUpdates: assignment.canManageUpdates,
      canViewInvoices: assignment.canViewInvoices,
      // v3.10.0: ödemeler Kasa kaydı olduğu için çalışan düzenleyemez (yalnızca görüntüler).
      canManageInvoices: false,
    },
    updates: (client.updates ?? []).map((u) => ({
      id: u.id,
      kind: u.kind,
      text: u.text,
      date: u.date.toISOString().split("T")[0],
    })),
    contentItems: (client.contentItems ?? []).map((ci) => ({
      id: ci.id,
      title: ci.title,
      description: ci.description ?? "",
      scheduledDate: ci.scheduledDate.toISOString().split("T")[0],
      status: ci.status,
      publishedAt: ci.publishedAt?.toISOString().split("T")[0] ?? null,
    })),
    // Fatura görüntüleme yetkisi yoksa veri sayfaya hiç gönderilmez. Kaynak: Kasa (v3.5.0).
    invoices: payments.map((p) => ({
      id: p.id, period: p.period, amount: p.amount, paid: p.paid, stage: p.stage, dueDate: p.dueDate,
    })),
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

  return <EmployeeClientDetail data={data} unreadNoteCount={unreadCount} />;
}
