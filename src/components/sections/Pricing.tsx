const PLANS = [
  {
    name: "Başlangıç",
    price: "19.900",
    desc: "Sosyal medyada ilk adımını atmak isteyen işletmeler için.",
    featured: false,
    features: [
      { ok: true,  text: "Instagram & Facebook yönetimi" },
      { ok: true,  text: "Haftada 3 paylaşım" },
      { ok: true,  text: "10.000 ₺'ye kadar reklam kampanyası yönetimi" },
      { ok: true,  text: "Aylık raporlama" },
      { ok: false, text: "TikTok yönetimi" },
      { ok: false, text: "Google Ads yönetimi" },
      { ok: false, text: "Web sitesi desteği & SEO" },
    ],
  },
  {
    name: "Büyüme",
    price: "29.900",
    desc: "Hızlı büyümek isteyen markalar için çok kanallı paket.",
    featured: true,
    features: [
      { ok: true, text: "Instagram, Facebook & TikTok yönetimi" },
      { ok: true, text: "Haftada 5 paylaşım" },
      { ok: true, text: "50.000 ₺'ye kadar reklam kampanyası yönetimi" },
      { ok: true, text: "Google İşletme yönetimi" },
      { ok: true, text: "Giriş seviye Google Ads yönetimi" },
      { ok: true, text: "Haftalık raporlama" },
      { ok: false, text: "Web sitesi desteği & SEO" },
    ],
  },
  {
    name: "Kurumsal",
    price: "39.900",
    desc: "Dijital varlığını güçlendirmek isteyen kurumsal markalar için.",
    featured: false,
    features: [
      { ok: true, text: "Instagram, Facebook & TikTok yönetimi" },
      { ok: true, text: "Haftada 7 paylaşım" },
      { ok: true, text: "100.000 ₺'ye kadar reklam kampanyası yönetimi" },
      { ok: true, text: "Google İşletme yönetimi" },
      { ok: true, text: "Kapsamlı Google Ads yönetimi" },
      { ok: true, text: "Haftalık raporlama" },
      { ok: false, text: "Web sitesi desteği & SEO" },
    ],
  },
  {
    name: "Elite",
    price: "59.900",
    desc: "Size özel çözümler, web sitesi desteği, SEO avantajları ve tüm paket kapsamı.",
    featured: false,
    features: [
      { ok: true, text: "Tüm platformlar tam yönetim" },
      { ok: true, text: "Haftada 7+ paylaşım" },
      { ok: true, text: "Sınırsız reklam bütçesi yönetimi" },
      { ok: true, text: "Kapsamlı Google Ads & İşletme" },
      { ok: true, text: "Web sitesi tasarım & desteği" },
      { ok: true, text: "SEO optimizasyonu" },
      { ok: true, text: "Özel dijital strateji & danışmanlık" },
    ],
  },
];

export default function Pricing() {
  return (
    <section id="fiyatlar" className="py-24" style={{ background: "var(--bg-alt)" }}>
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-[680px] mx-auto mb-16 reveal">
          <span className="section-tag">Fiyatlandırma</span>
          <h2 className="font-black leading-tight mb-4 text-white" style={{ fontSize: "clamp(28px,4vw,42px)" }}>
            Şeffaf ve <span style={{ color: "#c084fc" }}>Adil Fiyatlar</span>
          </h2>
          <p className="text-[#8a8a9a] text-[17px]">
            Her bütçeye uygun paketlerimizle markanızı dijitalde büyütün. Gizli ücret yok.
          </p>
        </div>

        {/* Cards — 1 kolon mobil, 2 tablet, 4 masaüstü */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {PLANS.map((plan) => (
            <div key={plan.name} className="reveal">
              {plan.featured ? (
                <div className="p-[2px] rounded-2xl h-full" style={{ background: "var(--grad)" }}>
                  <div className="rounded-[calc(1rem-2px)] p-7 h-full flex flex-col" style={{ background: "var(--surface-2)" }}>
                    <PlanContent plan={plan} />
                  </div>
                </div>
              ) : (
                <div
                  className="pricing-card rounded-2xl p-7 h-full flex flex-col"
                  style={{ background: "var(--surface)" }}
                >
                  <PlanContent plan={plan} />
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-[14px] text-[#8a8a9a] mt-8 reveal">
          Fiyatlara KDV dahil değildir. Özel ihtiyaçlarınız için{" "}
          <a href="#iletisim" className="text-[#c084fc] underline underline-offset-2">
            bizimle iletişime geçin
          </a>.
        </p>
      </div>
    </section>
  );
}

type Plan = (typeof PLANS)[number];

function PlanContent({ plan }: { plan: Plan }) {
  return (
    <>
      {plan.featured && (
        <span
          className="inline-block text-[11px] font-bold tracking-wide uppercase text-white px-3.5 py-1 rounded-full mb-4"
          style={{ background: "var(--grad)" }}
        >
          En Popüler
        </span>
      )}
      <div className="text-base font-bold mb-3">{plan.name}</div>
      <div className="flex items-baseline gap-0.5 mb-2">
        <span className="text-[16px] font-semibold text-[#8a8a9a]">₺</span>
        <span className={`text-[38px] font-black leading-none ${plan.featured ? "pricing-featured-amount" : "gradient-text"}`}>
          {plan.price}
        </span>
        <span className="text-[13px] text-[#8a8a9a]">/ay</span>
      </div>
      <p className="text-[13px] text-[#8a8a9a] mb-6 leading-relaxed">{plan.desc}</p>

      <ul className="flex flex-col gap-3 mb-7 flex-1">
        {plan.features.map((f) => (
          <li
            key={f.text}
            className={`flex items-start gap-2.5 text-[13px] leading-snug ${f.ok ? "" : "text-[#8a8a9a]"}`}
          >
            <span
              className="inline-flex w-[18px] h-[18px] items-center justify-center rounded-full text-[9px] flex-shrink-0 mt-0.5"
              style={f.ok ? { background: "var(--grad)" } : { background: "rgba(255,255,255,0.06)", color: "#8a8a9a" }}
            >
              {f.ok ? "✓" : "✗"}
            </span>
            {f.text}
          </li>
        ))}
      </ul>

      <a
        href="#iletisim"
        className={`btn w-full mt-auto text-sm py-3 ${plan.featured ? "btn-primary" : "btn-outline"}`}
      >
        {plan.featured ? "Hemen Başla" : plan.name === "Elite" ? "Teklif Al" : "Teklif Al"}
      </a>
    </>
  );
}
