import { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Sosyal Medya Yönetimi Ankara — markaizi | Instagram, Facebook, TikTok",
  description: "Ankara'da sosyal medya yönetimi hizmeti. Mobilyacı, avizeci, aksesuarcı, klinik ve yerel işletmelere özel Instagram, Facebook ve TikTok yönetimi. İçerik üretimi ve büyüme stratejileri.",
  keywords: "sosyal medya yönetimi ankara, instagram yönetimi ankara, facebook yönetimi ankara, tiktok yönetimi ankara, ankara mobilya sosyal medya, siteler sosyal medya ajansı, ankara işletme instagram, içerik üretimi ankara",
  alternates: { canonical: "https://markaizi.com.tr/hizmetler/sosyal-medya-yonetimi" },
};

const ICON = (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" style={{ stroke: "#c084fc" }}>
    <path d="M17 2H7C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5z" strokeWidth="1.5"/>
    <path d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" strokeWidth="1.5"/>
    <circle cx="17.5" cy="6.5" r="1" fill="#c084fc"/>
  </svg>
);

export default function SosyalMedyaPage() {
  return (
    <ServicePageTemplate
      badge="Hizmetlerimiz"
      icon={ICON}
      title="Sosyal Medya Yönetimi"
      subtitle="Markanızın sesini Instagram, Facebook ve TikTok'ta en güçlü şekilde duyuruyoruz. Strateji, içerik ve topluluk yönetimini tamamen üstleniyoruz."
      description={[
        "Sosyal medya, günümüzde bir markanın dijital kimliğinin temel taşıdır. Yalnızca paylaşım yapmak değil; doğru içeriği, doğru kitleye, doğru zamanda ulaştırmak başarıyı belirler.",
        "markaizi olarak hesabınızı baştan sona yönetiyoruz: aylık içerik takvimi oluşturuyoruz, mağazanıza gelerek ürün ve mekan çekimleri yapıyoruz, yapay zeka araçlarıyla hızlı ve tutarlı içerikler üretiyoruz. Yorumlara ve mesajlara düzenli yanıt vererek topluluğunuzu büyütüyoruz.",
        "Her ay detaylı raporlama ile hangi içeriklerin ne kadar etkileşim aldığını, takipçi büyüme eğrisini ve reklamların performansını şeffaf biçimde aktarıyoruz.",
      ]}
      features={[
        { icon: "📅", title: "Aylık İçerik Takvimi", desc: "Her ay başında onaylı içerik takvimi ile ne zaman, ne paylaşılacağını biliyorsunuz." },
        { icon: "🎨", title: "Özgün Görsel & Video Üretimi", desc: "Marka kimliğinize uygun profesyonel görseller, Reels ve TikTok videoları hazırlıyoruz." },
        { icon: "🎥", title: "Yerinde Çekim Hizmeti", desc: "Ekibimiz mağazanıza veya ofisine gelerek ürün ve mekan videolarını profesyonelce çeker." },
        { icon: "🤖", title: "Yapay Zeka Destekli İçerik", desc: "AI araçlarıyla hızlı görsel üretimi, metin yazarlığı ve içerik optimizasyonu sağlıyoruz." },
        { icon: "💬", title: "Topluluk Yönetimi", desc: "Yorum ve mesajlara hızlı, samimi yanıtlarla takipçi bağlılığı oluşturuyoruz." },
        { icon: "📊", title: "Şeffaf Raporlama", desc: "Etkileşim, erişim ve büyüme verilerini haftalık veya aylık raporlarla aktarıyoruz." },
        { icon: "🔍", title: "Hashtag & SEO", desc: "Platformun arama algoritmalarına uygun hashtag ve açıklama stratejisi." },
        { icon: "📈", title: "Büyüme Stratejisi", desc: "Organik büyümeyi hızlandırmak için sürekli güncellenen içerik ve yayın stratejisi." },
      ]}
      pricing={[
        {
          name: "Başlangıç",
          price: "19.900",
          desc: "Sosyal medyada ilk adımını atmak isteyen işletmeler için.",
          features: [
            "Instagram & Facebook yönetimi",
            "Haftada 3 paylaşım",
            "10.000 ₺'ye kadar reklam kampanyası yönetimi",
            "Aylık raporlama",
            "Topluluk yönetimi",
          ],
        },
        {
          name: "Büyüme",
          price: "29.900",
          desc: "Hızlı büyümek isteyen markalar için çok kanallı paket.",
          featured: true,
          features: [
            "Instagram, Facebook & TikTok yönetimi",
            "Haftada 5 paylaşım",
            "50.000 ₺'ye kadar reklam kampanyası yönetimi",
            "Google İşletme yönetimi",
            "Giriş seviye Google Ads",
            "Haftalık raporlama",
          ],
        },
        {
          name: "Kurumsal",
          price: "39.900",
          desc: "Dijital varlığını güçlendirmek isteyen kurumsal markalar için.",
          features: [
            "Instagram, Facebook & TikTok yönetimi",
            "Haftada 7 paylaşım",
            "100.000 ₺'ye kadar reklam yönetimi",
            "Google İşletme yönetimi",
            "Kapsamlı Google Ads yönetimi",
            "Haftalık raporlama",
          ],
        },
        {
          name: "Elite",
          price: "59.900",
          desc: "Size özel çözümler, web desteği ve SEO avantajları.",
          features: [
            "Tüm platformlar tam yönetim",
            "Haftada 7+ paylaşım",
            "Sınırsız reklam bütçesi yönetimi",
            "Kapsamlı Google Ads & İşletme",
            "Web sitesi tasarım & desteği",
            "SEO optimizasyonu",
            "Özel dijital strateji & danışmanlık",
          ],
        },
      ]}
      faq={[
        {
          q: "Paylaşılacak içerikleri kim hazırlıyor?",
          a: "İçeriklerin tamamını markaizi ekibi hazırlar: metin yazarlığı, görsel tasarım ve video montaj. Her ay başında içerik takvimini sizinle paylaşır, onayınızı alırız. Sonrasında tüm planlama, zamanlama ve yayınlamayı biz yönetiriz.",
        },
        {
          q: "Ayda kaç paylaşım yapılıyor?",
          a: "Paketinize göre değişir: Başlangıç pakedinde haftada 3, Büyüme pakedinde haftada 5, Kurumsal ve Elite paketlerde haftada 7+ paylaşım yapılır. Bu paylaşımlara feed gönderileri, Reels videoları ve Story içerikleri dahildir.",
        },
        {
          q: "Hesabımın şifresini paylaşmak zorunda mıyım?",
          a: "Hayır. Instagram ve Facebook için hesabınıza 'Yönetici' yetkisi vermeniz yeterli — şifrenizi asla talep etmiyoruz. Bu sayede hesabınızın kontrolü tamamen sizde kalır.",
        },
        {
          q: "Ne zaman takipçi ve etkileşim artışı görürüm?",
          a: "Organik sosyal medya büyümesinde ilk anlamlı sonuçlar genellikle 2–3. ayda görülür. Tutarlılık burada en kritik faktördür; düzenli ve kaliteli içerik yayını, zamanla erişimi ve etkileşimi geometrik biçimde artırır.",
        },
      ]}
    />
  );
}
