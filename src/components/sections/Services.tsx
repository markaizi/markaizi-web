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
    // Meta'nın şerit/sonsuzluk markası. Önceden burada Facebook'un "f" harfi
    // vardı — hizmet Instagram + Facebook'u birlikte kapsadığı için yanıltıcıydı.
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" style={{ stroke: "#c084fc" }}>
        <path d="M6.2 8.5c-2 0-3.7 1.6-3.7 3.5s1.7 3.5 3.7 3.5c1.6 0 2.7-1 3.6-2.3l3-4.4c.9-1.3 2-2.3 3.6-2.3 2 0 3.7 1.6 3.7 3.5s-1.7 3.5-3.7 3.5c-1.6 0-2.7-1-3.6-2.3l-3-4.4c-.9-1.3-2-2.3-3.6-2.3z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
    // Google Ads markası: iki açılı çubuk + daire. Önceden içinde artı olan
    // bir büyüteç vardı, yani standart "yakınlaştır" simgesi.
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" style={{ stroke: "#c084fc" }}>
        <path d="M10.6 3.4L18 16.2" strokeWidth="2.6" strokeLinecap="round"/>
        <path d="M13.4 3.4L6.9 14.6" strokeWidth="2.6" strokeLinecap="round"/>
        <circle cx="6.4" cy="18.2" r="2.4" strokeWidth="1.6"/>
      </svg>
    ),
  },
  {
    title: "Yapay Zeka & Otomasyon",
    desc: "Yapay zeka ile görseller, reklam filmleri ve videolar üretiyoruz. AI destekli otomasyon araçlarıyla içerik süreçlerinizi hızlandırıyor, kampanyalarınızı akıllı hale getiriyoruz.",
    tags: ["AI Görsel", "AI Video", "Reklam Filmi"],
    href: "/hizmetler/yapay-zeka-otomasyon",
    // Yapay zeka için yerleşik simge: parıltı. Önceki çizim tanımsız bir
    // robot/şemsiye karışımı gibi okunuyordu.
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" style={{ stroke: "#c084fc" }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l1.6 4.6L18 9.2l-4.4 1.6L12 15.4l-1.6-4.6L6 9.2l4.4-1.6L12 3z"/>
        <path d="M18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z"/>
      </svg>
    ),
  },
  {
    title: "Web Tasarım & Hosting",
    desc: "Markanızı yansıtan modern, hızlı ve mobil uyumlu web siteleri tasarlıyoruz. Domain kaydı ve yüksek performanslı hosting çözümleri ile sitenizi ayağa kaldırıyoruz.",
    tags: ["Web Tasarım", "Domain", "Hosting"],
    href: "/hizmetler/web-tasarim-hosting",
    // Tarayıcı penceresi. Önceden Heroicons'un "home" (ev) ikonu duruyordu —
    // web tasarım & hosting için anlamsızdı.
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" style={{ stroke: "#c084fc" }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2.5" y="4" width="19" height="16" rx="2.2"/>
        <path d="M2.5 8.8h19"/>
        <path d="M5.6 6.4h.01M8.2 6.4h.01M10.8 6.4h.01"/>
        <path d="M9.6 12.2L7.2 14.4l2.4 2.2M14.4 12.2l2.4 2.2-2.4 2.2"/>
      </svg>
    ),
  },
];

export default function Services() {
  return (
    <section id="hizmetler" className="py-24" style={{
      backgroundColor: "#131320",
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {SERVICES.map((s) => (
            <Link
              key={s.title}
              href={s.href}
              /* flex-col + aşağıdaki mt-auto: açıklama uzunlukları farklı
                 olduğu için etiketler ve "Detayları Gör" satırı kartlar arasında
                 hizasız kalıyordu. Artık hepsi kartın altına sabitleniyor.
                 p-6 sm:p-8: mobilde 32px iç boşluk metin sütununu 263px'e
                 düşürüyordu. */
              className="service-card reveal group relative overflow-hidden rounded-2xl p-6 sm:p-8 flex flex-col"
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
              <div className="mt-auto">
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
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="reveal text-center">
          <Link href="/#iletisim" className="btn btn-primary">
            Ücretsiz Danışmanlık Al →
          </Link>
        </div>
      </div>
    </section>
  );
}
