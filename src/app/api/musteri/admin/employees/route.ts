import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

export async function GET() {
  const { err } = await requireAdmin();
  if (err) return err;

  const employees = await prisma.user.findMany({
    where: { role: "EMPLOYEE", active: true },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      canWriteNotes: true,
      assignments: {
        select: { id: true, client: { select: { slug: true, name: true } } },
      },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ employees });
}

const schema = z.object({
  username: z.string().min(2).max(60).regex(/^[a-z0-9_-]+$/, "Kullanıcı adı: küçük harf, rakam, tire, alt çizgi"),
  name: z.string().min(1).max(120),
  email: z.string().email(),
  password: z.string().min(6).max(128),
});

export async function POST(req: NextRequest) {
  const { err } = await requireAdmin();
  if (err) return err;

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { username, name, email, password } = parsed.data;

  const existing = await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } });
  if (existing) {
    return NextResponse.json({ error: "Bu kullanıcı adı veya e-posta zaten kullanımda." }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: { username, name, email, passwordHash: await bcrypt.hash(password, 12), role: "EMPLOYEE" },
  });

  return NextResponse.json({ ok: true, id: user.id });
}
