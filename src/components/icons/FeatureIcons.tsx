// Hizmet sayfası özellik kartlarının ikon seti.
//
// Önceden bu kartlarda emoji kullanılıyordu (📅 🎨 🤖 …). Emoji her işletim
// sisteminde farklı çiziliyor (Apple, Android ve Windows üç ayrı görsel dil),
// hepsi çok renkli ve doygun — sitenin mor/siyah tek renkli çizgi ikon diliyle
// çelişiyordu. Buradaki ikonlar ana sayfadaki hizmet kartlarıyla aynı dili
// kullanıyor: 24×24 viewBox, 1.5 stroke, yuvarlak uç ve birleşim.

import type { ReactNode } from "react";

const P: Record<string, ReactNode> = {
  // ── İçerik & üretim ──────────────────────────────────────────
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <path d="M7.5 14h3M7.5 17.5h9" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3a9 9 0 000 18c1.1 0 2-.9 2-2 0-.5-.2-1-.6-1.4-.3-.4-.4-.8-.4-1.1 0-.8.7-1.5 1.5-1.5H16a5 5 0 005-5c0-3.9-4-7-9-7z" />
      <circle cx="7.5" cy="11.5" r="1.1" />
      <circle cx="10.5" cy="7.5" r="1.1" />
      <circle cx="15.5" cy="8.5" r="1.1" />
    </>
  ),
  camera: (
    <>
      <path d="M3 8.5A2.5 2.5 0 015.5 6h1.2c.5 0 1-.3 1.3-.7l.7-1.1c.2-.4.7-.7 1.2-.7h4.2c.5 0 1 .3 1.2.7l.7 1.1c.3.4.8.7 1.3.7h1.2A2.5 2.5 0 0121 8.5v8A2.5 2.5 0 0118.5 19h-13A2.5 2.5 0 013 16.5v-8z" />
      <circle cx="12" cy="12" r="3.5" />
    </>
  ),
  film: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="M7 5v14M17 5v14M2.5 12h19M2.5 8.5h4.5M2.5 15.5h4.5M17 8.5h4.5M17 15.5h4.5" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.6" />
      <path d="M3.5 16.5l4.7-4.2a1.7 1.7 0 012.3.05L14 16" />
      <path d="M13 14l2.2-2a1.7 1.7 0 012.3.06l2.9 2.7" />
    </>
  ),
  pen: (
    <>
      <path d="M4 20h4l10.5-10.5a2.1 2.1 0 000-3L17 5a2.1 2.1 0 00-3 0L3.5 15.5V20" />
      <path d="M13.5 5.5l5 5" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3l1.6 4.6L18 9.2l-4.4 1.6L12 15.4l-1.6-4.6L6 9.2l4.4-1.6L12 3z" />
      <path d="M18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z" />
    </>
  ),

  // ── Reklam & hedefleme ───────────────────────────────────────
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.8" />
      <circle cx="12" cy="12" r="1.4" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 11.5a8 8 0 00-13.7-5L3.5 9" />
      <path d="M4 12.5a8 8 0 0013.7 5l2.8-2.5" />
      <path d="M3.5 4.5V9H8M20.5 19.5V15H16" />
    </>
  ),
  users: (
    <>
      <path d="M15.5 20v-1.8a3.6 3.6 0 00-3.6-3.6H6.6A3.6 3.6 0 003 18.2V20" />
      <circle cx="9.2" cy="7.6" r="3.4" />
      <path d="M21 20v-1.8a3.6 3.6 0 00-2.7-3.5M16.2 4.4a3.6 3.6 0 010 6.9" />
    </>
  ),
  flask: (
    <>
      <path d="M10 3.5h4M10.8 3.5v5.9L5.4 17.7A2 2 0 007.1 20.8h9.8a2 2 0 001.7-3.1l-5.4-8.3V3.5" />
      <path d="M7.8 14.5h8.4" />
    </>
  ),
  wallet: (
    <>
      <path d="M3 7.5A2.5 2.5 0 015.5 5H18a1 1 0 011 1v1.5" />
      <rect x="3" y="7.5" width="18" height="11.5" rx="2.2" />
      <circle cx="16.8" cy="13.2" r="1.2" />
    </>
  ),
  cart: (
    <>
      <path d="M2.5 4h2.2l2.3 10.6a1.8 1.8 0 001.8 1.4h8.1a1.8 1.8 0 001.8-1.4L20.5 8H6" />
      <circle cx="9.5" cy="20" r="1.3" />
      <circle cx="17" cy="20" r="1.3" />
    </>
  ),
  key: (
    <>
      <circle cx="7.5" cy="12" r="4" />
      <path d="M11.5 12H21" />
      <path d="M17.5 12v3.2M20.2 12v2.2" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 4h8v5.2a4 4 0 01-8 0V4z" />
      <path d="M8 5.5H5.4v1.4A3.2 3.2 0 008.3 10M16 5.5h2.6v1.4A3.2 3.2 0 0115.7 10" />
      <path d="M12 13.2V16M9 20h6M10 16h4l.6 4H9.4l.6-4z" />
    </>
  ),
  flame: (
    <>
      <path d="M12 3s5.2 3.6 5.2 8.6a5.2 5.2 0 01-10.4 0C6.8 8.4 9 6.2 9 6.2s.3 2.4 1.6 2.4C11.6 8.6 12 6.4 12 3z" />
      <path d="M12 20.8a2.9 2.9 0 002.9-2.9c0-1.9-2.9-4-2.9-4s-2.9 2.1-2.9 4a2.9 2.9 0 002.9 2.9z" />
    </>
  ),
  play: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="3.5" />
      <path d="M10.3 9.2l5 2.8-5 2.8V9.2z" />
    </>
  ),

  // ── Ölçüm & analiz ───────────────────────────────────────────
  chart: (
    <>
      <rect x="3" y="3.5" width="18" height="17" rx="2" />
      <path d="M7.8 16.2v-3.4M12 16.2V8.6M16.2 16.2v-5.3" />
    </>
  ),
  growth: (
    <>
      <path d="M3 19h18" />
      <path d="M4.5 15.2l4.6-4.9 3.4 3 5.3-6" />
      <path d="M13.4 7.3h4.4v4.3" />
    </>
  ),
  search: (
    <>
      <circle cx="10.8" cy="10.8" r="7" />
      <path d="M20.5 20.5l-4.7-4.7" />
    </>
  ),

  // ── Web & altyapı ────────────────────────────────────────────
  globe: (
    <>
      <circle cx="12" cy="12" r="8.7" />
      <path d="M3.3 12h17.4" />
      <path d="M12 3.3c2.2 2.4 3.4 5.5 3.4 8.7s-1.2 6.3-3.4 8.7c-2.2-2.4-3.4-5.5-3.4-8.7S9.8 5.7 12 3.3z" />
    </>
  ),
  mobile: (
    <>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
      <path d="M10.5 5.4h3" />
      <path d="M11 18.4h2" />
    </>
  ),
  bolt: (
    <>
      <path d="M13.4 2.5L4.8 13.2h6.1l-1.3 8.3 8.6-10.7h-6.1l1.3-8.3z" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10" width="15" height="10.5" rx="2.2" />
      <path d="M8 10V7.4a4 4 0 018 0V10" />
      <path d="M12 14v2.6" />
    </>
  ),
  panel: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M8.5 9v11" />
      <path d="M12 12.5h5.5M12 16h3.5" />
    </>
  ),

  // ── İletişim ─────────────────────────────────────────────────
  chat: (
    <>
      <path d="M20.5 12.8a7.4 7.4 0 01-8 7.3l-5.2 1.4 1.4-4.4a7.4 7.4 0 1111.8-4.3z" />
      <path d="M9 11.5h6M9 14.5h3.5" />
    </>
  ),
  handshake: (
    <>
      <path d="M11 7.2L8.6 9.4a1.7 1.7 0 002.3 2.5l1.5-1.3 3.4 3a1.7 1.7 0 01-2.3 2.5" />
      <path d="M13.5 16.1a1.7 1.7 0 01-2.4 2.4l-.6-.6" />
      <path d="M2.5 8.4L6 6.2l3.8 1.4 3.5-1.4 4.2 2.2" />
      <path d="M18.5 8.4v6.9M5.5 8.4v6.9" />
    </>
  ),
};

export type FeatureIconName = keyof typeof P;

export function FeatureIcon({
  name,
  className = "w-5 h-5",
}: {
  name: FeatureIconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {P[name]}
    </svg>
  );
}
