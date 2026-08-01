import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import EmployeeDashboard, { type AssignedClient } from "@/components/EmployeeDashboard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Çalışan Paneli — markaizi",
};

export default async function CalisanPage() {
  const session = await getSession();
  if (!session) redirect("/musteri/giris?next=/musteri/calisan");
  if (session.role === "CLIENT") redirect(session.slug ? `/musteri/${session.slug}` : "/musteri/giris");

  // Admin ise admin paneline yönlendir
  if (session.role === "ADMIN") redirect("/musteri/admin");

  const [assignments, unreadNotes] = await Promise.all([
    prisma.assignment.findMany({
      where: { userId: session.uid },
      include: {
        client: {
          include: {
            campaigns: { select: { platform: true } },
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
  ]);

  const unreadMap = new Map(unreadNotes.map((u) => [u.clientId, u._count.id]));

  const clients: AssignedClient[] = assignments.map((a) => ({
    slug: a.client.slug,
    name: a.client.name,
    pendingCount: a.client.contentItems.length,
    metaCount: a.client.campaigns.filter((c) => c.platform === "META").length,
    googleCount: a.client.campaigns.filter((c) => c.platform === "GOOGLE").length,
    tiktokCount: a.client.campaigns.filter((c) => c.platform === "TIKTOK").length,
    unreadNoteCount: unreadMap.get(a.clientId) ?? 0,
  }));

  return <EmployeeDashboard clients={clients} employeeName={session.name} />;
}
