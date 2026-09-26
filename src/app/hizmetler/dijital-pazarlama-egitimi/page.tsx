import { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Kurumsal Dijital Pazarlama Eğitimi — Video Çekimi, Senaryo & Reklam Eğitimi | markaizi",
  description:
    "Firma çalışanlarına uygulamalı dijital pazarlama eğitimi: telefonla video çekimi, senaryo yazımı, Instagram içerik planı ve Meta/Google reklam yönetimi. Ekibiniz kendi reklamını yönetebilsin.",
  keywords:
    "kurumsal dijital pazarlama eğitimi, sosyal medya eğitimi, reklam verme eğitimi, meta reklam eğitimi, google ads eğitimi, video çekim eğitimi, senaryo yazma eğitimi, çalışanlara sosyal medya eğitimi, firma içi eğitim",
  alternates: { canonical: "https://markaizi.com.tr/hizmetler/dijital-pazarlama-egitimi" },
};

const ICON = (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" style={{ stroke: "#c084fc" }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 8l10-4 10 4-10 4L2 8z" />
    <path d="M6 10v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
    <path d="M22 8v6" />
  </svg>
);

export default function EgitimPage() {
  return (
    <ServicePageTemplate
      badge="Eğitim"
      icon={ICON}
      path="/hizmetler/dijital-pazarlama-egitimi"
      relatedPosts={[
        { slug: "meta-ads-roas", title: "Meta Ads'de ROAS Artırma" },
        { slug: "google-ads-butce-optimizasyonu", title: "Google Ads Bütçe Optimizasyonu" },
      ]}
      title="Kurumsal Dijital Pazarlama Eğitimi"
      subtitle="Çalışanlarınıza video çekmeyi, senaryo yazmayı ve reklam vermeyi uygulamalı olarak öğretiyoruz; ekibiniz kendi reklamını kendisi yönetebilir hale geliyor."
      description={[
        "Bir işletmenin en iyi içerik üreticisi çoğu zaman kendi çalışanıdır: ürünü en iyi o tanır, müşterinin sorduğu soruları o duyar, mağazada ya da atölyede her gün o vardır. Eksik olan tek şey, bu bilgiyi izlenen bir videoya ve sonuç getiren bir reklama dönüştürecek yöntem.",
        "Eğitimlerimiz ders anlatımından çok atölye çalışmasıdır. Çalışanlarınız kendi ürünlerinizi kendi telefonlarıyla çeker, kendi hesabınız için senaryo yazar ve gerçek reklam panelinde kampanya kurar. Eğitim bittiğinde ellerinde, ertesi gün kullanabilecekleri içerikler ve hazır bir kampanya taslağı olur.",
        "İçeriği ekibinizin seviyesine ve işletmenizin sektörüne göre uyarlıyoruz. Hiç reklam vermemiş bir mağaza ekibi ile reklam panelini kullanan ama sonuç alamayan bir pazarlama ekibinin ihtiyacı aynı değil; eğitim öncesi kısa bir görüşmeyle bu seviyeyi belirliyoruz.",
      ]}
      features={[
        { icon: "camera", title: "Telefonla Video Çekimi", desc: "Işık, açı, ses ve kadraj; ekstra ekipman olmadan ürünü ve mekânı doğru gösteren çekim teknikleri." },
        { icon: "pen", title: "Senaryo Yazımı", desc: "İlk 3 saniyede dikkati tutan açılış, net mesaj ve harekete geçiren kapanış; kısa video senaryosu kurgusu." },
        { icon: "film", title: "Kurgu Temelleri", desc: "CapCut gibi ücretsiz araçlarla kesme, altyazı, müzik ve kapak; paylaşıma hazır Reels üretimi." },
        { icon: "target", title: "Meta Reklam Yönetimi", desc: "Reklam Yöneticisi'nde kampanya kurulumu, hedefleme, bütçe ve WhatsApp'a mesaj kampanyaları." },
        { icon: "search", title: "Google Reklam Temelleri", desc: "Arama reklamı kurulumu, anahtar kelime seçimi, negatif kelimeler ve dönüşüm takibi." },
        { icon: "calendar", title: "İçerik Planı", desc: "Ekibin sürdürebileceği gerçekçi bir paylaşım takvimi ve görev dağılımı." },
      ]}
      approach={{
        "title": "Eğitimin Kalbi: İlk Üç Saniye",
        "paragraphs": [
          "Eğitimlerimizde en çok zaman ayırdığımız konu, bir videonun ilk cümlesi. Çünkü işletmeler reklamda genellikle kendi anlatmak istediklerini anlatıyor: '1998'den beri hizmetinizdeyiz', 'kaliteli hizmet sunuyoruz'. Ama müşteri sabah kalktığında bunu düşünmüyor; kendi problemini düşünüyor: bu evi nasıl döşeyeceğim, bütçem yetecek mi, ürün düğüne yetişir mi?",
          "'Yeni sezon ürünlerimiz mağazamızda' ile 'Yeni evlenecekler, mobilya alırken bu hatayı yapmayın' arasındaki fark, izlenen video ile kaydırılıp geçilen video arasındaki farktır. Çalışanlarınıza müşterinin kafasındaki bu konuşmaya dahil olan açılış cümlelerini yazmayı, aynı ürün için farklı açılardan video fikri üretmeyi ve pahalı ekipman olmadan dikkat çeken çekim yapmayı uygulamalı olarak öğretiyoruz."
        ],
        "videoText": "Kanca, mesaj ve müşterinin kafasındaki konuşmaya dahil olmayı videoda anlattık.",
        "videoSlug": "isletmeler-icin-dijital-pazarlama-ve-reklam-rehberi"
      }}
      faq={[
        {
          q: "Eğitim hangi konuları kapsıyor?",
          a: "Temel başlıklar telefonla video çekimi, kısa video senaryosu yazımı, basit kurgu, içerik planlama ve Meta/Google reklam yönetimidir. Hangi başlıklara ne kadar ağırlık verileceğini ekibinizin seviyesine ve işletmenizin ihtiyacına göre birlikte belirliyoruz.",
        },
        {
          q: "Eğitim yüz yüze mi, çevrim içi mi?",
          a: "İkisi de mümkün. Video çekimi gibi uygulamalı konular işletmenizde yüz yüze yapıldığında daha verimli olur; reklam paneli ve planlama konuları çevrim içi de rahatlıkla işlenebilir. Türkiye'nin farklı şehirlerindeki firmalar için çevrim içi ya da karma bir program kuruyoruz.",
        },
        {
          q: "Çalışanların önceden bilgi sahibi olması gerekiyor mu?",
          a: "Hayır. Akıllı telefon kullanabilen herkes katılabilir. Eğitim öncesi kısa bir görüşmeyle ekibin mevcut seviyesini öğrenip içeriği ona göre uyarlıyoruz.",
        },
        {
          q: "Eğitim sonunda ekibim reklamlarını gerçekten kendisi yönetebilir mi?",
          a: "Eğitim, ekibinizin kampanya kurup takip edebileceği temeli verir ve gerçek hesabınız üzerinde uygulamalı ilerler. Büyük bütçeli ya da karmaşık kampanyalarda deneyim zamanla gelir; bu dönemde ihtiyaç duyarsanız danışmanlık hizmetimizle ekibinize destek olmaya devam edebiliriz.",
        },
        {
          q: "Kaç kişilik gruplara eğitim veriyorsunuz?",
          a: "Uygulamalı bir eğitimin verimli olması için küçük grupları tercih ediyoruz; herkesin kendi telefonuyla çekim yapıp reklam paneline dokunabileceği bir düzen kuruyoruz. Grup büyüklüğüne göre programı birden fazla oturuma bölebiliriz.",
        },
        {
          q: "Eğitim ücreti nasıl belirleniyor?",
          a: "Katılımcı sayısına, oturum sayısına, yüz yüze ya da çevrim içi olmasına göre firmanıza özel teklif hazırlıyoruz. İhtiyacınızı netleştirdiğimiz ilk görüşme ücretsizdir.",
        },
        {"q": "İyi bir reklam videosu nasıl başlamalı?", "a": "İzleyicinin ilk birkaç saniyede 'bu video benimle ilgili' demesini sağlayacak bir cümleyle. Firmanın kendini anlatması yerine müşterinin problemine ya da sorusuna değinen açılışlar çok daha fazla izlenir. Örneğin 'Yeni sezon ürünlerimiz geldi' yerine 'Yeni evlenecekler, mobilya alırken bu hatayı yapmayın' gibi."},
      ]}
    />
  );
}
