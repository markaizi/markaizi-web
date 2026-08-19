import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireStaffForReport } from "@/lib/staffGuard";
import { ReportPlatform } from "@prisma/client";

export const runtime = "nodejs";

const patchSchema = z.object({
  platform: z.nativeEnum(ReportPlatform).optional(),
  month: z.string().min(1).max(60).optional(),
  spend: z.string().max(60).nullable().optional(),
  impressions: z.string().max(60).nullable().optional(),
  clicks: z.string().max(60).nullable().optional(),
  messages: z.string().max(60).nullable().optional(),
  summary: z.string().max(2000).nullable().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { err } = await requireStaffForReport(id);
  if (err) return err;

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  await prisma.adReport.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { err } = await requireStaffForReport(id);
  if (err) return err;

  await prisma.adReport.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
