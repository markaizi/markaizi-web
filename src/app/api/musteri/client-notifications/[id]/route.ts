import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const schema = z.object({ read: z.boolean().optional() });

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "CLIENT" || !session.clientId) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }
  const { id } = await params;

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Geçersiz veri." }, { status: 400 });

  const notif = await prisma.clientNotification.findUnique({ where: { id }, select: { clientId: true } });
  if (!notif) return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
  if (notif.clientId !== session.clientId) return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });

  if (parsed.data.read) {
    await prisma.clientNotification.update({ where: { id }, data: { readAt: new Date() } });
  }

  return NextResponse.json({ ok: true });
}
