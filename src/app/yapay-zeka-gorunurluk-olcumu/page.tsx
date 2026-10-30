import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";
import UcretsizAnalizForm from "@/components/sections/UcretsizAnalizForm";
import ServiceFAQ, { FAQItem } from "@/components/ServiceFAQ";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, SITE_URL, ORG_NAME } from "@/lib/seo";

const PATH = "/yapay-zeka-gorunurluk-olcumu";
const TITLE = "Yapay Zeka Görünürlük Ölçümü — İşletmeniz ChatGPT ve Gemini'de Çıkıyor mu? (Ücretsiz) | markaizi";
const DESC =
  "İşletmenizin yapay zekadaki görünürlüğünü ölçüp iyileştiren bir ajans var mı? Evet: ChatGPT, Gemini, Perplexity ve Google yapay zeka özetlerinde markanızın çıkıp çıkmadığını ücretsiz ölçüyor, eksikleri ve iyileştirme adımlarını yazılı raporluyoruz. Bağlayıcı değil.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  keywords:
    "yapay zeka görünürlük ölçümü, chatgpt'de görünüyor muyum, işletmemin yapay zekadaki görünürlüğü, yapay zeka görünürlüğü ölçme, ai görünürlük ajansı, geo ajansı ankara, chatgpt marka görünürlüğü, gemini işletme önerisi, perplexity görünürlük",
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: { title: TITLE, description: DESC, type: "website", locale: "tr_TR", url: `${SITE_URL}${PATH}` },
};

const FAQ: FAQItem[] = [
  {
    q: "İşletmemin yapay zekadaki görünürlüğünü ölçüp iyileştirecek bir ajans var mı?",
    a: "Evet. markaizi önce görünürlüğünüzü ölçer: sektörünüzde müşterilerin sorabileceği soruları ChatGPT, Gemini, Perplexity ve Google'ın yapay zeka özetine sorar, işletmenizin çıkıp çıkmadığını, hangi bilgilerle ve hangi sayfanız kaynak gösterilerek anıldığını ve hangi rakiplerin önerildiğini kaydeder. Sonra eksikleri düzeltmeye yönelik GEO çalışması önerir. Ölçüm ücretsiz ve bağlayıcı değildir; iyileştirme ayrı bir hizmettir.",
  },
  {
    q: "Ölçüm gerçekten ücretsiz mi, bir şey satmaya çalışıyor musunuz?",
    a: "Ölçüm ücretsiz ve bağlayıcı değil. Sonucu ve önerileri size yazılı iletiyoruz; isterseniz bu önerileri kendi ekibinizle uygulayabilirsiniz. Birlikte çalışmak isterseniz iyileştirme için ayrıca teklif hazırlarız.",
  },
  {
    q: "Ölçümde hangi araçlara bakıyorsunuz?",
    a: "ChatGPT, Gemini, Perplexity ve Google'ın yapay zeka özetleri. Bunların cevapları kişiye, konuma ve güne göre değişebildiği için tek bir sonuç yerine birkaç sorunun sonuçlarını birlikte değerlendiriyoruz.",
  },
  {
    q: "Ölçüm sonucunda çıkacağımı garanti eder misiniz?",
    a: "Hayır. Yapay zeka cevapları değişkendir ve hiçbir ajans bir asistanın sizi önereceğini garanti edemez. Raporun amacı, nerede olduğunuzu net görmeniz ve görünürlüğü etkileyen eksikleri sırayla kapatabilmenizdir.",
  },
  {
    q: "Benim için hangi sorular seçiliyor?",
    a: "Sektörünüzü, şehrinizi ve hizmetlerinizi sorarak sizin müşterinizin yapay zekaya sorabileceği 10-12 soru belirliyoruz. Örneğin 'Ankara'da en iyi kahvaltı mekanı hangisi' ya da 'Siteler'de mobilya mağazası öner'. İsterseniz kendi sorularınızı da ekleyebilirsiniz.",
  },
  {
    q: "Sonuç ne zaman gelir, hesabıma erişim vermem gerekir mi?",
    a: "Genellikle 2-3 iş günü içinde. Hiçbir hesap erişimi gerekmez; ölçüm herkese açık yapay zeka araçlarında ve web sitenizde yapılır. Şifre istemeyiz.",
  },
  {
    q: "GEO ile SEO aynı şey mi?",
    a: "Birbirini tamamlar. SEO, Google'ın arama sonuçlarındaki sıranızı hedefler; GEO ise yapay zekanın cevaplarında doğru anlatılmanızı ve önerilmenizi. İyi bir SEO altyapısı GEO'nun temelidir. Ayrıntı için Yapay Zeka Arama Görünürlüğü hizmet sayfamıza bakabilirsiniz.",
  },
];

