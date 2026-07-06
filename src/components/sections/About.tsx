"use client";
import { useEffect, useRef } from "react";

const STATS = [
  { target: 200, suffix: "+", label: "Mutlu Müşteri" },
  { target: 10,  suffix: "+", label: "Yıl Deneyim" },
  { target: 850, suffix: "+", label: "Kampanya" },
  { target: 94,  suffix: "%", label: "Memnuniyet" },
];

function useCounter(ref: React.RefObject<HTMLElement | null>, target: number) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const duration = 1800;
        const start = performance.now();
        const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          el.textContent = String(Math.round(easeOut(p) * target));
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = String(target);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, target]);
}

function CounterStat({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const ref = useRef<HTMLElement>(null);
  useCounter(ref, target);
  return (
    <div
      className="text-center rounded-xl p-5"
      style={{ background:"var(--surface)", border:"1px solid var(--border)" }}
    >
      <div className="flex items-baseline justify-center gap-0.5">
        <strong ref={ref as React.RefObject<HTMLElement>} className="text-[30px] font-black gradient-text">0</strong>
        <span className="text-[22px] font-black gradient-text">{suffix}</span>
      </div>
      <p className="text-[12px] text-[#8a8a9a] mt-1">{label}</p>
    </div>
  );
}

export default function About() {
  return (
    <section id="hakkimizda" className="py-24" style={{ background:"var(--bg-alt)" }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Sol */}
          <div className="reveal">
            <span className="section-tag">Hakkımızda</span>
            <h2 className="font-black leading-tight mb-5 mt-3 text-white" style={{ fontSize:"clamp(28px,3.5vw,40px)" }}>
              Dijital Başarı İçin <span style={{ color: "#c084fc" }}>Doğru Adres</span>
            </h2>
            <p className="text-[#8a8a9a] text-base leading-[1.8] mb-4">
              Ankara merkezli markaizi olarak, reklamcılık dünyasına Siteler&apos;de matbaa, baskı, insert ve katalog tasarımıyla girdik. Mobilya sektörünün kalbinde geçen 10 yılı aşkın bu birikimi arkamıza alarak artık tamamen dijital pazarlamaya odaklandık; çünkü markaların müşterilerine en hızlı ve ölçülebilir şekilde ulaştığı yer burası.
            </p>
            <p className="text-[#8a8a9a] text-base leading-[1.8]">
              Bugün sosyal medya yönetiminden Google ve Meta reklamlarına, yapay zeka destekli içerik üretimine kadar her adımda yanınızdayız. Veri odaklı kararlar, şeffaf raporlama ve aktif yapay zeka araçlarıyla markanızı dijitalde zirveye taşıyoruz.
            </p>
          </div>

          {/* Sağ — İstatistik Kartları */}
          <div className="reveal grid grid-cols-2 gap-5">
            {STATS.map((s) => (
              <CounterStat key={s.label} {...s} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
