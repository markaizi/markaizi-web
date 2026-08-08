import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireWorkflowManageColumns } from "@/lib/staffGuard";

export const runtime = "nodejs";

const patchSchema = z.object({
  title: z.string().trim().min(1).max(60).optional(),
  sortOrder: z.number().int().optional(),
  triggersWorkLog: z.boolean().optional(),
  triggersContentItem: z.boolean().optional(),
  notifyOnEntry: z.boolean().optional(),
  adminOnly: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, err } = await requireWorkflowManageColumns();
  if (err) return err;
  const { id } = await params;

  const parsed = patchSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  if (parsed.data.adminOnly !== undefined && session!.role !== "ADMIN") {
    return NextResponse.json({ error: "Bu sütunu yalnızca admin kilitleyebilir." }, { status: 403 });
  }

  const column = await prisma.workflowColumn.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ ok: true, column });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { err } = await requireWorkflowManageColumns();
  if (err) return err;
  const { id } = await params;

  const cardCount = await prisma.workflowCard.count({ where: { columnId: id } });
  if (cardCount > 0) {
    return NextResponse.json(
      { error: "Bu sütunda kartlar var. Silmeden önce kartları başka bir sütuna taşıyın." },
      { status: 409 }
    );
  }

  await prisma.workflowColumn.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
