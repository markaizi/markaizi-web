import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireWorkflowManageColumns } from "@/lib/staffGuard";

export const runtime = "nodejs";

const schema = z.object({ title: z.string().trim().min(1).max(60) });

export async function POST(req: NextRequest) {
  const { err } = await requireWorkflowManageColumns();
  if (err) return err;

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const maxOrder = await prisma.workflowColumn.aggregate({ _max: { sortOrder: true } });
  const column = await prisma.workflowColumn.create({
    data: { title: parsed.data.title, sortOrder: (maxOrder._max.sortOrder ?? -1) + 1 },
  });

  return NextResponse.json({ ok: true, column: { ...column, cards: [] } });
}
