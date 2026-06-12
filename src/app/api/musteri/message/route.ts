import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { escapeHtml, cleanStr, rateLimit, getClientIp } from "@/lib/security";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // Yalnızca oturum açmış kullanıcılar mesaj gönderebilir
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
    }

    // Rate limit: IP başına dakikada 5 istek
    const rl = rateLimit(`musteri-msg:${getClientIp(req)}`, 5, 60_000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Çok fazla istek. Lütfen biraz sonra tekrar deneyin." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const body = await req.json();
    const slug    = cleanStr(body.slug, 60);
    const message = cleanStr(body.message, 2000);

    if (!slug || !message) {
      return NextResponse.json({ error: "Mesaj boş olamaz." }, { status: 400 });
    }

    // Müşteri adını DB'den çek ve sahiplik doğrula
    const client = await prisma.client.findUnique({ where: { slug }, select: { id: true, name: true } });
    if (!client) {
      return NextResponse.json({ error: "Firma bulunamadı." }, { status: 404 });
    }

    // CLIENT rolü sadece kendi firmasına mesaj gönderebilir
    if (session.role === "CLIENT" && session.clientId !== client.id) {
      return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
    }

    const clientName = client.name;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"markaizi Müşteri Paneli" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `[Müşteri Paneli] ${clientName} — Yeni Mesaj`,
      html: `
        <div style="font-family:Inter,Arial,sans-serif;max-width:580px;margin:0 auto;background:#050505;color:#fff;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.1)">
          <div style="background:linear-gradient(135deg,#7c3aed,#a855f7,#ec4899);padding:22px 28px">
            <h1 style="margin:0;font-size:18px;font-weight:700;color:#fff">Müşteri Panelinden Mesaj</h1>
            <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:13px">markaizi.com.tr/musteri/${escapeHtml(slug)}</p>
          </div>
          <div style="padding:28px">
            <div style="background:rgba(168,85,247,0.08);border:1px solid rgba(168,85,247,0.2);border-radius:8px;padding:12px 16px;margin-bottom:20px;display:inline-block">
              <span style="font-size:11px;font-weight:700;color:#8a8a9a;text-transform:uppercase;letter-spacing:1px">Müşteri</span><br>
              <span style="font-size:17px;font-weight:800;color:#c084fc">${escapeHtml(clientName)}</span>
            </div>
            <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:16px 20px">
              <p style="margin:0;font-size:15px;color:#c8c8d8;line-height:1.7;white-space:pre-wrap">${escapeHtml(message)}</p>
            </div>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Musteri message API error:", err);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
