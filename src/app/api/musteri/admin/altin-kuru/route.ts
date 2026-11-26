import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { fetchGramGoldPrice } from "@/lib/gold";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/musteri/admin/altin-kuru → güncel gram altın (TL, satış). Altın borcu ödeme formundaki "Güncel kuru getir" için.
export async function GET() {
  const { err } = await requireAdmin();
  if (err) return err;
  try {
    return NextResponse.json({ ok: true, result: await fetchGramGoldPrice() });
  } catch {
    return NextResponse.json({ error: "Güncel gram altın kuru alınamadı — fiyatı elle gir." }, { status: 502 });
  }
}
