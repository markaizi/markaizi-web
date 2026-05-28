import { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Google Reklamları Ankara — Google Ads Yönetimi | markaizi",
  description: "Ankara'da Google Ads yönetimi. Doktor, klinik, mobilyacı, avizeci ve yerel işletmeler için Search, Display ve YouTube reklam kampanyaları. Müşteriniz sizi aradığında karşısına çıkın.",
  keywords: "google reklamları ankara, google ads yönetimi ankara, ankara doktor google reklamı, ankara klinik google ads, siteler google reklamı, ankara mobilya google ads, ankara işletme google reklamları, arama reklamı ankara",
  alternates: { canonical: "https://markaizi.com.tr/hizmetler/google-reklamlari" },
};

const ICON = (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" style={{ stroke: "#c084fc" }}>
    <circle cx="11" cy="11" r="8" strokeWidth="1.5"/>
    <path d="M21 21l-4.35-4.35" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 11h6M11 8v6" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export default function GoogleReklamlariPage() {
  return (
    <ServicePageTemplate
      badge="Reklam Yönetimi"
      icon={ICON}
      title="Google Reklamları"
      subtitle="Ürününüzü veya hizmetinizi Google'da aktif olarak arayanların karşısına çıkıyoruz. Arama niyetiyle gelen kullanıcı, en değerli kullanıcıdır."
      description={[
        "Google Ads, dünyada en fazla kullanılan reklam platformlarından biridir. Arama reklamları (Search Ads), kullanıcı bir ürün veya hizmet aradığında tam o anda markanızı görünür kılar. Bu da reklamın doğrudan satın alma niyetiyle buluşmasını sağlar.",
        "Yalnızca Search değil; Display (görsel banner), YouTube video reklamları ve Performans Max kampanyaları ile de müşterilerinize farklı temas noktalarında ulaşıyoruz. Alışveriş kampanyaları (Google Shopping) ile e-ticaret sitenizin ürünlerini sonuçlarda öne çıkarıyoruz.",
        "Google Ads'de doğru anahtar kelime seçimi ve negatif anahtar kelime yönetimi, bütçenizin israf edilmemesini sağlar. Her ay detaylı optimizasyon yaparak tıklama başı maliyeti (CPC) düşürürken dönüşüm oranını artırıyoruz.",
      ]}
      features={[
        { icon: "🔎", title: "Search (Arama) Reklamları", desc: "Google'da ürününüzü arayan kullanıcıların karşısına anında çıkın." },
        { icon: "🖼️", title: "Display (Banner) Reklamları", desc: "Milyonlarca web sitesinde görsel reklamlarla marka bilinirliği oluşturun." },
        { icon: "▶️", title: "YouTube Reklamları", desc: "Video reklamlarla kitleyi bilgilendirin, ikna edin ve dönüştürün." },
        { icon: "🛒", title: "Google Shopping", desc: "Ürünlerinizi arama sonuçlarında görsel ve fiyatlı olarak öne çıkarın." },
        { icon: "🗝️", title: "Anahtar Kelime Yönetimi", desc: "Doğru kelimelere teklif verin, yanlış aramalarda para kaybetmeyin." },
        { icon: "📊", title: "Dönüşüm Takibi", desc: "Formdan telefona, satıştan ziyarete kadar her dönüşümü ölçün." },
      ]}
      pricing={[
        {
          name: "Basit Yönetim",
          price: "14.900",
          desc: "Tek kampanya, temel optimizasyon. Başlamak için ideal.",
          features: [
            "Google Ads hesabı kurulumu",
            "Search reklam kampanyası",
            "Anahtar kelime araştırması",
            "Temel optimizasyon & negatif kelime yönetimi",
            "Aylık performans raporu",
            "Reklam bütçesi: müşteri tarafından belirlenir",
          ],
        },
        {
          name: "Tam Kapsamlı Yönetim",
          price: "24.900",
          desc: "Search + Display + YouTube, sürekli optimizasyon ve dönüşüm takibi.",
          featured: true,
          features: [
            "Search, Display & YouTube kampanyaları",
            "Google Shopping (uygulanabilirse)",
            "Dönüşüm takibi & Google Analytics entegrasyonu",
            "Haftalık optimizasyon & A/B test",
            "Retargeting kampanyaları",
            "Haftalık rapor & stratejik danışmanlık",
          ],
        },
      ]}
    />
  );
}
