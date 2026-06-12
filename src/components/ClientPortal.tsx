"use client";

import { useState, useEffect } from "react";
import type { ClientData, Campaign } from "@/lib/clients";
import Calendar from "@/components/Calendar";
import Notes from "@/components/Notes";

type Tab = "dashboard" | "meta" | "google" | "tiktok" | "website" | "updates" | "calendar" | "invoice" | "notlar";

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

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "dashboard", label: "Genel Bakış",           emoji: "🏠" },
  { id: "meta",      label: "Meta Ads",              emoji: "📣" },
  { id: "google",    label: "Google Ads",             emoji: "🔍" },
  { id: "tiktok",    label: "TikTok Ads",             emoji: "🎵" },
  { id: "website",   label: "Website",                emoji: "🌐" },
  { id: "updates",   label: "Güncellemeler",          emoji: "📝" },
  { id: "calendar",  label: "İçerik Takvimi",         emoji: "📅" },
  { id: "invoice",   label: "Fatura",                 emoji: "💳" },
  { id: "notlar",    label: "Notlar",                 emoji: "🗒️" },
];

// ── Ana bileşen ──────────────────────────────────────────────────────────────
// Kimlik doğrulama artık middleware + httpOnly cookie ile yapılır.
// Bu bileşen yalnızca yetkili oturuma render edilir.
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
    } catch {
      /* yine de yönlendir */
    }
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
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

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
          <span className="text-[14px] font-semibold text-white">{client.name}</span>
          <span
            className="hidden sm:inline text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: "rgba(168,85,247,0.12)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.2)" }}
          >
            {client.package}
          </span>
        </div>
        {isAdminView ? (
          <a href="/musteri/admin"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all"
            style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)", color: "#c084fc" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(168,85,247,0.2)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(168,85,247,0.1)"; }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M5 12l7 7M5 12l7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Admin Paneli
          </a>
        ) : (
          <button onClick={onLogout} className="text-[12px] text-[#8a8a9a] hover:text-[#f87171] transition-colors flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
              <path d="M18.364 5.636A9 9 0 1 1 5.636 18.364" strokeLinecap="round"/>
              <path d="M12 3v9" strokeLinecap="round"/>
            </svg>
            Çıkış
          </button>
        )}
      </header>

      <main className="max-w-[860px] mx-auto px-6 py-10">
        {/* Hoş geldin */}
        <div className="mb-8">
          <h2 className="font-black text-[22px] text-white mb-1">Merhaba, {client.name} 👋</h2>
          <p className="text-[14px] text-[#8a8a9a]">Görmek istediğiniz bölümü seçin.</p>
        </div>

        {/* Sekmeler — tüm roller */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center gap-1.5 rounded-xl sm:rounded-2xl px-1 py-3 sm:py-5 transition-all duration-200 text-center"
                style={
                  isActive
                    ? {
                        background: "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(236,72,153,0.15))",
                        border: "1.5px solid rgba(168,85,247,0.6)",
                        boxShadow: "0 0 20px rgba(124,58,237,0.2)",
                      }
                    : {
                        background: "var(--surface)",
                        border: "1.5px solid var(--border)",
                      }
                }
              >
                <span className="text-xl sm:text-2xl">{tab.emoji}</span>
                <span
                  className="text-[10px] sm:text-[11px] font-semibold leading-tight"
                  style={{ color: isActive ? "#e2d0ff" : "#8a8a9a" }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        <div>
          {activeTab === "dashboard" && <DashboardTab client={client} onNavigate={setActiveTab} />}
          {activeTab === "meta"      && <MetaTab     client={client} />}
          {activeTab === "google"    && <GoogleTab   client={client} />}
          {activeTab === "tiktok"    && <TikTokTab   client={client} />}
          {activeTab === "website"   && <WebsiteTab  client={client} />}
          {activeTab === "updates"   && <UpdatesTab  client={client} />}
          {activeTab === "calendar"  && <CalendarTab />}
          {activeTab === "invoice"   && <InvoiceTab  client={client} />}
          {activeTab === "notlar"    && (
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

// ── Tab: Genel Bakış (Dashboard) ──────────────────────────────────────────────
function DashboardTab({ client, onNavigate }: { client: ClientData; onNavigate: (tab: Tab) => void }) {
  const [unreadCount, setUnreadCount] = useState<number | null>(null);
  const [latestUpdate, setLatestUpdate] = useState<{ date: string; text: string } | null>(null);
  const [unseenUpdate, setUnseenUpdate] = useState(false);

  useEffect(() => {
    // Okunmamış not sayısını notifications endpoint'inden çek (notes fetch'i yapmaz, okundu işaretlemez)
    fetch("/api/musteri/notifications")
      .then((r) => r.json())
      .then((json: { items?: { clientSlug: string; unreadCount: number }[] }) => {
        const item = json.items?.find((i) => i.clientSlug === client.slug);
        setUnreadCount(item?.unreadCount ?? 0);
      })
      .catch(() => setUnreadCount(0));

    // Son güncellemeyi kontrol et (localStorage ile "görüldü" takibi)
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

  // Kampanya istatistikleri
  const meta   = client.metaCampaigns   ?? [];
  const google = client.googleCampaigns ?? [];
  const tiktok = client.tiktokCampaigns ?? [];
  const allCampaigns = [...meta, ...google, ...tiktok];

  const aktif      = allCampaigns.filter((c) => c.status === "Aktif").length;
  const duraklatildi = allCampaigns.filter((c) => c.status === "Duraklatıldı").length;
  const tamamlandi = allCampaigns.filter((c) => c.status === "Tamamlandı").length;

  const stats = [
    { label: "Toplam Kampanya", value: allCampaigns.length, color: "#c084fc" },
    { label: "Aktif",           value: aktif,               color: "#34d399" },
    ...(duraklatildi > 0 ? [{ label: "Duraklatılmış", value: duraklatildi, color: "#fbbf24" }] : []),
    ...(tamamlandi   > 0 ? [{ label: "Tamamlanmış",  value: tamamlandi,   color: "#8a8a9a" }] : []),
  ];

  const platformStats = [
    { label: "Meta Reklamı",   value: meta.length,   emoji: "📣", color: "rgba(96,165,250,0.1)",   text: "#60a5fa" },
    { label: "Google Reklamı", value: google.length, emoji: "🔍", color: "rgba(52,211,153,0.1)",   text: "#34d399" },
    { label: "TikTok Reklamı", value: tiktok.length, emoji: "🎵", color: "rgba(251,146,60,0.1)",   text: "#fb923c" },
  ].filter((p) => p.value > 0);

  return (
    <div className="space-y-6">
      {/* Bildirimler */}
      {(unseenUpdate || (unreadCount !== null && unreadCount > 0)) && (
        <div className="space-y-2">
          {unseenUpdate && latestUpdate && (
            <button
              onClick={() => onNavigate("updates")}
              className="w-full text-left rounded-xl px-4 py-3 flex items-start gap-3 transition-opacity hover:opacity-80"
              style={{ background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.2)" }}
            >
              <span className="text-[16px] flex-shrink-0">📝</span>
              <div>
                <p className="text-[13px] font-semibold" style={{ color: "#60a5fa" }}>Yeni ajans güncellemesi</p>
                <p className="text-[12px] text-[#8a8a9a] mt-0.5 line-clamp-1">{latestUpdate.date} — {latestUpdate.text}</p>
              </div>
              <span className="ml-auto text-[11px] text-[#555] flex-shrink-0 mt-0.5">Görüntüle →</span>
            </button>
          )}
          {unreadCount !== null && unreadCount > 0 && (
            <button
              onClick={() => onNavigate("notlar")}
              className="w-full text-left rounded-xl px-4 py-3 flex items-start gap-3 transition-opacity hover:opacity-80"
              style={{ background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.2)" }}
            >
              <span className="text-[16px] flex-shrink-0">🔔</span>
              <div>
                <p className="text-[13px] font-semibold" style={{ color: "#fb923c" }}>
                  {unreadCount} okunmamış not
                </p>
                <p className="text-[12px] text-[#8a8a9a] mt-0.5">Ajansınızdan size yeni notlar var.</p>
              </div>
              <span className="ml-auto text-[11px] text-[#555] flex-shrink-0 mt-0.5">Görüntüle →</span>
            </button>
          )}
        </div>
      )}

      {/* Genel istatistikler */}
      {allCampaigns.length > 0 && (
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[#555] mb-3">Kampanya Özeti</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <p className="text-[26px] font-black" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[11px] text-[#8a8a9a] mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Platform bazlı */}
      {platformStats.length > 0 && (
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[#555] mb-3">Platformlar</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {platformStats.map((p) => (
              <div key={p.label} className="rounded-xl p-4 flex items-center gap-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <span className="text-2xl">{p.emoji}</span>
                <div>
                  <p className="text-[20px] font-black" style={{ color: p.text }}>{p.value}</p>
                  <p className="text-[11px] text-[#8a8a9a]">{p.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hızlı erişim */}
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-wider text-[#555] mb-3">Hızlı Erişim</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { tab: "updates" as Tab,  emoji: "📝", label: "Ajans Güncellemeleri" },
            { tab: "notlar"  as Tab,  emoji: "🗒️", label: "Notlar"               },
            { tab: "invoice" as Tab,  emoji: "💳", label: "Fatura Bilgisi"        },
            { tab: "calendar" as Tab, emoji: "📅", label: "İçerik Takvimi"        },
          ].map(({ tab, emoji, label }) => (
            <button
              key={tab}
              onClick={() => onNavigate(tab)}
              className="rounded-xl p-4 flex items-center gap-3 transition-all hover:opacity-80 text-left"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <span className="text-xl">{emoji}</span>
              <span className="text-[13px] font-medium text-white">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {allCampaigns.length === 0 && (
        <div className="rounded-2xl p-10 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <p className="text-3xl mb-3">👋</p>
          <p className="text-[14px] text-white font-semibold mb-1">Hoş geldiniz!</p>
          <p className="text-[13px] text-[#8a8a9a]">Kampanyalarınız hazır olduğunda burada görünecek.</p>
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
      {/* Sabit not */}
      <SectionNote text="Ajans güncellemelerimiz ay sonu size raporunuz verildiğinde sıfırlanır." />
    </Section>
  );
}

// ── Tab: İçerik Takvimi ───────────────────────────────────────────────────────
function CalendarTab() {
  return (
    <Section title="İçerik Takvimi" subtitle="Planlanmış içerikleriniz">
      <Calendar showClientName={false} />
    </Section>
  );
}

// ── Tab: Fatura Bilgisi ───────────────────────────────────────────────────────
function InvoiceTab({ client }: { client: ClientData }) {
  if (!client.invoices?.length) {
    return <Empty text="Fatura bilgisi henüz girilmedi." />;
  }
  return (
    <Section title="Fatura Bilgisi" subtitle="Hizmet ödemelerinizin özeti">
      {/* Mobil: kart */}
      <div className="md:hidden space-y-3">
        {client.invoices.map((inv, i) => (
          <div
            key={i}
            className="rounded-2xl p-5"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-[13px] font-semibold text-white">{inv.period}</p>
                {inv.dueDate && (
                  <p className="text-[11px] text-[#8a8a9a] mt-0.5">Son ödeme: {inv.dueDate}</p>
                )}
              </div>
              <span
                className="text-[11px] font-bold px-3 py-1 rounded-full flex-shrink-0"
                style={
                  inv.status === "Ödendi"
                    ? { background: "rgba(52,211,153,0.12)", color: "#34d399" }
                    : inv.status === "Günü Gelmedi"
                    ? { background: "rgba(99,102,241,0.12)", color: "#818cf8" }
                    : { background: "rgba(251,191,36,0.12)", color: "#fbbf24" }
                }
              >
                {inv.status === "Ödendi" ? "✓ Ödendi" : inv.status === "Günü Gelmedi" ? "📅 Günü Gelmedi" : "⏳ Bekliyor"}
              </span>
            </div>
            <p className="text-[26px] font-black gradient-text">{fmtAmount(inv.amount)}</p>
          </div>
        ))}
      </div>

      {/* Masaüstü: tablo */}
      <div className="hidden md:block rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        <div
          className="grid grid-cols-3 px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#8a8a9a]"
          style={{ background: "var(--surface-2)" }}
        >
          <span>Dönem</span>
          <span className="text-center">Tutar</span>
          <span className="text-right">Durum</span>
        </div>
        {client.invoices.map((inv, i) => (
          <div
            key={i}
            className="grid grid-cols-3 px-5 py-4 items-center"
            style={{
              background: i % 2 === 0 ? "var(--surface)" : "var(--bg)",
              borderTop: i > 0 ? "1px solid var(--border)" : "none",
            }}
          >
            <div>
              <p className="text-[13px] text-white font-medium">{inv.period}</p>
              {inv.dueDate && (
                <p className="text-[11px] text-[#8a8a9a] mt-0.5">Son ödeme: {inv.dueDate}</p>
              )}
            </div>
            <p className="text-[15px] font-black gradient-text text-center">{fmtAmount(inv.amount)}</p>
            <div className="flex justify-end">
              <span
                className="text-[11px] font-bold px-3 py-1 rounded-full"
                style={
                  inv.status === "Ödendi"
                    ? { background: "rgba(52,211,153,0.12)", color: "#34d399" }
                    : inv.status === "Günü Gelmedi"
                    ? { background: "rgba(99,102,241,0.12)", color: "#818cf8" }
                    : { background: "rgba(251,191,36,0.12)", color: "#fbbf24" }
                }
              >
                {inv.status === "Ödendi" ? "✓ Ödendi" : inv.status === "Günü Gelmedi" ? "📅 Günü Gelmedi" : "⏳ Bekliyor"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Not */}
      {client.invoiceNote && (
        <div
          className="mt-4 flex items-start gap-3 rounded-xl px-5 py-4"
          style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.15)" }}
        >
          <span className="text-[16px] flex-shrink-0">📌</span>
          <p className="text-[13px] text-[#8a8a9a] leading-relaxed">{client.invoiceNote}</p>
        </div>
      )}
    </Section>
  );
}

// ── Kampanya Tablosu / Kartlar ────────────────────────────────────────────────
function CampaignTable({ campaigns }: { campaigns: Campaign[] }) {
  const statusStyle = (status: string) =>
    status === "Aktif"
      ? { background: "rgba(52,211,153,0.12)", color: "#34d399" }
      : status === "Duraklatıldı"
      ? { background: "rgba(251,191,36,0.12)", color: "#fbbf24" }
      : status === "Ödeme Hatası"
      ? { background: "rgba(239,68,68,0.12)", color: "#f87171" }
      : { background: "rgba(139,142,160,0.12)", color: "#8a8a9a" };

  return (
    <>
      {/* Mobil: kart düzeni */}
      <div className="md:hidden space-y-3">
        {campaigns.map((c, i) => (
          <div
            key={i}
            className="rounded-2xl p-5"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            {/* Kampanya adı + durum */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <p className="text-[14px] font-semibold text-white leading-snug flex-1">{c.name}</p>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0" style={statusStyle(c.status)}>
                {c.status}
              </span>
            </div>
            {/* Detaylar */}
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

      {/* Masaüstü: tablo düzeni */}
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
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={statusStyle(c.status)}>
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
