import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

const unauth = () => NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
const forbidden = () => NextResponse.json({ error: "Bu firmaya erişim yetkiniz yok." }, { status: 403 });

export type AssignmentPerms = {
  id: string;
  canViewCampaigns: boolean;
  canManageContent: boolean;
  canManageUpdates: boolean;
  canViewInvoices: boolean;
};

/** ADMIN veya ilgili firmaya atanmış EMPLOYEE için geçer. Yetkiler döner. */
export async function requireStaffForSlug(slug: string) {
  const session = await getSession();
  if (!session) return { session: null, perms: null, err: unauth() };
  if (session.role === "ADMIN") return { session, perms: null, err: null };
  if (session.role === "EMPLOYEE") {
    const hit = await prisma.assignment.findFirst({
      where: { userId: session.uid, client: { slug } },
      select: { id: true, canViewCampaigns: true, canManageContent: true, canManageUpdates: true, canViewInvoices: true },
    });
    if (hit) return { session, perms: hit as AssignmentPerms, err: null };
  }
  return { session: null, perms: null, err: forbidden() };
}

/** ADMIN veya ilgili içeriğin firmasına atanmış ve canManageContent=true olan EMPLOYEE. */
export async function requireStaffForContentItem(id: string) {
  const session = await getSession();
  if (!session) return { session: null, err: unauth() };
  if (session.role === "ADMIN") return { session, err: null };
  if (session.role === "EMPLOYEE") {
    const item = await prisma.contentItem.findUnique({
      where: { id },
      select: { client: { select: { assignments: { where: { userId: session.uid, canManageContent: true } } } } },
    });
    if (item?.client.assignments.length) return { session, err: null };
  }
  return { session: null, err: forbidden() };
}

/** ADMIN veya ilgili güncellemenin firmasına atanmış ve canManageUpdates=true olan EMPLOYEE. */
export async function requireStaffForUpdate(id: string) {
  const session = await getSession();
  if (!session) return { session: null, err: unauth() };
  if (session.role === "ADMIN") return { session, err: null };
  if (session.role === "EMPLOYEE") {
    const upd = await prisma.update.findUnique({
      where: { id },
      select: { client: { select: { assignments: { where: { userId: session.uid, canManageUpdates: true } } } } },
    });
    if (upd?.client.assignments.length) return { session, err: null };
  }
  return { session: null, err: forbidden() };
}
