import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Ödeme sonrası dönüş sayfası, kesin sonucu buradan (Bildirim URL'nin yazdığı
// veritabanı durumundan) okur — merchant_ok_url'e yönlenmek ödeme kanıtı değildir.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const link = await prisma.paymentLink.findUnique({ where: { code }, select: { status: true } });
  if (!link) return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
  return NextResponse.json({ status: link.status });
}