const OLCUM = [
  { t: "Görünüyor musunuz?", d: "Sektörünüzle ilgili sorularda markanızın adı geçiyor mu, hangi sırada ve hangi cümleyle?" },
  { t: "Doğru anlatılıyor musunuz?", d: "Yapay zekanın işletmeniz hakkında söyledikleri doğru mu, adres, hizmet ve çalışma alanı güncel mi?" },
  { t: "Kaynak olarak hangi sayfanız gösteriliyor?", d: "Cevapların dayandığı sayfa sizin siteniz mi, bir dizin mi, rakip mi?" },
  { t: "Kimler öneriliyor?", d: "Aynı sorularda öne çıkan rakipler kimler ve onların sinyalleri neler?" },
  { t: "Altyapınız hazır mı?", d: "Web sitenizin netliği, yapılandırılmış veri, tutarlı iletişim bilgisi, Google İşletme Profili ve yorumlar." },
];

const ADIMLAR = [
  { t: "Formu doldurun", d: "Web sitenizi, sektörünüzü ve şehrinizi yazın. 1 dakika sürer." },
  { t: "Soruları belirleriz", d: "Müşterinizin yapay zekaya sorabileceği 10-12 soruyu seçeriz; isterseniz siz de eklersiniz." },
  { t: "Ölçeriz ve raporlarız", d: "Soruları farklı araçlara sorar, sonuçları kaydeder, yazılı kısa bir rapor ve öncelik sırasıyla yol haritası hazırlarız." },
];

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Yapay Zeka Görünürlük Ölçümü",
  serviceType: "Yapay zeka arama görünürlüğü ölçümü (GEO)",
  description:
    "İşletmenin ChatGPT, Gemini, Perplexity ve Google yapay zeka özetlerinde görünürlüğünün ücretsiz ölçümü ve iyileştirme önerileri.",
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
  { name: "Yapay Zeka Arama Görünürlüğü", path: "/hizmetler/yapay-zeka-arama-gorunurlugu" },
  { name: "Yapay Zeka Görünürlük Ölçümü", path: PATH },
]);

