import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const year  = parseInt(searchParams.get("year")  ?? String(new Date().getFullYear()), 10);
  const month = parseInt(searchParams.get("month") ?? String(new Date().getMonth() + 1), 10);

  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
    return NextResponse.json({ error: "Geçersiz tarih." }, { status: 400 });
  }

  const from = new Date(year, month - 1, 1);
  const to   = new Date(year, month, 1);

  // Role-scoped where clause for client
  let clientWhere = {};
  if (session.role === "CLIENT") {
    clientWhere = { id: session.clientId ?? "__none__" };
  } else if (session.role === "EMPLOYEE") {
    clientWhere = { assignments: { some: { userId: session.uid } } };
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
