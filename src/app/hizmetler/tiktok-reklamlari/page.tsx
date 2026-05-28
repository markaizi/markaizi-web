import { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "TikTok Reklamları Ankara — TikTok Ads Yönetimi | markaizi",
  description: "Ankara'da TikTok Ads yönetimi. Mobilyacı, avizeci, aksesuar ve yerel Ankara işletmeleri için viral potansiyelli TikTok reklam kampanyaları.",
  keywords: "tiktok reklamları ankara, tiktok ads ankara, ankara tiktok reklam ajansı, siteler tiktok reklamı, ankara mobilya tiktok, tiktok reklam yönetimi ankara",
  alternates: { canonical: "https://markaizi.com.tr/hizmetler/tiktok-reklamlari" },
};

const ICON = (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" style={{ stroke: "#c084fc" }}>
    <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function TikTokReklamlariPage() {
  return (
    <ServicePageTemplate
      badge="Reklam Yönetimi"
      icon={ICON}
      title="TikTok Reklamları"
      subtitle="Türkiye'nin en hızlı büyüyen platformunda markanızı öne çıkarıyoruz. TikTok'un güçlü algoritmasını ve reklam araçlarını sizin için kullanıyoruz."
      description={[
        "TikTok, yalnızca genç neslin değil; artık geniş bir yaş kitlesinin aktif olarak kullandığı, Türkiye'de günlük 10 milyonun üzerinde kullanıcıya sahip dev bir platform. Kısa video formatı ve güçlü keşfet algoritması sayesinde organik erişim hâlâ son derece yüksek.",
        "TikTok Ads Manager ile In-Feed reklamlar, TopView (giriş ekranı) reklamlar ve Branded Hashtag Challenge kampanyaları oluşturuyoruz. Her format, farklı marka hedeflerine hizmet eder: farkındalık, trafik, uygulama indirme ya da doğrudan satış.",
        "Sadece reklam kurmakla kalmıyoruz; TikTok'a özel kreatifleri de hazırlıyoruz. Platformun dilini konuşan, kullanıcıların kaydırma yapmasını durduran dikkat çekici video reklamlar üretiyoruz.",
      ]}
      features={[
        { icon: "📱", title: "In-Feed Reklam", desc: "Kullanıcıların 'For You' akışında doğal görünen, yüksek tıklama oranlı reklamlar." },
        { icon: "🏆", title: "TopView Reklam", desc: "TikTok'u açan kullanıcının karşısına çıkan, maksimum görünürlük sağlayan format." },
        { icon: "🎬", title: "TikTok'a Özel Kreatif", desc: "Platformun dilini konuşan, durdurucu kısa video reklamlar." },
        { icon: "🎯", title: "Hedef Kitle Optimizasyonu", desc: "İlgi alanı, davranış ve demografiye göre hassas hedefleme." },
        { icon: "🔥", title: "Trend Takibi", desc: "Güncel TikTok trendlerini reklamlarınıza entegre ederek viral potansiyel yaratıyoruz." },
        { icon: "📈", title: "Performans Takibi", desc: "Görüntülenme, tıklama ve dönüşüm verilerini düzenli raporluyoruz." },
      ]}
      pricing={[
        {
          name: "TikTok Reklam Yönetimi",
          price: "9.900",
          desc: "TikTok Ads Manager'da kampanya kurulumu, optimizasyonu ve aylık raporlama.",
          features: [
            "TikTok Ads hesabı kurulumu",
            "In-Feed reklam kampanyası",
            "Hedef kitle tanımlama & optimizasyon",
            "TikTok'a özel kreatif desteği",
            "Aylık performans raporu",
            "Reklam bütçesi: müşteri tarafından belirlenir",
          ],
        },
      ]}
    />
  );
}
