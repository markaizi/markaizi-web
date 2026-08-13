import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import CalisanMesajlariView, { type StaffFeedbackItem } from "@/components/CalisanMesajlariView";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Çalışan Mesajları — Admin",
};

export default async function CalisanMesajlariPage() {
  const session = await getSession();
  if (!session) redirect("/musteri/giris?next=/musteri/admin/calisan-mesajlari");
  if (session.role !== "ADMIN") redirect("/musteri/admin");

  const rows = await prisma.staffFeedback.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
  });

  const items: StaffFeedbackItem[] = rows.map((r) => ({
    id: r.id,
    message: r.message,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
    user: r.user,
  }));

  return <CalisanMesajlariView items={items} />;
}
