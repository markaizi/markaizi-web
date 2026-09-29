import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";
import LegalPageTemplate from "@/components/LegalPageTemplate";
import SellerInfo from "@/components/SellerInfo";
import { LEGAL_UPDATED } from "@/lib/company";

export const metadata: Metadata = {
  title: "İptal ve İade Koşulları",
  description: "markaizi Dijital Reklam Ajansı hizmetlerinde iptal, cayma ve iade koşulları; kartla yapılan ödemelerin iadesi.",
  alternates: { canonical: "https://markaizi.com.tr/iptal-ve-iade-kosullari" },
};

export default function IptalIadePage() {
  return (
    <>
      <Navbar />
      <LegalPageTemplate
        badge="Yasal"
        title="İptal ve İade Koşulları"
        subtitle="Online ödeme ile satın alınan markaizi hizmetlerinde iptal, cayma ve iade nasıl işler?"
        lastUpdated={LEGAL_UPDATED}
      >
        <h2>1. Kapsam</h2>
        <p>
          Bu koşullar, markaizi Dijital Reklam Ajansı&apos;nın ödeme linki üzerinden kredi kartı veya banka kartıyla ödemesi
          alınan hizmetleri için geçerlidir. Satılan ürün fiziksel bir mal değil, dijital pazarlama hizmetidir; bu nedenle
          kargo ve ürün iadesi söz konusu değildir.
        </p>

        <h2>2. Hizmete Başlanmadan Önce İptal</h2>
        <p>
          Hizmete başlanmadan önce yapılan iptal taleplerinde ödenen bedelin <strong>tamamı</strong> iade edilir.
        </p>

        <h2>3. Hizmete Başlandıktan Sonra İptal</h2>
        <p>
          Hizmete alıcının onayıyla başlandıktan sonra, <strong>ödemesi yapılmış dönemin bedeli iade edilmez.</strong> İptal
          talebi, sonraki dönemlere ait hizmetlerin durdurulması olarak uygulanır ve bu dönemler için ödeme alınmaz.
        </p>

        <h2>4. Tüketiciler İçin Cayma Hakkı</h2>
        <p>
          Tüketici sıfatıyla hizmet alan alıcılar, sözleşmenin kurulduğu tarihten itibaren <strong>14 gün</strong> içinde
          gerekçe göstermeksizin cayma hakkına sahiptir. Mesafeli Sözleşmeler Yönetmeliği&apos;nin 15. maddesi uyarınca,
          cayma süresi dolmadan <strong>alıcının onayıyla ifasına başlanan hizmetlerde cayma hakkı kullanılamaz.</strong>{" "}
          Hizmete başlanmadan önce kullanılan cayma hakkında bedelin tamamı iade edilir.
        </p>

        <h2>5. Reklam Bütçesi</h2>
        <p>
          Meta, Google, TikTok gibi reklam platformlarına alıcı adına veya alıcı tarafından yatırılan ve harcanan reklam
          bütçesi, satıcının hizmet bedeline dahil olmadığından satıcı tarafından iade edilmez. Platformlarda harcanmamış
          bakiyelerin iadesi ilgili platformun kurallarına tabidir.
        </p>

        <h2>6. İptal veya Cayma Talebi Nasıl Yapılır?</h2>
        <p>
          Talebinizi ad soyad, ödeme tarihi, ödenen tutar ve ödeme sayfasındaki hizmet adıyla birlikte{" "}
          <a href="mailto:markaizicom@gmail.com">markaizicom@gmail.com</a> adresine e-posta ile, WhatsApp hattımızdan
          (+90 552 077 27 00) ya da yazılı olarak aşağıdaki adrese iletebilirsiniz. Talebiniz alındığında size bilgi verilir.
        </p>

        <h2>7. İadenin Yapılması</h2>
        <ul>
          <li>Onaylanan iadeler, iade talebinin satıcıya ulaştığı tarihten itibaren en geç <strong>14 gün</strong> içinde yapılır.</li>
          <li>İade, ödemede kullanılan <strong>kredi veya banka kartına</strong>, PayTR altyapısı üzerinden yapılır; nakit veya farklı bir hesaba iade yapılmaz.</li>
          <li>İadenin kart ekstresine yansıma süresi bankanıza bağlıdır ve genellikle birkaç iş günü sürer.</li>
          <li>Taksitli ödemelerde iade, bankanın uygulamasına göre taksitler hâlinde yansıyabilir.</li>
        </ul>

        <h2>8. Satıcı Bilgileri</h2>
        <SellerInfo />
      </LegalPageTemplate>
      <Footer />
      <WhatsApp />
    </>
  );
}
