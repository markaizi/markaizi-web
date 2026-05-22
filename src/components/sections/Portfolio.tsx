"use client";
import { useState, useEffect, useRef } from "react";

const LOGOS = [
  { name: "NOVA", sub: "Market" },
  { name: "APEX", sub: "Digital" },
  { name: "PULSE", sub: "Studio" },
  { name: "TERRA", sub: "Homes" },
  { name: "ZEST", sub: "Foods" },
  { name: "FIRA", sub: "Wear" },
  { name: "VELO", sub: "Tech" },
  { name: "KODA", sub: "Agency" },
  { name: "LYRA", sub: "Beauty" },
  { name: "ORION", sub: "Group" },
];

const TESTIMONIALS = [
  {
    stars: 5,
    text: "markaizi ile çalışmaya başladıktan sonra Instagram takipçi sayımız 3 ayda %240 arttı. Hem kreatif ekip hem de reklam yönetimi inanılmaz profesyonel.",
    initials: "AK",
    name: "Ayşe Kaya",
    role: "NOVA Market, Kurucu",
  },
  {
    stars: 5,
    text: "Google reklam maliyetlerimizi %40 düşürürken dönüşüm oranımızı ikiye katladılar. Veri odaklı yaklaşımları fark yaratıyor.",
    initials: "MO",
    name: "Mehmet Öztürk",
    role: "APEX Digital, CEO",
  },
  {
    stars: 5,
    text: "Web sitemizi sıfırdan tasarladılar, domain ve hosting işlemlerini de hallettiler. Tek adres olması çok büyük kolaylık sağladı.",
    initials: "ZD",
    name: "Zeynep Demir",
    role: "LYRA Beauty, Genel Müdür",
  },
];

export default function Portfolio() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (i: number) => setCurrent(i);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCurrent((c) => (c + 1) % TESTIMONIALS.length), 5000);
  };

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  // Touch swipe
  const touchStart = useRef(0);

  return (
    <section id="portfolio" className="py-24">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-[680px] mx-auto mb-16 reveal">
          <span className="section-tag">Portföy & Referanslar</span>
          <h2 className="font-black leading-tight mb-4" style={{ fontSize:"clamp(28px,4vw,42px)" }}>
            Güvendikleri <span className="gradient-text">Markalar</span>
          </h2>
          <p className="text-[#8a8a9a] text-[17px]">200&apos;den fazla marka markaizi ile çalışarak dijital hedeflerine ulaştı.</p>
        </div>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-16 reveal">
          {LOGOS.map((l) => (
            <div
              key={l.name}
              className="flex flex-col items-center justify-center py-6 px-4 rounded-xl transition-all duration-300 cursor-default group"
              style={{ background:"var(--surface)", border:"1px solid var(--border)" }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "rgba(168,85,247,0.35)";
                el.style.background = "var(--surface-2)";
                el.style.transform = "translateY(-3px)";
                el.style.boxShadow = "var(--glow-sm)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "var(--border)";
                el.style.background = "var(--surface)";
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "none";
              }}
            >
              <span className="block text-base font-black text-white/25 tracking-tight transition-colors duration-300 group-hover:text-white/90">
                {l.name}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-white/20 group-hover:text-white/50 transition-colors duration-300">
                {l.sub}
              </span>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div
          className="reveal overflow-hidden"
          onTouchStart={(e) => { touchStart.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            const diff = touchStart.current - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
              goTo(diff > 0 ? (current + 1) % TESTIMONIALS.length : (current - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
              resetTimer();
            }
          }}
        >
          <div
            className="testimonial-track"
            style={{ transform:`translateX(-${current * 100}%)` }}
          >
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="testimonial-card rounded-2xl p-10"
                style={{ background:"var(--surface)", border:"1px solid var(--border)" }}
              >
                <div className="text-amber-400 text-[18px] tracking-widest mb-4">
                  {"★".repeat(t.stars)}
                </div>
                <p className="text-[#8a8a9a] text-[17px] leading-[1.8] mb-7 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-[46px] h-[46px] rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ background:"var(--grad)" }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <strong className="block text-[15px] font-bold">{t.name}</strong>
                    <span className="text-[13px] text-[#8a8a9a]">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => { goTo(i); resetTimer(); }}
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: i === current ? "24px" : "8px",
                  background: i === current ? "var(--grad)" : "var(--border)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
