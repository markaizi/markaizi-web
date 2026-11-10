import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireWorkflowAccess } from "@/lib/staffGuard";

export const runtime = "nodejs";

export async function GET() {
  const { session, err } = await requireWorkflowAccess();
  if (err) return err;

  // Çalışan için pano ile aynı görünürlük kuralları: gizli sütunlar hiç görünmez,
  // "tüm kartları görme" yetkisi yoksa yalnızca kendine atanmış + sahipsiz kartlar.
  const isAdmin = session!.role === "ADMIN";
  let ownOnly = false;
  if (!isAdmin) {
    const me = await prisma.user.findUnique({ where: { id: session!.uid }, select: { workflowSeeAllCards: true } });
    ownOnly = me?.workflowSeeAllCards === false;
  }

  const cards = await prisma.workflowCard.findMany({
    where: {
      archivedAt: { not: null },
      ...(isAdmin ? {} : { column: { hiddenFromEmployees: false } }),
      ...(ownOnly ? { OR: [{ assigneeId: null }, { assigneeId: session!.uid }] } : {}),
    },
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
