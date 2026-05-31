"use client";

import { useState, useEffect } from "react";
import type { ClientData, UpdateType } from "@/lib/clients";

const UPDATE_COLORS: Record<UpdateType, { bg: string; text: string; label: string }> = {
  icerik:  { bg: "rgba(192,132,252,0.12)", text: "#c084fc", label: "İçerik" },
  reklam:  { bg: "rgba(96,165,250,0.12)",  text: "#60a5fa", label: "Reklam" },
  teknik:  { bg: "rgba(52,211,153,0.12)",  text: "#34d399", label: "Teknik" },
  rapor:   { bg: "rgba(251,191,36,0.12)",  text: "#fbbf24", label: "Rapor"  },
  genel:   { bg: "rgba(139,142,160,0.12)", text: "#8a8a9a", label: "Genel"  },
};

export default function ClientPortal({ client }: { client: ClientData }) {
  const sessionKey = `mkz_auth_${client.slug}`;
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  // Sayfa yüklenince sessionStorage'ı kontrol et
  useEffect(() => {
    const saved = sessionStorage.getItem(sessionKey);
    if (saved === "1") setAuthed(true);
    setChecking(false);
  }, [sessionKey]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/musteri/verify", {
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

  if (!authed) return <LoginScreen client={client} password={password} setPassword={setPassword} loading={loading} error={error} onSubmit={handleLogin} />;

  return <Dashboard client={client} onLogout={handleLogout} />;
}

// ── Giriş Ekranı ────────────────────────────────────────────────────────────
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
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "var(--bg)" }}
    >
      {/* Logo */}
      <a href="/" className="mb-10 flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
        <span className="text-[22px] font-black gradient-text">markaizi</span>
        <span className="text-[#8a8a9a] text-[13px]">× Müşteri Paneli</span>
      </a>

      <div
        className="w-full max-w-[380px] rounded-2xl p-8"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
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
            <label htmlFor="password" className="block text-[12px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-2">
              Şifre
            </label>
            <input
              id="password"
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

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? "Kontrol ediliyor..." : "Giriş Yap"}
          </button>
        </form>
      </div>

      <p className="text-[12px] text-[#555] mt-6">
        Şifrenizi unuttuysanız{" "}
        <a href="https://wa.me/905520772700" className="text-[#c084fc] underline underline-offset-2">
          WhatsApp&apos;tan yazın
        </a>
      </p>
    </div>
  );
}

// ── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ client, onLogout }: { client: ClientData; onLogout: () => void }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ background: "rgba(5,5,5,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-3">
          <a href="/" className="font-black text-[18px] gradient-text">markaizi</a>
          <span className="text-[#555]">/</span>
          <span className="text-[14px] font-semibold text-white">{client.name}</span>
          <span
            className="hidden sm:inline text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: "rgba(168,85,247,0.12)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.25)" }}
          >
            {client.package}
          </span>
        </div>
        <button
          onClick={onLogout}
          className="text-[12px] text-[#8a8a9a] hover:text-white transition-colors flex items-center gap-1.5"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Çıkış
        </button>
      </header>

      <main className="max-w-[900px] mx-auto px-6 py-10 space-y-8">

        {/* Hoş geldin */}
        <div>
          <h2 className="font-black text-[24px] text-white mb-1">Merhaba, {client.name} 👋</h2>
          <p className="text-[14px] text-[#8a8a9a]">Kampanya durumlarınızı ve ajans güncellemelerimizi buradan takip edebilirsiniz.</p>
        </div>

        {/* Aktif Kampanyalar */}
        <Section title="Aktif Kampanyalar" icon="📊">
          <div className="space-y-3">
            {client.campaigns.map((c, i) => (
              <div
                key={i}
                className="rounded-xl p-5"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-[14px] text-white">{c.name}</span>
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="text-[12px] text-[#8a8a9a]">{c.platform}</p>
                    {c.note && <p className="text-[12px] text-[#6a6a7a] mt-1.5 italic">{c.note}</p>}
                  </div>
                  {(c.reach || c.clicks || c.budget) && (
                    <div className="flex gap-4 flex-wrap">
                      {c.budget && <Metric label="Bütçe" value={c.budget} />}
                      {c.reach && <Metric label="Erişim" value={c.reach} color="#c084fc" />}
                      {c.clicks && <Metric label="Tıklama" value={c.clicks} color="#60a5fa" />}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Ajans Güncellemeleri */}
        <Section title="Ajans Güncellemeleri" icon="📝">
          <div className="space-y-3">
            {client.updates.map((u, i) => {
              const conf = UPDATE_COLORS[u.type];
              return (
                <div
                  key={i}
                  className="rounded-xl p-5 flex gap-4"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full h-fit flex-shrink-0 mt-0.5"
                    style={{ background: conf.bg, color: conf.text }}
                  >
                    {conf.label}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] text-white leading-relaxed">{u.text}</p>
                    <p className="text-[12px] text-[#8a8a9a] mt-1.5">{u.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* İçerik Takvimi */}
        {client.contentCalendar && client.contentCalendar.length > 0 && (
          <Section title="İçerik Takvimi" icon="📅">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {client.contentCalendar.map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 flex gap-3 items-start"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <span
                    className="text-[11px] font-bold px-2 py-1 rounded-lg flex-shrink-0 whitespace-nowrap"
                    style={{ background: "rgba(168,85,247,0.12)", color: "#c084fc" }}
                  >
                    {item.date}
                  </span>
                  <p className="text-[13px] text-[#c0c0d0] leading-snug">{item.content}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Fatura */}
        {client.nextInvoice && (
          <Section title="Fatura Bilgisi" icon="💳">
            <div
              className="rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div>
                <p className="text-[13px] text-[#8a8a9a] mb-1">Sonraki Fatura</p>
                <p className="text-[28px] font-black gradient-text">{client.nextInvoice.amount}</p>
                <p className="text-[13px] text-[#8a8a9a] mt-1">Son ödeme tarihi: {client.nextInvoice.dueDate}</p>
              </div>
              <span
                className="text-[12px] font-bold px-4 py-2 rounded-full"
                style={
                  client.nextInvoice.status === "Ödendi"
                    ? { background: "rgba(52,211,153,0.12)", color: "#34d399" }
                    : { background: "rgba(251,191,36,0.12)", color: "#fbbf24" }
                }
              >
                {client.nextInvoice.status === "Ödendi" ? "✓ Ödendi" : "⏳ Bekliyor"}
              </span>
            </div>
          </Section>
        )}

        {/* İletişim */}
        <div
          className="rounded-2xl p-6 text-center"
          style={{ background: "var(--surface)", border: "1px solid rgba(168,85,247,0.2)" }}
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

// ── Yardımcı bileşenler ──────────────────────────────────────────────────────
function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">{icon}</span>
        <h3 className="font-bold text-[16px] text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    "Aktif":        { bg: "rgba(52,211,153,0.12)", text: "#34d399" },
    "Duraklatıldı": { bg: "rgba(251,191,36,0.12)", text: "#fbbf24" },
    "Tamamlandı":   { bg: "rgba(139,142,160,0.12)", text: "#8a8a9a" },
  }[status] ?? { bg: "rgba(139,142,160,0.12)", text: "#8a8a9a" };

  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: colors.bg, color: colors.text }}>
      {status}
    </span>
  );
}

function Metric({ label, value, color = "#8a8a9a" }: { label: string; value: string; color?: string }) {
  return (
    <div className="text-center">
      <p className="text-[18px] font-black" style={{ color }}>{value}</p>
      <p className="text-[11px] text-[#8a8a9a]">{label}</p>
    </div>
  );
}
