import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";
import { BILLING_PERIODS, needsIntervalDays } from "@/lib/billingPeriod";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().min(1).max(120).optional(),
  invoiceNote: z.string().max(500).nullable().optional(),
  contactPerson: z.string().max(120).nullable().optional(),
  contactEmail: z.string().email("Geçerli bir e-posta girin.").max(160).nullable().optional().or(z.literal("")),
  contactPhone: z.string().max(40).nullable().optional(),
  billingAmount: z.string().max(60).nullable().optional(),
  billingPeriod: z.enum(BILLING_PERIODS).nullable().optional(),
  billingIntervalDays: z.number().int().min(1).max(365).nullable().optional(),
  overdueGraceDays: z.number().int().min(1).max(90).nullable().optional(),
  dailyMetaSpend: z.string().max(60).nullable().optional(),
  dailyGoogleSpend: z.string().max(60).nullable().optional(),
  active: z.boolean().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { err } = await requireAdmin();
  if (err) return err;

  const { slug } = await params;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const client = await prisma.client.findUnique({ where: { slug } });
  if (!client) return NextResponse.json({ error: "Firma bulunamadı." }, { status: 404 });

  const data = { ...parsed.data };
  // Ücret boşsa periyot ve gün aralığı da anlamsız — birlikte temizle
  if (data.billingAmount !== undefined && !data.billingAmount) {
    data.billingAmount = null;
    data.billingPeriod = null;
    data.billingIntervalDays = null;
  }

  // Gün aralığı yalnızca "özel gün" periyodunda anlamlı: başka bir periyoda
  // geçildiğinde eski değerin kalıp sonraki vadeyi bozmaması için temizlenir.
  const effectivePeriod = data.billingPeriod !== undefined ? data.billingPeriod : client.billingPeriod;
  if (effectivePeriod && !needsIntervalDays(effectivePeriod)) {
    data.billingIntervalDays = null;
  } else if (effectivePeriod && needsIntervalDays(effectivePeriod)) {
    const interval = data.billingIntervalDays !== undefined ? data.billingIntervalDays : client.billingIntervalDays;
    if (!interval) {
      return NextResponse.json(
        { error: "Özel gün aralığı seçtiniz — kaç günde bir tahsil edileceğini girin." },
        { status: 400 }
      );
    }
  }

  await prisma.client.update({ where: { slug }, data });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { err } = await requireAdmin();
  if (err) return err;

  const { slug } = await params;
  await prisma.client.update({ where: { slug }, data: { active: false } });
  return NextResponse.json({ ok: true });
}
