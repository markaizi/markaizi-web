import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  // Lazy init — API key sadece runtime'da okunur, build sırasında değil
  const resend = new Resend(process.env.RESEND_API_KEY ?? "");
  try {
    const body = await req.json();
    const { name, email, phone, service, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik." }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: "markaizi İletişim <onboarding@resend.dev>",
      to: ["markaizicom@gmail.com"],
      replyTo: email,
      subject: `[markaizi] Yeni İletişim Formu — ${name}`,
      html: `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#050505;color:#fff;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.1)">
          <div style="background:linear-gradient(135deg,#7c3aed,#a855f7,#ec4899);padding:24px 32px">
            <h1 style="margin:0;font-size:20px;font-weight:700;color:#fff">Yeni İletişim Formu Başvurusu</h1>
            <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:14px">markaizi.com üzerinden gönderildi</p>
          </div>
          <div style="padding:32px">
            <table style="width:100%;border-collapse:collapse">
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#8a8a9a;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;width:140px">Ad Soyad</td>
                <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#fff;font-size:15px">${name}</td>
              </tr>
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#8a8a9a;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px">E-posta</td>
                <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07)"><a href="mailto:${email}" style="color:#c084fc">${email}</a></td>
              </tr>
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#8a8a9a;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px">Telefon</td>
                <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#fff;font-size:15px">${phone || "—"}</td>
              </tr>
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#8a8a9a;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px">Hizmet</td>
                <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#fff;font-size:15px">${service || "—"}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px 12px 0;vertical-align:top;color:#8a8a9a;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px">Mesaj</td>
                <td style="padding:12px 0;color:#8a8a9a;font-size:15px;line-height:1.7">${message.replace(/\n/g, "<br>")}</td>
              </tr>
            </table>
            <div style="margin-top:28px;padding:16px;background:rgba(168,85,247,0.1);border:1px solid rgba(168,85,247,0.25);border-radius:8px">
              <p style="margin:0;font-size:13px;color:#c084fc">Bu mesaja yanıt vermek için doğrudan e-posta gönderin: <a href="mailto:${email}" style="color:#c084fc;font-weight:600">${email}</a></p>
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "E-posta gönderilemedi." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
