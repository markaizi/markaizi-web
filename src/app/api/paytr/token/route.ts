import { NextRequest, NextResponse } from "next/server";
import { fetchPayTRIframeToken, generateOrderId } from "@/lib/paytr";
import { getPackage } from "@/lib/packages";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { paket, name, email, phone } = body as {
      paket: string;
      name: string;
      email: string;
      phone: string;
    };

    if (!paket || !name || !email || !phone) {
      return NextResponse.json({ error: "Eksik alan" }, { status: 400 });
    }

    const pkg = getPackage(paket);
    if (!pkg) {
      return NextResponse.json({ error: "Geçersiz paket" }, { status: 400 });
    }

    // Kullanıcı IP
    const forwarded = req.headers.get("x-forwarded-for");
    const userIp = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

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
