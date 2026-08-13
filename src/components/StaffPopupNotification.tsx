"use client";

import { useEffect, useState } from "react";

interface PopupItem {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

// Admin'in "popup" işaretiyle gönderdiği önemli/toplu duyurular — çalışan giriş
// yaptığında (bu component her sayfada mount olduğu için ilk yüklemede) bir
// kerelik modal olarak gösterilir, kapatılınca bir daha çıkmaz (poppedAt set edilir).
export default function StaffPopupNotification() {
  const [queue, setQueue] = useState<PopupItem[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch("/api/musteri/calisan/notifications?popupOnly=1")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => { if (data?.items?.length) setQueue(data.items); });
  }, []);

  if (queue.length === 0 || index >= queue.length) return null;

  const current = queue[index];
  const isLast = index === queue.length - 1;

  async function handleAck() {
    await fetch(`/api/musteri/calisan/notifications/${current.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ popped: true, read: true }),
    });
    setIndex((i) => i + 1);
  }

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", WebkitBackdropFilter: "blur(4px)", backdropFilter: "blur(4px)" }}
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid rgba(168,85,247,0.4)" }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[18px]">📢</span>
          <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "#c084fc" }}>
            {queue.length > 1 ? `Duyuru ${index + 1}/${queue.length}` : "Duyuru"}
          </p>
        </div>
        <p className="text-[16px] font-bold text-white mb-2">{current.title}</p>
        <p className="text-[14px] text-[#c8c8d8] leading-relaxed whitespace-pre-wrap">{current.body}</p>
        <button onClick={handleAck} className="btn btn-primary text-sm px-5 py-2.5 w-full mt-5">
          {isLast ? "Anladım" : "Anladım, sonraki →"}
        </button>
      </div>
    </div>
  );
}
