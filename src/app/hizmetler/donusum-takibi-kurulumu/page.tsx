import { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: { absolute: "Dönüşüm Takibi Kurulumu — Meta Pixel, Conversions API & Google Tag Manager | markaizi" },
  description:
    "Meta Pixel, Conversions API (CAPI), Google Tag Manager, GA4 ve Google Ads dönüşüm takibi kurulumu. WhatsApp, arama, form ve mağazada kapanan satışların reklama doğru ölçülmesi. Ankara merkezli, Türkiye geneli.",
  keywords:
    "dönüşüm takibi kurulumu, meta pixel kurulumu, conversions api kurulumu, capi kurulumu, google tag manager kurulumu, gtm kurulumu, google ads dönüşüm takibi, ga4 kurulumu, whatsapp dönüşüm takibi, çevrimdışı dönüşüm, ankara pixel kurulumu",
  alternates: { canonical: "https://markaizi.com.tr/hizmetler/donusum-takibi-kurulumu" },
};

const ICON = (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" style={{ stroke: "#c084fc" }}>
    <path d="M3 3v18h18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 15l4-4 3 3 5-6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="19" cy="8" r="1.6" strokeWidth="1.5" />
  </svg>
);

export default function DonusumTakibiPage() {
  return (
    <ServicePageTemplate
      badge="Ölçümleme"
      icon={ICON}
      path="/hizmetler/donusum-takibi-kurulumu"
      title="Dönüşüm Takibi Kurulumu"
      subtitle="Meta Pixel, Conversions API, Google Tag Manager ve Google Ads dönüşümlerini kuruyoruz; formdan WhatsApp'a, telefon aramasından mağazada kapanan satışa kadar reklamın gerçekte ne getirdiğini ölçülebilir hale getiriyoruz."
      description={[
        "Reklam sistemleri, kendilerine ne öğretirseniz onu bulur. Meta'ya 'sayfayı görüntüleyen kişi' derseniz sayfa görüntüleyen kişi getirir; 'satın alan kişi' derseniz satın almaya yakın kişiyi aramaya başlar. Dönüşüm takibi eksik ya da hatalıysa algoritma yanlış sinyalle öğrenir ve bütçe, satışa hiç yaklaşmayan kişilere harcanır. Panelde iyi görünen rapor da bu yüzden çoğu zaman yanıltıcıdır.",
        "Kurulumda önce işletmeniz için neyin gerçekten 'sonuç' olduğunu belirliyoruz: bir mobilya mağazası için WhatsApp'tan fiyat sorusu ve mağaza ziyareti, bir klinik için randevu formu, bir e-ticaret sitesi için sepete ekleme ve satın alma. Ardından bu olayları Meta Pixel ve Conversions API ile, Google tarafında Google Tag Manager, GA4 ve Google Ads dönüşümleriyle eksiksiz ve tek sefer sayılacak şekilde kuruyoruz.",
        "Reklam panelinin göremediği son adımı da ihmal etmiyoruz: mağazada ya da telefonda kapanan satış. Satış kayıtlarınızı reklam verisiyle eşleştirdiğimizde hangi kampanyanın tıklama değil gerçekten satış getirdiği netleşir ve bütçe oraya kaydırılabilir. Tüm kurulumu çerez onayına ve KVKK'ya uygun yapıyoruz; ziyaretçi onay vermeden reklam çerezleri çalışmaz.",
      ]}
      features={[
        { icon: "chart", title: "Meta Pixel ve Olaylar", desc: "Sayfa görüntüleme, iletişim, form, sepete ekleme ve satın alma olaylarının doğru tetiklenmesi ve test edilmesi." },
        { icon: "bolt", title: "Conversions API (CAPI)", desc: "Olayların sunucudan da iletilmesi, olay kimliğiyle çift sayımın önlenmesi ve eşleşme kalitesinin artırılması." },
        { icon: "search", title: "Google Ads, GA4 ve GTM", desc: "Google Tag Manager üzerinden GA4 ve Google Ads dönüşümleri; gelişmiş dönüşümler ve doğru dönüşüm değeri." },
        { icon: "chat", title: "WhatsApp ve Arama Takibi", desc: "WhatsApp butonu, telefon tıklaması ve reklamdan gelen aramaların ayrı dönüşüm olarak ölçülmesi." },
        { icon: "cart", title: "Mağaza Satışı Eşleştirme", desc: "Mağazada veya telefonda kapanan satışların reklam verisiyle eşleştirilip platformlara geri bildirilmesi." },
        { icon: "lock", title: "Çerez Onayı ve KVKK", desc: "Onay vermeyen ziyaretçide reklam etiketlerinin çalışmadığı, KVKK'ya uygun ölçüm kurgusu." },
      ]}
      approach={{
        title: "Ölçmediğiniz Şeyi Büyütemezsiniz",
        paragraphs: [
          "Mobilya ve hizmet işletmelerinde satışın büyük kısmı sitede değil, WhatsApp'ta, telefonda ya da mağazada kapanıyor. Bu yüzden 'satın alma' olayı hiç tetiklenmeyen bir hesapta Meta ve Google yalnızca tıklayan kişiyi tanır; tıklayıp gerçekten mağazaya gelen kişiyi tanımaz. Sonuç: ucuz ama satışa dönmeyen mesajlar ve her ay artan müşteri maliyeti.",
          "Bizim kurgumuz basit bir sıra izler. Önce hangi davranışın satışa en yakın olduğunu birlikte tanımlarız; sonra o davranışı eksiksiz ölçeriz; son olarak kampanyaları o davranışa göre optimize ederiz. Satış verinizi düzenli paylaştığınızda bir adım daha ileri gideriz: hangi kampanyanın müşterisinin daha çok satın aldığını görür ve bütçeyi oraya taşırız. Yedi yıllık Alitel Mobilya çalışmasında da bütçenin sürekli verimli alanlara kaydırılabilmesinin temeli buydu.",
        ],
        videoText: "Reklam, ölçüm ve satış zincirinin nasıl birlikte çalıştığını videoda anlattık.",
        videoSlug: "isletmeler-icin-dijital-pazarlama-ve-reklam-rehberi",
      }}
      relatedPosts={[
        { slug: "meta-pixel-conversions-api-rehberi", title: "Meta Pixel ve Conversions API Rehberi" },
        { slug: "reklam-neden-satis-getirmiyor", title: "Reklamınız Neden Satış Getirmiyor?" },
        { slug: "meta-ads-roas", title: "Meta Ads'de ROAS ve Başabaş Noktası" },
      ]}
      faq={[
        {
          q: "Meta Pixel kurulu, yine de Conversions API gerekir mi?",
          a: "Çoğu işletme için evet. Pixel tarayıcıda çalıştığı için reklam engelleyiciler, tarayıcı kısıtlamaları ve çerez reddi nedeniyle olayların bir kısmı Meta'ya hiç ulaşmayabiliyor. Conversions API aynı olayları sunucudan da iletir. İki kanal aynı olay kimliğini taşıdığı için Meta tekrarı ayıklar ve dönüşüm iki kez sayılmaz.",
        },
        {
          q: "Satışlarım WhatsApp'tan ve mağazada oluyor, dönüşüm takibi yine de işe yarar mı?",
          a: "En çok bu işletmelerde fark yaratır. Sitedeki WhatsApp ve arama tıklamalarını ayrı dönüşüm olarak ölçüyor, reklamın kendisinden başlayan WhatsApp sohbetlerini Meta tarafında takip ediyoruz. Mağazada kapanan satışları da düzenli olarak reklam verisiyle eşleştirdiğinizde hangi kampanyanın gerçekten satış getirdiği görünür hale gelir.",
        },
        {
          q: "Dönüşüm takibimin doğru çalışıp çalışmadığını nasıl anlarım?",
          a: "Meta Olay Yöneticisi'nde olayların hangi kaynaktan geldiğine, tekrar sayılıp sayılmadığına ve eşleşme kalitesine; Google Ads'te dönüşüm işleminin durumuna ve sayılan işlemin gerçekten değerli bir eylem olup olmadığına bakılır. Panelde gördüğünüz dönüşüm sayısı ile gerçekte gelen form, mesaj ve satış sayısı arasında büyük fark varsa kurulumda sorun vardır. Ücretsiz reklam hesabı denetimimizde bunu sizin için kontrol ediyoruz.",
        },
        {
          q: "Google Tag Manager'ı neden kullanıyorsunuz?",
          a: "Etiketleri sitenin koduna tek tek gömmek yerine tek bir merkezden yönetmek için. Yeni bir dönüşüm eklemek, bir etiketi çerez onayına bağlamak ya da hatalı bir etiketi kapatmak web geliştiriciye ihtiyaç duymadan, kontrollü ve test edilerek yapılabilir.",
        },
        {
          q: "Hangi web sitesi altyapılarında kurulum yapıyorsunuz?",
          a: "WordPress, WooCommerce, Shopify ve Türkiye'de yaygın hazır e-ticaret altyapılarının çoğunda, ayrıca özel yazılmış sitelerde kurulum yapabiliyoruz; ilk görüşmede sitenizin altyapısına bakıp netleştiriyoruz. Hazır altyapının kendi entegrasyonu varsa önce onu kullanır, eksik kalan olayları Tag Manager ile tamamlarız.",
        },
        {
          q: "Kurulumdan sonra ne kadar sürede sonuç görürüm?",
          a: "Ölçüm kurulduğu gün veri akmaya başlar; ancak reklam sistemlerinin yeni ve doğru sinyalle öğrenmesi birkaç hafta sürer. Bu süre boyunca kampanyaları büyük değişikliklerle bozmadan izlemek, ölçümün getirdiği iyileşmeyi net görmenin en sağlıklı yoludur.",
        },
      ]}
    />
  );
}
