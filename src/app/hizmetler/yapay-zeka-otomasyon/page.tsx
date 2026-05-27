import { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Yapay Zeka & Otomasyon — markaizi",
  description: "Yapay zeka ile görseller, reklam filmleri ve videolar üretiyoruz. AI destekli otomasyon araçlarıyla içerik süreçlerinizi hızlandırıyor, kampanyalarınızı akıllı hale getiriyoruz.",
  alternates: { canonical: "https://markaizi.com.tr/hizmetler/yapay-zeka-otomasyon" },
};

const ICON = (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" style={{ stroke: "#c084fc" }}>
    <path d="M12 2a2 2 0 012 2v1a2 2 0 01-2 2 2 2 0 01-2-2V4a2 2 0 012-2z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 7v3" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8.5 9.5L6 7" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M15.5 9.5L18 7" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M5 13a7 7 0 0014 0" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 17.5l-2 2.5" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M16 17.5l2 2.5" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M10 20h4" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export default function YapayZekaOtomasyonPage() {
  return (
    <ServicePageTemplate
      badge="Yeni Nesil Hizmetler"
      icon={ICON}
      title="Yapay Zeka & Otomasyon"
      subtitle="AI destekli araçlarla görseller, reklam filmleri ve videolar üretiyoruz. İçerik süreçlerinizi otomatikleştirerek markanızı rekabette öne taşıyoruz."
      description={[
        "Yapay zeka, dijital pazarlamanın oyun kurallarını değiştiriyor. Artık saatler süren içerik üretimi dakikalara iniyor; kişiselleştirilmiş reklamlar, dinamik görseller ve akıllı otomasyon sayesinde daha az bütçeyle daha fazla sonuç elde etmek mümkün.",
        "markaizi olarak yapay zeka araçlarını aktif biçimde kullanıyoruz: AI ile ürün görselleri ve reklam kreatifleri üretiyoruz, metin yazarlığını hızlandırıyor ve her platform için optimize ediyoruz. Reklam filmlerini ve kısa video içeriklerini yapay zeka destekli prodüksiyon araçlarıyla hayata geçiriyoruz.",
        "Otomasyon tarafında ise reklam kampanyalarınızı akıllı kural setleriyle otomatik optimize ediyor, raporlama süreçlerini otomatikleştiriyor ve müşteri iletişimini ölçeklenebilir hale getiriyoruz. Fiyatlandırma proje kapsamına göre belirlenir — size özel teklif için bize ulaşın.",
      ]}
      features={[
        { icon: "🎨", title: "AI Görsel Üretimi", desc: "Yapay zeka ile marka kimliğinize uygun, yüksek kaliteli ürün görselleri ve reklam kreatifleri üretiyoruz." },
        { icon: "🎬", title: "AI Reklam Filmi & Video", desc: "Metinden videoya, görüntüden animasyona — AI destekli prodüksiyon araçlarıyla hızlı video içerikleri oluşturuyoruz." },
        { icon: "✍️", title: "Akıllı Metin Yazarlığı", desc: "Her platform ve hedef kitle için optimize edilmiş reklam metinleri, ürün açıklamaları ve sosyal medya içerikleri." },
        { icon: "⚡", title: "Kampanya Otomasyonu", desc: "Akıllı kural setleriyle reklam bütçenizi otomatik optimize ediyor, performansı 7/24 izliyoruz." },
        { icon: "📊", title: "Otomatik Raporlama", desc: "Tüm kampanyalarınızın verilerini tek panelde toplayıp otomatik raporlar üretiyoruz." },
        { icon: "🤝", title: "Müşteri İletişimi Otomasyonu", desc: "Chatbot, otomatik mesaj akışları ve CRM entegrasyonlarıyla müşteri deneyimini ölçeklendiriyoruz." },
      ]}
      noPricingNote="Yapay zeka & otomasyon hizmetinin fiyatlandırması; proje kapsamı, içerik adedi, otomasyon karmaşıklığı ve süreye göre belirlenmektedir. Size özel teklif için WhatsApp veya iletişim formu üzerinden ulaşın — 24 saat içinde yanıt veriyoruz."
    />
  );
}
