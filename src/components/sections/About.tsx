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
              Ankara merkezli markaizi olarak, reklamcılık dünyasına matbaa, baskı, insert ve katalog tasarımı tarafından girdik. 10 yılı aşkın bu birikimi arkamıza alarak artık tamamen dijital pazarlamaya odaklandık; çünkü markaların müşterilerine en hızlı ve ölçülebilir şekilde ulaştığı yer burası.
            </p>
            <p className="text-[#8a8a9a] text-base leading-[1.8] mb-10">
              Bugün sosyal medya yönetiminden Google ve Meta reklamlarına, yapay zeka destekli içerik üretimine kadar her adımda yanınızdayız. Veri odaklı kararlar, şeffaf raporlama ve aktif yapay zeka araçlarıyla markanızı dijitalde zirveye taşıyoruz.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {STATS.map((s) => (
                <CounterStat key={s.label} {...s} />
              ))}
            </div>
          </div>

          {/* Sağ */}
          <div className="reveal">
            {/* Gradient border card */}
            <div className="p-[3px] rounded-2xl" style={{ background:"var(--grad)" }}>
              <div className="rounded-[calc(1rem-3px)] p-10" style={{ background:"var(--surface)" }}>
                <div className="flex gap-3 mb-6">
                  {[
                    <svg key="a" viewBox="0 0 24 24" fill="none" className="w-5 h-5" style={{ stroke:"#c084fc" }}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
                    <svg key="b" viewBox="0 0 24 24" fill="none" className="w-5 h-5" style={{ stroke:"#c084fc" }}><path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
                    <svg key="c" viewBox="0 0 24 24" fill="none" className="w-5 h-5" style={{ stroke:"#c084fc" }}><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
                  ].map((icon, i) => (
                    <div
                      key={i}
                      className="w-11 h-11 flex items-center justify-center rounded-xl"
                      style={{ background:"var(--grad-soft)", border:"1px solid rgba(168,85,247,0.25)" }}
                    >
                      {icon}
                    </div>
                  ))}
                </div>
                <h3 className="text-[20px] font-bold mb-5">Neden markaizi?</h3>
                <ul className="flex flex-col gap-3.5">
                  {[
                    "Veri odaklı strateji",
                    "Aylık şeffaf raporlama",
                    "Hızlı yanıt & destek",
                    "Sonuç garantisi",
                    "Özel hesap yöneticisi",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-[15px] text-[#8a8a9a]">
                      <span
                        className="inline-flex w-5 h-5 items-center justify-center rounded-full text-[10px] flex-shrink-0"
                        style={{ background:"var(--grad)" }}
                      >
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
