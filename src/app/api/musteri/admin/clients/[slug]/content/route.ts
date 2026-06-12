import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireStaffForSlug } from "@/lib/staffGuard";
import { ContentStatus } from "@prisma/client";

export const runtime = "nodejs";

const schema = z.object({
  title: z.string().min(1).max(300),
  description: z.string().max(1000).optional(),
  scheduledDate: z.string().refine((v) => !isNaN(new Date(v).getTime()), { message: "Geçersiz tarih." }),
  status: z.nativeEnum(ContentStatus).default("PLANLANDI"),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { session, perms, err } = await requireStaffForSlug(slug);
  if (err) return err;

  // Çalışan için canManageContent yetkisi gerekir
  if (session!.role === "EMPLOYEE" && !perms?.canManageContent) {
    return NextResponse.json({ error: "İçerik ekleme yetkiniz yok." }, { status: 403 });
  }

  const client = await prisma.client.findUnique({ where: { slug } });
  if (!client) return NextResponse.json({ error: "Firma bulunamadı." }, { status: 404 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const item = await prisma.contentItem.create({
    data: {
      clientId: client.id,
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      scheduledDate: new Date(parsed.data.scheduledDate),
      status: parsed.data.status,
      assigneeId: session!.role === "EMPLOYEE" ? session!.uid : null,
    },
  });

  return NextResponse.json({ ok: true, id: item.id });
}
