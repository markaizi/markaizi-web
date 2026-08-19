import { NextRequest, NextResponse } from "next/server";
import { getSession, assertCanAccessClient } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

// Rapora eklenmiş PDF'i indirir — admin, atanmış çalışan veya raporun sahibi
// olan müşteri erişebilir (bkz. assertCanAccessClient).
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  const { id } = await params;

  const report = await prisma.adReport.findUnique({
    where: { id },
    select: { clientId: true, pdfData: true, pdfFilename: true, pdfMimeType: true },
  });
  if (!report || !report.pdfData) {
    return NextResponse.json({ error: "PDF bulunamadı." }, { status: 404 });
  }

  try {
    await assertCanAccessClient(session, report.clientId);
  } catch {
    return NextResponse.json({ error: "Bu firmaya erişim yetkiniz yok." }, { status: 403 });
  }

  return new NextResponse(new Uint8Array(report.pdfData), {
    headers: {
      "Content-Type": report.pdfMimeType || "application/pdf",
      "Content-Disposition": `attachment; filename="${(report.pdfFilename || "rapor.pdf").replace(/"/g, "")}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
