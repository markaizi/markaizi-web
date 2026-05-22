"use client";
const PLANS = [
  {
    name: "Başlangıç",
    price: "4.990",
    desc: "Dijital varlığınızı kurmak isteyen küçük işletmeler için.",
    features: [
      { ok: true,  text: "2 sosyal medya platformu yönetimi" },
      { ok: true,  text: "Haftada 3 içerik" },
      { ok: true,  text: "Aylık raporlama" },
      { ok: true,  text: "1 reklam kampanyası" },
      { ok: false, text: "TikTok reklamları" },
      { ok: false, text: "Web tasarım" },
    ],
    featured: false,
  },
  {
    name: "Büyüme",
    price: "9.990",
    desc: "Hızlı büyümek isteyen markalar için kapsamlı paket.",
    features: [
      { ok: true, text: "4 sosyal medya platformu yönetimi" },
      { ok: true, text: "Haftada 7 içerik" },
      { ok: true, text: "Haftalık raporlama" },
      { ok: true, text: "Meta + Google + TikTok reklamları" },
      { ok: true, text: "İçerik üretimi (görsel + video)" },
      { ok: false,text: "Web tasarım" },
    ],
    featured: true,
  },
  {
    name: "Kurumsal",
    price: "19.990",
    desc: "Kapsamlı dijital dönüşüm için tam hizmet paketi.",
    features: [
      { ok: true, text: "Tüm platformlar tam yönetim" },
      { ok: true, text: "Günlük içerik üretimi" },
      { ok: true, text: "Gerçek zamanlı raporlama" },
      { ok: true, text: "Tüm reklam kanalları" },
      { ok: true, text: "Web tasarım & hosting" },
      { ok: true, text: "Özel hesap yöneticisi" },
    ],
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section id="fiyatlar" className="py-24" style={{ background:"var(--bg-alt)" }}>
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-[680px] mx-auto mb-16 reveal">
          <span className="section-tag">Fiyatlandırma</span>
          <h2 className="font-black leading-tight mb-4" style={{ fontSize:"clamp(28px,4vw,42px)" }}>
            Şeffaf ve <span className="gradient-text">Adil Fiyatlar</span>
          </h2>
          <p className="text-[#8a8a9a] text-[17px]">Her bütçeye uygun paketlerimizle markanızı dijitalde büyütün. Gizli ücret yok.</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[900px] mx-auto items-start">
          {PLANS.map((plan) => (
            <div key={plan.name} className="reveal relative">
              {/* Featured: gradient border */}
              {plan.featured ? (
                <div className="p-[2px] rounded-2xl" style={{ background:"var(--grad)" }}>
                  <div className="rounded-[calc(1rem-2px)] p-9" style={{ background:"var(--surface-2)" }}>
                    <PlanContent plan={plan} />
                  </div>
                </div>
              ) : (
                <div
                  className="rounded-2xl p-9 transition-all duration-300"
                  style={{ background:"var(--surface)", border:"1px solid var(--border)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(168,85,247,0.3)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  }}
                >
                  <PlanContent plan={plan} />
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-[14px] text-[#8a8a9a] mt-8 reveal">
          Fiyatlara KDV dahil değildir. Özel ihtiyaçlarınız için{" "}
          <a href="#iletisim" className="text-[#c084fc] underline underline-offset-2">bizimle iletişime geçin</a>.
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
          className="inline-block text-[11px] font-bold tracking-wide uppercase text-white px-3.5 py-1 rounded-full mb-5"
          style={{ background:"var(--grad)" }}
        >
          En Popüler
        </span>
      )}
      <div className="text-lg font-bold mb-4">{plan.name}</div>
      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-[20px] font-semibold text-[#8a8a9a]">₺</span>
        <span
          className={plan.featured ? "pricing-featured-amount text-[48px] font-black leading-none" : "gradient-text text-[48px] font-black leading-none"}
        >
          {plan.price}
        </span>
        <span className="text-[14px] text-[#8a8a9a]">/ay</span>
      </div>
      <p className="text-[14px] text-[#8a8a9a] mb-7">{plan.desc}</p>
      <ul className="flex flex-col gap-3.5 mb-8">
        {plan.features.map((f) => (
          <li key={f.text} className={`flex items-start gap-3 text-[14px] leading-snug ${f.ok ? "" : "text-[#8a8a9a]"}`}>
            <span
              className="inline-flex w-5 h-5 items-center justify-center rounded-full text-[10px] flex-shrink-0 mt-0.5"
              style={f.ok ? { background:"var(--grad)" } : { background:"rgba(255,255,255,0.06)", color:"#8a8a9a" }}
            >
              {f.ok ? "✓" : "✗"}
            </span>
            {f.text}
          </li>
        ))}
      </ul>
      <a
        href="#iletisim"
        className={`btn w-full ${plan.featured ? "btn-primary" : "btn-outline"}`}
      >
        Başla
      </a>
    </>
  );
}
