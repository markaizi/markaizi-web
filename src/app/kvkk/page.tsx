import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";
import LegalPageTemplate from "@/components/LegalPageTemplate";
import { SELLER } from "@/lib/company";

export const metadata: Metadata = {
  title: { absolute: "KVKK Aydınlatma Metni — markaizi" },
  description: "markaizi Dijital Reklam Ajansı KVKK kapsamında kişisel verilerin korunması hakkında aydınlatma metni.",
  alternates: { canonical: "https://markaizi.com.tr/kvkk" },
};

export default function KVKKPage() {
  return (
    <>
      <Navbar />
      <LegalPageTemplate
        badge="Yasal"
        title="KVKK Aydınlatma Metni"
        subtitle="6698 Sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusu sıfatıyla hazırlanmış aydınlatma metnidir."
        lastUpdated="29 Eylül 2026"
      >
        <h2>1. Veri Sorumlusu</h2>
        <p>
          Bu aydınlatma metni; <strong>{SELLER.legalName} — {SELLER.tradeName}</strong> ("Şirket") tarafından,
          6698 Sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında veri sorumlusu
          sıfatıyla hazırlanmıştır.
        </p>
        <p>
          <strong>Unvan:</strong> {SELLER.legalName} — {SELLER.tradeName} ({SELLER.businessType})<br />
          <strong>Adres:</strong> {SELLER.address}<br />
          <strong>E-posta:</strong> markaizicom@gmail.com<br />
          <strong>Telefon:</strong> +90 (552) 077 27 00
        </p>

        <h2>2. İşlenen Kişisel Veriler</h2>
        <p>Aşağıdaki kişisel verileriniz işlenebilmektedir:</p>
        <ul>
          <li><strong>Kimlik Verileri:</strong> Ad, soyad</li>
          <li><strong>İletişim Verileri:</strong> E-posta adresi, telefon numarası</li>
          <li><strong>Müşteri İşlem Verileri:</strong> Ödeme linki üzerinden yapılan ödemelerde fatura adresi, ödenen hizmet ve tutar, ödeme tarihi ve sonucu. Kredi/banka kartı bilgileri tarafımıza ulaşmaz; yalnızca ödeme kuruluşu PayTR tarafından işlenir.</li>
          <li><strong>İşlem Verileri:</strong> İletişim formu mesajları, hizmet talepleri</li>
          <li><strong>Teknik Veriler:</strong> IP adresi, tarayıcı bilgisi, çerez verileri</li>
        </ul>

        <h2>3. Kişisel Veri İşleme Amaçları</h2>
        <p>Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
        <ul>
          <li>Hizmet taleplerinizin değerlendirilmesi ve yanıtlanması</li>
          <li>Teklif ve fiyat bilgisi sunulması</li>
          <li>Sözleşme süreçlerinin yürütülmesi</li>
          <li>Müşteri ilişkileri yönetimi</li>
          <li>Yasal yükümlülüklerin yerine getirilmesi</li>
          <li>Web sitesi kullanım istatistiklerinin analiz edilmesi</li>
        </ul>

        <h2>4. Kişisel Verilerin İşlenmesinin Hukuki Dayanakları</h2>
        <p>Kişisel verileriniz KVKK madde 5 kapsamında aşağıdaki hukuki dayanaklar çerçevesinde işlenmektedir:</p>
        <ul>
          <li>Sözleşmenin kurulması veya ifası için gerekli olması</li>
          <li>Veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi</li>
          <li>Veri sorumlusunun meşru menfaatleri için gerekli olması</li>
          <li>Açık rızanızın bulunması (pazarlama iletişimleri için)</li>
        </ul>

        <h2>5. Kişisel Verilerin Aktarılması</h2>
        <p>
          Kişisel verileriniz, yukarıda belirtilen amaçlar doğrultusunda; iş ortaklarımıza,
          hizmet sağlayıcılarımıza (e-posta servisleri, hosting hizmeti sağlayıcıları), online
          ödemelerin gerçekleştirilmesi amacıyla lisanslı ödeme kuruluşu PayTR Ödeme ve Elektronik
          Para Kuruluşu A.Ş.&apos;ye ve
          yetkili kamu kurum ve kuruluşlarına aktarılabilmektedir. Yurt dışına veri aktarımı,
          KVKK'nın 9. maddesi kapsamında gerçekleştirilmektedir.
        </p>

        <h2>6. Kişisel Verilerin Saklanma Süresi</h2>
        <p>
          Kişisel verileriniz, işleme amacının ortadan kalkmasına ya da ilgili mevzuatta
          öngörülen saklama sürelerinin dolmasına kadar saklanmaktadır. İletişim formu
          aracılığıyla iletilen veriler, talep sonuçlandırıldıktan itibaren en fazla 3 yıl
          süreyle saklanır. Ödeme ve faturalandırma kayıtları, Vergi Usul Kanunu ve Türk Ticaret
          Kanunu&apos;nda öngörülen süreler boyunca saklanır.
        </p>

        <h2>7. İlgili Kişi Hakları</h2>
        <p>KVKK'nın 11. maddesi kapsamında aşağıdaki haklara sahipsiniz:</p>
        <ul>
          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
          <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
          <li>Kişisel verilerinizin işlenme amacını öğrenme</li>
          <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
          <li>Eksik veya yanlış işlenen verilerin düzeltilmesini isteme</li>
          <li>KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme</li>
          <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analizi nedeniyle aleyhe bir sonuç ortaya çıkmasına itiraz etme</li>
          <li>Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğraması hâlinde zararın giderilmesini talep etme</li>
        </ul>

        <h2>8. Başvuru Yöntemi</h2>
        <p>
          Yukarıda belirtilen haklarınızı kullanmak için markaizicom@gmail.com adresine
          e-posta göndererek veya yazılı başvuru yaparak tarafımıza ulaşabilirsiniz.
          Başvurunuzda kimliğinizi tespit edebilecek bilgilere ve talebinize yer vermeniz
          gerekmektedir. Talebiniz, niteliğine göre en kısa sürede ve en geç 30 (otuz) gün
          içinde ücretsiz olarak sonuçlandırılacaktır.
        </p>
      </LegalPageTemplate>
      <Footer />
      <WhatsApp />
    </>
  );
}
