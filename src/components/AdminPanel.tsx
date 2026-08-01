"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface AdminClientSummary {
  slug: string;
  name: string;
  package: string;
  activeCampaignCount: number;
  totalCampaignCount: number;
  pendingInvoiceCount: number;
  overdueInvoiceCount: number;
  unreadNoteCount: number;
}

type Section = "dashboard" | "firmalar";

export default function AdminPanel({
  clients,
  adminName,
  employeeCount,
}: {
  clients: AdminClientSummary[];
  adminName: string;
  employeeCount: number;
}) {
  const router = useRouter();
  const [section, setSection] = useState<Section>("dashboard");

  async function handleLogout() {
    try { await fetch("/api/musteri/auth/logout", { method: "POST" }); } catch { /* yine de yönlendir */ }
    window.location.href = "/musteri/giris";
  }

  const totalUnread = clients.reduce((s, c) => s + c.unreadNoteCount, 0);
  const totalOverdue = clients.reduce((s, c) => s + c.overdueInvoiceCount, 0);
  const totalActiveCampaigns = clients.reduce((s, c) => s + c.activeCampaignCount, 0);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ background: "rgba(5,5,5,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => setSection("dashboard")} className="font-black text-[18px] gradient-text">markaizi</button>
          <span className="text-[#555]">/</span>
          {section === "firmalar" ? (
            <div className="flex items-center gap-2">
              <button onClick={() => setSection("dashboard")} className="text-[14px] text-[#8a8a9a] hover:text-white transition-colors">Admin</button>
              <span className="text-[#555]">/</span>
              <span className="text-[14px] font-semibold text-white">Firmalar</span>
            </div>
          ) : (
            <span className="text-[14px] font-semibold text-white">Admin Paneli</span>
          )}
          <span className="hidden sm:inline text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
            Admin
          </span>
        </div>
        <button onClick={handleLogout}
          className="text-[12px] text-[#8a8a9a] hover:text-[#f87171] transition-colors flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
            <path d="M18.364 5.636A9 9 0 1 1 5.636 18.364" strokeLinecap="round"/>
            <path d="M12 3v9" strokeLinecap="round"/>
          </svg>
          Çıkış
        </button>
      </header>

      <main className="max-w-[960px] mx-auto px-6 py-10">
        {section === "dashboard" && (
          <Dashboard
            clients={clients}
            adminName={adminName}
            employeeCount={employeeCount}
            totalUnread={totalUnread}
            totalOverdue={totalOverdue}
            totalActiveCampaigns={totalActiveCampaigns}
            onGoFirmalar={() => setSection("firmalar")}
            router={router}
          />
        )}
        {section === "firmalar" && (
          <FirmalarView clients={clients} onBack={() => setSection("dashboard")} router={router} />
        )}
      </main>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function Dashboard({ clients, adminName, employeeCount, totalUnread, totalOverdue, totalActiveCampaigns, onGoFirmalar, router }: {
  clients: AdminClientSummary[];
  adminName: string;
  employeeCount: number;
  totalUnread: number;
  totalOverdue: number;
  totalActiveCampaigns: number;
  onGoFirmalar: () => void;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <>
      {/* Selamlama */}
      <div className="mb-8">
        <h1 className="font-black text-[26px] text-white mb-1">Merhaba, {adminName}</h1>
        <p className="text-[14px] text-[#8a8a9a]">markaizi yönetim paneline hoş geldin.</p>
      </div>

      {/* Hızlı özet çubukları */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Aktif Firma", value: clients.length, color: "#c084fc", bg: "rgba(192,132,252,0.1)", border: "rgba(192,132,252,0.2)" },
          { label: "Aktif Kampanya", value: totalActiveCampaigns, color: "#60a5fa", bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.2)" },
          { label: "Çalışan", value: employeeCount, color: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.2)" },
          {
            label: totalOverdue > 0 ? "Gecikmiş Fatura" : "Okunmamış Not",
            value: totalOverdue > 0 ? totalOverdue : totalUnread,
            color: totalOverdue > 0 ? "#f87171" : "#fb923c",
            bg: totalOverdue > 0 ? "rgba(248,113,113,0.1)" : "rgba(251,146,60,0.1)",
            border: totalOverdue > 0 ? "rgba(248,113,113,0.2)" : "rgba(251,146,60,0.2)",
          },
        ].map(stat => (
          <div key={stat.label} className="rounded-2xl p-4" style={{ background: stat.bg, border: `1px solid ${stat.border}` }}>
            <p className="text-[28px] font-black" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-[12px] text-[#8a8a9a] mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Uyarı: gecikmiş fatura veya okunmamış not */}
      {(totalOverdue > 0 || totalUnread > 0) && (
        <div className="mb-6 space-y-2">
          {totalOverdue > 0 && (
            <div className="px-4 py-3 rounded-xl flex items-center gap-3"
              style={{ background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.2)" }}>
              <span className="text-[15px] flex-shrink-0">⚠️</span>
              <p className="text-[13px]" style={{ color: "#f87171" }}>
                <span className="font-semibold">{totalOverdue} gecikmiş fatura</span> var —{" "}
                {clients.filter(c => c.overdueInvoiceCount > 0).map((c, i, arr) => (
                  <span key={c.slug}>
                    <button onClick={() => router.push(`/musteri/admin/${c.slug}`)}
                      className="underline underline-offset-2 font-medium hover:opacity-80 transition-opacity">
                      {c.name}
                    </button>
                    {i < arr.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            </div>
          )}
          {totalUnread > 0 && (
            <div className="px-4 py-3 rounded-xl flex items-center gap-3"
              style={{ background: "rgba(251,146,60,0.07)", border: "1px solid rgba(251,146,60,0.2)" }}>
              <span className="text-[15px] flex-shrink-0">🔔</span>
              <p className="text-[13px]" style={{ color: "#fb923c" }}>
                <span className="font-semibold">Okunmamış not: </span>
                {clients.filter(c => c.unreadNoteCount > 0).map((c, i, arr) => (
                  <span key={c.slug}>
                    <button onClick={() => router.push(`/musteri/admin/${c.slug}`)}
                      className="underline underline-offset-2 font-medium hover:opacity-80 transition-opacity">
                      {c.name} ({c.unreadNoteCount})
                    </button>
                    {i < arr.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Ana navigasyon kartları */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Firmalar */}
        <button onClick={onGoFirmalar}
          className="group rounded-2xl p-6 text-left transition-all duration-200 relative overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(168,85,247,0.4)";
            (e.currentTarget as HTMLElement).style.background = "rgba(168,85,247,0.08)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
            (e.currentTarget as HTMLElement).style.background = "var(--surface)";
          }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
            style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.25)" }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="#c084fc" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-[17px] font-bold text-white mb-1">Firmalar</p>
          <p className="text-[13px] text-[#8a8a9a]">{clients.length} aktif firma</p>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[#555] group-hover:text-[#c084fc] transition-colors">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </button>

        {/* İş Akışı */}
        <button onClick={() => router.push("/musteri/admin/is-akisi")}
          className="group rounded-2xl p-6 text-left transition-all duration-200 relative overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(251,146,60,0.4)";
            (e.currentTarget as HTMLElement).style.background = "rgba(251,146,60,0.06)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
            (e.currentTarget as HTMLElement).style.background = "var(--surface)";
          }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
            style={{ background: "rgba(251,146,60,0.12)", border: "1px solid rgba(251,146,60,0.2)" }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="#fb923c" strokeWidth="2">
              <rect x="3" y="3" width="5" height="18" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="10" y="3" width="5" height="11" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="17" y="3" width="4" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-[17px] font-bold text-white mb-1">İş Akışı</p>
          <p className="text-[13px] text-[#8a8a9a]">Kanban görev panosu</p>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[#555] group-hover:text-[#fb923c] transition-colors">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </button>

        {/* Takvim */}
        <button onClick={() => router.push("/musteri/admin/takvim")}
          className="group rounded-2xl p-6 text-left transition-all duration-200 relative overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(96,165,250,0.4)";
            (e.currentTarget as HTMLElement).style.background = "rgba(96,165,250,0.06)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
            (e.currentTarget as HTMLElement).style.background = "var(--surface)";
          }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
            style={{ background: "rgba(96,165,250,0.12)", border: "1px solid rgba(96,165,250,0.2)" }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="#60a5fa" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-[17px] font-bold text-white mb-1">İçerik Takvimi</p>
          <p className="text-[13px] text-[#8a8a9a]">Tüm firmalar & planlama</p>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[#555] group-hover:text-[#60a5fa] transition-colors">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </button>

        {/* Çalışanlar */}
        <button onClick={() => router.push("/musteri/admin/calisanlar")}
          className="group rounded-2xl p-6 text-left transition-all duration-200 relative overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(52,211,153,0.4)";
            (e.currentTarget as HTMLElement).style.background = "rgba(52,211,153,0.06)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
            (e.currentTarget as HTMLElement).style.background = "var(--surface)";
          }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
            style={{ background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.2)" }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="#34d399" strokeWidth="2">
              <circle cx="12" cy="8" r="4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 21a8 8 0 1 0-16 0" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-[17px] font-bold text-white mb-1">Çalışanlar</p>
          <p className="text-[13px] text-[#8a8a9a]">{employeeCount} aktif çalışan</p>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[#555] group-hover:text-[#34d399] transition-colors">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </button>

        {/* Profilim */}
        <button onClick={() => router.push("/musteri/admin/profil")}
          className="group rounded-2xl p-6 text-left transition-all duration-200 relative overflow-hidden col-span-2"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(251,191,36,0.4)";
            (e.currentTarget as HTMLElement).style.background = "rgba(251,191,36,0.05)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
            (e.currentTarget as HTMLElement).style.background = "var(--surface)";
          }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
            style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)" }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="#fbbf24" strokeWidth="2">
              <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-[17px] font-bold text-white mb-1">Profilim</p>
          <p className="text-[13px] text-[#8a8a9a]">Şifre & hesap ayarları</p>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[#555] group-hover:text-[#fbbf24] transition-colors">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </button>
      </div>

      {/* Yeni firma butonu */}
      <button onClick={() => router.push("/musteri/admin/yeni")}
        className="w-full rounded-2xl py-3.5 text-[14px] font-semibold transition-all"
        style={{ background: "rgba(168,85,247,0.1)", border: "1px dashed rgba(168,85,247,0.3)", color: "#c084fc" }}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(168,85,247,0.16)")}
        onMouseLeave={e => (e.currentTarget.style.background = "rgba(168,85,247,0.1)")}>
        + Yeni Firma Ekle
      </button>
    </>
  );
}

// ── Firmalar Tablosu ──────────────────────────────────────────────────────────

function FirmalarView({ clients, onBack, router }: {
  clients: AdminClientSummary[];
  onBack: () => void;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-black text-[22px] text-white mb-1">Firmalar</h2>
          <p className="text-[13px] text-[#8a8a9a]">{clients.length} aktif firma</p>
        </div>
        <button onClick={() => router.push("/musteri/admin/yeni")}
          className="text-[13px] px-4 py-2 rounded-xl font-semibold transition-all"
          style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)", color: "#c084fc" }}>
          + Yeni Firma
        </button>
      </div>

      {/* Tablo */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        {/* Başlık */}
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-3 px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#555]"
          style={{ background: "var(--surface-2,#0a0a0f)", borderBottom: "1px solid var(--border)" }}>
          <span>Firma</span>
          <span className="text-center w-24">Kampanya</span>
          <span className="text-center w-24">Fatura</span>
          <span className="text-center w-16">Not</span>
          <span className="w-16"></span>
        </div>

        {/* Satırlar */}
        {clients.map((client, i) => {
          const isOverdue = client.overdueInvoiceCount > 0;
          const isLast = i === clients.length - 1;
          return (
            <div key={client.slug}
              onClick={() => router.push(`/musteri/admin/${client.slug}`)}
              className="group grid grid-cols-[1fr_auto_auto_auto_auto] gap-3 items-center px-5 py-4 cursor-pointer transition-colors"
              style={{
                borderBottom: isLast ? "none" : "1px solid var(--border)",
                background: isOverdue ? "rgba(248,113,113,0.04)" : "transparent",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = isOverdue ? "rgba(248,113,113,0.08)" : "rgba(255,255,255,0.025)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = isOverdue ? "rgba(248,113,113,0.04)" : "transparent"}>

              {/* Firma adı + paket */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-[13px] font-black"
                  style={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.2)", color: "#c084fc" }}>
                  {client.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-semibold text-[14px] truncate">{client.name}</p>
                    {isOverdue && (
                      <span className="flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: "rgba(248,113,113,0.15)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)" }}>
                        Gecikmiş
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-[#555] truncate">{client.package}</p>
                </div>
              </div>

              {/* Kampanya */}
              <div className="w-24 text-center">
                {client.activeCampaignCount > 0 ? (
                  <span className="text-[12px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(96,165,250,0.1)", color: "#60a5fa" }}>
                    {client.activeCampaignCount} aktif
                  </span>
                ) : client.totalCampaignCount > 0 ? (
                  <span className="text-[12px] text-[#555]">{client.totalCampaignCount} kamp.</span>
                ) : (
                  <span className="text-[12px] text-[#444]">—</span>
                )}
              </div>

              {/* Fatura */}
              <div className="w-24 text-center">
                {client.overdueInvoiceCount > 0 ? (
                  <span className="text-[12px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(248,113,113,0.15)", color: "#f87171" }}>
                    {client.overdueInvoiceCount} gecikmiş
                  </span>
                ) : client.pendingInvoiceCount > 0 ? (
                  <span className="text-[12px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(251,191,36,0.12)", color: "#fbbf24" }}>
                    {client.pendingInvoiceCount} bekliyor
                  </span>
                ) : (
                  <span className="text-[12px] text-[#444]">—</span>
                )}
              </div>

              {/* Not */}
              <div className="w-16 text-center">
                {client.unreadNoteCount > 0 ? (
                  <span className="text-[12px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(251,146,60,0.15)", color: "#fb923c" }}>
                    {client.unreadNoteCount}
                  </span>
                ) : (
                  <span className="text-[12px] text-[#444]">—</span>
                )}
              </div>

              {/* Yönet ok */}
              <div className="w-16 flex justify-end">
                <span className="text-[#444] group-hover:text-[#c084fc] transition-colors text-[12px] font-medium flex items-center gap-1">
                  Yönet
                  <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
            </div>
          );
        })}

        {clients.length === 0 && (
          <div className="px-5 py-12 text-center">
            <p className="text-[14px] text-[#555]">Henüz firma eklenmemiş.</p>
          </div>
        )}
      </div>
    </>
  );
}
