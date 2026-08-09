"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      // Short delay so it doesn't pop instantly on first load
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "all");
    window.dispatchEvent(new Event("cookie-consent-change"));
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem("cookie_consent", "essential");
    window.dispatchEvent(new Event("cookie-consent-change"));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="cookie-banner fixed bottom-0 left-0 right-0 z-[9999] px-4 pb-4 md:px-6 md:pb-6 pointer-events-none"
    >
      <div
        className="max-w-[900px] mx-auto rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 pointer-events-auto"
        style={{
          background: "var(--surface-2)",
          border: "1px solid rgba(168,85,247,0.3)",
          boxShadow: "0 -4px 40px rgba(0,0,0,0.6), var(--glow-sm)",
        }}
      >
        {/* Icon */}
        <div
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ background: "var(--grad-soft)", border: "1px solid rgba(168,85,247,0.25)" }}
        >
          🍪
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-[14px] text-white font-semibold mb-1">Çerez Politikası</p>
          <p className="text-[13px] text-[#8a8a9a] leading-[1.6]">
            Deneyiminizi geliştirmek, trafik analizi yapmak ve reklam etkinliğini ölçmek
            için çerezler kullanıyoruz.{" "}
            <Link href="/cerez-politikasi" className="text-[#c084fc] underline underline-offset-2 hover:text-white transition-colors">
              Çerez Politikası
            </Link>
            {" "}ve{" "}
            <Link href="/gizlilik-politikasi" className="text-[#c084fc] underline underline-offset-2 hover:text-white transition-colors">
              Gizlilik Politikası
            </Link>
            &apos;nı inceleyin.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={reject}
            className="px-4 py-2 text-[13px] font-semibold rounded-full transition-all"
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              color: "#8a8a9a",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(168,85,247,0.4)";
              (e.currentTarget as HTMLElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
              (e.currentTarget as HTMLElement).style.color = "#8a8a9a";
            }}
          >
            Sadece Zorunlu
          </button>
          <button
            onClick={accept}
            className="px-5 py-2 text-[13px] font-semibold rounded-full text-white transition-all"
            style={{ background: "var(--grad)", boxShadow: "var(--glow-sm)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "var(--glow)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "var(--glow-sm)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            Tümünü Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
}
