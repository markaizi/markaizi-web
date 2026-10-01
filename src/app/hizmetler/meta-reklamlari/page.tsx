import { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: { absolute: "Meta Reklamları Ankara & Türkiye Geneli — Instagram & Facebook Reklam | markaizi" },
  description: "Ankara'da Meta (Instagram & Facebook) reklam yönetimi. Mobilyacı, avizeci, aksesuarcı ve yerel işletmelere ROAS odaklı, hedef kitleye özel Meta Ads kampanyaları. Türkiye genelinde uzaktan hizmet.",
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
      path="/hizmetler/meta-reklamlari"
      relatedPosts={[
        { slug: "meta-ads-roas", title: "Meta Ads'de ROAS Artırma" },
        { slug: "meta-pixel-conversions-api-rehberi", title: "Meta Pixel ve Conversions API Rehberi" },
        { slug: "ajans-degistirirken-reklam-hesabi-devri", title: "Ajans Değiştirirken Hesap Devri" },
      ]}
      title="Meta Reklamları"
      subtitle="Instagram ve Facebook'ta tam hedefleme gücüyle reklam kampanyaları kuruyoruz. Yatırımınızın karşılığını maksimize etmek için veriyi merkeze koyuyoruz."
      description={[
        "Meta Ads (Facebook & Instagram Reklamları), işletmenizin doğru kitleyle tam doğru anda buluşmasını sağlayan en güçlü dijital reklam platformlarından biridir. Coğrafi konum, yaş, ilgi alanı, davranış ve benzeri hedefleme seçenekleriyle reklamınız yalnızca potansiyel müşterilere ulaşır.",
        "markaizi olarak kampanya kurulum ve optimizasyonunun yanı sıra kreatif tasarımını da üstleniyoruz. A/B testleriyle hangi görselin, hangi metnin daha iyi dönüşüm sağladığını bulup bütçenizi sürekli optimize ediyoruz.",
        "Yeniden hedefleme (retargeting) kampanyaları ile sitenizi ziyaret eden ya da ürünlerinizi inceleyen kullanıcılara hatırlatma reklamları gösteriyoruz. Benzer kitle (lookalike) stratejisiyle ise mevcut müşterilerinize benzer yeni kullanıcılara ulaşıyoruz.",
      ]}
      features={[
        { icon: "target", title: "Hassas Hedefleme", desc: "Yaş, konum, ilgi alanı ve davranış verisiyle tam hedef kitleye ulaşın." },
        { icon: "refresh", title: "Retargeting", desc: "Siteyi ziyaret eden ama satın almayan kullanıcıları geri kazanın." },
        { icon: "users", title: "Lookalike Kitle", desc: "Mevcut müşterilerinize benzer yeni kullanıcıları keşfedin." },
        { icon: "flask", title: "A/B Test", desc: "Farklı görsel ve metin kombinasyonları test ederek en iyi sonucu bulun." },
        { icon: "wallet", title: "Bütçe Optimizasyonu", desc: "En düşük maliyetle en fazla dönüşümü sağlayacak bütçe dağılımı." },
        { icon: "chart", title: "Haftalık Raporlama", desc: "Tıklama, dönüşüm, ROAS ve maliyet verilerini şeffaf raporlarla görün." },
      ]}
      approach={{
        "title": "Meta'nın Yapay Zekası Çağında Reklamı Yönetmek",
        "paragraphs": [
          "Birkaç yıl önce Meta reklamlarında işin büyük kısmı hedeflemeydi: hangi ilgi alanını seçelim, hangi yaş grubunu dışarıda bırakalım. Bugün Meta'nın yapay zeka ve otomasyon sistemleri, reklamın kime gösterileceğine büyük ölçüde kendisi karar veriyor; kimin izlediğini, tıkladığını, mesaj attığını ve satın aldığını izleyerek öğreniyor. Hatta gereğinden dar hedefleme, sistemin öğrenme alanını kısıtlayabiliyor.",
          "Bu, reklam yöneticisinin işini ortadan kaldırmadı; yerini değiştirdi. Bizim işimiz artık algoritmanın eline doğru malzemeyi vermek: doğru kampanya hedefi, doğru ölçüm, doğru teklif ve özellikle doğru kreatif. 'Yeni evlenecekler, mobilya alırken buna dikkat edin' diye başlayan bir video, kime konuştuğunu daha ilk saniyede söyler ve hem izleyiciye hem sisteme güçlü bir sinyal verir. Kreatif artık hedeflemenin bir parçası; ama hedef kitleyi bilmek hâlâ her şeyin başı."
        ],
        "videoText": "Meta'nın yapay zekası, hedefleme ve kreatif ilişkisini videoda ayrıntılı anlattık.",
        "videoSlug": "isletmeler-icin-dijital-pazarlama-ve-reklam-rehberi"
      }}
      faq={[
        {
          q: "Meta (Facebook & Instagram) reklamları için minimum bütçe nedir?",
          a: "Meta reklamlarında günlük minimum 100–200 ₺ ile başlanabilir. Bu bütçe, algoritmanın hedef kitlenizi öğrenmesi ve test edebilmesi için yeterli veriyi sağlar. Bütçe ne kadar yüksekse optimizasyon o kadar hızlı oturur. Reklam bütçesi yönetim ücretine dahil değildir; doğrudan Meta'ya yüklenir.",
        },
        {
          q: "Reklam görsellerini ve videolarını kim hazırlıyor?",
          a: "Tüm kreatif içerikleri (görsel tasarım, video montaj, reklam metni) markaizi ekibi hazırlar. Her kampanyada birden fazla kreatif varyasyonu test eder, en iyi performans göstereni ölçeklendiririz. Ürün fotoğraflarınız varsa kullanırız; yoksa AI destekli içerik üretimiyle de destekleriz.",
        },
        {
          q: "Hangi sektörler Meta reklamlarından en çok fayda görür?",
          a: "Görsel ağırlıklı ve geniş kitleye hitap eden sektörler öne çıkar: mobilya, dekorasyon, giyim ve aksesuar, güzellik & estetik, restoran & kafe, klinik ve sağlık hizmetleri. Yine de doğru hedefleme ve kreatifle hemen her işletme Meta'da sonuç alabilir.",
        },
        {
          q: "Reklam sonuçlarını nasıl takip ederim?",
          a: "Haftalık ve aylık raporları e-posta ile iletiyoruz. Erişim, tıklama, dönüşüm ve harcama gibi tüm metrikleri şeffaf şekilde paylaşıyoruz. İsterseniz reklam hesabınıza kendi giriş bilgilerinizle anlık erişim de sağlayabilirsiniz.",
        },
        {"q": "Meta'nın yapay zekası reklamları artık kendisi mi yönetiyor?", "a": "Kısmen. Reklamın kime gösterileceği konusunda algoritmanın rolü çok arttı ve sistem kullanıcı davranışlarından öğreniyor. Ama doğru kampanya hedefi, ölçüm altyapısı, teklif ve kreatif olmadan algoritma doğru kişiyi bulamaz. Reklam yönetimi bugün daha çok bu malzemeyi hazırlamak, test etmek ve sonuçları yorumlamaktır."},
        {"q": "Ucuz mesaj getiren reklam iyi reklam mıdır?", "a": "Her zaman değil. 10 TL'ye 100 mesaj getirip satış çıkarmayan bir reklam, 30 TL'ye 40 mesaj getirip 8 satış çıkaran reklamdan daha kötüdür. Bu yüzden mesaj maliyetinin yanında, gelen mesajların kaçının gerçek müşteriye ve satışa dönüştüğüne de bakıyoruz."},
      ]}
    />
  );
}
