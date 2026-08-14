import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin, requireAdminOrWorklogPricer } from "@/lib/adminGuard";
import { notifyWorklogPriced } from "@/lib/staffNotify";

export const runtime = "nodejs";

const patchSchema = z.object({
  amount: z.string().max(60).nullable().optional(),
  description: z.string().min(1).max(500).optional(),
  adminNote: z.string().trim().max(500).nullable().optional(),
  date: z.string().min(1).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, err } = await requireAdminOrWorklogPricer();
  if (err) return err;
  const isFullAdmin = session!.role === "ADMIN";

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Geçersiz veri." }, { status: 400 });

  // Ücret girme yetkisi verilmiş çalışan yalnızca ücret/not girebilir — kaydın
  // kendisini (açıklama/tarih) değiştiremez, bu admin'e özel kalır.
  if (!isFullAdmin && (parsed.data.description !== undefined || parsed.data.date !== undefined)) {
    return NextResponse.json({ error: "Bu alanları yalnızca admin değiştirebilir." }, { status: 403 });
  }

  const before = await prisma.workLog.findUnique({ where: { id }, select: { amount: true, userId: true } });
  if (!before) return NextResponse.json({ error: "Kayıt bulunamadı." }, { status: 404 });

  const { date, ...rest } = parsed.data;
  const updated = await prisma.workLog.update({
    where: { id },
    data: {
      ...rest,
      ...(date !== undefined ? { date: new Date(date) } : {}),
    },
  });

  // Ücret ilk kez giriliyorsa (boştan doluya geçtiyse) çalışana bildirim gönder.
  if (!before.amount && updated.amount) {
    notifyWorklogPriced(before.userId, updated.description, updated.amount, updated.adminNote).catch((e) =>
      console.error("[staffNotify] ücret bildirimi başarısız:", e)
    );
  }

  return NextResponse.json({
    ok: true,
    log: {
      id: updated.id,
      date: updated.date.toISOString(),
      description: updated.description,
      amount: updated.amount,
      adminNote: updated.adminNote,
      createdAt: updated.createdAt.toISOString(),
    },
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { err } = await requireAdmin();
  if (err) return err;

  const { id } = await params;
  await prisma.workLog.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
