import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireWorkflowAccess } from "@/lib/staffGuard";
import { assertCanAccessClient } from "@/lib/auth";

export const runtime = "nodejs";

// Kart, tetikleyici sütuna taşındığında otomatik oluşan İş Kaydı'nın açıklaması
// yalnızca kart başlığı olursa zamanla hangi firmaya ait olduğu unutuluyordu —
// firma adı ve (varsa) çekim tarihi de açıklamaya gömülür.
function buildWorkLogDescription(card: { title: string; dueDate: Date | null; client: { name: string } | null }): string {
  let desc = card.title;
  if (card.client) desc += ` — ${card.client.name}`;
  if (card.dueDate) {
    desc += ` (${card.dueDate.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })})`;
  }
  return desc;
}

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
  const { session, err } = await requireWorkflowAccess();
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
    select: {
      columnId: true,
      assigneeId: true,
      workLog: { select: { id: true, amount: true } },
      column: { select: { adminOnly: true, triggersWorkLog: true } },
    },
  });
  if (!before) return NextResponse.json({ error: "Kart bulunamadı." }, { status: 404 });

  const isAdmin = session!.role === "ADMIN";

  // "Tamamlandı'ya taşıma" yetkisi verilmiş çalışan için gerekli — hem alan
  // bazlı kontrolde hem de aşağıdaki hedef sütun kilidinde kullanılıyor.
  const me = isAdmin ? null : await prisma.user.findUnique({
    where: { id: session!.uid },
    select: { workflowCanCreateCards: true, workflowCanDragCards: true, workflowCanWriteRevisionNote: true, adminCompleteCardsScope: true },
  });

  // Arşivleme yalnızca admin'e açık.
  if (archived !== undefined && !isAdmin) {
    return NextResponse.json({ error: "Kartları yalnızca admin arşivleyebilir." }, { status: 403 });
  }

  // Kart şu an admin-only bir sütundaysa, admin dışında kimse ona dokunamaz
  // (taşıyamaz, düzenleyemez, silemez) — sütun "kilitli" sayılır. "Tamamlandı'ya
  // taşıma" yetkisi bunu aşmaz — kart oraya bir kez taşındıktan sonra herkes için
  // (yetkili çalışan dahil) kilitli kalır, sadece admin dokunabilir.
  if (before.column.adminOnly && !isAdmin) {
    return NextResponse.json({ error: "Bu sütundaki kartlara yalnızca admin dokunabilir." }, { status: 403 });
  }

  // Alan bazlı yetki kontrolü — açıklama (description) hariç her şey ayrı bir
  // yetkiye bağlı: temel alanlar (başlık/öncelik/tarih/atanan/firma) kart açma
  // yetkisi ister, sütun değişikliği (taşıma) sürükleme yetkisi ister, revize
  // notu ise kendi ayrı yetkisini ister. Açıklama, pano erişimi olan herkese açık.
  if (!isAdmin) {
    const wantsMove = rest.columnId !== undefined || rest.sortOrder !== undefined;
    const wantsCoreEdit =
      rest.title !== undefined || rest.priority !== undefined || dueDate !== undefined ||
      rest.assigneeId !== undefined || clientId !== undefined;
    const wantsRevisionNote = rest.revisionNote !== undefined;

    if (wantsMove && !me?.workflowCanDragCards) {
      return NextResponse.json({ error: "Kart taşıma yetkiniz yok." }, { status: 403 });
    }
    if (wantsCoreEdit && !me?.workflowCanCreateCards) {
      return NextResponse.json({ error: "Bu alanları düzenleme yetkiniz yok." }, { status: 403 });
    }
    if (wantsRevisionNote && !me?.workflowCanWriteRevisionNote) {
      return NextResponse.json({ error: "Revize notu yazma yetkiniz yok." }, { status: 403 });
    }
  }

  let toCol: { adminOnly: boolean; triggersWorkLog: boolean; title: string } | null = null;
  if (rest.columnId && rest.columnId !== before.columnId) {
    toCol = await prisma.workflowColumn.findUnique({
      where: { id: rest.columnId },
      select: { adminOnly: true, triggersWorkLog: true, title: true },
    });
    const scope = me?.adminCompleteCardsScope ?? "NONE";
    const canMoveHere =
      isAdmin ||
      (toCol?.title === "Tamamlandı" && (scope === "ALL" || (scope === "OWN" && before.assigneeId === session!.uid)));
    if (toCol?.adminOnly && !canMoveHere) {
      return NextResponse.json({ error: "Bu sütuna yalnızca admin kart taşıyabilir." }, { status: 403 });
    }
  }

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
  // Oluşan/var olan iş kaydı, istemcinin "hemen ücret gir" penceresini açıp
  // açmayacağına karar verebilmesi için yanıtta dönülür.
  let workLog: { id: string; amount: string | null } | null = before.workLog;
  try {
    if (rest.columnId && rest.columnId !== before.columnId) {
      if (toCol?.triggersWorkLog && card.assigneeId && !before.workLog) {
        workLog = await prisma.workLog.create({
          data: { userId: card.assigneeId, date: new Date(), description: buildWorkLogDescription(card), workflowCardId: card.id },
          select: { id: true, amount: true },
        });
      } else if (!toCol?.triggersWorkLog && before.column.triggersWorkLog && before.workLog && before.workLog.amount === null) {
        // Tetikleyici sütundan, henüz fiyatlandırılmamış hâldeyken çıkarıldı — otomatik oluşan kaydı geri al.
        await prisma.workLog.delete({ where: { id: before.workLog.id } });
        workLog = null;
      }
    } else if (rest.assigneeId && card.assigneeId && !before.workLog) {
      // Sütun değişmedi ama atanan kişi eklendi — kart zaten tetikleyici bir sütundaysa iş kaydı oluştur.
      const currentCol = await prisma.workflowColumn.findUnique({ where: { id: card.columnId }, select: { triggersWorkLog: true } });
      if (currentCol?.triggersWorkLog) {
        workLog = await prisma.workLog.create({
          data: { userId: card.assigneeId, date: new Date(), description: buildWorkLogDescription(card), workflowCardId: card.id },
          select: { id: true, amount: true },
        });
      }
    }
  } catch (e) {
    console.error("İş Akışı → İş Kaydı otomasyonu başarısız:", e);
  }

  return NextResponse.json({
    ok: true,
    card: { ...card, dueDate: card.dueDate ? card.dueDate.toISOString().slice(0, 10) : null },
    workLog,
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, err } = await requireWorkflowAccess();
  if (err) return err;
  const { id } = await params;

  const card = await prisma.workflowCard.findUnique({
    where: { id },
    select: { creatorId: true, column: { select: { adminOnly: true } } },
  });
  if (!card) return NextResponse.json({ error: "Kart bulunamadı." }, { status: 404 });

  if (session!.role !== "ADMIN") {
    if (card.column.adminOnly) {
      return NextResponse.json({ error: "Bu sütundaki kartlara yalnızca admin dokunabilir." }, { status: 403 });
    }
    const me = await prisma.user.findUnique({
      where: { id: session!.uid },
      select: { workflowCanDeleteAnyCard: true, workflowCanCreateCards: true },
    });
    const canDeleteOwn = me?.workflowCanCreateCards && card.creatorId === session!.uid;
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
