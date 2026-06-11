import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireStaffForContentItem } from "@/lib/staffGuard";
import { ContentStatus } from "@prisma/client";

export const runtime = "nodejs";

const patchSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  description: z.string().max(1000).nullable().optional(),
  scheduledDate: z.string().optional(),
  status: z.nativeEnum(ContentStatus).optional(),
  publishedAt: z.string().nullable().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { err } = await requireStaffForContentItem(id);
  if (err) return err;

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { scheduledDate, publishedAt, ...rest } = parsed.data;
  await prisma.contentItem.update({
    where: { id },
    data: {
      ...rest,
      ...(scheduledDate !== undefined ? { scheduledDate: new Date(scheduledDate) } : {}),
      ...(publishedAt !== undefined ? { publishedAt: publishedAt ? new Date(publishedAt) : null } : {}),
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { err } = await requireStaffForContentItem(id);
  if (err) return err;

  await prisma.contentItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
