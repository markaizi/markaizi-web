import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

const schema = z.object({
  name:        z.string().min(1).max(120),
  slug:        z.string().min(1).max(60).regex(/^[a-z0-9-]+$/, "Slug: küçük harf, rakam, tire"),
  package:     z.string().min(1).max(120),
  invoiceNote: z.string().max(500).optional(),
  // Opsiyonel: aynı anda müşteri hesabı oluştur
  username: z.string().min(2).max(60).regex(/^[a-z0-9_-]+$/).optional(),
  email:    z.string().email().optional(),
  password: z.string().min(6).max(128).optional(),
});

export async function POST(req: NextRequest) {
  const { err } = await requireAdmin();
  if (err) return err;

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { name, slug, package: pkg, invoiceNote, username, email, password } = parsed.data;

  const existing = await prisma.client.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Bu slug zaten kullanımda." }, { status: 409 });
  }

  // Kullanıcı oluşturulacaksa e-posta/kullanıcı adı çakışması kontrol et
  if (username && email && password) {
    const existingUser = await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } });
    if (existingUser) {
      return NextResponse.json({ error: "Bu kullanıcı adı veya e-posta zaten kullanımda." }, { status: 409 });
    }
  }

  const client = await prisma.client.create({
    data: { name, slug, package: pkg, invoiceNote: invoiceNote || null },
  });

  if (username && email && password) {
    await prisma.user.create({
      data: {
        username, email,
        passwordHash: await bcrypt.hash(password, 12),
        role: "CLIENT",
        clientId: client.id,
        name,
      },
    });
  }

  return NextResponse.json({ ok: true, slug: client.slug });
}
