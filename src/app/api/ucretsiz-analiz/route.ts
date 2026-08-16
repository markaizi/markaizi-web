import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { escapeHtml, cleanStr, cleanPhone, rateLimit, getClientIp } from "@/lib/security";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const rl = rateLimit(`ucretsiz-analiz:${getClientIp(req)}`, 5, 60_000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Çok fazla istek. Lütfen biraz sonra tekrar deneyin." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const body = await req.json();

    const name = cleanStr(body.name, 120);
    const phone = cleanPhone(body.phone);
    const link = cleanStr(body.link, 200);
    const sector = cleanStr(body.sector, 80);
    const note = cleanStr(body.note, 1000);

    if (!name || !phone || !link) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik." }, { status: 400 });
    }

    const submission = await prisma.submission.create({
      data: { type: "ANALIZ", data: { name, phone, link, sector, note } },
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
        from: `"markaizi Ücretsiz Analiz" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER,
        subject: `[markaizi] Ücretsiz Analiz Talebi — ${name}`.slice(0, 200),
        html: `
        <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#050505;color:#fff;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.1)">
          <div style="background:linear-gradient(135deg,#7c3aed,#a855f7,#ec4899);padding:24px 32px">
            <h1 style="margin:0;font-size:20px;font-weight:700;color:#fff">Yeni Ücretsiz Analiz Talebi</h1>
            <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:14px">markaizi.com.tr/ucretsiz-analiz üzerinden gönderildi</p>
          </div>
          <div style="padding:32px">
            <table style="width:100%;border-collapse:collapse">
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#8a8a9a;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;width:140px">Ad Soyad</td>
                <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#fff;font-size:15px">${escapeHtml(name)}</td>
              </tr>
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#8a8a9a;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px">Telefon</td>
                <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07)"><a href="tel:${encodeURIComponent(phone)}" style="color:#c084fc">${escapeHtml(phone)}</a></td>
              </tr>
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#8a8a9a;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px">Instagram / Site</td>
                <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#fff;font-size:15px">${escapeHtml(link)}</td>
              </tr>
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#8a8a9a;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px">Sektör</td>
                <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#fff;font-size:15px">${escapeHtml(sector) || "—"}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px 12px 0;vertical-align:top;color:#8a8a9a;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px">Not</td>
                <td style="padding:12px 0;color:#8a8a9a;font-size:15px;line-height:1.7">${escapeHtml(note).replace(/\n/g, "<br>") || "—"}</td>
              </tr>
            </table>
            <div style="margin-top:28px;padding:16px;background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.25);border-radius:8px">
              <p style="margin:0;font-size:13px;color:#fbbf24">24-48 saat içinde dönmeyi unutma — WhatsApp: <a href="tel:${encodeURIComponent(phone)}" style="color:#fbbf24;font-weight:600">${escapeHtml(phone)}</a></p>
            </div>
          </div>
        </div>
      `,
      });
      await prisma.submission.update({ where: { id: submission.id }, data: { emailSent: true } });
    } catch (err) {
      console.error("Ücretsiz analiz e-posta gönderim hatası (talep kaydedildi):", err);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Ücretsiz analiz API error:", err);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
