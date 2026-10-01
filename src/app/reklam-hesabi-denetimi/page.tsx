import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";
import UcretsizAnalizForm from "@/components/sections/UcretsizAnalizForm";
import ServiceFAQ, { FAQItem } from "@/components/ServiceFAQ";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import { FeatureIcon, type FeatureIconName } from "@/components/icons/FeatureIcons";
import { breadcrumbJsonLd, SITE_URL, ORG_NAME } from "@/lib/seo";
import { FOUNDER } from "@/lib/founder";

const PATH = "/reklam-hesabi-denetimi";
const TITLE = "Ücretsiz Reklam Hesabı Denetimi — Meta & Google Ads | markaizi";
const DESC =
  "Reklamınız satış getirmiyor mu? Meta (Instagram & Facebook) ve Google Ads hesabınızı yalnızca görüntüleme yetkisiyle ücretsiz denetliyoruz: ölçüm, kampanya yapısı, kitle, kreatif ve bütçe kaybı. Ankara merkezli, Türkiye geneli.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  keywords:
    "reklam hesabı denetimi, ücretsiz reklam denetimi, meta reklam hesabı analizi, google ads hesap denetimi, reklam neden satış getirmiyor, instagram reklamı satış getirmiyor, reklam ajansı ikinci görüş, ankara reklam denetimi",
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: {
    title: TITLE,
    description: DESC,
    type: "website",
    locale: "tr_TR",
    url: `${SITE_URL}${PATH}`,
  },
};

const FAQ: FAQItem[] = [
  {
    q: "Reklam hesabı denetimi gerçekten ücretsiz mi?",
    a: "Evet. Denetim için ücret almıyoruz ve sizi hiçbir sözleşmeye bağlamıyor. Bulgularımızı anlattıktan sonra bizimle çalışıp çalışmamak tamamen sizin kararınız; isterseniz öncelik listesini alıp kendi ekibinizle ya da mevcut ajansınızla uygulayabilirsiniz.",
  },
  {
    q: "Hesabıma erişim vermem gerekiyor mu, şifremi istiyor musunuz?",
    a: "Şifrenizi asla istemiyoruz. Meta İşletme Portföyü'nde iş ortağı olarak yalnızca görüntüleme yetkisi, Google Ads'te ise salt okunur erişim yeterli. Denetim süresince hesabınızda hiçbir ayarı değiştirmiyoruz; denetim bitince erişimi tek tıkla kaldırabilirsiniz.",
  },
  {
    q: "Şu anda başka bir ajansla çalışıyorum, yine de denetim alabilir miyim?",
    a: "Evet, bağımsız bir ikinci görüş olarak bakıyoruz. Amacımız kimseyi suçlamak değil; ölçümün doğru çalışıp çalışmadığını, bütçenin nereye gittiğini ve önce neyin düzeltilmesi gerektiğini tarafsızca göstermek.",
  },
  {
    q: "Denetim ne kadar sürer, sonucu nasıl alırım?",
    a: "Erişim verildikten sonra genellikle 24-48 saat içinde inceleme tamamlanır. Bulguları telefon ya da görüntülü görüşmede anlatıyor, öncelik sırasına göre düzenlenmiş kısa bir özeti yazılı olarak iletiyoruz.",
  },
  {
    q: "Henüz reklam vermiyorum, bu denetim bana uygun mu?",
    a: "Denetim için en az birkaç haftalık reklam verisi gerekir. Henüz reklam vermiyorsanız Ücretsiz Analiz sayfamızdan Instagram, Google Haritalar ve web sitenizi inceleyip reklama başlamadan önce neyi hazırlamanız gerektiğini söyleyebiliriz.",
  },
  {
    q: "Hangi reklam platformlarına bakıyorsunuz?",
    a: "Meta (Instagram ve Facebook) reklamları ve Google Ads (arama, Haritalar, Performance Max, YouTube). Reklamın yönlendirdiği web sayfasını, WhatsApp akışını ve dönüşüm ölçümünü de denetimin parçası olarak inceliyoruz.",
  },
];

