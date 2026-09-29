import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";
import LegalPageTemplate from "@/components/LegalPageTemplate";
import SellerInfo from "@/components/SellerInfo";
import { LEGAL_UPDATED } from "@/lib/company";

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi",
  description: "markaizi Dijital Reklam Ajansı hizmetlerinin online ödeme ile satın alınmasına ilişkin mesafeli satış (hizmet) sözleşmesi.",
  alternates: { canonical: "https://markaizi.com.tr/mesafeli-satis-sozlesmesi" },
};

export default function MesafeliSatisPage() {
  return (
    <>
      <Navbar />
      <LegalPageTemplate
        badge="Yasal"
        title="Mesafeli Satış Sözleşmesi"
        subtitle="markaizi hizmetlerinin ödeme linki üzerinden online olarak satın alınmasına ilişkin sözleşmedir."
        lastUpdated={LEGAL_UPDATED}
      >
        <h2>1. Taraflar</h2>
        <p><strong>SATICI</strong></p>
        <SellerInfo />
        <p>
          <strong>ALICI:</strong> Ödeme sayfasında adı soyadı, e-posta adresi, telefon numarası ve fatura adresi girilen
          kişi veya kurum. Alıcı bilgileri, ödeme sırasında girilen bilgilerdir.
        </p>

        <h2>2. Sözleşmenin Konusu</h2>
        <p>
          Bu sözleşmenin konusu, alıcının satıcı tarafından kendisine iletilen ödeme linki üzerinden elektronik ortamda
          satın aldığı ve ödeme sayfasında adı, kapsamı ve bedeli belirtilen dijital pazarlama hizmetinin sunulmasına ve
          bedelin ödenmesine ilişkin olarak, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler
          Yönetmeliği hükümleri uyarınca tarafların hak ve yükümlülüklerinin belirlenmesidir.
        </p>

        <h2>3. Hizmet, Bedel ve Ödeme</h2>
        <ul>
          <li>Hizmetin adı, kapsamı ve bedeli ödeme sayfasında yer alır. Gösterilen bedel <strong>KDV dahil</strong> toplam bedeldir.</li>
          <li>Hizmetin ayrıntılı kapsamı, teslim takvimi ve raporlama esasları, taraflar arasında yapılan teklif veya ayrı hizmet sözleşmesiyle belirlenir. Bu belgeler ile bu sözleşme birbirinin tamamlayıcısıdır.</li>
          <li>Ödeme, kredi kartı veya banka kartı ile PayTR Ödeme ve Elektronik Para Kuruluşu A.Ş. altyapısı üzerinden yapılır. Kart bilgileri satıcıya iletilmez.</li>
          <li>Taksitli ödemelerde vade farkı ve taksit koşulları, kart sahibinin bankası ile arasındaki sözleşmeye tabidir ve ödeme ekranında gösterilir.</li>
          <li>Reklam platformlarına yatırılacak reklam bütçesi hizmet bedeline dahil değildir.</li>
          <li>Hizmet bedeline ilişkin fatura, alıcının ödeme sırasında bildirdiği bilgilere göre düzenlenir.</li>
        </ul>

        <h2>4. İfa ve Hizmetin Başlaması</h2>
        <p>
          Satıcı, ödemenin kendisine ulaştığının teyit edilmesinin ardından alıcıyla iletişime geçerek hizmete başlama
          tarihini belirler. Hizmete alıcının onayıyla başlanır. Hizmet, sözleşmenin kurulmasından itibaren en geç 30 gün
          içinde başlatılır; bu süre içinde başlatılamayacaksa alıcı bilgilendirilir ve talebi hâlinde ödediği bedelin
          tamamı iade edilir.
        </p>

        <h2>5. Tarafların Yükümlülükleri</h2>
        <ul>
          <li>Satıcı, hizmeti teklif veya hizmet sözleşmesinde belirtilen kapsam ve özenle sunar.</li>
          <li>Alıcı, hizmetin sunulması için gereken bilgi, içerik, hesap erişimi ve onayları zamanında sağlar. Alıcı kaynaklı gecikmeler hizmet takvimine yansır.</li>
          <li>Reklam ve sosyal medya çalışmalarında belirli bir satış, takipçi veya etkileşim sonucu taahhüt edilmez; satıcı, hizmeti özenle yürütme ve düzenli raporlama yükümlülüğü altındadır.</li>
          <li>Reklam hesapları, sosyal medya hesapları ve bunlara ait veriler alıcıya aittir.</li>
        </ul>

        <h2>6. Cayma Hakkı</h2>
        <p>
          Tüketici sıfatıyla hizmet alan alıcı, sözleşmenin kurulduğu tarihten itibaren <strong>14 gün</strong> içinde
          herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir. Mesafeli
          Sözleşmeler Yönetmeliği&apos;nin 15. maddesi uyarınca, <strong>cayma hakkı süresi sona ermeden önce alıcının
          onayıyla ifasına başlanan hizmetlerde cayma hakkı kullanılamaz.</strong>
        </p>
        <p>
          Cayma bildirimi süresi içinde <a href="mailto:markaizicom@gmail.com">markaizicom@gmail.com</a> adresine e-posta ile
          ya da yazılı olarak satıcının adresine iletilir. Cayma hakkının kullanılması hâlinde satıcı, bildirimin kendisine
          ulaştığı tarihten itibaren en geç <strong>14 gün</strong> içinde tahsil ettiği bedelin tamamını, alıcının ödemede
          kullandığı karta iade eder.
        </p>

        <h2>7. İptal ve İade</h2>
        <p>
          Hizmete başlanmadan önce yapılan iptallerde ödenen bedelin tamamı iade edilir. Hizmete başlandıktan sonra, ödemesi
          yapılmış dönemin bedeli iade edilmez; sonraki dönemlere ait hizmetler iptal edilir ve bunlar için ödeme alınmaz.
          Ayrıntılar <a href="/iptal-ve-iade-kosullari">İptal ve İade Koşulları</a> sayfasındadır.
        </p>

        <h2>8. Kişisel Veriler</h2>
        <p>
          Alıcının ödeme sırasında paylaştığı kişisel veriler, <a href="/kvkk">KVKK Aydınlatma Metni</a> ve{" "}
          <a href="/gizlilik-politikasi">Gizlilik Politikası</a> kapsamında işlenir. Ödeme işlemi için gerekli bilgiler
          PayTR ile paylaşılır.
        </p>

        <h2>9. Uyuşmazlıkların Çözümü</h2>
        <p>
          Tüketici alıcılar, uyuşmazlık hâlinde Ticaret Bakanlığı&apos;nca ilan edilen parasal sınırlar dahilinde Tüketici
          Hakem Heyetleri&apos;ne veya Tüketici Mahkemeleri&apos;ne başvurabilir. Tüketici sayılmayan alıcılarla doğacak
          uyuşmazlıklarda Ankara Mahkemeleri ve İcra Daireleri yetkilidir.
        </p>

        <h2>10. Yürürlük</h2>
        <p>
          Alıcı, ödeme sayfasında <a href="/on-bilgilendirme-formu">Ön Bilgilendirme Formu</a>&apos;nu ve bu sözleşmeyi
          okuyup onayladığını işaretleyerek ödemeyi tamamladığında bu sözleşme kurulmuş sayılır ve yürürlüğe girer.
        </p>
      </LegalPageTemplate>
      <Footer />
      <WhatsApp />
    </>
  );
}
