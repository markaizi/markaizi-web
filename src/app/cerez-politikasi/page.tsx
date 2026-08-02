import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";
import LegalPageTemplate from "@/components/LegalPageTemplate";

export const metadata: Metadata = {
  title: "Çerez Politikası — markaizi",
  description: "markaizi web sitesinde kullanılan çerezler ve yönetim seçenekleri hakkında bilgi.",
  alternates: { canonical: "https://markaizi.com.tr/cerez-politikasi" },
};

export default function CerezPolitikasiPage() {
  return (
    <>
      <Navbar />
      <LegalPageTemplate
        badge="Yasal"
        title="Çerez Politikası"
        subtitle="Web sitemizde kullandığımız çerezler, amaçları ve yönetim seçenekleriniz hakkında bilgi sunmaktayız."
        lastUpdated="23 Mayıs 2025"
      >
        <h2>1. Çerez Nedir?</h2>
        <p>
          Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza
          kaydedilen küçük metin dosyalarıdır. Çerezler sayesinde web siteleri ziyaretinizi
          hatırlayabilir, tercihlerinizi kaydedebilir ve deneyiminizi kişiselleştirebilir.
        </p>

        <h2>2. Kullandığımız Çerez Türleri</h2>

        <h3>2.1 Zorunlu Çerezler</h3>
        <p>
          Bu çerezler web sitesinin temel işlevlerini yerine getirebilmesi için gereklidir.
          Bu çerezler olmadan site düzgün çalışmaz. Kullanıcı onayı gerekmemektedir.
        </p>
        <table>
          <thead>
            <tr>
              <th>Çerez Adı</th>
              <th>Amaç</th>
              <th>Süre</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>cookie_consent</td>
              <td>Çerez tercih durumunuzu saklar</td>
              <td>1 yıl</td>
            </tr>
          </tbody>
        </table>

        <h3>2.2 Analitik Çerezler</h3>
        <p>
          Web sitemizin nasıl kullanıldığını anlamamıza yardımcı olur. Veriler anonimleştirilmiş
          olarak toplanır; bireysel kullanıcıları tanımlamaz.
        </p>
        <table>
          <thead>
            <tr>
              <th>Sağlayıcı</th>
              <th>Çerez</th>
              <th>Amaç</th>
              <th>Süre</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Google Analytics</td>
              <td>_ga, _ga_*</td>
              <td>Ziyaretçi istatistikleri</td>
              <td>2 yıl</td>
            </tr>
            <tr>
              <td>Google Analytics</td>
              <td>_gid</td>
              <td>Oturum takibi</td>
              <td>24 saat</td>
            </tr>
          </tbody>
        </table>

        <h3>2.3 Pazarlama / Hedefleme Çerezleri</h3>
        <p>
          Reklam kampanyalarının etkinliğini ölçmek ve ilgi alanlarınıza göre reklamlar
          göstermek için kullanılır.
        </p>
        <table>
          <thead>
            <tr>
              <th>Sağlayıcı</th>
              <th>Çerez</th>
              <th>Amaç</th>
              <th>Süre</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Meta (Facebook)</td>
              <td>_fbp, _fbc</td>
              <td>Reklam dönüşüm takibi</td>
              <td>90 gün</td>
            </tr>
          </tbody>
        </table>

        <h2>3. Çerez Tercihlerinizi Yönetme</h2>
        <p>Çerez tercihlerinizi aşağıdaki yollarla yönetebilirsiniz:</p>
        <ul>
          <li>
            <strong>Çerez Onay Paneli:</strong> Web sitemizi ilk ziyaretinizde görüntülenen
            onay paneli üzerinden tercihlerinizi belirleyebilirsiniz.
          </li>
          <li>
            <strong>Tarayıcı Ayarları:</strong> Tarayıcınızın ayarlarından çerezleri
            devre dışı bırakabilir veya silebilirsiniz. Bu durumda bazı site özellikleri
            çalışmayabilir.
          </li>
          <li>
            <strong>Google Analytics Opt-out:</strong>{" "}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
              Google Analytics tarayıcı eklentisi
            </a>{" "}
            ile analitik çerezleri devre dışı bırakabilirsiniz.
          </li>
        </ul>

        <h2>4. Üçüncü Taraf Çerezleri</h2>
        <p>
          Web sitemizde Google ve Meta gibi üçüncü taraf servis sağlayıcıların çerezleri
          kullanılmaktadır. Bu çerezler ilgili şirketlerin kendi gizlilik politikaları
          kapsamında yönetilmektedir:
        </p>
        <ul>
          <li>
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              Google Gizlilik Politikası
            </a>
          </li>
          <li>
            <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer">
              Meta Gizlilik Politikası
            </a>
          </li>
        </ul>

        <h2>5. İletişim</h2>
        <p>
          Çerez politikamız hakkında sorularınız için{" "}
          <a href="mailto:markaizicom@gmail.com">markaizicom@gmail.com</a> adresine
          ulaşabilirsiniz.
        </p>
      </LegalPageTemplate>
      <Footer />
      <WhatsApp />
    </>
  );
}
