import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";

export const runtime = "nodejs";

const schema = z.object({
  clientSlug: z.string().min(1),
  severity: z.enum(["YESIL", "SARI", "KIRMIZI"]),
  title: z.string().trim().min(1).max(120),
  body: z.string().trim().min(1).max(2000),
});

// Bu firmaya daha önce gönderilmiş bildirimler — composer'da geçmişi göstermek için.
export async function GET(req: NextRequest) {
  const { err } = await requireAdmin();
  if (err) return err;

  const clientSlug = req.nextUrl.searchParams.get("clientSlug");
  if (!clientSlug) return NextResponse.json({ error: "clientSlug gerekli." }, { status: 400 });

  const client = await prisma.client.findUnique({ where: { slug: clientSlug }, select: { id: true } });
  if (!client) return NextResponse.json({ error: "Firma bulunamadı." }, { status: 404 });

  const items = await prisma.clientNotification.findMany({
    where: { clientId: client.id },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true, severity: true, title: true, body: true, readAt: true, createdAt: true,
      reply: true, repliedAt: true,
    },
  });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const { err } = await requireAdmin();
  if (err) return err;

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const { clientSlug, severity, title, body } = parsed.data;

  const client = await prisma.client.findUnique({ where: { slug: clientSlug }, select: { id: true } });
  if (!client) return NextResponse.json({ error: "Firma bulunamadı." }, { status: 404 });

  await prisma.clientNotification.create({ data: { clientId: client.id, severity, title, body } });
  return NextResponse.json({ ok: true });
}
