import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendAdminNotifications } from "@/lib/staffNotify";

export const runtime = "nodejs";

const schema = z.object({
  read: z.boolean().optional(),
  popped: z.boolean().optional(),
  reply: z.string().trim().min(1).max(500).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "CLIENT" || !session.clientId) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }
  const { id } = await params;

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Geçersiz veri." }, { status: 400 });

  const notif = await prisma.clientNotification.findUnique({
    where: { id },
    select: { clientId: true, severity: true, title: true, repliedAt: true, client: { select: { name: true } } },
  });
  if (!notif) return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
  if (notif.clientId !== session.clientId) return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });

  if (parsed.data.reply !== undefined) {
    if (notif.severity !== "SARI") {
      return NextResponse.json({ error: "Yalnızca sarı bildirimlere yanıt yazılabilir." }, { status: 400 });
    }
    if (notif.repliedAt) {
      return NextResponse.json({ error: "Bu bildirime zaten yanıt verildi." }, { status: 400 });
    }
  }

  await prisma.clientNotification.update({
    where: { id },
    data: {
      ...(parsed.data.read ? { readAt: new Date() } : {}),
      ...(parsed.data.popped ? { poppedAt: new Date() } : {}),
      ...(parsed.data.reply !== undefined ? { reply: parsed.data.reply, repliedAt: new Date(), readAt: new Date() } : {}),
    },
  });

  // Müşteri yanıt yazdıysa admin'lere haber ver — panelden ayrıca kontrol etmelerine gerek kalmasın.
  if (parsed.data.reply !== undefined) {
    const admins = await prisma.user.findMany({ where: { role: "ADMIN", active: true }, select: { id: true } });
    if (admins.length) {
      sendAdminNotifications({
        recipientIds: admins.map((a) => a.id),
        title: `${notif.client.name} yanıt verdi`,
        body: `"${notif.title}" bildirimine yanıt: ${parsed.data.reply}`,
        popup: true,
      }).catch((e) => console.error("[clientNotify] admin bildirimi başarısız:", e));
    }
  }

  return NextResponse.json({ ok: true });
}
