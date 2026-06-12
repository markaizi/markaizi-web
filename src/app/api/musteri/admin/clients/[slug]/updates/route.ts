import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireStaffForSlug } from "@/lib/staffGuard";
import { UpdateKind } from "@prisma/client";

export const runtime = "nodejs";

const schema = z.object({
  kind: z.nativeEnum(UpdateKind),
  text: z.string().min(1).max(2000),
  date: z.string().refine((v) => !isNaN(new Date(v).getTime()), { message: "Geçersiz tarih." }),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { session, perms, err } = await requireStaffForSlug(slug);
  if (err) return err;

  // Çalışan için canManageUpdates yetkisi gerekir
  if (session!.role === "EMPLOYEE" && !perms?.canManageUpdates) {
    return NextResponse.json({ error: "Güncelleme ekleme yetkiniz yok." }, { status: 403 });
  }

  const client = await prisma.client.findUnique({ where: { slug } });
  if (!client) return NextResponse.json({ error: "Firma bulunamadı." }, { status: 404 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const update = await prisma.update.create({
    data: {
      clientId: client.id,
      authorId: session!.uid,
      kind: parsed.data.kind,
      text: parsed.data.text,
      date: new Date(parsed.data.date),
    },
  });

  return NextResponse.json({ ok: true, id: update.id });
}
