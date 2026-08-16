"use client";
import Image from "next/image";

const PLATFORM_ICONS = [
  {
    label: "Instagram",
    delay: "0s",
    style: { top: "12%", left: "19%" },
    svg: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" style={{ stroke: "#c084fc" }}>
        <path d="M17 2H7C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5z" strokeWidth="1.5"/>
        <path d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" strokeWidth="1.5"/>
        <circle cx="17.5" cy="6.5" r="1" fill="#c084fc"/>
      </svg>
    ),
  },
  {
    label: "TikTok",
    delay: "0.7s",
    style: { top: "10%", right: "17%" },
    svg: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" style={{ stroke: "#c084fc" }}>
        <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: "Facebook",
    delay: "1.4s",
    style: { bottom: "14%", left: "18%" },
    svg: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" style={{ stroke: "#c084fc" }}>
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: "Google Ads",
    delay: "2.1s",
    style: { bottom: "13%", right: "16%" },
    svg: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" style={{ stroke: "#c084fc" }}>
        <circle cx="11" cy="11" r="8" strokeWidth="1.5"/>
        <path d="M21 21l-4.35-4.35" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M8 11h6M11 8v6" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "YouTube",
    delay: "2.8s",
    style: { top: "42%", right: "15%" },
    svg: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" style={{ stroke: "#c084fc" }}>
        <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: "Meta Ads",
    delay: "3.5s",
    style: { top: "42%", left: "18%" },
    svg: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" style={{ stroke: "#c084fc" }}>
        <path d="M4 4l4.5 8L4 20h2.5l3-6 3 6H15l-4.5-8L15 4h-2.5l-3 6-3-6H4z" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center relative overflow-hidden"
      style={{ padding: "100px 0 80px", minHeight: "100dvh" }}
    >
      {/* Orbs */}
      {[
        { style: { width:600,height:600, background:"radial-gradient(circle,rgba(124,58,237,0.25) 0%,transparent 70%)", top:-200, left:-100, animationDelay:"0s" } },
        { style: { width:500,height:500, background:"radial-gradient(circle,rgba(236,72,153,0.2) 0%,transparent 70%)", top:100, right:-150, animationDelay:"3s" } },
        { style: { width:400,height:400, background:"radial-gradient(circle,rgba(168,85,247,0.15) 0%,transparent 70%)", bottom:-100, left:"40%", animationDelay:"6s" } },
      ].map((o, i) => (
        <div key={i} className="absolute rounded-full pointer-events-none"
          style={{ filter:"blur(80px)", animation:"float 8s ease-in-out infinite", ...o.style }} />
      ))}

      <div className="max-w-[1200px] mx-auto px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-[45%_55%] gap-8 items-center">

        {/* ── Sol: İçerik ── */}
        <div className="text-center lg:text-left">
          <div className="hero-badge inline-flex items-center gap-2 text-[13px] font-medium text-[#c084fc] px-[18px] py-2 rounded-full mb-9"
            style={{ background:"rgba(124,58,237,0.12)", border:"1px solid rgba(124,58,237,0.3)" }}
          >
            ✦ Dijital Büyüme Ortağınız
          </div>

          <h1 className="hero-h1 font-black leading-[1.1] tracking-tight mb-8"
            style={{ fontSize:"clamp(32px,3.8vw,46px)", letterSpacing:"-1.5px" }}
          >
            <span style={{ display:"block", whiteSpace:"nowrap" }}>
              Markanızı <span className="gradient-text">Dijitalde</span>
            </span>
            <span style={{ display:"block" }}>Zirveye Taşıyoruz</span>
          </h1>

          <p className="hero-sub text-[#8a8a9a] mx-auto lg:mx-0 max-w-[520px] mb-16 leading-relaxed"
            style={{ fontSize:"clamp(16px,1.4vw,17px)" }}
          >
            Siteler&apos;in mobilya mağazalarından kliniklere, Ankara&apos;nın yerel işletmelerinden e-ticarete — sosyal medya yönetimi, Google reklamları, içerik üretimi ve web tasarımda her adımda yanınızdayız.
          </p>

          <div className="hero-cta flex flex-wrap gap-5 mb-6 justify-center lg:justify-start">
            <a href="#iletisim" className="btn btn-primary">Ücretsiz Teklif Al</a>
            <a href="#portfolio" className="btn btn-outline">Çalışmalarımızı Gör</a>
          </div>
          <div className="hero-cta flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-[#8a8a9a] justify-center lg:justify-start">
            <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> 24 saatte dönüş</span>
            <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> Taahhüt yok</span>
            <a href="tel:+905520772700" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <span className="text-[#c084fc]">📞</span> +90 (552) 077 27 00
            </a>
          </div>
        </div>

        {/* ── Sağ: Hero Görseli + Platform İkonları ── */}
        <div className="hidden lg:flex items-center justify-center relative" style={{ minHeight: 560 }}>
          {/* Glow arkası */}
          <div className="absolute pointer-events-none rounded-full" style={{
            width: 600, height: 600,
            background: "radial-gradient(circle, rgba(124,58,237,0.22) 0%, rgba(236,72,153,0.12) 50%, transparent 70%)",
            filter: "blur(70px)",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
          }} />

          {/* Görsel — sabit */}
          <div className="relative z-10 w-full">
            <Image
              src="/herobanner.webp"
              alt="Dijital Pazarlama"
              width={800}
              height={533}
              priority
              style={{
                width: "100%",
                maxWidth: 800,
                height: "auto",
                WebkitMaskImage: "radial-gradient(ellipse 90% 88% at 58% 50%, black 38%, transparent 100%)",
                maskImage: "radial-gradient(ellipse 90% 88% at 58% 50%, black 38%, transparent 100%)",
                filter: "drop-shadow(0 8px 50px rgba(168,85,247,0.3)) drop-shadow(0 0 20px rgba(124,58,237,0.2))",
              }}
            />
          </div>

          {/* Platform İkonları */}
          {PLATFORM_ICONS.map((icon) => (
            <div
              key={icon.label}
              className="absolute z-20 flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{
                ...icon.style,
                background: "rgba(12,12,22,0.88)",
                border: "1px solid rgba(168,85,247,0.28)",
                WebkitBackdropFilter: "blur(12px)", backdropFilter: "blur(12px)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.35), 0 0 10px rgba(168,85,247,0.08)",
                animation: "floatIcon 4s ease-in-out infinite",
                animationDelay: icon.delay,
              }}
            >
              {icon.svg}
              <span className="text-[11px] font-semibold text-white/70 whitespace-nowrap">{icon.label}</span>
            </div>
          ))}
        </div>

        {/* ── Tablet: Platform İkonları (dekoratif) ── */}
        {/* Sağ görsel bloğu yalnızca lg:'de göründüğü için tablette hero çok yalın kalıyordu — 640-1023px arası bu şeritle dolduruluyor. */}
        <div className="hidden sm:flex lg:hidden flex-wrap items-center justify-center gap-3">
          {PLATFORM_ICONS.map((icon) => (
            <div
              key={icon.label}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
              style={{
                background: "rgba(12,12,22,0.88)",
                border: "1px solid rgba(168,85,247,0.28)",
                WebkitBackdropFilter: "blur(12px)", backdropFilter: "blur(12px)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.35), 0 0 10px rgba(168,85,247,0.08)",
                animation: "floatIcon 4s ease-in-out infinite",
                animationDelay: icon.delay,
              }}
            >
              {icon.svg}
              <span className="text-[12px] font-semibold text-white/70 whitespace-nowrap">{icon.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Göstergesi */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[26px] h-[42px] flex justify-center pt-[7px] rounded-full"
        style={{ border:"2px solid rgba(255,255,255,0.2)" }}
      >
        <div className="scroll-dot w-1 h-2 rounded-sm" style={{ background:"var(--grad)" }} />
      </div>
    </section>
  );
}
