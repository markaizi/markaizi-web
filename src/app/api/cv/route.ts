import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { escapeHtml, isValidEmail, cleanStr, cleanPhone, rateLimit, getClientIp } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const rl = rateLimit(`cv:${getClientIp(req)}`, 3, 60_000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Çok fazla istek. Lütfen biraz sonra tekrar deneyin." },
        { status: 429 }
      );
    }

    const body = await req.json();

    const name          = cleanStr(body.name, 120);
    const email         = cleanStr(body.email, 254);
    const phone         = cleanPhone(body.phone);
    const age           = cleanStr(body.age, 10);
    const medeni        = cleanStr(body.medeni, 30);
    const ucretBeklenti = cleanStr(body.ucretBeklenti, 100);
    const experience    = cleanStr(body.experience, 80);
    const programs      = Array.isArray(body.programs) ? body.programs.map((p: string) => cleanStr(p, 60)).join(", ") : "";
    const sosyalMedya   = Array.isArray(body.sosyalMedya) ? body.sosyalMedya.map((p: string) => cleanStr(p, 100)).join(", ") : "";
    const metaGoogle    = cleanStr(body.metaGoogle, 3000);
    const usesAi        = cleanStr(body.usesAi, 20);
    const aiTools       = cleanStr(body.aiTools, 3000);
    const about         = cleanStr(body.about, 3000);

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik." }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Geçersiz e-posta adresi." }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    });

    const row = (label: string, value: string) => value ? `
      <tr>
        <td style="padding:11px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#8a8a9a;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;width:160px;vertical-align:top">${label}</td>
        <td style="padding:11px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#fff;font-size:14px;line-height:1.6">${value}</td>
      </tr>` : "";

    await transporter.sendMail({
      from: `"markaizi İK" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `[İş Başvurusu] ${name}`.slice(0, 200),
      html: `
        <div style="font-family:Inter,Arial,sans-serif;max-width:620px;margin:0 auto;background:#050505;color:#fff;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.1)">
          <div style="background:linear-gradient(135deg,#7c3aed,#a855f7,#ec4899);padding:24px 32px">
            <h1 style="margin:0;font-size:20px;font-weight:700;color:#fff">Yeni İş Başvurusu</h1>
            <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:14px">markaizi.com.tr/cv</p>
          </div>
          <div style="padding:32px">
            <table style="width:100%;border-collapse:collapse">
              ${row("Ad Soyad",        escapeHtml(name))}
              ${row("E-posta",         `<a href="mailto:${encodeURIComponent(email)}" style="color:#c084fc">${escapeHtml(email)}</a>`)}
              ${row("Telefon",         escapeHtml(phone))}
              ${row("Yaş",             escapeHtml(age))}
              ${row("Medeni Durum",    escapeHtml(medeni))}
              ${row("Ücret Beklenti",  escapeHtml(ucretBeklenti))}
              ${row("Kurgu Tecrübesi", escapeHtml(experience))}
              ${row("Programlar",      escapeHtml(programs))}
              ${row("Sosyal Medya",    escapeHtml(sosyalMedya))}
              ${row("Meta / Google",   metaGoogle ? escapeHtml(metaGoogle).replace(/\n/g, "<br>") : "")}
              ${row("YZ Araçları",     usesAi === "evet"
                ? `<strong>Evet</strong><br><span style="color:#ccc">${escapeHtml(aiTools).replace(/\n/g, "<br>") || "Belirtilmedi"}</span>`
                : "Hayır"
              )}
              ${row("Hakkında",        escapeHtml(about).replace(/\n/g, "<br>"))}
            </table>
            <div style="margin-top:24px;padding:16px;background:rgba(168,85,247,0.1);border:1px solid rgba(168,85,247,0.25);border-radius:8px">
              <p style="margin:0;font-size:13px;color:#c084fc">Yanıtlamak için: <a href="mailto:${encodeURIComponent(email)}" style="color:#c084fc;font-weight:600">${escapeHtml(email)}</a></p>
            </div>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("CV API error:", err);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
