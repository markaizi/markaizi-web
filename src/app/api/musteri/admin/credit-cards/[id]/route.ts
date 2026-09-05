import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";

export const runtime = "nodejs";

const patchSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  bankName: z.string().trim().max(80).nullable().optional(),
  limitAmount: z.string().trim().min(1).max(100).optional(),
  currentDebt: z.string().trim().min(1).max(100).optional(),
  statementDay: z.number().int().min(1).max(31).nullable().optional(),
  dueDay: z.number().int().min(1).max(31).nullable().optional(),
  note: z.string().trim().max(300).nullable().optional(),
  active: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { err } = await requireAdmin();
  if (err) return err;
  const { id } = await params;

  const parsed = patchSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  await prisma.creditCard.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { err } = await requireAdmin();
  if (err) return err;
  const { id } = await params;

  // Kalıcı silme yerine arşivleme — geçmişe dönük "hangi kartlarımız vardı"
  // bilgisi kaybolmasın diye (diğer admin modellerindeki active=false konvansiyonu).
  await prisma.creditCard.update({ where: { id }, data: { active: false } });
  return NextResponse.json({ ok: true });
}
