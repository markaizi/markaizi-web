import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";

export const runtime = "nodejs";

const patchSchema = z.object({
  amount: z.string().max(60).nullable().optional(),
  description: z.string().min(1).max(500).optional(),
  date: z.string().min(1).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { err } = await requireAdmin();
  if (err) return err;

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Geçersiz veri." }, { status: 400 });

  const { date, ...rest } = parsed.data;
  const updated = await prisma.workLog.update({
    where: { id },
    data: {
      ...rest,
      ...(date !== undefined ? { date: new Date(date) } : {}),
    },
  });

  return NextResponse.json({
    ok: true,
    log: {
      id: updated.id,
      date: updated.date.toISOString(),
      description: updated.description,
      amount: updated.amount,
      createdAt: updated.createdAt.toISOString(),
    },
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { err } = await requireAdmin();
  if (err) return err;

  const { id } = await params;
  await prisma.workLog.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
