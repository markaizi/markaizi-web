import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

// Çalışan yalnızca kendi, henüz fiyatlandırılmamış kaydını silebilir.
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  if (session.role !== "EMPLOYEE") return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });

  const { id } = await params;
  const log = await prisma.workLog.findUnique({ where: { id }, select: { userId: true, amount: true } });
  if (!log) return NextResponse.json({ error: "Kayıt bulunamadı." }, { status: 404 });
  if (log.userId !== session.uid) return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
  if (log.amount !== null) {
    return NextResponse.json({ error: "Fiyatlandırılmış kayıt silinemez." }, { status: 400 });
  }

  await prisma.workLog.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
