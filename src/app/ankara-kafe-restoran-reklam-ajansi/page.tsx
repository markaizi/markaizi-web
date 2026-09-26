import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";
import ServiceFAQ, { FAQItem } from "@/components/ServiceFAQ";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import VideoCallout from "@/components/VideoCallout";
import { breadcrumbJsonLd, SITE_URL } from "@/lib/seo";
import { ANKARA_ILCELER, KAFE_DISTRICT_PAGES, KAFE_HUB } from "@/lib/kafe-pages";

const TITLE = "Ankara Kafe & Restoran Reklam Ajansı — Sosyal Medya, Instagram, Google Haritalar | markaizi";
const DESC =
  "Ankara'daki kafe, restoran, kahvaltı salonu ve pastaneler için sosyal medya yönetimi, Instagram reklamları, Google Haritalar ve yemek/mekân çekimi. Çankaya'dan Gölbaşı'na Ankara'nın 25 ilçesinde.";
const URL = `${SITE_URL}${KAFE_HUB.path}`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  keywords:
    "ankara kafe reklam ajansı, ankara restoran reklam ajansı, ankara cafe sosyal medya yönetimi, ankara restoran sosyal medya ajansı, kafe instagram reklamı ankara, restoran instagram yönetimi ankara, ankara kafe google haritalar, ankara yemek fotoğraf çekimi, kafe sosyal medya ajansı, restoran dijital pazarlama ankara",
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESC, type: "website", locale: "tr_TR", url: URL },
};

const SERVICES = [
  { t: "Kafe & Restoran Sosyal Medya Yönetimi", d: "Instagram ve TikTok için içerik takvimi, Reels, günlük story akışı, yorum ve mesaj yönetimi. Menüden mutfağa, mekânınızın hikâyesini düzenli anlatan hesap." },
  { t: "Instagram & Facebook Reklamları", d: "Mekânınızın çevresine dar yarıçaplı, öğle, akşam ve hafta sonu için ayrı planlanan reklamlar. Rezervasyona, WhatsApp'a ya da yol tarifine yönlendiren kampanyalar." },
  { t: "Google Haritalar & İşletme Profili", d: "'Yakınımdaki kafe' ve 'semt adı + restoran' aramalarında görünür olmak: kategori, menü, fotoğraf, çalışma saatleri, yorum toplama ve yorum yanıtları." },
  { t: "Yemek, İçecek & Mekân Çekimi", d: "Tabağın, bardağın ve mekânın en iyi ışıkta çekildiği fotoğraf ve kısa videolar. Ankara merkezli olduğumuz için mekânınıza gelip çekiyoruz." },
  { t: "Açılış ve Kampanya Duyurusu", d: "Yeni açılış, yeni menü, sezon ve özel gün kampanyaları için önceden planlanan içerik ve reklam akışı." },
  { t: "Web Sitesi & Menü Sayfası", d: "Mobilde hızlı açılan, menüsü, konumu ve rezervasyon ya da sipariş bağlantısı olan sade bir mekân sitesi." },
];

const FAQ: FAQItem[] = [
  {
    q: "Kafe ve restoranlar için hangi sosyal medya platformu daha önemli?",
    a: "Yeme-içmede Instagram hâlâ ana vitrin; mekânı, tabağı ve atmosferi en iyi gösteren platform. TikTok daha genç kitleye ve kısa sürede geniş erişime, Google İşletme Profili ise karar anındaki 'yakınımdaki kafe' aramalarına hitap ediyor. Çoğu mekân için Instagram ve Google profili birlikte en temel ikili.",
  },
  {
    q: "Kafe reklamını hangi mesafeye göstermeliyiz?",
    a: "Şehir içindeki kafe ve restoranlar için genellikle mekânın çevresindeki birkaç kilometre en verimli başlangıçtır. Gölbaşı ya da Beypazarı gibi insanların özellikle gittiği yerlerde ise reklamın şehir merkezine, hafta sonu planının yapıldığı günlerde gösterilmesi daha iyi sonuç verir.",
  },
  {
    q: "Her gün paylaşım yapmak zorunda mıyız?",
    a: "Hayır. Günlük story akışı mekânın canlı görünmesi için değerli, ama gönderi ve Reels tarafında az ve iyi içerik, her gün aceleyle hazırlanmış paylaşımdan daha çok iş yapar. İçerik sayısını mekânın bütçesine ve çekim kapasitesine göre belirliyoruz.",
  },
  {
    q: "Google yorumlarını nasıl artırabiliriz?",
    a: "En etkili yol, memnun müşteriden yorum istemeyi alışkanlık haline getirmek: masada bir QR kod, hesapla birlikte kibar bir hatırlatma ya da paket siparişlere eklenen bir not. Gelen her yoruma, olumsuz olanlar dahil, sakin ve çözüm odaklı yanıt vermek de yeni müşterilere güven verir. Satın alınmış yorum ise risklidir; tespit edildiğinde profil zarar görebilir.",
  },
  {
    q: "Ankara'nın hangi ilçelerindeki mekânlarla çalışıyorsunuz?",
    a: "Ankara'nın 25 ilçesinin tamamındaki mekânlarla çalışabiliyoruz. Ankara Siteler'de olduğumuz için Çankaya, Keçiören, Yenimahalle, Altındağ, Mamak, Etimesgut ve Gölbaşı gibi merkeze yakın ilçelere çekim ve görüşme için kısa sürede gelebiliyor; Beypazarı ve Polatlı gibi uzak ilçeler için çekim tarihini önceden planlıyoruz.",
  },
  {
    q: "Reklam verirsek masalar dolar mı?",
    a: "Reklam doğru kişiyi mekânınıza getirir; geri gelip gelmeyeceğini ise lezzet, servis, bekleme süresi ve yorumlara verilen yanıt belirler. Bu yüzden satış garantisi vermiyoruz; reklamı, içeriği ve Google profilini birlikte yöneterek mekânınızın bulunur, seçilir ve hatırlanır olmasına çalışıyoruz.",
  },
];

