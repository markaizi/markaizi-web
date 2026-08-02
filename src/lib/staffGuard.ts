import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

const unauth = () => NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
const forbidden = () => NextResponse.json({ error: "Bu işlem için yetkiniz yok." }, { status: 403 });
const disabled = () => NextResponse.json({ error: "Hesabınız devre dışı." }, { status: 403 });

export type AssignmentPerms = {
  id: string;
  canViewContent: boolean;
  canManageContent: boolean;
  canViewUpdates: boolean;
  canManageUpdates: boolean;
  canViewInvoices: boolean;
  canManageInvoices: boolean;
};

async function checkActive(uid: string): Promise<boolean> {
  const u = await prisma.user.findUnique({ where: { id: uid }, select: { active: true } });
  return u?.active ?? false;
}

/** ADMIN veya ilgili firmaya atanmış EMPLOYEE için geçer. Yetkiler döner. */
export async function requireStaffForSlug(slug: string) {
  const session = await getSession();
  if (!session) return { session: null, perms: null, err: unauth() };
  if (!(await checkActive(session.uid))) return { session: null, perms: null, err: disabled() };
  if (session.role === "ADMIN") return { session, perms: null, err: null };
  if (session.role === "EMPLOYEE") {
    const hit = await prisma.assignment.findFirst({
      where: { userId: session.uid, client: { slug } },
    });
    if (hit) return { session, perms: hit as AssignmentPerms, err: null };
  }
  return { session: null, perms: null, err: forbidden() };
}

/** ADMIN veya firma'ya canManageInvoices=true atanmış EMPLOYEE. */
export async function requireInvoiceManageForSlug(slug: string) {
  const session = await getSession();
  if (!session) return { session: null, err: unauth() };
  if (!(await checkActive(session.uid))) return { session: null, err: disabled() };
  if (session.role === "ADMIN") return { session, err: null };
  if (session.role === "EMPLOYEE") {
    const hit = await prisma.assignment.findFirst({
      where: { userId: session.uid, client: { slug }, canManageInvoices: true },
    });
    if (hit) return { session, err: null };
  }
  return { session: null, err: forbidden() };
}

/** ADMIN veya faturanın firmasına canManageInvoices=true atanmış EMPLOYEE. */
export async function requireInvoiceManageById(id: string) {
  const session = await getSession();
  if (!session) return { session: null, err: unauth() };
  if (!(await checkActive(session.uid))) return { session: null, err: disabled() };
  if (session.role === "ADMIN") return { session, err: null };
  if (session.role === "EMPLOYEE") {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      select: { client: { select: { assignments: { where: { userId: session.uid, canManageInvoices: true } } } } },
    });
    if (invoice?.client.assignments.length) return { session, err: null };
  }
  return { session: null, err: forbidden() };
}

/** ADMIN veya içeriğin firmasına canManageContent=true atanmış EMPLOYEE. */
export async function requireStaffForContentItem(id: string) {
  const session = await getSession();
  if (!session) return { session: null, err: unauth() };
  if (!(await checkActive(session.uid))) return { session: null, err: disabled() };
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

/** ADMIN veya workflowAccess=true olan EMPLOYEE — İş Akışı panosunu görebilir. */
export async function requireWorkflowAccess() {
  const session = await getSession();
  if (!session || session.role === "CLIENT") return { session: null, err: forbidden() };
  if (!(await checkActive(session.uid))) return { session: null, err: disabled() };
  if (session.role === "ADMIN") return { session, err: null };
  const user = await prisma.user.findUnique({ where: { id: session.uid }, select: { workflowAccess: true } });
  if (!user?.workflowAccess) return { session: null, err: forbidden() };
  return { session, err: null };
}

/** ADMIN veya workflowCanManageCards=true olan EMPLOYEE — kart ekle/düzenle/taşı. */
export async function requireWorkflowManageCards() {
  const session = await getSession();
  if (!session || session.role === "CLIENT") return { session: null, err: forbidden() };
  if (!(await checkActive(session.uid))) return { session: null, err: disabled() };
  if (session.role === "ADMIN") return { session, err: null };
  const user = await prisma.user.findUnique({
    where: { id: session.uid },
    select: { workflowAccess: true, workflowCanManageCards: true },
  });
  if (!user?.workflowAccess || !user.workflowCanManageCards) return { session: null, err: forbidden() };
  return { session, err: null };
}

/** ADMIN veya workflowCanManageColumns=true olan EMPLOYEE — sütun ekle/adlandır/sil. */
export async function requireWorkflowManageColumns() {
  const session = await getSession();
  if (!session || session.role === "CLIENT") return { session: null, err: forbidden() };
  if (!(await checkActive(session.uid))) return { session: null, err: disabled() };
  if (session.role === "ADMIN") return { session, err: null };
  const user = await prisma.user.findUnique({
    where: { id: session.uid },
    select: { workflowAccess: true, workflowCanManageColumns: true },
  });
  if (!user?.workflowAccess || !user.workflowCanManageColumns) return { session: null, err: forbidden() };
  return { session, err: null };
}

/** ADMIN veya raporun firmasına atanmış EMPLOYEE. */
export async function requireStaffForReport(id: string) {
  const session = await getSession();
  if (!session) return { session: null, err: unauth() };
  if (!(await checkActive(session.uid))) return { session: null, err: disabled() };
  if (session.role === "ADMIN") return { session, err: null };
  if (session.role === "EMPLOYEE") {
    const report = await prisma.adReport.findUnique({
      where: { id },
      select: { client: { select: { assignments: { where: { userId: session.uid } } } } },
    });
    if (report?.client.assignments.length) return { session, err: null };
  }
  return { session: null, err: forbidden() };
}

/** ADMIN veya güncellemenin firmasına canManageUpdates=true atanmış EMPLOYEE. */
export async function requireStaffForUpdate(id: string) {
  const session = await getSession();
  if (!session) return { session: null, err: unauth() };
  if (!(await checkActive(session.uid))) return { session: null, err: disabled() };
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
