"use client";

import { useState } from "react";

export interface PendingInvoice {
  id: string;
  period: string;
  amount: string;
  dueDate: string | null;
  overdue: boolean;
  client: { slug: string; name: string };
}

function fmtAmount(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return raw;
  const num = parseInt(digits, 10);
  if (isNaN(num)) return raw;
  return num.toLocaleString("tr-TR") + " ₺";
}

// "YYYY-MM-DD" → "10 Eylül 2026"
function fmtDate(raw: string): string {
  if (!raw) return raw;
  const dt = new Date(raw + "T00:00:00");
  if (isNaN(dt.getTime())) return raw;
  return dt.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

export default function OdemelerView({ invoices: initialInvoices }: { invoices: PendingInvoice[] }) {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

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

  const overdueCount = invoices.filter((i) => i.overdue).length;
  const totalAmount = invoices.reduce((s, i) => {
    const digits = i.amount.replace(/[^\d]/g, "");
    return s + (digits ? parseInt(digits, 10) : 0);
  }, 0);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <header className="sticky top-0 z-50 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-3"
        style={{ background: "rgba(5,5,5,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}>
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
            Tüm firmaların bekleyen faturaları — buradan tek tıkla &quot;Ödendi&quot; işaretleyebilirsin.
          </p>
        </div>

        {invoices.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="rounded-2xl p-4" style={{ background: overdueCount > 0 ? "rgba(248,113,113,0.1)" : "rgba(251,191,36,0.1)", border: `1px solid ${overdueCount > 0 ? "rgba(248,113,113,0.2)" : "rgba(251,191,36,0.2)"}` }}>
              <p className="text-[24px] font-black" style={{ color: overdueCount > 0 ? "#f87171" : "#fbbf24" }}>{invoices.length}</p>
              <p className="text-[12px] text-[#8a8a9a] mt-0.5">Bekleyen fatura{overdueCount > 0 ? ` (${overdueCount} gecikmiş)` : ""}</p>
            </div>
            <div className="rounded-2xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <p className="text-[24px] font-black text-white">{totalAmount.toLocaleString("tr-TR")} ₺</p>
              <p className="text-[12px] text-[#8a8a9a] mt-0.5">Toplam tutar</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 px-4 py-2.5 rounded-xl text-[13px]" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)", color: "#f87171" }}>
            {error}
          </div>
        )}

        <div className="space-y-2.5">
          {invoices.map((inv) => (
            <div key={inv.id} className="rounded-xl p-4 flex items-center justify-between gap-3 flex-wrap"
              style={{
                background: inv.overdue ? "rgba(248,113,113,0.05)" : "var(--surface)",
                border: `1px solid ${inv.overdue ? "rgba(248,113,113,0.2)" : "var(--border)"}`,
              }}>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <a href={`/musteri/admin/${inv.client.slug}`} className="text-white font-semibold text-[14px] hover:text-[#c084fc] transition-colors">
                    {inv.client.name}
                  </a>
                  {inv.overdue && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: "rgba(248,113,113,0.15)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)" }}>
                      Gecikmiş
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-[#8a8a9a] mt-0.5">
                  {inv.period} · {fmtAmount(inv.amount)}{inv.dueDate ? ` · Vade: ${fmtDate(inv.dueDate)}` : ""}
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
          ))}

          {invoices.length === 0 && (
            <div className="px-5 py-16 text-center rounded-xl" style={{ border: "1px solid var(--border)" }}>
              <p className="text-[14px] text-[#555]">Bekleyen fatura yok. 🎉</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
