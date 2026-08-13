import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

// Bildirimlerim — normal liste (son 50) veya ?popupOnly=1 ile henüz gösterilmemiş
// popup bildirimleri (bkz. StaffPopupNotification, giriş sonrası bir kerelik gösterilir).
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role === "CLIENT") return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const popupOnly = req.nextUrl.searchParams.get("popupOnly") === "1";

  if (popupOnly) {
    const items = await prisma.staffNotification.findMany({
      where: { recipientId: session.uid, popup: true, poppedAt: null },
      orderBy: { createdAt: "asc" },
      select: { id: true, title: true, body: true, createdAt: true },
    });
    return NextResponse.json({ items });
  }

  const [items, unreadCount] = await Promise.all([
    prisma.staffNotification.findMany({
      where: { recipientId: session.uid },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: { id: true, type: true, title: true, body: true, readAt: true, createdAt: true },
    }),
    prisma.staffNotification.count({ where: { recipientId: session.uid, readAt: null } }),
  ]);

  return NextResponse.json({ items, unreadCount });
}
