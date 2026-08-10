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
      path="/hizmetler/tiktok-reklamlari"
      relatedPosts={[{ slug: "tiktok-for-business", title: "TikTok For Business Rehberi" }]}
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
      faq={[
        {
          q: "TikTok reklamları hangi işletmeler için uygun?",
          a: "TikTok algoritması takipçi sayısından bağımsız çalıştığı için küçük ve orta ölçekli işletmeler bile viral olabilir. Özellikle moda, güzellik, yemek, dekorasyon, eğitim ve hizmet sektörleri yüksek erişim alır. Türkiye'de TikTok reklamları henüz Meta kadar doymuş olmadığından tıklama maliyetleri genellikle daha düşüktür.",
        },
        {
          q: "TikTok video içeriklerini kim üretiyor?",
          a: "Video içeriklerini markaizi ekibi platforma özel olarak üretir. TikTok'ta Instagram'dan kopyalanmış içerikler çalışmaz; trend seslerini ve formatları markanıza uyarlayarak özgün videolar hazırlarız. İlk 1–2 saniyede izleyiciyi tutmaya odaklanan kurguyla çalışırız.",
        },
        {
          q: "TikTok reklam bütçesi ne kadar olmalı?",
          a: "TikTok Ads için günlük 150–250 ₺ uygun bir başlangıç noktasıdır. Spark Ads formatıyla organik olarak iyi performans gösteren içeriklerinizi reklama dönüştürerek genellikle en yüksek dönüşüm oranını yakalarız. Reklam bütçesi yönetim ücretine dahil değildir.",
        },
        {
          q: "TikTok'ta sonuç almak ne kadar sürer?",
          a: "Reklam kampanyalarında ilk veriler birkaç gün içinde gelir. Organik tarafta ise tutarlılık esastır: haftada 3–4 video ile genellikle birkaç hafta içinde erişim artışı gözlenir. Bir trend 48–72 saatte zirve yaptığı için hızlı aksiyon almak kritiktir.",
        },
      ]}
    />
  );
}
