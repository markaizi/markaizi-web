import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getCurrentPeriod, getPeriodForDate } from "@/lib/workLogPeriods";
import EmployeeDashboard, { type AssignedClient, type EmployeeStats } from "@/components/EmployeeDashboard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Çalışan Paneli — markaizi",
};

function parseAmount(raw: string | null): number {
  if (!raw) return 0;
  const digits = raw.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

export default async function CalisanPage() {
  const session = await getSession();
  if (!session) redirect("/musteri/giris?next=/musteri/calisan");
  if (session.role === "CLIENT") redirect(session.slug ? `/musteri/${session.slug}` : "/musteri/giris");

  // Admin ise admin paneline yönlendir
  if (session.role === "ADMIN") redirect("/musteri/admin");

  const [me, assignments, unreadNotes, myCards, myWorkLogs, myAvans] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.uid }, select: { workflowAccess: true, paymentDay: true, adminCanPriceWorklogs: true, adminCanViewEconomy: true } }),
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
    prisma.workLog.findMany({
      where: { userId: session.uid },
      select: { date: true, amount: true },
    }),
    prisma.payrollPayment.findMany({
      where: { userId: session.uid, kind: "AVANS" },
      select: { date: true, amount: true },
    }),
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

  // Kazanç dönem başına hesaplanır: iş kaydı olan bir dönemde onun toplamı esas
  // alınır; iş kayıtları sistemi kurulmadan önceki dönemlerde (hiç iş kaydı yok)
  // verilen avans o dönemin tek kazancı sayılır — böylece "geçen ay" gibi eski
  // dönemler de toplam kazanca dahil olur.
  const paymentDay = me?.paymentDay ?? null;
  const currentPeriod = getCurrentPeriod(paymentDay);

  const worklogByPeriod = new Map<string, number>();
  for (const l of myWorkLogs) {
    const key = getPeriodForDate(l.date, paymentDay).key;
    worklogByPeriod.set(key, (worklogByPeriod.get(key) ?? 0) + parseAmount(l.amount));
  }
  const avansByPeriod = new Map<string, number>();
  for (const p of myAvans) {
    const key = getPeriodForDate(p.date, paymentDay).key;
    avansByPeriod.set(key, (avansByPeriod.get(key) ?? 0) + parseAmount(p.amount));
  }

  let totalEarnings = 0;
  for (const key of new Set([...worklogByPeriod.keys(), ...avansByPeriod.keys()])) {
    const wl = worklogByPeriod.get(key) ?? 0;
    totalEarnings += wl > 0 ? wl : (avansByPeriod.get(key) ?? 0);
  }
  const currentWorklog = worklogByPeriod.get(currentPeriod.key) ?? 0;
  const currentEarnings = currentWorklog > 0 ? currentWorklog : (avansByPeriod.get(currentPeriod.key) ?? 0);

  const stats: EmployeeStats = { bitirilen, bekleyen, acil, currentEarnings, totalEarnings, periodLabel: currentPeriod.label };

  return (
    <EmployeeDashboard
      clients={clients}
      employeeName={session.name}
      workflowAccess={me?.workflowAccess ?? true}
      stats={stats}
      canPriceWorklogs={me?.adminCanPriceWorklogs ?? false}
      canViewEconomy={me?.adminCanViewEconomy ?? false}
    />
  );
}
