import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { requireAdmin } from "@/lib/adminGuard";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

const patchSchema = z.object({
  name:        z.string().min(1).max(120).optional(),
  email:       z.string().email().optional(),
  password:    z.string().min(6).max(128).optional(),
  oldPassword: z.string().optional(),
});

export async function PATCH(req: NextRequest) {
  const { err } = await requireAdmin();
  if (err) return err;

  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const { name, email, password, oldPassword } = parsed.data;

  // Şifre değişikliği varsa eski şifre doğrulanmalı
  if (password) {
    if (!oldPassword) return NextResponse.json({ error: "Mevcut şifrenizi girin." }, { status: 400 });
    const user = await prisma.user.findUnique({ where: { id: session.uid }, select: { passwordHash: true } });
    const ok = user && await bcrypt.compare(oldPassword, user.passwordHash);
    if (!ok) return NextResponse.json({ error: "Mevcut şifre yanlış." }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  if (name)     data.name = name;
  if (email)    data.email = email;
  if (password) data.passwordHash = await bcrypt.hash(password, 12);

  if (!Object.keys(data).length) return NextResponse.json({ error: "Değiştirilecek alan yok." }, { status: 400 });

  await prisma.user.update({ where: { id: session.uid }, data });
  return NextResponse.json({ ok: true });
}
