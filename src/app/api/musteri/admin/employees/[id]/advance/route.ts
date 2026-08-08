import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";

export const runtime = "nodejs";

const postSchema = z.object({
  amount: z.string().trim().min(1).max(100),
  description: z.string().trim().max(300).optional(),
  date: z.string().refine((v) => !isNaN(new Date(v).getTime()), { message: "Geçersiz tarih." }),
});

// Döneme bağlı olmadan, istenildiği an verilen avans/ara ödeme — anında Ekonomi'ye
// gider olarak düşer. Dönem kapatılırken bu tarihe göre ilgili dönemden düşülür
// (bkz. period-payment route'u).
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { err } = await requireAdmin();
  if (err) return err;
  const { id } = await params;

  const parsed = postSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const employee = await prisma.user.findFirst({ where: { id, role: "EMPLOYEE" }, select: { id: true, name: true } });
  if (!employee) return NextResponse.json({ error: "Çalışan bulunamadı." }, { status: 404 });

  const date = new Date(parsed.data.date);
  const desc = parsed.data.description?.trim()
    ? `Avans — ${employee.name} — ${parsed.data.description.trim()}`
    : `Avans — ${employee.name}`;

  const tx = await prisma.transaction.create({
    data: { type: "GIDER", amount: parsed.data.amount, description: desc, date },
  });

  const payment = await prisma.payrollPayment.create({
    data: {
      userId: employee.id,
      kind: "AVANS",
      amount: parsed.data.amount,
      description: parsed.data.description?.trim() || null,
      date,
      transactionId: tx.id,
    },
  });

  return NextResponse.json({ ok: true, payment });
}
