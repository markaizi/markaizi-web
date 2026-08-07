import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireWorkflowAccess } from "@/lib/staffGuard";

export const runtime = "nodejs";

export async function GET() {
  const { err } = await requireWorkflowAccess();
  if (err) return err;

  const cards = await prisma.workflowCard.findMany({
    where: { archivedAt: { not: null } },
    orderBy: { archivedAt: "desc" },
    select: {
      id: true,
      title: true,
      archivedAt: true,
      column: { select: { title: true } },
      assignee: { select: { name: true } },
    },
  });

  return NextResponse.json({ cards });
}
