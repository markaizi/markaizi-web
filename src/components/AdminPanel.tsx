"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CLIENTS } from "@/lib/clients";

export default function AdminPanel() {
  const router   = useRouter();
  const [authed, setAuthed]     = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("mkz_admin") === "1") {
      setAuthed(true);
    }
    setChecking(false);
  }, []);

  function handleLogout() {
    sessionStorage.removeItem("mkz_admin");
    router.push("/");
  }

  function openClient(slug: string) {
    // Admin tüm panellere şifresiz erişebilir
    sessionStorage.setItem(`mkz_auth_${slug}`, "1");
    router.push(`/musteri/${slug}`);
  }

  if (checking) return null;

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="text-center px-6">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-white font-bold text-xl mb-2">Yetkisiz Erişim</h1>
          <p className="text-[#8a8a9a] text-sm mb-6">Bu sayfaya erişmek için admin girişi yapmanız gerekiyor.</p>
          <a href="/" className="btn btn-primary">Ana Sayfaya Dön</a>
        </div>
      </div>
    );
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
          className="text-[12px] text-[#8a8a9a] hover:text-white transition-colors flex items-center gap-1.5"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Çıkış
        </button>
      </header>

      <main className="max-w-[960px] mx-auto px-6 py-10">
        {/* Başlık */}
        <div className="mb-10">
          <h2 className="font-black text-[24px] text-white mb-1">Müşteri Panelleri</h2>
          <p className="text-[14px] text-[#8a8a9a]">
            {CLIENTS.length} aktif müşteri · Bir panele tıklayarak şifresiz erişebilirsiniz.
          </p>
        </div>

        {/* Müşteri Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CLIENTS.map((client) => (
            <div
              key={client.slug}
              className="rounded-2xl p-6 flex flex-col gap-4 cursor-pointer group transition-all duration-200"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
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
                {(client.metaCampaigns?.length ?? 0) > 0 && (
                  <span className="px-2 py-1 rounded-full" style={{ background: "rgba(168,85,247,0.1)", color: "#c084fc" }}>
                    {client.metaCampaigns!.length} Meta kampanya
                  </span>
                )}
                {(client.googleCampaigns?.length ?? 0) > 0 && (
                  <span className="px-2 py-1 rounded-full" style={{ background: "rgba(59,130,246,0.1)", color: "#60a5fa" }}>
                    {client.googleCampaigns!.length} Google kampanya
                  </span>
                )}
                {(client.invoices?.length ?? 0) > 0 && (
                  <span className="px-2 py-1 rounded-full" style={{ background: "rgba(52,211,153,0.1)", color: "#34d399" }}>
                    {client.invoices!.length} fatura
                  </span>
                )}
              </div>

              {/* Panel aç butonu */}
              <button
                onClick={() => openClient(client.slug)}
                className="btn btn-outline text-sm py-2.5 w-full mt-auto group-hover:border-purple-500/50 transition-colors"
              >
                Paneli Aç →
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
