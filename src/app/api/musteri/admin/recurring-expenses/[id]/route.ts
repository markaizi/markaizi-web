import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";

export const runtime = "nodejs";

const patchSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  category: z.string().trim().min(1).max(50).optional(),
  amount: z.string().trim().min(1).max(100).optional(),
  dayOfMonth: z.number().int().min(1).max(28).optional(),
  active: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { err } = await requireAdmin();
  if (err) return err;
  const { id } = await params;

  const parsed = patchSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  await prisma.recurringExpense.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ ok: true });
}

// Tanımı siler — daha önce üretilmiş Transaction kayıtları kalır (recurringExpenseId
// SetNull ile boşa düşer), yalnızca bundan sonraki otomatik üretim durur.
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { err } = await requireAdmin();
  if (err) return err;
  const { id } = await params;

  await prisma.recurringExpense.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
