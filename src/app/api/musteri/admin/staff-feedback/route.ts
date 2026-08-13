import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";

export const runtime = "nodejs";

export async function GET() {
  const { err } = await requireAdmin();
  if (err) return err;

  const items = await prisma.staffFeedback.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      message: true,
      status: true,
      createdAt: true,
      user: { select: { name: true } },
    },
  });

  return NextResponse.json({ items });
}
