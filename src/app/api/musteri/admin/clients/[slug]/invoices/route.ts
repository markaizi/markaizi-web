import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireInvoiceManageForSlug } from "@/lib/staffGuard";
import { CLIENT_PAYMENT_CATEGORY, parseTry } from "@/lib/clientPayments";

export const runtime = "nodejs";

// v3.5.0: Yeni "fatura" = Kasa'da müşteri alacağı (tek kaynak Kasa, bkz. src/lib/clientPayments.ts).
// Yalnızca ödendi/ödenmedi yazılabilir — aşama vade tarihinden hesaplanır.
const schema = z.object({
  period: z.string().trim().min(1).max(100),
  amount: z.string().min(1).max(100),
  status: z.enum(["ODENDI", "BEKLIYOR"]).default("BEKLIYOR"),
  dueDate: z.string().nullable().optional(),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { err } = await requireInvoiceManageForSlug(slug);
  if (err) return err;

  const client = await prisma.client.findUnique({ where: { slug }, select: { id: true, name: true } });
  if (!client) return NextResponse.json({ error: "Firma bulunamadı." }, { status: 404 });

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const amount = parseTry(parsed.data.amount);
  if (!amount) return NextResponse.json({ error: "Geçersiz tutar." }, { status: 400 });
  const paid = parsed.data.status === "ODENDI";

  const entry = await prisma.kasaEntry.create({
    data: {
      title: `${client.name} ${parsed.data.period}`,
      amount,
      direction: "ALACAK",
      category: CLIENT_PAYMENT_CATEGORY,
      status: paid ? "ODENDI" : "BEKLIYOR",
      paidAt: paid ? new Date() : null,
      dueDate: parsed.data.dueDate ? new Date(`${parsed.data.dueDate}T10:00:00+03:00`) : new Date(),
      clientId: client.id,
    },
  });
  return NextResponse.json({ ok: true, id: entry.id });
}
