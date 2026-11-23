import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { listEmployeePayments } from "@/lib/clientPayments";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Ödemelerim — Çalışan Paneli",
};

// Çalışanın kendi ödemeleri — admin Finans'tan girer; burada yalnızca görüntülenir (v3.6.0).
export default async function OdemelerimPage() {
  const session = await getSession();
  if (!session) redirect("/musteri/giris?next=/musteri/calisan/odemelerim");
  if (session.role !== "EMPLOYEE") redirect(session.role === "ADMIN" ? "/musteri/admin" : "/musteri/giris");

  const payments = await listEmployeePayments(session.uid);
  const paidTotal = payments.filter((p) => p.status === "ODENDI").reduce((a, p) => a + p.amount, 0);
  const fmt = (n: number) => `${n.toLocaleString("tr-TR")} ₺`;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <header className="sticky top-0 z-50 px-4 sm:px-6 py-3.5 flex items-center gap-3"
        style={{ background: "var(--header-bg)", WebkitBackdropFilter: "blur(20px)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}>
        <Link href="/musteri/calisan" className="font-black text-[16px] sm:text-[18px] gradient-text">markaizi</Link>
        <span className="text-[#555]">/</span>
        <span className="text-[14px] font-semibold text-white">Ödemelerim</span>
      </header>
      <main className="max-w-[720px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <h1 className="font-black text-[22px] text-white mb-1">Ödemelerim</h1>
        <p className="text-[13px] text-[#8a8a9a] mb-5">Sana yapılan maaş ve avans ödemeleri. Kayıtları yönetici girer.</p>
        <div className="rounded-2xl p-5 mb-5" style={{ background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.25)" }}>
          <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "#2dd4bf" }}>Toplam ödenen</p>
          <p className="text-[28px] font-black text-white">{fmt(paidTotal)}</p>
        </div>
        <div className="rounded-2xl px-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          {payments.length === 0 && <p className="text-[13px] text-[#8a8a9a] py-5">Henüz kayıtlı ödeme yok.</p>}
          {payments.map((p, i) => (
            <div key={p.id} className="flex items-center justify-between gap-3 py-3.5" style={i ? { borderTop: "1px solid var(--border)" } : undefined}>
              <div className="min-w-0">
                <p className="text-[14px] text-white">{p.title}</p>
                <p className="text-[12px] text-[#8a8a9a]">
                  {new Date(p.date).toLocaleDateString("tr-TR", { timeZone: "Europe/Istanbul", day: "numeric", month: "long", year: "numeric" })}
                  {p.status === "BEKLIYOR" ? " · Planlandı" : ""}
                </p>
              </div>
              <p className="text-[15px] font-bold whitespace-nowrap" style={{ color: p.status === "ODENDI" ? "#34d399" : "#fbbf24" }}>{fmt(p.amount)}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
