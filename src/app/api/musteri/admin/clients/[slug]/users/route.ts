import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

const schema = z.object({
  username: z.string().min(2).max(60).regex(/^[a-z0-9_-]+$/, "Kullanıcı adı: küçük harf, rakam, tire, alt çizgi"),
  name: z.string().min(1).max(120),
  email: z.string().email(),
  password: z.string().min(6).max(128),
});

// POST: yeni müşteri kullanıcısı oluştur veya şifreyi güncelle
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { err } = await requireAdmin();
  if (err) return err;

  const { slug } = await params;
  const client = await prisma.client.findUnique({ where: { slug } });
  if (!client) return NextResponse.json({ error: "Firma bulunamadı." }, { status: 404 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { username, name, email, password } = parsed.data;
  const passwordHash = await bcrypt.hash(password, 12);

  // username veya email varsa → şifre + bilgi güncelle
  const existing = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
  });

  if (existing) {
    if (existing.clientId !== client.id) {
      return NextResponse.json({ error: "Bu kullanıcı adı/e-posta başka firmaya ait." }, { status: 409 });
    }
    await prisma.user.update({
      where: { id: existing.id },
      data: { name, email, passwordHash },
    });
    return NextResponse.json({ ok: true, updated: true });
  }

  await prisma.user.create({
    data: {
      username,
      name,
      email,
      passwordHash,
      role: "CLIENT",
      clientId: client.id,
    },
  });

  return NextResponse.json({ ok: true, created: true });
}

const patchSchema = z.object({
  canWriteNotes: z.boolean(),
});

// PATCH: müşteri kullanıcısının canWriteNotes bayrağını güncelle
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { err } = await requireAdmin();
  if (err) return err;

  const { slug } = await params;
  const client = await prisma.client.findUnique({ where: { slug }, select: { id: true } });
  if (!client) return NextResponse.json({ error: "Firma bulunamadı." }, { status: 404 });

  const user = await prisma.user.findFirst({ where: { clientId: client.id, role: "CLIENT" } });
  if (!user) return NextResponse.json({ error: "Müşteri kullanıcısı bulunamadı." }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Geçersiz veri." }, { status: 400 });

  await prisma.user.update({ where: { id: user.id }, data: parsed.data });
  return NextResponse.json({ ok: true });
}
