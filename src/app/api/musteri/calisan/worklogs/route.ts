import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

const postSchema = z.object({
  date: z.string().min(1),
  description: z.string().min(1).max(500),
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

  const log = await prisma.workLog.create({
    data: {
      userId: session.uid,
      date: new Date(parsed.data.date),
      description: parsed.data.description,
    },
  });

  return NextResponse.json({
    ok: true,
    log: {
      id: log.id,
      date: log.date.toISOString(),
      description: log.description,
      amount: log.amount,
      createdAt: log.createdAt.toISOString(),
    },
  });
}
