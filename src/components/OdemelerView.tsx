"use client";

import { useMemo, useState } from "react";
import {
  INVOICE_STAGE_COLOR,
  INVOICE_STAGE_LABEL,
  type InvoiceStage,
} from "@/lib/invoiceStage";

export interface PendingInvoice {
  id: string;
  period: string;
  amount: string;
  dueDate: string | null;
  /** Vade tarihinden hesaplanır (sunucuda) — DB'de saklanmaz. */
  stage: InvoiceStage;
  /** Vadeye kalan gün; negatifse geçen gün. Vade yoksa null. */
  daysUntilDue: number | null;
  client: { slug: string; name: string };
}

type Filter = "TAHSIL" | "GECIKMEDI" | "BEKLIYOR" | "GUNU_GELMEDI";

function fmtAmount(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return raw;
  const num = parseInt(digits, 10);
  if (isNaN(num)) return raw;
  return num.toLocaleString("tr-TR") + " ₺";
}

function toNumber(raw: string): number {
  const digits = raw.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

// "YYYY-MM-DD" → "10 Eylül 2026"
function fmtDate(raw: string): string {
  if (!raw) return raw;
  const dt = new Date(raw + "T00:00:00");
  if (isNaN(dt.getTime())) return raw;
  return dt.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

/** "3 gün kaldı" / "bugün" / "11 gün gecikti" */
function dueHint(days: number | null): string {
  if (days === null) return "vade tarihi yok";
  if (days > 0) return `${days} gün kaldı`;
  if (days === 0) return "vadesi bugün";
  return `${Math.abs(days)} gün gecikti`;
}

export default function OdemelerView({ invoices: initialInvoices }: { invoices: PendingInvoice[] }) {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Filter>("TAHSIL");

  async function handleLogout() {
    try { await fetch("/api/musteri/auth/logout", { method: "POST" }); } catch { /* ignore */ }
    window.location.href = "/musteri/giris";
  }

  async function handleMarkPaid(id: string) {
    setBusyId(id);
    setError("");
    const res = await fetch(`/api/musteri/admin/invoices/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "ODENDI" }),
    });
    if (res.ok) {
      setInvoices((prev) => prev.filter((i) => i.id !== id));
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "İşaretlenemedi.");
    }
    setBusyId(null);
  }

  const groups = useMemo(() => ({
    GECIKMEDI: invoices.filter((i) => i.stage === "GECIKMEDI"),
    BEKLIYOR: invoices.filter((i) => i.stage === "BEKLIYOR"),
    GUNU_GELMEDI: invoices.filter((i) => i.stage === "GUNU_GELMEDI"),
  }), [invoices]);

  const sum = (list: PendingInvoice[]) => list.reduce((s, i) => s + toNumber(i.amount), 0);

  // "Tahsil Edilecek" = vadesi gelmiş olanlar (gecikmede + bekliyor).
  // Vadesi gelmemiş faturalar buraya girmez — günlük işi kirletmesin.
  const tahsil = useMemo(
    () => [...groups.GECIKMEDI, ...groups.BEKLIYOR],
    [groups]
  );

  const visible =
    filter === "TAHSIL" ? tahsil
    : filter === "GECIKMEDI" ? groups.GECIKMEDI
    : filter === "BEKLIYOR" ? groups.BEKLIYOR
    : groups.GUNU_GELMEDI;

  const tabs: { key: Filter; label: string; count: number; color: string }[] = [
    { key: "TAHSIL", label: "Tahsil Edilecek", count: tahsil.length, color: "#c084fc" },
    { key: "GECIKMEDI", label: "Gecikmede", count: groups.GECIKMEDI.length, color: INVOICE_STAGE_COLOR.GECIKMEDI },
    { key: "BEKLIYOR", label: "Bekliyor", count: groups.BEKLIYOR.length, color: INVOICE_STAGE_COLOR.BEKLIYOR },
    { key: "GUNU_GELMEDI", label: "Günü Gelmedi", count: groups.GUNU_GELMEDI.length, color: INVOICE_STAGE_COLOR.GUNU_GELMEDI },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <header className="sticky top-0 z-50 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-3"
        style={{ background: "rgba(5,5,5,0.9)", WebkitBackdropFilter: "blur(20px)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <a href="/musteri/admin" className="font-black text-[16px] sm:text-[18px] gradient-text flex-shrink-0">markaizi</a>
          <span className="hidden sm:inline text-[#555]">/</span>
          <a href="/musteri/admin" className="hidden sm:inline text-[14px] text-[#8a8a9a] hover:text-white transition-colors">Admin</a>
          <span className="hidden sm:inline text-[#555]">/</span>
          <span className="text-[13px] sm:text-[14px] font-semibold text-white truncate">Ödemeler</span>
        </div>
        <button onClick={handleLogout} className="text-[12px] sm:text-[13px] text-[#8a8a9a] hover:text-[#f87171] transition-colors flex-shrink-0 min-h-[44px] px-1 flex items-center">
          Çıkış
        </button>
      </header>

      <main className="max-w-[720px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6">
          <h1 className="font-black text-[22px] sm:text-[24px] text-white mb-1">Ödemeler</h1>
          <p className="text-[13px] text-[#8a8a9a]">
            Durumlar vade tarihine göre otomatik güncellenir — vadesi gelince &quot;Bekliyor&quot;,
            7 gün geçince &quot;Gecikmede&quot;.
          </p>
        </div>

        {/* Özet: tahsil edilecek tutar + gecikmiş tutar */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="rounded-2xl p-4" style={{ background: "rgba(192,132,252,0.08)", border: "1px solid rgba(192,132,252,0.2)" }}>
            <p className="text-[22px] sm:text-[24px] font-black" style={{ color: "#c084fc" }}>{sum(tahsil).toLocaleString("tr-TR")} ₺</p>
            <p className="text-[12px] text-[#8a8a9a] mt-0.5">Tahsil edilecek ({tahsil.length} fatura)</p>
          </div>
          <div className="rounded-2xl p-4" style={{
            background: groups.GECIKMEDI.length > 0 ? "rgba(248,113,113,0.08)" : "var(--surface)",
            border: `1px solid ${groups.GECIKMEDI.length > 0 ? "rgba(248,113,113,0.2)" : "var(--border)"}`,
          }}>
            <p className="text-[22px] sm:text-[24px] font-black" style={{ color: groups.GECIKMEDI.length > 0 ? "#f87171" : "#8a8a9a" }}>
              {sum(groups.GECIKMEDI).toLocaleString("tr-TR")} ₺
            </p>
            <p className="text-[12px] text-[#8a8a9a] mt-0.5">Gecikmiş ({groups.GECIKMEDI.length} fatura)</p>
          </div>
        </div>

        {/* Filtre sekmeleri */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-1 px-1">
          {tabs.map((t) => {
            const active = filter === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                className="text-[12px] font-semibold px-3 min-h-[40px] rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-colors flex-shrink-0"
                style={{
                  background: active ? `${t.color}1f` : "var(--surface)",
                  border: `1px solid ${active ? `${t.color}59` : "var(--border)"}`,
                  color: active ? t.color : "#8a8a9a",
                }}
              >
                {t.label}
                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: active ? `${t.color}26` : "rgba(255,255,255,0.06)" }}>
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>

        {error && (
          <div className="mb-4 px-4 py-2.5 rounded-xl text-[13px]" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)", color: "#f87171" }}>
            {error}
          </div>
        )}

        <div className="space-y-2.5">
          {visible.map((inv) => {
            const color = INVOICE_STAGE_COLOR[inv.stage];
            const vurgulu = inv.stage === "GECIKMEDI";
            return (
              <div key={inv.id} className="rounded-xl p-4 flex items-center justify-between gap-3 flex-wrap"
                style={{
                  background: vurgulu ? "rgba(248,113,113,0.05)" : "var(--surface)",
                  border: `1px solid ${vurgulu ? "rgba(248,113,113,0.2)" : "var(--border)"}`,
                }}>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <a href={`/musteri/admin/${inv.client.slug}`} className="text-white font-semibold text-[14px] hover:text-[#c084fc] transition-colors">
                      {inv.client.name}
                    </a>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: `${color}26`, color, border: `1px solid ${color}4d` }}>
                      {INVOICE_STAGE_LABEL[inv.stage]}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#8a8a9a] mt-0.5">
                    {inv.period} · {fmtAmount(inv.amount)}
                    {inv.dueDate ? ` · Vade: ${fmtDate(inv.dueDate)}` : ""}
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: vurgulu ? "#f87171" : "#6a6a78" }}>
                    {dueHint(inv.daysUntilDue)}
                  </p>
                </div>
                <button
                  onClick={() => handleMarkPaid(inv.id)}
                  disabled={busyId === inv.id}
                  className="text-[12px] font-semibold px-3.5 min-h-[44px] rounded-lg transition-colors flex-shrink-0"
                  style={{ background: "rgba(52,211,153,0.12)", color: "#34d399", border: "1px solid rgba(52,211,153,0.25)" }}
                >
                  {busyId === inv.id ? "..." : "✓ Ödendi"}
                </button>
              </div>
            );
          })}

          {visible.length === 0 && (
            <div className="px-5 py-16 text-center rounded-xl" style={{ border: "1px solid var(--border)" }}>
              <p className="text-[14px] text-[#555]">
                {filter === "TAHSIL" ? "Tahsil edilecek fatura yok. 🎉"
                  : filter === "GECIKMEDI" ? "Gecikmiş fatura yok. 🎉"
                  : filter === "BEKLIYOR" ? "Vadesi gelmiş bekleyen fatura yok."
                  : "Vadesi gelmemiş fatura yok."}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
