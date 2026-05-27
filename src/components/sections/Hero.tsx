"use client";

const HV_ICONS = [
  {
    pos: "hv-pos-1",
    style: { top: "20px", left: "50%", transform: "translateX(-50%)" },
    delay: "0s",
    label: "Instagram",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" style={{ stroke: "#c084fc" }}>
        <path d="M17 2H7C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5z" strokeWidth="1.5"/>
        <path d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" strokeWidth="1.5"/>
        <circle cx="17.5" cy="6.5" r="1" fill="#c084fc"/>
      </svg>
    ),
  },
  {
    pos: "hv-pos-2",
    style: { top: "90px", right: "20px" },
    delay: "0.6s",
    label: "TikTok",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" style={{ stroke: "#c084fc" }}>
        <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    pos: "hv-pos-3",
    style: { bottom: "90px", right: "20px" },
    delay: "1.2s",
    label: "Google Ads",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" style={{ stroke: "#c084fc" }}>
        <circle cx="11" cy="11" r="8" strokeWidth="1.5"/>
        <path d="M21 21l-4.35-4.35" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M8 11h6M11 8v6" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    pos: "hv-pos-4",
    style: { bottom: "20px", left: "50%", transform: "translateX(-50%)" },
    delay: "1.8s",
    label: "Meta Ads",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" style={{ stroke: "#c084fc" }}>
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    pos: "hv-pos-5",
    style: { bottom: "90px", left: "20px" },
    delay: "2.4s",
    label: "Analitik",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" style={{ stroke: "#c084fc" }}>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    pos: "hv-pos-6",
    style: { top: "90px", left: "20px" },
    delay: "3s",
    label: "İçerik",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" style={{ stroke: "#c084fc" }}>
        <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" strokeWidth="1.5"/>
        <path d="M14 2v6h6" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M9 13h6M9 17h4" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center relative overflow-hidden"
      style={{ padding: "120px 0 80px" }}
    >
      {/* Orbs */}
      {[
        { cls: "orb-1", style: { width:600,height:600, background:"radial-gradient(circle,rgba(124,58,237,0.25) 0%,transparent 70%)", top:-200, left:-100, animationDelay:"0s" } },
        { cls: "orb-2", style: { width:500,height:500, background:"radial-gradient(circle,rgba(236,72,153,0.2) 0%,transparent 70%)", top:100, right:-150, animationDelay:"3s" } },
        { cls: "orb-3", style: { width:400,height:400, background:"radial-gradient(circle,rgba(168,85,247,0.15) 0%,transparent 70%)", bottom:-100, left:"40%", animationDelay:"6s" } },
      ].map((o) => (
        <div
          key={o.cls}
          className="absolute rounded-full pointer-events-none"
          style={{ filter:"blur(80px)", animation:"float 8s ease-in-out infinite", ...o.style }}
        />
      ))}

      <div className="max-w-[1200px] mx-auto px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-10 items-center">

        {/* ── Sol: İçerik ── */}
        <div>
          <div className="hero-badge inline-flex items-center gap-2 text-[13px] font-medium text-[#c084fc] px-[18px] py-2 rounded-full mb-7"
            style={{ background:"rgba(124,58,237,0.12)", border:"1px solid rgba(124,58,237,0.3)" }}
          >
            ✦ Dijital Büyüme Ortağınız
          </div>

          <h1 className="hero-h1 font-black leading-[1.1] tracking-tight mb-6"
            style={{ fontSize:"clamp(38px,6vw,72px)", letterSpacing:"-1.5px" }}
          >
            Markanızı <span className="gradient-text">Dijitalde</span>
            <br />Zirveye Taşıyoruz
          </h1>

          <p className="hero-sub text-[#8a8a9a] max-w-[560px] mb-10 leading-relaxed"
            style={{ fontSize:"clamp(16px,2vw,19px)" }}
          >
            Sosyal medya yönetiminden Google reklamlarına, içerik üretiminden web tasarıma kadar markanızın her dijital adımında yanınızdayız.
          </p>

          <div className="hero-cta flex flex-wrap gap-4 mb-4">
            <a href="#iletisim" className="btn btn-primary">Ücretsiz Teklif Al</a>
            <a href="#portfolio" className="btn btn-outline">Çalışmalarımızı Gör</a>
          </div>
          <div className="hero-cta flex flex-wrap items-center gap-x-5 gap-y-2 mb-10 text-[13px] text-[#8a8a9a]">
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

          <div className="hero-stats flex items-center gap-8 flex-wrap">
            {[
              { value: "200+", label: "Mutlu Müşteri" },
              { divider: true },
              { value: "5+",   label: "Yıl Deneyim" },
              { divider: true },
              { value: "%94",  label: "Müşteri Memnuniyeti" },
            ].map((s, i) =>
              s.divider ? (
                <div key={i} className="w-px h-10" style={{ background:"var(--border)" }} />
              ) : (
                <div key={i} className="text-center">
                  <strong className="block text-[28px] font-black">{s.value}</strong>
                  <span className="text-[13px] text-[#8a8a9a]">{s.label}</span>
                </div>
              )
            )}
          </div>
        </div>

        {/* ── Sağ: Animasyonlu İkonlar (yalnızca lg+) ── */}
        <div className="hero-visual hidden lg:block relative w-[480px] h-[480px]">
          {/* Dönen Halkalar */}
          <div className="hv-ring" />
          <div className="hv-ring hv-ring-2" />

          {/* Hizmet İkonları */}
          {HV_ICONS.map((icon) => (
            <div
              key={icon.label}
              className={`hv-icon absolute flex flex-col items-center gap-1.5`}
              style={{ "--delay": icon.delay, ...icon.style } as unknown as React.CSSProperties}
            >
              <div
                className="w-14 h-14 flex items-center justify-center rounded-2xl"
                style={{
                  background:"rgba(15,15,20,0.9)",
                  border:"1px solid rgba(168,85,247,0.35)",
                  boxShadow:"0 0 20px rgba(168,85,247,0.2),inset 0 1px 0 rgba(255,255,255,0.05)",
                  backdropFilter:"blur(10px)",
                }}
              >
                {icon.svg}
              </div>
              <span className="text-[11px] font-semibold text-white/50 whitespace-nowrap">{icon.label}</span>
            </div>
          ))}

          {/* Merkez */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
            <div
              className="hv-center-glow absolute w-[100px] h-[100px] rounded-full"
              style={{ background:"radial-gradient(circle,rgba(168,85,247,0.35) 0%,transparent 70%)", filter:"blur(12px)" }}
            />
            <span className="relative text-[20px] font-black tracking-tight">
              marka<b className="gradient-text">izi</b>
            </span>
          </div>

          {/* Metrik Kartlar */}
          <div
            className="hv-metric absolute rounded-xl px-4 py-2.5"
            style={{
              top:"140px", right:"-10px", "--delay":"0.3s",
              background:"rgba(15,15,20,0.92)",
              border:"1px solid rgba(168,85,247,0.25)",
              backdropFilter:"blur(12px)",
              boxShadow:"0 4px 24px rgba(0,0,0,0.4),0 0 12px rgba(168,85,247,0.1)",
            } as React.CSSProperties}
          >
            <div className="text-[10px] text-[#8a8a9a] font-medium mb-0.5">↑ Etkileşim Oranı</div>
            <div className="text-lg font-black gradient-text">+%247</div>
          </div>

          <div
            className="hv-metric absolute rounded-xl px-4 py-2.5"
            style={{
              bottom:"140px", left:"-10px", "--delay":"1.5s",
              background:"rgba(15,15,20,0.92)",
              border:"1px solid rgba(168,85,247,0.25)",
              backdropFilter:"blur(12px)",
              boxShadow:"0 4px 24px rgba(0,0,0,0.4),0 0 12px rgba(168,85,247,0.1)",
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
        <div
          className="scroll-dot w-1 h-2 rounded-sm"
          style={{ background:"var(--grad)" }}
        />
      </div>
    </section>
  );
}
