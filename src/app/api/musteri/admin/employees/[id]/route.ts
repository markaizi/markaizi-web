import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";

export const runtime = "nodejs";

const patchSchema = z.object({
  canWriteNotes: z.boolean().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { err } = await requireAdmin();
  if (err) return err;

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Geçersiz veri." }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id }, select: { role: true } });
  if (!user || user.role !== "EMPLOYEE") {
    return NextResponse.json({ error: "Çalışan bulunamadı." }, { status: 404 });
  }

  await prisma.user.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ ok: true });
}
