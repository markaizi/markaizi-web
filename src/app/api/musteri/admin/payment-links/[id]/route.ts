import { NextRequest, NextResponse } from "next/server";
import { requirePaymentLinkAccess } from "@/lib/paymentLinkGuard";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

// Linki iptal et — yalnızca henüz ödenmemiş (AKTIF) linkler.
export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { access, err } = await requirePaymentLinkAccess();
  if (err) return err;
  const { id } = await params;

  // Yetkili çalışan yalnızca kendi oluşturduğu linki iptal edebilir
  const own = access!.isAdmin ? {} : { createdById: access!.session.uid };
  const res = await prisma.paymentLink.updateMany({ where: { id, status: "AKTIF", ...own }, data: { status: "IPTAL" } });
  if (res.count === 0) return NextResponse.json({ error: "Link bulunamadı ya da zaten ödenmiş/iptal." }, { status: 400 });
  return NextResponse.json({ ok: true });
}
