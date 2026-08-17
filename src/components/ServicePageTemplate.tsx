import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";
import ServiceFAQ, { FAQItem } from "@/components/ServiceFAQ";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, ORG_NAME, breadcrumbJsonLd } from "@/lib/seo";
import { FeatureIcon, type FeatureIconName } from "@/components/icons/FeatureIcons";

export interface ServicePageProps {
  title: string;
  subtitle: string;
  description: string[];
  // icon artık emoji değil, FeatureIcons setindeki bir ikon adı.
  features: { icon: FeatureIconName; title: string; desc: string }[];
  faq?: FAQItem[]; // hizmete özel sıkça sorulan sorular
  icon: React.ReactNode;
  badge: string;
  path: string; // ör. "/hizmetler/sosyal-medya-yonetimi"
  relatedPosts?: { slug: string; title: string }[]; // ilgili blog yazıları
}

export default function ServicePageTemplate({
  title,
  subtitle,
  description,
  features,
  faq,
  icon,
  badge,
  path,
  relatedPosts,
}: ServicePageProps) {
  const faqJsonLd = faq && faq.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      }
    : null;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: title,
    serviceType: title,
    description: subtitle,
    url: `${SITE_URL}${path}`,
    provider: {
      "@type": "ProfessionalService",
      name: `${ORG_NAME} Dijital Reklam Ajansı`,
      url: SITE_URL,
    },
    areaServed: { "@type": "City", name: "Ankara" },
  };

  const breadcrumb = breadcrumbJsonLd([
    { name: "Ana Sayfa", path: "/" },
    { name: "Hizmetler", path: "/#hizmetler" },
    { name: title, path },
  ]);

  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={breadcrumb} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
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
            <Breadcrumb items={[{ name: "Ana Sayfa", path: "/" }, { name: "Hizmetler", path: "/#hizmetler" }, { name: title }]} />

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
                  <div
                    className="w-10 h-10 flex items-center justify-center rounded-lg mb-3 text-[#c084fc]"
                    style={{ background: "var(--grad-soft)", border: "1px solid rgba(168,85,247,0.25)" }}
                  >
                    <FeatureIcon name={f.icon} />
                  </div>
                  <h3 className="font-bold text-[15px] mb-2">{f.title}</h3>
                  <p className="text-[13px] text-[#8a8a9a] leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SSS ── */}
        {faq && faq.length > 0 && (
          <section className="py-20" style={{ background: "var(--bg)" }}>
            <ServiceFAQ faqs={faq} />
          </section>
        )}

        {/* ── İlgili Rehberler ── */}
        {relatedPosts && relatedPosts.length > 0 && (
          <section className="py-16" style={{ background: "var(--bg)" }}>
            <div className="max-w-[760px] mx-auto px-6 text-center">
              <h2 className="font-black text-[24px] mb-3">
                {title} Hakkında <span className="gradient-text">Daha Fazlası</span>
              </h2>
              <p className="text-[#8a8a9a] text-[15px] mb-6">
                Bu konuda hazırladığımız rehberlere göz atın:
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
                {relatedPosts.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="text-[14px] font-semibold text-[#c084fc] px-5 py-2.5 rounded-full transition-all hover:bg-white/[0.06]"
                    style={{ border: "1px solid rgba(168,85,247,0.3)" }}
                  >
                    {p.title} →
                  </Link>
                ))}
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
