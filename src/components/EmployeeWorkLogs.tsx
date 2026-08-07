"use client";

import { useState } from "react";

export interface WorkLogItem {
  id: string;
  date: string; // ISO
  description: string;
  amount: string | null;
}

function parseAmount(raw: string | null): number {
  if (!raw) return 0;
  const digits = raw.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

export default function EmployeeWorkLogs({
  employeeName,
  paymentDay,
  logs: initialLogs,
}: {
  employeeName: string;
  paymentDay: string;
  logs: WorkLogItem[];
}) {
  const [logs, setLogs] = useState(initialLogs);
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const total = logs.reduce((s, l) => s + parseAmount(l.amount), 0);

  async function handleLogout() {
    try { await fetch("/api/musteri/auth/logout", { method: "POST" }); } catch { /* ignore */ }
    window.location.href = "/musteri/giris";
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) return;
    setSaving(true);
    setErr("");
    const res = await fetch("/api/musteri/calisan/worklogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, description: description.trim() }),
    });
    const json = await res.json();
    setSaving(false);
    if (json.ok) {
      setLogs((prev) => [json.log, ...prev]);
      setDescription("");
    } else {
      setErr(json.error ?? "Hata.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu kaydı sil?")) return;
    setDeletingId(id);
    const res = await fetch(`/api/musteri/calisan/worklogs/${id}`, { method: "DELETE" });
    if (res.ok) {
      setLogs((prev) => prev.filter((l) => l.id !== id));
    } else {
      const j = await res.json().catch(() => ({}));
      setErr(j.error ?? "Silinemedi.");
    }
    setDeletingId(null);
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ background: "rgba(5,5,5,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2">
          <a href="/musteri/calisan"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all"
            style={{ background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)", color: "#60a5fa" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(96,165,250,0.2)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(96,165,250,0.1)"; }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M5 12l7 7M5 12l7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Çalışan Paneli
          </a>
          <span className="text-[#555]">/</span>
          <span className="text-[14px] font-semibold text-white">İş Kayıtlarım</span>
        </div>
        <button onClick={handleLogout} className="text-[12px] text-[#8a8a9a] hover:text-[#f87171] transition-colors flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
            <path d="M18.364 5.636A9 9 0 1 1 5.636 18.364" strokeLinecap="round"/>
            <path d="M12 3v9" strokeLinecap="round"/>
          </svg>
          Çıkış
        </button>
      </header>

      <main className="max-w-[720px] mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="font-black text-[24px] text-white mb-1">İş Kayıtlarım</h1>
          <p className="text-[14px] text-[#8a8a9a]">Merhaba {employeeName} — yaptığın işleri günlük olarak buraya ekle.</p>
        </div>

        {/* Özet */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="rounded-2xl p-5" style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)" }}>
            <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "#34d399" }}>Toplam Kazanç</p>
            <p className="text-[28px] font-black text-white mt-1">{total > 0 ? `${total.toLocaleString("tr-TR")} ₺` : "—"}</p>
          </div>
          <div className="rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#8a8a9a]">Ödeme Günü</p>
            <p className="text-[16px] font-semibold text-white mt-1.5">{paymentDay || "Henüz belirtilmedi"}</p>
          </div>
        </div>

        {/* Yeni kayıt formu */}
        <form onSubmit={handleAdd} className="rounded-2xl p-5 space-y-4 mb-8" style={{ background: "var(--surface)", border: "1px solid rgba(96,165,250,0.3)" }}>
          <p className="font-semibold text-white text-[14px]">Yeni İş Kaydı</p>
          <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Tarih</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-[14px] text-white outline-none focus:ring-1 focus:ring-blue-500/50"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Ne yaptın?</label>
              <input
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Örn: Alitel 03 dron videosu editlendi"
                className="w-full px-3 py-2.5 rounded-lg text-[14px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-blue-500/50"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
              />
            </div>
          </div>
          {err && <p className="text-[12px] text-red-400">{err}</p>}
          <button type="submit" disabled={saving} className="btn btn-primary text-sm px-5 py-2.5">
            {saving ? "Ekleniyor..." : "Ekle"}
          </button>
        </form>

        {/* Liste */}
        <div className="space-y-3">
          {logs.map((l) => (
            <div key={l.id} className="rounded-xl p-4 flex items-start justify-between gap-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="min-w-0">
                <p className="text-[11px] text-[#555] mb-1">{fmtDate(l.date)}</p>
                <p className="text-[14px] text-white font-medium">{l.description}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className="text-[12px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
                  style={l.amount
                    ? { background: "rgba(52,211,153,0.12)", color: "#34d399" }
                    : { background: "rgba(251,191,36,0.12)", color: "#fbbf24" }}
                >
                  {l.amount ?? "Bekliyor"}
                </span>
                {!l.amount && (
                  <button
                    onClick={() => handleDelete(l.id)}
                    disabled={deletingId === l.id}
                    className="text-[11px] text-[#555] hover:text-red-400 transition-colors"
                  >
                    {deletingId === l.id ? "..." : "Sil"}
                  </button>
                )}
              </div>
            </div>
          ))}
          {logs.length === 0 && (
            <p className="text-[13px] text-[#8a8a9a] text-center py-12">Henüz iş kaydı yok. Yukarıdan ilk kaydını ekle.</p>
          )}
        </div>
      </main>
    </div>
  );
}
