import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireWorkflowAccess } from "@/lib/staffGuard";

export const runtime = "nodejs";

const DEFAULT_COLUMNS = ["Yapılacak", "Devam Ediyor", "Kontrol", "Tamamlandı"];

export async function GET() {
  const { session, err } = await requireWorkflowAccess();
  if (err) return err;

  let columnCount = await prisma.workflowColumn.count();
  if (columnCount === 0) {
    await prisma.workflowColumn.createMany({
      data: DEFAULT_COLUMNS.map((title, i) => ({ title, sortOrder: i })),
    });
    columnCount = DEFAULT_COLUMNS.length;
  }

  const [columns, employees, clients] = await Promise.all([
    prisma.workflowColumn.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        cards: {
          orderBy: { sortOrder: "asc" },
          include: {
            assignee: { select: { id: true, name: true } },
            creator: { select: { id: true, name: true } },
            client: { select: { slug: true, name: true } },
          },
        },
      },
    }),
    prisma.user.findMany({
      where: { role: { in: ["ADMIN", "EMPLOYEE"] }, active: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    session!.role === "ADMIN"
      ? prisma.client.findMany({ where: { active: true }, select: { id: true, slug: true, name: true }, orderBy: { name: "asc" } })
      : prisma.client.findMany({
          where: { active: true, assignments: { some: { userId: session!.uid } } },
          select: { id: true, slug: true, name: true },
          orderBy: { name: "asc" },
        }),
  ]);

  const isAdmin = session!.role === "ADMIN";
  let canManageCards = isAdmin;
  let canDeleteAnyCard = isAdmin;
  let canManageColumns = isAdmin;
  if (!isAdmin) {
    const me = await prisma.user.findUnique({
      where: { id: session!.uid },
      select: { workflowCanManageCards: true, workflowCanDeleteAnyCard: true, workflowCanManageColumns: true },
    });
    canManageCards = !!me?.workflowCanManageCards;
    canDeleteAnyCard = !!me?.workflowCanDeleteAnyCard;
    canManageColumns = !!me?.workflowCanManageColumns;
  }

  return NextResponse.json({
    columns, employees, clients,
    currentUserId: session!.uid,
    isAdmin, canManageCards, canDeleteAnyCard, canManageColumns,
  });
}
