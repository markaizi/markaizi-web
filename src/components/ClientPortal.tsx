"use client";

import { useState, useEffect } from "react";
import type { ClientData, Campaign } from "@/lib/clients";
import Calendar from "@/components/Calendar";
import Notes from "@/components/Notes";

type Tab = "meta" | "google" | "tiktok" | "website" | "updates" | "calendar" | "invoice" | "notlar";

function fmtAmount(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return raw;
  const num = parseInt(digits, 10);
  if (isNaN(num)) return raw;
  return num.toLocaleString("tr-TR") + " ₺";
}

function fmtBudget(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return raw;
  const num = parseInt(digits, 10);
  if (isNaN(num)) return raw;
  return num.toLocaleString("tr-TR") + " ₺/gün";
}

function parseBudgetNum(raw: string): number {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return 0;
  return parseInt(digits, 10) || 0;
}

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "meta",     label: "Meta Ads",           emoji: "📣" },
  { id: "google",   label: "Google Ads",          emoji: "🔍" },
  { id: "tiktok",   label: "TikTok Ads",          emoji: "🎵" },
  { id: "website",  label: "Website",             emoji: "🌐" },
  { id: "updates",  label: "Güncellemeler",        emoji: "📝" },
  { id: "calendar", label: "İçerik Takvimi",       emoji: "📅" },
  { id: "invoice",  label: "Fatura",               emoji: "💳" },
  { id: "notlar",   label: "Notlar",               emoji: "🗒️" },
];

// ── Ana bileşen ──────────────────────────────────────────────────────────────
export default function ClientPortal({
  client,
  isAdminView = false,
  canWriteNotes = false,
}: {
  client: ClientData;
  isAdminView?: boolean;
  canWriteNotes?: boolean;
}) {
  async function handleLogout() {
    try {
      await fetch("/api/musteri/auth/logout", { method: "POST" });
    } catch { /* yine de yönlendir */ }
    window.location.href = isAdminView ? "/musteri/admin" : "/musteri/giris";
  }

  return <Dashboard client={client} onLogout={handleLogout} isAdminView={isAdminView} canWriteNotes={canWriteNotes} />;
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({
  client,
  onLogout,
  isAdminView,
  canWriteNotes,
}: {
  client: ClientData;
  onLogout: () => void;
  isAdminView: boolean;
  canWriteNotes: boolean;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("meta");

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ background: "rgba(5,5,5,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <a href="/" className="font-black text-[18px] gradient-text flex-shrink-0">markaizi</a>
          <span className="text-[#555] flex-shrink-0">/</span>
          <span className="text-[14px] font-semibold text-white truncate">{client.name}</span>
          <span
            className="hidden sm:inline text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0"
            style={{ background: "rgba(168,85,247,0.12)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.2)" }}
          >
            {client.package}
          </span>
        </div>
        {isAdminView ? (
          <a href="/musteri/admin"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all flex-shrink-0"
            style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)", color: "#c084fc" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(168,85,247,0.2)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(168,85,247,0.1)"; }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M5 12l7 7M5 12l7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Admin Paneli
          </a>
        ) : (
          <button onClick={onLogout} className="text-[12px] text-[#8a8a9a] hover:text-[#f87171] transition-colors flex items-center gap-1.5 flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
              <path d="M18.364 5.636A9 9 0 1 1 5.636 18.364" strokeLinecap="round"/>
              <path d="M12 3v9" strokeLinecap="round"/>
            </svg>
            Çıkış
          </button>
        )}
      </header>

      <main className="max-w-[1080px] mx-auto px-6 py-10">
        {/* Hoş geldin + özet */}
        <div className="mb-7">
          <div className="flex items-center gap-3 mb-5">
            <div>
              <h2 className="font-black text-[22px] text-white">Merhaba, {client.name} 👋</h2>
              <p className="text-[13px] text-[#8a8a9a] mt-0.5">Aşağıdan dilediğiniz bölüme geçebilirsiniz.</p>
            </div>
          </div>
          {/* Inline özet */}
          <QuickSummary client={client} onNavigate={setActiveTab} />
        </div>

        {/* Sekmeler — yatay pill bar */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 mb-7 -mx-6 px-6 sm:mx-0 sm:px-0" style={{ scrollbarWidth: "none" }}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all flex-shrink-0"
                style={
                  isActive
                    ? {
                        background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(168,85,247,0.2))",
                        border: "1px solid rgba(168,85,247,0.5)",
                        color: "#e2d0ff",
                      }
                    : {
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        color: "#8a8a9a",
                      }
                }
              >
                <span className="text-[14px]">{tab.emoji}</span>
                {tab.label}
              </button>
            );
          })}
        </div>

        <div>
          {activeTab === "meta"     && <MetaTab     client={client} />}
          {activeTab === "google"   && <GoogleTab   client={client} />}
          {activeTab === "tiktok"   && <TikTokTab   client={client} />}
          {activeTab === "website"  && <WebsiteTab  client={client} />}
          {activeTab === "updates"  && <UpdatesTab  client={client} />}
          {activeTab === "calendar" && <CalendarTab />}
          {activeTab === "invoice"  && <InvoiceTab  client={client} />}
          {activeTab === "notlar"   && (
            <Notes
              clientSlug={client.slug}
              canWrite={isAdminView || canWriteNotes}
              isAjans={isAdminView}
            />
          )}
        </div>
      </main>
    </div>
  );
}

