import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getClientIp, rateLimit } from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Ödeme sonrası dönüş sayfası, kesin sonucu buradan (Bildirim URL'nin yazdığı
// veritabanı durumundan) okur — merchant_ok_url'e yönlenmek ödeme kanıtı değildir.
export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  // Sonuç sayfası bu adresi periyodik yoklar; yine de kod taramasını yavaşlatmak için geniş bir sınır
  const rl = rateLimit(`odeme-durum:${getClientIp(req)}`, 60, 60_000);
  if (!rl.ok) return NextResponse.json({ error: "Çok fazla istek." }, { status: 429 });

  const { code } = await params;
  const link = await prisma.paymentLink.findUnique({ where: { code }, select: { status: true } });
  if (!link) return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
  return NextResponse.json({ status: link.status });
}
