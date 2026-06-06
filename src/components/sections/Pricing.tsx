const BUDGET_NOTE = "Reklam bütçeniz 100.000 ₺ ve üzerinde ise paneldeki iş gücü artacağı için fiyatlarımız değişiklik gösterebilir. Detay için bizimle iletişime geçin.";

const PLANS = [
  {
    name: "Başlangıç",
    slug: "baslangic",
    price: "20.000",
    desc: "Sosyal medyaya ilk adımını atmak isteyen işletmeler için.",
    featured: false,
    features: [
      { ok: true,  text: "Instagram ve Facebook Yönetimi" },
      { ok: true,  text: "Meta Ads Yönetimi" },
      { ok: true,  text: "Ayda 10 İçerik Üretimi" },
      { ok: true,  text: "Özel Gün Story ve Post Tasarımları" },
      { ok: true,  text: "Ayda 2 Çekim Günü" },
    ],
  },
  {
    name: "Büyüme",
    slug: "buyume",
    price: "30.000",
    desc: "Hızlı büyümek isteyen markalar için çok kanallı paket.",
    featured: true,
    features: [
      { ok: true,  text: "Instagram, Facebook ve TikTok Yönetimi" },
      { ok: true,  text: "Gelişmiş Meta Ads Yönetimi", highlight: true },
      { ok: true,  text: "Ayda 15 İçerik Üretimi" },
      { ok: true,  text: "Özel Gün Story ve Post Tasarımları" },
      { ok: true,  text: "Ayda 3 Çekim Günü" },
      { ok: true,  text: "Google İşletme Profili Yönetimi" },
    ],
  },
  {
    name: "Kurumsal",
    slug: "kurumsal",
    price: "40.000",
    desc: "Dijital varlığını güçlendirmek isteyen kurumsal markalar için.",
    featured: false,
    features: [
      { ok: true,  text: "Instagram, Facebook ve TikTok Yönetimi" },
      { ok: true,  text: "Gelişmiş Meta Ads Yönetimi", highlight: true },
      { ok: true,  text: "Ayda 20 İçerik Üretimi" },
      { ok: true,  text: "Özel Gün Story ve Post Tasarımları" },
      { ok: true,  text: "Ayda 4 Çekim Günü" },
      { ok: true,  text: "Google İşletme Profili Yönetimi" },
      { ok: true,  text: "Google Ads Yönetimi", highlight: true },
      { ok: true,  text: "Kurumsal Web Sitesi Kurulumu", highlight: true },
      { ok: true,  text: "1 Yıl Ücretsiz Hosting ve Domain" },
    ],
  },
  {
    name: "Elite",
    slug: "elite",
    price: "60.000",
    desc: "Tüm dijital kanalları kapsayan, SEO ve yapay zeka entegrasyonlu tam paket.",
    featured: false,
    features: [
      { ok: true,  text: "Instagram, Facebook ve TikTok Yönetimi" },
      { ok: true,  text: "Gelişmiş Meta Ads Yönetimi", highlight: true },
      { ok: true,  text: "Ayda 30 İçerik Üretimi" },
      { ok: true,  text: "Özel Gün Story ve Post Tasarımları" },
      { ok: true,  text: "Ayda 4 Çekim Günü" },
      { ok: true,  text: "Google İşletme Profili Yönetimi" },
      { ok: true,  text: "Gelişmiş Google Ads Yönetimi", highlight: true },
      { ok: true,  text: "Gelişmiş Web Sitesi Kurulumu", highlight: true },
      { ok: true,  text: "1 Yıl Ücretsiz Hosting ve Domain" },
      { ok: true,  text: "Web Sitesi Yönetimi ve İçerik Güncellemeleri" },
      { ok: true,  text: "Teknik SEO ve Sayfa İçi SEO Çalışmaları", highlight: true },
      { ok: true,  text: "Yapay Zekâ ve Otomasyon Entegrasyonları", highlight: true },
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

        {/* Alt notlar */}
        <div className="mt-8 space-y-3 reveal">
          <p className="text-center text-[14px] text-[#8a8a9a]">
            Fiyatlara KDV dahil değildir. Özel ihtiyaçlarınız için{" "}
            <a href="#iletisim" className="text-[#c084fc] underline underline-offset-2">
              bizimle iletişime geçin
            </a>.
          </p>
          <p className="text-center text-[13px] text-[#666] max-w-[680px] mx-auto leading-relaxed">
            ⚠ {BUDGET_NOTE}
          </p>
        </div>
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

      <ul className="flex flex-col gap-2.5 mb-7 flex-1">
        {plan.features.map((f) => (
          <li
            key={f.text}
            className={`flex items-start gap-2.5 text-[13px] leading-snug ${f.ok ? "" : "text-[#8a8a9a]"}`}
          >
            {f.highlight ? (
              <span
                className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg"
                style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.28)" }}
              >
                <span
                  className="inline-flex w-[16px] h-[16px] items-center justify-center rounded-full text-[8px] flex-shrink-0"
                  style={{ background: "var(--grad)" }}
                >
                  ✓
                </span>
                <span style={{ color: "#d4a0ff" }}>{f.text}</span>
              </span>
            ) : (
              <>
                <span
                  className="inline-flex w-[18px] h-[18px] items-center justify-center rounded-full text-[9px] flex-shrink-0 mt-0.5"
                  style={f.ok ? { background: "var(--grad)" } : { background: "rgba(255,255,255,0.06)", color: "#8a8a9a" }}
                >
                  {f.ok ? "✓" : "✗"}
                </span>
                {f.text}
              </>
            )}
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
