import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireStaffForSlug } from "@/lib/staffGuard";
import { ReportPlatform } from "@prisma/client";

export const runtime = "nodejs";

const schema = z.object({
  platform: z.nativeEnum(ReportPlatform),
  month: z.string().min(1).max(60),
  spend: z.string().max(60).nullable().optional(),
  impressions: z.string().max(60).nullable().optional(),
  clicks: z.string().max(60).nullable().optional(),
  summary: z.string().max(2000).nullable().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { session, err } = await requireStaffForSlug(slug);
  if (err) return err;

  const client = await prisma.client.findUnique({ where: { slug } });
  if (!client) return NextResponse.json({ error: "Firma bulunamadı." }, { status: 404 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const report = await prisma.adReport.create({
    data: {
      ...parsed.data,
      clientId: client.id,
      authorId: session!.uid,
    },
  });

  return NextResponse.json({ ok: true, id: report.id });
}
