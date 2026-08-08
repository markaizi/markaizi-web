import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sendAdminNotification, escapeHtml } from "@/lib/mail";

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

  await sendAdminNotification(
    `[Panel] ${session.name} — ${logs.length} Yeni İş Kaydı`,
    "Yeni İş Kayıtları (Toplu)",
    `
      <div style="background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.2);border-radius:8px;padding:12px 16px;margin-bottom:20px;display:inline-block">
        <span style="font-size:11px;font-weight:700;color:#8a8a9a;text-transform:uppercase;letter-spacing:1px">Çalışan</span><br>
        <span style="font-size:17px;font-weight:800;color:#34d399">${escapeHtml(session.name)}</span>
      </div>
      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:16px 20px">
        <ul style="margin:0;padding-left:18px;font-size:14px;color:#c8c8d8;line-height:1.9">
          ${parsed.data.descriptions.map((d) => `<li>${escapeHtml(d)}</li>`).join("")}
        </ul>
      </div>
    `
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
