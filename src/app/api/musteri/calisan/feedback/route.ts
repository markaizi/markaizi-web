import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { escapeHtml, rateLimit, getClientIp } from "@/lib/security";

export const runtime = "nodejs";

const schema = z.object({ message: z.string().trim().min(1).max(2000) });

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "EMPLOYEE") return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const rl = rateLimit(`staff-feedback:${getClientIp(req)}`, 5, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Çok fazla istek. Lütfen biraz sonra tekrar deneyin." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Mesaj boş olamaz." }, { status: 400 });

  const feedback = await prisma.staffFeedback.create({
    data: { userId: session.uid, message: parsed.data.message },
  });

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    });
    await transporter.sendMail({
      from: `"markaizi Çalışan Paneli" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `[Çalışan Paneli] ${session.name} — İstek/Şikayet`,
      html: `
        <div style="font-family:Inter,Arial,sans-serif;max-width:580px;margin:0 auto;background:#050505;color:#fff;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.1)">
          <div style="background:linear-gradient(135deg,#7c3aed,#a855f7,#ec4899);padding:22px 28px">
            <h1 style="margin:0;font-size:18px;font-weight:700;color:#fff">Çalışan Panelinden İstek/Şikayet</h1>
          </div>
          <div style="padding:28px">
            <div style="background:rgba(168,85,247,0.08);border:1px solid rgba(168,85,247,0.2);border-radius:8px;padding:12px 16px;margin-bottom:20px;display:inline-block">
              <span style="font-size:11px;font-weight:700;color:#8a8a9a;text-transform:uppercase;letter-spacing:1px">Çalışan</span><br>
              <span style="font-size:17px;font-weight:800;color:#c084fc">${escapeHtml(session.name)}</span>
            </div>
            <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:16px 20px">
              <p style="margin:0;font-size:15px;color:#c8c8d8;line-height:1.7;white-space:pre-wrap">${escapeHtml(parsed.data.message)}</p>
            </div>
          </div>
        </div>
      `,
    });
  } catch (e) {
    // E-posta başarısız olsa bile mesaj DB'de kaydedildi — admin panelden görecek.
    console.error("[staff-feedback] e-posta gönderimi başarısız:", e);
  }

  return NextResponse.json({ ok: true, id: feedback.id });
}
