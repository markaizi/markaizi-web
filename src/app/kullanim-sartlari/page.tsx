import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";
import LegalPageTemplate from "@/components/LegalPageTemplate";

export const metadata: Metadata = {
  title: "Kullanım Şartları — markaizi",
  description: "markaizi web sitesi ve hizmetlerine ilişkin kullanım şartları ve koşulları.",
};

export default function KullanimSartlariPage() {
  return (
    <>
      <Navbar />
      <LegalPageTemplate
        badge="Yasal"
        title="Kullanım Şartları"
        subtitle="markaizi.com web sitesini ve hizmetlerini kullanarak aşağıdaki kullanım şartlarını kabul etmiş sayılırsınız."
        lastUpdated="23 Mayıs 2025"
      >
        <h2>1. Taraflar ve Kapsam</h2>
        <p>
          Bu Kullanım Şartları, <strong>markaizi Dijital Reklam Ajansı</strong> (&ldquo;markaizi&rdquo; veya
          &ldquo;Şirket&rdquo;) ile <strong>markaizi.com</strong> web sitesini ziyaret eden veya hizmetlerinden
          yararlanan kullanıcılar (&ldquo;Kullanıcı&rdquo;) arasındaki hukuki ilişkiyi düzenler.
          Web sitemizi kullanmaya devam ederek bu şartları kabul etmiş sayılırsınız.
        </p>

        <h2>2. Hizmet Tanımı</h2>
        <p>
          markaizi; dijital pazarlama, sosyal medya yönetimi, reklam kampanya yönetimi (Meta,
          Google, TikTok), içerik üretimi, web tasarım ve domain & hosting hizmetleri sunmaktadır.
          Hizmet kapsamı, fiyatlandırma ve şartlar ayrı bir hizmet sözleşmesiyle belirlenir.
        </p>

        <h2>3. Kullanım Kuralları</h2>
        <p>Web sitemizi kullanırken aşağıdakileri yapmamayı kabul edersiniz:</p>
        <ul>
          <li>Yasadışı, zararlı veya yanıltıcı içerik paylaşmak</li>
          <li>Üçüncü şahısların fikri mülkiyet haklarını ihlal etmek</li>
          <li>Web sitesinin güvenliğini tehlikeye atacak girişimlerde bulunmak</li>
          <li>Otomatik araçlarla sisteme aşırı yük bindirmek (scraping, bot vb.)</li>
          <li>Başkalarının kimliğine bürünmek</li>
        </ul>

        <h2>4. Fikri Mülkiyet</h2>
        <p>
          Web sitesindeki tüm içerikler (metin, görsel, tasarım, logo, yazılım) markaizi&apos;ye
          veya lisans sahiplerine aittir ve Türk Fikir ve Sanat Eserleri Kanunu kapsamında
          korunmaktadır. İzin alınmadan kopyalanamaz, dağıtılamaz veya ticari amaçla kullanılamaz.
        </p>

        <h2>5. Sorumluluk Sınırı</h2>
        <p>
          markaizi, web sitesinin kesintisiz veya hatasız çalışacağını garanti etmez. Teknik
          arızalar, veri kayıpları veya üçüncü taraf kaynaklı sorunlardan doğan zararlardan
          sorumlu tutulamaz. Hizmet kapsamındaki sorumluluklar ayrı hizmet sözleşmesiyle
          belirlenir.
        </p>

        <h2>6. Üçüncü Taraf Bağlantıları</h2>
        <p>
          Web sitemizde üçüncü taraf web sitelerine bağlantılar bulunabilir. Bu sitelerin
          içeriklerinden ve gizlilik uygulamalarından sorumlu değiliz. Bağlantıları takip
          etmeden önce ilgili sitenin kullanım şartlarını incelemenizi tavsiye ederiz.
        </p>

        <h2>7. Hizmet Sözleşmesi Şartları</h2>
        <p>
          markaizi ile dijital pazarlama veya web tasarım hizmeti almak için ayrı bir hizmet
          sözleşmesi imzalanır. Söz konusu sözleşmede; hizmet kapsamı, ödeme koşulları,
          fesih şartları ve gizlilik hükümleri detaylandırılır. Bu Kullanım Şartları, hizmet
          sözleşmesinin ayrılmaz bir parçasıdır.
        </p>

        <h2>8. Ücretler ve Ödemeler</h2>
        <p>
          Web sitesindeki fiyat bilgileri yalnızca bilgilendirme amaçlıdır. Nihai fiyat,
          ihtiyaç analizi sonrasında hazırlanan teklif ile belirlenir. Ödemeler aylık peşin
          olarak banka havalesi / EFT ile gerçekleştirilir.
        </p>

        <h2>9. Sözleşme Değişiklikleri</h2>
        <p>
          markaizi, bu Kullanım Şartlarını önceden haber vermeksizin güncelleme hakkını
          saklı tutar. Güncel şartlar web sitemizde yayınlanır. Web sitesini kullanmaya
          devam etmeniz, güncel şartları kabul ettiğiniz anlamına gelir.
        </p>

        <h2>10. Uygulanacak Hukuk ve Yetki</h2>
        <p>
          Bu Kullanım Şartları Türk hukukuna tabidir. Herhangi bir uyuşmazlık halinde
          Ankara mahkemeleri ve icra daireleri yetkilidir.
        </p>

        <h2>11. İletişim</h2>
        <p>
          Kullanım şartlarımız hakkında sorularınız için{" "}
          <a href="mailto:markaizicom@gmail.com">markaizicom@gmail.com</a> adresine
          ulaşabilirsiniz.
        </p>
      </LegalPageTemplate>
      <Footer />
      <WhatsApp />
    </>
  );
}
