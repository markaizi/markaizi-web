import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import AdminPanel, { type AdminClientSummary } from "@/components/AdminPanel";
import { getInvoiceStage } from "@/lib/invoiceStage";

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

  const [rows, unreadNotes, employeeCount, unpricedLogsRaw, unreadSubmissionCount, assignmentRequestsRaw, unreadStaffFeedbackCount] = await Promise.all([
    prisma.client.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
      include: {
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
    prisma.workLog.findMany({
      where: { amount: null },
      select: { userId: true, user: { select: { name: true } } },
    }),
    prisma.submission.count({ where: { read: false } }),
    prisma.workflowCard.findMany({
      where: { requestedById: { not: null }, archivedAt: null },
      select: {
        id: true,
        title: true,
        requestedBy: { select: { name: true } },
        assignee: { select: { name: true } },
      },
      orderBy: { requestedAt: "asc" },
    }),
    prisma.staffFeedback.count({ where: { status: "BEKLIYOR" } }),
  ]);

  const unreadMap = new Map(unreadNotes.map((u) => [u.clientId, u._count.id]));

  const unpricedMap = new Map<string, { name: string; count: number }>();
  for (const log of unpricedLogsRaw) {
    const cur = unpricedMap.get(log.userId);
    if (cur) cur.count++;
    else unpricedMap.set(log.userId, { name: log.user.name, count: 1 });
  }
  const unpricedWorkLogs = Array.from(unpricedMap.entries()).map(([id, v]) => ({ id, name: v.name, count: v.count }));

  const assignmentRequests = assignmentRequestsRaw.map((c) => ({
    id: c.id,
    cardTitle: c.title,
    requestedByName: c.requestedBy?.name ?? "—",
    assigneeName: c.assignee?.name ?? "—",
  }));

  const clients: AdminClientSummary[] = rows.map((c) => {
    // Aşama vade tarihinden hesaplanır. Rozetlerde yalnızca aksiyon gereken
    // faturalar sayılır — vadesi gelmemiş olanlar sayıya girmez.
    const stages = c.invoices.map((i) => getInvoiceStage(i, today));
    const pendingInvoices = stages.filter((s) => s === "BEKLIYOR" || s === "GECIKMEDI");
    const overdueInvoices = stages.filter((s) => s === "GECIKMEDI");
    return {
      slug: c.slug,
      name: c.name,
      pendingInvoiceCount: pendingInvoices.length,
      overdueInvoiceCount: overdueInvoices.length,
      unreadNoteCount: unreadMap.get(c.id) ?? 0,
    };
  });

  return (
    <AdminPanel
      clients={clients}
      adminName={session.name}
      employeeCount={employeeCount}
      unpricedWorkLogs={unpricedWorkLogs}
      unreadSubmissionCount={unreadSubmissionCount}
      assignmentRequests={assignmentRequests}
      unreadStaffFeedbackCount={unreadStaffFeedbackCount}
    />
  );
}
