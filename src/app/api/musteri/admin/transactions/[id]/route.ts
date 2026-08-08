import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";

export const runtime = "nodejs";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { err } = await requireAdmin();
  if (err) return err;
  const { id } = await params;

  const tx = await prisma.transaction.findUnique({ where: { id }, select: { payrollPayment: { select: { id: true } } } });
  if (!tx) return NextResponse.json({ error: "Kayıt bulunamadı." }, { status: 404 });

  // Personel ödemesinden otomatik oluşan kayıtlar buradan silinemez — çalışan
  // sayfasından yönetilir, tek gerçek kaynak orası olsun diye burada engelleniyor.
  if (tx.payrollPayment) {
    return NextResponse.json({ error: "Bu kayıt bir personel ödemesine bağlı, buradan silinemez." }, { status: 409 });
  }

  await prisma.transaction.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
