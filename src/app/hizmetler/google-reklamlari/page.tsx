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
      path="/hizmetler/google-reklamlari"
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
      faq={[
        {
          q: "Google Ads reklam bütçem ne kadar olmalı?",
          a: "Sektöre ve rekabete göre değişmekle birlikte, anlamlı veri biriktirmek için günlük 150–300 ₺ uygun bir başlangıç noktasıdır. Bütçeyi artırdıkça veri birikimi hızlanır ve kampanya optimizasyonu daha etkili hale gelir. Reklam bütçesi yönetim ücretine dahil değildir; doğrudan Google'a yüklenir ve tamamen sizin kontrolünüzdedir.",
        },
        {
          q: "Reklamlarım ne zaman ilk sıralarda çıkar?",
          a: "Google Ads'de reklamlar yayına alındığı anda gösterilmeye başlar; SEO'dan farklı olarak beklemeye gerek yoktur. İlk 1–2 haftada tıklama ve gösterim verileri gelir, dönüşüm odaklı optimizasyon ise genellikle 4–6 hafta içinde oturur. Kalite Puanı yükseldikçe daha az maliyetle daha üst sıralarda görünürsünüz.",
        },
        {
          q: "Anahtar kelimeleri kim belirliyor?",
          a: "Anahtar kelime araştırmasını markaizi ekibi yapar. İşletmenizi, hedef kitlenizi ve rakiplerinizi analiz ederek dönüşüm getirme ihtimali en yüksek kelimeleri seçeriz. Bütçe israfını önlemek için negatif anahtar kelime listesini de düzenli olarak güncelleriz.",
        },
        {
          q: "Reklam hesabı kimin üzerine açılıyor?",
          a: "Google Ads hesabı her zaman size aittir. Biz hesabınıza yönetici erişimi alarak kampanyaları yönetiriz. Çalışma ilişkimiz sona erdiğinde hesap, tüm geçmiş verileriyle birlikte tamamen sizde kalır.",
        },
      ]}
    />
  );
}
