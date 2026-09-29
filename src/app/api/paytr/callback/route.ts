import { NextRequest } from "next/server";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/db";
import { formatKurus, verifyCallbackHash } from "@/lib/paytr";
import { escapeHtml } from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ok = () => new Response("OK", { headers: { "Content-Type": "text/plain" } });

// PayTR Bildirim URL (iFrame API 2. adım). Mağaza panelinde tanımlanacak adres:
// https://markaizi.com.tr/api/paytr/callback
// - Hash doğrulanmadan hiçbir işlem yapılmaz.
// - Aynı sipariş için birden fazla bildirim gelebilir: yalnızca ilki işlenir.
// - Yanıt her zaman düz metin "OK" (aksi halde PayTR bildirimi tekrarlar).
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const get = (k: string) => String(form.get(k) ?? "");
  const merchantOid = get("merchant_oid");
  const status = get("status");
  const totalAmount = get("total_amount");

  if (!verifyCallbackHash(merchantOid, status, totalAmount, get("hash"))) {
    console.error("[paytr] geçersiz hash, bildirim reddedildi:", merchantOid);
    return new Response("PAYTR notification failed: bad hash", { status: 400 });
  }

  const attempt = await prisma.paymentAttempt.findUnique({
    where: { merchantOid },
    include: { paymentLink: true },
  });
  if (!attempt) {
    console.error("[paytr] bilinmeyen sipariş:", merchantOid);
    return ok();
  }
  if (attempt.status !== "BEKLIYOR") return ok(); // tekrar eden bildirim

  const testMode = get("test_mode") === "1";

  if (status !== "success") {
    await prisma.paymentAttempt.updateMany({
      where: { id: attempt.id, status: "BEKLIYOR" },
      data: {
        status: "BASARISIZ",
        failedReasonCode: get("failed_reason_code").slice(0, 50) || null,
        failedReasonMsg: get("failed_reason_msg").slice(0, 500) || null,
        testMode,
        completedAt: new Date(),
      },
    });
    return ok();
  }

  const link = attempt.paymentLink;
  let firstSuccess = false;
  await prisma.$transaction(async (tx) => {
    const updated = await tx.paymentAttempt.updateMany({
      where: { id: attempt.id, status: "BEKLIYOR" },
      data: {
        status: "BASARILI",
        totalAmountKurus: Number(totalAmount) || null,
        paymentType: get("payment_type").slice(0, 20) || null,
        testMode,
        completedAt: new Date(),
      },
    });
    if (updated.count === 0) return; // eşzamanlı ikinci bildirim
    firstSuccess = true;

    // Test ödemeleri Ekonomi'ye gelir olarak yazılmaz
    let transactionId: string | null = null;
    if (!testMode) {
      const t = await tx.transaction.create({
        data: {
          type: "GELIR",
          amount: String(Math.round(attempt.amountKurus / 100)),
          description: `PayTR · ${link.title}`.slice(0, 200),
          date: new Date(),
        },
      });
      transactionId = t.id;
    }
    await tx.paymentLink.updateMany({
      where: { id: link.id, status: "AKTIF" },
      data: { status: "ODENDI", paidAt: new Date(), transactionId },
    });
  });

  if (firstSuccess) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
      });
      await transporter.sendMail({
        from: `"markaizi Ödeme" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER,
        subject: `${testMode ? "[TEST] " : ""}Ödeme alındı: ${formatKurus(attempt.amountKurus)} · ${link.title}`.slice(0, 200),
        html: `<p><b>${escapeHtml(link.title)}</b> için ${escapeHtml(formatKurus(attempt.amountKurus))} ödeme alındı${testMode ? " (TEST MODU)" : ""}.</p>
<p>Ödeyen: ${escapeHtml(attempt.payerName)} · ${escapeHtml(attempt.payerEmail)} · ${escapeHtml(attempt.payerPhone)}<br>Sipariş no: ${escapeHtml(merchantOid)}</p>`,
      });
    } catch (e) {
      console.error("[paytr] bildirim e-postası gönderilemedi:", e);
    }
  }

  return ok();
}
