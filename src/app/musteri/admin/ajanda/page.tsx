import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getVisitTracking } from "@/lib/agenda";
import AjandaView, { type AjandaData } from "@/components/AjandaView";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Ajanda — Admin",
};

const PAST_DAYS = 30;
const FUTURE_DAYS = 60;

export default async function AjandaPage({ searchParams }: { searchParams: Promise<{ firma?: string; tab?: string }> }) {
  const { firma, tab } = await searchParams;
  const session = await getSession();
  if (!session) redirect("/musteri/giris?next=/musteri/admin/ajanda");
  if (session.role !== "ADMIN") redirect("/musteri/admin");

  const now = new Date();
  const from = new Date(now.getTime() - PAST_DAYS * 86_400_000);
  const to = new Date(now.getTime() + FUTURE_DAYS * 86_400_000);
  const doneSince = new Date(now.getTime() - 14 * 86_400_000);

  const [events, tasks, notes, clients, tracking] = await Promise.all([
    prisma.agendaEvent.findMany({
      where: { startAt: { gte: from, lte: to } },
      orderBy: { startAt: "asc" },
      include: { client: { select: { name: true, slug: true } } },
    }),
    prisma.agendaTask.findMany({
      where: { deletedAt: null, OR: [{ status: { not: "TAMAMLANDI" } }, { completedAt: { gte: doneSince } }] },
      orderBy: [{ status: "asc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
      include: { client: { select: { name: true, slug: true } } },
    }),
    prisma.agendaNote.findMany({
      where: { deletedAt: null },
      orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
      include: { client: { select: { name: true, slug: true } } },
    }),
    // Aktif firmalar önce, pasifler (ara sıra iş / ziyaret yapılan) "(pasif)" etiketiyle sonda.
    prisma.client.findMany({ orderBy: [{ active: "desc" }, { name: "asc" }], select: { id: true, name: true, active: true } }),
    getVisitTracking(now),
  ]);

  const data: AjandaData = {
    events: events.map((e) => ({
      id: e.id, title: e.title, description: e.description, clientNote: e.clientNote,
      startAt: e.startAt.toISOString(), endAt: e.endAt?.toISOString() ?? null, allDay: e.allDay,
      locationName: e.locationName, status: e.status, visibleToClient: e.visibleToClient,
      clientId: e.clientId, clientName: e.client?.name ?? null, clientSlug: e.client?.slug ?? null,
    })),
    tasks: tasks.map((t) => ({
      id: t.id, title: t.title, description: t.description, priority: t.priority, status: t.status,
      dueAt: t.dueAt?.toISOString() ?? null, completedAt: t.completedAt?.toISOString() ?? null,
      visibleToClient: t.visibleToClient, clientId: t.clientId, clientName: t.client?.name ?? null, clientSlug: t.client?.slug ?? null,
    })),
    notes: notes.map((n) => ({
      id: n.id, kind: n.kind, title: n.title, content: n.content, category: n.category, tags: n.tags,
      pinned: n.pinned, clientId: n.clientId, clientName: n.client?.name ?? null, clientSlug: n.client?.slug ?? null, updatedAt: n.updatedAt.toISOString(),
      visibleToClient: n.visibleToClient,
    })),
    clients: clients.map((c) => ({ id: c.id, name: c.active ? c.name : `${c.name} (pasif)` })),
    tracking,
    nowIso: now.toISOString(),
  };

  const tabs = ["plan", "ziyaret", "isler", "notlar"] as const;
  const initialTab = tabs.find((t) => t === tab) ?? "plan";
  return <AjandaView data={data} initialClientId={clients.some((c) => c.id === firma) ? firma : ""} initialTab={initialTab} />;
}
