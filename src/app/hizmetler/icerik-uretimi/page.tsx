import { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "İçerik Üretimi — markaizi",
  description: "Mağazanıza gelip ürün videoları çekiyoruz, yapay zeka araçlarıyla içerikler üretiyoruz. Her platform için optimize edilmiş profesyonel içerikler.",
};

const ICON = (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" style={{ stroke: "#c084fc" }}>
    <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" strokeWidth="1.5"/>
    <path d="M14 2v6h6" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 13h6M9 17h4" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export default function IcerikUretimiPage() {
  return (
    <ServicePageTemplate
      badge="Kreatif Hizmetler"
      icon={ICON}
      title="İçerik Üretimi"
      subtitle="Markanıza özel görsel, video ve yazılı içerikler üretiyoruz. Mağazanıza gelip ürünlerinizi çekiyoruz; yapay zeka araçlarıyla içerik sürecini hızlandırıyoruz."
      description={[
        "İçerik, dijital pazarlamanın bel kemiğidir. Ne kadar iyi bir reklam bütçeniz olursa olsun, içerik kalitesiz ise dönüşüm olmaz. Bu yüzden biz yalnızca strateji değil; içeriğin kendisini de üretiyoruz.",
        "Sahaya çıkıyoruz: Mağazanıza, atölyenize veya ofisine gelerek ürün ve hizmetlerinizi profesyonel kamera ve ekipmanlarla çekiyoruz. Ürün videoları, mekân tanıtımı, before/after içerikler, müşteri yorumları — hepsini yerinde üretiyoruz.",
        "Aynı zamanda yapay zeka destekli araçlarla görsel oluşturma, metin yazarlığı ve içerik takvimi planlaması yapıyoruz. Bu sayede daha kısa sürede daha fazla, daha tutarlı içerik üretiyoruz. Her içerik hangi platformda yayınlanacağına göre boyut, süre ve format olarak optimize ediliyor.",
      ]}
      features={[
        { icon: "🎥", title: "Mağaza & Yerinde Çekim", desc: "Ekibimiz lokasyonunuza gelir, ürün ve mekan videolarını profesyonelce çeker." },
        { icon: "🤖", title: "Yapay Zeka Destekli Üretim", desc: "AI araçlarıyla hızlı görsel üretimi, metin oluşturma ve içerik optimizasyonu." },
        { icon: "📸", title: "Ürün Fotoğrafçılığı", desc: "Sosyal medya ve e-ticaret için yüksek kaliteli ürün görselleri." },
        { icon: "✍️", title: "Metin Yazarlığı", desc: "Markanızın sesini yansıtan sosyal medya metinleri, başlıklar ve açıklamalar." },
        { icon: "🎬", title: "Reels & TikTok İçerikleri", desc: "Her platform için optimize edilmiş kısa video formatlarında içerik üretimi." },
        { icon: "🗓️", title: "İçerik Takvimi", desc: "Tüm platformlar için aylık içerik planlaması ve yayın takvimi oluşturma." },
      ]}
      noPricingNote="İçerik üretimi hizmetinin fiyatlandırması; çekim lokasyonu, içerik sayısı, video süresi ve platform gereksinimlerine göre değişmektedir. Size özel teklif için WhatsApp veya e-posta üzerinden ulaşın — 24 saat içinde yanıt veriyoruz."
    />
  );
}
