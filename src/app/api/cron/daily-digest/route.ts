import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendAdminNotification } from "@/lib/mail";

export const runtime = "nodejs";

const TYPE_LABEL: Record<string, string> = {
  NOTE: "💬 Müşteri İstekleri",
  WORKLOG: "🛠️ İş Kayıtları",
  CARD_ENTRY: "📋 İş Akışı Hareketleri",
};
const TYPE_COLOR: Record<string, string> = {
  NOTE: "#c084fc",
  WORKLOG: "#34d399",
  CARD_ENTRY: "#2dd4bf",
};
const TYPE_ORDER = ["NOTE", "WORKLOG", "CARD_ENTRY"];

// Vercel Cron her akşam 20:00 (TR) bu endpoint'i tetikler (bkz. vercel.json).
// Gün içinde biriken DigestEvent kayıtlarını tek e-postada toplar — hiç olay
// yoksa e-posta gönderilmez.
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const events = await prisma.digestEvent.findMany({
    where: { sentAt: null },
    orderBy: { createdAt: "asc" },
  });

  if (events.length === 0) {
    return NextResponse.json({ ok: true, sent: false, count: 0 });
  }

  const byType = new Map<string, typeof events>();
  for (const e of events) {
    if (!byType.has(e.type)) byType.set(e.type, []);
    byType.get(e.type)!.push(e);
  }

  const today = new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });

  const sections = TYPE_ORDER.filter((t) => byType.has(t))
    .map((type) => {
      const items = byType.get(type)!;
      return `
        <div style="margin-bottom:20px">
          <p style="margin:0 0 8px;font-size:13px;font-weight:800;color:${TYPE_COLOR[type]};text-transform:uppercase;letter-spacing:0.5px">
            ${TYPE_LABEL[type]} (${items.length})
          </p>
          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:14px 18px">
            <ul style="margin:0;padding-left:18px;font-size:14px;color:#c8c8d8;line-height:1.9">
              ${items.map((e) => `<li>${e.summary.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]!))}</li>`).join("")}
            </ul>
          </div>
        </div>
      `;
    })
    .join("");

  await sendAdminNotification(
    `[Panel] ${today} Günlük Özet (${events.length})`,
    `Günlük Özet — ${today}`,
    sections
  );

  await prisma.digestEvent.updateMany({
    where: { id: { in: events.map((e) => e.id) } },
    data: { sentAt: new Date() },
  });

  return NextResponse.json({ ok: true, sent: true, count: events.length });
}
