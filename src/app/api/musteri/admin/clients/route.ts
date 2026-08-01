import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session || session.role === "CLIENT") {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
  }

  let clients;
  if (session.role === "ADMIN") {
    clients = await prisma.client.findMany({
      where: { active: true },
      select: { id: true, slug: true, name: true },
      orderBy: { name: "asc" },
    });
  } else {
    const assignments = await prisma.assignment.findMany({
      where: { userId: session.uid },
      select: { client: { select: { id: true, slug: true, name: true } } },
    });
    clients = assignments.map(a => a.client);
  }

  return NextResponse.json({ clients });
}

const schema = z.object({
  name:        z.string().min(1).max(120),
  slug:        z.string().min(1).max(60).regex(/^[a-z0-9-]+$/, "Slug: küçük harf, rakam, tire"),
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

  const { name, slug, invoiceNote, username, email, password } = parsed.data;

  // Sistem rotalarıyla çakışmayı engelle
  const RESERVED = ["admin", "calisan", "giris", "takvim", "profil"];
  if (RESERVED.some((r) => slug === r || slug.startsWith(r + "-"))) {
    return NextResponse.json({ error: `"${slug}" rezerve bir slug. Farklı bir slug deneyin.` }, { status: 400 });
  }

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
    data: { name, slug, invoiceNote: invoiceNote || null },
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
