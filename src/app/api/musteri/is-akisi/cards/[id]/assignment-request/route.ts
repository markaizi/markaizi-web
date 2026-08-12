import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireWorkflowAccess } from "@/lib/staffGuard";
import { requireAdmin } from "@/lib/adminGuard";

export const runtime = "nodejs";

// "Yapılacak" sütunu, kimin elinde iş kaldığının referans sütunu — admin
// yeniden adlandırırsa en soldaki (sortOrder en düşük) sütuna düşülür.
// Bu mantık workflowBoardData.ts'teki ile birebir aynı olmalı.
async function getTodoColumnId(): Promise<string | null> {
  const columns = await prisma.workflowColumn.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, title: true },
  });
  return (columns.find((c) => c.title === "Yapılacak") ?? columns[0])?.id ?? null;
}

// Çalışan, "Yapılacak" sütununda başkasına atanmış bir kart için "bana ata"
// talebi gönderir — yalnızca kendi elinde o sütunda hiç kart kalmamışsa.
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, err } = await requireWorkflowAccess();
  if (err) return err;
  const { id } = await params;

  const card = await prisma.workflowCard.findUnique({
    where: { id },
    select: {
      columnId: true,
      assigneeId: true,
      requestedById: true,
      column: { select: { adminOnly: true } },
    },
  });
  if (!card) return NextResponse.json({ error: "Kart bulunamadı." }, { status: 404 });

  if (session!.role !== "ADMIN") {
    if (card.column.adminOnly) {
      return NextResponse.json({ error: "Bu sütundaki kartlara yalnızca admin dokunabilir." }, { status: 403 });
    }
    const todoColumnId = await getTodoColumnId();
    if (card.columnId !== todoColumnId) {
      return NextResponse.json({ error: "Yalnızca Yapılacak sütunundaki kartlar için talep gönderilebilir." }, { status: 400 });
    }
    if (!card.assigneeId || card.assigneeId === session!.uid) {
      return NextResponse.json({ error: "Bu kart için talep gönderemezsiniz." }, { status: 400 });
    }
    if (card.requestedById) {
      return NextResponse.json({ error: "Bu kart için zaten bir talep gönderilmiş." }, { status: 409 });
    }
    const myOpenCount = await prisma.workflowCard.count({
      where: { columnId: todoColumnId!, assigneeId: session!.uid, archivedAt: null },
    });
    if (myOpenCount > 0) {
      return NextResponse.json({ error: "Elinde iş varken talep gönderemezsin." }, { status: 400 });
    }
  } else if (!card.assigneeId || card.assigneeId === session!.uid || card.requestedById) {
    return NextResponse.json({ error: "Bu kart için talep gönderilemez." }, { status: 400 });
  }

  const updated = await prisma.workflowCard.update({
    where: { id },
    data: { requestedById: session!.uid, requestedAt: new Date() },
    select: { requestedBy: { select: { id: true, name: true } } },
  });

  return NextResponse.json({ ok: true, requestedBy: updated.requestedBy });
}

// Talebi geri çekme (talebi gönderen kişi) veya reddetme (admin) — ikisi de
// aynı işlemi yapar: requestedById/requestedAt temizlenir, assignee değişmez.
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, err } = await requireWorkflowAccess();
  if (err) return err;
  const { id } = await params;

  const card = await prisma.workflowCard.findUnique({ where: { id }, select: { requestedById: true } });
  if (!card) return NextResponse.json({ error: "Kart bulunamadı." }, { status: 404 });
  if (!card.requestedById) return NextResponse.json({ ok: true });

  if (session!.role !== "ADMIN" && card.requestedById !== session!.uid) {
    return NextResponse.json({ error: "Bu talebi yalnızca gönderen kişi veya admin geri alabilir." }, { status: 403 });
  }

  await prisma.workflowCard.update({
    where: { id },
    data: { requestedById: null, requestedAt: null },
  });
  return NextResponse.json({ ok: true });
}

// Admin talebi onaylar — atanan kişi talep edene döner.
export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { err } = await requireAdmin();
  if (err) return err;
  const { id } = await params;

  const card = await prisma.workflowCard.findUnique({ where: { id }, select: { requestedById: true } });
  if (!card) return NextResponse.json({ error: "Kart bulunamadı." }, { status: 404 });
  if (!card.requestedById) return NextResponse.json({ error: "Bekleyen bir talep yok." }, { status: 400 });

  const updated = await prisma.workflowCard.update({
    where: { id },
    data: { assigneeId: card.requestedById, requestedById: null, requestedAt: null },
    select: { assignee: { select: { id: true, name: true } } },
  });

  return NextResponse.json({ ok: true, assignee: updated.assignee });
}
