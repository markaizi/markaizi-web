import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";
import { Platform, CampaignStatus } from "@prisma/client";

export const runtime = "nodejs";

const schema = z.object({
  platform: z.nativeEnum(Platform),
  name: z.string().min(1).max(200),
  dailyBudget: z.string().min(1).max(100),
  status: z.nativeEnum(CampaignStatus).default("AKTIF"),
  ongoing: z.boolean().default(false),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
});

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

  const { startDate, endDate, ...rest } = parsed.data;
  const campaign = await prisma.campaign.create({
    data: {
      ...rest,
      clientId: client.id,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    },
  });

  return NextResponse.json({ ok: true, id: campaign.id });
}
