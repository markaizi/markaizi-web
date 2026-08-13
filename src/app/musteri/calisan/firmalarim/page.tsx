import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import EmployeeFirmalarim, { type AssignedClient } from "@/components/EmployeeFirmalarim";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Firmalarım — markaizi",
};

export default async function CalisanFirmalarimPage() {
  const session = await getSession();
  if (!session) redirect("/musteri/giris?next=/musteri/calisan/firmalarim");
  if (session.role === "CLIENT") redirect(session.slug ? `/musteri/${session.slug}` : "/musteri/giris");
  if (session.role === "ADMIN") redirect("/musteri/admin");

  const [assignments, unreadNotes] = await Promise.all([
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
  ]);

  const unreadMap = new Map(unreadNotes.map((u) => [u.clientId, u._count.id]));

  const clients: AssignedClient[] = assignments.map((a) => ({
    slug: a.client.slug,
    name: a.client.name,
    pendingCount: a.client.contentItems.length,
    unreadNoteCount: unreadMap.get(a.clientId) ?? 0,
  }));

  return <EmployeeFirmalarim clients={clients} />;
}
