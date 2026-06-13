import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireStaffForUpdate } from "@/lib/staffGuard";
import { UpdateKind } from "@prisma/client";

export const runtime = "nodejs";

const patchSchema = z.object({
  kind: z.nativeEnum(UpdateKind).optional(),
  text: z.string().min(1).optional(),
  date: z.string().min(1).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { err } = await requireStaffForUpdate(id);
  if (err) return err;

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  await prisma.update.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { err } = await requireStaffForUpdate(id);
  if (err) return err;

  await prisma.update.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
