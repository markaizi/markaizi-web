import { NextRequest, NextResponse } from "next/server";
import { fetchPayTRIframeToken, generateOrderId } from "@/lib/paytr";
import { getPackage } from "@/lib/packages";
import { isValidEmail, cleanStr, cleanPhone, rateLimit, getClientIp } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    // Rate limit: dakikada en fazla 8 token isteği (IP başına)
    const clientIp = getClientIp(req);
    const rl = rateLimit(`paytr-token:${clientIp}`, 8, 60_000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Çok fazla deneme. Lütfen biraz sonra tekrar deneyin." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const body = await req.json();
    const paket = cleanStr(body.paket, 60);
    const name = cleanStr(body.name, 120);
    const email = cleanStr(body.email, 254);
    const phone = cleanPhone(body.phone);

    if (!paket || !name || !email || !phone) {
      return NextResponse.json({ error: "Eksik alan" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Geçersiz e-posta adresi." }, { status: 400 });
    }

    const pkg = getPackage(paket);
    if (!pkg) {
      return NextResponse.json({ error: "Geçersiz paket" }, { status: 400 });
    }

    // Kullanıcı IP (PayTR token hash'inde kullanılır)
    const userIp = clientIp === "unknown" ? "127.0.0.1" : clientIp;

    const merchantOid = generateOrderId();

    const result = await fetchPayTRIframeToken({
      userIp,
      merchantOid,
      email,
      paymentAmount: pkg.priceKurus,
      basketName: pkg.fullName,
      userName: name,
      userPhone: phone,
      userAddress: "Ankara, Turkiye",
    });

    if (result.status !== "success" || !result.token) {
      console.error("[PayTR] Token alınamadı:", result);
      return NextResponse.json(
        { error: result.reason ?? "Ödeme sistemi bağlanamadı" },
        { status: 500 }
      );
    }

    return NextResponse.json({ token: result.token, orderId: merchantOid });
  } catch (err) {
    console.error("[PayTR token] Hata:", err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
