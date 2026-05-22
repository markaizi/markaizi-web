"use client";
const SERVICES = [
  {
    title: "Sosyal Medya Yönetimi",
    desc: "Instagram, Facebook ve TikTok hesaplarınızı profesyonelce yönetiyoruz. Özgün içerikler, tutarlı paylaşım takvimi ve topluluk yönetimi ile takipçi kitlenizi büyütüyoruz.",
    tags: ["Instagram", "Facebook", "TikTok"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" style={{ stroke: "#c084fc" }}>
        <path d="M17 2H7C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5z" strokeWidth="1.5"/>
        <path d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" strokeWidth="1.5"/>
        <circle cx="17.5" cy="6.5" r="1" fill="#c084fc"/>
      </svg>
    ),
  },
  {
    title: "Meta Reklamları",
    desc: "Instagram ve Facebook reklam kampanyalarınızı hedef kitleye en etkili şekilde ulaştırıyoruz. A/B testleri ve detaylı raporlamalarla ROAS'ınızı maksimize ediyoruz.",
    tags: ["Meta Ads", "Retargeting", "Lookalike"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" style={{ stroke: "#c084fc" }}>
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: "TikTok Reklamları",
    desc: "Gen Z ve Millennial kitlelere TikTok Ads Manager ile güçlü şekilde ulaşıyoruz. Viral potansiyeli yüksek reklam kreatifleriyle marka bilinirliğinizi artırıyoruz.",
    tags: ["TikTok Ads", "In-Feed", "TopView"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" style={{ stroke: "#c084fc" }}>
        <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: "Google Reklamları",
    desc: "Google Search, Display ve YouTube kampanyalarıyla potansiyel müşterilerinize tam doğru anda ulaşıyoruz. Akıllı teklif stratejileriyle bütçenizi verimli kullanıyoruz.",
    tags: ["Search Ads", "Display", "YouTube"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" style={{ stroke: "#c084fc" }}>
        <circle cx="11" cy="11" r="8" strokeWidth="1.5"/>
        <path d="M21 21l-4.35-4.35" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M8 11h6M11 8v6" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: "İçerik Üretimi",
    desc: "Markanıza özel görsel tasarımlar, profesyonel video içerikler ve etkileyici metinler üretiyoruz. Her platform için optimize edilmiş kreatifleri hızla teslim ediyoruz.",
    tags: ["Görsel", "Video", "Metin"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" style={{ stroke: "#c084fc" }}>
        <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" strokeWidth="1.5"/>
        <path d="M14 2v6h6" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M9 13h6M9 17h4" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: "Web Tasarım & Hosting",
    desc: "Markanızı yansıtan modern, hızlı ve mobil uyumlu web siteleri tasarlıyoruz. Domain kaydı ve yüksek performanslı hosting çözümleri ile sitenizi ayağa kaldırıyoruz.",
    tags: ["Web Tasarım", "Domain", "Hosting"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" style={{ stroke: "#c084fc" }}>
        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export default function Services() {
  return (
    <section id="hizmetler" className="py-24">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-[680px] mx-auto mb-16 reveal">
          <span className="section-tag">Hizmetlerimiz</span>
          <h2 className="font-black leading-tight mb-4" style={{ fontSize:"clamp(28px,4vw,42px)" }}>
            Dijital Dünyada <span className="gradient-text">Her Adımda</span> Yanınızdayız
          </h2>
          <p className="text-[#8a8a9a] text-[17px]">
            Markanızı büyütmek için ihtiyacınız olan tüm dijital hizmetleri tek çatı altında sunuyoruz.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="reveal group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 cursor-default"
              style={{
                background:"var(--surface)",
                border:"1px solid var(--border)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "rgba(168,85,247,0.4)";
                el.style.boxShadow = "var(--glow)";
                el.style.transform = "translateY(-6px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "var(--border)";
                el.style.boxShadow = "none";
                el.style.transform = "translateY(0)";
              }}
            >
              {/* Icon */}
              <div
                className="w-[52px] h-[52px] flex items-center justify-center rounded-xl mb-5"
                style={{
                  background:"var(--grad-soft)",
                  border:"1px solid rgba(168,85,247,0.25)",
                }}
              >
                {s.icon}
              </div>
              <h3 className="text-lg font-bold mb-3">{s.title}</h3>
              <p className="text-[14px] text-[#8a8a9a] leading-relaxed mb-5">{s.desc}</p>
              <div className="flex gap-2 flex-wrap">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] font-semibold px-[10px] py-1 rounded-full text-[#c084fc]"
                    style={{
                      background:"rgba(168,85,247,0.1)",
                      border:"1px solid rgba(168,85,247,0.2)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
