import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";
import LegalPageTemplate from "@/components/LegalPageTemplate";

export const metadata: Metadata = {
  title: "Gizlilik Politikası — markaizi",
  description: "markaizi Dijital Reklam Ajansı gizlilik politikası — kişisel verilerinizi nasıl topladığımız, kullandığımız ve koruduğumuz hakkında bilgi.",
};

export default function GizlilikPolitikasiPage() {
  return (
    <>
      <Navbar />
      <LegalPageTemplate
        badge="Yasal"
        title="Gizlilik Politikası"
        subtitle="Kişisel verilerinizi nasıl topladığımız, kullandığımız ve koruduğumuz hakkında şeffaf bir şekilde bilgi sunmaktayız."
        lastUpdated="23 Mayıs 2025"
      >
        <h2>1. Genel Bilgi</h2>
        <p>
          markaizi Dijital Reklam Ajansı olarak gizliliğinize değer veriyoruz. Bu Gizlilik
          Politikası, <strong>markaizi.com</strong> web sitesini ziyaret ettiğinizde veya
          hizmetlerimizden yararlandığınızda kişisel verilerinizi nasıl topladığımızı,
          kullandığımızı ve koruduğumuzu açıklamaktadır.
        </p>

        <h2>2. Topladığımız Bilgiler</h2>
        <h3>Doğrudan Sağladığınız Bilgiler</h3>
        <ul>
          <li>İletişim formunu doldurduğunuzda: ad, e-posta, telefon, mesaj içeriği</li>
          <li>Hizmet talebi ilettiğinizde yukarıdaki bilgiler</li>
        </ul>
        <h3>Otomatik Toplanan Bilgiler</h3>
        <ul>
          <li>IP adresi ve coğrafi konum (şehir düzeyinde)</li>
          <li>Tarayıcı türü ve sürümü</li>
          <li>Ziyaret edilen sayfalar ve ziyaret süresi</li>
          <li>Yönlendiren URL</li>
          <li>Çerez verileri (ayrıntılar için Çerez Politikamıza bakınız)</li>
        </ul>

        <h2>3. Bilgilerin Kullanım Amaçları</h2>
        <ul>
          <li>Hizmet taleplerinizi yanıtlamak</li>
          <li>Teklif ve bilgi göndermek</li>
          <li>Hizmetlerimizi geliştirmek</li>
          <li>Web sitesi trafiğini analiz etmek</li>
          <li>Yasal yükümlülükleri yerine getirmek</li>
        </ul>

        <h2>4. Bilgilerin Paylaşımı</h2>
        <p>Kişisel verilerinizi aşağıdaki durumlar dışında üçüncü taraflarla paylaşmıyoruz:</p>
        <ul>
          <li><strong>Hizmet sağlayıcılar:</strong> E-posta gönderimi, barındırma hizmetleri gibi operasyonel hizmetler için sınırlı veri paylaşımı</li>
          <li><strong>Yasal zorunluluk:</strong> Mahkeme kararı veya yasal yükümlülük durumunda</li>
          <li><strong>İş transferi:</strong> Şirket birleşmesi veya devri durumunda, önceden bilgilendirilmeniz koşuluyla</li>
        </ul>

        <h2>5. Google Analytics</h2>
        <p>
          Web sitemizde Google Analytics kullanmaktayız. Google Analytics, tarayıcınıza
          çerez yerleştirerek kullanıcı davranışlarını anonimleştirilmiş biçimde analiz eder.
          Bu verileri Google kendi gizlilik politikası kapsamında işlemektedir. Google
          Analytics&apos;i devre dışı bırakmak için{" "}
          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
            Google Analytics Opt-out Browser Add-on
          </a>{" "}
          kullanabilirsiniz.
        </p>

        <h2>6. Meta Pixel</h2>
        <p>
          Reklam etkinliğini ölçmek için Meta Pixel (Facebook Piksel) kullanmaktayız.
          Bu araç, reklam kampanyalarımızı optimize etmek için anonim kullanım verisi toplar.
          Meta&apos;nın veri politikasına uymayan işlem gerçekleştirmemek için gerekli teknik
          önlemleri almaktayız.
        </p>

        <h2>7. Veri Güvenliği</h2>
        <p>
          Kişisel verilerinizi korumak için endüstri standardı güvenlik önlemleri
          uygulamaktayız. Web sitemiz SSL/TLS şifrelemesi ile korunmaktadır. Bununla birlikte,
          internet üzerinden veri iletiminin %100 güvenli olduğunu garanti edemeyiz.
        </p>

        <h2>8. Çocukların Gizliliği</h2>
        <p>
          Hizmetlerimiz 18 yaşın altındaki bireylere yönelik değildir. Bilerek 18 yaş altı
          bireylerden kişisel veri toplamamaktayız.
        </p>

        <h2>9. Politika Değişiklikleri</h2>
        <p>
          Bu gizlilik politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler
          yapıldığında web sitemizde duyuru yayınlayacağız. Son güncelleme tarihini sayfanın
          üst kısmında bulabilirsiniz.
        </p>

        <h2>10. İletişim</h2>
        <p>
          Gizlilik politikamız hakkında sorularınız için{" "}
          <a href="mailto:markaizicom@gmail.com">markaizicom@gmail.com</a> adresine
          e-posta gönderebilirsiniz.
        </p>
      </LegalPageTemplate>
      <Footer />
      <WhatsApp />
    </>
  );
}
