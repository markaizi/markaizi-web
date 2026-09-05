import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";

export const runtime = "nodejs";

const postSchema = z.object({
  name: z.string().trim().min(1).max(120),
  bankName: z.string().trim().max(80).optional(),
  limitAmount: z.string().trim().min(1).max(100),
  currentDebt: z.string().trim().max(100).optional(),
  statementDay: z.number().int().min(1).max(31).nullable().optional(),
  dueDay: z.number().int().min(1).max(31).nullable().optional(),
  note: z.string().trim().max(300).optional(),
});

export async function GET() {
  const { err } = await requireAdmin();
  if (err) return err;

  const items = await prisma.creditCard.findMany({ where: { active: true }, orderBy: { createdAt: "asc" } });
  return NextResponse.json({ items });
}

// Kredi kartı takibi — limit/borç/kesim-son ödeme günü. Ekonomi genel defterinden
// bağımsız, salt durum özeti (bkz. schema notu — çift sayım riskine karşı).
export async function POST(req: NextRequest) {
  const { err } = await requireAdmin();
  if (err) return err;

  const parsed = postSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const { currentDebt, ...rest } = parsed.data;
  const item = await prisma.creditCard.create({ data: { ...rest, currentDebt: currentDebt || "0" } });
  return NextResponse.json({ ok: true, item });
}
