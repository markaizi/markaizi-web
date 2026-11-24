"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { track } from "@/lib/track";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

// Analytics/reklam script'leri yalnızca kullanıcı çerez bandında "Tümünü Kabul
// Et"e bastıysa yüklenir — KVKK/GDPR gereği, onay öncesi hiçbir izleme
// script'i çalışmamalı. CookieBanner "cookie-consent-change" olayını
// tetikleyerek sayfa yenilemeden anında burayı güncelletir.
export default function Analytics() {
  const [consented, setConsented] = useState(false);
  const pathname = usePathname();
  const firstPath = useRef(true);

  useEffect(() => {
    const check = () => setConsented(localStorage.getItem("cookie_consent") === "all");
    check();
    window.addEventListener("cookie-consent-change", check);
    return () => window.removeEventListener("cookie-consent-change", check);
  }, []);

  // Meta Pixel yalnızca ilk yüklemede PageView gönderiyordu; App Router sayfa geçişleri sayılmıyordu.
  // (GA4 geçişleri kendi "geliştirilmiş ölçüm" ayarıyla tarayıcı geçmişinden yakalar.)
  useEffect(() => {
    if (firstPath.current) { firstPath.current = false; return; }
    if (consented) window.fbq?.("track", "PageView");
  }, [pathname, consented]);

  // WhatsApp, telefon ve e-posta tıklamaları — sitedeki tüm bağlantılar için tek dinleyici.
  // track() izin yoksa hiçbir şey göndermez.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      const href = a?.getAttribute("href") ?? "";
      if (href.startsWith("https://wa.me")) track("contact_whatsapp");
      else if (href.startsWith("tel:")) track("contact_phone");
      else if (href.startsWith("mailto:")) track("contact_email");
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  if (!consented) return null;

  return (
    <>
      {/* ── Google Analytics 4 ─────────────────── */}
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              // Google izin modu v2: varsayılan "reddedildi", kullanıcı bantta kabul ettiği için hemen "verildi".
              gtag('consent', 'default', {
                ad_storage: 'denied', analytics_storage: 'denied',
                ad_user_data: 'denied', ad_personalization: 'denied'
              });
              gtag('consent', 'update', {
                ad_storage: 'granted', analytics_storage: 'granted',
                ad_user_data: 'granted', ad_personalization: 'granted'
              });
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      )}

      {/* ── Meta Pixel ────────────────────────── */}
      {PIXEL_ID && (
        <>
          <Script id="meta-pixel-init" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
          {/* NoScript fallback */}
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}
    </>
  );
}
