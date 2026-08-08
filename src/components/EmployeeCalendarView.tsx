"use client";

import Calendar from "@/components/Calendar";

export default function EmployeeCalendarView() {
  async function handleLogout() {
    try { await fetch("/api/musteri/auth/logout", { method: "POST" }); } catch { /* ignore */ }
    window.location.href = "/musteri/giris";
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ background: "rgba(5,5,5,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2">
          <a href="/musteri/calisan"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all"
            style={{ background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)", color: "#60a5fa" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(96,165,250,0.2)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(96,165,250,0.1)"; }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M5 12l7 7M5 12l7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Çalışan Paneli
          </a>
          <span className="text-[#555]">/</span>
          <span className="text-[14px] font-semibold text-white">Takvim</span>
        </div>
        <button onClick={handleLogout} className="text-[12px] text-[#8a8a9a] hover:text-[#f87171] transition-colors flex items-center gap-1.5 min-h-[44px] px-1">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
            <path d="M18.364 5.636A9 9 0 1 1 5.636 18.364" strokeLinecap="round"/>
            <path d="M12 3v9" strokeLinecap="round"/>
          </svg>
          Çıkış
        </button>
      </header>

      <main className="max-w-[960px] mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="font-black text-[22px] text-white mb-1">İçerik Takvimi</h1>
          <p className="text-[13px] text-[#8a8a9a]">Atanmış firmalarının planlanmış içerikleri</p>
        </div>
        <Calendar showClientName canEdit />
      </main>
    </div>
  );
}
