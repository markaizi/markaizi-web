import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireStaffForReport } from "@/lib/staffGuard";

export const runtime = "nodejs";

const MAX_SIZE = 15 * 1024 * 1024; // 15 MB — Meta/Google dışa aktarma raporları için fazlasıyla yeterli

// Meta/Google'dan indirilen PDF raporunu bir AdReport kaydına ekler (veya değiştirir).
// Ayrı bir depolama servisi kurmaya gerek kalmasın diye doğrudan veritabanında tutulur.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { err } = await requireStaffForReport(id);
  if (err) return err;

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "PDF dosyası bulunamadı." }, { status: 400 });
  }
  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Yalnızca PDF dosyası yüklenebilir." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Dosya çok büyük (en fazla 15 MB)." }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  await prisma.adReport.update({
    where: { id },
    data: { pdfData: bytes, pdfFilename: file.name.slice(0, 200), pdfMimeType: file.type },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { err } = await requireStaffForReport(id);
  if (err) return err;

  await prisma.adReport.update({
    where: { id },
    data: { pdfData: null, pdfFilename: null, pdfMimeType: null },
  });

  return NextResponse.json({ ok: true });
}
