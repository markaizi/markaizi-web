import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getWorkflowBoardData } from "@/lib/workflowBoardData";
import WorkflowBoard from "@/components/WorkflowBoard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "İş Akışı — Çalışan",
};

export default async function CalisanIsAkisiPage() {
  const session = await getSession();
  if (!session) redirect("/musteri/giris?next=/musteri/calisan/is-akisi");
  if (session.role === "CLIENT") redirect("/musteri/giris");
  if (session.role === "ADMIN") redirect("/musteri/admin/is-akisi");

  const me = await prisma.user.findUnique({ where: { id: session.uid }, select: { workflowAccess: true } });
  if (!me?.workflowAccess) redirect("/musteri/calisan");

  // Pano verisi sunucuda hazırlanır — sayfa açılır açılmaz dolu gelir,
  // istemci tarafında ayrı bir "Yükleniyor" adımına gerek kalmaz.
  const initialData = JSON.parse(JSON.stringify(await getWorkflowBoardData(session)));

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <header className="sticky top-0 z-50 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-3"
        style={{ background: "rgba(5,5,5,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <a href="/musteri/calisan" className="font-black text-[16px] sm:text-[18px] gradient-text flex-shrink-0">markaizi</a>
          <span className="hidden sm:inline text-[#555]">/</span>
          <a href="/musteri/calisan" className="hidden sm:inline text-[14px] text-[#8a8a9a] hover:text-white transition-colors">Çalışan Paneli</a>
          <span className="hidden sm:inline text-[#555]">/</span>
          <span className="text-[13px] sm:text-[14px] font-semibold text-white truncate">İş Akışı</span>
        </div>
        <a href="/musteri/calisan" className="text-[12px] sm:text-[13px] text-[#8a8a9a] hover:text-white transition-colors flex-shrink-0">← Panele Dön</a>
      </header>
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-5 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <h1 className="font-black text-[20px] sm:text-[24px] text-white mb-1">İş Akışı</h1>
          <p className="text-[12px] sm:text-[13px] text-[#8a8a9a]">Kartları sürükleyerek durum değiştirin, tıklayarak düzenleyin.</p>
        </div>
        <WorkflowBoard initialData={initialData} />
      </main>
    </div>
  );
}
