"use client";

import { useState, useRef } from "react";
import type { ClientData, Campaign } from "@/lib/clients";
import Calendar from "@/components/Calendar";

type Tab = "meta" | "google" | "tiktok" | "website" | "updates" | "calendar" | "invoice";

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "meta",     label: "Meta Ads",             emoji: "📣" },
  { id: "google",   label: "Google Ads",            emoji: "🔍" },
  { id: "tiktok",   label: "TikTok Ads",            emoji: "🎵" },
  { id: "website",  label: "Website",               emoji: "🌐" },
  { id: "updates",  label: "Ajans Güncellemeleri",  emoji: "📝" },
  { id: "calendar", label: "İçerik Takvimi",        emoji: "📅" },
  { id: "invoice",  label: "Fatura Bilgisi",        emoji: "💳" },
];

// ── Ana bileşen ──────────────────────────────────────────────────────────────
// Kimlik doğrulama artık middleware + httpOnly cookie ile yapılır.
// Bu bileşen yalnızca yetkili oturuma render edilir.
export default function ClientPortal({
  client,
  isAdminView = false,
}: {
  client: ClientData;
  isAdminView?: boolean;
}) {
  async function handleLogout() {
    try {
      await fetch("/api/musteri/auth/logout", { method: "POST" });
    } catch {
      /* yine de yönlendir */
    }
    window.location.href = isAdminView ? "/musteri/admin" : "/musteri/giris";
  }

  return <Dashboard client={client} onLogout={handleLogout} isAdminView={isAdminView} />;
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({
  client,
  onLogout,
  isAdminView,
}: {
  client: ClientData;
  onLogout: () => void;
  isAdminView: boolean;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("meta");

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

        {/* Tab Butonları — mobilde yatay kaydır, masaüstünde grid */}
        {/* Mobil */}
        <div className="md:hidden -mx-6 px-6 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-1.5 flex-shrink-0 px-4 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-200"
                  style={
                    isActive
                      ? {
                          background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                          color: "#fff",
                          boxShadow: "0 2px 12px rgba(124,58,237,0.4)",
                        }
                      : {
                          background: "var(--surface)",
                          border: "1px solid var(--border)",
                          color: "#8a8a9a",
                        }
                  }
                >
                  <span>{tab.emoji}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Masaüstü */}
        <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center gap-2 rounded-2xl px-3 py-5 transition-all duration-200 text-center"
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
                <span className="text-2xl">{tab.emoji}</span>
                <span
                  className="text-[11px] font-semibold leading-tight"
                  style={{ color: isActive ? "#e2d0ff" : "#8a8a9a" }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab İçerikleri */}
        <div>
          {activeTab === "meta"     && <MetaTab     client={client} />}
          {activeTab === "google"   && <GoogleTab   client={client} />}
          {activeTab === "tiktok"   && <TikTokTab   client={client} />}
          {activeTab === "website"  && <WebsiteTab  client={client} />}
          {activeTab === "updates"  && <UpdatesTab  client={client} />}
          {activeTab === "calendar" && <CalendarTab />}
          {activeTab === "invoice"  && <InvoiceTab  client={client} />}
        </div>

        {/* Alt iletişim */}
        <SupportBox slug={client.slug} />
      </main>
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
            <p className="text-[26px] font-black gradient-text">{inv.amount}</p>
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
            <p className="text-[15px] font-black gradient-text text-center">{inv.amount}</p>
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
                <p className="text-[12px] text-white font-medium">{c.dailyBudget}</p>
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
          <span>Başlangıç</span>
          <span>Bitiş</span>
          <span>Kampanya Adı</span>
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
            <span className="text-[13px] text-white">{c.startDate}</span>
            <span className="text-[13px] text-[#8a8a9a]">{c.endDate}</span>
            <span className="text-[13px] text-[#c8c8d8] truncate pr-3">{c.name}</span>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[13px] font-semibold text-white">{c.dailyBudget}</span>
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

// ── Destek Kutusu ─────────────────────────────────────────────────────────────
function SupportBox({ slug }: { slug: string }) {
  const [msg, setMsg]       = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent]     = useState(false);
  const [err, setErr]       = useState("");
  const textareaRef         = useRef<HTMLTextAreaElement>(null);

  // textarea otomatik yükseklik
  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setMsg(e.target.value);
    const el = textareaRef.current;
    if (el) { el.style.height = "auto"; el.style.height = `${el.scrollHeight}px`; }
  }

  async function handleSend() {
    const trimmed = msg.trim();
    if (!trimmed) return;
    setSending(true);
    setErr("");
    try {
      const res  = await fetch("/api/musteri/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, message: trimmed }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
        setMsg("");
      } else {
        setErr(data.error ?? "Gönderilemedi, tekrar deneyin.");
      }
    } catch {
      setErr("Bağlantı hatası. Tekrar deneyin.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className="mt-10 rounded-2xl p-5"
      style={{ background: "var(--surface)", border: "1px solid rgba(168,85,247,0.15)" }}
    >
      {/* Başlık satırı + hızlı butonlar */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
        <p className="font-semibold text-[15px] text-white">Bir sorunuz mu var?</p>
        <div className="flex items-center gap-2">
          {/* WhatsApp */}
          <a
            href="https://wa.me/905520772700"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all hover:opacity-90"
            style={{ background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.25)", color: "#25d366" }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.113.548 4.099 1.504 5.832L.057 23.667a.75.75 0 00.925.914l5.957-1.562A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.853 0-3.598-.498-5.103-1.368l-.362-.213-3.753.985.946-3.661-.235-.376A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            WhatsApp
          </a>
          {/* E-posta */}
          <a
            href="mailto:markaizicom@gmail.com"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all hover:opacity-90"
            style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)", color: "#c084fc" }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            E-posta
          </a>
        </div>
      </div>

      {/* Mesaj alanı */}
      {sent ? (
        <div
          className="flex items-center gap-2.5 rounded-xl px-4 py-3"
          style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)" }}
        >
          <span className="text-[18px]">✓</span>
          <p className="text-[13px] text-[#34d399] font-medium">Mesajınız iletildi, en kısa sürede geri döneceğiz.</p>
          <button
            onClick={() => setSent(false)}
            className="ml-auto text-[11px] text-[#8a8a9a] hover:text-white transition-colors"
          >
            Tekrar yaz
          </button>
        </div>
      ) : (
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={msg}
            onChange={handleChange}
            placeholder="Mesajınızı buraya yazın…"
            rows={2}
            className="w-full resize-none rounded-xl px-4 py-3 text-[14px] text-white placeholder-[#555] transition-all outline-none"
            style={{
              background: "var(--bg)",
              border: `1px solid ${err ? "rgba(239,68,68,0.4)" : "var(--border)"}`,
              minHeight: "76px",
              lineHeight: "1.6",
            }}
            onKeyDown={(e) => {
              // Ctrl/Cmd + Enter ile gönder
              if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleSend();
            }}
          />
          {err && <p className="text-[11px] text-red-400 mt-1.5">{err}</p>}
          <div className="flex items-center justify-between mt-2.5">
            <span className="text-[11px] text-[#555]">{msg.length > 0 ? `${msg.length} / 2000` : "⌘↵ ile de gönderebilirsiniz"}</span>
            <button
              onClick={handleSend}
              disabled={sending || !msg.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold transition-all disabled:opacity-40"
              style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "#fff" }}
            >
              {sending ? (
                <>
                  <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity=".3"/>
                    <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  Gönderiliyor
                </>
              ) : (
                <>
                  Gönder
                  <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
