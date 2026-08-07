import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";
import { getPeriodForDate } from "@/lib/workLogPeriods";

export const runtime = "nodejs";

// Bir çalışanın arşivlenmiş bir döneminin tam kayıtlarını istek üzerine (lazy) getirir.
export async function GET(req: NextRequest) {
  const { err } = await requireAdmin();
  if (err) return err;

  const userId = req.nextUrl.searchParams.get("userId");
  const periodEndParam = req.nextUrl.searchParams.get("periodEnd");
  if (!userId || !periodEndParam) {
    return NextResponse.json({ error: "userId ve periodEnd gerekli." }, { status: 400 });
  }
  const anchor = new Date(periodEndParam);
  if (isNaN(anchor.getTime())) return NextResponse.json({ error: "Geçersiz tarih." }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { paymentDay: true } });
  if (!user) return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
  const period = getPeriodForDate(anchor, user.paymentDay ?? null);

  const logs = await prisma.workLog.findMany({
    where: { userId, date: { gte: period.start, lte: period.end } },
    orderBy: { date: "desc" },
  });

  return NextResponse.json({
    period: { key: period.key, label: period.label },
    logs: logs.map((l) => ({
      id: l.id,
      date: l.date.toISOString(),
      description: l.description,
      amount: l.amount,
    })),
  });
}
