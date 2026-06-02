const PLANS = [
  {
    name: "Başlangıç",
    slug: "baslangic",
    price: "19.900",
    desc: "Sosyal medyaya ilk adımını atmak isteyen işletmeler için.",
    featured: false,
    features: [
      { ok: true, text: "Instagram ve Facebook Yönetimi" },
      { ok: true, text: "Meta Ads Yönetimi" },
      { ok: true, text: "Ayda 10 Reels Video İçeriği" },
      { ok: true, text: "Özel Gün Story ve Post Tasarımları" },
      { ok: true, text: "Ayda 2 Çekim Günü" },
      { ok: true, text: "Aylık Performans Raporlaması" },
    ],
  },
  {
    name: "Büyüme",
    slug: "buyume",
    price: "29.900",
    desc: "Hızlı büyümek isteyen markalar için çok kanallı paket.",
    featured: true,
    features: [
      { ok: true, text: "Instagram, Facebook ve TikTok Yönetimi" },
      { ok: true, text: "Gelişmiş Meta Ads Yönetimi" },
      { ok: true, text: "Ayda 15 Reels Video İçeriği" },
      { ok: true, text: "Özel Gün Story ve Post Tasarımları" },
      { ok: true, text: "Ayda 4 Çekim Günü" },
      { ok: true, text: "15 Günde Bir Performans Raporlaması" },
      { ok: true, text: "Google İşletme Profili Yönetimi" },
      { ok: true, text: "Google Ads Yönetimi" },
    ],
  },
  {
    name: "Kurumsal",
    slug: "kurumsal",
    price: "39.900",
    desc: "Dijital varlığını güçlendirmek isteyen kurumsal markalar için.",
    featured: false,
    features: [
      { ok: true, text: "Instagram, Facebook ve TikTok Yönetimi" },
      { ok: true, text: "Gelişmiş Meta Ads Yönetimi" },
      { ok: true, text: "Ayda 30 Reels Video İçeriği" },
      { ok: true, text: "Özel Gün Story ve Post Tasarımları" },
      { ok: true, text: "Ayda 5 Çekim Günü" },
      { ok: true, text: "Haftalık Performans Raporlaması" },
      { ok: true, text: "Google İşletme Profili Yönetimi" },
      { ok: true, text: "Gelişmiş Google Ads Yönetimi" },
      { ok: true, text: "Kurumsal Web Sitesi Kurulumu" },
      { ok: true, text: "1 Yıl Ücretsiz Hosting ve Domain" },
    ],
  },
  {
    name: "Elite",
    slug: "elite",
    price: "54.900",
    desc: "Tüm dijital kanalları kapsayan, SEO ve yapay zeka entegrasyonlu tam paket.",
    featured: false,
    features: [
      { ok: true, text: "Instagram, Facebook ve TikTok Yönetimi" },
      { ok: true, text: "Gelişmiş Meta Ads Yönetimi" },
      { ok: true, text: "Ayda 40 Reels Video İçeriği" },
      { ok: true, text: "Özel Gün Story ve Post Tasarımları" },
      { ok: true, text: "Ayda 6 Çekim Günü" },
      { ok: true, text: "Haftalık Performans Raporlaması" },
      { ok: true, text: "Google İşletme Profili Yönetimi" },
      { ok: true, text: "Gelişmiş Google Ads Yönetimi" },
      { ok: true, text: "Gelişmiş Web Sitesi Kurulumu" },
      { ok: true, text: "1 Yıl Ücretsiz Hosting ve Domain" },
      { ok: true, text: "Web Sitesi Yönetimi ve İçerik Güncellemeleri" },
      { ok: true, text: "Teknik SEO ve Sayfa İçi SEO Çalışmaları" },
      { ok: true, text: "Yapay Zekâ ve Otomasyon Entegrasyonları" },
    ],
  },
];

export default function Pricing() {
  return (
    <section id="fiyatlar" className="py-24" style={{ background: "var(--bg-alt)" }}>
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-[680px] mx-auto mb-16 reveal">
          <span className="section-tag">Sosyal Medya Paketleri</span>
          <h2 className="font-black leading-tight mb-4 text-white" style={{ fontSize: "clamp(28px,4vw,42px)" }}>
            Aylık Sosyal Medya <span style={{ color: "#c084fc" }}>Yönetim Paketleri</span>
          </h2>
          <p className="text-[#8a8a9a] text-[17px]">
            İçerik üretiminden reklam yönetimine, çekim gününden raporlamaya — ihtiyacınıza göre paket seçin.
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
        {plan.featured ? "Hemen Başla" : "Başla"}
      </a>
    </>
  );
}
