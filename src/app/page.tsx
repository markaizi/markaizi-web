import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import About from "@/components/sections/About";
import Portfolio from "@/components/sections/Portfolio";
import Pricing from "@/components/sections/Pricing";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "markaizi — Ankara Dijital Reklam Ajansı | Siteler, Sosyal Medya & Google Reklamları",
  description:
    "Ankara Siteler merkezli dijital reklam ajansı. Mobilyacı, avizeci, aksesuarcı, klinik ve yerel işletmelere özel sosyal medya yönetimi, Google Ads, Meta reklam ve web tasarım. 10+ yıl deneyim, 200+ mutlu müşteri.",
  keywords:
    "dijital reklam ajansı ankara, siteler reklam ajansı, ankara mobilya sosyal medya, ankara avize dijital pazarlama, ankara aksesuar instagram yönetimi, ankara klinik doktor google reklamları, ostim dijital ajans, keçiören sosyal medya ajansı, etimesgut reklam, çankaya dijital pazarlama, ankara google ads, ankara meta reklam, ankara tiktok reklamları, ankara instagram yönetimi, yerel işletme dijital pazarlama",
  alternates: { canonical: "https://markaizi.com.tr" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "markaizi Dijital Reklam Ajansı",
  url: "https://markaizi.com.tr",
  logo: "https://markaizi.com.tr/logo.svg",
  image: "https://markaizi.com.tr/opengraph-image.png",
  description:
    "Ankara merkezli dijital reklam ajansı. Sosyal medya yönetimi, Google & Meta reklamları, TikTok reklamları, içerik üretimi ve web tasarım hizmetleri.",
  telephone: "+90-552-077-27-00",
  email: "markaizicom@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Zübeyde Hanım Mahallesi Elif Sokak No:7/106 2. Kat, Sütçü Kemal İş Merkezi",
    addressLocality: "Ankara",
    addressRegion: "Ankara",
    postalCode: "06110",
    addressCountry: "TR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "39.9835",
    longitude: "32.8652",
  },
  hasMap: "https://maps.google.com/?q=Zübeyde+Hanım+Mahallesi+Elif+Sokak+No:7+Ankara",
  areaServed: [
    { "@type": "City", name: "Ankara" },
    { "@type": "Neighborhood", name: "Siteler" },
    { "@type": "Neighborhood", name: "Ostim" },
    { "@type": "Neighborhood", name: "Keçiören" },
    { "@type": "Neighborhood", name: "Etimesgut" },
    { "@type": "Neighborhood", name: "Çankaya" },
    { "@type": "Neighborhood", name: "Yenimahalle" },
    { "@type": "Neighborhood", name: "Mamak" },
  ],
  priceRange: "₺₺",
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"], opens: "09:00", closes: "20:00" },
  ],
  sameAs: [
    "https://instagram.com/markaizicom",
    "https://tiktok.com/@markaizicom",
    "https://share.google/S5wQdPjBKZT7DQ9zu",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Dijital Pazarlama Hizmetleri",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Sosyal Medya Yönetimi" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Meta Reklamları" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Google Reklamları" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "TikTok Reklamları" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "İçerik Üretimi" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Web Tasarım & Hosting" } },
    ],
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <Hero />

        {/* ── Kampanya Şeridi ── */}
        <div className="px-4 py-3 text-center" style={{ background: "#f97316" }}>
          <p className="text-white font-semibold leading-snug" style={{ fontSize: "clamp(12px,1.8vw,14px)" }}>
            ✦&nbsp; İlk 2 aylık hizmet bedelini peşin ödeyin — profesyonel kurumsal web sitesi kurulumu, 1 yıllık hosting ve 1 yıllık alan adı (domain) tamamen bizden! &nbsp;✦
          </p>
        </div>

        <Services />
        <About />
        <Portfolio />
        <Pricing />
        <Contact />
      </main>
      <Footer />
      <WhatsApp />
      <ScrollReveal />
    </>
  );
}
