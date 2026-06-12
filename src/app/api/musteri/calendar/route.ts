import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const fromParam  = searchParams.get("from");
  const toParam    = searchParams.get("to");
  const yearParam  = searchParams.get("year");
  const monthParam = searchParams.get("month");

  let from: Date, to: Date;
  if (fromParam && toParam) {
    from = new Date(fromParam);
    to   = new Date(toParam);
    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      return NextResponse.json({ error: "Geçersiz tarih." }, { status: 400 });
    }
  } else {
    const year  = parseInt(yearParam  ?? String(new Date().getFullYear()), 10);
    const month = parseInt(monthParam ?? String(new Date().getMonth() + 1), 10);
    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      return NextResponse.json({ error: "Geçersiz tarih." }, { status: 400 });
    }
    from = new Date(year, month - 1, 1);
    to   = new Date(year, month, 1);
  }

  const clientSlugParam = searchParams.get("clientSlug");

  // Role-scoped where clause for client
  let clientWhere = {};
  if (session.role === "CLIENT") {
    clientWhere = { id: session.clientId ?? "__none__" };
  } else if (session.role === "EMPLOYEE") {
    clientWhere = { assignments: { some: { userId: session.uid } } };
  } else if (session.role === "ADMIN" && clientSlugParam) {
    // Admin belirli bir firma panelinden bakıyorsa sadece o firmayı göster
    clientWhere = { slug: clientSlugParam };
  }

  const items = await prisma.contentItem.findMany({
    where: {
      scheduledDate: { gte: from, lt: to },
      client: clientWhere,
    },
    select: {
      id: true,
      title: true,
      scheduledDate: true,
      status: true,
      client: { select: { id: true, name: true, slug: true } },
    },
    orderBy: { scheduledDate: "asc" },
  });

  return NextResponse.json({
    items: items.map((i) => ({
      id: i.id,
      clientId: i.client.id,
      clientName: i.client.name,
      clientSlug: i.client.slug,
      title: i.title,
      scheduledDate: i.scheduledDate.toISOString().split("T")[0],
      status: i.status,
    })),
  });
}
