import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";
import { sendAdminNotifications } from "@/lib/staffNotify";

export const runtime = "nodejs";

const schema = z.object({
  recipientIds: z.union([z.literal("all"), z.array(z.string().min(1))]),
  title: z.string().trim().min(1).max(120),
  body: z.string().trim().min(1).max(2000),
  popup: z.boolean().optional().default(false),
});

export async function POST(req: NextRequest) {
  const { err } = await requireAdmin();
  if (err) return err;

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const { recipientIds, title, body, popup } = parsed.data;

  let ids: string[];
  if (recipientIds === "all") {
    const employees = await prisma.user.findMany({ where: { role: "EMPLOYEE", active: true }, select: { id: true } });
    ids = employees.map((e) => e.id);
  } else {
    ids = recipientIds;
  }

  if (ids.length === 0) return NextResponse.json({ error: "Alıcı bulunamadı." }, { status: 400 });

  const { count } = await sendAdminNotifications({ recipientIds: ids, title, body, popup });
  return NextResponse.json({ ok: true, count });
}
