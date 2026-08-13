"use client";

import { useState } from "react";

export default function StaffFeedbackModal({ onClose }: { onClose: () => void }) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSend() {
    if (!message.trim()) { setError("Mesaj boş olamaz."); return; }
    setSending(true);
    setError("");
    const res = await fetch("/api/musteri/calisan/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message.trim() }),
    });
    const json = await res.json().catch(() => ({}));
    setSending(false);
    if (!res.ok) { setError(json.error ?? "Gönderilemedi."); return; }
    setSent(true);
  }

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.75)", WebkitBackdropFilter: "blur(8px)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-[440px] rounded-2xl p-5 sm:p-7 relative"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <button type="button" onClick={onClose} aria-label="Kapat" className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-all hover:bg-white/[0.08]">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-[#8a8a9a]" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>

        <h2 className="font-bold text-[17px] text-white mb-1">İstek / Şikayet Gönder</h2>
        <p className="text-[13px] text-[#8a8a9a] mb-5">Söylemek istediğin bir şey mi var? Doğrudan admin&apos;e ulaşır.</p>

        {sent ? (
          <div className="text-center py-6">
            <p className="text-[15px] text-white font-semibold mb-1">Gönderildi ✅</p>
            <p className="text-[13px] text-[#8a8a9a]">Mesajın admin&apos;e ulaştı.</p>
            <button onClick={onClose} className="btn btn-primary text-sm px-5 py-2.5 mt-5">Tamam</button>
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              autoFocus
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="Ne söylemek istersin?"
              className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-white placeholder-[#555] outline-none resize-none"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
            />
            {error && <p className="text-[12px]" style={{ color: "#f87171" }}>{error}</p>}
            <div className="flex gap-2">
              <button onClick={handleSend} disabled={sending} className="btn btn-primary text-sm px-5 py-2.5 flex-1">
                {sending ? "Gönderiliyor..." : "Gönder"}
              </button>
              <button onClick={onClose} disabled={sending} className="btn btn-outline text-sm px-5 py-2.5">İptal</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
