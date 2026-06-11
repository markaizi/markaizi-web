import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";

export const runtime = "nodejs";

const schema = z.object({
  userId: z.string().min(1),
  clientSlug: z.string().min(1),
  canViewCampaigns: z.boolean().default(true),
  canManageContent: z.boolean().default(true),
  canManageUpdates: z.boolean().default(true),
  canViewInvoices: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  const { err } = await requireAdmin();
  if (err) return err;

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { userId, clientSlug, ...perms } = parsed.data;

  const client = await prisma.client.findUnique({ where: { slug: clientSlug } });
  if (!client) return NextResponse.json({ error: "Firma bulunamadı." }, { status: 404 });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== "EMPLOYEE") {
    return NextResponse.json({ error: "Çalışan bulunamadı." }, { status: 404 });
  }

  const assignment = await prisma.assignment.upsert({
    where: { userId_clientId: { userId, clientId: client.id } },
    create: { userId, clientId: client.id, ...perms },
    update: perms,
  });

  return NextResponse.json({ ok: true, id: assignment.id });
}
