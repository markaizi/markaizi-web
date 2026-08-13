"use client";

import { useRouter } from "next/navigation";

export interface AssignedClient {
  slug: string;
  name: string;
  pendingCount: number;
  unreadNoteCount: number;
}

export default function EmployeeFirmalarim({ clients }: { clients: AssignedClient[] }) {
  const router = useRouter();

  async function handleLogout() {
    try { await fetch("/api/musteri/auth/logout", { method: "POST" }); } catch { /* ignore */ }
    window.location.href = "/musteri/giris";
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <header className="sticky top-0 z-50 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-3"
        style={{ background: "rgba(5,5,5,0.9)", WebkitBackdropFilter: "blur(20px)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <a href="/musteri/calisan"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all flex-shrink-0"
            style={{ background: "rgba(192,132,252,0.1)", border: "1px solid rgba(192,132,252,0.2)", color: "#c084fc" }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M5 12l7 7M5 12l7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Çalışan Paneli
          </a>
          <span className="text-[#555] hidden sm:inline">/</span>
          <span className="text-[13px] sm:text-[14px] font-semibold text-white truncate">Firmalarım</span>
        </div>
        <button onClick={handleLogout} className="text-[12px] sm:text-[13px] text-[#8a8a9a] hover:text-[#f87171] transition-colors flex-shrink-0 min-h-[44px] px-1 flex items-center">
          Çıkış
        </button>
      </header>

      <main className="max-w-[960px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="mb-8">
          <h1 className="font-black text-[22px] sm:text-[24px] text-white mb-1">Firmalarım</h1>
          <p className="text-[13px] sm:text-[14px] text-[#8a8a9a]">{clients.length} atanmış firma</p>
        </div>

        {clients.some((c) => c.unreadNoteCount > 0) && (
          <div className="mb-6 px-4 py-3 rounded-xl flex items-start gap-3"
            style={{ background: "rgba(251,146,60,0.07)", border: "1px solid rgba(251,146,60,0.2)" }}>
            <span className="text-[16px] flex-shrink-0">🔔</span>
            <div className="text-[13px]" style={{ color: "#fb923c" }}>
              {clients.filter((c) => c.unreadNoteCount > 0).map((c, i, arr) => (
                <span key={c.slug}>
                  <button
                    onClick={() => router.push(`/musteri/calisan/${c.slug}`)}
                    className="underline underline-offset-2 font-medium hover:opacity-80 transition-opacity"
                  >
                    {c.name}
                  </button>
                  {c.unreadNoteCount > 1 ? ` firmasından ${c.unreadNoteCount} isteğiniz var` : " firmasından bir isteğiniz var"}
                  {i < arr.length - 1 ? " · " : ""}
                </span>
              ))}
            </div>
          </div>
        )}

        {clients.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#8a8a9a] text-[15px]">Henüz sana atanmış firma yok.</p>
            <p className="text-[13px] text-[#555] mt-2">Admin seni bir firmaya atadığında burada görünecek.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {clients.map((client) => (
              <div
                key={client.slug}
                className="rounded-2xl p-5 sm:p-6 flex flex-col gap-4 cursor-pointer group transition-all duration-200"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                onClick={() => router.push(`/musteri/calisan/${client.slug}`)}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(96,165,250,0.35)";
                  (e.currentTarget as HTMLDivElement).style.background = "var(--surface-2)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
                  (e.currentTarget as HTMLDivElement).style.background = "var(--surface)";
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-[18px] font-black"
                    style={{ background: "var(--grad-soft)", border: "1px solid rgba(168,85,247,0.25)", color: "#c084fc" }}>
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-bold text-[15px] truncate">{client.name}</p>
                      {client.unreadNoteCount > 0 && (
                        <span
                          className="flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ background: "rgba(251,146,60,0.15)", color: "#fb923c", border: "1px solid rgba(251,146,60,0.3)" }}
                          title={`${client.unreadNoteCount} bekleyen istek`}
                        >
                          {client.unreadNoteCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-[11px]">
                  {client.pendingCount > 0 && (
                    <span className="px-2 py-1 rounded-full" style={{ background: "rgba(251,191,36,0.1)", color: "#fbbf24" }}>
                      {client.pendingCount} bekleyen içerik
                    </span>
                  )}
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); router.push(`/musteri/calisan/${client.slug}`); }}
                  className="btn btn-outline text-sm py-2.5 w-full mt-auto transition-colors"
                  style={{ borderColor: "rgba(96,165,250,0.3)", color: "#60a5fa" }}
                >
                  Çalışmaya Başla →
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
