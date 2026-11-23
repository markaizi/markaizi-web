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

  // Test modu: PayTR'nin hash'i test_mode alanını kapsamaz; bu yüzden token alınırken
  // kaydedilen attempt.testMode asıl kaynaktır, bildirimdeki alan yalnızca ek sinyal.
  const testMode = attempt.testMode || get("test_mode") === "1";

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

  // Tutar doğrulaması: ödenen tutar link tutarından az olamaz (taksit komisyonu fazla olabilir).
  const paidKurus = Number(totalAmount);
  if (!Number.isFinite(paidKurus) || paidKurus < attempt.amountKurus) {
    console.error("[paytr] tutar uyuşmuyor, ödeme işlenmedi:", merchantOid, totalAmount, attempt.amountKurus);
    await prisma.paymentAttempt.updateMany({
      where: { id: attempt.id, status: "BEKLIYOR" },
      data: {
        status: "BASARISIZ",
        failedReasonMsg: `Tutar uyuşmazlığı: beklenen ${attempt.amountKurus}, gelen ${totalAmount}`.slice(0, 500),
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

    // Önce linki kapat: aynı link için eşzamanlı iki başarılı bildirim gelirse yalnızca
    // ilki (count > 0) Kasa'ya yazar → mükerrer kayıt oluşmaz.
    const closed = await tx.paymentLink.updateMany({
      where: { id: link.id, status: "AKTIF" },
      data: { status: "ODENDI", paidAt: new Date() },
    });

    // Test ödemeleri Kasa'ya yazılmaz. v3.5.0: tek kaynak Kasa — firmaya bağlı linkte aynı
    // tutardaki en eski bekleyen müşteri alacağı "alındı" yapılır; yoksa yeni gelir kaydı açılır.
    if (closed.count > 0 && !testMode) {
      const amount = Math.round(attempt.amountKurus / 100);
      const pending = link.clientId
        ? await tx.kasaEntry.findFirst({
            where: {
              clientId: link.clientId, deletedAt: null, status: "BEKLIYOR", amount,
              category: "Müşteri Ödemesi", direction: { in: ["ALACAK", "GELIR"] },
            },
            orderBy: { dueDate: "asc" },
            select: { id: true },
          })
        : null;
      if (pending) {
        await tx.kasaEntry.update({
          where: { id: pending.id },
          data: { status: "ODENDI", paidAt: new Date(), notes: `PayTR · ${link.title}`.slice(0, 200) },
        });
      } else {
        await tx.kasaEntry.create({
          data: {
            title: `PayTR · ${link.title}`.slice(0, 200), amount, direction: "GELIR",
            category: link.clientId ? "Müşteri Ödemesi" : "genel", status: "ODENDI",
            paidAt: new Date(), dueDate: new Date(), clientId: link.clientId,
          },
        });
      }
    }
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
