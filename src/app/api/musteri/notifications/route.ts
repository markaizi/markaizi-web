import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

// Firma bazında "okunmamış" istek sayılarını döner.
// ADMIN/EMPLOYEE için: müşterinin yazdığı, henüz okunmamış istekler.
// CLIENT için: kendi isteklerinden durumu değişip henüz görülmemiş olanlar
// (durum değişince müşterinin NoteRead kaydı silinir — bkz. notes/note/[id] PATCH).
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  let clientFilter: { id: string }[] = [];

  if (session.role === "CLIENT") {
    if (!session.clientId) return NextResponse.json({ items: [] });
    clientFilter = [{ id: session.clientId }];
  } else if (session.role === "EMPLOYEE") {
    const assignments = await prisma.assignment.findMany({
      where: { userId: session.uid },
      select: { clientId: true },
    });
    clientFilter = assignments.map((a) => ({ id: a.clientId }));
  } else {
    // ADMIN — tüm aktif firmalar
    const allClients = await prisma.client.findMany({
      where: { active: true },
      select: { id: true },
    });
    clientFilter = allClients;
  }

  if (clientFilter.length === 0) return NextResponse.json({ items: [] });

  const clientIds = clientFilter.map((c) => c.id);

  // Okunmamış: başkası tarafından yazılmış (veya durumu değişmiş), NoteRead kaydı olmayan
  const unreadNotes = await prisma.note.findMany({
    where: {
      clientId: { in: clientIds },
      authorId: { not: session.uid },
      reads: { none: { userId: session.uid } },
    },
    select: {
      clientId: true,
      client: { select: { slug: true, name: true } },
    },
  });

  // Firma bazında grupla
  const map = new Map<string, { clientSlug: string; clientName: string; unreadCount: number }>();
  for (const note of unreadNotes) {
    const key = note.clientId;
    if (!map.has(key)) {
      map.set(key, { clientSlug: note.client.slug, clientName: note.client.name, unreadCount: 0 });
    }
    map.get(key)!.unreadCount++;
  }

  const items = Array.from(map.values()).sort((a, b) => b.unreadCount - a.unreadCount);
  return NextResponse.json({ items });
}
