"use client";

import { useRouter } from "next/navigation";

export interface AssignedClient {
  slug: string;
  name: string;
  package: string;
  pendingCount: number;
  metaCount: number;
  googleCount: number;
  tiktokCount: number;
  unreadNoteCount: number;
}

export default function EmployeeDashboard({
  clients,
  employeeName,
}: {
  clients: AssignedClient[];
  employeeName: string;
}) {
  const router = useRouter();

  async function handleLogout() {
    try { await fetch("/api/musteri/auth/logout", { method: "POST" }); } catch { /* ignore */ }
    window.location.href = "/musteri/giris";
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <header
        className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ background: "rgba(5,5,5,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-3">
          <a href="/" className="font-black text-[18px] gradient-text">markaizi</a>
          <span className="text-[#555]">/</span>
          <span className="text-[14px] font-semibold text-white">Çalışan Paneli</span>
          <span className="hidden sm:inline text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: "rgba(96,165,250,0.12)", color: "#60a5fa", border: "1px solid rgba(96,165,250,0.2)" }}>
            Çalışan
          </span>
        </div>
        <button onClick={handleLogout} className="text-[12px] text-[#8a8a9a] hover:text-[#f87171] transition-colors flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
            <path d="M18.364 5.636A9 9 0 1 1 5.636 18.364" strokeLinecap="round"/>
            <path d="M12 3v9" strokeLinecap="round"/>
          </svg>
          Çıkış
        </button>
      </header>

      <main className="max-w-[960px] mx-auto px-6 py-10">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-black text-[24px] text-white mb-1">Atanmış Firmalar</h2>
            <p className="text-[14px] text-[#8a8a9a]">Merhaba {employeeName} · {clients.length} firma</p>
          </div>
          <button
            onClick={() => router.push("/musteri/calisan/takvim")}
            className="btn btn-outline text-sm px-4 py-2.5 self-start sm:self-auto"
          >
            📅 Takvim
          </button>
        </div>

        {/* Okunmamış not özeti */}
        {clients.some((c) => c.unreadNoteCount > 0) && (
          <div className="mb-6 px-4 py-3 rounded-xl flex items-start gap-3"
            style={{ background: "rgba(251,146,60,0.07)", border: "1px solid rgba(251,146,60,0.2)" }}>
            <span className="text-[16px] flex-shrink-0">🔔</span>
            <div className="text-[13px]" style={{ color: "#fb923c" }}>
              <span className="font-semibold">Okunmamış not: </span>
              {clients.filter((c) => c.unreadNoteCount > 0).map((c, i, arr) => (
                <span key={c.slug}>
                  <button
                    onClick={() => router.push(`/musteri/calisan/${c.slug}`)}
                    className="underline underline-offset-2 font-medium hover:opacity-80 transition-opacity"
                  >
                    {c.name} ({c.unreadNoteCount})
                  </button>
                  {i < arr.length - 1 ? ", " : ""}
                </span>
              ))}
            </div>
          </div>
        )}

        {clients.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#8a8a9a] text-[15px]">Henüz sana atanmış firma yok.</p>
            <p className="text-[13px] text-[#555] mt-2">Admin seni bir firmaya atadığında burada görünecek.</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {clients.map((client) => (
            <div
              key={client.slug}
              className="rounded-2xl p-6 flex flex-col gap-4 cursor-pointer group transition-all duration-200"
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
                        title={`${client.unreadNoteCount} okunmamış not`}
                      >
                        {client.unreadNoteCount}
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-[#8a8a9a] truncate">{client.package}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-[11px]">
                {client.pendingCount > 0 && (
                  <span className="px-2 py-1 rounded-full" style={{ background: "rgba(251,191,36,0.1)", color: "#fbbf24" }}>
                    {client.pendingCount} bekleyen içerik
                  </span>
                )}
                {client.metaCount > 0 && (
                  <span className="px-2 py-1 rounded-full" style={{ background: "rgba(168,85,247,0.1)", color: "#c084fc" }}>
                    {client.metaCount} Meta
                  </span>
                )}
                {client.googleCount > 0 && (
                  <span className="px-2 py-1 rounded-full" style={{ background: "rgba(59,130,246,0.1)", color: "#60a5fa" }}>
                    {client.googleCount} Google
                  </span>
                )}
                {client.tiktokCount > 0 && (
                  <span className="px-2 py-1 rounded-full" style={{ background: "rgba(236,72,153,0.1)", color: "#f472b6" }}>
                    {client.tiktokCount} TikTok
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
      </main>
    </div>
  );
}
