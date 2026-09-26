"use client";

import { useState } from "react";

// Tıklanana kadar yalnızca küçük resmi gösterir; YouTube'un ağır oynatıcı
// betikleri sayfa açılışını yavaşlatmaz. youtubeId yoksa "yakında" kartı.
export default function YouTubeEmbed({ id, title }: { id: string | null; title: string }) {
  const [play, setPlay] = useState(false);

  if (!id) {
    return (
      <div
        className="relative w-full aspect-video rounded-2xl overflow-hidden flex flex-col items-center justify-center text-center px-6"
        style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(236,72,153,0.2))", border: "1px solid rgba(168,85,247,0.3)" }}
      >
        <YouTubeLogo className="w-16 h-16 mb-4 opacity-90" />
        <p className="text-white font-bold text-[18px] mb-1">Video çok yakında YouTube&apos;da</p>
        <p className="text-[#c0c0d0] text-[14px] max-w-[420px]">Yayınlanana kadar videonun tam metnini aşağıda okuyabilirsiniz.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden" style={{ background: "#000", border: "1px solid var(--border)" }}>
      {play ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      ) : (
        <button type="button" onClick={() => setPlay(true)} aria-label={`Videoyu oynat: ${title}`} className="group absolute inset-0 w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt={title} className="w-full h-full object-cover" loading="eager" />
          <span className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
          <YouTubeLogo className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[72px] h-[72px] transition-transform group-hover:scale-110" />
        </button>
      )}
    </div>
  );
}

export function YouTubeLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 20" className={className} aria-hidden="true">
      <path d="M27.4 3.1A3.5 3.5 0 0024.9.6C22.7 0 14 0 14 0S5.3 0 3.1.6A3.5 3.5 0 00.6 3.1C0 5.3 0 10 0 10s0 4.7.6 6.9a3.5 3.5 0 002.5 2.5C5.3 20 14 20 14 20s8.7 0 10.9-.6a3.5 3.5 0 002.5-2.5C28 14.7 28 10 28 10s0-4.7-.6-6.9z" fill="#FF0033" />
      <path d="M11.2 14.3L18.4 10l-7.2-4.3v8.6z" fill="#fff" />
    </svg>
  );
}
