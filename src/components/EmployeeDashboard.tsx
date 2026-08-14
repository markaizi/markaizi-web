"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StaffFeedbackModal from "@/components/StaffFeedbackModal";

export interface AssignedClient {
  slug: string;
  name: string;
  pendingCount: number;
  unreadNoteCount: number;
}

export interface EmployeeStats {
  bitirilen: number;
  bekleyen: number;
  acil: number;
  currentEarnings: number;
  totalEarnings: number;
  periodLabel: string;
}

export default function EmployeeDashboard({
  clients,
  employeeName,
  workflowAccess = true,
  stats,
  canPriceWorklogs = false,
  canViewEconomy = false,
}: {
  clients: AssignedClient[];
  employeeName: string;
  workflowAccess?: boolean;
  stats?: EmployeeStats;
  canPriceWorklogs?: boolean;
  canViewEconomy?: boolean;
}) {
  const router = useRouter();
  const [showFeedback, setShowFeedback] = useState(false);

  async function handleLogout() {
    try { await fetch("/api/musteri/auth/logout", { method: "POST" }); } catch { /* ignore */ }
    window.location.href = "/musteri/giris";
  }

  const unreadTotal = clients.reduce((s, c) => s + c.unreadNoteCount, 0);

  const navItems = [
    workflowAccess && {
      key: "is-akisi",
      label: "İş Akışı",
      sub: "Kanban görev panosu",
      color: "#fb923c",
      onClick: () => router.push("/musteri/calisan/is-akisi"),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="#fb923c" strokeWidth="2">
          <rect x="3" y="3" width="5" height="18" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="10" y="3" width="5" height="11" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="17" y="3" width="4" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      key: "firmalarim",
      label: "Firmalarım",
      sub: clients.length > 0 ? `${clients.length} atanmış firma` : "Henüz atanmadı",
      color: "#c084fc",
      badge: unreadTotal > 0 ? unreadTotal : null,
      onClick: () => router.push("/musteri/calisan/firmalarim"),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="#c084fc" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      key: "takvim",
      label: "Takvim",
      sub: "İçerik takvimi",
      color: "#60a5fa",
      onClick: () => router.push("/musteri/calisan/takvim"),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="#60a5fa" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      key: "is-kayitlarim",
      label: "İş Kayıtlarım",
      sub: "Kazanç & geçmiş",
      color: "#2dd4bf",
      onClick: () => router.push("/musteri/calisan/is-kayitlarim"),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="#2dd4bf" strokeWidth="2">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    canPriceWorklogs && {
      key: "ucret-girisi",
      label: "Ücret Girişi",
      sub: "Çalışanlara ücret gir",
      color: "#22d3ee",
      onClick: () => router.push("/musteri/calisan/ucret-girisi"),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="#22d3ee" strokeWidth="2">
          <rect x="2" y="5" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 10h20" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    canViewEconomy && {
      key: "ekonomi",
      label: "Ekonomi",
      sub: "Gelir, gider, kasa",
      color: "#34d399",
      onClick: () => router.push("/musteri/admin/ekonomi"),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="#34d399" strokeWidth="2">
          <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 15l4-4 3 3 5-6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      key: "istek-sikayet",
      label: "İstek/Şikayet",
      sub: "Admin'e doğrudan yaz",
      color: "#f87171",
      onClick: () => setShowFeedback(true),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="#f87171" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      key: "profil",
      label: "Profilim",
      sub: "Şifre & hesap ayarları",
      color: "#fbbf24",
      wide: true,
      onClick: () => router.push("/musteri/calisan/profil"),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="#fbbf24" strokeWidth="2">
          <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ].filter(Boolean) as {
    key: string; label: string; sub: string; color: string; onClick: () => void;
    icon: React.ReactNode; badge?: number | null; wide?: boolean;
  }[];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <header
        className="sticky top-0 z-50 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between"
        style={{ background: "rgba(5,5,5,0.9)", WebkitBackdropFilter: "blur(20px)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <a href="/" className="font-black text-[16px] sm:text-[18px] gradient-text">markaizi</a>
          <span className="text-[#555] hidden sm:inline">/</span>
          <span className="hidden sm:inline text-[14px] font-semibold text-white">Çalışan Paneli</span>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: "rgba(96,165,250,0.12)", color: "#60a5fa", border: "1px solid rgba(96,165,250,0.2)" }}>
            Çalışan
          </span>
        </div>
        <button onClick={handleLogout} className="text-[12px] text-[#8a8a9a] hover:text-[#f87171] transition-colors flex items-center gap-1.5 min-h-[44px] px-1">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
            <path d="M18.364 5.636A9 9 0 1 1 5.636 18.364" strokeLinecap="round"/>
            <path d="M12 3v9" strokeLinecap="round"/>
          </svg>
          Çıkış
        </button>
      </header>

      <main className="max-w-[720px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="mb-6">
          <h1 className="font-black text-[22px] sm:text-[26px] text-white mb-1">Merhaba, {employeeName}</h1>
          <p className="text-[13px] sm:text-[14px] text-[#8a8a9a]">Çalışan paneline hoş geldin.</p>
        </div>

        {stats && (
          <>
            {/* Kazanç — hero, en göz önündeki kısım */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3">
              <button
                onClick={() => router.push("/musteri/calisan/is-kayitlarim")}
                className="rounded-2xl p-4 sm:p-6 text-left transition-transform active:scale-[0.98]"
                style={{ background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.25)" }}
              >
                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide" style={{ color: "#2dd4bf" }}>Bu Dönem</p>
                <p className="text-[26px] sm:text-[36px] font-black text-white leading-tight mt-1 truncate">
                  {stats.currentEarnings > 0 ? `${stats.currentEarnings.toLocaleString("tr-TR")} ₺` : "—"}
                </p>
                <p className="text-[10px] sm:text-[11px] text-[#8a8a9a] mt-1.5 leading-snug">{stats.periodLabel}</p>
              </button>
              <button
                onClick={() => router.push("/musteri/calisan/is-kayitlarim")}
                className="rounded-2xl p-4 sm:p-6 text-left transition-transform active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, rgba(251,191,36,0.14), rgba(251,146,60,0.08))", border: "1px solid rgba(251,191,36,0.3)" }}
              >
                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide" style={{ color: "#fbbf24" }}>Toplam Kazancım</p>
                <p className="text-[26px] sm:text-[36px] font-black text-white leading-tight mt-1 truncate">
                  {stats.totalEarnings > 0 ? `${stats.totalEarnings.toLocaleString("tr-TR")} ₺` : "—"}
                </p>
                <p className="text-[10px] sm:text-[11px] text-[#8a8a9a] mt-1.5 leading-snug">Tüm zamanlar</p>
              </button>
            </div>

            {/* İş durumu — küçük, ikincil */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-8">
              {[
                { label: "Bitirdiğim İş", value: stats.bitirilen, color: "#34d399" },
                { label: "Bekleyen İş", value: stats.bekleyen, color: "#60a5fa" },
                { label: "Acil İş", value: stats.acil, color: "#f87171" },
              ].map((s) => (
                <button
                  key={s.label}
                  onClick={() => router.push("/musteri/calisan/is-akisi")}
                  className="rounded-xl px-2 py-2.5 sm:px-3 sm:py-3 text-center transition-transform active:scale-[0.98]"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <p className="text-[16px] sm:text-[19px] font-black leading-none" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-[9.5px] sm:text-[10.5px] text-[#8a8a9a] mt-1 leading-snug">{s.label}</p>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Bekleyen istek özeti */}
        {unreadTotal > 0 && (
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

        {/* Menü — kaydırma gerektirmeyen sabit ızgara */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={item.onClick}
              className={`group rounded-2xl p-4 sm:p-5 text-left transition-all duration-200 relative overflow-hidden ${item.wide ? "col-span-2" : ""}`}
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = `${item.color}66`;
                (e.currentTarget as HTMLElement).style.background = `${item.color}0d`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLElement).style.background = "var(--surface)";
              }}
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${item.color}1f`, border: `1px solid ${item.color}33` }}>
                {item.icon}
              </div>
              <p className="text-[13.5px] sm:text-[15px] font-bold text-white mb-0.5">{item.label}</p>
              <p className="text-[11px] sm:text-[12px] text-[#8a8a9a] leading-snug">{item.sub}</p>
              {!!item.badge && (
                <div className="absolute right-4 top-4 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{ background: "#f87171", color: "#fff" }}>
                  {item.badge}
                </div>
              )}
            </button>
          ))}
        </div>

        {showFeedback && <StaffFeedbackModal onClose={() => setShowFeedback(false)} />}
      </main>
    </div>
  );
}
