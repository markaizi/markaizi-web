import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import AdminPanel, { type AdminClientSummary } from "@/components/AdminPanel";
import { ensureClientReceivables, pendingPaymentCounts } from "@/lib/clientPayments";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: { absolute: "Admin Paneli — markaizi" },
};

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/musteri/giris?next=/musteri/admin");
  if (session.role !== "ADMIN") {
    redirect(session.slug ? `/musteri/${session.slug}` : "/musteri/giris");
  }

  // Aylık müşteri alacaklarını (bu ay + gelecek ay) gerekiyorsa aç — Mİ Asistan'ın yaptığı gibi.
  await ensureClientReceivables().catch((e) => console.error("[finans] alacak üretimi başarısız:", e));

  const [rows, passiveRows, unreadNotes, employeeCount, unreadSubmissionCount, unreadStaffFeedbackCount] = await Promise.all([
    prisma.client.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
      select: { id: true, slug: true, name: true, overdueGraceDays: true },
    }),
    prisma.client.findMany({ where: { active: false }, orderBy: { name: "asc" }, select: { slug: true, name: true } }),
    prisma.note.groupBy({
      by: ["clientId"],
      where: {
        authorId: { not: session.uid },
        reads: { none: { userId: session.uid } },
      },
      _count: { id: true },
    }),
    prisma.user.count({ where: { role: "EMPLOYEE", active: true } }),
    prisma.submission.count({ where: { read: false } }),
    prisma.staffFeedback.count({ where: { status: "BEKLIYOR" } }),
  ]);

  const unreadMap = new Map(unreadNotes.map((u) => [u.clientId, u._count.id]));

  // Ödeme rozetleri Kasa'daki müşteri alacaklarından (v3.5.0, src/lib/clientPayments.ts).
  // Yalnızca aksiyon gereken (vadesi gelmiş / gecikmiş) alacaklar sayılır.
  const counts = await pendingPaymentCounts(rows);
  const clients: AdminClientSummary[] = rows.map((c) => ({
    slug: c.slug,
    name: c.name,
    pendingInvoiceCount: counts.get(c.id)?.pending ?? 0,
    overdueInvoiceCount: counts.get(c.id)?.overdue ?? 0,
    unreadNoteCount: unreadMap.get(c.id) ?? 0,
  }));

  return (
    <AdminPanel
      clients={clients}
      passiveClients={passiveRows}
      adminName={session.name}
      employeeCount={employeeCount}
      unreadSubmissionCount={unreadSubmissionCount}
      unreadStaffFeedbackCount={unreadStaffFeedbackCount}
    />
  );
}
