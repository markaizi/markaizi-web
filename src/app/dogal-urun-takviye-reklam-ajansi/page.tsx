import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";
import ServiceFAQ, { FAQItem } from "@/components/ServiceFAQ";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Doğal Ürün & Takviye Reklam Ajansı — Ürün Videosu, YouTube, E-Ticaret Reklamı | markaizi",
  description:
    "Vitamin, mineral, bitkisel takviye, doğal yağ ve doğal kozmetik markaları için mankenli/mankensiz ürün tanıtım videosu, YouTube içerik üretimi, e-ticaret reklamı ve bayi/distribütör pazarlaması. Fıtrina gibi doğal ürün markalarının tercih ettiği ajans.",
  keywords:
    "doğal ürün reklam ajansı, takviye gıda reklamı, bitkisel takviye sosyal medya yönetimi, vitamin mineral reklam ajansı, doğal yağ markası reklamı, kozmetik e-ticaret reklam ajansı, ürün tanıtım videosu çekimi, youtube ürün içerik üretimi, bayilik pazarlama içeriği, ankara doğal ürün reklamı, mankensiz ürün çekimi",
  alternates: { canonical: "https://markaizi.com.tr/dogal-urun-takviye-reklam-ajansi" },
  openGraph: {
    title: "Doğal Ürün & Takviye Reklam Ajansı | markaizi",
    description:
      "Vitamin, takviye, doğal yağ ve kozmetik markaları için ürün video çekimi, YouTube içerik üretimi ve e-ticaret reklamı.",
    type: "website",
    locale: "tr_TR",
    url: "https://markaizi.com.tr/dogal-urun-takviye-reklam-ajansi",
  },
};

const FAQ: FAQItem[] = [
  {
    q: "\"Tedavi eder\", \"hastalığı geçirir\" gibi ifadeler kullanabilir miyiz?",
    a: "Hayır — takviye gıda ve kozmetik ürünlerde tıbbi iddia içeren ifadeler (tedavi eder, iyileştirir, hastalığı geçirir gibi) hem reklam mevzuatı hem Meta/Google politikaları tarafından yasaklanır. Bu kurallara uymayan reklamlar reddedilir, hesabınız kısıtlanabilir. Ürününüzün faydasını mevzuata uygun, inandırıcı bir dille anlatan alternatif ifadeler kullanıyoruz — güven kaybetmeden, hesap riskine girmeden.",
  },
  {
    q: "Ürünüm gıda takviyesi/kozmetik, ilaç değil — reklam verebilir miyim?",
    a: "Evet, verebilirsiniz. Takviye gıda ve kozmetik ürünler için reklam vermek mümkündür; önemli olan doğru kategori beyanı ve tıbbi iddia içermeyen bir dil kullanmaktır. Kampanya kurulumunda bu ayrımı sizin adınıza doğru yapıyoruz.",
  },
  {
    q: "Mankenli mi mankensiz mi çekim daha iyi sonuç verir?",
    a: "İkisinin de yeri farklı. Mankenli çekim (bir kişinin ürünü gerçek hayatta kullanması) güven ve samimiyet kurar, özellikle Instagram/TikTok reklamında dönüşümü yükseltir. Mankensiz — sadece ürün odaklı, temiz stüdyo çekimi — katalog, e-ticaret sayfası ve \"profesyonel marka\" algısı için daha güçlüdür. Genelde ikisini birlikte kurguluyoruz: reklamda mankenli/samimi format, ürün sayfasında mankensiz/temiz format.",
  },
  {
    q: "Onlarca farklı ürünümüz var (vitamin, yağ, kozmetik, çocuk ürünü gibi) — her biri için ayrı içerik mi gerekiyor?",
    a: "Geniş bir katalogla çalışırken en büyük risk, marka dilinin ürün ürün dağılmasıdır. Biz önce tüm kategoriler için ortak bir görsel/anlatım dili kuruyoruz, sonra bu dili her ürün grubuna (takviye, yağ, kozmetik, çocuk ürünleri) uyarlıyoruz — hem tutarlı hem de her ürünün kendi hikayesini anlatabildiği bir sistem.",
  },
  {
    q: "YouTube kanalımızı siz mi yönetiyorsunuz?",
    a: "Evet — senaryo, çekim, kurgu ve yayın takvimini birlikte planlıyoruz. YouTube, takviye ve doğal ürün kategorisinde arama trafiğinin en yoğun olduğu platformlardan biri; \"nasıl kullanılır\", \"faydaları neler\" gibi uzun formatlı eğitici içerik hem güven inşa eder hem aylar sonra bile izlenmeye devam ederek organik trafik getirir.",
  },
  {
    q: "Bayilik/distribütör başvurusu almak istiyoruz — bunun için ayrı bir pazarlama mı gerekiyor?",
    a: "Evet, tüketiciye satış (B2C) ile bayi/distribütör kazanımı (B2B) tamamen farklı bir iletişim dili ister. Bayi adayına ürünün cazibesini değil, kâr marjını, stok/lojistik desteğini ve marka güvenilirliğini anlatan ayrı bir içerik ve reklam kurgusu hazırlıyoruz — bunu ürün reklamlarınızla karıştırmadan, ayrı hedef kitleye yönetiyoruz.",
  },
  {
    q: "E-ticaret sitem var, reklamı doğrudan oraya mı yönlendiriyorsunuz?",
    a: "Genellikle evet — reklamı doğrudan ilgili ürün/kategori sayfanıza yönlendirmek dönüşümü artırır. Sitenizin mobil hızı ve kullanılabilirliği reklam performansını doğrudan etkilediği için, gerekirse bu noktada da öneri sunuyoruz.",
  },
  {
    q: "Reklam bütçesi olarak ne kadar ayırmalıyım?",
    a: "Ürün grubunuza, kâr marjınıza ve hedeflediğiniz pazara (yurt içi/yurt dışı, perakende/bayi) göre değişir; ücretsiz görüşmede size uygun bir öneri netleştiririz. Bütçe doğrudan Meta/Google'a ödenir, biz yönetim hizmeti veririz — bütçenizden komisyon almayız.",
  },
];

