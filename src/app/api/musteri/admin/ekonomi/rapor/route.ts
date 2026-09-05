import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getRangeSummary } from "@/lib/economy";

export const runtime = "nodejs";

// Serbest tarih aralığı raporu — hem "belli tarih aralığı" filtresi hem de
// Aylık Geçmiş'teki bir aya tıklayıp o ayın kalemlerini görmek için kullanılır.
// Admin her zaman, çalışan yalnızca adminCanViewEconomy yetkisiyle (salt okunur) erişir.
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  if (session.role !== "ADMIN") {
    if (session.role !== "EMPLOYEE") return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
    const me = await prisma.user.findUnique({ where: { id: session.uid }, select: { adminCanViewEconomy: true } });
    if (!me?.adminCanViewEconomy) return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
  }

  const startParam = req.nextUrl.searchParams.get("start");
  const endParam = req.nextUrl.searchParams.get("end");
  if (!startParam || !endParam) return NextResponse.json({ error: "start ve end gerekli." }, { status: 400 });

  const start = new Date(startParam + "T00:00:00.000");
  const end = new Date(endParam + "T23:59:59.999");
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
    return NextResponse.json({ error: "Geçersiz tarih aralığı." }, { status: 400 });
  }

  const summary = await getRangeSummary(start, end);
  return NextResponse.json(summary);
}
