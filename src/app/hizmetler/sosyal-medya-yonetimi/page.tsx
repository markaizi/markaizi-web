import { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: { absolute: "Sosyal Medya Yönetimi Ankara & Türkiye Geneli — markaizi | Instagram, Facebook, TikTok" },
  description: "Ankara'da sosyal medya yönetimi hizmeti. Mobilyacı, avizeci, aksesuarcı, klinik ve yerel işletmelere özel Instagram, Facebook ve TikTok yönetimi. İçerik üretimi ve büyüme stratejileri. Türkiye genelinde uzaktan hizmet.",
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
      path="/hizmetler/sosyal-medya-yonetimi"
      relatedPosts={[
        { slug: "instagram-algoritmasi", title: "Instagram Algoritması 2026" },
        { slug: "mobilya-magazalari-icin-instagram", title: "Instagram'da Mobilya Satışı" },
      ]}
      title="Sosyal Medya Yönetimi"
      subtitle="Markanızın sesini Instagram, Facebook ve TikTok'ta en güçlü şekilde duyuruyoruz. Strateji, içerik ve topluluk yönetimini tamamen üstleniyoruz."
      description={[
        "Sosyal medya, günümüzde bir markanın dijital kimliğinin temel taşıdır. Yalnızca paylaşım yapmak değil; doğru içeriği, doğru kitleye, doğru zamanda ulaştırmak başarıyı belirler.",
        "markaizi olarak hesabınızı baştan sona yönetiyoruz: aylık içerik takvimi oluşturuyoruz, mağazanıza gelerek ürün ve mekan çekimleri yapıyoruz, yapay zeka araçlarıyla hızlı ve tutarlı içerikler üretiyoruz. Yorumlara ve mesajlara düzenli yanıt vererek topluluğunuzu büyütüyoruz.",
        "Her ay detaylı raporlama ile hangi içeriklerin ne kadar etkileşim aldığını, takipçi büyüme eğrisini ve reklamların performansını şeffaf biçimde aktarıyoruz.",
      ]}
      features={[
        { icon: "calendar", title: "Aylık İçerik Takvimi", desc: "Her ay başında onaylı içerik takvimi ile ne zaman, ne paylaşılacağını biliyorsunuz." },
        { icon: "palette", title: "Özgün Görsel & Video Üretimi", desc: "Marka kimliğinize uygun profesyonel görseller, Reels ve TikTok videoları hazırlıyoruz." },
        { icon: "camera", title: "Yerinde Çekim Hizmeti", desc: "Ekibimiz mağazanıza veya ofisine gelerek ürün ve mekan videolarını profesyonelce çeker." },
        { icon: "sparkle", title: "Yapay Zeka Destekli İçerik", desc: "AI araçlarıyla hızlı görsel üretimi, metin yazarlığı ve içerik optimizasyonu sağlıyoruz." },
        { icon: "chat", title: "Topluluk Yönetimi", desc: "Yorum ve mesajlara hızlı, samimi yanıtlarla takipçi bağlılığı oluşturuyoruz." },
        { icon: "chart", title: "Şeffaf Raporlama", desc: "Etkileşim, erişim ve büyüme verilerini haftalık veya aylık raporlarla aktarıyoruz." },
        { icon: "search", title: "Hashtag & SEO", desc: "Platformun arama algoritmalarına uygun hashtag ve açıklama stratejisi." },
        { icon: "growth", title: "Büyüme Stratejisi", desc: "Organik büyümeyi hızlandırmak için sürekli güncellenen içerik ve yayın stratejisi." },
      ]}
      approach={{
        "title": "Daha Çok Paylaşım Değil, Daha Doğru Paylaşım",
        "paragraphs": [
          "Bize en sık gelen taleplerden biri 'her gün paylaşım olsun'. Yeterli bütçe, ekip ve çekim kapasitesi varsa sık paylaşım değerli olabilir. Ama içerik üretmenin bir maliyeti var: fikir, senaryo, çekim, kurgu, kapak ve metin. Sınırlı bir bütçeyi 30 parçaya bölmek, çoğu zaman 'bugün ne atalım' diye düşünülmüş 30 sıradan içerik demek.",
          "Birçok işletmede ayda 12 gerçekten düşünülmüş içerik ve bu içerikleri doğru insanlara ulaştıran küçük bir reklam desteği çok daha fazla iş yapıyor. Her gün paylaşım yapmanız bütün takipçilerinizin her paylaşımı gördüğü anlamına da gelmiyor; insanın içerikte durması, izlemesi, kaydetmesi gerekiyor. Bu yüzden içerik sayısını takvim değil; hedefiniz, bütçeniz ve üretim kapasiteniz belirlemeli. Başarıyı da takipçi sayısıyla değil, gelen mesaj, nitelikli müşteri ve satışla ölçüyoruz."
        ],
        "videoText": "Her gün paylaşım ve takipçi sayısı konusunu videoda örneklerle anlattık.",
        "videoSlug": "isletmeler-icin-dijital-pazarlama-ve-reklam-rehberi"
      }}
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
        {"q": "Sosyal medyada her gün paylaşım yapmak zorunda mıyım?", "a": "Hayır. Kaliteyi koruyabiliyorsanız sık paylaşım faydalı olabilir; ama sınırlı bütçede 30 sıradan içerik yerine daha az sayıda güçlü içerik üretip bunları reklamla doğru kişilere ulaştırmak genellikle daha verimlidir. Doğru sayı işletmeye göre değişir; bazı e-ticaret markalarında her gün paylaşmak mantıklıyken bazı işletmelerde haftada iki-üç güçlü içerik yeterlidir."},
        {"q": "Takipçi sayısı ne kadar önemli?", "a": "Hedefiniz topluluk büyütmekse önemli, satışsa tek başına yanıltıcı. 5 bin doğru takipçisi olan bir işletme, 20 bin takipçili bir hesaptan çok daha fazla satış yapabilir. Raporlarımızda takipçiden çok doğru kişiye ulaşım, mesaj, nitelikli müşteri ve satışa katkıya bakıyoruz."},
      ]}
    />
  );
}
