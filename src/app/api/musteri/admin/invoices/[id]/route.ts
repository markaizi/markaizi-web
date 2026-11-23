import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireInvoiceManageById } from "@/lib/staffGuard";
import { updateKasaEntry, trashKasaEntry } from "@/lib/agenda";
import { parseTry } from "@/lib/clientPayments";

export const runtime = "nodejs";

// v3.5.0: Müşteri ödemesinin kaydı Kasa'dadır (KasaEntry). id bir Kasa kaydıysa oraya yazılır;
// 1 Ekim 2026 öncesi eski fatura arşivi (Invoice) ise yalnızca o kayıt düzeltilir.
// Sonraki ayın alacağı artık burada değil, ensureClientReceivables ile aylık üretilir.
const patchSchema = z.object({
  status: z.enum(["ODENDI", "BEKLIYOR"]).optional(),
  amount: z.string().min(1).max(100).optional(),
  period: z.string().trim().min(1).max(100).optional(),
  dueDate: z.string().nullable().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { err } = await requireInvoiceManageById(id);
  if (err) return err;

  const parsed = patchSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const { status, amount, period, dueDate } = parsed.data;

  const kasa = await prisma.kasaEntry.findUnique({ where: { id }, include: { client: { select: { name: true } } } });
  if (kasa) {
    await updateKasaEntry(id, {
      ...(status ? { status } : {}),
      ...(amount ? { amount: parseTry(amount) } : {}),
      ...(period ? { title: `${kasa.client?.name ?? ""} ${period}`.trim() } : {}),
      ...(dueDate ? { dueDate: new Date(`${dueDate}T10:00:00+03:00`).toISOString() } : {}),
    });
    return NextResponse.json({ ok: true });
  }

  const before = await prisma.invoice.findUnique({ where: { id } });
  if (!before) return NextResponse.json({ error: "Kayıt bulunamadı." }, { status: 404 });
  await prisma.invoice.update({
    where: { id },
    data: {
      ...(status ? { status } : {}),
      ...(amount ? { amount } : {}),
      ...(period ? { period } : {}),
      ...(dueDate !== undefined ? { dueDate: dueDate ? new Date(dueDate) : null } : {}),
      ...(status !== undefined
        ? { paidAt: status === "ODENDI" && before.status !== "ODENDI" ? new Date() : status !== "ODENDI" ? null : undefined }
        : {}),
    },
  });
  return NextResponse.json({ ok: true });
}

// Kasa kaydı çöp kutusuna taşınır (geri alınabilir); arşiv faturası silinir.
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { err } = await requireInvoiceManageById(id);
  if (err) return err;

  if (await prisma.kasaEntry.findUnique({ where: { id }, select: { id: true } })) {
    await trashKasaEntry(id);
  } else {
    await prisma.invoice.delete({ where: { id } }).catch(() => null);
  }
  return NextResponse.json({ ok: true });
}
