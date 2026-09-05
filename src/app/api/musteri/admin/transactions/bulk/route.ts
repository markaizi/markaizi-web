import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";
import { TransactionType } from "@prisma/client";

export const runtime = "nodejs";

const rowSchema = z.object({
  type: z.nativeEnum(TransactionType),
  amount: z.string().trim().min(1).max(100),
  description: z.string().trim().min(1).max(300),
  date: z.string().refine((v) => !isNaN(new Date(v).getTime()), { message: "Geçersiz tarih." }),
  category: z.string().trim().max(50).optional(),
});

const postSchema = z.object({ rows: z.array(rowSchema).min(1).max(100) });

// Toplu gelir/gider girişi — tek formda birden fazla satır, tek istekte kaydedilir.
export async function POST(req: NextRequest) {
  const { session, err } = await requireAdmin();
  if (err) return err;

  const parsed = postSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const { count } = await prisma.transaction.createMany({
    data: parsed.data.rows.map((r) => ({
      type: r.type,
      amount: r.amount,
      description: r.description,
      date: new Date(r.date),
      category: r.type === "GIDER" ? r.category || null : null,
      authorId: session!.uid,
    })),
  });

  return NextResponse.json({ ok: true, count });
}
