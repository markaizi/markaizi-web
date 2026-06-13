"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "mkz_worldcup_popup_seen";

export default function WorldCupPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  function close() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      onClick={close}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          background: "#0a0a0f",
          border: "1px solid rgba(168,85,247,0.3)",
          borderRadius: "24px",
          padding: "48px 40px 40px",
          maxWidth: "440px",
          width: "100%",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* Arka plan dekorasyon */}
        <div style={{
          position: "absolute",
          top: "-60px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "280px",
          height: "280px",
          background: "radial-gradient(circle, rgba(227,10,23,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute",
          bottom: "-40px",
          right: "-40px",
          width: "180px",
          height: "180px",
          background: "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Kapat butonu */}
        <button
          onClick={close}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            cursor: "pointer",
            color: "#8a8a9a",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
          }}
          aria-label="Kapat"
        >
          ✕
        </button>

        {/* Türkiye bayrağı + top SVG */}
        <div style={{ marginBottom: "28px", position: "relative", zIndex: 1 }}>
          <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "inline-block" }}>
            {/* Top gövdesi */}
            <circle cx="48" cy="48" r="40" fill="#1a1a24" stroke="rgba(168,85,247,0.4)" strokeWidth="1.5" />
            {/* Top dikişleri */}
            <path d="M48 8 Q58 20 58 48 Q58 76 48 88" stroke="rgba(168,85,247,0.3)" strokeWidth="1.2" fill="none" />
            <path d="M48 8 Q38 20 38 48 Q38 76 48 88" stroke="rgba(168,85,247,0.3)" strokeWidth="1.2" fill="none" />
            <path d="M8 48 Q20 38 48 38 Q76 38 88 48" stroke="rgba(168,85,247,0.3)" strokeWidth="1.2" fill="none" />
            <path d="M8 48 Q20 58 48 58 Q76 58 88 48" stroke="rgba(168,85,247,0.3)" strokeWidth="1.2" fill="none" />
            {/* Türk bayrağı kırmızı ay-yıldız */}
            <circle cx="44" cy="48" r="14" fill="#E30A17" />
            <circle cx="49" cy="48" r="10" fill="#1a1a24" />
            <polygon
              points="60,48 57.2,52 62.2,52.8 58.2,56 60,60 56,57.5 52,60 53.8,56 49.8,52.8 54.8,52"
              fill="#E30A17"
              transform="translate(-2,-8) scale(0.75)"
            />
          </svg>
        </div>

        {/* Üst etiket */}
        <div style={{ marginBottom: "14px", position: "relative", zIndex: 1 }}>
          <span style={{
            display: "inline-block",
            background: "rgba(227,10,23,0.12)",
            border: "1px solid rgba(227,10,23,0.3)",
            borderRadius: "100px",
            padding: "4px 14px",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#ff6b6b",
          }}>
            Dünya Kupası 2026
          </span>
        </div>

        {/* Ana başlık */}
        <h2 style={{
          margin: "0 0 12px",
          fontSize: "28px",
          fontWeight: 900,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          position: "relative",
          zIndex: 1,
          background: "linear-gradient(135deg, #ffffff 30%, #E30A17 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          Tüm Türkiye<br />Tek Yürek
        </h2>

        {/* Alt metin */}
        <p style={{
          margin: "0 0 32px",
          fontSize: "15px",
          color: "#8a8a9a",
          lineHeight: 1.6,
          position: "relative",
          zIndex: 1,
        }}>
          Ay-yıldızlı milli takımımıza Dünya Kupası&apos;nda<br />
          büyük başarılar diliyoruz. 🇹🇷
        </p>

        {/* Buton */}
        <button
          onClick={close}
          style={{
            display: "inline-block",
            background: "#E30A17",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            padding: "13px 36px",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: "0.01em",
            position: "relative",
            zIndex: 1,
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.opacity = "0.88")}
          onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.opacity = "1")}
        >
          Hadi Türkiye! ⚽
        </button>

        {/* Alt imza */}
        <p style={{ margin: "20px 0 0", fontSize: "12px", color: "#555", position: "relative", zIndex: 1 }}>
          markaizi ailesi olarak gurur duyuyoruz
        </p>
      </div>
    </div>
  );
}