// ── Inline Özet (greeting altı) ───────────────────────────────────────────────
function QuickSummary({ client, onNavigate }: { client: ClientData; onNavigate: (tab: Tab) => void }) {
  const [unreadCount, setUnreadCount] = useState<number | null>(null);
  const [latestUpdate, setLatestUpdate] = useState<{ date: string; text: string } | null>(null);
  const [unseenUpdate, setUnseenUpdate] = useState(false);

  useEffect(() => {
    fetch("/api/musteri/notifications")
      .then((r) => r.json())
      .then((json: { items?: { clientSlug: string; unreadCount: number }[] }) => {
        const item = json.items?.find((i) => i.clientSlug === client.slug);
        setUnreadCount(item?.unreadCount ?? 0);
      })
      .catch(() => setUnreadCount(0));

    const updates = client.updates ?? [];
    if (updates.length > 0) {
      const latest = updates[0];
      const seenKey = `seen_update_${client.slug}_${latest.date}`;
      if (!localStorage.getItem(seenKey)) {
        setLatestUpdate(latest);
        setUnseenUpdate(true);
        localStorage.setItem(seenKey, "1");
      }
    }
  }, [client.slug, client.updates]);

  const meta   = client.metaCampaigns   ?? [];
  const google = client.googleCampaigns ?? [];
  const tiktok = client.tiktokCampaigns ?? [];

  const platforms = [
    { key: "meta"   as Tab, label: "Meta",    emoji: "📣", color: "#60a5fa", campaigns: meta   },
    { key: "google" as Tab, label: "Google",  emoji: "🔍", color: "#34d399", campaigns: google },
    { key: "tiktok" as Tab, label: "TikTok",  emoji: "🎵", color: "#fb923c", campaigns: tiktok },
  ].filter((p) => p.campaigns.length > 0);

  const hasNotifications = unseenUpdate || (unreadCount !== null && unreadCount > 0);
  const hasCampaigns = platforms.length > 0;

  if (!hasNotifications && !hasCampaigns) return null;

  return (
    <div className="space-y-3">
      {/* Bildirimler */}
      {hasNotifications && (() => {
        type NotifItem = { key: string; onClick: () => void; icon: string; iconBg: string; border: string; bg: string; labelColor: string; label: string; sub: string };
        const items: NotifItem[] = [
          unseenUpdate && latestUpdate
            ? {
                key: "update",
                onClick: () => { setUnseenUpdate(false); onNavigate("updates"); },
                icon: "📝",
                iconBg: "rgba(96,165,250,0.15)",
                border: "rgba(96,165,250,0.45)",
                bg: "rgba(96,165,250,0.08)",
                labelColor: "#93c5fd",
                label: "Yeni ajans güncellemesi",
                sub: `${latestUpdate.date} — ${latestUpdate.text}`,
              }
            : null,
          unreadCount !== null && unreadCount > 0
            ? {
                key: "notes",
                onClick: () => { setUnreadCount(0); onNavigate("notlar"); },
                icon: "🔔",
                iconBg: "rgba(251,146,60,0.15)",
                border: "rgba(251,146,60,0.45)",
                bg: "rgba(251,146,60,0.08)",
                labelColor: "#fdba74",
                label: `${unreadCount} okunmamış not`,
                sub: "Ajansınızdan size yeni notlar var.",
              }
            : null,
        ].filter((x): x is NotifItem => x !== null);

        return (
          <div className={`grid gap-2 ${items.length > 1 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
            {items.map((item) => (
              <button
                key={item.key}
                onClick={item.onClick}
                className="text-left rounded-xl px-4 py-3.5 flex items-center gap-3 transition-all hover:brightness-110"
                style={{ background: item.bg, border: `1.5px solid ${item.border}` }}
              >
                <span
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-[17px] flex-shrink-0"
                  style={{ background: item.iconBg }}
                >
                  {item.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold" style={{ color: item.labelColor }}>{item.label}</p>
                  <p className="text-[11px] text-[#8a8a9a] truncate mt-0.5">{item.sub}</p>
                </div>
                <span className="text-[12px] font-bold flex-shrink-0" style={{ color: item.labelColor }}>→</span>
              </button>
            ))}
          </div>
        );
      })()}

      {/* Platform bazlı kampanya özeti */}
      {hasCampaigns && (
        <div className={`grid gap-3 ${platforms.length === 1 ? "grid-cols-1" : platforms.length === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-3"}`}>
          {platforms.map(({ key, label, emoji, color, campaigns }) => {
            const aktif = campaigns.filter((c) => c.status === "Aktif");
            const duraklatildi = campaigns.filter((c) => c.status === "Duraklatıldı").length;
            const aktivButce = aktif.reduce((s, c) => s + parseBudgetNum(c.dailyBudget), 0);
            return (
              <button
                key={key}
                onClick={() => onNavigate(key)}
                className="text-left rounded-xl p-4 transition-all hover:opacity-90"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[15px]">{emoji}</span>
                  <span className="text-[12px] font-bold uppercase tracking-wide" style={{ color }}>{label} Kampanyaları</span>
                </div>
                <div className="flex gap-4 mb-2">
                  <div>
                    <p className="text-[22px] font-black text-white leading-none">{campaigns.length}</p>
                    <p className="text-[10px] text-[#555] mt-0.5">toplam</p>
                  </div>
                  <div>
                    <p className="text-[22px] font-black leading-none" style={{ color: "#34d399" }}>{aktif.length}</p>
                    <p className="text-[10px] text-[#555] mt-0.5">aktif</p>
                  </div>
                  {duraklatildi > 0 && (
                    <div>
                      <p className="text-[22px] font-black leading-none" style={{ color: "#fbbf24" }}>{duraklatildi}</p>
                      <p className="text-[10px] text-[#555] mt-0.5">duraklatılmış</p>
                    </div>
                  )}
                </div>
                {aktivButce > 0 && (
                  <p className="text-[11px] font-semibold" style={{ color: "#8a8a9a" }}>
                    Toplam günlük bütçe:{" "}
                    <span style={{ color }}>{aktivButce.toLocaleString("tr-TR")} ₺/gün</span>
                  </p>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Tab: Meta Ads ─────────────────────────────────────────────────────────────
function MetaTab({ client }: { client: ClientData }) {
  if (!client.metaCampaigns?.length) {
    return <Empty text="Meta Ads kampanyası henüz tanımlanmadı." />;
  }
  return (
    <Section title="Meta Ads Kampanyaları" subtitle="Instagram & Facebook reklam kampanyalarınız">
      <CampaignTable campaigns={client.metaCampaigns} />
    </Section>
  );
}

// ── Tab: Google Ads ───────────────────────────────────────────────────────────
function GoogleTab({ client }: { client: ClientData }) {
  if (!client.googleCampaigns?.length) {
    return <Empty text="Google Ads kampanyası henüz tanımlanmadı." />;
  }
  return (
    <Section title="Google Ads Kampanyaları" subtitle="Google arama ve görüntülü reklam kampanyalarınız">
      <CampaignTable campaigns={client.googleCampaigns} />
    </Section>
  );
}

// ── Tab: TikTok Ads ───────────────────────────────────────────────────────────
function TikTokTab({ client }: { client: ClientData }) {
  if (!client.tiktokCampaigns?.length) {
    return <Empty text="TikTok Ads kampanyası henüz tanımlanmadı." />;
  }
  return (
    <Section title="TikTok Ads Kampanyaları" subtitle="TikTok reklam kampanyalarınız">
      <CampaignTable campaigns={client.tiktokCampaigns} />
    </Section>
  );
}

// ── Tab: Website ──────────────────────────────────────────────────────────────
function WebsiteTab({ client }: { client: ClientData }) {
  if (!client.websiteUpdates?.length) {
    return <Empty text="Website güncellemesi henüz girilmedi." />;
  }
  return (
    <Section title="Website" subtitle="Web sitenizde yapılan çalışmalar ve güncellemeler">
      <div className="space-y-3">
        {client.websiteUpdates.map((u, i) => (
          <div
            key={i}
            className="rounded-xl p-5 flex gap-4 items-start"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <span
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg flex-shrink-0 whitespace-nowrap mt-0.5"
              style={{ background: "rgba(96,165,250,0.1)", color: "#60a5fa" }}
            >
              {u.date}
            </span>
            <p className="text-[14px] text-[#c8c8d8] leading-relaxed">{u.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ── Tab: Ajans Güncellemeleri ─────────────────────────────────────────────────
function UpdatesTab({ client }: { client: ClientData }) {
  if (!client.updates?.length) {
    return <Empty text="Henüz güncelleme girilmedi." />;
  }
  return (
    <Section title="Ajans Güncellemeleri" subtitle="Ekibimizin yaptığı çalışmalar ve gelişmeler">
      <div className="space-y-3">
        {client.updates.map((u, i) => (
          <div
            key={i}
            className="rounded-xl p-5 flex gap-4 items-start"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <span
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg flex-shrink-0 whitespace-nowrap mt-0.5"
              style={{ background: "rgba(168,85,247,0.1)", color: "#c084fc" }}
            >
              {u.date}
            </span>
            <p className="text-[14px] text-[#c8c8d8] leading-relaxed">{u.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ── Tab: İçerik Takvimi ───────────────────────────────────────────────────────
function CalendarTab() {
  return (
    <Section title="İçerik Takvimi" subtitle="Planlanan ve yayınlanan içerikleriniz">
      <Calendar />
    </Section>
  );
}

// ── Tab: Fatura ───────────────────────────────────────────────────────────────
const statusStyle = (s: string) => {
  if (s === "Ödendi")       return { background: "rgba(52,211,153,0.12)",  color: "#34d399",  border: "1px solid rgba(52,211,153,0.25)"  };
  if (s === "Bekliyor")     return { background: "rgba(251,191,36,0.12)",  color: "#fbbf24",  border: "1px solid rgba(251,191,36,0.25)"  };
  if (s === "Günü Gelmedi") return { background: "rgba(99,102,241,0.12)",  color: "#818cf8",  border: "1px solid rgba(99,102,241,0.25)"  };
  return {};
};

function InvoiceTab({ client }: { client: ClientData }) {
  if (!client.invoices?.length) {
    return <Empty text="Henüz fatura bilgisi girilmedi." />;
  }
  return (
    <Section title="Fatura Bilgisi" subtitle="Ödeme geçmişiniz ve bekleyen faturalarınız">
      {client.invoiceNote && (
        <SectionNote text={client.invoiceNote} />
      )}

      {/* Mobil: kart düzeni */}
      <div className="md:hidden space-y-3 mt-4">
        {client.invoices.map((inv, i) => (
          <div key={i} className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <p className="text-[13px] text-white font-medium">{inv.period}</p>
                {inv.dueDate && (
                  <p className="text-[11px] text-[#8a8a9a] mt-0.5">Son ödeme: {inv.dueDate}</p>
                )}
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0" style={statusStyle(inv.status)}>
                {inv.status === "Ödendi" ? "✓ Ödendi" : inv.status === "Günü Gelmedi" ? "📅 Günü Gelmedi" : "⏳ Bekliyor"}
              </span>
            </div>
            <p className="text-[15px] font-black gradient-text text-center">{fmtAmount(inv.amount)}</p>
          </div>
        ))}
      </div>

      {/* Masaüstü: tablo düzeni */}
      <div className="hidden md:block rounded-2xl overflow-hidden mt-4" style={{ border: "1px solid var(--border)" }}>
        <div
          className="grid grid-cols-4 px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#8a8a9a]"
          style={{ background: "var(--surface-2)" }}
        >
          <span>Dönem</span>
          <span>Son Ödeme</span>
          <span className="text-center">Tutar</span>
          <span className="text-right">Durum</span>
        </div>
        {client.invoices.map((inv, i) => (
          <div
            key={i}
            className="grid grid-cols-4 px-5 py-4 items-center"
            style={{
              background: i % 2 === 0 ? "var(--surface)" : "var(--bg)",
              borderTop: i > 0 ? "1px solid var(--border)" : "none",
            }}
          >
            <span className="text-[13px] text-white">{inv.period}</span>
            <span className="text-[13px] text-[#8a8a9a]">{inv.dueDate ?? "—"}</span>
            <span className="text-[15px] font-black gradient-text text-center">{fmtAmount(inv.amount)}</span>
            <div className="flex justify-end">
              <span className="text-[11px] font-bold px-3 py-1 rounded-full" style={statusStyle(inv.status)}>
                {inv.status === "Ödendi" ? "✓ Ödendi" : inv.status === "Günü Gelmedi" ? "📅 Günü Gelmedi" : "⏳ Bekliyor"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ── Kampanya Tablosu ──────────────────────────────────────────────────────────
const statusStyle2 = (s: string) => {
  if (s === "Aktif")        return { background: "rgba(52,211,153,0.1)",  color: "#34d399" };
  if (s === "Duraklatıldı") return { background: "rgba(251,191,36,0.1)",  color: "#fbbf24" };
  if (s === "Tamamlandı")   return { background: "rgba(139,142,160,0.1)", color: "#8a8a9a" };
  if (s === "Ödeme Hatası") return { background: "rgba(239,68,68,0.1)",   color: "#f87171" };
  return {};
};

function CampaignTable({ campaigns }: { campaigns: Campaign[] }) {
  return (
    <>
      {/* Mobil: kart */}
      <div className="md:hidden space-y-3">
        {campaigns.map((c, i) => (
          <div key={i} className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="text-[14px] text-white font-semibold">{c.name}</p>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0" style={statusStyle2(c.status)}>{c.status}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl px-3 py-2.5" style={{ background: "var(--bg)" }}>
                <p className="text-[10px] text-[#8a8a9a] mb-1 uppercase tracking-wide">Başlangıç</p>
                <p className="text-[12px] text-white font-medium">{c.startDate}</p>
              </div>
              <div className="rounded-xl px-3 py-2.5" style={{ background: "var(--bg)" }}>
                <p className="text-[10px] text-[#8a8a9a] mb-1 uppercase tracking-wide">Bitiş</p>
                <p className="text-[12px] text-white font-medium">{c.endDate}</p>
              </div>
              <div className="rounded-xl px-3 py-2.5" style={{ background: "var(--bg)" }}>
                <p className="text-[10px] text-[#8a8a9a] mb-1 uppercase tracking-wide">Günlük</p>
                <p className="text-[12px] text-white font-medium">{fmtBudget(c.dailyBudget)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Masaüstü: tablo */}
      <div className="hidden md:block rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        <div
          className="grid grid-cols-4 px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#8a8a9a]"
          style={{ background: "var(--surface-2)" }}
        >
          <span>Kampanya Adı</span>
          <span>Başlangıç</span>
          <span>Bitiş</span>
          <span className="text-right">Günlük Bütçe</span>
        </div>
        {campaigns.map((c, i) => (
          <div
            key={i}
            className="grid grid-cols-4 px-5 py-4 items-center"
            style={{
              background: i % 2 === 0 ? "var(--surface)" : "var(--bg)",
              borderTop: i > 0 ? "1px solid var(--border)" : "none",
            }}
          >
            <span className="text-[13px] text-[#c8c8d8] truncate pr-3">{c.name}</span>
            <span className="text-[13px] text-white">{c.startDate}</span>
            <span className="text-[13px] text-[#8a8a9a]">{c.endDate}</span>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[13px] font-semibold text-white">{fmtBudget(c.dailyBudget)}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={statusStyle2(c.status)}>
                {c.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Yardımcılar ───────────────────────────────────────────────────────────────
function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-5">
        <h3 className="font-bold text-[18px] text-white">{title}</h3>
        <p className="text-[13px] text-[#8a8a9a] mt-0.5">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function SectionNote({ text }: { text: string }) {
  return (
    <div
      className="mt-4 flex items-start gap-2.5 rounded-xl px-4 py-3"
      style={{ background: "rgba(139,142,160,0.07)", border: "1px solid rgba(139,142,160,0.15)" }}
    >
      <span className="text-[14px] flex-shrink-0 mt-0.5">ℹ️</span>
      <p className="text-[12px] text-[#8a8a9a] leading-relaxed">{text}</p>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div
      className="rounded-2xl p-10 text-center"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <p className="text-3xl mb-3">📭</p>
      <p className="text-[14px] text-[#8a8a9a]">{text}</p>
    </div>
  );
}
