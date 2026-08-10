import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { escapeHtml, isValidEmail, cleanStr, cleanPhone, rateLimit, getClientIp } from "@/lib/security";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    // Rate limit: dakikada en fazla 5 istek (IP başına)
    const rl = rateLimit(`contact:${getClientIp(req)}`, 5, 60_000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Çok fazla istek. Lütfen biraz sonra tekrar deneyin." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const body = await req.json();

    // Girdileri temizle ve uzunluk sınırla
    const name = cleanStr(body.name, 120);
    const email = cleanStr(body.email, 254);
    const phone = cleanPhone(body.phone);
    const service = cleanStr(body.service, 80);
    const message = cleanStr(body.message, 5000);

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik." }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Geçersiz e-posta adresi." }, { status: 400 });
    }

    // Önce veritabanına yaz — e-posta gönderimi başarısız olsa bile talep kaybolmasın.
    const submission = await prisma.submission.create({
      data: { type: "CONTACT", data: { name, email, phone, service, message } },
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    try {
      await transporter.sendMail({
      from: `"markaizi İletişim" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `[markaizi] Yeni İletişim Formu — ${name}`.slice(0, 200),
      html: `
        <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#050505;color:#fff;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.1)">
          <div style="background:linear-gradient(135deg,#7c3aed,#a855f7,#ec4899);padding:24px 32px">
            <h1 style="margin:0;font-size:20px;font-weight:700;color:#fff">Yeni İletişim Formu Başvurusu</h1>
            <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:14px">markaizi.com.tr üzerinden gönderildi</p>
          </div>
          <div style="padding:32px">
            <table style="width:100%;border-collapse:collapse">
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#8a8a9a;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;width:140px">Ad Soyad</td>
                <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#fff;font-size:15px">${escapeHtml(name)}</td>
              </tr>
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#8a8a9a;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px">E-posta</td>
                <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07)"><a href="mailto:${encodeURIComponent(email)}" style="color:#c084fc">${escapeHtml(email)}</a></td>
              </tr>
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#8a8a9a;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px">Telefon</td>
                <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#fff;font-size:15px">${escapeHtml(phone) || "—"}</td>
              </tr>
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#8a8a9a;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px">Hizmet</td>
                <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#fff;font-size:15px">${escapeHtml(service) || "—"}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px 12px 0;vertical-align:top;color:#8a8a9a;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px">Mesaj</td>
                <td style="padding:12px 0;color:#8a8a9a;font-size:15px;line-height:1.7">${escapeHtml(message).replace(/\n/g, "<br>")}</td>
              </tr>
            </table>
            <div style="margin-top:28px;padding:16px;background:rgba(168,85,247,0.1);border:1px solid rgba(168,85,247,0.25);border-radius:8px">
              <p style="margin:0;font-size:13px;color:#c084fc">Yanıtlamak için: <a href="mailto:${encodeURIComponent(email)}" style="color:#c084fc;font-weight:600">${escapeHtml(email)}</a></p>
            </div>
          </div>
        </div>
      `,
      });
      await prisma.submission.update({ where: { id: submission.id }, data: { emailSent: true } });
    } catch (err) {
      console.error("Contact e-posta gönderim hatası (talep kaydedildi):", err);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
