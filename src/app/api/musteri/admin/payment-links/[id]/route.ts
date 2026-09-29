import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

// Linki iptal et — yalnızca henüz ödenmemiş (AKTIF) linkler.
export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { err } = await requireAdmin();
  if (err) return err;
  const { id } = await params;

  const res = await prisma.paymentLink.updateMany({ where: { id, status: "AKTIF" }, data: { status: "IPTAL" } });
  if (res.count === 0) return NextResponse.json({ error: "Link bulunamadı ya da zaten ödenmiş/iptal." }, { status: 400 });
  return NextResponse.json({ ok: true });
}
