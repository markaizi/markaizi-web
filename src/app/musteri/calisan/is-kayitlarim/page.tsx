import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import EmployeeWorkLogs from "@/components/EmployeeWorkLogs";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "İş Kayıtlarım — markaizi",
};

export default async function CalisanIsKayitlarimPage() {
  const session = await getSession();
  if (!session) redirect("/musteri/giris?next=/musteri/calisan/is-kayitlarim");
  if (session.role === "CLIENT") redirect(session.slug ? `/musteri/${session.slug}` : "/musteri/giris");
  if (session.role === "ADMIN") redirect("/musteri/admin");

  const [user, logs] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.uid }, select: { paymentDay: true } }),
    prisma.workLog.findMany({ where: { userId: session.uid }, orderBy: { date: "desc" } }),
  ]);

  return (
    <EmployeeWorkLogs
      employeeName={session.name}
      paymentDay={user?.paymentDay ?? ""}
      logs={logs.map((l) => ({
        id: l.id,
        date: l.date.toISOString(),
        description: l.description,
        amount: l.amount,
      }))}
    />
  );
}
