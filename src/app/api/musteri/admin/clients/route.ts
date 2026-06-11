import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().min(1).max(120),
  slug: z.string().min(1).max(60).regex(/^[a-z0-9-]+$/, "Slug: küçük harf, rakam, tire"),
  package: z.string().min(1).max(120),
  invoiceNote: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  const { err } = await requireAdmin();
  if (err) return err;

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { name, slug, package: pkg, invoiceNote } = parsed.data;

  const existing = await prisma.client.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Bu slug zaten kullanımda." }, { status: 409 });
  }

  const client = await prisma.client.create({
    data: { name, slug, package: pkg, invoiceNote: invoiceNote || null },
  });

  return NextResponse.json({ ok: true, slug: client.slug });
}
