"use client";

import { useRouter } from "next/navigation";

export interface AdminClientSummary {
  slug: string;
  name: string;
  package: string;
  metaCount: number;
  googleCount: number;
  tiktokCount: number;
  invoiceCount: number;
}

export default function AdminPanel({
  clients,
  adminName,
}: {
  clients: AdminClientSummary[];
  adminName: string;
}) {
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/musteri/auth/logout", { method: "POST" });
    } catch {
      /* yine de yönlendir */
    }
    window.location.href = "/musteri/giris";
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ background: "rgba(5,5,5,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-3">
          <a href="/" className="font-black text-[18px] gradient-text">markaizi</a>
          <span className="text-[#555]">/</span>
          <span className="text-[14px] font-semibold text-white">Admin Paneli</span>
          <span
            className="hidden sm:inline text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            Admin
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="text-[12px] text-[#8a8a9a] hover:text-[#f87171] transition-colors flex items-center gap-1.5"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
            <path d="M18.364 5.636A9 9 0 1 1 5.636 18.364" strokeLinecap="round"/>
            <path d="M12 3v9" strokeLinecap="round"/>
          </svg>
          Çıkış
        </button>
      </header>

      <main className="max-w-[960px] mx-auto px-6 py-10">
        {/* Başlık */}
        <div className="mb-10 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-black text-[24px] text-white mb-1">Müşteri Panelleri</h2>
            <p className="text-[14px] text-[#8a8a9a]">
              Merhaba {adminName} · {clients.length} aktif müşteri
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => router.push("/musteri/admin/calisanlar")}
              className="btn btn-outline text-sm px-4 py-2.5"
            >
              Çalışanlar
            </button>
            <button
              onClick={() => router.push("/musteri/admin/yeni")}
              className="btn btn-primary text-sm px-5 py-2.5"
            >
              + Yeni Firma
            </button>
          </div>
        </div>

        {/* Müşteri Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {clients.map((client) => (
            <div
              key={client.slug}
              className="rounded-2xl p-6 flex flex-col gap-4 cursor-pointer group transition-all duration-200"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              onClick={() => router.push(`/musteri/${client.slug}`)}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(168,85,247,0.35)";
                (e.currentTarget as HTMLDivElement).style.background = "var(--surface-2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLDivElement).style.background = "var(--surface)";
              }}
            >
              {/* İkon + İsim */}
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-[18px] font-black"
                  style={{ background: "var(--grad-soft)", border: "1px solid rgba(168,85,247,0.25)", color: "#c084fc" }}
                >
                  {client.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-white font-bold text-[15px] truncate">{client.name}</p>
                  <p className="text-[12px] text-[#8a8a9a] truncate">{client.package}</p>
                </div>
              </div>

              {/* Özet bilgiler */}
              <div className="flex flex-wrap gap-2 text-[11px]">
                {client.metaCount > 0 && (
                  <span className="px-2 py-1 rounded-full" style={{ background: "rgba(168,85,247,0.1)", color: "#c084fc" }}>
                    {client.metaCount} Meta kampanya
                  </span>
                )}
                {client.googleCount > 0 && (
                  <span className="px-2 py-1 rounded-full" style={{ background: "rgba(59,130,246,0.1)", color: "#60a5fa" }}>
                    {client.googleCount} Google kampanya
                  </span>
                )}
                {client.tiktokCount > 0 && (
                  <span className="px-2 py-1 rounded-full" style={{ background: "rgba(236,72,153,0.1)", color: "#f472b6" }}>
                    {client.tiktokCount} TikTok kampanya
                  </span>
                )}
                {client.invoiceCount > 0 && (
                  <span className="px-2 py-1 rounded-full" style={{ background: "rgba(52,211,153,0.1)", color: "#34d399" }}>
                    {client.invoiceCount} fatura
                  </span>
                )}
              </div>

              {/* Butonlar */}
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={(e) => { e.stopPropagation(); router.push(`/musteri/${client.slug}`); }}
                  className="btn btn-outline text-sm py-2.5 flex-1 group-hover:border-purple-500/50 transition-colors"
                >
                  Paneli Aç →
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); router.push(`/musteri/admin/${client.slug}`); }}
                  className="btn btn-outline text-sm py-2.5 px-3 transition-colors"
                  title="Yönet"
                  style={{ color: "#c084fc", borderColor: "rgba(168,85,247,0.3)" }}
                >
                  ✎
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
