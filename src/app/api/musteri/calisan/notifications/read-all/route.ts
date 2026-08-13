import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function PATCH() {
  const session = await getSession();
  if (!session || session.role === "CLIENT") return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  await prisma.staffNotification.updateMany({
    where: { recipientId: session.uid, readAt: null },
    data: { readAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
