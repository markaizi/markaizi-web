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
  if (!note) return NextResponse.json({ error: "İstek bulunamadı." }, { status: 404 });

  const isAdmin = session.role === "ADMIN";
  const isAuthor = note.authorId === session.uid;
  if (!isAdmin && !isAuthor) return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });

  await prisma.note.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

const patchSchema = z.object({
  text: z.string().min(1).max(2000).optional(),
  status: z.enum(["BEKLIYOR", "YAPILDI"]).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const { id } = await params;
  const note = await prisma.note.findUnique({
    where: { id },
    select: { authorId: true, clientId: true, status: true },
  });
  if (!note) return NextResponse.json({ error: "İstek bulunamadı." }, { status: 404 });

  const isAdmin = session.role === "ADMIN";
  const isAuthor = note.authorId === session.uid;

  let isAssignedEmployee = false;
  if (session.role === "EMPLOYEE") {
    const hit = await prisma.assignment.findFirst({ where: { userId: session.uid, clientId: note.clientId } });
    isAssignedEmployee = !!hit;
  }

  const body = await req.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Geçersiz veri." }, { status: 400 });

  const data: { text?: string; status?: "BEKLIYOR" | "YAPILDI" } = {};

  // Metni sadece isteği yazan müşteri düzenleyebilir
  if (parsed.data.text !== undefined) {
    if (!isAuthor) return NextResponse.json({ error: "Metni sadece isteği oluşturan düzenleyebilir." }, { status: 403 });
    data.text = parsed.data.text;
  }

  // Durumu sadece admin veya firmaya atanmış çalışan değiştirebilir
  if (parsed.data.status !== undefined) {
    if (!isAdmin && !isAssignedEmployee) return NextResponse.json({ error: "Durumu değiştirme yetkiniz yok." }, { status: 403 });
    data.status = parsed.data.status;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Güncellenecek alan yok." }, { status: 400 });
  }

  const updated = await prisma.note.update({
    where: { id },
    data,
    include: { author: { select: { name: true } } },
  });

  // Durum değiştiyse, müşterinin bunu "yeni" olarak görebilmesi için okundu kaydını sil
  if (data.status !== undefined && note.authorId && note.authorId !== session.uid) {
    await prisma.noteRead.deleteMany({ where: { noteId: id, userId: note.authorId } });
  }

  return NextResponse.json({
    ok: true,
    note: {
      id: updated.id,
      text: updated.text,
      status: updated.status,
      authorRole: updated.authorRole,
      authorName: updated.author?.name ?? null,
      createdAt: updated.createdAt.toISOString(),
      isOwn: updated.authorId === session.uid,
    },
  });
}