const SERVICES = [
  {
    icon: "🎬",
    title: "Mankenli Ürün Tanıtım Videosu",
    desc: "Bir kişinin ürünü gerçek hayatta kullandığı, samimi ve güven veren format. Reklamda dönüşümü en çok artıran video türlerinden biri.",
  },
  {
    icon: "📦",
    title: "Mankensiz / Sadece Ürün Çekimi",
    desc: "Stüdyo ortamında, dönen platform ve makro çekimlerle temiz, profesyonel \"sadece ürün\" formatı — katalog ve e-ticaret sayfası için.",
  },
  {
    icon: "🎥",
    title: "YouTube İçerik Üretimi",
    desc: "Ürün kullanımını, faydalarını ve marka hikayesini anlatan uzun formatlı videolar. Aylar sonra bile izlenmeye devam eden kalıcı bir içerik varlığı.",
  },
  {
    icon: "🗣️",
    title: "Sosyal Kanıt (Testimonial) Çekimleri",
    desc: "Gerçek müşterilerinizin kendi deneyimini anlattığı, doğal ve inandırıcı video röportajları.",
  },
  {
    icon: "📸",
    title: "E-Ticaret Ürün Fotoğrafçılığı",
    desc: "Onlarca ürünlük kataloğunuz için tutarlı, profesyonel white-background ve lifestyle çekimler.",
  },
  {
    icon: "🎁",
    title: "Kampanya & Paket Görselleri",
    desc: "Sette/paket halinde satılan ürünleriniz (örn. bahar paketi, cilt bakım seti) için özel tasarlanmış kampanya görselleri.",
  },
  {
    icon: "🤝",
    title: "Bayi & Distribütör Kazanım İçeriği",
    desc: "Tüketiciye değil bayi adayına hitap eden, kâr marjı ve marka güvenilirliğini anlatan ayrı bir B2B içerik ve reklam kurgusu.",
  },
  {
    icon: "🎯",
    title: "Instagram & TikTok Reklamları",
    desc: "Sağlıklı yaşam ve doğal ürün ilgisi olan kitlelere, mevzuata uygun dille hedefli kampanyalar.",
  },
  {
    icon: "🔍",
    title: "Google & Arama Reklamları",
    desc: "\"Çörekotu yağı faydaları\", \"D3 vitamini nerede satılır\" gibi bilgi/satın alma niyetiyle arayan kullanıcıyı ürününüze yönlendiriyoruz.",
  },
];

