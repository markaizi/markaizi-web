import nodemailer from "nodemailer";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function wrap(title: string, bodyHtml: string) {
  return `
    <div style="font-family:Inter,Arial,sans-serif;max-width:580px;margin:0 auto;background:#050505;color:#fff;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.1)">
      <div style="background:linear-gradient(135deg,#7c3aed,#a855f7,#ec4899);padding:22px 28px">
        <h1 style="margin:0;font-size:18px;font-weight:700;color:#fff">${escapeHtml(title)}</h1>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:13px">markaizi Panel</p>
      </div>
      <div style="padding:28px">${bodyHtml}</div>
    </div>
  `;
}

// Panel içindeki olay bildirimleri (müşteri isteği, iş kaydı, kart hareketi) için
// tek noktadan e-posta gönderimi. Hata durumunda çağıran işlemi asla bloklamaz —
// bu yüzden burada fırlatmak yerine sadece loglanır.
export async function sendAdminNotification(subject: string, title: string, bodyHtml: string) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn("sendAdminNotification: GMAIL_USER/GMAIL_APP_PASSWORD tanımlı değil, bildirim gönderilmedi.");
    return;
  }
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    });
    await transporter.sendMail({
      from: `"markaizi Panel" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject,
      html: wrap(title, bodyHtml),
    });
  } catch (e) {
    console.error("sendAdminNotification başarısız:", e);
  }
}

export { escapeHtml };
