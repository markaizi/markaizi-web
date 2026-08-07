import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

const postSchema = z.object({
  date: z.string().min(1),
  descriptions: z.array(z.string().trim().min(1).max(500)).min(1).max(50),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  if (session.role !== "EMPLOYEE") {
    return NextResponse.json({ error: "İş kaydı yalnızca çalışan tarafından eklenebilir." }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Geçersiz veri." }, { status: 400 });

  const date = new Date(parsed.data.date);
  const logs = await prisma.$transaction(
    parsed.data.descriptions.map((description) =>
      prisma.workLog.create({ data: { userId: session.uid, date, description } })
    )
  );

  return NextResponse.json({
    ok: true,
    logs: logs.map((log) => ({
      id: log.id,
      date: log.date.toISOString(),
      description: log.description,
      amount: log.amount,
      createdAt: log.createdAt.toISOString(),
    })),
  });
}
