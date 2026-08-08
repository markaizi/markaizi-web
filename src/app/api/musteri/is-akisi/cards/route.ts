import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireWorkflowCreateCards } from "@/lib/staffGuard";
import { assertCanAccessClient } from "@/lib/auth";

export const runtime = "nodejs";

const schema = z.object({
  columnId: z.string().min(1),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000).optional().nullable(),
  revisionNote: z.string().trim().max(2000).optional().nullable(),
  priority: z.enum(["DUSUK", "ORTA", "YUKSEK"]).optional(),
  dueDate: z.string().optional().nullable(), // "YYYY-MM-DD"
  assigneeId: z.string().optional().nullable(),
  clientId: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  const { session, err } = await requireWorkflowCreateCards();
  if (err) return err;

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { columnId, title, description, revisionNote, priority, dueDate, assigneeId, clientId } = parsed.data;

  if (clientId) {
    try {
      await assertCanAccessClient(session, clientId);
    } catch {
      return NextResponse.json({ error: "Bu firmaya erişim yetkiniz yok." }, { status: 403 });
    }
  }

  if (session!.role !== "ADMIN") {
    const column = await prisma.workflowColumn.findUnique({ where: { id: columnId }, select: { adminOnly: true } });
    if (column?.adminOnly) {
      return NextResponse.json({ error: "Bu sütuna yalnızca admin kart ekleyebilir." }, { status: 403 });
    }
    if (revisionNote) {
      const me = await prisma.user.findUnique({ where: { id: session!.uid }, select: { workflowCanWriteRevisionNote: true } });
      if (!me?.workflowCanWriteRevisionNote) {
        return NextResponse.json({ error: "Revize notu yazma yetkiniz yok." }, { status: 403 });
      }
    }
  }

  const maxOrder = await prisma.workflowCard.aggregate({
    _max: { sortOrder: true },
    where: { columnId },
  });

  const card = await prisma.workflowCard.create({
    data: {
      columnId,
      title,
      description: description || null,
      revisionNote: revisionNote || null,
      priority: priority ?? "ORTA",
      dueDate: dueDate ? new Date(dueDate) : null,
      assigneeId: assigneeId || null,
      clientId: clientId || null,
      creatorId: session!.uid,
      sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
    },
    include: {
      assignee: { select: { id: true, name: true } },
      creator: { select: { id: true, name: true } },
      client: { select: { slug: true, name: true } },
    },
  });

  return NextResponse.json({ ok: true, card });
}