export default function AnkaraKafeRestoranPage() {
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Ankara Kafe & Restoran Reklam Ajansı Hizmetleri",
    serviceType: "Kafe ve restoranlar için sosyal medya yönetimi, reklam ve yerel SEO",
    url: URL,
    provider: {
      "@type": "ProfessionalService",
      name: "markaizi Dijital Reklam Ajansı",
      url: SITE_URL,
      telephone: "+90-552-077-27-00",
      address: { "@type": "PostalAddress", addressLocality: "Ankara", addressRegion: "Ankara", addressCountry: "TR" },
    },
    areaServed: [
      { "@type": "City", name: "Ankara" },
      ...ANKARA_ILCELER.map((i) => ({ "@type": "AdministrativeArea", name: `${i}, Ankara` })),
    ],
    audience: { "@type": "Audience", audienceType: "Kafeler, restoranlar, kahvaltı salonları, pastaneler ve yeme-içme işletmeleri" },
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const pageByIlce = new Map(KAFE_DISTRICT_PAGES.map((p) => [p.h1Plain, p.path]));

  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Ana Sayfa", path: "/" }, { name: KAFE_HUB.name, path: KAFE_HUB.path }])} />
      <Navbar />
      <main>
        <section className="relative overflow-hidden pt-32 pb-20" style={{ background: "var(--bg)" }}>
          <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(124,58,237,0.2) 0%,transparent 70%)", filter: "blur(80px)" }} />
          <div className="absolute top-[50px] right-[-150px] w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(236,72,153,0.15) 0%,transparent 70%)", filter: "blur(80px)" }} />
          <div className="max-w-[1200px] mx-auto px-6 relative z-10">
            <div className="max-w-[780px]">
              <Breadcrumb items={[{ name: "Ana Sayfa", path: "/" }, { name: KAFE_HUB.name }]} />
              <span className="section-tag">Ankara · 25 İlçe</span>
              <h1 className="font-black leading-tight mb-5 mt-2" style={{ fontSize: "clamp(30px,5vw,52px)", letterSpacing: "-1px" }}>
                Ankara Kafe & Restoran <span className="gradient-text">Reklam Ajansı</span>
              </h1>
              <p className="text-[#8a8a9a] text-[18px] leading-relaxed mb-4">
                Ankara&apos;da insanlar nerede kahvaltı yapacağına, öğle arasında nereye gideceğine ya da akşam nerede
                buluşacağına artık telefonunda karar veriyor: Instagram&apos;da gördüğü bir tabak, Google&apos;daki puan,
                arkadaşının story&apos;si. Mekânınız bu ekranlarda yoksa, en iyi kahveyi yapsanız bile listede yoksunuz.
              </p>
              <p className="text-[#8a8a9a] text-[16px] leading-relaxed mb-8">
                Ankara Siteler merkezli bir ajans olarak Çankaya&apos;dan Gölbaşı&apos;na, Keçiören&apos;den Beypazarı&apos;na kafe,
                restoran, kahvaltı salonu ve pastanelere sosyal medya yönetimi, reklam ve Google Haritalar hizmeti veriyoruz.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="https://wa.me/905520772700?text=Merhaba%2C%20kafem%2Frestoran%C4%B1m%20i%C3%A7in%20sosyal%20medya%20ve%20reklam%20hizmeti%20almak%20istiyorum." target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  WhatsApp&apos;tan Ücretsiz Teklif Al
                </a>
                <Link href="/ucretsiz-analiz" className="btn btn-outline">Ücretsiz Analiz</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20" style={{ background: "var(--bg-alt)" }}>
          <div className="max-w-[820px] mx-auto px-6">
            <span className="section-tag">Neden Farklı?</span>
            <h2 className="font-black leading-tight mb-6 mt-2" style={{ fontSize: "clamp(24px,3.2vw,34px)" }}>
              Kafe Müşterisi Kararını <span className="gradient-text">Dakikalar İçinde Verir</span>
            </h2>
            <p className="text-[#8a8a9a] text-[16px] leading-[1.9] mb-5">
              Bir koltuk takımı haftalarca araştırılır; bir kafe ise çoğu zaman yola çıkmadan beş dakika önce seçilir.
              Bu yüzden yeme-içmede reklamın ne zaman ve nerede göründüğü, ne söylediği kadar önemli. Öğle menüsü reklamını
              öğleden sonra göstermek ya da mahalle kafesinin reklamını şehrin öbür ucuna göstermek bütçeyi boşa harcatır.
            </p>
            <p className="text-[#8a8a9a] text-[16px] leading-[1.9] mb-5">
              Ankara&apos;nın her bölgesi de ayrı bir yeme-içme dünyası. Çankaya&apos;da aynı caddede onlarca kafe yarışırken,
              Gölbaşı&apos;ndaki bir mekânın misafiri hafta sonu şehir merkezinden yola çıkıyor; Yenimahalle&apos;de müdavim,
              Altındağ&apos;da ziyaretçi, Beypazarı&apos;nda günübirlik gelen Ankaralı belirleyici. Reklamı, içeriği ve Google
              profilini mekânınızın bulunduğu yerin gerçeğine göre kuruyoruz.
            </p>
            <p className="text-[#c0c0d0] text-[16px] leading-[1.9]">
              Bir de şu var: reklam masayı getirir, deneyim geri getirir. Yeni müşteriyi reklam çeker; tekrar gelip
              gelmeyeceğini lezzet, servis ve Google&apos;daki yorumlara verilen yanıt belirler. Bu yüzden raporlarımızda
              yalnızca erişime değil, yorumlara, puan değişimine, yol tarifi ve arama sayılarına da bakıyoruz.
            </p>
          </div>
        </section>

        <section className="py-20" style={{ background: "var(--bg)" }}>
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center max-w-[680px] mx-auto mb-14">
              <span className="section-tag">Hizmetler</span>
              <h2 className="font-black leading-tight mt-2" style={{ fontSize: "clamp(26px,3.5vw,38px)" }}>
                Kafe ve Restoranınız İçin <span className="gradient-text">Neler Yapıyoruz?</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SERVICES.map((s) => (
                <div key={s.t} className="service-card rounded-2xl p-7" style={{ background: "var(--surface)" }}>
                  <h3 className="text-[17px] font-bold mb-3 text-white">{s.t}</h3>
                  <p className="text-[14px] text-[#8a8a9a] leading-relaxed">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20" style={{ background: "var(--bg-alt)" }}>
          <div className="max-w-[1000px] mx-auto px-6">
            <div className="text-center max-w-[700px] mx-auto mb-10">
              <span className="section-tag">İlçe İlçe Ankara</span>
              <h2 className="font-black leading-tight mt-2 mb-4" style={{ fontSize: "clamp(24px,3.2vw,34px)" }}>
                Mekânınız <span className="gradient-text">Hangi İlçede?</span>
              </h2>
              <p className="text-[#8a8a9a] text-[15px] leading-relaxed">
                Ankara&apos;nın 25 ilçesinin tamamındaki kafe ve restoranlarla çalışıyoruz. Yeme-içme dinamiği belirgin şekilde
                farklı olan ilçeler için ayrı rehber sayfalar hazırladık.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {KAFE_DISTRICT_PAGES.map((p) => (
                <Link key={p.path} href={p.path} className="group rounded-2xl p-5 transition-all" style={{ background: "var(--surface)", border: "1px solid rgba(168,85,247,0.25)", textDecoration: "none" }}>
                  <p className="text-[17px] font-bold text-white mb-1">{p.h1Plain}</p>
                  <p className="text-[13px] text-[#8a8a9a] leading-snug mb-3">{p.metaDescription.split(". ")[0]}.</p>
                  <span className="text-[13px] font-semibold text-[#c084fc]">{p.h1Plain} kafe & restoran rehberi →</span>
                </Link>
              ))}
            </div>
            <p className="text-center text-[13px] font-semibold text-[#8a8a9a] uppercase tracking-widest mb-4">Hizmet verdiğimiz tüm Ankara ilçeleri</p>
            <div className="flex flex-wrap justify-center gap-2">
              {ANKARA_ILCELER.map((i) => {
                const href = pageByIlce.get(i);
                return href ? (
                  <Link key={i} href={href} className="text-[13px] px-3 py-1.5 rounded-full text-[#c084fc]" style={{ border: "1px solid rgba(168,85,247,0.35)" }}>{i}</Link>
                ) : (
                  <span key={i} className="text-[13px] px-3 py-1.5 rounded-full text-[#8a8a9a]" style={{ border: "1px solid var(--border)" }}>{i}</span>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20" style={{ background: "var(--bg)" }}>
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center max-w-[680px] mx-auto mb-14">
              <span className="section-tag">Nasıl Çalışıyoruz?</span>
              <h2 className="font-black leading-tight mt-2" style={{ fontSize: "clamp(26px,3.5vw,38px)" }}>
                Mekânınızdan <span className="gradient-text">Dolu Masaya Giden Yol</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { s: "Tanışma & Analiz", d: "Mekânınızı, menünüzü, müşterinizin kim olduğunu ve Instagram ile Google profilinizin durumunu inceliyoruz." },
                { s: "Profil & Çekim", d: "Google İşletme Profilini düzenliyor, mekânınıza gelip yemek, içecek ve atmosfer çekimini yapıyoruz." },
                { s: "İçerik & Reklam", d: "İçerik takvimi başlıyor; reklamlar mekânın çevresine, doğru saatlerde ve doğru teklifle yayına giriyor." },
                { s: "Ölçüm & İyileştirme", d: "Mesaj, rezervasyon, yol tarifi, arama ve yorumları takip ediyor; çalışan içeriği ve saati büyütüyoruz." },
              ].map((x) => (
                <div key={x.s} className="rounded-2xl p-7" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <h3 className="text-[16px] font-bold mb-2 text-white">{x.s}</h3>
                  <p className="text-[13px] text-[#8a8a9a] leading-relaxed">{x.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20" style={{ background: "var(--bg-alt)" }}>
          <div className="max-w-[760px] mx-auto px-6 mb-12">
            <VideoCallout slug="isletmeler-icin-dijital-pazarlama-ve-reklam-rehberi" text="Reklamın neden tek başına masayı doldurmadığını ve ajanstan ne beklemeniz gerektiğini videoda anlattık." />
          </div>
          <ServiceFAQ faqs={FAQ} />
        </section>

        <section className="py-16" style={{ background: "var(--bg)" }}>
          <div className="max-w-[760px] mx-auto px-6 text-center">
            <h2 className="font-black text-[24px] mb-3">Kafe & Restoran <span className="gradient-text">Rehberleri</span></h2>
            <p className="text-[#8a8a9a] text-[15px] mb-6">Ankara&apos;daki yeme-içme işletmeleri için hazırladığımız yazılar:</p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
              {[
                { href: "/blog/ankara-kafe-acilis-dijital-pazarlama-rehberi", l: "Kafe Açılışı İçin Dijital Pazarlama →" },
                { href: "/blog/kafe-restoran-google-haritalar-rehberi", l: "Google Haritalar'da Öne Çıkmak →" },
              ].map((x) => (
                <Link key={x.href} href={x.href} className="text-[14px] font-semibold text-[#c084fc] px-5 py-2.5 rounded-full transition-all hover:bg-white/[0.06]" style={{ border: "1px solid rgba(168,85,247,0.3)" }}>{x.l}</Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20" style={{ background: "var(--bg-alt)", borderTop: "1px solid var(--border)" }}>
          <div className="max-w-[680px] mx-auto px-6 text-center">
            <h2 className="font-black text-[30px] mb-4">Mekânınız İçin <span className="gradient-text">Ücretsiz Analiz</span></h2>
            <p className="text-[#8a8a9a] mb-8 leading-relaxed">
              Instagram hesabınızı, Google İşletme Profilinizi ve çevrenizdeki rakipleri inceleyip mekânınıza özel yol
              haritasını 24 saat içinde paylaşalım. Görüşme ücretsiz, karar sizin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://wa.me/905520772700?text=Merhaba%2C%20kafem%2Frestoran%C4%B1m%20i%C3%A7in%20%C3%BCcretsiz%20analiz%20istiyorum." target="_blank" rel="noopener noreferrer" className="btn btn-primary">WhatsApp&apos;tan Yaz</a>
              <Link href="/#iletisim" className="btn btn-outline">İletişim Formu</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsApp />
    </>
  );
}
