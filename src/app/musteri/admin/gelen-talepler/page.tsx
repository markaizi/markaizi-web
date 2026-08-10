import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import GelenTaleplerView from "@/components/GelenTaleplerView";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Gelen Talepler — Admin",
};

export default async function GelenTaleplerPage() {
  const session = await getSession();
  if (!session) redirect("/musteri/giris?next=/musteri/admin/gelen-talepler");
  if (session.role !== "ADMIN") redirect("/musteri/admin");

  const rows = await prisma.submission.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  const submissions = rows.map((r) => ({
    id: r.id,
    type: r.type,
    data: r.data as Record<string, unknown>,
    emailSent: r.emailSent,
    read: r.read,
    createdAt: r.createdAt.toISOString(),
  }));

  return <GelenTaleplerView submissions={submissions} />;
}