const AUDIT: { icon: FeatureIconName; title: string; desc: string; checks: string[] }[] = [
  {
    icon: "chart",
    title: "Ölçüm ve Dönüşüm Takibi",
    desc: "Diğer bütün kararlar bu veriye dayandığı için ilk bakılan yer.",
    checks: [
      "Meta Pixel ve Conversions API kurulu mu, olaylar eşleşiyor mu?",
      "Form, WhatsApp tıklaması ve arama gerçekten ölçülüyor mu, çift sayılıyor mu?",
      "Google Ads dönüşümleri doğru işlemi mi sayıyor?",
    ],
  },
  {
    icon: "target",
    title: "Kampanya Hedefi ve Yapısı",
    desc: "Sistemden ne istediğinizi doğru söylüyor musunuz?",
    checks: [
      "Kampanya hedefi işinize uyuyor mu: mesaj mı, form mu, satış mı?",
      "Birbiriyle yarışan kampanyalar ve parçalanmış bütçe var mı?",
      "Öğrenme aşamasından hiç çıkamayan reklam setleri var mı?",
    ],
  },
  {
    icon: "users",
    title: "Kitle ve Bölge",
    desc: "Reklam, gerçekten müşteriniz olabilecek kişiye mi gösteriliyor?",
    checks: [
      "Mağazanıza hiç gelmeyecek kadar uzak bölgelere harcama yapılıyor mu?",
      "Sitenizi ve profilinizi ziyaret edenlere yeniden ulaşılıyor mu?",
      "Müşteri listeniz ve benzer kitleler kullanılıyor mu?",
    ],
  },
  {
    icon: "film",
    title: "Kreatif ve Teklif",
    desc: "İyi kurulmuş bir kampanyayı bile yorgun bir video durdurur.",
    checks: [
      "Görseller ve videolar ne zamandır değişmedi, gösterim sıklığı ne durumda?",
      "Video ilk saniyelerde kime konuştuğunu söylüyor mu?",
      "Reklamda net bir teklif ve net bir sonraki adım var mı?",
    ],
  },
  {
    icon: "search",
    title: "Google Arama Terimleri",
    desc: "Bütçenin sessizce eridiği yer çoğu zaman burasıdır.",
    checks: [
      "Hangi aramalar için para ödüyorsunuz, alakasız olanlar ayıklanmış mı?",
      "Marka adınızla yapılan aramalar korunuyor mu?",
      "Haritalar ve konum uzantıları doğru çalışıyor mu?",
    ],
  },
  {
    icon: "mobile",
    title: "Tıklanan Sayfa ve WhatsApp Akışı",
    desc: "Reklam iyi olsa bile tıklayan kişinin düştüğü yer satışı belirler.",
    checks: [
      "Sayfa telefonda hızlı açılıyor mu, reklamdaki ürün ilk bakışta görünüyor mu?",
      "WhatsApp ve arama butonları kolay bulunuyor mu?",
      "Form gereğinden uzun mu?",
    ],
  },
  {
    icon: "handshake",
    title: "Mesajdan Satışa",
    desc: "Reklam panelinin göremediği son adım.",
    checks: [
      "Gelen mesajların kaçı satışa dönüyor (paylaşırsanız)?",
      "Mesajlara ne kadar sürede dönülüyor, fiyat nasıl sunuluyor?",
      "Hangi kampanyanın müşterisi daha çok satın alıyor?",
    ],
  },
];

