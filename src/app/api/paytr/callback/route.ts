import { NextRequest, NextResponse } from "next/server";
import { verifyPayTRCallback } from "@/lib/paytr";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const merchantOid = formData.get("merchant_oid") as string;
    const status = formData.get("status") as string;
    const totalAmount = formData.get("total_amount") as string;
    const hash = formData.get("hash") as string;

    if (!merchantOid || !status || !totalAmount || !hash) {
      return new NextResponse("INVALID", { status: 400 });
    }

    const isValid = verifyPayTRCallback(merchantOid, status, totalAmount, hash);

    if (!isValid) {
      console.error("[PayTR callback] Hash doğrulama başarısız:", { merchantOid, status });
      return new NextResponse("INVALID_HASH", { status: 400 });
    }

    if (status === "success") {
      // Ödeme başarılı — burada gerekirse DB kayıt veya e-posta gönderimi yapılabilir.
      console.log(`[PayTR] Ödeme başarılı: ${merchantOid} — ${totalAmount} kuruş`);
    } else {
      console.log(`[PayTR] Ödeme başarısız: ${merchantOid} — status: ${status}`);
    }

    // PayTR 'OK' döndürülmesini zorunlu kılar
    return new NextResponse("OK", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (err) {
    console.error("[PayTR callback] Hata:", err);
    return new NextResponse("ERROR", { status: 500 });
  }
}
