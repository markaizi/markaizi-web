import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";
import { InvoiceStatus } from "@prisma/client";

export const runtime = "nodejs";

const patchSchema = z.object({
  status: z.nativeEnum(InvoiceStatus).optional(),
  amount: z.string().min(1).max(100).optional(),
  period: z.string().min(1).max(100).optional(),
  dueDate: z.string().nullable().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { err } = await requireAdmin();
  if (err) return err;

  const { id } = await params;
  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { dueDate, ...rest } = parsed.data;
  await prisma.invoice.update({
    where: { id },
    data: {
      ...rest,
      ...(dueDate !== undefined ? { dueDate: dueDate ? new Date(dueDate) : null } : {}),
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { err } = await requireAdmin();
  if (err) return err;

  const { id } = await params;
  await prisma.invoice.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
