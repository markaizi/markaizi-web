import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getPeriodForDate } from "@/lib/workLogPeriods";

export const runtime = "nodejs";

// Arşivlenmiş bir dönemin tam kayıtlarını istek üzerine (lazy) getirir.
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  if (session.role !== "EMPLOYEE") return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });

  const periodEndParam = req.nextUrl.searchParams.get("periodEnd");
  if (!periodEndParam) return NextResponse.json({ error: "periodEnd gerekli." }, { status: 400 });
  const anchor = new Date(periodEndParam);
  if (isNaN(anchor.getTime())) return NextResponse.json({ error: "Geçersiz tarih." }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: session.uid }, select: { paymentDay: true } });
  const period = getPeriodForDate(anchor, user?.paymentDay ?? null);

  const logs = await prisma.workLog.findMany({
    where: { userId: session.uid, date: { gte: period.start, lte: period.end } },
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
