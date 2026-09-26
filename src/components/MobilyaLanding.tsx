import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";
import ServiceFAQ from "@/components/ServiceFAQ";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, SITE_URL } from "@/lib/seo";
import type { LandingContent } from "@/lib/mobilya-pages";

export function mobilyaMetadata(c: LandingContent): Metadata {
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    keywords: c.keywords,
    alternates: { canonical: `${SITE_URL}${c.path}` },
    openGraph: {
      title: c.metaTitle,
      description: c.metaDescription,
      type: "website",
      locale: "tr_TR",
      url: `${SITE_URL}${c.path}`,
    },
  };
}

export default function MobilyaLanding({ c }: { c: LandingContent }) {
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: c.serviceName,
    serviceType: "Mobilya sektörü dijital pazarlama ve reklam yönetimi",
    url: `${SITE_URL}${c.path}`,
    provider: {
      "@type": "ProfessionalService",
      name: "markaizi Dijital Reklam Ajansı",
      url: SITE_URL,
      telephone: "+90-552-077-27-00",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Ankara",
        addressRegion: "Ankara",
        addressCountry: "TR",
      },
    },
    areaServed: c.areaServed.map((name) => ({ "@type": name === "Türkiye" ? "Country" : "City", name })),
    audience: { "@type": "Audience", audienceType: "Mobilya mağazaları, mobilya üreticileri ve bayileri" },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumb = breadcrumbJsonLd([
    { name: "Ana Sayfa", path: "/" },
    { name: "Mobilya Reklam Ajansı", path: "/mobilya-reklam-ajansi" },
    { name: c.breadcrumbLabel, path: c.path },
  ]);

  const wa = `https://wa.me/905520772700?text=${encodeURIComponent(c.waText)}`;

  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumb} />
      <Navbar />
      <main>
        <section className="relative overflow-hidden pt-32 pb-16" style={{ background: "var(--bg)" }}>
          <div
            className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle,rgba(124,58,237,0.2) 0%,transparent 70%)", filter: "blur(80px)" }}
          />
          <div className="max-w-[1200px] mx-auto px-6 relative z-10">
            <div className="max-w-[780px]">
              <Breadcrumb
                items={[
                  { name: "Ana Sayfa", path: "/" },
                  { name: "Mobilya Reklam Ajansı", path: "/mobilya-reklam-ajansi" },
                  { name: c.breadcrumbLabel },
                ]}
              />
              <span className="section-tag">{c.tag}</span>
              <h1
                className="font-black leading-tight mb-6 mt-2"
                style={{ fontSize: "clamp(30px,5vw,50px)", letterSpacing: "-1px" }}
              >
                {c.h1Plain} <span className="gradient-text">{c.h1Accent}</span>
              </h1>
              {c.lead.map((p, i) => (
                <p key={i} className="text-[#8a8a9a] text-[17px] leading-relaxed mb-4">
                  {p}
                </p>
              ))}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  WhatsApp&apos;tan Ücretsiz Teklif Al
                </a>
                <Link href="/mobilya-reklam-ajansi" className="btn btn-outline">
                  Tüm Mobilya Hizmetleri
                </Link>
              </div>
            </div>
          </div>
        </section>

        {c.sections.map((s, i) => (
          <section key={s.h2} className="py-14" style={{ background: i % 2 === 0 ? "var(--bg-alt)" : "var(--bg)" }}>
            <div className="max-w-[760px] mx-auto px-6">
              <h2 className="font-black leading-tight mb-5" style={{ fontSize: "clamp(22px,3vw,30px)" }}>
                {s.h2}
              </h2>
              {s.paragraphs.map((p, j) => (
                <p key={j} className="text-[#8a8a9a] text-[16px] leading-[1.9] mb-4">
                  {p}
                </p>
              ))}
              {s.bullets && (
                <ul className="mt-2 space-y-2">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-[15px] text-[#c0c0d0] leading-relaxed">
                      <span className="mt-[9px] w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--grad)" }} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}

        <section className="py-16" style={{ background: c.sections.length % 2 === 0 ? "var(--bg-alt)" : "var(--bg)" }}>
          <ServiceFAQ faqs={c.faq} />
        </section>

        <section className="py-14" style={{ background: c.sections.length % 2 === 0 ? "var(--bg)" : "var(--bg-alt)" }}>
          <div className="max-w-[760px] mx-auto px-6 text-center">
            <h2 className="font-black text-[22px] mb-5">
              İlgili <span className="gradient-text">Sayfalar</span>
            </h2>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
              {c.related.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="text-[14px] font-semibold text-[#c084fc] px-5 py-2.5 rounded-full transition-all hover:bg-white/[0.06]"
                  style={{ border: "1px solid rgba(168,85,247,0.3)" }}
                >
                  {r.label} →
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20" style={{ background: "var(--bg-alt)", borderTop: "1px solid var(--border)" }}>
          <div className="max-w-[680px] mx-auto px-6 text-center">
            <h2 className="font-black text-[30px] mb-4">{c.ctaTitle}</h2>
            <p className="text-[#8a8a9a] mb-8 leading-relaxed">{c.ctaText}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                WhatsApp&apos;tan Yaz
              </a>
              <Link href="/#iletisim" className="btn btn-outline">
                İletişim Formu
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsApp />
    </>
  );
}
