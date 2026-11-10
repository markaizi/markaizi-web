import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession, reissueSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { rateLimit } from "@/lib/security";

export const runtime = "nodejs";

const patchSchema = z.object({
  name:        z.string().min(1).max(120).optional(),
  email:       z.string().email().optional(),
  password:    z.string().min(6).max(128).optional(),
  oldPassword: z.string().optional(),
});

// Müşteri (CLIENT) kendi profilini günceller.
export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "CLIENT") {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
  }
  const user = await prisma.user.findUnique({ where: { id: session.uid }, select: { active: true, passwordHash: true } });
  if (!user?.active) return NextResponse.json({ error: "Hesabınız devre dışı." }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const { name, email, password, oldPassword } = parsed.data;

  // Oturum açıkken mevcut şifre tahminini sınırla (çalınan çerezle kaba kuvvet denemesine karşı)
  if (password) {
    const rl = rateLimit(`profile-pw:${session.uid}`, 5, 15 * 60_000);
    if (!rl.ok) return NextResponse.json({ error: "Çok fazla deneme. Lütfen biraz sonra tekrar deneyin." }, { status: 429 });
  }

  // Email unique çakışma kontrolü
  if (email) {
    const conflict = await prisma.user.findFirst({ where: { email, NOT: { id: session.uid } } });
    if (conflict) return NextResponse.json({ error: "Bu e-posta başka kullanıcıya ait." }, { status: 409 });
  }

  // Şifre değişikliği varsa eski şifre doğrulanmalı
  if (password) {
    if (!oldPassword) return NextResponse.json({ error: "Mevcut şifrenizi girin." }, { status: 400 });
    const ok = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!ok) return NextResponse.json({ error: "Mevcut şifre yanlış." }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  if (name)     data.name = name;
  if (email)    data.email = email;
  if (password) data.passwordHash = await bcrypt.hash(password, 12);

  if (!Object.keys(data).length) return NextResponse.json({ error: "Değiştirilecek alan yok." }, { status: 400 });

  await prisma.user.update({ where: { id: session.uid }, data });
  // Parola değiştiyse bu cihazın oturumunu yeni sürümle yenile (diğer cihazların oturumları düşer)
  if (password) await reissueSession(session.uid);
  return NextResponse.json({ ok: true });
}
