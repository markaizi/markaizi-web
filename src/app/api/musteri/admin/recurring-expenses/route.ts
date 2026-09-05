import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";

export const runtime = "nodejs";

const postSchema = z.object({
  title: z.string().trim().min(1).max(120),
  category: z.string().trim().min(1).max(50),
  amount: z.string().trim().min(1).max(100),
  dayOfMonth: z.number().int().min(1).max(28),
});

export async function GET() {
  const { err } = await requireAdmin();
  if (err) return err;

  const items = await prisma.recurringExpense.findMany({ orderBy: { dayOfMonth: "asc" } });
  return NextResponse.json({ items });
}

// Düzenli gider tanımı — kira, sabit fatura gibi her ay aynı gün otomatik
// düşecek kalemler. Üretim, Ekonomi sayfası her açıldığında (bkz. economyRecurring.ts)
// gerçekleşir; burada yalnızca tanım oluşturulur, ilk ay için hemen kayıt açılmaz.
export async function POST(req: NextRequest) {
  const { err } = await requireAdmin();
  if (err) return err;

  const parsed = postSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const item = await prisma.recurringExpense.create({ data: parsed.data });
  return NextResponse.json({ ok: true, item });
}