const KATEGORILER = ["Vitamin & Mineral Takviyeleri", "Bitkisel İçerikli Takviyeler", "Doğal Yağlar", "Doğal Kozmetik & Kişisel Bakım", "Çocuk Destek Ürünleri"];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Doğal Ürün & Takviye Reklam Ajansı Hizmetleri",
  serviceType: "Doğal ürün ve takviye gıda sektörü içerik üretimi ve reklam yönetimi",
  provider: {
    "@type": "ProfessionalService",
    name: "markaizi Dijital Reklam Ajansı",
    url: "https://markaizi.com.tr",
    telephone: "+90-552-077-27-00",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Zübeyde Hanım Mahallesi Elif Sokak No:7/106 2. Kat, Sütçü Kemal İş Merkezi",
      addressLocality: "Ankara",
      addressRegion: "Ankara",
      postalCode: "06110",
      addressCountry: "TR",
    },
  },
  areaServed: [
    { "@type": "City", name: "Ankara" },
    { "@type": "Country", name: "Türkiye" },
  ],
  audience: { "@type": "Audience", audienceType: "Vitamin, mineral, bitkisel takviye, doğal yağ ve doğal kozmetik markaları" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const breadcrumb = breadcrumbJsonLd([
  { name: "Ana Sayfa", path: "/" },
  { name: "Doğal Ürün & Takviye Reklam Ajansı", path: "/dogal-urun-takviye-reklam-ajansi" },
]);

export default function DogalUrunTakviyeReklamAjansiPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <JsonLd data={breadcrumb} />
      <Navbar />
      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden pt-32 pb-20" style={{ background: "var(--bg)" }}>
          <div
            className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle,rgba(124,58,237,0.2) 0%,transparent 70%)", filter: "blur(80px)" }}
          />
          <div
            className="absolute top-[50px] right-[-150px] w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle,rgba(236,72,153,0.15) 0%,transparent 70%)", filter: "blur(80px)" }}
          />

          <div className="max-w-[1200px] mx-auto px-6 relative z-10">
            <div className="max-w-[820px]">
              <Breadcrumb items={[{ name: "Ana Sayfa", path: "/" }, { name: "Doğal Ürün & Takviye Reklam Ajansı" }]} />
              <span className="section-tag">Ankara</span>
              <h1
                className="font-black leading-tight mb-5 mt-2"
                style={{ fontSize: "clamp(32px,5vw,54px)", letterSpacing: "-1px" }}
              >
                Doğal Ürün & <span className="gradient-text">Takviye Reklam Ajansı</span>
              </h1>
              <p className="text-[#8a8a9a] text-[18px] leading-relaxed mb-4">
                Vitamin ve mineral takviyelerinden bitkisel içerikli ürünlere, doğal yağlardan kozmetiğe —
                geniş bir ürün kataloğünü tek bir marka dilinde tutarlı şekilde pazarlıyoruz. Ankara&apos;dan
                Türkiye geneline satış yapan <strong className="text-white">Fıtrina</strong> gibi doğal ürün
                markalarının tercih ettiği ekibiz.
              </p>
              <p className="text-[#8a8a9a] text-[16px] leading-relaxed mb-8">
                Mankenli ürün tanıtım videosundan mankensiz stüdyo çekimine, YouTube içerik üretiminden
                bayi/distribütör kazanımına — bu sektörün hem içerik hem reklam politikası açısından ne
                istediğini biliyoruz.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="https://wa.me/905520772700?text=Merhaba%2C%20do%C4%9Fal%20%C3%BCr%C3%BCn%2Ftakviye%20markam%20i%C3%A7in%20i%C3%A7erik%20%2F%20reklam%20hizmeti%20almak%20istiyorum." target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  WhatsApp&apos;tan Ücretsiz Teklif Al
                </a>
                <Link href="/ucretsiz-analiz" className="btn btn-outline">
                  Ücretsiz Analiz İste
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Hizmet Verdiğimiz Ürün Kategorileri ── */}
        <section className="py-14" style={{ background: "var(--bg-alt)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
          <div className="max-w-[1200px] mx-auto px-6">
            <p className="text-center text-[13px] font-semibold text-[#8a8a9a] uppercase tracking-widest mb-8">
              Hizmet verdiğimiz ürün kategorileri
            </p>
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
              {KATEGORILER.map((m) => (
                <span key={m} className="text-[16px] font-black text-white/30">{m}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Neden Sektöre Özel Yaklaşım ── */}
        <section className="py-20" style={{ background: "var(--bg)" }}>
          <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <div>
              <span className="section-tag">Neden markaizi?</span>
              <h2 className="font-black leading-tight mb-5 mt-2" style={{ fontSize: "clamp(26px,3.5vw,38px)" }}>
                Geniş Katalog, <span className="gradient-text">Tek Marka Dili</span>
              </h2>
              <p className="text-[#8a8a9a] text-[16px] leading-[1.9] mb-5">
                Fıtrina gibi onlarca farklı ürünü (vitamin, mineral, bitkisel takviye, doğal yağ, çocuk
                şurubu, kozmetik) tek çatı altında satan bir markayla çalışırken öğrendiğimiz şey şu:
                generic bir ajans bu çeşitliliği kolayca dağıtır. Biz önce ortak bir görsel ve anlatım dili
                kuruyoruz, sonra bunu her ürün grubuna kendi hikayesini kaybetmeden uyarlıyoruz.
              </p>
              <p className="text-[#8a8a9a] text-[16px] leading-[1.9] mb-5">
                Doğal ürün ve geleneksel yöntem alıcısı, parlak bir reklamdan çok gerçek bir deneyime
                inanır. Aynı zamanda bu alan, reklam politikaları açısından en hassas alanlardan biri —
                "tedavi eder" gibi bir ifade tek başına reklamınızı reddettirebilir. 200+ Ankara
                işletmesiyle 10 yılı aşkın süredir çalışan ekibimiz, bu sınırların nerede olduğunu bilir ve
                mesajınızı gücünden ödün vermeden bu sınırlar içinde kurar.
              </p>
              <p className="text-[#8a8a9a] text-[16px] leading-[1.9]">
                Perakende müşteriye satış ile bayi/distribütör kazanımı da bizim için ayrı işlerdir — ikisini
                aynı reklamla karıştırmayız, her birine kendi diliyle hitap ederiz.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "200+", label: "Ankara işletmesi ile çalıştık" },
                { value: "10+", label: "Yıl sektör deneyimi" },
                { value: "24-48s", label: "Ücretsiz analiz teslim süresi" },
                { value: "0₺", label: "Analiz ve ön görüşme ücreti" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl p-6 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <div className="text-[34px] font-black gradient-text leading-none mb-2">{s.value}</div>
                  <div className="text-[13px] text-[#8a8a9a] leading-snug">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Hizmetler ── */}
        <section className="py-20" style={{ background: "var(--bg-alt)" }}>
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center max-w-[680px] mx-auto mb-14">
              <span className="section-tag">Hizmetler</span>
              <h2 className="font-black leading-tight mt-2" style={{ fontSize: "clamp(26px,3.5vw,38px)" }}>
                Markanız İçin <span className="gradient-text">Neler Yapıyoruz?</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SERVICES.map((s) => (
                <div key={s.title} className="service-card rounded-2xl p-8" style={{ background: "var(--surface)" }}>
                  <div className="text-3xl mb-4">{s.icon}</div>
                  <h3 className="text-[17px] font-bold mb-3 text-white">{s.title}</h3>
                  <p className="text-[14px] text-[#8a8a9a] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Süreç ── */}
        <section className="py-20" style={{ background: "var(--bg)" }}>
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center max-w-[680px] mx-auto mb-14">
              <span className="section-tag">Nasıl Çalışıyoruz?</span>
              <h2 className="font-black leading-tight mt-2" style={{ fontSize: "clamp(26px,3.5vw,38px)" }}>
                Kataloğunuzdan <span className="gradient-text">Satışa Giden Yol</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: "01", title: "Katalog & Marka Analizi", desc: "Ürün kategorilerinizi, hedef kitlenizi (perakende ve bayi ayrı) ve mevcut dijital durumunuzu inceliyoruz." },
                { step: "02", title: "Çekim Planı", desc: "Hangi üründe mankenli, hangisinde mankensiz format, hangisinde YouTube içeriği daha güçlü — birlikte planlıyoruz." },
                { step: "03", title: "Prodüksiyon & Reklam", desc: "Çekimleri yapıp, mevzuata uygun kampanyaları yayına alıyoruz." },
                { step: "04", title: "Rapor & Optimizasyon", desc: "Perakende ve bayi kanallarını ayrı raporlar, bütçeyi en verimli ürün/kanala kaydırırız." },
              ].map((p) => (
                <div key={p.step} className="rounded-2xl p-7" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <div className="text-[13px] font-black gradient-text mb-3">{p.step}</div>
                  <h3 className="text-[16px] font-bold mb-2 text-white">{p.title}</h3>
                  <p className="text-[13px] text-[#8a8a9a] leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SSS ── */}
        <section className="py-20" style={{ background: "var(--bg-alt)" }}>
          <ServiceFAQ faqs={FAQ} />
        </section>

        {/* ── CTA ── */}
        <section className="py-20" style={{ background: "var(--bg)", borderTop: "1px solid var(--border)" }}>
          <div className="max-w-[680px] mx-auto px-6 text-center">
            <h2 className="font-black text-[32px] mb-4">
              Markanız İçin <span className="gradient-text">Ücretsiz Analiz</span>
            </h2>
            <p className="text-[#8a8a9a] mb-8 leading-relaxed">
              Mevcut Instagram/YouTube hesabınızı ve e-ticaret sitenizi inceleyip, markanıza özel içerik
              ve reklam yol haritasını 24-48 saat içinde önünüze koyalım. Görüşme ücretsiz, karar sizin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/ucretsiz-analiz" className="btn btn-primary">
                Ücretsiz Analiz İste
              </Link>
              <a href="https://wa.me/905520772700?text=Merhaba%2C%20do%C4%9Fal%20%C3%BCr%C3%BCn%2Ftakviye%20markam%20i%C3%A7in%20%C3%BCcretsiz%20analiz%20istiyorum." target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                WhatsApp&apos;tan Yaz
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsApp />
    </>
  );
}
