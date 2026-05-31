"use client";

import { useState, useEffect } from "react";
import type { ClientData, Campaign } from "@/lib/clients";

type Tab = "meta" | "google" | "updates" | "calendar" | "invoice";

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "meta",     label: "Meta Ads",        emoji: "📣" },
  { id: "google",   label: "Google Ads",       emoji: "🔍" },
  { id: "updates",  label: "Ajans Güncellemeleri", emoji: "📝" },
  { id: "calendar", label: "İçerik Takvimi",   emoji: "📅" },
  { id: "invoice",  label: "Fatura Bilgisi",   emoji: "💳" },
];

// ── Ana bileşen ──────────────────────────────────────────────────────────────
export default function ClientPortal({ client }: { client: ClientData }) {
  const sessionKey = `mkz_auth_${client.slug}`;
  const [authed, setAuthed]   = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem(sessionKey) === "1") setAuthed(true);
    setChecking(false);
  }, [sessionKey]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res  = await fetch("/api/musteri/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: client.slug, password }),
      });
      const data = await res.json();
      if (data.ok) {
        sessionStorage.setItem(sessionKey, "1");
        setAuthed(true);
      } else {
        setError(data.error ?? "Şifre hatalı.");
      }
    } catch {
      setError("Bağlantı hatası. Tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem(sessionKey);
    setAuthed(false);
    setPassword("");
  }

  if (checking) return null;
  if (!authed)  return (
    <LoginScreen
      client={client}
      password={password}
      setPassword={setPassword}
      loading={loading}
      error={error}
      onSubmit={handleLogin}
    />
  );
  return <Dashboard client={client} onLogout={handleLogout} />;
}

