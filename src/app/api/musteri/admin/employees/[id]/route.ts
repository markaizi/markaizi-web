import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

const patchSchema = z.object({
  name:     z.string().min(1).max(120).optional(),
  email:    z.string().email().optional(),
  username: z.string().min(2).max(60).regex(/^[a-z0-9_-]+$/, "Kullanıcı adı: küçük harf, rakam, tire, alt çizgi").optional(),
  password: z.string().min(6).max(128).optional(),
  // İş Akışı yetkileri
  workflowAccess: z.boolean().optional(),
  workflowCanCreateCards: z.boolean().optional(),
  workflowCanDragCards: z.boolean().optional(),
  workflowCanWriteRevisionNote: z.boolean().optional(),
  workflowCanDeleteAnyCard: z.boolean().optional(),
  workflowCanManageColumns: z.boolean().optional(),
  // İş kayıtları
  paymentDay: z.number().int().min(1).max(31).nullable().optional(),
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

  const { password, email, username, ...rest } = parsed.data;

  // Unique çakışma kontrolü
  if (email || username) {
    const conditions = [];
    if (email)    conditions.push({ email });
    if (username) conditions.push({ username });
    const conflict = await prisma.user.findFirst({ where: { OR: conditions, NOT: { id } } });
    if (conflict) {
      return NextResponse.json({ error: "Bu e-posta veya kullanıcı adı başka kullanıcıya ait." }, { status: 409 });
    }
  }

  const data: Record<string, unknown> = { ...rest };
  if (email)    data.email = email;
  if (username) data.username = username;
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
  const user = await prisma.user.findUnique({ where: { id }, select: { role: true, username: true, email: true } });
  if (!user || user.role !== "EMPLOYEE") {
    return NextResponse.json({ error: "Çalışan bulunamadı." }, { status: 404 });
  }

  // Soft delete — username/email'i serbest bırak, atama ve notlar korunur
  const suffix = `_deleted_${Date.now()}`;
  await prisma.user.update({
    where: { id },
    data: {
      active: false,
      username: user.username ? `${user.username}${suffix}` : null,
      email: `${user.email}${suffix}`,
    },
  });
  return NextResponse.json({ ok: true });
}