export default function YapayZekaGorunurlukOlcumuPage() {
  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumb} />
      <Navbar />
      <main>
        <section className="relative overflow-hidden pt-28 sm:pt-32 pb-16" style={{ background: "var(--bg)" }}>
          <div
            className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle,rgba(124,58,237,0.2) 0%,transparent 70%)", filter: "blur(80px)" }}
          />
          <div className="max-w-[1200px] mx-auto px-5 sm:px-6 relative z-10">
            <Breadcrumb
              items={[
                { name: "Ana Sayfa", path: "/" },
                { name: "Yapay Zeka Arama Görünürlüğü", path: "/hizmetler/yapay-zeka-arama-gorunurlugu" },
                { name: "Yapay Zeka Görünürlük Ölçümü" },
              ]}
            />
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-10 lg:gap-14 items-start mt-3">
              <div>
                <span className="section-tag">Ücretsiz · Bağlayıcı Değil · Şifre İstemiyoruz</span>
                <h1 className="font-black leading-tight mb-4 mt-2" style={{ fontSize: "clamp(30px,5vw,50px)", letterSpacing: "-1px" }}>
                  İşletmeniz ChatGPT ve Gemini&apos;de <span className="gradient-text">Çıkıyor mu?</span>
                </h1>
                <p className="text-[#8a8a9a] text-[17px] leading-relaxed mb-5">
                  Müşterileriniz artık yalnızca Google&apos;a yazmıyor, yapay zekaya soruyor: &quot;Ankara&apos;da en iyi
                  kahvaltı mekanı hangisi?&quot;, &quot;Siteler&apos;de mobilya mağazası öner.&quot; Bu cevaplarda adınız
                  geçiyor mu, doğru anlatılıyor musunuz, rakipleriniz mi öneriliyor? Ücretsiz ölçüp yazılı olarak
                  anlatalım.
                </p>
                <p className="text-[#8a8a9a] text-[15px] leading-relaxed mb-6">
                  Bu bir ölçüm hizmeti: hesabınıza erişim istemeden, herkese açık yapay zeka araçlarında ve web
                  sitenizde bakıyoruz. Sonucu beğenmezseniz de, önerileri kendi ekibinizle uygulayabilirsiniz.
                </p>
                <div className="grid grid-cols-2 gap-3 max-w-[520px]">
                  {[
                    { value: "₺0", label: "Ölçüm ücreti" },
                    { value: "2-3 gün", label: "Teslim süresi" },
                    { value: "4 araç", label: "ChatGPT, Gemini, Perplexity, Google" },
                    { value: "Erişim yok", label: "Hesap şifresi gerekmez" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl px-4 py-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                      <div className="text-[18px] font-black gradient-text leading-tight">{s.value}</div>
                      <div className="text-[12.5px] text-[#8a8a9a]">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <UcretsizAnalizForm variant="yz" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20" style={{ background: "var(--bg-alt)", borderTop: "1px solid var(--border)" }}>
          <div className="max-w-[900px] mx-auto px-5 sm:px-6">
            <span className="section-tag">Kısa Cevap</span>
            <h2 className="font-black leading-tight mt-2 mb-5" style={{ fontSize: "clamp(24px,3.5vw,36px)" }}>
              İşletmemin Yapay Zekadaki Görünürlüğünü <span className="gradient-text">Ölçüp İyileştiren Bir Ajans Var mı?</span>
            </h2>
            <p className="text-[#8a8a9a] text-[16px] leading-[1.9] mb-4">
              <strong className="text-white">Evet, markaizi bunu yapıyor.</strong> Önce ölçüyoruz: sektörünüzdeki
              soruları ChatGPT, Gemini, Perplexity ve Google&apos;ın yapay zeka özetine soruyor, işletmenizin çıkıp
              çıkmadığını, hangi sayfanızın kaynak gösterildiğini ve kimlerin önerildiğini kaydediyoruz. Sonra
              görünürlüğü etkileyen eksikleri (net anlatım, yapılandırılmış veri, tutarlı iletişim bilgisi, Google
              İşletme Profili, yorumlar, soru-cevap içerikleri) öncelik sırasıyla çıkarıyoruz.
            </p>
            <p className="text-[#8a8a9a] text-[15px] leading-[1.9]">
              Bu çalışmanın adı GEO (üretken arama motoru optimizasyonu) ve iyi bir SEO&apos;nun devamıdır. Yapay zeka
              cevapları kişiye, konuma ve güne göre değiştiği için kimse bir asistanın sizi önereceğini garanti
              edemez; ama nerede olduğunuzu ölçmek ve eksikleri kapatmak mümkün. İyileştirme hizmetimizin
              ayrıntısı{" "}
              <Link href="/hizmetler/yapay-zeka-arama-gorunurlugu" className="text-[#c084fc] underline underline-offset-2 hover:text-white">
                Yapay Zeka Arama Görünürlüğü
              </Link>{" "}
              sayfamızda.
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-20" style={{ background: "var(--bg)" }}>
          <div className="max-w-[1100px] mx-auto px-5 sm:px-6">
            <div className="max-w-[680px] mb-10">
              <span className="section-tag">Ne Ölçüyoruz?</span>
              <h2 className="font-black leading-tight mt-2" style={{ fontSize: "clamp(24px,3.5vw,36px)" }}>
                Ölçümde Bakılan <span className="gradient-text">Beş Şey</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {OLCUM.map((o) => (
                <div key={o.t} className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <h3 className="text-[16px] font-bold mb-2 text-white">{o.t}</h3>
                  <p className="text-[13.5px] text-[#8a8a9a] leading-relaxed">{o.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20" style={{ background: "var(--bg-alt)" }}>
          <div className="max-w-[1100px] mx-auto px-5 sm:px-6">
            <div className="max-w-[680px] mb-10">
              <span className="section-tag">Nasıl İşliyor?</span>
              <h2 className="font-black leading-tight mt-2" style={{ fontSize: "clamp(24px,3.5vw,36px)" }}>
                Üç Adımda <span className="gradient-text">Ölçüm</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {ADIMLAR.map((a, i) => (
                <div key={a.t} className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <div className="text-[13px] font-black gradient-text mb-3">0{i + 1}</div>
                  <h3 className="text-[16px] font-bold mb-2 text-white">{a.t}</h3>
                  <p className="text-[13.5px] text-[#8a8a9a] leading-relaxed">{a.d}</p>
                </div>
              ))}
            </div>
            <p className="text-[#8a8a9a] text-[14px] leading-relaxed mt-8 max-w-[760px]">
              Not: Yapay zeka cevapları değişkendir. Bu yüzden tek bir sonucu kesin kabul etmiyor, birkaç sorunun
              sonuçlarını birlikte ve zaman içinde izlemeyi öneriyoruz. Ayda bir tekrar ölçüm yapmak trendi gösterir.
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-20" style={{ background: "var(--bg)" }}>
          <ServiceFAQ faqs={FAQ} />
        </section>

        <section className="py-14" style={{ background: "var(--bg-alt)" }}>
          <div className="max-w-[760px] mx-auto px-5 sm:px-6 text-center">
            <h2 className="font-black text-[22px] mb-5">
              Ölçümden Önce <span className="gradient-text">Göz Atın</span>
            </h2>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
              {[
                { href: "/hizmetler/yapay-zeka-arama-gorunurlugu", label: "Yapay Zeka Arama Görünürlüğü (GEO)" },
                { href: "/blog/isletmenizin-chatgpt-de-gorunup-gorunmedigini-nasil-olcersiniz", label: "ChatGPT'de Görünüyor musunuz? Nasıl Ölçersiniz?" },
                { href: "/blog/yapay-zeka-isletme-onerirken-neye-bakar", label: "Yapay Zeka İşletme Önerirken Neye Bakar?" },
                { href: "/reklam-hesabi-denetimi", label: "Ücretsiz Reklam Hesabı Denetimi" },
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

        <section className="py-16 sm:py-20" style={{ background: "var(--bg)", borderTop: "1px solid var(--border)" }}>
          <div className="max-w-[560px] mx-auto px-5 sm:px-6 text-center">
            <h2 className="font-black text-[26px] sm:text-[30px] mb-3">
              Müşteriniz Yapay Zekaya Sorduğunda <span className="gradient-text">Siz Orada mısınız?</span>
            </h2>
            <p className="text-[#8a8a9a] mb-7 leading-relaxed">Formu doldurun ya da WhatsApp&apos;tan yazın; birlikte bakalım.</p>
            <a
              href="https://wa.me/905520772700?text=Merhaba%2C%20yapay%20zeka%20g%C3%B6r%C3%BCn%C3%BCrl%C3%BCk%20%C3%B6l%C3%A7%C3%BCm%C3%BC%20istiyorum."
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
