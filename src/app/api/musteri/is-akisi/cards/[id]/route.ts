import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/adminGuard";
import { assertCanAccessClient } from "@/lib/auth";

export const runtime = "nodejs";

const patchSchema = z.object({
  title: z.string().trim().min(1).max(160).optional(),
  description: z.string().trim().max(2000).optional().nullable(),
  priority: z.enum(["DUSUK", "ORTA", "YUKSEK"]).optional(),
  dueDate: z.string().optional().nullable(),
  assigneeId: z.string().optional().nullable(),
  clientId: z.string().optional().nullable(),
  columnId: z.string().optional(),
  sortOrder: z.number().int().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, err } = await requireStaff();
  if (err) return err;
  const { id } = await params;

  const parsed = patchSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { dueDate, clientId, ...rest } = parsed.data;

  if (clientId) {
    try {
      await assertCanAccessClient(session, clientId);
    } catch {
      return NextResponse.json({ error: "Bu firmaya erişim yetkiniz yok." }, { status: 403 });
    }
  }

  // Sütun değişiyorsa, kartı hedef sütunun sonuna taşı
  let sortOrder = rest.sortOrder;
  if (rest.columnId && sortOrder === undefined) {
    const maxOrder = await prisma.workflowCard.aggregate({
      _max: { sortOrder: true },
      where: { columnId: rest.columnId },
    });
    sortOrder = (maxOrder._max.sortOrder ?? -1) + 1;
  }

  const card = await prisma.workflowCard.update({
    where: { id },
    data: {
      ...rest,
      sortOrder,
      description: rest.description === undefined ? undefined : rest.description || null,
      assigneeId: rest.assigneeId === undefined ? undefined : rest.assigneeId || null,
      clientId: clientId === undefined ? undefined : clientId || null,
      dueDate: dueDate === undefined ? undefined : dueDate ? new Date(dueDate) : null,
    },
    include: {
      assignee: { select: { id: true, name: true } },
      creator: { select: { id: true, name: true } },
      client: { select: { slug: true, name: true } },
    },
  });

  return NextResponse.json({ ok: true, card });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, err } = await requireStaff();
  if (err) return err;
  const { id } = await params;

  const card = await prisma.workflowCard.findUnique({ where: { id }, select: { creatorId: true } });
  if (!card) return NextResponse.json({ error: "Kart bulunamadı." }, { status: 404 });

  if (session!.role !== "ADMIN" && card.creatorId !== session!.uid) {
    return NextResponse.json({ error: "Bu kartı sadece oluşturan kişi veya admin silebilir." }, { status: 403 });
  }

  await prisma.workflowCard.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
