import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import WorkflowBoard from "@/components/WorkflowBoard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "İş Akışı — Admin",
};

export default async function AdminIsAkisiPage() {
  const session = await getSession();
  if (!session) redirect("/musteri/giris?next=/musteri/admin/is-akisi");
  if (session.role !== "ADMIN") redirect("/musteri/admin");

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ background: "rgba(5,5,5,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-3">
          <a href="/musteri/admin" className="font-black text-[18px] gradient-text">markaizi</a>
          <span className="text-[#555]">/</span>
          <a href="/musteri/admin" className="text-[14px] text-[#8a8a9a] hover:text-white transition-colors">Admin</a>
          <span className="text-[#555]">/</span>
          <span className="text-[14px] font-semibold text-white">İş Akışı</span>
        </div>
        <a href="/musteri/admin" className="text-[13px] text-[#8a8a9a] hover:text-white transition-colors">← Panele Dön</a>
      </header>
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="font-black text-[24px] text-white mb-1">İş Akışı</h1>
          <p className="text-[13px] text-[#8a8a9a]">Kartları sürükleyerek durum değiştirin, tıklayarak düzenleyin.</p>
        </div>
        <WorkflowBoard />
      </main>
    </div>
  );
}
