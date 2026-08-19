"use client";

import { useEffect, useRef, useState } from "react";

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  readAt: string | null;
  createdAt: string;
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "az önce";
  if (min < 60) return `${min} dk önce`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} sa önce`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day} gün önce`;
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}

export default function ClientNotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/musteri/client-notifications");
    if (res.ok) {
      const data = await res.json();
      setItems(data.items);
      setUnreadCount(data.unreadCount);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  async function markRead(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
    await fetch(`/api/musteri/client-notifications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    });
  }

  async function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() })));
    setUnreadCount(0);
    await fetch("/api/musteri/client-notifications/read-all", { method: "PATCH" });
  }

  return (
    <div className="fixed bottom-5 right-5 z-[1000]" ref={panelRef}>
      {open && (
        <div
          className="absolute bottom-[60px] right-0 w-[320px] max-w-[85vw] max-h-[70vh] overflow-y-auto rounded-2xl shadow-2xl"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between gap-2 px-4 py-3 sticky top-0" style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
            <p className="text-[13px] font-bold text-white">Bildirimler</p>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-[11px] font-semibold text-[#c084fc] hover:opacity-80 transition-opacity">
                Tümünü okundu yap
              </button>
            )}
          </div>
          <div className="p-2">
            {loading && items.length === 0 ? (
              <p className="text-[12px] text-[#8a8a9a] text-center py-8">Yükleniyor...</p>
            ) : items.length === 0 ? (
              <p className="text-[12px] text-[#8a8a9a] text-center py-8">Henüz bildirim yok.</p>
            ) : (
              items.map((n) => (
                <button
                  key={n.id}
                  onClick={() => !n.readAt && markRead(n.id)}
                  className="w-full text-left px-3 py-2.5 rounded-xl mb-1 transition-colors"
                  style={{ background: n.readAt ? "transparent" : "rgba(168,85,247,0.08)" }}
                >
                  <div className="flex items-start gap-2">
                    {!n.readAt && <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#c084fc" }} />}
                    <div className="min-w-0 flex-1">
                      <p className="text-[12.5px] font-semibold text-white">{n.title}</p>
                      <p className="text-[11.5px] text-[#8a8a9a] mt-0.5 whitespace-pre-wrap leading-snug">{n.body}</p>
                      <p className="text-[10px] text-[#555] mt-1">{timeAgo(n.createdAt)}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="w-12 h-12 rounded-full flex items-center justify-center relative transition-transform active:scale-95"
        style={{ background: "var(--grad, linear-gradient(135deg,#7c3aed,#a855f7,#ec4899))", boxShadow: "0 8px 24px rgba(168,85,247,0.35)" }}
        aria-label="Bildirimler"
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[10px] font-black text-white"
            style={{ background: "#f87171", border: "2px solid var(--bg)" }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}
