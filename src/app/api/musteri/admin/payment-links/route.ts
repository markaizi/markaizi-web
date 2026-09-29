import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/adminGuard";
import { prisma } from "@/lib/db";
import { newLinkCode, parseTLToKurus } from "@/lib/paytr";

export const runtime = "nodejs";

const schema = z.object({
  title: z.string().trim().min(2).max(120),
  amount: z.string().trim().min(1).max(30),
  description: z.string().trim().max(500).optional().default(""),
  clientId: z.string().trim().max(40).optional().default(""),
});

// Yeni ödeme linki (yalnızca admin)
export async function POST(req: NextRequest) {
  const { session, err } = await requireAdmin();
  if (err) return err;

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Başlık ve tutar zorunlu." }, { status: 400 });

  const amountKurus = parseTLToKurus(parsed.data.amount);
  if (!amountKurus || amountKurus < 100 || amountKurus > 100_000_000) {
    return NextResponse.json({ error: "Tutar 1 ₺ ile 1.000.000 ₺ arasında olmalı." }, { status: 400 });
  }

  let clientId: string | null = null;
  if (parsed.data.clientId) {
    const c = await prisma.client.findUnique({ where: { id: parsed.data.clientId }, select: { id: true } });
    if (!c) return NextResponse.json({ error: "Firma bulunamadı." }, { status: 400 });
    clientId = c.id;
  }

  const link = await prisma.paymentLink.create({
    data: {
      code: newLinkCode(),
      title: parsed.data.title,
      description: parsed.data.description || null,
      amountKurus,
      clientId,
      createdById: session!.uid,
    },
  });
  return NextResponse.json({ ok: true, link: { id: link.id, code: link.code } });
}
