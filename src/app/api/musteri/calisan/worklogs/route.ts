import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sendAdminNotification, escapeHtml } from "@/lib/mail";

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

  await sendAdminNotification(
    `[Panel] ${session.name} — Yeni İş Kaydı`,
    "Yeni İş Kaydı",
    `
      <div style="background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.2);border-radius:8px;padding:12px 16px;margin-bottom:20px;display:inline-block">
        <span style="font-size:11px;font-weight:700;color:#8a8a9a;text-transform:uppercase;letter-spacing:1px">Çalışan</span><br>
        <span style="font-size:17px;font-weight:800;color:#34d399">${escapeHtml(session.name)}</span>
      </div>
      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:16px 20px">
        <p style="margin:0;font-size:15px;color:#c8c8d8;line-height:1.7;white-space:pre-wrap">${escapeHtml(parsed.data.description)}</p>
      </div>
    `
  );

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
