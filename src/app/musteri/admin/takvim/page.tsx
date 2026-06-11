import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminCalendarView from "@/components/AdminCalendarView";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Takvim — Admin",
};

export default async function AdminTakvimPage() {
  const session = await getSession();
  if (!session) redirect("/musteri/giris?next=/musteri/admin/takvim");
  if (session.role !== "ADMIN") redirect("/musteri/admin");

  return <AdminCalendarView />;
}
