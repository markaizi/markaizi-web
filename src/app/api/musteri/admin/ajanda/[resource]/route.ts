import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { createByResource, isResource, respond } from "@/lib/agendaApi";

export const runtime = "nodejs";

// POST /api/musteri/admin/ajanda/{events|tasks|notes|kasa|card-tx}
export async function POST(req: NextRequest, { params }: { params: Promise<{ resource: string }> }) {
  const { err } = await requireAdmin();
  if (err) return err;
  const { resource } = await params;
  if (!isResource(resource)) return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
  const body = await req.json().catch(() => ({}));
  return respond(() => createByResource[resource](body));
}
