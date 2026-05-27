import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "markaizi — Dijital Reklam Ajansı";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#050505",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Arka plan orb'ları */}
        <div
          style={{
            position: "absolute",
            top: -200,
            left: -100,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(236,72,153,0.25) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        {/* İçerik */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
            padding: "0 80px",
          }}
        >
          {/* Logo yazı */}
          <div
            style={{
              fontSize: 56,
              fontWeight: 900,
              letterSpacing: "-2px",
              marginBottom: 24,
              background: "linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            markaizi
          </div>

          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#ffffff",
              marginBottom: 16,
              letterSpacing: "-0.5px",
            }}
          >
            Dijital Reklam Ajansı
          </div>

          <div
            style={{
              fontSize: 18,
              color: "#8a8a9a",
              maxWidth: 640,
              lineHeight: 1.6,
            }}
          >
            Sosyal medya yönetimi · Google & Meta reklamları · İçerik üretimi · Web tasarım
          </div>

          {/* Hizmet etiketleri */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 40,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {["Instagram", "Facebook", "TikTok", "Google Ads"].map((tag) => (
              <div
                key={tag}
                style={{
                  padding: "8px 20px",
                  borderRadius: 999,
                  background: "rgba(168,85,247,0.15)",
                  border: "1px solid rgba(168,85,247,0.3)",
                  color: "#c084fc",
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
