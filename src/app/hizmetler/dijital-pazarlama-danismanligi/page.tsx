import { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Dijital Pazarlama Danışmanlığı — Uzaktan Sosyal Medya & Reklam Danışmanlığı | markaizi",
  description:
    "Kendi ekibiyle çalışmak isteyen markalara dijital pazarlama danışmanlığı: içerik ve paylaşım planı, video senaryoları, reklam stratejisi ve düzenli uzaktan yönlendirme. Ankara merkezli, Türkiye geneli.",
  keywords:
    "dijital pazarlama danışmanlığı, sosyal medya danışmanlığı, reklam danışmanlığı, uzaktan sosyal medya danışmanı, instagram danışmanlığı, meta reklam danışmanlığı, dijital pazarlama danışmanı ankara, kobi dijital pazarlama danışmanlığı",
  alternates: { canonical: "https://markaizi.com.tr/hizmetler/dijital-pazarlama-danismanligi" },
};

const ICON = (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" style={{ stroke: "#c084fc" }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 5h16v10H9l-5 4V5z" />
    <path d="M8 9h8M8 12h5" />
  </svg>
);

export default function DanismanlikPage() {
  return (
    <ServicePageTemplate
      badge="Danışmanlık"
      icon={ICON}
      path="/hizmetler/dijital-pazarlama-danismanligi"
      relatedPosts={[
        { slug: "ankara-mobilya-magazasi-sosyal-medya-buyume-rehberi", title: "Kendi Başınıza mı, Ajansla mı?" },
        { slug: "instagram-algoritmasi", title: "Instagram Algoritması 2026" },
      ]}
      title="Dijital Pazarlama Danışmanlığı"
      subtitle="İşi sizin ekibiniz yapar, yolu biz gösteririz. Ne paylaşılacağını, nasıl çekileceğini ve hangi reklamın verileceğini birlikte planlıyor, süreci uzaktan yönlendiriyoruz."
      description={[
        "Her işletme sosyal medyasını tamamen bir ajansa devretmek istemez. Kimisinin ekibinde zaten telefonla güzel video çeken bir çalışan vardır, kimisi ürününü en iyi kendisinin anlatacağını düşünür, kimisi de bütçesini ajans ücretinden çok reklama ayırmak ister. Bu işletmelerin çoğunun eksik olan şeyi emek değil, yön: neyi, ne zaman, nasıl yapacaklarını bilmemek.",
        "Danışmanlık hizmetimiz tam bu boşluğu doldurur. Hesabınızı, rakiplerinizi ve hedef müşterinizi inceleyip size özel bir yol haritası çıkarırız. Aylık paylaşım planını, çekilecek videoların senaryolarını ve verilecek reklamların kurgusunu hazırlarız; ekibiniz uygular, biz düzenli görüşmelerle yönlendirir ve düzeltiriz.",
        "Tüm süreç uzaktan yürür: görüntülü toplantılar, paylaşılan planlama belgeleri ve mesajlaşma üzerinden. Bu sayede Türkiye'nin neresinde olursanız olun, sektörünüzü tanıyan bir ekipten destek alabilirsiniz.",
      ]}
      features={[
        { icon: "search", title: "Mevcut Durum Analizi", desc: "Hesaplarınız, reklam geçmişiniz ve rakipleriniz incelenir; neyin çalışıp neyin çalışmadığı yazılı raporlanır." },
        { icon: "calendar", title: "Aylık Paylaşım Planı", desc: "Hangi gün, hangi formatta, hangi konuda paylaşım yapılacağını gösteren uygulanabilir takvim." },
        { icon: "pen", title: "Video Senaryoları", desc: "Ekibinizin telefonla çekebileceği kısa video senaryoları: açılış cümlesi, çekim açısı, süre ve kapanış." },
        { icon: "target", title: "Reklam Stratejisi", desc: "Hangi ürüne, hangi kitleye, ne kadar bütçeyle reklam verileceği; kampanya kurgusu ve takip ölçütleri." },
        { icon: "chat", title: "Düzenli Yönlendirme", desc: "Periyodik görüntülü görüşmelerle sonuçlara birlikte bakar, planı güncelleriz. Aradaki sorular için mesaj hattı." },
        { icon: "chart", title: "Ölçüm ve Raporlama", desc: "Beğeni değil sonuç: gelen mesaj, arama ve satış etkisini takip edebileceğiniz basit bir ölçüm düzeni." },
      ]}
      faq={[
        {
          q: "Danışmanlık ile sosyal medya yönetimi arasındaki fark nedir?",
          a: "Sosyal medya yönetiminde içerik üretimi, paylaşım ve reklam yönetimini biz yaparız. Danışmanlıkta ise uygulamayı sizin ekibiniz yapar; biz ne yapılacağını planlar, senaryoları ve reklam kurgusunu hazırlar, sonuçlara bakarak yön veririz. Ekibinde uygulayacak kişi olan ve kontrolü elinde tutmak isteyen işletmeler için daha uygundur.",
        },
        {
          q: "Danışmanlık tamamen uzaktan mı yürüyor?",
          a: "Evet. Görüşmeler görüntülü yapılır, planlar ve senaryolar ortak belgelerde paylaşılır, arada çıkan sorular mesajla yanıtlanır. Bu sayede Türkiye'nin her yerinden işletmelerle çalışabiliyoruz. İsterseniz başlangıç görüşmesini yüz yüze de yapabiliriz.",
        },
        {
          q: "Hangi işletmeler danışmanlıktan en çok fayda görür?",
          a: "Ekibinde içerik çekebilecek ya da reklam paneline girebilecek bir çalışanı olan, ama neyi nasıl yapacağından emin olmayan işletmeler. Özellikle mağazası olan yerel işletmeler, üreticiler ve tam zamanlı ajans ücretini henüz ayırmak istemeyen büyüyen markalar.",
        },
        {
          q: "Reklamları kim veriyor?",
          a: "Danışmanlık modelinde reklamlar sizin hesabınızdan, sizin ekibiniz tarafından verilir; biz kampanya kurgusunu, hedeflemeyi ve metinleri hazırlar, kurulumu birlikte kontrol ederiz. İsterseniz reklam yönetimini ayrıca bize devredebilirsiniz.",
        },
        {
          q: "Danışmanlık ücretlendirmesi nasıl yapılıyor?",
          a: "Görüşme sıklığına, hazırlanacak plan ve senaryo miktarına göre işletmenize özel teklif hazırlıyoruz. İlk analiz görüşmesi ücretsizdir; ihtiyacınızı netleştirdikten sonra kapsamı ve ücreti yazılı olarak paylaşırız.",
        },
        {
          q: "Danışmanlıktan sonra ekibim kendi başına devam edebilir mi?",
          a: "Hedefimiz de bu. Planları ve senaryoları nedenleriyle birlikte hazırladığımız için ekibiniz zamanla mantığı öğrenir. Daha yapılandırılmış bir öğrenme isterseniz kurumsal eğitim hizmetimizle birleştirebilirsiniz.",
        },
      ]}
    />
  );
}
