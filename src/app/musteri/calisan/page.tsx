import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { listEmployeePayments } from "@/lib/clientPayments";
import EmployeeDashboard, { type AssignedClient, type EmployeeStats } from "@/components/EmployeeDashboard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: { absolute: "Çalışan Paneli — markaizi" },
};

export default async function CalisanPage() {
  const session = await getSession();
  if (!session) redirect("/musteri/giris?next=/musteri/calisan");
  if (session.role === "CLIENT") redirect(session.slug ? `/musteri/${session.slug}` : "/musteri/giris");

  // Admin ise admin paneline yönlendir
  if (session.role === "ADMIN") redirect("/musteri/admin");

  const [me, assignments, unreadNotes, myCards, myPayments] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.uid }, select: { workflowAccess: true } }),
    prisma.assignment.findMany({
      where: { userId: session.uid },
      include: {
        client: {
          include: {
            contentItems: {
              where: { status: { in: ["PLANLANDI", "DUZENLENIYOR"] } },
              select: { id: true },
            },
          },
        },
      },
    }),
    prisma.note.groupBy({
      by: ["clientId"],
      where: {
        client: { assignments: { some: { userId: session.uid } } },
        authorId: { not: session.uid },
        reads: { none: { userId: session.uid } },
      },
      _count: { id: true },
    }),
    prisma.workflowCard.findMany({
      where: { assigneeId: session.uid },
      select: { priority: true, archivedAt: true, column: { select: { title: true } } },
    }),
    listEmployeePayments(session.uid),
  ]);

  const unreadMap = new Map(unreadNotes.map((u) => [u.clientId, u._count.id]));

  const clients: AssignedClient[] = assignments.map((a) => ({
    slug: a.client.slug,
    name: a.client.name,
    pendingCount: a.client.contentItems.length,
    unreadNoteCount: unreadMap.get(a.clientId) ?? 0,
  }));

  // İş istatistikleri — "Tamamlandı" sütunu ömür boyu bitirilen iş sayılır (arşivlenmiş
  // dahil); geri kalan sütunlardaki arşivlenmemiş kartlar hâlâ bekleyen/acil iş sayılır.
  let bitirilen = 0, bekleyen = 0, acil = 0;
  for (const c of myCards) {
    if (c.column.title === "Tamamlandı") bitirilen++;
    else if (!c.archivedAt) {
      bekleyen++;
      if (c.priority === "YUKSEK") acil++;
    }
  }

  // Kazanç (v3.6.0): Finans'tan çalışana bağlanarak girilen ödenmiş kayıtlar + eski personel ödemeleri.
  const monthKey = new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Istanbul" }).slice(0, 7);
  const paid = myPayments.filter((p) => p.status === "ODENDI");
  const currentEarnings = paid
    .filter((p) => new Date(p.date).toLocaleDateString("en-CA", { timeZone: "Europe/Istanbul" }).slice(0, 7) === monthKey)
    .reduce((a, p) => a + p.amount, 0);
  const totalEarnings = paid.reduce((a, p) => a + p.amount, 0);
  const periodLabel = new Date().toLocaleDateString("tr-TR", { month: "long", year: "numeric" });

  const stats: EmployeeStats = { bitirilen, bekleyen, acil, currentEarnings, totalEarnings, periodLabel };

  return (
    <EmployeeDashboard
      clients={clients}
      employeeName={session.name}
      workflowAccess={me?.workflowAccess ?? true}
      stats={stats}
    />
  );
}
