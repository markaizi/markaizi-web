"use client";

import { useEffect, useState } from "react";
import { SEVERITY_META, type ClientNotificationSeverity } from "@/lib/clientNotifySeverity";

interface SentItem {
  id: string;
  severity: ClientNotificationSeverity;
  title: string;
  body: string;
  readAt: string | null;
  createdAt: string;
  reply: string | null;
  repliedAt: string | null;
}

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })
    + " · " + new Date(iso).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

const SEVERITIES: ClientNotificationSeverity[] = ["YESIL", "SARI", "KIRMIZI"];

// Tek bir firmaya özel bildirim yazma penceresi — StaffNotificationComposer'ın
// müşteri karşılığı, ama alıcı zaten bu firma olduğu için seçici yok.
export default function ClientNotificationComposer({
  clientSlug,
  clientName,
  onClose,
}: {
  clientSlug: string;
  clientName: string;
  onClose: () => void;
}) {
  const [severity, setSeverity] = useState<ClientNotificationSeverity>("SARI");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [history, setHistory] = useState<SentItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  function loadHistory() {
    setLoadingHistory(true);
    fetch(`/api/musteri/admin/client-notifications?clientSlug=${encodeURIComponent(clientSlug)}`)
      .then((r) => r.json())
      .then((d) => setHistory(d.items ?? []))
      .finally(() => setLoadingHistory(false));
  }

  useEffect(() => { loadHistory(); }, [clientSlug]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSend() {
    setError("");
    if (!title.trim() || !body.trim()) { setError("Başlık ve mesaj zorunlu."); return; }

    setSending(true);
    const res = await fetch("/api/musteri/admin/client-notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientSlug, severity, title: title.trim(), body: body.trim() }),
    });
    const json = await res.json().catch(() => ({}));
    setSending(false);
    if (!res.ok) { setError(json.error ?? "Gönderilemedi."); return; }
    setSent(true);
    setTitle("");
    setBody("");
    loadHistory();
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu bildirimi geri al? Müşteri artık göremez (kırmızıysa kilit de kalkar).")) return;
    setHistory((prev) => prev.filter((h) => h.id !== id));
    await fetch(`/api/musteri/admin/client-notifications/${id}`, { method: "DELETE" });
  }

  const meta = SEVERITY_META[severity];

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.75)", WebkitBackdropFilter: "blur(8px)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-[480px] rounded-2xl p-5 sm:p-7 relative max-h-[85vh] overflow-y-auto"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <button type="button" onClick={onClose} aria-label="Kapat" className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-all hover:bg-white/[0.08]">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-[#8a8a9a]" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>

        <h2 className="font-bold text-[17px] text-white mb-1">Bildirim Yaz</h2>
        <p className="text-[13px] text-[#8a8a9a] mb-5">{clientName} firmasına gönderilecek</p>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-2">Önem Derecesi</label>
            <div className="flex gap-2">
              {SEVERITIES.map((s) => {
                const m = SEVERITY_META[s];
                const active = severity === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSeverity(s)}
                    className="flex-1 text-[12px] font-semibold py-2 rounded-xl transition-all"
                    style={active
                      ? { background: m.bg, color: m.color, border: `1.5px solid ${m.border}` }
                      : { background: "var(--bg)", color: "#8a8a9a", border: "1.5px solid var(--border)" }}
                  >
                    {m.emoji} {m.shortLabel}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-[#8a8a9a] mt-2 leading-relaxed">{meta.desc}</p>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Başlık</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: Fatura Ödemesi Bekleniyor"
              className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-white placeholder-[#555] outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Mesaj</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              placeholder="Örn: Faturanız ödenmediği için reklamlarınız ve paylaşımlarınız geçici olarak duraklatılmıştır."
              className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-white placeholder-[#555] outline-none resize-none"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
            />
          </div>

          {error && <p className="text-[12px]" style={{ color: "#f87171" }}>{error}</p>}
          {sent && <p className="text-[12px] text-green-400">Gönderildi ✅</p>}

          <div className="flex gap-2">
            <button onClick={handleSend} disabled={sending} className="btn btn-primary text-sm px-5 py-2.5 flex-1">
              {sending ? "Gönderiliyor..." : "Gönder"}
            </button>
            <button onClick={onClose} disabled={sending} className="btn btn-outline text-sm px-5 py-2.5">Kapat</button>
          </div>
        </div>

        <div className="mt-6 pt-5" style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-3">Bu firmaya gönderilenler</p>
          {loadingHistory ? (
            <p className="text-[12px] text-[#8a8a9a]">Yükleniyor...</p>
          ) : history.length === 0 ? (
            <p className="text-[12px] text-[#8a8a9a]">Henüz bildirim gönderilmedi.</p>
          ) : (
            <div className="space-y-2">
              {history.map((h) => {
                const m = SEVERITY_META[h.severity];
                return (
                  <div key={h.id} className="rounded-xl p-3" style={{ background: "var(--bg)", border: `1px solid ${m.border}` }}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: m.bg, color: m.color }}>
                            {m.emoji} {m.shortLabel}
                          </span>
                          <p className="text-[12.5px] font-semibold text-white">{h.title}</p>
                        </div>
                        <p className="text-[11.5px] text-[#8a8a9a] mt-0.5 whitespace-pre-wrap leading-snug">{h.body}</p>
                        <p className="text-[10px] text-[#555] mt-1">
                          {fmtDateTime(h.createdAt)} · {h.readAt ? "okundu" : "okunmadı"}
                          {h.severity === "KIRMIZI" && " · kilit aktif"}
                        </p>
                        {h.reply && (
                          <div className="mt-2 rounded-lg px-2.5 py-2" style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.25)" }}>
                            <p className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wide mb-0.5">Müşteri yanıtı</p>
                            <p className="text-[12px] text-white whitespace-pre-wrap leading-snug">{h.reply}</p>
                            {h.repliedAt && <p className="text-[10px] text-[#555] mt-1">{fmtDateTime(h.repliedAt)}</p>}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleDelete(h.id)}
                        className="text-[11px] font-semibold flex-shrink-0 hover:opacity-80 transition-opacity"
                        style={{ color: "#f87171" }}
                      >
                        Geri al
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
