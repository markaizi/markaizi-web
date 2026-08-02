import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireInvoiceManageById } from "@/lib/staffGuard";
import { InvoiceStatus } from "@prisma/client";

export const runtime = "nodejs";

const patchSchema = z.object({
  status: z.nativeEnum(InvoiceStatus).optional(),
  amount: z.string().min(1).max(100).optional(),
  period: z.string().min(1).max(100).optional(),
  dueDate: z.string().nullable().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { err } = await requireInvoiceManageById(id);
  if (err) return err;

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const before = await prisma.invoice.findUnique({ where: { id }, include: { client: true } });
  if (!before) return NextResponse.json({ error: "Fatura bulunamadı." }, { status: 404 });

  const { dueDate, ...rest } = parsed.data;
  const updated = await prisma.invoice.update({
    where: { id },
    data: {
      ...rest,
      ...(dueDate !== undefined ? { dueDate: dueDate ? new Date(dueDate) : null } : {}),
    },
  });

  // Fatura yeni "Ödendi" olduysa ve firmanın tekrarlayan ödeme planı varsa
  // sonraki dönemin faturasını otomatik oluştur ("Günü Gelmedi" durumuyla).
  const { client } = before;
  if (rest.status === "ODENDI" && before.status !== "ODENDI" && client.billingPeriod && client.billingAmount) {
    const base = updated.dueDate ?? before.dueDate ?? new Date();
    const next = new Date(base);
    if (client.billingPeriod === "HAFTALIK") next.setUTCDate(next.getUTCDate() + 7);
    else next.setUTCMonth(next.getUTCMonth() + 1);

    await prisma.invoice.create({
      data: {
        clientId: client.id,
        period: client.billingPeriod === "HAFTALIK" ? "Haftalık Ödeme" : "Aylık Ödeme",
        amount: client.billingAmount,
        dueDate: next,
        status: "GUNU_GELMEDI",
      },
    });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { err } = await requireInvoiceManageById(id);
  if (err) return err;

  await prisma.invoice.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
