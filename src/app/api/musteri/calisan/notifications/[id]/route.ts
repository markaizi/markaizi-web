import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const schema = z.object({
  read: z.boolean().optional(),
  popped: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role === "CLIENT") return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  const { id } = await params;

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Geçersiz veri." }, { status: 400 });

  const notif = await prisma.staffNotification.findUnique({ where: { id }, select: { recipientId: true } });
  if (!notif) return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
  if (notif.recipientId !== session.uid) return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });

  await prisma.staffNotification.update({
    where: { id },
    data: {
      ...(parsed.data.read ? { readAt: new Date() } : {}),
      ...(parsed.data.popped ? { poppedAt: new Date() } : {}),
    },
  });

  return NextResponse.json({ ok: true });
}
