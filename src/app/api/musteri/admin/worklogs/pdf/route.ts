import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";
import { getPeriodForDate } from "@/lib/workLogPeriods";
import { buildWorkLogPdf, type PdfSection } from "@/lib/pdf/workLogPdf";

export const runtime = "nodejs";

// İki mod destekler:
//  - ?userId=X&periodEnd=Y  → tek çalışan, tek dönem (ödeme gününe göre)
//  - ?month=YYYY-MM         → toplu, tüm çalışanlar, takvim ayı
export async function GET(req: NextRequest) {
  const { err } = await requireAdmin();
  if (err) return err;

  const userId = req.nextUrl.searchParams.get("userId");
  const periodEndParam = req.nextUrl.searchParams.get("periodEnd");
  const monthParam = req.nextUrl.searchParams.get("month");

  let title: string;
  let subtitle: string;
  let sections: PdfSection[];
  let filename: string;

  if (userId && periodEndParam) {
    const anchor = new Date(periodEndParam);
    if (isNaN(anchor.getTime())) return NextResponse.json({ error: "Geçersiz tarih." }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, paymentDay: true } });
    if (!user) return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });

    const period = getPeriodForDate(anchor, user.paymentDay ?? null);
    const logs = await prisma.workLog.findMany({
      where: { userId, date: { gte: period.start, lte: period.end } },
      orderBy: { date: "asc" },
    });

    title = `${user.name} — İş Kayıtları`;
    subtitle = period.label;
    sections = [{
      employeeName: user.name,
      entries: logs.map((l) => ({ date: l.date.toISOString(), description: l.description, amount: l.amount })),
    }];
    filename = `is-kayitlari-${slugify(user.name)}-${period.key}.pdf`;
  } else if (monthParam) {
    const match = /^(\d{4})-(\d{2})$/.exec(monthParam);
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
        workLogs: { where: { date: { gte: start, lte: end } }, orderBy: { date: "asc" } },
      },
      orderBy: { name: "asc" },
    });
    const withEntries = employees.filter((e) => e.workLogs.length > 0);

    title = "Aylık İş Kayıtları Raporu";
    subtitle = start.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });
    sections = withEntries.map((e) => ({
      employeeName: e.name,
      entries: e.workLogs.map((l) => ({ date: l.date.toISOString(), description: l.description, amount: l.amount })),
    }));
    filename = `is-kayitlari-${monthParam}.pdf`;
  } else {
    return NextResponse.json({ error: "userId+periodEnd veya month parametresi gerekli." }, { status: 400 });
  }

  const pdfBuffer = await buildWorkLogPdf(title, subtitle, sections);

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

function slugify(name: string) {
  return name
    .toLocaleLowerCase("tr-TR")
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
