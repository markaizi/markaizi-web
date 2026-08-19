import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import OdemelerView, { type PendingInvoice } from "@/components/OdemelerView";
import { getInvoiceStage, daysUntilDue, OVERDUE_GRACE_DAYS, type InvoiceStage } from "@/lib/invoiceStage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Ödemeler — Admin",
};

// Gecikmede → Bekliyor → Günü Gelmedi sırası (aciliyet sırası)
const STAGE_ORDER: Record<InvoiceStage, number> = {
  GECIKMEDI: 0,
  BEKLIYOR: 1,
  GUNU_GELMEDI: 2,
  ODENDI: 3,
};

export default async function OdemelerPage() {
  const session = await getSession();
  if (!session) redirect("/musteri/giris?next=/musteri/admin/odemeler");
  if (session.role !== "ADMIN") redirect("/musteri/admin");

  // Ödenmemiş tüm faturalar çekilir; aşama (günü gelmedi / bekliyor / gecikmede)
  // vade tarihinden hesaplanır — veritabanında saklanmaz.
  const rows = await prisma.invoice.findMany({
    where: { status: { not: "ODENDI" } },
    include: { client: { select: { slug: true, name: true, overdueGraceDays: true } } },
  });

  const now = new Date();
  const invoices: PendingInvoice[] = rows
    .map((i) => ({
      id: i.id,
      period: i.period,
      amount: i.amount,
      dueDate: i.dueDate ? i.dueDate.toISOString().split("T")[0] : null,
      stage: getInvoiceStage(i, now, i.client.overdueGraceDays ?? OVERDUE_GRACE_DAYS),
      daysUntilDue: i.dueDate ? daysUntilDue(i.dueDate, now) : null,
      client: i.client,
    }))
    .sort((a, b) => {
      const s = STAGE_ORDER[a.stage] - STAGE_ORDER[b.stage];
      if (s !== 0) return s;
      // Aynı aşamada: vadesi en yakın/en eski önce
      if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return 0;
    });

  return <OdemelerView invoices={invoices} />;
}
