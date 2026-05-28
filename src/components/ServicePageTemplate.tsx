import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";

export interface PricingPackage {
  name: string;
  price: string | null; // null → "Teklif Al"
  period?: string;
  desc: string;
  features: string[];
  featured?: boolean;
  cta?: string;
}

export interface ServicePageProps {
  title: string;
  subtitle: string;
  description: string[];
  features: { icon: string; title: string; desc: string }[];
  pricing?: PricingPackage[];
  noPricingNote?: string; // fiyat yoksa alt not
  icon: React.ReactNode;
  badge: string;
}

export default function ServicePageTemplate({
  title,
  subtitle,
  description,
  features,
  pricing,
  noPricingNote,
  icon,
  badge,
}: ServicePageProps) {
  return (
    <>
      <Navbar />
      <main>
        {/* ── Hero ── */}
        <section
          className="relative overflow-hidden pt-32 pb-20"
          style={{ background: "var(--bg)" }}
        >
          {/* Orbs */}
          <div
            className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle,rgba(124,58,237,0.2) 0%,transparent 70%)",
              filter: "blur(80px)",
            }}
          />
          <div
            className="absolute top-[50px] right-[-150px] w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle,rgba(236,72,153,0.15) 0%,transparent 70%)",
              filter: "blur(80px)",
            }}
          />

          <div className="max-w-[1200px] mx-auto px-6 relative z-10">
            {/* Geri dön */}
            <Link
              href="/#hizmetler"
              className="inline-flex items-center gap-2 text-[13px] text-[#8a8a9a] hover:text-white transition-colors mb-10 group"
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 transition-transform group-hover:-translate-x-1" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M5 12l7 7M5 12l7-7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Tüm Hizmetler
            </Link>

            <div className="max-w-[760px]">
              <span className="section-tag">{badge}</span>

              {/* Servis ikonu */}
              <div
                className="w-16 h-16 flex items-center justify-center rounded-2xl mb-6 mt-2"
                style={{
                  background: "var(--grad-soft)",
                  border: "1px solid rgba(168,85,247,0.3)",
                  boxShadow: "var(--glow-sm)",
                }}
              >
                {icon}
              </div>

              <h1
                className="font-black leading-tight mb-4"
                style={{ fontSize: "clamp(32px,5vw,56px)", letterSpacing: "-1px" }}
              >
                {title}
              </h1>
              <p className="text-[#8a8a9a] text-[18px] leading-relaxed">{subtitle}</p>
            </div>
          </div>
        </section>

        {/* ── Açıklama ── */}
        <section className="py-16" style={{ background: "var(--bg-alt)" }}>
          <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Sol: metin */}
            <div>
              {description.map((para, i) => (
                <p key={i} className="text-[#8a8a9a] text-[16px] leading-[1.9] mb-5">
                  {para}
                </p>
              ))}
              <a href="#iletisim-cta" className="btn btn-primary mt-4">
                Ücretsiz Danışmanlık Al →
              </a>
            </div>

            {/* Sağ: özellik listesi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-xl p-5"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <div className="text-2xl mb-3">{f.icon}</div>
                  <h3 className="font-bold text-[15px] mb-2">{f.title}</h3>
                  <p className="text-[13px] text-[#8a8a9a] leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Fiyatlandırma ── */}
        {pricing && pricing.length > 0 && (
          <section className="py-20" style={{ background: "var(--bg)" }}>
            <div className="max-w-[1200px] mx-auto px-6">
              <div className="text-center mb-12">
                <h2
                  className="font-black leading-tight"
                  style={{ fontSize: "clamp(26px,3.5vw,38px)" }}
                >
                  <span className="gradient-text">Fiyatlandırma</span>
                </h2>
                <p className="text-[#8a8a9a] mt-3">Gizli ücret yok. Paket seç, hemen başla.</p>
              </div>

              <div
                className={`grid gap-6 mx-auto ${
                  pricing.length === 1
                    ? "max-w-sm"
                    : pricing.length === 2
                    ? "max-w-2xl grid-cols-1 sm:grid-cols-2"
                    : pricing.length === 3
                    ? "max-w-4xl grid-cols-1 sm:grid-cols-3"
                    : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
                }`}
              >
                {pricing.map((p) => (
                  <div key={p.name}>
                    {p.featured ? (
                      <div className="p-[2px] rounded-2xl h-full" style={{ background: "var(--grad)" }}>
                        <div className="rounded-[calc(1rem-2px)] p-8 h-full flex flex-col" style={{ background: "var(--surface-2)" }}>
                          <PricingCard pkg={p} />
                        </div>
                      </div>
                    ) : (
                      <div
                        className="rounded-2xl p-8 h-full flex flex-col"
                        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                      >
                        <PricingCard pkg={p} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Fiyat notu */}
        {noPricingNote && (
          <section className="py-20" style={{ background: "var(--bg)" }}>
            <div className="max-w-[680px] mx-auto px-6 text-center">
              <div
                className="rounded-2xl p-10"
                style={{ background: "var(--surface)", border: "1px solid rgba(168,85,247,0.2)" }}
              >
                <div className="text-4xl mb-4">💡</div>
                <p className="text-[16px] text-[#8a8a9a] leading-relaxed">{noPricingNote}</p>
              </div>
            </div>
          </section>
        )}

        {/* ── CTA ── */}
        <section
          id="iletisim-cta"
          className="py-20"
          style={{ background: "var(--bg-alt)", borderTop: "1px solid var(--border)" }}
        >
          <div className="max-w-[680px] mx-auto px-6 text-center">
            <h2 className="font-black text-[32px] mb-4">
              Hemen <span className="gradient-text">Başlayalım</span>
            </h2>
            <p className="text-[#8a8a9a] mb-8">
              Projenizi 24 saat içinde değerlendirip size özel teklif hazırlıyoruz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://wa.me/905520772700" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                WhatsApp&apos;tan Yaz
              </a>
              <a href="mailto:markaizicom@gmail.com" className="btn btn-outline">
                E-posta Gönder
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsApp />
    </>
  );
}

function PricingCard({ pkg }: { pkg: PricingPackage }) {
  return (
    <>
      {pkg.featured && (
        <span
          className="inline-block text-[11px] font-bold tracking-wide uppercase text-white px-3.5 py-1 rounded-full mb-4"
          style={{ background: "var(--grad)" }}
        >
          Önerilen
        </span>
      )}
      <div className="text-base font-bold mb-3">{pkg.name}</div>
      {pkg.price ? (
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-[16px] font-semibold text-[#8a8a9a]">₺</span>
          <span
            className={`text-[40px] font-black leading-none ${pkg.featured ? "pricing-featured-amount" : "gradient-text"}`}
          >
            {pkg.price}
          </span>
          <span className="text-[13px] text-[#8a8a9a]">{pkg.period ?? "/ay"}</span>
        </div>
      ) : (
        <div className="text-[28px] font-black gradient-text mb-3">Teklif Al</div>
      )}
      <p className="text-[13px] text-[#8a8a9a] mb-6 leading-relaxed">{pkg.desc}</p>
      <ul className="flex flex-col gap-3 mb-7 flex-1">
        {pkg.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-[13px] leading-snug">
            <span
              className="inline-flex w-[18px] h-[18px] items-center justify-center rounded-full text-[9px] flex-shrink-0 mt-0.5"
              style={{ background: "var(--grad)" }}
            >
              ✓
            </span>
            {f}
          </li>
        ))}
      </ul>
      <a
        href={pkg.cta === "Teklif Formu →" ? "/hizmetler/web-tasarim-hosting/teklif" : pkg.price ? "/#iletisim" : "/#iletisim"}
        className={`btn w-full text-sm py-3 mt-auto ${pkg.featured ? "btn-primary" : "btn-outline"}`}
      >
        {pkg.cta ?? (pkg.price ? "Bu Paketi Seç" : "Teklif İste")}
      </a>
    </>
  );
}
