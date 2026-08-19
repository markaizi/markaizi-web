import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

// Müşterinin kendi firmasına yazılmış bildirimleri — normal liste (son 50) veya
// ?popupOnly=1 ile henüz gösterilmemiş popup'lar (bkz. ClientPopupNotification).
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "CLIENT" || !session.clientId) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const popupOnly = req.nextUrl.searchParams.get("popupOnly") === "1";

  if (popupOnly) {
    const items = await prisma.clientNotification.findMany({
      where: { clientId: session.clientId, poppedAt: null },
      orderBy: { createdAt: "asc" },
      select: { id: true, severity: true, title: true, body: true, createdAt: true },
    });
    return NextResponse.json({ items });
  }

  const [items, unreadCount] = await Promise.all([
    prisma.clientNotification.findMany({
      where: { clientId: session.clientId },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true, severity: true, title: true, body: true, readAt: true, createdAt: true,
        reply: true, repliedAt: true,
      },
    }),
    prisma.clientNotification.count({ where: { clientId: session.clientId, readAt: null } }),
  ]);

  return NextResponse.json({ items, unreadCount });
}
