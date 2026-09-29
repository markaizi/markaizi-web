import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getPaymentLinkAccess } from "@/lib/paymentLinkGuard";
import { prisma } from "@/lib/db";
import { paytrConfig } from "@/lib/paytr";
import OdemeLinkleriView from "@/components/OdemeLinkleriView";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Ödeme Linkleri — Admin",
};

export default async function OdemeLinkleriPage() {
  const session = await getSession();
  if (!session) redirect("/musteri/giris?next=/musteri/admin/odeme-linkleri");
  const access = await getPaymentLinkAccess();
  if (!access) redirect(session.role === "EMPLOYEE" ? "/musteri/calisan" : "/musteri/giris");
  const isAdmin = access.isAdmin;

  const [links, clients] = await Promise.all([
    prisma.paymentLink.findMany({
      where: isAdmin ? {} : { createdById: session.uid },
      orderBy: { createdAt: "desc" },
      take: 200,
      include: {
        client: { select: { name: true } },
        attempts: { orderBy: { createdAt: "desc" }, take: 1, select: { payerName: true, status: true, failedReasonMsg: true, testMode: true } },
      },
    }),
    isAdmin
      ? prisma.client.findMany({ where: { active: true }, orderBy: { name: "asc" }, select: { id: true, name: true } })
      : Promise.resolve([]),
  ]);

  const cfg = paytrConfig();
  return (
    <OdemeLinkleriView
      isAdmin={isAdmin}
      configured={cfg.configured}
      testMode={cfg.testMode}
      clients={clients}
      links={links.map((l) => ({
        id: l.id,
        code: l.code,
        title: l.title,
        description: l.description,
        amountKurus: l.amountKurus,
        status: l.status,
        clientName: l.client?.name ?? null,
        createdAt: l.createdAt.toISOString(),
        paidAt: l.paidAt?.toISOString() ?? null,
        lastAttempt: l.attempts[0] ?? null,
      }))}
    />
  );
}
