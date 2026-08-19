import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

// Müşterinin kendi firmasına yazılmış bildirimleri — son 50, en yeni önce.
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "CLIENT" || !session.clientId) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const [items, unreadCount] = await Promise.all([
    prisma.clientNotification.findMany({
      where: { clientId: session.clientId },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: { id: true, title: true, body: true, readAt: true, createdAt: true },
    }),
    prisma.clientNotification.count({ where: { clientId: session.clientId, readAt: null } }),
  ]);

  return NextResponse.json({ items, unreadCount });
}
