import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";

export const runtime = "nodejs";

// Takvim ayına göre tüm çalışanların iş kaydı özetini döner (toplu PDF önizlemesi için).
export async function GET(req: NextRequest) {
  const { err } = await requireAdmin();
  if (err) return err;

  const monthParam = req.nextUrl.searchParams.get("month");
  const match = monthParam ? /^(\d{4})-(\d{2})$/.exec(monthParam) : null;
  if (!match) return NextResponse.json({ error: "Geçersiz ay." }, { status: 400 });

  const year = parseInt(match[1], 10);
  const month0 = parseInt(match[2], 10) - 1;
  const start = new Date(year, month0, 1, 0, 0, 0, 0);
  const end = new Date(year, month0 + 1, 0, 23, 59, 59, 999);

  const employees = await prisma.user.findMany({
    where: { role: "EMPLOYEE", active: true },
    select: {
      id: true,
      name: true,
      workLogs: { where: { date: { gte: start, lte: end } }, select: { amount: true } },
    },
    orderBy: { name: "asc" },
  });

  const rows = employees
    .map((e) => {
      const total = e.workLogs.reduce((s, l) => {
        const digits = (l.amount ?? "").replace(/[^\d]/g, "");
        return s + (digits ? parseInt(digits, 10) : 0);
      }, 0);
      return { id: e.id, name: e.name, count: e.workLogs.length, total };
    })
    .filter((r) => r.count > 0);

  const grandTotal = rows.reduce((s, r) => s + r.total, 0);
  return NextResponse.json({ rows, grandTotal });
}
