import { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Meta Reklamları Ankara — Instagram & Facebook Reklam | markaizi",
  description: "Ankara'da Meta (Instagram & Facebook) reklam yönetimi. Mobilyacı, avizeci, aksesuarcı ve yerel işletmelere ROAS odaklı, hedef kitleye özel Meta Ads kampanyaları.",
  keywords: "meta reklam ankara, instagram reklamı ankara, facebook reklamı ankara, ankara mobilya meta reklam, siteler meta ads, ankara işletme facebook reklamı, instagram reklam yönetimi ankara",
  alternates: { canonical: "https://markaizi.com.tr/hizmetler/meta-reklamlari" },
};

const ICON = (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" style={{ stroke: "#c084fc" }}>
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function MetaReklamlariPage() {
  return (
    <ServicePageTemplate
      badge="Reklam Yönetimi"
      icon={ICON}
      title="Meta Reklamları"
      subtitle="Instagram ve Facebook'ta tam hedefleme gücüyle reklam kampanyaları kuruyoruz. Yatırımınızın karşılığını maksimize etmek için veriyi merkeze koyuyoruz."
      description={[
        "Meta Ads (Facebook & Instagram Reklamları), işletmenizin doğru kitleyle tam doğru anda buluşmasını sağlayan en güçlü dijital reklam platformlarından biridir. Coğrafi konum, yaş, ilgi alanı, davranış ve benzeri hedefleme seçenekleriyle reklamınız yalnızca potansiyel müşterilere ulaşır.",
        "markaizi olarak kampanya kurulum ve optimizasyonunun yanı sıra kreatif tasarımını da üstleniyoruz. A/B testleriyle hangi görselin, hangi metnin daha iyi dönüşüm sağladığını bulup bütçenizi sürekli optimize ediyoruz.",
        "Yeniden hedefleme (retargeting) kampanyaları ile sitenizi ziyaret eden ya da ürünlerinizi inceleyen kullanıcılara hatırlatma reklamları gösteriyoruz. Benzer kitle (lookalike) stratejisiyle ise mevcut müşterilerinize benzer yeni kullanıcılara ulaşıyoruz.",
      ]}
      features={[
        { icon: "🎯", title: "Hassas Hedefleme", desc: "Yaş, konum, ilgi alanı ve davranış verisiyle tam hedef kitleye ulaşın." },
        { icon: "🔁", title: "Retargeting", desc: "Siteyi ziyaret eden ama satın almayan kullanıcıları geri kazanın." },
        { icon: "👥", title: "Lookalike Kitle", desc: "Mevcut müşterilerinize benzer yeni kullanıcıları keşfedin." },
        { icon: "🧪", title: "A/B Test", desc: "Farklı görsel ve metin kombinasyonları test ederek en iyi sonucu bulun." },
        { icon: "💰", title: "Bütçe Optimizasyonu", desc: "En düşük maliyetle en fazla dönüşümü sağlayacak bütçe dağılımı." },
        { icon: "📊", title: "Haftalık Raporlama", desc: "Tıklama, dönüşüm, ROAS ve maliyet verilerini şeffaf raporlarla görün." },
      ]}
      pricing={[
        {
          name: "Basit Yönetim",
          price: "14.900",
          desc: "Tek kampanya, tek platform. Başlamak için ideal.",
          features: [
            "1 reklam hesabı yönetimi",
            "Instagram veya Facebook",
            "Aylık kampanya kurulumu",
            "Temel hedefleme optimizasyonu",
            "Aylık performans raporu",
            "Reklam bütçesi: müşteri tarafından belirlenir",
          ],
        },
        {
          name: "Tam Kapsamlı Yönetim",
          price: "24.900",
          desc: "Instagram + Facebook, çoklu kampanya, sürekli optimizasyon.",
          featured: true,
          features: [
            "Instagram & Facebook tam yönetim",
            "Çoklu kampanya kurulumu",
            "Retargeting & lookalike kampanyaları",
            "A/B test & kreatif optimizasyonu",
            "Haftalık optimizasyon & rapor",
            "Öncelikli destek & stratejik danışmanlık",
          ],
        },
      ]}
    />
  );
}
