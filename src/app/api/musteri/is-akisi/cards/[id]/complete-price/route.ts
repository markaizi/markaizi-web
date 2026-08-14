import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireWorkflowAccess } from "@/lib/staffGuard";
import { notifyWorklogPriced } from "@/lib/staffNotify";

export const runtime = "nodejs";

const schema = z.object({
  amount: z.string().trim().min(1).max(60),
  adminNote: z.string().trim().max(500).optional().nullable(),
});

// Kart "Tamamlandı"ya taşınırken oluşan iş kaydını, taşıyan kişi hemen aynı
// akışta fiyatlandırabilsin diye — Ücret Girişi sayfasına ayrı gitmeye gerek
// kalmasın. Yetki, kartı Tamamlandı'ya taşıma yetkisiyle birebir aynıdır
// (adminCompleteCardsScope) — ayrıca "çalışanlara ücret girme" yetkisi gerekmez.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, err } = await requireWorkflowAccess();
  if (err) return err;
  const { id } = await params;

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Geçersiz veri." }, { status: 400 });

  const card = await prisma.workflowCard.findUnique({
    where: { id },
    select: {
      assigneeId: true,
      column: { select: { title: true } },
      workLog: { select: { id: true, amount: true, description: true } },
    },
  });
  if (!card) return NextResponse.json({ error: "Kart bulunamadı." }, { status: 404 });
  if (!card.workLog) return NextResponse.json({ error: "Bu kartın iş kaydı yok." }, { status: 400 });
  if (card.workLog.amount) return NextResponse.json({ error: "Bu kayıt zaten fiyatlandırılmış." }, { status: 400 });

  const isAdmin = session!.role === "ADMIN";
  if (!isAdmin) {
    const me = await prisma.user.findUnique({ where: { id: session!.uid }, select: { adminCompleteCardsScope: true } });
    const scope = me?.adminCompleteCardsScope ?? "NONE";
    const authorized =
      card.column.title === "Tamamlandı" &&
      (scope === "ALL" || (scope === "OWN" && card.assigneeId === session!.uid));
    if (!authorized) return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
  }

  const { amount, adminNote } = parsed.data;
  const updated = await prisma.workLog.update({
    where: { id: card.workLog.id },
    data: { amount, adminNote: adminNote || null },
    select: { id: true, amount: true, adminNote: true },
  });

  if (card.assigneeId && card.assigneeId !== session!.uid) {
    notifyWorklogPriced(card.assigneeId, card.workLog.description, amount, adminNote ?? null).catch((e) =>
      console.error("[staffNotify] tamamlandı-anı ücret bildirimi başarısız:", e)
    );
  }

  return NextResponse.json({ ok: true, workLog: updated });
}
