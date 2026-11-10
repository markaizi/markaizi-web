import { SAME_AS, ORG_ID, OG_IMAGES } from "@/lib/seo";
import { founderRef } from "@/lib/founder";
import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import FreeAnalysisBar from "@/components/sections/FreeAnalysisBar";
import Services from "@/components/sections/Services";
import Approach from "@/components/sections/Approach";
import Sectors from "@/components/sections/Sectors";
import About from "@/components/sections/About";
import Portfolio from "@/components/sections/Portfolio";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "markaizi — Ankara Dijital Reklam Ajansı | Siteler, Mobilya Reklamı & Sosyal Medya",
  description:
    "Ankara Siteler merkezli dijital reklam ajansı. Mobilya mağazaları, kafe ve restoranlar, klinikler ve yerel işletmelere özel sosyal medya yönetimi, Google Ads, Meta reklam ve web tasarım. 10+ yıl deneyim, 200+ mutlu müşteri.",
  keywords:
    "dijital reklam ajansı ankara, siteler reklam ajansı, ankara kafe reklam ajansı, ankara restoran sosyal medya, gölbaşı kafe sosyal medya, ankara mobilya sosyal medya, ankara avize dijital pazarlama, ankara aksesuar instagram yönetimi, ankara klinik doktor google reklamları, ostim dijital ajans, keçiören sosyal medya ajansı, etimesgut reklam, çankaya dijital pazarlama, ankara google ads, ankara meta reklam, ankara tiktok reklamları, ankara instagram yönetimi, yerel işletme dijital pazarlama",
  alternates: { canonical: "https://markaizi.com.tr" },
  openGraph: {
    title: "markaizi — Dijital Reklam Ajansı | Ankara",
    description: "Sosyal medya, Google & Meta reklamları, içerik üretimi ve web tasarım. Markanızı dijitalde zirveye taşıyoruz.",
    type: "website",
    locale: "tr_TR",
    url: "https://markaizi.com.tr",
    siteName: "markaizi",
    images: OG_IMAGES,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["ProfessionalService", "Organization"],
  "@id": ORG_ID,
  name: "markaizi Dijital Reklam Ajansı",
  alternateName: "markaizi",
  url: "https://markaizi.com.tr",
  logo: "https://markaizi.com.tr/logo.svg",
  image: "https://markaizi.com.tr/opengraph-image",
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
    { "@type": "Country", name: "Türkiye" },
    { "@type": "City", name: "Ankara" },
    { "@type": "Neighborhood", name: "Siteler" },
    { "@type": "Neighborhood", name: "Ostim" },
    { "@type": "Neighborhood", name: "Keçiören" },
    { "@type": "Neighborhood", name: "Etimesgut" },
    { "@type": "Neighborhood", name: "Çankaya" },
    { "@type": "Neighborhood", name: "Yenimahalle" },
    { "@type": "Neighborhood", name: "Mamak" },
    { "@type": "AdministrativeArea", name: "Gölbaşı, Ankara" },
    { "@type": "AdministrativeArea", name: "Altındağ, Ankara" },
    { "@type": "AdministrativeArea", name: "Beypazarı, Ankara" },
  ],
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"], opens: "09:00", closes: "20:00" },
  ],
  sameAs: SAME_AS,
  founder: founderRef,
  knowsAbout: [
    "Mobilya sektörü dijital pazarlama",
    "Mobilya mağazaları için Instagram ve Google reklamları",
    "Siteler mobilya sektörü",
    "Kafe ve restoranlar için sosyal medya ve reklam",
    "Ankara kafe ve restoran dijital pazarlaması",
    "Sosyal medya yönetimi",
    "Google Ads ve Meta reklam yönetimi",
    "Yerel işletme pazarlaması",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Dijital Pazarlama Hizmetleri",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Sosyal Medya Yönetimi", url: "https://markaizi.com.tr/hizmetler/sosyal-medya-yonetimi" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Meta Reklamları", url: "https://markaizi.com.tr/hizmetler/meta-reklamlari" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Google Reklamları", url: "https://markaizi.com.tr/hizmetler/google-reklamlari" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "TikTok Reklamları", url: "https://markaizi.com.tr/hizmetler/tiktok-reklamlari" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Yapay Zeka ve Otomasyon", url: "https://markaizi.com.tr/hizmetler/yapay-zeka-otomasyon" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Web Tasarım & Hosting", url: "https://markaizi.com.tr/hizmetler/web-tasarim-hosting" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Ankara Kafe & Restoran Sosyal Medya ve Reklam Yönetimi", url: "https://markaizi.com.tr/ankara-kafe-restoran-reklam-ajansi" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Mobilya Reklam Ajansı Hizmetleri", url: "https://markaizi.com.tr/mobilya-reklam-ajansi" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Dijital Pazarlama Danışmanlığı", url: "https://markaizi.com.tr/hizmetler/dijital-pazarlama-danismanligi" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Kurumsal Dijital Pazarlama Eğitimi", url: "https://markaizi.com.tr/hizmetler/dijital-pazarlama-egitimi" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Video Çekimi ve Drone Çekimi", url: "https://markaizi.com.tr/hizmetler/video-cekimi-drone" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Dönüşüm Takibi Kurulumu (Meta Pixel, Conversions API, Google Tag Manager)", url: "https://markaizi.com.tr/hizmetler/donusum-takibi-kurulumu" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Yapay Zeka Arama Görünürlüğü (GEO) ve ChatGPT Reklamları", url: "https://markaizi.com.tr/hizmetler/yapay-zeka-arama-gorunurlugu" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Mobilya Bayileri İçin Dijital Pazarlama", url: "https://markaizi.com.tr/mobilya-bayi-reklam-ajansi" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Sağlık ve Klinik Reklam Ajansı Hizmetleri", url: "https://markaizi.com.tr/saglik-klinik-reklam-ajansi" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Doğal Ürün ve Takviye Reklam Ajansı Hizmetleri", url: "https://markaizi.com.tr/dogal-urun-takviye-reklam-ajansi" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Güzellik Merkezi Reklam ve Sosyal Medya Yönetimi", url: "https://markaizi.com.tr/guzellik-merkezi-reklam-ajansi" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "E-Ticaret Reklam Yönetimi (Meta, Google Alışveriş)", url: "https://markaizi.com.tr/e-ticaret-reklam-ajansi" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "GETAT Merkezi Dijital Pazarlama", url: "https://markaizi.com.tr/getat-merkezi-dijital-pazarlama" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Mobilya Markaları İçin Kurumsal Meta ve Google Reklam Yönetimi", url: "https://markaizi.com.tr/mobilya-kurumsal-meta-google-reklam-yonetimi" } },
      { "@type": "Offer", price: "0", priceCurrency: "TRY", itemOffered: { "@type": "Service", name: "Ücretsiz Reklam Hesabı Denetimi", url: "https://markaizi.com.tr/reklam-hesabi-denetimi" } },
      { "@type": "Offer", price: "0", priceCurrency: "TRY", itemOffered: { "@type": "Service", name: "Ücretsiz Yapay Zeka Görünürlük Ölçümü", url: "https://markaizi.com.tr/yapay-zeka-gorunurluk-olcumu" } },
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
        <FreeAnalysisBar />

<Services />
        <Sectors />
        <Approach />
        <About />
        <Portfolio />
        <Contact />
      </main>
      <Footer />
      <WhatsApp />
      <ScrollReveal />
    </>
  );
}
