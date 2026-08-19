import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireInvoiceManageById } from "@/lib/staffGuard";
import { nextDueDate, BILLING_PERIOD_INVOICE_LABEL, type BillingPeriod } from "@/lib/billingPeriod";

export const runtime = "nodejs";

// Yalnızca ödendi/ödenmedi yazılabilir — "Günü Gelmedi"/"Gecikmede" aşamaları
// vade tarihinden hesaplanır, elle atanmaz (bkz. src/lib/invoiceStage.ts).
const patchSchema = z.object({
  status: z.enum(["ODENDI", "BEKLIYOR"]).optional(),
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
      // Ekonomi ekranındaki aylık gelir hesabı paidAt'e göre gruplanır — durum
      // ODENDI'ye geçince otomatik set edilir, geri alınırsa temizlenir.
      ...(rest.status !== undefined
        ? { paidAt: rest.status === "ODENDI" && before.status !== "ODENDI" ? new Date() : rest.status !== "ODENDI" ? null : undefined }
        : {}),
    },
  });

  // Fatura yeni "Ödendi" olduysa ve firmanın tekrarlayan ödeme planı varsa
  // sonraki dönemin faturasını otomatik oluştur. Ödenmemiş olarak açılır;
  // vadesi ileride olduğu için panelde kendiliğinden "Günü Gelmedi" görünür.
  const { client } = before;
  if (rest.status === "ODENDI" && before.status !== "ODENDI" && client.billingPeriod && client.billingAmount) {
    const period = client.billingPeriod as BillingPeriod;
    const base = updated.dueDate ?? before.dueDate ?? new Date();
    // MANUEL periyotta (veya gün aralığı girilmemiş OZEL_GUN'de) null döner —
    // bu firmalarda faturalar elle açılır.
    const next = nextDueDate(base, period, client.billingIntervalDays);

    // Aynı vade için zaten bir fatura varsa yenisini açma. Bu olmadan, bir fatura
    // "Ödendi" ↔ "Ödenmedi" arasında her gidip geldiğinde sonraki dönem için bir
    // fatura daha üretiliyordu; sonuç, aynı firmanın peş peşe günlerde birden çok
    // ödemesi varmış gibi görünmesiydi.
    const alreadyExists = next
      ? await prisma.invoice.findFirst({
          where: { clientId: client.id, dueDate: next },
          select: { id: true },
        })
      : null;

    if (next && !alreadyExists) {
      await prisma.invoice.create({
        data: {
          clientId: client.id,
          period: BILLING_PERIOD_INVOICE_LABEL[period],
          amount: client.billingAmount,
          dueDate: next,
          status: "BEKLIYOR",
        },
      });
    }
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
