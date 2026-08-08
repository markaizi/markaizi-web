import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";
import { getPeriodForDate } from "@/lib/workLogPeriods";

export const runtime = "nodejs";

const postSchema = z.object({
  periodEnd: z.string().refine((v) => !isNaN(new Date(v).getTime()), { message: "Geçersiz tarih." }),
});

function parseAmount(raw: string | null): number {
  if (!raw) return 0;
  const digits = raw.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

// Bir iş kaydı döneminin toplamından, o dönem aralığında verilmiş avansları
// düşüp kalanı tek seferlik gider olarak kaydeder ve dönemi "ödendi" işaretler.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { err } = await requireAdmin();
  if (err) return err;
  const { id } = await params;

  const parsed = postSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const employee = await prisma.user.findFirst({ where: { id, role: "EMPLOYEE" }, select: { id: true, name: true, paymentDay: true } });
  if (!employee) return NextResponse.json({ error: "Çalışan bulunamadı." }, { status: 404 });

  const anchor = new Date(parsed.data.periodEnd);
  const period = getPeriodForDate(anchor, employee.paymentDay ?? null);

  const already = await prisma.payrollPayment.findUnique({
    where: { userId_periodKey: { userId: employee.id, periodKey: period.key } },
  });
  if (already) return NextResponse.json({ error: "Bu dönem zaten ödendi olarak işaretlenmiş." }, { status: 409 });

  const logs = await prisma.workLog.findMany({
    where: { userId: employee.id, date: { gte: period.start, lte: period.end } },
    select: { amount: true },
  });
  if (logs.length === 0) {
    return NextResponse.json({ error: "Bu dönemde iş kaydı yok." }, { status: 400 });
  }
  if (logs.some((l) => l.amount === null)) {
    return NextResponse.json({ error: "Bu dönemde fiyatlandırılmamış kayıt var — önce hepsini fiyatlandırın." }, { status: 400 });
  }
  const periodTotal = logs.reduce((s, l) => s + parseAmount(l.amount), 0);

  const advances = await prisma.payrollPayment.findMany({
    where: { userId: employee.id, kind: "AVANS", date: { gte: period.start, lte: period.end } },
    select: { amount: true },
  });
  const advancesTotal = advances.reduce((s, a) => s + parseAmount(a.amount), 0);

  const remaining = Math.max(0, periodTotal - advancesTotal);

  let transactionId: string | null = null;
  if (remaining > 0) {
    const tx = await prisma.transaction.create({
      data: {
        type: "GIDER",
        amount: `${remaining.toLocaleString("tr-TR")} ₺`,
        description: `Personel Ödemesi — ${employee.name} — ${period.label}`,
        date: new Date(),
      },
    });
    transactionId = tx.id;
  }

  const payment = await prisma.payrollPayment.create({
    data: {
      userId: employee.id,
      kind: "DONEM_ODEMESI",
      amount: `${remaining.toLocaleString("tr-TR")} ₺`,
      periodKey: period.key,
      periodLabel: period.label,
      transactionId,
    },
  });

  return NextResponse.json({
    ok: true,
    payment,
    periodTotal,
    advancesTotal,
    remaining,
  });
}
