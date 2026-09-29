import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { fetchIframeToken, newMerchantOid, paytrConfig } from "@/lib/paytr";
import { getClientIp, isValidEmail, rateLimit } from "@/lib/security";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().trim().min(3).max(60),
  email: z.string().trim().max(100),
  phone: z.string().trim().min(10).max(20),
  address: z.string().trim().min(5).max(400),
});

// Ödeme sayfasındaki formdan PayTR iFrame token'ı alır.
export async function POST(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const ip = getClientIp(req);
  const rl = rateLimit(`odeme:${ip}`, 8, 10 * 60_000);
  if (!rl.ok) return NextResponse.json({ error: "Çok fazla deneme. Lütfen biraz sonra tekrar deneyin." }, { status: 429 });

  if (!paytrConfig().configured) {
    return NextResponse.json({ error: "Online ödeme şu anda kullanılamıyor. Lütfen bizimle iletişime geçin." }, { status: 503 });
  }

  const { code } = await params;
  const link = await prisma.paymentLink.findUnique({ where: { code } });
  if (!link || link.status !== "AKTIF") {
    return NextResponse.json({ error: "Bu ödeme linki geçerli değil." }, { status: 404 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success || !isValidEmail(parsed.data.email)) {
    return NextResponse.json({ error: "Lütfen ad soyad, geçerli e-posta, telefon ve adres bilgilerini eksiksiz girin." }, { status: 400 });
  }
  const { name, email, phone, address } = parsed.data;

  const merchantOid = newMerchantOid();
  await prisma.paymentAttempt.create({
    data: {
      merchantOid,
      paymentLinkId: link.id,
      amountKurus: link.amountKurus,
      payerName: name,
      payerEmail: email,
      payerPhone: phone,
      payerAddress: address,
      userIp: ip,
      testMode: paytrConfig().testMode,
    },
  });

  const origin = req.nextUrl.origin;
  const result = await fetchIframeToken({
    userIp: ip,
    merchantOid,
    email,
    amountKurus: link.amountKurus,
    basket: [[link.title.slice(0, 100), (link.amountKurus / 100).toFixed(2), 1]],
    userName: name,
    userAddress: address,
    userPhone: phone,
    okUrl: `${origin}/odeme/${link.code}?sonuc=basarili`,
    failUrl: `${origin}/odeme/${link.code}?sonuc=basarisiz`,
    noInstallment: 0,
    maxInstallment: 0,
  });

  if (!result.ok) {
    await prisma.paymentAttempt.update({
      where: { merchantOid },
      data: { status: "BASARISIZ", failedReasonMsg: result.reason.slice(0, 500), completedAt: new Date() },
    });
    console.error("[paytr] token hatası:", result.reason);
    return NextResponse.json({ error: "Ödeme ekranı açılamadı. Lütfen biraz sonra tekrar deneyin." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, token: result.token });
}
