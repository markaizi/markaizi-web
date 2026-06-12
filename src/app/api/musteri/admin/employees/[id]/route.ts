import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

const patchSchema = z.object({
  canWriteNotes: z.boolean().optional(),
  name:     z.string().min(1).max(120).optional(),
  email:    z.string().email().optional(),
  username: z.string().min(2).max(60).regex(/^[a-z0-9_-]+$/, "Kullanıcı adı: küçük harf, rakam, tire, alt çizgi").optional(),
  password: z.string().min(6).max(128).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { err } = await requireAdmin();
  if (err) return err;

  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id }, select: { role: true } });
  if (!user || user.role !== "EMPLOYEE") {
    return NextResponse.json({ error: "Çalışan bulunamadı." }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const { password, ...rest } = parsed.data;
  const data: Record<string, unknown> = { ...rest };
  if (password) data.passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.update({ where: { id }, data });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { err } = await requireAdmin();
  if (err) return err;

  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id }, select: { role: true } });
  if (!user || user.role !== "EMPLOYEE") {
    return NextResponse.json({ error: "Çalışan bulunamadı." }, { status: 404 });
  }

  // Soft delete — atamalar ve notlar korunur
  await prisma.user.update({ where: { id }, data: { active: false } });
  return NextResponse.json({ ok: true });
}
