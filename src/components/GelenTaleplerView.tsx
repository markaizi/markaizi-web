"use client";

import { useState } from "react";

export interface SubmissionItem {
  id: string;
  type: "CONTACT" | "CV" | "WEB_TEKLIF" | "ANALIZ";
  data: Record<string, unknown>;
  emailSent: boolean;
  read: boolean;
  createdAt: string;
}

const TYPE_LABEL: Record<SubmissionItem["type"], { label: string; color: string; bg: string }> = {
  CONTACT: { label: "İletişim Formu", color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
  CV: { label: "İş Başvurusu", color: "#34d399", bg: "rgba(52,211,153,0.1)" },
  WEB_TEKLIF: { label: "Web Teklifi", color: "#c084fc", bg: "rgba(168,85,247,0.1)" },
  ANALIZ: { label: "Ücretsiz Analiz Talebi", color: "#fbbf24", bg: "rgba(251,191,36,0.1)" },
};

function fmtDateTime(iso: string) {
  const dt = new Date(iso);
  return dt.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })
    + " · " + dt.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

function prettifyKey(key: string): string {
  return key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (c) => c.toUpperCase());
}

function summaryLine(item: SubmissionItem): string {
  const d = item.data;
  const parts = [d.name, d.businessName, d.email, d.phone].filter((v) => typeof v === "string" && v);
  return parts.join(" · ") || "—";
}

export default function GelenTaleplerView({ submissions: initial }: { submissions: SubmissionItem[] }) {
  const [submissions, setSubmissions] = useState(initial);
  const [openId, setOpenId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleLogout() {
    try { await fetch("/api/musteri/auth/logout", { method: "POST" }); } catch { /* ignore */ }
    window.location.href = "/musteri/giris";
  }

  async function toggleOpen(item: SubmissionItem) {
    const next = openId === item.id ? null : item.id;
    setOpenId(next);
    if (next && !item.read) {
      const res = await fetch(`/api/musteri/admin/submissions/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      if (res.ok) setSubmissions((prev) => prev.map((s) => (s.id === item.id ? { ...s, read: true } : s)));
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu talep kalıcı olarak silinsin mi?")) return;
    setBusyId(id);
    const res = await fetch(`/api/musteri/admin/submissions/${id}`, { method: "DELETE" });
    if (res.ok) setSubmissions((prev) => prev.filter((s) => s.id !== id));
    setBusyId(null);
  }

  const unreadCount = submissions.filter((s) => !s.read).length;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <header className="sticky top-0 z-50 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-3"
        style={{ background: "rgba(5,5,5,0.9)", WebkitBackdropFilter: "blur(20px)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <a href="/musteri/admin" className="font-black text-[16px] sm:text-[18px] gradient-text flex-shrink-0">markaizi</a>
          <span className="hidden sm:inline text-[#555]">/</span>
          <a href="/musteri/admin" className="hidden sm:inline text-[14px] text-[#8a8a9a] hover:text-white transition-colors">Admin</a>
          <span className="hidden sm:inline text-[#555]">/</span>
          <span className="text-[13px] sm:text-[14px] font-semibold text-white truncate">Gelen Talepler</span>
        </div>
        <button onClick={handleLogout} className="text-[12px] sm:text-[13px] text-[#8a8a9a] hover:text-[#f87171] transition-colors flex-shrink-0 min-h-[44px] px-1 flex items-center">
          Çıkış
        </button>
      </header>

      <main className="max-w-[760px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6">
          <h1 className="font-black text-[22px] sm:text-[24px] text-white mb-1">Gelen Talepler</h1>
          <p className="text-[13px] text-[#8a8a9a]">
            Site üzerindeki iletişim, iş başvurusu ve web teklifi formlarından gelen tüm talepler — e-posta gönderimi başarısız olsa bile burada kalıcı olarak saklanır.
          </p>
        </div>

        {unreadCount > 0 && (
          <div className="rounded-2xl p-4 mb-6" style={{ background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.2)" }}>
            <p className="text-[24px] font-black" style={{ color: "#fb923c" }}>{unreadCount}</p>
            <p className="text-[12px] text-[#8a8a9a] mt-0.5">Okunmamış talep</p>
          </div>
        )}

        <div className="space-y-2.5">
          {submissions.map((item) => {
            const t = TYPE_LABEL[item.type];
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className="rounded-xl overflow-hidden" style={{ background: "var(--surface)", border: `1px solid ${item.read ? "var(--border)" : "rgba(251,146,60,0.3)"}` }}>
                <button onClick={() => toggleOpen(item)} className="w-full text-left p-4 flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full" style={{ background: t.bg, color: t.color }}>
                        {t.label}
                      </span>
                      {!item.read && (
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#fb923c" }} />
                      )}
                      {!item.emailSent && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(248,113,113,0.1)", color: "#f87171" }}>
                          E-posta gönderilemedi
                        </span>
                      )}
                    </div>
                    <p className="text-[13.5px] font-semibold text-white truncate">{summaryLine(item)}</p>
                    <p className="text-[11px] text-[#555] mt-1">{fmtDateTime(item.createdAt)}</p>
                  </div>
                  <span className="text-[#8a8a9a] flex-shrink-0 mt-1">{isOpen ? "▲" : "▼"}</span>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1" style={{ borderTop: "1px solid var(--border)" }}>
                    <div className="space-y-2 mt-3">
                      {Object.entries(item.data)
                        .filter(([, v]) => v !== null && v !== undefined && v !== "" && typeof v !== "object")
                        .map(([key, value]) => (
                          <div key={key} className="grid grid-cols-[140px_1fr] gap-3 text-[13px]">
                            <span className="text-[#8a8a9a]">{prettifyKey(key)}</span>
                            <span className="text-white whitespace-pre-wrap">{String(value)}</span>
                          </div>
                        ))}
                    </div>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={busyId === item.id}
                      className="mt-4 text-[12px] font-semibold px-3.5 min-h-[38px] rounded-lg transition-colors"
                      style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.25)" }}
                    >
                      {busyId === item.id ? "..." : "Sil"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {submissions.length === 0 && (
            <div className="px-5 py-16 text-center rounded-xl" style={{ border: "1px solid var(--border)" }}>
              <p className="text-[14px] text-[#555]">Henüz talep yok.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
