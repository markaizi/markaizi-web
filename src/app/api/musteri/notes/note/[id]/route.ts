import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

export const runtime = "nodejs";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const { id } = await params;
  const note = await prisma.note.findUnique({ where: { id }, select: { authorId: true } });
  if (!note) return NextResponse.json({ error: "Not bulunamadı." }, { status: 404 });

  const isAdmin = session.role === "ADMIN";
  const isAuthor = note.authorId === session.uid;
  if (!isAdmin && !isAuthor) return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });

  await prisma.note.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

const patchSchema = z.object({
  text: z.string().min(1).max(2000).optional(),
  visibility: z.enum(["ICERIK", "PAYLASIMLI"]).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const { id } = await params;
  const note = await prisma.note.findUnique({ where: { id }, select: { authorId: true } });
  if (!note) return NextResponse.json({ error: "Not bulunamadı." }, { status: 404 });

  const isAdmin = session.role === "ADMIN";
  const isAuthor = note.authorId === session.uid;
  if (!isAdmin && !isAuthor) return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Geçersiz veri." }, { status: 400 });

  const data: { text?: string; visibility?: "ICERIK" | "PAYLASIMLI" } = {};
  if (parsed.data.text !== undefined) data.text = parsed.data.text;
  if (parsed.data.visibility !== undefined && isAdmin) data.visibility = parsed.data.visibility;

  const updated = await prisma.note.update({
    where: { id },
    data,
    include: { author: { select: { name: true } } },
  });

  return NextResponse.json({
    ok: true,
    note: {
      id: updated.id,
      text: updated.text,
      visibility: updated.visibility,
      authorRole: updated.authorRole,
      authorName: updated.author?.name ?? null,
      createdAt: updated.createdAt.toISOString(),
      isOwn: updated.authorId === session.uid,
    },
  });
}
