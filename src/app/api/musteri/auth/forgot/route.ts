import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/security";

export const runtime = "nodejs";

const schema = z.object({
  username: z.string().trim().min(1).max(60),
});

const GENERIC_OK = NextResponse.json({
  ok: true,
  message: "Hesap bulunduysa şifre sıfırlama bağlantısı e-postanıza gönderildi.",
});

// Kullanıcı adı/e-posta ile şifre sıfırlama talebi. Hesap var/yok bilgisi
// sızdırılmasın diye başarı/başarısızlık fark etmeksizin her zaman aynı
// genel mesaj döner.
export async function POST(req: NextRequest) {
  const rl = rateLimit(`forgot-pw:${getClientIp(req)}`, 5, 15 * 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Çok fazla istek. Lütfen biraz sonra tekrar deneyin." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  let parsed;
  try {
    parsed = schema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const username = parsed.username.toLowerCase();
  const user = await prisma.user.findFirst({
    where: { active: true, OR: [{ username }, { email: username }] },
  });

  if (!user) return GENERIC_OK;

  const token = crypto.randomBytes(32).toString("hex");
  await prisma.passwordResetToken.create({
    data: { userId: user.id, token, expiresAt: new Date(Date.now() + 60 * 60_000) },
  });

  const resetUrl = `https://markaizi.com.tr/musteri/sifre-sifirla?token=${token}`;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    });
    await transporter.sendMail({
      from: `"markaizi Panel" <${process.env.GMAIL_USER}>`,
      to: user.email,
      subject: "markaizi Panel — Şifre Sıfırlama",
      html: `
        <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#050505;color:#fff;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.1)">
          <div style="background:linear-gradient(135deg,#7c3aed,#a855f7,#ec4899);padding:24px 32px">
            <h1 style="margin:0;font-size:20px;font-weight:700;color:#fff">Şifre Sıfırlama Talebi</h1>
          </div>
          <div style="padding:32px">
            <p style="margin:0 0 20px;color:#c0c0d0;font-size:15px;line-height:1.7">
              Merhaba ${user.name}, markaizi panel hesabınız için bir şifre sıfırlama talebi aldık.
              Aşağıdaki bağlantıya tıklayarak yeni bir şifre belirleyebilirsiniz. Bu bağlantı
              <strong>1 saat</strong> geçerlidir.
            </p>
            <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;text-decoration:none;border-radius:999px;font-weight:600;font-size:14px">
              Şifremi Sıfırla
            </a>
            <p style="margin:24px 0 0;color:#8a8a9a;font-size:13px;line-height:1.6">
              Bu talebi siz yapmadıysanız bu e-postayı yok sayabilirsiniz — şifreniz değişmeyecektir.
            </p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("Forgot-password email error:", err);
    // E-posta gönderimi başarısız olsa bile hesap varlığı sızdırılmasın diye
    // yine de genel başarı mesajı dönülür; hata sunucu loglarına düşer.
  }

  return GENERIC_OK;
}
