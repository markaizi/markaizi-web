import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import EmployeeCalendarView from "@/components/EmployeeCalendarView";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Takvim — Çalışan",
};

export default async function CalisanTakvimPage() {
  const session = await getSession();
  if (!session) redirect("/musteri/giris?next=/musteri/calisan/takvim");
  if (session.role === "CLIENT") redirect("/musteri/giris");
  if (session.role === "ADMIN") redirect("/musteri/admin/takvim");

  return <EmployeeCalendarView />;
}
