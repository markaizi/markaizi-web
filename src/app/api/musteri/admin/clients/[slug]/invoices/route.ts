import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireInvoiceManageForSlug } from "@/lib/staffGuard";

export const runtime = "nodejs";

// Yalnızca ödendi/ödenmedi yazılabilir — "Günü Gelmedi"/"Gecikmede" aşamaları
// vade tarihinden hesaplanır, elle atanmaz (bkz. src/lib/invoiceStage.ts).
const schema = z.object({
  period: z.string().min(1).max(100),
  amount: z.string().min(1).max(100),
  status: z.enum(["ODENDI", "BEKLIYOR"]).default("BEKLIYOR"),
  dueDate: z.string().nullable().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { err } = await requireInvoiceManageForSlug(slug);
  if (err) return err;

  const client = await prisma.client.findUnique({ where: { slug } });
  if (!client) return NextResponse.json({ error: "Firma bulunamadı." }, { status: 404 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { dueDate, ...rest } = parsed.data;
  const invoice = await prisma.invoice.create({
    data: {
      ...rest,
      clientId: client.id,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });

  return NextResponse.json({ ok: true, id: invoice.id });
}
