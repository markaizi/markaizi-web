import Link from "next/link";

const SERVICES = [
  {
    title: "Sosyal Medya Yönetimi",
    desc: "Instagram, Facebook ve TikTok hesaplarınızı profesyonelce yönetiyoruz. Özgün içerikler, tutarlı paylaşım takvimi ve topluluk yönetimi ile takipçi kitlenizi büyütüyoruz.",
    tags: ["Instagram", "Facebook", "TikTok"],
    href: "/hizmetler/sosyal-medya-yonetimi",
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
    href: "/hizmetler/meta-reklamlari",
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
    href: "/hizmetler/tiktok-reklamlari",
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
    href: "/hizmetler/google-reklamlari",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" style={{ stroke: "#c084fc" }}>
        <circle cx="11" cy="11" r="8" strokeWidth="1.5"/>
        <path d="M21 21l-4.35-4.35" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M8 11h6M11 8v6" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: "Yapay Zeka & Otomasyon",
    desc: "Yapay zeka ile görseller, reklam filmleri ve videolar üretiyoruz. AI destekli otomasyon araçlarıyla içerik süreçlerinizi hızlandırıyor, kampanyalarınızı akıllı hale getiriyoruz.",
    tags: ["AI Görsel", "AI Video", "Reklam Filmi"],
    href: "/hizmetler/yapay-zeka-otomasyon",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" style={{ stroke: "#c084fc" }}>
        <path d="M12 2a2 2 0 012 2v1a2 2 0 01-2 2 2 2 0 01-2-2V4a2 2 0 012-2z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 7v3" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M8.5 9.5L6 7" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M15.5 9.5L18 7" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M5 13a7 7 0 0014 0" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M8 17.5l-2 2.5" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M16 17.5l2 2.5" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M10 20h4" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: "Web Tasarım & Hosting",
    desc: "Markanızı yansıtan modern, hızlı ve mobil uyumlu web siteleri tasarlıyoruz. Domain kaydı ve yüksek performanslı hosting çözümleri ile sitenizi ayağa kaldırıyoruz.",
    tags: ["Web Tasarım", "Domain", "Hosting"],
    href: "/hizmetler/web-tasarim-hosting",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" style={{ stroke: "#c084fc" }}>
        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export default function Services() {
  return (
    <section id="hizmetler" className="py-24" style={{
      backgroundColor: "#0c0c16",
      backgroundImage: "linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)",
      backgroundSize: "44px 44px",
    }}>
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-[680px] mx-auto mb-16 reveal">
          <span className="section-tag">Hizmetlerimiz</span>
          <h2 className="font-black leading-tight mb-4" style={{ fontSize: "clamp(28px,4vw,42px)" }}>
            Dijital Dünyada <span className="gradient-text">Her Adımda</span> Yanınızdayız
          </h2>
          <p className="text-[#8a8a9a] text-[17px]">
            Markanızı büyütmek için ihtiyacınız olan tüm dijital hizmetleri tek çatı altında sunuyoruz.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s) => (
            <Link
              key={s.title}
              href={s.href}
              className="service-card reveal group relative overflow-hidden rounded-2xl p-8 block"
              style={{ background: "var(--surface)", textDecoration: "none" }}
            >
              {/* Icon */}
              <div
                className="w-[52px] h-[52px] flex items-center justify-center rounded-xl mb-5"
                style={{ background: "var(--grad-soft)", border: "1px solid rgba(168,85,247,0.25)" }}
              >
                {s.icon}
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">{s.title}</h3>
              <p className="text-[14px] text-[#8a8a9a] leading-relaxed mb-5">{s.desc}</p>
              <div className="flex gap-2 flex-wrap mb-5">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[12px] font-semibold px-[10px] py-1 rounded-full text-[#c084fc]"
                    style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              {/* Detay linki */}
              <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[#c084fc] transition-all duration-200 group-hover:gap-2.5">
                Detayları Gör
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
