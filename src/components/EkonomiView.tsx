"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface EkonomiData {
  currentMonthLabel: string;
  currentMonth: { gelir: number; gider: number; net: number };
  bekleyenFaturaToplam: number;
  monthlyHistory: { key: string; label: string; gelir: number; gider: number; net: number }[];
  feed: { id: string; type: "GELIR" | "GIDER"; amount: number; description: string; date: string; deletable: boolean }[];
}

function fmtTL(n: number): string {
  return n.toLocaleString("tr-TR") + " ₺";
}

function fmtAmount(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return raw;
  const num = parseInt(digits, 10);
  if (isNaN(num)) return raw;
  return num.toLocaleString("tr-TR") + " ₺";
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

export default function EkonomiView({ data }: { data: EkonomiData }) {
  const router = useRouter();
  const [feed, setFeed] = useState(data.feed);
  const [type, setType] = useState<"GELIR" | "GIDER">("GIDER");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleLogout() {
    try { await fetch("/api/musteri/auth/logout", { method: "POST" }); } catch { /* ignore */ }
    window.location.href = "/musteri/giris";
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!amount.trim() || !description.trim()) return;
    setSaving(true);
    setError("");
    const res = await fetch("/api/musteri/admin/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, amount: amount.trim(), description: description.trim(), date }),
    });
    const json = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) { setError(json.error ?? "Kaydedilemedi."); return; }
    setAmount("");
    setDescription("");
    router.refresh();
    setFeed((prev) => [
      { id: json.transaction.id, type, amount: parseInt(amount.replace(/[^\d]/g, ""), 10) || 0, description: description.trim(), date: new Date(date).toISOString(), deletable: true },
      ...prev,
    ]);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const res = await fetch(`/api/musteri/admin/transactions/${id}`, { method: "DELETE" });
    if (res.ok) {
      setFeed((prev) => prev.filter((f) => f.id !== id));
      router.refresh();
    }
    setDeletingId(null);
  }

  const kasaColor = data.currentMonth.net >= 0 ? "#34d399" : "#f87171";

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <header className="sticky top-0 z-50 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-3"
        style={{ background: "rgba(5,5,5,0.9)", WebkitBackdropFilter: "blur(20px)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <a href="/musteri/admin" className="font-black text-[16px] sm:text-[18px] gradient-text flex-shrink-0">markaizi</a>
          <span className="hidden sm:inline text-[#555]">/</span>
          <a href="/musteri/admin" className="hidden sm:inline text-[14px] text-[#8a8a9a] hover:text-white transition-colors">Admin</a>
          <span className="hidden sm:inline text-[#555]">/</span>
          <span className="text-[13px] sm:text-[14px] font-semibold text-white truncate">Ekonomi</span>
        </div>
        <button onClick={handleLogout} className="text-[12px] sm:text-[13px] text-[#8a8a9a] hover:text-[#f87171] transition-colors flex-shrink-0 min-h-[44px] px-1 flex items-center">
          Çıkış
        </button>
      </header>

      <main className="max-w-[860px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6">
          <h1 className="font-black text-[22px] sm:text-[24px] text-white mb-1">Ekonomi</h1>
          <p className="text-[13px] text-[#8a8a9a]">{data.currentMonthLabel} — ajansın genel gelir/gider durumu.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="rounded-2xl p-4" style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)" }}>
            <p className="text-[10px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1">Gelir</p>
            <p className="text-[16px] sm:text-[19px] font-black" style={{ color: "#34d399" }}>{fmtTL(data.currentMonth.gelir)}</p>
          </div>
          <div className="rounded-2xl p-4" style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>
            <p className="text-[10px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1">Gider</p>
            <p className="text-[16px] sm:text-[19px] font-black" style={{ color: "#f87171" }}>{fmtTL(data.currentMonth.gider)}</p>
          </div>
          <div className="rounded-2xl p-4" style={{ background: data.currentMonth.net >= 0 ? "rgba(168,85,247,0.08)" : "rgba(248,113,113,0.08)", border: `1px solid ${data.currentMonth.net >= 0 ? "rgba(168,85,247,0.2)" : "rgba(248,113,113,0.2)"}` }}>
            <p className="text-[10px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1">Kasada Kalan</p>
            <p className="text-[16px] sm:text-[19px] font-black" style={{ color: kasaColor }}>{fmtTL(data.currentMonth.net)}</p>
          </div>
          <div className="rounded-2xl p-4" style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)" }}>
            <p className="text-[10px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1">Bekleyen Fatura</p>
            <p className="text-[16px] sm:text-[19px] font-black" style={{ color: "#fbbf24" }}>{fmtTL(data.bekleyenFaturaToplam)}</p>
          </div>
        </div>

        {/* Elle gelir/gider ekleme */}
        <div className="rounded-2xl p-5 mb-8" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <p className="text-[13px] font-semibold text-white mb-3">Gelir / Gider Ekle</p>
          <form onSubmit={handleAdd} className="space-y-3">
            <div className="flex gap-2">
              <button type="button" onClick={() => setType("GIDER")}
                className="flex-1 text-[13px] font-semibold py-2.5 rounded-xl transition-colors"
                style={type === "GIDER"
                  ? { background: "rgba(248,113,113,0.15)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)" }
                  : { background: "var(--bg)", color: "#8a8a9a", border: "1px solid var(--border)" }}>
                Gider
              </button>
              <button type="button" onClick={() => setType("GELIR")}
                className="flex-1 text-[13px] font-semibold py-2.5 rounded-xl transition-colors"
                style={type === "GELIR"
                  ? { background: "rgba(52,211,153,0.15)", color: "#34d399", border: "1px solid rgba(52,211,153,0.3)" }
                  : { background: "var(--bg)", color: "#8a8a9a", border: "1px solid var(--border)" }}>
                Gelir
              </button>
            </div>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Açıklama — örn. Ofis kirası"
              className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-white placeholder-[#555] outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onBlur={(e) => setAmount(fmtAmount(e.target.value))}
                placeholder="Örn: 5.000 ₺"
                className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-white placeholder-[#555] outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-white outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
              />
            </div>
            {error && <p className="text-[12px]" style={{ color: "#f87171" }}>{error}</p>}
            <button type="submit" disabled={saving} className="btn btn-primary w-full">
              {saving ? "Kaydediliyor..." : "Ekle"}
            </button>
          </form>
        </div>

        {/* Bu ayın hareketleri */}
        <div className="mb-8">
          <p className="text-[13px] font-bold uppercase tracking-wide text-[#8a8a9a] px-1 mb-3">Bu Ayın Hareketleri</p>
          <div className="space-y-2">
            {feed.map((f) => (
              <div key={f.id} className="rounded-xl px-4 py-3 flex items-center justify-between gap-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="min-w-0">
                  <p className="text-[13.5px] font-semibold text-white truncate">{f.description}</p>
                  <p className="text-[11px] text-[#8a8a9a] mt-0.5">{fmtDate(f.date)}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[14px] font-bold" style={{ color: f.type === "GELIR" ? "#34d399" : "#f87171" }}>
                    {f.type === "GELIR" ? "+" : "−"}{fmtTL(f.amount)}
                  </span>
                  {f.deletable && (
                    <button
                      onClick={() => handleDelete(f.id)}
                      disabled={deletingId === f.id}
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md text-[#555] hover:text-[#f87171] transition-colors flex-shrink-0 -mr-2.5"
                    >
                      <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2.5">
                        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
            {feed.length === 0 && (
              <div className="px-5 py-10 text-center rounded-xl" style={{ border: "1px solid var(--border)" }}>
                <p className="text-[14px] text-[#555]">Bu ay henüz hareket yok.</p>
              </div>
            )}
          </div>
        </div>

        {/* Aylık geçmiş */}
        <div>
          <p className="text-[13px] font-bold uppercase tracking-wide text-[#8a8a9a] px-1 mb-3">Aylık Geçmiş</p>

          {/* Mobil: kart listesi */}
          <div className="md:hidden space-y-2">
            {data.monthlyHistory.map((m) => (
              <div key={m.key} className="rounded-xl px-4 py-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[14px] font-semibold text-white">{m.label}</span>
                  <span className="text-[15px] font-black flex-shrink-0" style={{ color: m.net >= 0 ? "#c084fc" : "#f87171" }}>{fmtTL(m.net)}</span>
                </div>
                <p className="text-[12px] text-[#8a8a9a] mt-1">
                  Gelir <span style={{ color: "#34d399" }}>{fmtTL(m.gelir)}</span> · Gider <span style={{ color: "#f87171" }}>{fmtTL(m.gider)}</span>
                </p>
              </div>
            ))}
          </div>

          {/* Masaüstü: tablo */}
          <div className="hidden md:block rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="grid grid-cols-4 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[#8a8a9a]" style={{ borderBottom: "1px solid var(--border)" }}>
              <span>Ay</span>
              <span className="text-right">Gelir</span>
              <span className="text-right">Gider</span>
              <span className="text-right">Net</span>
            </div>
            {data.monthlyHistory.map((m) => (
              <div key={m.key} className="grid grid-cols-4 px-4 py-3 text-[13px]" style={{ borderBottom: "1px solid var(--border)" }}>
                <span className="text-white font-medium truncate">{m.label}</span>
                <span className="text-right" style={{ color: "#34d399" }}>{fmtTL(m.gelir)}</span>
                <span className="text-right" style={{ color: "#f87171" }}>{fmtTL(m.gider)}</span>
                <span className="text-right font-bold" style={{ color: m.net >= 0 ? "#c084fc" : "#f87171" }}>{fmtTL(m.net)}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
