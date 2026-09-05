"use client";

import { useState } from "react";

export interface PendingNote {
  id: string;
  text: string;
  createdAt: string;
  client: { slug: string; name: string };
}

function fmtDateTime(iso: string) {
  const dt = new Date(iso);
  return dt.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })
    + " · " + dt.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

export default function IsteklerView({ notes: initialNotes }: { notes: PendingNote[] }) {
  const [notes, setNotes] = useState(initialNotes);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleLogout() {
    try { await fetch("/api/musteri/auth/logout", { method: "POST" }); } catch { /* ignore */ }
    window.location.href = "/musteri/giris";
  }

  async function handleMarkDone(id: string) {
    setBusyId(id);
    setError("");
    const res = await fetch(`/api/musteri/notes/note/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "YAPILDI" }),
    });
    if (res.ok) {
      setNotes((prev) => prev.filter((n) => n.id !== id));
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
          <span className="text-[13px] sm:text-[14px] font-semibold text-white truncate">Gelen İstekler</span>
        </div>
        <button onClick={handleLogout} className="text-[12px] sm:text-[13px] text-[#8a8a9a] hover:text-[#f87171] transition-colors flex-shrink-0 min-h-[44px] px-1 flex items-center">
          Çıkış
        </button>
      </header>

      <main className="max-w-[720px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6">
          <h1 className="font-black text-[22px] sm:text-[24px] text-white mb-1">Gelen İstekler</h1>
          <p className="text-[13px] text-[#8a8a9a]">
            Tüm firmalardan gelen bekleyen istekler — buradan tek tıkla &quot;Yapıldı&quot; işaretleyebilirsin.
          </p>
        </div>

        {notes.length > 0 && (
          <div className="rounded-2xl p-4 mb-6" style={{ background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.2)" }}>
            <p className="text-[24px] font-black" style={{ color: "#fb923c" }}>{notes.length}</p>
            <p className="text-[12px] text-[#8a8a9a] mt-0.5">Bekleyen istek</p>
          </div>
        )}

        {error && (
          <div className="mb-4 px-4 py-2.5 rounded-xl text-[13px]" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)", color: "#f87171" }}>
            {error}
          </div>
        )}

        <div className="space-y-2.5">
          {notes.map((note) => (
            <div key={note.id} className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                <a href={`/musteri/admin/${note.client.slug}`} className="text-white font-semibold text-[14px] hover:text-[#c084fc] transition-colors">
                  {note.client.name}
                </a>
                <button
                  onClick={() => handleMarkDone(note.id)}
                  disabled={busyId === note.id}
                  className="text-[12px] font-semibold px-3.5 min-h-[44px] rounded-lg transition-colors flex-shrink-0"
                  style={{ background: "rgba(52,211,153,0.12)", color: "#34d399", border: "1px solid rgba(52,211,153,0.25)" }}
                >
                  {busyId === note.id ? "..." : "✓ Yapıldı"}
                </button>
              </div>
              <p className="text-[13px] text-white leading-relaxed whitespace-pre-wrap">{note.text}</p>
              <p className="text-[11px] text-[#555] mt-2">{fmtDateTime(note.createdAt)}</p>
            </div>
          ))}

          {notes.length === 0 && (
            <div className="px-5 py-16 text-center rounded-xl" style={{ border: "1px solid var(--border)" }}>
              <p className="text-[14px] text-[#555]">Bekleyen istek yok. 🎉</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
