import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { loadKasaData } from "@/lib/agenda";
import { ensureClientReceivables, parseTry } from "@/lib/clientPayments";
import { OVERDUE_GRACE_DAYS } from "@/lib/invoiceStage";
import KasaView from "@/components/KasaView";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Finans — Admin",
};

// Finans = eski Ekonomi + Ödemeler + Kasa (v3.5.0). Tek kaynak Kasa (KasaEntry).
// Yalnızca ADMIN — kişisel nakit/borç bilgisi içerir; çalışana hiçbir yetkiyle açılmaz.
export default async function FinansPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const session = await getSession();
  if (!session) redirect("/musteri/giris?next=/musteri/admin/finans");
  if (session.role !== "ADMIN") redirect("/musteri/admin");
  const { tab } = await searchParams;

  // Aylık müşteri alacakları (bu ay + gelecek ay) eksikse açılır — Mİ Asistan'ın yaptığı gibi.
  await ensureClientReceivables().catch((e) => console.error("[finans] alacak üretimi başarısız:", e));

  const now = new Date();
  const [{ entries, cardTxs }, clients, employees] = await Promise.all([
    loadKasaData(),
    // Pasif firmalar da gelir: ödeme girilebilsin ve geçmiş tahsilatları tabloda görünsün (aylık alacak açılmaz).
    prisma.client.findMany({
      orderBy: [{ active: "desc" }, { name: "asc" }],
      select: { id: true, slug: true, name: true, active: true, billingAmount: true, paymentDay: true, paymentDay2: true, overdueGraceDays: true },
    }),
    // Maaş / avans kaydında seçilebilecek çalışanlar — seçilen çalışan ödemeyi kendi ekranında (salt okunur) görür.
    prisma.user.findMany({ where: { role: "EMPLOYEE", active: true }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <KasaView
      entries={entries}
      cardTxs={cardTxs}
      clients={clients.map((c) => ({
        id: c.id, slug: c.slug, name: c.name, active: c.active, fee: c.active ? parseTry(c.billingAmount) : 0,
        paymentDays: [c.paymentDay, c.paymentDay2].filter((d): d is number => !!d),
        graceDays: c.overdueGraceDays ?? OVERDUE_GRACE_DAYS,
      }))}
      employees={employees}
      nowIso={now.toISOString()}
      initialTab={tab === "musteri" ? "musteri" : "genel"}
    />
  );
}
