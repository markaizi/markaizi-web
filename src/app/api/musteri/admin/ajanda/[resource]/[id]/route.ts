import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { deleteByResource, isResource, respond, updateByResource } from "@/lib/agendaApi";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ resource: string; id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { err } = await requireAdmin();
  if (err) return err;
  const { resource, id } = await params;
  const fn = isResource(resource) ? updateByResource[resource] : undefined;
  if (!fn) return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
  const body = await req.json().catch(() => ({}));
  return respond(() => fn(id, body));
}

// Etkinlik kalıcı silinir; iş, not ve kasa kaydı çöp kutusuna (deletedAt) taşınır.
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { err } = await requireAdmin();
  if (err) return err;
  const { resource, id } = await params;
  const fn = isResource(resource) ? deleteByResource[resource] : undefined;
  if (!fn) return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
  return respond(() => fn(id));
}
