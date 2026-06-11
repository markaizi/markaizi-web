import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireCampaignManageById } from "@/lib/staffGuard";
import { CampaignStatus } from "@prisma/client";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().min(1).max(200).optional(),
  dailyBudget: z.string().min(1).max(100).optional(),
  status: z.nativeEnum(CampaignStatus).optional(),
  ongoing: z.boolean().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { err } = await requireCampaignManageById(id);
  if (err) return err;

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { startDate, endDate, ...rest } = parsed.data;
  await prisma.campaign.update({
    where: { id },
    data: {
      ...rest,
      ...(startDate !== undefined ? { startDate: startDate ? new Date(startDate) : null } : {}),
      ...(endDate !== undefined ? { endDate: endDate ? new Date(endDate) : null } : {}),
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { err } = await requireCampaignManageById(id);
  if (err) return err;

  await prisma.campaign.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
