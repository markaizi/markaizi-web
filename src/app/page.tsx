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
    addressLocality: "Ankara",
    addressCountry: "TR",
  },
  areaServed: "TR",
  priceRange: "₺₺",
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "09:00", closes: "18:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday"], opens: "10:00", closes: "15:00" },
  ],
  sameAs: [
    "https://instagram.com/markaizicom",
    "https://tiktok.com/@markaizicom",
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
