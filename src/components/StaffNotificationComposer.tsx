"use client";

import { useEffect, useState } from "react";

interface EmployeeOption { id: string; name: string; }

export default function StaffNotificationComposer({ onClose }: { onClose: () => void }) {
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [sendToAll, setSendToAll] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [popup, setPopup] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sentCount, setSentCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/musteri/admin/employees")
      .then((res) => res.json())
      .then((data) => setEmployees(data.employees ?? []))
      .finally(() => setLoadingEmployees(false));
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function toggleEmployee(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function handleSend() {
    setError("");
    if (!title.trim() || !body.trim()) { setError("Başlık ve mesaj zorunlu."); return; }
    if (!sendToAll && selectedIds.length === 0) { setError("En az bir çalışan seç veya \"Tümüne Gönder\" işaretle."); return; }

    setSending(true);
    const res = await fetch("/api/musteri/admin/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipientIds: sendToAll ? "all" : selectedIds,
        title: title.trim(),
        body: body.trim(),
        popup,
      }),
    });
    const json = await res.json().catch(() => ({}));
    setSending(false);
    if (!res.ok) { setError(json.error ?? "Gönderilemedi."); return; }
    setSentCount(json.count);
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
        className="w-full max-w-[480px] rounded-2xl p-5 sm:p-7 relative max-h-[85vh] overflow-y-auto"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <button type="button" onClick={onClose} aria-label="Kapat" className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-all hover:bg-white/[0.08]">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-[#8a8a9a]" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>

        <h2 className="font-bold text-[17px] text-white mb-5">Bildirim Gönder</h2>

        {sentCount !== null ? (
          <div className="text-center py-8">
            <p className="text-[15px] text-white font-semibold mb-1">Gönderildi ✅</p>
            <p className="text-[13px] text-[#8a8a9a]">{sentCount} çalışana ulaştı.</p>
            <button onClick={onClose} className="btn btn-primary text-sm px-5 py-2.5 mt-5">Tamam</button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-2">Alıcılar</label>
              <label className="flex items-center gap-2 mb-2 cursor-pointer">
                <input type="checkbox" checked={sendToAll} onChange={(e) => setSendToAll(e.target.checked)} className="w-4 h-4" />
                <span className="text-[13px] text-white font-medium">Tümüne Gönder</span>
              </label>
              {!sendToAll && (
                <div className="rounded-xl p-2 max-h-[160px] overflow-y-auto" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                  {loadingEmployees ? (
                    <p className="text-[12px] text-[#8a8a9a] px-2 py-2">Yükleniyor...</p>
                  ) : employees.length === 0 ? (
                    <p className="text-[12px] text-[#8a8a9a] px-2 py-2">Çalışan bulunamadı.</p>
                  ) : (
                    employees.map((e) => (
                      <label key={e.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-white/[0.04]">
                        <input type="checkbox" checked={selectedIds.includes(e.id)} onChange={() => toggleEmployee(e.id)} className="w-4 h-4" />
                        <span className="text-[13px] text-white">{e.name}</span>
                      </label>
                    ))
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Başlık</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: Önemli Duyuru"
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
                placeholder="Örn: Lütfen tüm yapılan kartlarınızı kontrol kısmına aktarmayı unutmayın."
                className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-white placeholder-[#555] outline-none resize-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
              />
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={popup} onChange={(e) => setPopup(e.target.checked)} className="w-4 h-4 mt-0.5" />
              <span className="text-[12.5px] text-[#8a8a9a]">
                <span className="text-white font-medium">Popup olarak göster</span> — önemli/toplu duyurular için: çalışan giriş yaptığı an bir kerelik ekrana çıkar.
              </span>
            </label>

            {error && <p className="text-[12px]" style={{ color: "#f87171" }}>{error}</p>}

            <div className="flex gap-2 pt-1">
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
