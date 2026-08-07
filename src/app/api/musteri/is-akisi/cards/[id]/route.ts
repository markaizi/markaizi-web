import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireWorkflowManageCards, requireWorkflowAccess } from "@/lib/staffGuard";
import { assertCanAccessClient } from "@/lib/auth";

export const runtime = "nodejs";

const patchSchema = z.object({
  title: z.string().trim().min(1).max(160).optional(),
  description: z.string().trim().max(2000).optional().nullable(),
  revisionNote: z.string().trim().max(2000).optional().nullable(),
  priority: z.enum(["DUSUK", "ORTA", "YUKSEK"]).optional(),
  dueDate: z.string().optional().nullable(),
  assigneeId: z.string().optional().nullable(),
  clientId: z.string().optional().nullable(),
  columnId: z.string().optional(),
  sortOrder: z.number().int().optional(),
  archived: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, err } = await requireWorkflowManageCards();
  if (err) return err;
  const { id } = await params;

  const parsed = patchSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { dueDate, clientId, archived, ...rest } = parsed.data;

  if (clientId) {
    try {
      await assertCanAccessClient(session, clientId);
    } catch {
      return NextResponse.json({ error: "Bu firmaya erişim yetkiniz yok." }, { status: 403 });
    }
  }

  const before = await prisma.workflowCard.findUnique({
    where: { id },
    select: { columnId: true, workLog: { select: { id: true, amount: true } } },
  });
  if (!before) return NextResponse.json({ error: "Kart bulunamadı." }, { status: 404 });

  // Sütun değişiyorsa, kartı hedef sütunun sonuna taşı
  let sortOrder = rest.sortOrder;
  if (rest.columnId && sortOrder === undefined) {
    const maxOrder = await prisma.workflowCard.aggregate({
      _max: { sortOrder: true },
      where: { columnId: rest.columnId },
    });
    sortOrder = (maxOrder._max.sortOrder ?? -1) + 1;
  }

  const card = await prisma.workflowCard.update({
    where: { id },
    data: {
      ...rest,
      sortOrder,
      description: rest.description === undefined ? undefined : rest.description || null,
      revisionNote: rest.revisionNote === undefined ? undefined : rest.revisionNote || null,
      assigneeId: rest.assigneeId === undefined ? undefined : rest.assigneeId || null,
      clientId: clientId === undefined ? undefined : clientId || null,
      dueDate: dueDate === undefined ? undefined : dueDate ? new Date(dueDate) : null,
      archivedAt: archived === undefined ? undefined : archived ? new Date() : null,
    },
    include: {
      assignee: { select: { id: true, name: true } },
      creator: { select: { id: true, name: true } },
      client: { select: { slug: true, name: true } },
    },
  });

  // ── İş Akışı → İş Kaydı otomasyonu ──────────────────────────────────────
  // Kartın taşındığı ana zarar vermemek için otomasyon en sona, ayrı bir
  // try/catch içinde — burada bir hata olsa da kart taşıma işlemi başarılı sayılır.
  try {
    if (rest.columnId && rest.columnId !== before.columnId) {
      const [fromCol, toCol] = await Promise.all([
        prisma.workflowColumn.findUnique({ where: { id: before.columnId }, select: { triggersWorkLog: true } }),
        prisma.workflowColumn.findUnique({ where: { id: rest.columnId }, select: { triggersWorkLog: true } }),
      ]);

      if (toCol?.triggersWorkLog && card.assigneeId && !before.workLog) {
        await prisma.workLog.create({
          data: { userId: card.assigneeId, date: new Date(), description: card.title, workflowCardId: card.id },
        });
      } else if (!toCol?.triggersWorkLog && fromCol?.triggersWorkLog && before.workLog && before.workLog.amount === null) {
        // Tetikleyici sütundan, henüz fiyatlandırılmamış hâldeyken çıkarıldı — otomatik oluşan kaydı geri al.
        await prisma.workLog.delete({ where: { id: before.workLog.id } });
      }
    } else if (rest.assigneeId && card.assigneeId && !before.workLog) {
      // Sütun değişmedi ama atanan kişi eklendi — kart zaten tetikleyici bir sütundaysa iş kaydı oluştur.
      const currentCol = await prisma.workflowColumn.findUnique({ where: { id: card.columnId }, select: { triggersWorkLog: true } });
      if (currentCol?.triggersWorkLog) {
        await prisma.workLog.create({
          data: { userId: card.assigneeId, date: new Date(), description: card.title, workflowCardId: card.id },
        });
      }
    }
  } catch (e) {
    console.error("İş Akışı → İş Kaydı otomasyonu başarısız:", e);
  }

  return NextResponse.json({ ok: true, card });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, err } = await requireWorkflowAccess();
  if (err) return err;
  const { id } = await params;

  const card = await prisma.workflowCard.findUnique({ where: { id }, select: { creatorId: true } });
  if (!card) return NextResponse.json({ error: "Kart bulunamadı." }, { status: 404 });

  if (session!.role !== "ADMIN") {
    const me = await prisma.user.findUnique({
      where: { id: session!.uid },
      select: { workflowCanDeleteAnyCard: true, workflowCanManageCards: true },
    });
    const canDeleteOwn = me?.workflowCanManageCards && card.creatorId === session!.uid;
    if (!me?.workflowCanDeleteAnyCard && !canDeleteOwn) {
      return NextResponse.json({ error: "Bu kartı silme yetkiniz yok." }, { status: 403 });
    }
  }

  // Kartı silmek, otomatik oluşan iş kaydını SİLMEZ — WorkLog.workflowCardId
  // onDelete:SetNull ile null'a düşer, ücret/ödeme kaydı korunur (pano temizliği
  // ile bordro kaydı birbirinden bağımsızdır).
  await prisma.workflowCard.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
