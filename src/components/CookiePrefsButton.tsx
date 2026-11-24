"use client";

/** Footer'daki "Çerez Tercihleri": kararı sıfırlar ve çerez bandını yeniden açar (onay geri alınabilsin). */
export default function CookiePrefsButton({ className = "" }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event("cookie-consent-open"))}>
      Çerez Tercihleri
    </button>
  );
}
