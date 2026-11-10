import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireWorkflowCreateCards } from "@/lib/staffGuard";

export const runtime = "nodejs";

const schema = z.object({
  scheduledDate: z.string().refine((v) => !isNaN(new Date(v).getTime()), { message: "Geçersiz tarih." }),
});

// İş Akışı kartından İçerik Takvimi'ne — kart bir firmaya bağlıysa ve bulunduğu
// sütun "triggersContentItem" ile işaretliyse, kullanıcı yayınlanma tarihini girip
// onaylayınca o firmanın İçerik Takvimi'ne otomatik bir ContentItem eklenir.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, err } = await requireWorkflowCreateCards();
  if (err) return err;
  const { id } = await params;

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const card = await prisma.workflowCard.findUnique({
    where: { id },
    select: {
      title: true,
      description: true,
      clientId: true,
      assigneeId: true,
      contentItem: { select: { id: true } },
      column: { select: { adminOnly: true, triggersContentItem: true } },
    },
  });
  if (!card) return NextResponse.json({ error: "Kart bulunamadı." }, { status: 404 });

  if (card.column.adminOnly && session!.role !== "ADMIN") {
    return NextResponse.json({ error: "Bu sütundaki kartlara yalnızca admin dokunabilir." }, { status: 403 });
  }
  if (!card.column.triggersContentItem) {
    return NextResponse.json({ error: "Bu sütun İçerik Takvimi'ne ekleme için işaretli değil." }, { status: 400 });
  }
  if (!card.clientId) {
    return NextResponse.json({ error: "Kart bir firmaya bağlı değil." }, { status: 400 });
  }
  // Çalışan, yalnızca içerik yönetme yetkisi olduğu bir firmanın takvimine ekleyebilir
  if (session!.role === "EMPLOYEE") {
    const a = await prisma.assignment.findUnique({
      where: { userId_clientId: { userId: session!.uid, clientId: card.clientId } },
      select: { canManageContent: true },
    });
    if (!a?.canManageContent) {
      return NextResponse.json({ error: "Bu firmanın içerik takvimini yönetme yetkiniz yok." }, { status: 403 });
    }
  }
  if (card.contentItem) {
    return NextResponse.json({ error: "Bu kart zaten İçerik Takvimi'ne eklendi." }, { status: 409 });
  }

  const item = await prisma.contentItem.create({
    data: {
      clientId: card.clientId,
      title: card.title,
      description: card.description,
      scheduledDate: new Date(parsed.data.scheduledDate),
      assigneeId: card.assigneeId,
      workflowCardId: id,
    },
    select: { id: true, scheduledDate: true },
  });

  return NextResponse.json({ ok: true, contentItem: item });
}
