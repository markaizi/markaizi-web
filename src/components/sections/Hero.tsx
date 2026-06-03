"use client";
import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center relative overflow-hidden"
      style={{ padding: "100px 0 80px" }}
    >
      {/* Orbs */}
      {[
        { style: { width:600,height:600, background:"radial-gradient(circle,rgba(124,58,237,0.25) 0%,transparent 70%)", top:-200, left:-100, animationDelay:"0s" } },
        { style: { width:500,height:500, background:"radial-gradient(circle,rgba(236,72,153,0.2) 0%,transparent 70%)", top:100, right:-150, animationDelay:"3s" } },
        { style: { width:400,height:400, background:"radial-gradient(circle,rgba(168,85,247,0.15) 0%,transparent 70%)", bottom:-100, left:"40%", animationDelay:"6s" } },
      ].map((o, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{ filter:"blur(80px)", animation:"float 8s ease-in-out infinite", ...o.style }}
        />
      ))}

      <div className="max-w-[1200px] mx-auto px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-10 items-center">

        {/* ── Sol: İçerik ── */}
        <div>
          <div
            className="hero-badge inline-flex items-center gap-2 text-[13px] font-medium text-[#c084fc] px-[18px] py-2 rounded-full mb-9"
            style={{ background:"rgba(124,58,237,0.12)", border:"1px solid rgba(124,58,237,0.3)" }}
          >
            ✦ Dijital Büyüme Ortağınız
          </div>

          <h1
            className="hero-h1 font-black leading-[1.1] tracking-tight mb-8"
            style={{ fontSize:"clamp(30px,4.5vw,58px)", letterSpacing:"-1.5px" }}
          >
            Markanızı <span className="gradient-text">Dijitalde</span>
            <br />Zirveye Taşıyoruz
          </h1>

          <p
            className="hero-sub text-[#8a8a9a] max-w-[520px] mb-16 leading-relaxed"
            style={{ fontSize:"clamp(14px,1.4vw,16px)" }}
          >
            Sosyal medya yönetiminden Google reklamlarına, içerik üretiminden web tasarıma kadar markanızın her dijital adımında yanınızdayız.
          </p>

          <div className="hero-cta flex flex-wrap gap-5 mb-6">
            <a href="#iletisim" className="btn btn-primary">Ücretsiz Teklif Al</a>
            <a href="#portfolio" className="btn btn-outline">Çalışmalarımızı Gör</a>
          </div>
          <div className="hero-cta flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-[#8a8a9a]">
            <span className="flex items-center gap-1.5">
              <span className="text-green-400">✓</span> 24 saatte dönüş
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-green-400">✓</span> Taahhüt yok
            </span>
            <a href="tel:+905520772700" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <span className="text-[#c084fc]">📞</span> +90 (552) 077 27 00
            </a>
          </div>
        </div>

        {/* ── Sağ: Hero Banner Görseli ── */}
        <div className="hidden lg:flex items-center justify-center relative" style={{ minHeight: 560 }}>
          {/* Glow arkası */}
          <div
            className="absolute pointer-events-none rounded-full"
            style={{
              width: 520, height: 520,
              background: "radial-gradient(circle, rgba(124,58,237,0.22) 0%, rgba(236,72,153,0.12) 50%, transparent 70%)",
              filter: "blur(70px)",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />

          {/* Animasyonlu görsel */}
          <div
            className="relative z-10"
            style={{ animation: "heroFloat 5s ease-in-out infinite" }}
          >
            <Image
              src="/herobanner.png"
              alt="Dijital Pazarlama"
              width={580}
              height={580}
              priority
              style={{
                width: 580,
                height: "auto",
                WebkitMaskImage: "radial-gradient(ellipse 90% 88% at 58% 50%, black 38%, transparent 100%)",
                maskImage: "radial-gradient(ellipse 90% 88% at 58% 50%, black 38%, transparent 100%)",
                filter: "drop-shadow(0 8px 50px rgba(168,85,247,0.3)) drop-shadow(0 0 20px rgba(124,58,237,0.2))",
              }}
            />
          </div>

          {/* Metrik Kartlar */}
          <div
            className="absolute rounded-xl px-4 py-2.5 z-20"
            style={{
              top: "18%", right: "-8px",
              background: "rgba(12,12,22,0.92)",
              border: "1px solid rgba(168,85,247,0.25)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.4), 0 0 12px rgba(168,85,247,0.1)",
              animation: "floatMetric 5s ease-in-out infinite",
              animationDelay: "0.3s",
            } as React.CSSProperties}
          >
            <div className="text-[10px] text-[#8a8a9a] font-medium mb-0.5">↑ Etkileşim Oranı</div>
            <div className="text-lg font-black gradient-text">+%247</div>
          </div>

          <div
            className="absolute rounded-xl px-4 py-2.5 z-20"
            style={{
              bottom: "18%", left: "-8px",
              background: "rgba(12,12,22,0.92)",
              border: "1px solid rgba(168,85,247,0.25)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.4), 0 0 12px rgba(168,85,247,0.1)",
              animation: "floatMetric 5s ease-in-out infinite",
              animationDelay: "1.5s",
            } as React.CSSProperties}
          >
            <div className="text-[10px] text-[#8a8a9a] font-medium mb-0.5">↓ Reklam Maliyeti</div>
            <div className="text-lg font-black gradient-text">-%40</div>
          </div>
        </div>
      </div>

      {/* Scroll Göstergesi */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[26px] h-[42px] flex justify-center pt-[7px] rounded-full"
        style={{ border:"2px solid rgba(255,255,255,0.2)" }}
      >
        <div className="scroll-dot w-1 h-2 rounded-sm" style={{ background:"var(--grad)" }} />
      </div>
    </section>
  );
}
