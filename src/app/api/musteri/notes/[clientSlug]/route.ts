import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ clientSlug: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const { clientSlug } = await params;
  const client = await prisma.client.findUnique({ where: { slug: clientSlug }, select: { id: true } });
  if (!client) return NextResponse.json({ error: "Firma bulunamadı." }, { status: 404 });

  if (session.role === "CLIENT") {
    if (session.clientId !== client.id) return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
  } else if (session.role === "EMPLOYEE") {
    const hit = await prisma.assignment.findFirst({ where: { userId: session.uid, clientId: client.id } });
    if (!hit) return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
  }

  const notes = await prisma.note.findMany({
    where: {
      clientId: client.id,
      ...(session.role === "CLIENT" ? { visibility: "PAYLASIMLI" } : {}),
    },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  // Görüntülenen notları okundu olarak işaretle
  if (notes.length > 0) {
    await prisma.noteRead.createMany({
      data: notes.map((n) => ({ userId: session.uid, noteId: n.id })),
      skipDuplicates: true,
    });
  }

  return NextResponse.json({
    notes: notes.map((n) => ({
      id: n.id,
      text: n.text,
      visibility: n.visibility,
      authorRole: n.authorRole,
      authorName: n.author?.name ?? null,
      createdAt: n.createdAt.toISOString(),
      isOwn: n.authorId === session.uid,
    })),
  });
}

const postSchema = z.object({
  text: z.string().min(1).max(2000),
  visibility: z.enum(["ICERIK", "PAYLASIMLI"]).default("ICERIK"),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ clientSlug: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const { clientSlug } = await params;
  const client = await prisma.client.findUnique({ where: { slug: clientSlug }, select: { id: true } });
  if (!client) return NextResponse.json({ error: "Firma bulunamadı." }, { status: 404 });

  if (session.role === "CLIENT") {
    if (session.clientId !== client.id) return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
    const user = await prisma.user.findUnique({ where: { id: session.uid }, select: { canWriteNotes: true } });
    if (!user?.canWriteNotes) return NextResponse.json({ error: "Not yazma yetkiniz yok." }, { status: 403 });
  } else if (session.role === "EMPLOYEE") {
    const hit = await prisma.assignment.findFirst({ where: { userId: session.uid, clientId: client.id } });
    if (!hit) return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
    const user = await prisma.user.findUnique({ where: { id: session.uid }, select: { canWriteNotes: true } });
    if (!user?.canWriteNotes) return NextResponse.json({ error: "Not yazma yetkiniz yok." }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Geçersiz veri." }, { status: 400 });

  // Müşteriler yalnızca PAYLASIMLI not yazabilir
  const visibility = session.role === "CLIENT" ? "PAYLASIMLI" : parsed.data.visibility;

  const note = await prisma.note.create({
    data: {
      clientId: client.id,
      authorId: session.uid,
      authorRole: session.role,
      text: parsed.data.text,
      visibility,
    },
    include: { author: { select: { name: true } } },
  });

  return NextResponse.json({
    ok: true,
    note: {
      id: note.id,
      text: note.text,
      visibility: note.visibility,
      authorRole: note.authorRole,
      authorName: note.author?.name ?? null,
      createdAt: note.createdAt.toISOString(),
      isOwn: true,
    },
  });
}
