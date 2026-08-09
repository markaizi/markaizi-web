import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";
import { TransactionType } from "@prisma/client";

export const runtime = "nodejs";

const postSchema = z.object({
  type: z.nativeEnum(TransactionType),
  amount: z.string().trim().min(1).max(100),
  description: z.string().trim().min(1).max(300),
  date: z.string().refine((v) => !isNaN(new Date(v).getTime()), { message: "Geçersiz tarih." }),
  category: z.string().trim().max(50).optional(),
});

// Elle girilen gelir/gider kaydı — Ekonomi ekranındaki genel deftere düşer.
export async function POST(req: NextRequest) {
  const { session, err } = await requireAdmin();
  if (err) return err;

  const parsed = postSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const tx = await prisma.transaction.create({
    data: {
      type: parsed.data.type,
      amount: parsed.data.amount,
      description: parsed.data.description,
      date: new Date(parsed.data.date),
      category: parsed.data.type === "GIDER" ? parsed.data.category || null : null,
      authorId: session!.uid,
    },
  });

  return NextResponse.json({ ok: true, transaction: tx });
}
