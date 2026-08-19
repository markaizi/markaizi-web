import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";

export const runtime = "nodejs";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { err } = await requireAdmin();
  if (err) return err;
  const { id } = await params;

  await prisma.clientNotification.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
