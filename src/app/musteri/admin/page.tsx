import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Platform } from "@prisma/client";
import AdminPanel, { type AdminClientSummary } from "@/components/AdminPanel";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Admin Paneli — markaizi",
};

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/musteri/giris?next=/musteri/admin");
  if (session.role !== "ADMIN") {
    redirect(session.slug ? `/musteri/${session.slug}` : "/musteri/giris");
  }

  const rows = await prisma.client.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
    include: {
      campaigns: { select: { platform: true } },
      _count: { select: { invoices: true } },
    },
  });

  const clients: AdminClientSummary[] = rows.map((c) => ({
    slug: c.slug,
    name: c.name,
    package: c.package,
    metaCount: c.campaigns.filter((x) => x.platform === Platform.META).length,
    googleCount: c.campaigns.filter((x) => x.platform === Platform.GOOGLE).length,
    tiktokCount: c.campaigns.filter((x) => x.platform === Platform.TIKTOK).length,
    invoiceCount: c._count.invoices,
  }));

  return <AdminPanel clients={clients} adminName={session.name} />;
}
