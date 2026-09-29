import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";
import LegalPageTemplate from "@/components/LegalPageTemplate";
import SellerInfo from "@/components/SellerInfo";
import { LEGAL_UPDATED } from "@/lib/company";

export const metadata: Metadata = {
  title: "Ön Bilgilendirme Formu",
  description: "markaizi Dijital Reklam Ajansı hizmetlerinin online ödeme ile satın alınmasına ilişkin ön bilgilendirme formu.",
  alternates: { canonical: "https://markaizi.com.tr/on-bilgilendirme-formu" },
};

export default function OnBilgilendirmePage() {
  return (
    <>
      <Navbar />
      <LegalPageTemplate
        badge="Yasal"
        title="Ön Bilgilendirme Formu"
        subtitle="6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca, sözleşme kurulmadan önce alıcıya sunulan bilgilerdir."
        lastUpdated={LEGAL_UPDATED}
      >
        <h2>1. Satıcı Bilgileri</h2>
        <SellerInfo />

        <h2>2. Hizmetin Temel Nitelikleri</h2>
        <p>
          Satıcı; sosyal medya yönetimi, Meta (Instagram/Facebook), Google ve TikTok reklam yönetimi, içerik ve video
          üretimi, web tasarım, danışmanlık ve eğitim gibi dijital pazarlama hizmetleri sunar. Online ödemeye konu hizmetin
          adı ve kapsamı, alıcıya iletilen ödeme linkinin sayfasında (&ldquo;ödeme sayfası&rdquo;) yer alır. Hizmetin
          ayrıntılı kapsamı, teslim takvimi ve raporlama esasları taraflar arasında yapılan teklif veya hizmet sözleşmesiyle
          belirlenir.
        </p>

        <h2>3. Fiyat ve Ödeme</h2>
        <ul>
          <li>Ödeme sayfasında gösterilen tutar, <strong>KDV dahil</strong> ödenecek toplam bedeldir. Ayrıca bir kargo veya teslimat ücreti yoktur.</li>
          <li>Ödeme; kredi kartı veya banka kartı ile, lisanslı ödeme kuruluşu <strong>PayTR Ödeme ve Elektronik Para Kuruluşu A.Ş.</strong> altyapısı üzerinden alınır.</li>
          <li>Kart bilgileri satıcıya iletilmez ve satıcı tarafından saklanmaz.</li>
          <li>Kart sahibinin bankasının ve PayTR&apos;nin sunduğu taksit seçenekleri ödeme ekranında gösterilir. Taksitli işlemlerde bankanın uyguladığı vade farkı ödeme ekranında belirtilir.</li>
          <li>Reklam platformlarına (Meta, Google, TikTok vb.) yatırılan reklam bütçesi, hizmet bedeline dahil değildir ve doğrudan ilgili platforma ödenir.</li>
        </ul>

        <h2>4. İfa (Hizmetin Sunulması)</h2>
        <p>
          Hizmetler elektronik ortamda ve gerektiğinde alıcının işyerinde (çekim, eğitim gibi) sunulur. Hizmete başlama
          tarihi, ödeme sonrasında taraflarca belirlenir ve hizmete alıcının onayıyla başlanır. Fiziksel bir ürün teslimatı
          yoktur.
        </p>

        <h2>5. Cayma Hakkı</h2>
        <p>
          Tüketici sıfatıyla hizmet alan alıcı, sözleşmenin kurulduğu (ödemenin yapıldığı) tarihten itibaren
          <strong> 14 gün</strong> içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin cayma hakkına sahiptir.
          Ancak Mesafeli Sözleşmeler Yönetmeliği&apos;nin 15. maddesi uyarınca, <strong>cayma hakkı süresi sona ermeden önce
          alıcının onayıyla ifasına başlanan hizmetlerde cayma hakkı kullanılamaz.</strong>
        </p>
        <p>
          Cayma bildirimi <a href="mailto:markaizicom@gmail.com">markaizicom@gmail.com</a> adresine e-posta ile ya da yazılı
          olarak yukarıdaki adrese iletilebilir. Ayrıntılar için{" "}
          <a href="/iptal-ve-iade-kosullari">İptal ve İade Koşulları</a> sayfasına bakınız.
        </p>
        <p>
          Hizmeti ticari veya mesleki amaçlarla satın alan alıcılar (tacir ve işletmeler) tüketici sayılmadığından, bu
          alıcılar için cayma hakkına ilişkin tüketici mevzuatı hükümleri uygulanmaz; iptal ve iade koşulları sayfasındaki
          genel kurallar geçerlidir.
        </p>

        <h2>6. Şikâyet ve Uyuşmazlıklar</h2>
        <p>
          Şikâyetlerinizi yukarıdaki iletişim kanallarından iletebilirsiniz. Tüketici alıcılar, uyuşmazlık hâlinde Ticaret
          Bakanlığı&apos;nca her yıl belirlenen parasal sınırlar dahilinde yerleşim yerindeki veya işlemin yapıldığı yerdeki
          Tüketici Hakem Heyeti&apos;ne ya da Tüketici Mahkemesi&apos;ne başvurabilir.
        </p>

        <h2>7. Onay</h2>
        <p>
          Alıcı, ödeme sayfasında bu formu ve <a href="/mesafeli-satis-sozlesmesi">Mesafeli Satış Sözleşmesi</a>&apos;ni
          okuduğunu ve onayladığını işaretleyerek ödeme adımına geçer. Bu form, sözleşmenin ayrılmaz bir parçasıdır.
        </p>
      </LegalPageTemplate>
      <Footer />
      <WhatsApp />
    </>
  );
}