// ── Giriş Ekranı ─────────────────────────────────────────────────────────────
function LoginScreen({
  client, password, setPassword, loading, error, onSubmit,
}: {
  client: ClientData;
  password: string;
  setPassword: (v: string) => void;
  loading: boolean;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "var(--bg)" }}>
      <a href="/" className="mb-10 flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
        <span className="text-[22px] font-black gradient-text">markaizi</span>
        <span className="text-[#8a8a9a] text-[13px]">× Müşteri Paneli</span>
      </a>

      <div className="w-full max-w-[360px] rounded-2xl p-8" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="text-center mb-7">
          <div
            className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: "var(--grad-soft)", border: "1px solid rgba(168,85,247,0.3)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="#c084fc" strokeWidth="1.8">
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="font-bold text-[18px] text-white mb-1">{client.name}</h1>
          <p className="text-[13px] text-[#8a8a9a]">Panele erişmek için şifrenizi girin</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="pw" className="block text-[12px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-2">Şifre</label>
            <input
              id="pw"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl text-[14px] text-white placeholder-[#555]"
              style={{ background: "var(--bg)", border: `1px solid ${error ? "rgba(239,68,68,0.5)" : "var(--border)"}` }}
              autoFocus
            />
            {error && <p className="text-[12px] text-red-400 mt-2">{error}</p>}
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? "Kontrol ediliyor..." : "Giriş Yap"}
          </button>
        </form>
      </div>

      <p className="text-[12px] text-[#555] mt-6">
        Şifrenizi unuttuysanız{" "}
        <a href="https://wa.me/905520772700" className="text-[#c084fc] underline underline-offset-2">WhatsApp&apos;tan yazın</a>
      </p>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ client, onLogout }: { client: ClientData; onLogout: () => void }) {
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
        <button onClick={onLogout} className="text-[12px] text-[#8a8a9a] hover:text-white transition-colors flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Çıkış
        </button>
      </header>

      <main className="max-w-[860px] mx-auto px-6 py-10">
        {/* Hoş geldin */}
        <div className="mb-8">
          <h2 className="font-black text-[22px] text-white mb-1">Merhaba, {client.name} 👋</h2>
          <p className="text-[14px] text-[#8a8a9a]">Görmek istediğiniz bölümü seçin.</p>
        </div>

        {/* Tab Butonları */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center gap-2 rounded-2xl px-4 py-5 transition-all duration-200 text-center"
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
                  className="text-[12px] font-semibold leading-tight"
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
          {activeTab === "updates"  && <UpdatesTab  client={client} />}
          {activeTab === "calendar" && <CalendarTab client={client} />}
          {activeTab === "invoice"  && <InvoiceTab  client={client} />}
        </div>

        {/* Alt iletişim */}
        <div
          className="mt-10 rounded-2xl p-6 text-center"
          style={{ background: "var(--surface)", border: "1px solid rgba(168,85,247,0.15)" }}
        >
          <p className="font-semibold text-white mb-1">Bir sorunuz mu var?</p>
          <p className="text-[13px] text-[#8a8a9a] mb-4">Ajansınıza doğrudan ulaşın.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://wa.me/905520772700" target="_blank" rel="noopener noreferrer" className="btn btn-primary text-sm py-2.5">
              WhatsApp&apos;tan Yaz
            </a>
            <a href="mailto:markaizicom@gmail.com" className="btn btn-outline text-sm py-2.5">
              E-posta Gönder
            </a>
          </div>
        </div>
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
function CalendarTab({ client }: { client: ClientData }) {
  if (!client.contentCalendar?.length) {
    return <Empty text="İçerik takvimi henüz girilmedi." />;
  }
  return (
    <Section title="İçerik Takvimi" subtitle="Yaklaşan içerik planınız">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {client.contentCalendar.map((item, i) => (
          <div
            key={i}
            className="rounded-xl p-4 flex gap-3 items-start"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <span
              className="text-[11px] font-bold px-3 py-1.5 rounded-lg flex-shrink-0 whitespace-nowrap"
              style={{ background: "rgba(168,85,247,0.12)", color: "#c084fc" }}
            >
              {item.date}
            </span>
            <p className="text-[13px] text-[#c8c8d8] leading-snug">{item.content}</p>
          </div>
        ))}
      </div>
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
      {/* Fatura tablosu */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        {/* Tablo başlığı */}
        <div
          className="grid grid-cols-3 px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#8a8a9a]"
          style={{ background: "var(--surface-2)" }}
        >
          <span>Dönem</span>
          <span className="text-center">Tutar</span>
          <span className="text-right">Durum</span>
        </div>

        {/* Fatura satırları */}
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
                    : { background: "rgba(251,191,36,0.12)", color: "#fbbf24" }
                }
              >
                {inv.status === "Ödendi" ? "✓ Ödendi" : "⏳ Bekliyor"}
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

// ── Kampanya Tablosu ──────────────────────────────────────────────────────────
function CampaignTable({ campaigns }: { campaigns: Campaign[] }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
      {/* Başlık */}
      <div
        className="grid grid-cols-4 px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#8a8a9a]"
        style={{ background: "var(--surface-2)" }}
      >
        <span className="col-span-1">Başlangıç</span>
        <span>Bitiş</span>
        <span className="col-span-1 hidden sm:block">Kampanya Adı</span>
        <span className="text-right">Günlük Bütçe</span>
      </div>

      {/* Satırlar */}
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
          <span className="text-[13px] text-[#c8c8d8] hidden sm:block truncate pr-2">{c.name}</span>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[13px] font-semibold text-white">{c.dailyBudget}</span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={
                c.status === "Aktif"
                  ? { background: "rgba(52,211,153,0.12)", color: "#34d399" }
                  : c.status === "Duraklatıldı"
                  ? { background: "rgba(251,191,36,0.12)", color: "#fbbf24" }
                  : { background: "rgba(139,142,160,0.12)", color: "#8a8a9a" }
              }
            >
              {c.status}
            </span>
          </div>
        </div>
      ))}

      {/* Mobil: kampanya adı ayrı satırda */}
      {campaigns.length > 0 && (
        <div className="sm:hidden" style={{ borderTop: "1px solid var(--border)" }}>
          {campaigns.map((c, i) => (
            <div key={i} className="px-5 py-2" style={{ background: i % 2 === 0 ? "var(--surface)" : "var(--bg)" }}>
              <p className="text-[11px] text-[#8a8a9a]">{c.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
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
