import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { logDigestEvent } from "@/lib/digest";

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
    where: { clientId: client.id },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  // Görüntülenen istekleri okundu olarak işaretle
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
      status: n.status,
      authorRole: n.authorRole,
      authorName: n.author?.name ?? null,
      createdAt: n.createdAt.toISOString(),
      isOwn: n.authorId === session.uid,
    })),
  });
}

const postSchema = z.object({
  text: z.string().min(1).max(2000),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ clientSlug: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  // Sadece müşteri isteği yazabilir
  if (session.role !== "CLIENT") {
    return NextResponse.json({ error: "İstek yalnızca müşteri tarafından oluşturulabilir." }, { status: 403 });
  }

  const { clientSlug } = await params;
  const client = await prisma.client.findUnique({ where: { slug: clientSlug }, select: { id: true, name: true } });
  if (!client) return NextResponse.json({ error: "Firma bulunamadı." }, { status: 404 });
  if (session.clientId !== client.id) return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Geçersiz veri." }, { status: 400 });

  const note = await prisma.note.create({
    data: {
      clientId: client.id,
      authorId: session.uid,
      authorRole: session.role,
      text: parsed.data.text,
      status: "BEKLIYOR",
    },
    include: { author: { select: { name: true } } },
  });

  await logDigestEvent("NOTE", `${client.name}: ${parsed.data.text}`);

  return NextResponse.json({
    ok: true,
    note: {
      id: note.id,
      text: note.text,
      status: note.status,
      authorRole: note.authorRole,
      authorName: note.author?.name ?? null,
      createdAt: note.createdAt.toISOString(),
      isOwn: true,
    },
  });
}