const ACCESS_STEPS = [
  {
    title: "Formu doldurun",
    desc: "Web sitenizi ya da Instagram hesabınızı ve hangi reklamları verdiğinizi yazın. 1 dakika sürer.",
  },
  {
    title: "Görüntüleme yetkisi verin",
    desc: "Sizi arayıp Meta İşletme Portföyü ve Google Ads'te yalnızca görüntüleme yetkisinin nasıl verileceğini adım adım anlatıyoruz.",
  },
  {
    title: "Hesabınızı inceleriz",
    desc: "24-48 saat içinde ölçümü, kampanya yapısını, kitleyi, kreatifleri ve tıklanan sayfayı tek tek kontrol ediyoruz.",
  },
  {
    title: "Bulguları konuşuruz",
    desc: "Neyin çalıştığını, bütçenin nerede boşa gittiğini ve önce neyin düzeltilmesi gerektiğini öncelik sırasıyla anlatıyoruz.",
  },
];

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Ücretsiz Reklam Hesabı Denetimi",
  serviceType: "Reklam hesabı denetimi",
  description:
    "Meta (Instagram & Facebook) ve Google Ads reklam hesaplarının yalnızca görüntüleme yetkisiyle ücretsiz denetimi: dönüşüm ölçümü, kampanya yapısı, kitle, kreatif, arama terimleri, açılış sayfası ve mesajdan satışa akış.",
  url: `${SITE_URL}${PATH}`,
  provider: { "@type": "ProfessionalService", name: `${ORG_NAME} Dijital Reklam Ajansı`, url: SITE_URL },
  areaServed: [{ "@type": "City", name: "Ankara" }, { "@type": "Country", name: "Türkiye" }],
  offers: { "@type": "Offer", price: "0", priceCurrency: "TRY", description: "Ücretsiz, bağlayıcı değil" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const breadcrumb = breadcrumbJsonLd([
  { name: "Ana Sayfa", path: "/" },
  { name: "Reklam Hesabı Denetimi", path: PATH },
]);

export default function ReklamHesabiDenetimiPage() {
  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumb} />
      <Navbar />
      <main>
        {/* ── Hero + Form ── */}
        <section className="relative overflow-hidden pt-28 sm:pt-32 pb-16" style={{ background: "var(--bg)" }}>
          <div
            className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle,rgba(124,58,237,0.2) 0%,transparent 70%)", filter: "blur(80px)" }}
          />
          <div className="max-w-[1200px] mx-auto px-5 sm:px-6 relative z-10">
            <Breadcrumb items={[{ name: "Ana Sayfa", path: "/" }, { name: "Reklam Hesabı Denetimi" }]} />
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-10 lg:gap-14 items-start mt-3">
              <div>
                <span className="section-tag">Ücretsiz · Bağlayıcı Değil · Şifre İstemiyoruz</span>
                <h1
                  className="font-black leading-tight mb-4 mt-2"
                  style={{ fontSize: "clamp(30px,5vw,50px)", letterSpacing: "-1px" }}
                >
                  Ücretsiz Reklam Hesabı Denetimi: <span className="gradient-text">Bütçeniz Nereye Gidiyor?</span>
                </h1>
                <p className="text-[#8a8a9a] text-[17px] leading-relaxed mb-5">
                  Reklam veriyorsunuz, panelde rakamlar akıyor ama kasaya yansımıyor mu? Meta (Instagram &amp; Facebook) ve
                  Google Ads hesabınızı yalnızca görüntüleme yetkisiyle inceleyip paranın nereye gittiğini ve önce neyin
                  düzeltilmesi gerektiğini açıkça söyleyelim.
                </p>
                <p className="text-[#8a8a9a] text-[15px] leading-relaxed mb-6">
                  Satış getirmeyen hesaplarda sorun çoğu zaman bütçede değildir. Dönüşüm yanlış ölçülür, kampanya yanlış
                  hedefe kurulur ya da reklam açılıp kendi hâline bırakılır. Denetim, bu zincirin nerede koptuğunu bulmak için.
                </p>
                <div className="grid grid-cols-2 gap-3 max-w-[520px]">
                  {[
                    { value: "₺0", label: "Denetim ücreti" },
                    { value: "24-48s", label: "İnceleme süresi" },
                    { value: "Meta + Google", label: "Bakılan hesaplar" },
                    { value: "Salt okunur", label: "Hesap erişimi" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl px-4 py-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                      <div className="text-[18px] font-black gradient-text leading-tight">{s.value}</div>
                      <div className="text-[12.5px] text-[#8a8a9a]">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <UcretsizAnalizForm variant="reklam" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Kısa cevap ── */}
        <section className="py-16 sm:py-20" style={{ background: "var(--bg-alt)", borderTop: "1px solid var(--border)" }}>
          <div className="max-w-[900px] mx-auto px-5 sm:px-6">
            <span className="section-tag">Kısa Cevap</span>
            <h2 className="font-black leading-tight mt-2 mb-5" style={{ fontSize: "clamp(24px,3.5vw,36px)" }}>
              Reklamım Neden <span className="gradient-text">Satış Getirmiyor?</span>
            </h2>
            <p className="text-[#8a8a9a] text-[16px] leading-[1.9] mb-6">
              Müşteri reklamı görüp satın alana kadar dört kapıdan geçer ve sorun neredeyse her zaman bu kapılardan birinde
              takılır. Hangi kapıda olduğunu bilmeden bütçeyi artırmak, sorunu da büyütür.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                { k: "Reklam izlenmiyor", v: "Sorun kreatifte: ilk saniye, ilk kare, kime konuştuğu." },
                { k: "İzleniyor ama tıklanmıyor", v: "Sorun mesajda ve teklifte: net bir sebep ve sonraki adım yok." },
                { k: "Tıklanıyor ama dönüşüm yok", v: "Sorun tıklanan sayfada ya da ölçümde: yavaş sayfa, kayıp buton, yanlış sayılan olay." },
                { k: "Mesaj geliyor ama satış yok", v: "Sorun satış sürecinde: dönüş hızı, fiyat sunumu, itiraz karşılama." },
              ].map((r) => (
                <div key={r.k} className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <p className="text-[15px] font-bold text-white mb-1">{r.k}</p>
                  <p className="text-[14px] text-[#8a8a9a] leading-relaxed">{r.v}</p>
                </div>
              ))}
            </div>
            <p className="text-[14.5px] text-[#8a8a9a] leading-relaxed">
              Dört kapıyı ve her birinde hangi rakama bakmanız gerektiğini{" "}
              <Link href="/blog/reklam-neden-satis-getirmiyor" className="text-[#c084fc] underline underline-offset-2 hover:text-white">
                Reklamınız Neden Satış Getirmiyor?
              </Link>{" "}
              rehberimizde ayrıntılı anlattık. Denetimde bu kontrolü sizin hesabınızın gerçek verisiyle yapıyoruz.
            </p>
          </div>
        </section>

        {/* ── Neye bakıyoruz ── */}
        <section className="py-16 sm:py-20" style={{ background: "var(--bg)" }}>
          <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
            <div className="text-center max-w-[700px] mx-auto mb-12">
              <span className="section-tag">Denetim Kapsamı</span>
              <h2 className="font-black leading-tight mt-2 mb-3" style={{ fontSize: "clamp(24px,3.5vw,36px)" }}>
                Hesabınızda <span className="gradient-text">Neye Bakıyoruz?</span>
              </h2>
              <p className="text-[#8a8a9a] text-[16px] leading-relaxed">
                Yedi başlık, her birinde somut kontroller. Sıralama tesadüf değil: ölçüm doğru değilse diğer bulguların
                hiçbirine güvenilemez.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {AUDIT.map((a) => (
                <div key={a.title} className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <div
                    className="w-10 h-10 flex items-center justify-center rounded-lg mb-4 text-[#c084fc]"
                    style={{ background: "var(--grad-soft)", border: "1px solid rgba(168,85,247,0.25)" }}
                  >
                    <FeatureIcon name={a.icon} />
                  </div>
                  <h3 className="text-[17px] font-bold text-white mb-1.5">{a.title}</h3>
                  <p className="text-[13.5px] text-[#8a8a9a] leading-relaxed mb-4">{a.desc}</p>
                  <ul className="flex flex-col gap-2.5">
                    {a.checks.map((c) => (
                      <li key={c} className="flex items-start gap-2.5 text-[13.5px] text-[#c0c0d0] leading-snug">
                        <span className="mt-[6px] w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--grad)" }} />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Süreç ── */}
        <section className="py-16 sm:py-20" style={{ background: "var(--bg-alt)" }}>
          <div className="max-w-[1100px] mx-auto px-5 sm:px-6">
            <div className="text-center max-w-[680px] mx-auto mb-12">
              <span className="section-tag">Nasıl İşliyor?</span>
              <h2 className="font-black leading-tight mt-2" style={{ fontSize: "clamp(24px,3.5vw,36px)" }}>
                4 Adımda <span className="gradient-text">Denetim</span>
              </h2>
            </div>
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {ACCESS_STEPS.map((s, i) => (
                <li key={s.title} className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <div className="text-[13px] font-black gradient-text mb-3">{String(i + 1).padStart(2, "0")}</div>
                  <h3 className="text-[16px] font-bold mb-2 text-white">{s.title}</h3>
                  <p className="text-[13.5px] text-[#8a8a9a] leading-relaxed">{s.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Güven: hesap sizin, kimle konuşacaksınız, kanıt ── */}
        <section className="py-16 sm:py-20" style={{ background: "var(--bg)" }}>
          <div className="max-w-[1100px] mx-auto px-5 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="rounded-2xl p-7" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <span className="section-tag">Şeffaflık</span>
              <h2 className="font-black text-[21px] leading-snug mt-2 mb-3">Hesap Sizin Kalır</h2>
              <p className="text-[14px] text-[#8a8a9a] leading-relaxed">
                Reklam hesabınız, sayfanız ve pikseliniz her zaman sizin işletme hesabınızda durur. Denetimde hiçbir ayarı
                değiştirmiyoruz; birlikte çalışmaya karar verirseniz bile hesap sahipliği sizde kalır ve reklam bütçesi
                kendi kartınızdan doğrudan platforma gider.
              </p>
            </div>
            <div className="rounded-2xl p-7" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <span className="section-tag">Kiminle Konuşacaksınız?</span>
              <h2 className="font-black text-[21px] leading-snug mt-2 mb-3">Satış Temsilcisi Değil, Reklamı Yöneten Ekip</h2>
              <p className="text-[14px] text-[#8a8a9a] leading-relaxed mb-4">
                Bulgularınızı kampanyaları her gün yöneten ekip anlatır; ilk görüşmeleri kurucumuz{" "}
                <Link href={FOUNDER.path} className="text-[#c084fc] underline underline-offset-2 hover:text-white">
                  {FOUNDER.name}
                </Link>{" "}
                yapar.
              </p>
            </div>
            <div className="rounded-2xl p-7" style={{ background: "var(--surface)", border: "1px solid rgba(168,85,247,0.3)" }}>
              <span className="section-tag">Deneyim</span>
              <h2 className="font-black text-[21px] leading-snug mt-2 mb-3">10 Milyon ₺+ Yönetilen Reklam Bütçesi</h2>
              <p className="text-[14px] text-[#8a8a9a] leading-relaxed mb-4">
                Yedi yıldır birlikte çalıştığımız Alitel Mobilya, her yıl İstikbal bayileri arasında Türkiye ciro
                birinciliğini aldı. Bu süreçte 10 milyon TL&apos;nin üzerinde reklam bütçesi yönettik.
              </p>
              <Link href="/vaka-calismalari/alitel-mobilya" className="text-[14px] font-semibold text-[#c084fc] hover:text-white">
                Vaka çalışmasını okuyun →
              </Link>
            </div>
          </div>
        </section>

        {/* ── SSS ── */}
        <section className="py-16 sm:py-20" style={{ background: "var(--bg-alt)" }}>
          <ServiceFAQ faqs={FAQ} />
        </section>

        {/* ── İlgili ── */}
        <section className="py-14" style={{ background: "var(--bg)" }}>
          <div className="max-w-[760px] mx-auto px-5 sm:px-6 text-center">
            <h2 className="font-black text-[22px] mb-5">
              Denetimden Önce <span className="gradient-text">Göz Atın</span>
            </h2>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
              {[
                { href: "/araclar/reklam-butcesi-hesaplayici", label: "Reklam Bütçesi Hesaplayıcı" },
                { href: "/hizmetler/donusum-takibi-kurulumu", label: "Dönüşüm Takibi Kurulumu" },
                { href: "/blog/reklam-butcesi-nasil-belirlenir", label: "Reklam Bütçesi Nasıl Belirlenir?" },
                { href: "/ucretsiz-analiz", label: "Henüz reklam vermiyorsanız: Ücretsiz Analiz" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-[14px] font-semibold text-[#c084fc] px-5 py-2.5 rounded-full transition-all hover:bg-white/[0.06]"
                  style={{ border: "1px solid rgba(168,85,247,0.3)" }}
                >
                  {l.label} →
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Alt CTA ── */}
        <section className="py-16 sm:py-20" style={{ background: "var(--bg-alt)", borderTop: "1px solid var(--border)" }}>
          <div className="max-w-[560px] mx-auto px-5 sm:px-6 text-center">
            <h2 className="font-black text-[26px] sm:text-[30px] mb-3">
              Reklamınız Açık. <span className="gradient-text">Çalışıyor mu?</span>
            </h2>
            <p className="text-[#8a8a9a] mb-7 leading-relaxed">
              Formu doldurun ya da WhatsApp&apos;tan yazın; hesabınıza birlikte bakalım.
            </p>
            <a
              href="https://wa.me/905520772700?text=Merhaba%2C%20reklam%20hesab%C4%B1m%C4%B1n%20%C3%BCcretsiz%20denetimini%20istiyorum."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary w-full sm:w-auto"
            >
              WhatsApp&apos;tan Hemen Yaz
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsApp />
    </>
  );
}
