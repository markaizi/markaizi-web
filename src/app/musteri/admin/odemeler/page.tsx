import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import OdemelerView, { type PendingInvoice } from "@/components/OdemelerView";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Ödemeler — Admin",
};

export default async function OdemelerPage() {
  const session = await getSession();
  if (!session) redirect("/musteri/giris?next=/musteri/admin/odemeler");
  if (session.role !== "ADMIN") redirect("/musteri/admin");

  const rows = await prisma.invoice.findMany({
    where: { status: "BEKLIYOR" },
    include: { client: { select: { slug: true, name: true } } },
  });

  const today = new Date();
  const invoices: PendingInvoice[] = rows
    .map((i) => ({
      id: i.id,
      period: i.period,
      amount: i.amount,
      dueDate: i.dueDate ? i.dueDate.toISOString().split("T")[0] : null,
      overdue: !!i.dueDate && i.dueDate < today,
      client: i.client,
    }))
    .sort((a, b) => {
      if (a.overdue !== b.overdue) return a.overdue ? -1 : 1;
      if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return 0;
    });

  return <OdemelerView invoices={invoices} />;
}
