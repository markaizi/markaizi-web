import { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Web Tasarım Ankara — Kurumsal Web Sitesi & Hosting | markaizi",
  description: "Ankara'da web tasarım ve hosting hizmeti. Mobilyacı, doktor, klinik, aksesuar ve yerel işletmelere özel hızlı, mobil uyumlu web siteleri. Domain, hosting ve SEO dahil.",
  keywords: "web tasarım ankara, kurumsal web sitesi ankara, ankara doktor web sitesi, ankara klinik web tasarım, ankara mobilya web sitesi, siteler web tasarım, ankara işletme web sitesi, ucuz web tasarım ankara, hosting ankara",
  alternates: { canonical: "https://markaizi.com.tr/hizmetler/web-tasarim-hosting" },
};

const ICON = (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" style={{ stroke: "#c084fc" }}>
    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function WebTasarimPage() {
  return (
    <ServicePageTemplate
        badge="Dijital Altyapı"
        icon={ICON}
        title="Web Tasarım & Hosting"
        subtitle="Ziyaretçiyi müşteriye dönüştüren, hızlı yüklenen ve her cihazda mükemmel görünen web siteleri tasarlıyoruz. Domain'den yayına tek adımda."
        description={[
          "Web siteniz dijital dünyadaki en önemli vitrinizdir. İlk izlenim genellikle 3 saniye içinde oluşur: siteniz yavaş açılıyorsa, mobilde bozuk görünüyorsa ya da güven vermiyorsa potansiyel müşteri geri tuşuna basar.",
          "markaizi olarak sitenizi baştan sona tasarlıyoruz: marka kimliğinize uygun tasarım, SEO dostu kod yapısı, hızlı yükleme süresi ve mobil uyumluluk temel prensiplerimizdir. WordPress, Next.js veya ihtiyacınıza göre belirlenen platformda geliştiriyoruz.",
          "Tasarımla birlikte domain kaydı, güvenli hosting kurulumu ve SSL sertifikası işlemlerini de üstleniyoruz. Tek adımda projeniz yayına giriyor.",
        ]}
        features={[
          { icon: "📱", title: "Mobil Uyumlu Tasarım", desc: "Her cihaz ve ekran boyutunda kusursuz görünen, responsive tasarım." },
          { icon: "⚡", title: "Hızlı Yükleme", desc: "Optimize kod yapısı ve performanslı hosting ile düşük yükleme süresi." },
          { icon: "🔒", title: "SSL & Güvenlik", desc: "HTTPS güvenli bağlantı ve temel güvenlik önlemleri dahil." },
          { icon: "🌐", title: "Domain & Hosting", desc: "Alan adı kaydı ve yüksek performanslı hosting çözümleri." },
          { icon: "🔍", title: "SEO Altyapısı", desc: "Arama motorlarında üst sıralara çıkmak için teknik SEO temelleri." },
          { icon: "✏️", title: "Kolay Yönetim Paneli", desc: "Teknik bilgi olmadan içerik güncelleyebileceğiniz kullanıcı dostu panel." },
        ]}
        pricing={[
          {
            name: "Basit Tanıtım Sitesi",
            price: "14.900",
            period: "",
            paymentSlug: "web-basit",
            desc: "Küçük işletmeler ve bireysel girişimciler için tek seferlik kurulum.",
            features: [
              "5 sayfaya kadar tasarım",
              "Mobil uyumlu & hızlı",
              "İletişim formu",
              "SSL sertifikası",
              "1 yıl hosting dahil",
              "Domain kurulumu",
            ],
          },
          {
            name: "Kurumsal Web Sitesi",
            price: "29.900",
            period: "",
            paymentSlug: "web-kurumsal",
            desc: "Marka kimliğini yansıtan, SEO uyumlu kurumsal site.",
            featured: true,
            features: [
              "15 sayfaya kadar tasarım",
              "Özel marka kimliği entegrasyonu",
              "SEO temel optimizasyonu",
              "Blog / Haber yönetim paneli",
              "Google Analytics entegrasyonu",
              "1 yıl hosting & destek",
            ],
          },
          {
            name: "Gelişmiş SEO'lu Site",
            price: "49.900",
            period: "",
            paymentSlug: "web-seo",
            desc: "Kapsamlı SEO altyapısı ve yüksek performanslı tam kurulum.",
            features: [
              "Sınırsız sayfa",
              "Kapsamlı on-page SEO optimizasyonu",
              "Sayfa hızı optimizasyonu",
              "Schema markup & yapısal veri",
              "6 ay SEO takip & raporlama",
              "Öncelikli teknik destek",
            ],
          },
          {
            name: "E-Ticaret Sitesi",
            price: null,
            desc: "Ürün sayısı ve özel gereksinimlere göre fiyatlandırılır. Teklif almak için formu doldurun.",
            cta: "Teklif Formu →",
            features: [
              "Sınırsız ürün kataloğu",
              "Güvenli ödeme entegrasyonu",
              "Stok & sipariş yönetimi",
              "Mobil uyumlu alışveriş deneyimi",
              "SEO & performans optimizasyonu",
              "Kargo entegrasyonu",
            ],
          },
        ]}
        faq={[
          {
            q: "Web sitem ne kadar sürede hazır olur?",
            a: "Basit tanıtım siteleri 7–10 iş günü, kurumsal siteler 3–4 hafta, gelişmiş SEO'lu siteler 5–6 hafta, e-ticaret siteleri ise 6–8 hafta içinde teslim edilir. Süre, içeriklerin (metin ve görsel) tarafınızdan ne kadar hızlı temin edildiğine bağlı olarak değişebilir.",
          },
          {
            q: "Siteyi yaptırdıktan sonra kendim güncelleyebilir miyim?",
            a: "Evet. Tüm sitelere kolay kullanımlı bir yönetim paneli (CMS) entegre ediyoruz. Teknik bilgi gerektirmeden metin, görsel, fiyat ve ürün gibi içerikleri kendiniz güncelleyebilirsiniz. Talep ederseniz kısa bir kullanım eğitimi de veriyoruz.",
          },
          {
            q: "Hosting ve domain ücreti dahil mi?",
            a: "Temel paketlerde ilk yıl hosting kurulumu ve domain kaydı hizmet bedeline dahildir. İkinci yıldan itibaren hosting (yıllık yaklaşık 1.500–3.000 ₺) ve domain yenileme ücreti ayrıca fatura edilir. SSL sertifikası tüm paketlerde ücretsizdir.",
          },
          {
            q: "Sitem SEO uyumlu ve mobil uyumlu olacak mı?",
            a: "Kesinlikle. Tüm sitelerimiz mobil öncelikli (responsive) tasarlanır ve teknik SEO temelleriyle kodlanır: hızlı yükleme, doğru başlık yapısı, meta etiketleri ve yapısal veri. Next.js gibi modern altyapılarla Google'ın Core Web Vitals kriterlerinde yüksek puan hedefleriz.",
          },
        ]}
    />
  );
}
