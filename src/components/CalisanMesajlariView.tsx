"use client";

import { useState } from "react";

export interface StaffFeedbackItem {
  id: string;
  message: string;
  status: "BEKLIYOR" | "YAPILDI";
  createdAt: string;
  user: { name: string };
}

function fmtDateTime(iso: string) {
  const dt = new Date(iso);
  return dt.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })
    + " · " + dt.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

export default function CalisanMesajlariView({ items: initialItems }: { items: StaffFeedbackItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const pending = items.filter((i) => i.status === "BEKLIYOR");
  const done = items.filter((i) => i.status === "YAPILDI");

  async function handleLogout() {
    try { await fetch("/api/musteri/auth/logout", { method: "POST" }); } catch { /* ignore */ }
    window.location.href = "/musteri/giris";
  }

  async function handleMarkDone(id: string) {
    setBusyId(id);
    setError("");
    const res = await fetch(`/api/musteri/admin/staff-feedback/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "YAPILDI" }),
    });
    if (res.ok) {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: "YAPILDI" } : i)));
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "İşaretlenemedi.");
    }
    setBusyId(null);
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <header className="sticky top-0 z-50 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-3"
        style={{ background: "var(--header-bg)", WebkitBackdropFilter: "blur(20px)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <a href="/musteri/admin" className="font-black text-[16px] sm:text-[18px] gradient-text flex-shrink-0">markaizi</a>
          <span className="hidden sm:inline text-[#555]">/</span>
          <a href="/musteri/admin" className="hidden sm:inline text-[14px] text-[#8a8a9a] hover:text-white transition-colors">Admin</a>
          <span className="hidden sm:inline text-[#555]">/</span>
          <span className="text-[13px] sm:text-[14px] font-semibold text-white truncate">Çalışan Mesajları</span>
        </div>
        <button onClick={handleLogout} className="text-[12px] sm:text-[13px] text-[#8a8a9a] hover:text-[#f87171] transition-colors flex-shrink-0 min-h-[44px] px-1 flex items-center">
          Çıkış
        </button>
      </header>

      <main className="max-w-[720px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6">
          <h1 className="font-black text-[22px] sm:text-[24px] text-white mb-1">Çalışan Mesajları</h1>
          <p className="text-[13px] text-[#8a8a9a]">Çalışanların gönderdiği istek ve şikayetler.</p>
        </div>

        {pending.length > 0 && (
          <div className="rounded-2xl p-4 mb-6" style={{ background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.2)" }}>
            <p className="text-[24px] font-black" style={{ color: "#fb923c" }}>{pending.length}</p>
            <p className="text-[12px] text-[#8a8a9a] mt-0.5">Bekleyen mesaj</p>
          </div>
        )}

        {error && (
          <div className="mb-4 px-4 py-2.5 rounded-xl text-[13px]" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)", color: "#f87171" }}>
            {error}
          </div>
        )}

        <div className="space-y-2.5 mb-8">
          {pending.map((item) => (
            <div key={item.id} className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                <p className="text-white font-semibold text-[14px]">{item.user.name}</p>
                <button
                  onClick={() => handleMarkDone(item.id)}
                  disabled={busyId === item.id}
                  className="text-[12px] font-semibold px-3.5 min-h-[44px] rounded-lg transition-colors flex-shrink-0"
                  style={{ background: "rgba(52,211,153,0.12)", color: "#34d399", border: "1px solid rgba(52,211,153,0.25)" }}
                >
                  {busyId === item.id ? "..." : "✓ Yapıldı"}
                </button>
              </div>
              <p className="text-[13px] text-white leading-relaxed whitespace-pre-wrap">{item.message}</p>
              <p className="text-[11px] text-[#555] mt-2">{fmtDateTime(item.createdAt)}</p>
            </div>
          ))}

          {pending.length === 0 && (
            <div className="px-5 py-16 text-center rounded-xl" style={{ border: "1px solid var(--border)" }}>
              <p className="text-[14px] text-[#555]">Bekleyen mesaj yok. 🎉</p>
            </div>
          )}
        </div>

        {done.length > 0 && (
          <div>
            <p className="text-[13px] font-bold uppercase tracking-wide text-[#8a8a9a] mb-3">Yapıldı Olarak İşaretlenenler</p>
            <div className="space-y-2.5">
              {done.map((item) => (
                <div key={item.id} className="rounded-xl p-4 opacity-60" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <p className="text-white font-semibold text-[14px] mb-2">{item.user.name}</p>
                  <p className="text-[13px] text-white leading-relaxed whitespace-pre-wrap">{item.message}</p>
                  <p className="text-[11px] text-[#555] mt-2">{fmtDateTime(item.createdAt)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
