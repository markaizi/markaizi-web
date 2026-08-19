"use client";

import { useEffect, useRef, useState } from "react";
import { SEVERITY_META, type ClientNotificationSeverity } from "@/lib/clientNotifySeverity";

interface PopupItem {
  id: string;
  severity: ClientNotificationSeverity;
  title: string;
  body: string;
  createdAt: string;
}

// Müşterinin firmasına yazılmış, henüz gösterilmemiş bildirimler — giriş sonrası
// (bu component ClientPortal'da müşteri görünümünde mount olduğu için ilk
// yüklemede) sırayla bir kerelik popup olarak gösterilir. Kırmızının kilit etkisi
// buna bağlı değildir — kapatılsa da rapor/içerik kilidi ClientPortal tarafında
// ayrıca (notificationLock ile) sürer, yalnızca admin silince kalkar.
export default function ClientPopupNotification() {
  const [queue, setQueue] = useState<PopupItem[]>([]);
  const [index, setIndex] = useState(0);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetch("/api/musteri/client-notifications?popupOnly=1")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => { if (data?.items?.length) setQueue(data.items); });
  }, []);

  const current = queue[index];

  // Yeşil bildirimde kutlama efekti — sade bir canvas parçacık patlaması, harici
  // kütüphane yok. Hareket azaltma tercihine saygı duyar.
  useEffect(() => {
    if (!current || current.severity !== "YESIL") return;
    if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string };
    const particles: Particle[] = [];
    const colors = ["#34d399", "#fbbf24", "#c084fc", "#60a5fa", "#f472b6"];

    function burst(x: number, y: number) {
      for (let i = 0; i < 44; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 4.5;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    const w = canvas.width, h = canvas.height;
    burst(w / 2, h * 0.4);
    const t1 = setTimeout(() => burst(w * 0.28, h * 0.32), 220);
    const t2 = setTimeout(() => burst(w * 0.72, h * 0.32), 420);

    let raf: number;
    function tick() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06;
        p.life -= 0.011;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    }
    tick();

    return () => { cancelAnimationFrame(raf); clearTimeout(t1); clearTimeout(t2); };
  }, [current]);

  if (!current) return null;

  const m = SEVERITY_META[current.severity];
  const isLast = index === queue.length - 1;

  async function advance() {
    setReplyText("");
    setIndex((i) => i + 1);
  }

  async function handleAck() {
    await fetch(`/api/musteri/client-notifications/${current.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ popped: true, read: true }),
    });
    advance();
  }

  async function handleReplySend() {
    const text = replyText.trim();
    if (!text) { handleAck(); return; }
    setSending(true);
    await fetch(`/api/musteri/client-notifications/${current.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ popped: true, reply: text }),
    });
    setSending(false);
    advance();
  }

  return (
    <>
      {current.severity === "YESIL" && (
        <canvas ref={canvasRef} className="fixed inset-0 z-[2001] pointer-events-none" />
      )}
      <div
        className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.7)", WebkitBackdropFilter: "blur(4px)", backdropFilter: "blur(4px)" }}
        role="dialog"
        aria-modal="true"
      >
        <div className="w-full max-w-sm rounded-2xl p-6" style={{ background: "var(--surface)", border: `1.5px solid ${m.border}` }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[20px]">{m.emoji}</span>
            <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: m.color }}>
              {m.shortLabel}{queue.length > 1 ? ` · ${index + 1}/${queue.length}` : ""}
            </p>
          </div>
          <p className="text-[16px] font-bold text-white mb-2">{current.title}</p>
          <p className="text-[14px] text-[#c8c8d8] leading-relaxed whitespace-pre-wrap mb-5">{current.body}</p>

          {current.severity === "SARI" ? (
            <>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={2}
                placeholder="İsterseniz hemen yanıt yazın (opsiyonel)..."
                className="w-full px-3.5 py-2.5 rounded-xl text-[13px] text-white placeholder-[#555] outline-none resize-none mb-3"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
              />
              <div className="flex gap-2">
                <button onClick={handleReplySend} disabled={sending} className="btn btn-primary text-sm px-5 py-2.5 flex-1">
                  {sending ? "Gönderiliyor..." : replyText.trim() ? "Yanıtla ve Kapat" : "Anladım"}
                </button>
                {replyText.trim() && (
                  <button onClick={handleAck} disabled={sending} className="btn btn-outline text-sm px-4 py-2.5">Şimdi Değil</button>
                )}
              </div>
            </>
          ) : (
            <button onClick={handleAck} className="btn btn-primary text-sm px-5 py-2.5 w-full">
              {isLast ? "Anladım" : "Anladım, sonraki →"}
            </button>
          )}

          {current.severity === "KIRMIZI" && (
            <p className="text-[11px] text-[#8a8a9a] mt-3 leading-relaxed">
              Bu bildirim kaldırılana kadar Raporlar ve İçerik Takvimi sekmeleri kilitli kalır.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
