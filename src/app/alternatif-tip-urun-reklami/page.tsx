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
  title: "Alternatif Tıp & Doğal Ürün Reklam Ajansı — YouTube & İçerik Çekimi | markaizi",
  description:
    "Çörekotu yağı, bal, bitkisel takviye gibi doğal ürün markaları için YouTube içerik üretimi, sosyal kanıt (testimonial) çekimleri, ev içi/mutfak çekimleri ve reklam politikalarına uygun Instagram & Google reklamları.",
  keywords:
    "alternatif tıp reklam ajansı, doğal ürün reklamı, çörekotu yağı reklamı, bitkisel ürün sosyal medya, youtube içerik üretimi, sosyal kanıt video çekimi, geleneksel tedavi ürün pazarlaması, aktar reklam ajansı",
  alternates: { canonical: "https://markaizi.com.tr/alternatif-tip-urun-reklami" },
  openGraph: {
    title: "Alternatif Tıp & Doğal Ürün Reklam Ajansı | markaizi",
    description:
      "Doğal ve geleneksel ürün markaları için YouTube, sosyal kanıt ve ev içi çekim odaklı içerik üretimi ve reklam yönetimi.",
    type: "website",
    locale: "tr_TR",
    url: "https://markaizi.com.tr/alternatif-tip-urun-reklami",
  },
};

const FAQ: FAQItem[] = [
  {
    q: "\"Tedavi eder\", \"kesin çözüm\" gibi ifadeler kullanabilir miyiz?",
    a: "Hayır — hem reklam mevzuatı hem Meta/Google politikaları, tıbbi iddia içeren ifadeleri (tedavi eder, iyileştirir, hastalığı geçirir gibi) yasaklıyor. Bu kurallara uymayan reklamlar reddedilir, hesabınız kısıtlanabilir. Biz ürününüzün faydasını, mevzuata uygun ve inandırıcı bir dille anlatan alternatif ifadeler kullanıyoruz — güven kaybetmeden, riske girmeden.",
  },
  {
    q: "Ürünüm gıda takviyesi/kozmetik, ilaç değil — reklam verebilir miyim?",
    a: "Evet, verebilirsiniz. Gıda takviyesi ve kozmetik ürünler için reklam vermek mümkün; önemli olan doğru kategori beyanı ve tıbbi iddia içermeyen bir dil kullanmak. Kampanya kurulumunda bu ayrımı sizin adınıza doğru yapıyoruz.",
  },
  {
    q: "YouTube kanalımızı siz mi yönetiyorsunuz?",
    a: "Evet — senaryo, çekim, kurgu ve yayın takvimini birlikte planlıyoruz. YouTube, doğal ürün ve geleneksel yöntemlerle ilgili arama trafiğinin en yoğun olduğu platformlardan biri; uzun formatlı, eğitici içerik hem güven inşa eder hem de aylar sonra bile izlenmeye devam ederek organik trafik getirir.",
  },
  {
    q: "Ev içi / mutfak çekimi nedir, neden önemli?",
    a: "Ürününüzün stüdyo değil gerçek bir yaşam ortamında (mutfakta, kahvaltı sofrasında) nasıl kullanıldığını gösteren, samimi ve doğal çekimlerdir. Örneğin çörekotu yağının sabah kahvaltısında nasıl tüketildiğini gösteren bir video, cilalı bir reklamdan çok daha ikna edici ve paylaşılabilir olur — izleyici kendini o an içinde görür.",
  },
  {
    q: "Sosyal kanıt (testimonial) çekimlerini nasıl yapıyorsunuz?",
    a: "Gerçek müşterilerinizle iletişime geçip, onların deneyimini kendi cümleleriyle, doğal bir ortamda anlattığı kısa video röportajları çekiyoruz. Kurgusal veya abartılı senaryolar değil, gerçek ve doğrulanabilir deneyimler — hem izleyici güveni hem platform politikaları açısından en sağlam sosyal kanıt biçimidir.",
  },
  {
    q: "Reklam bütçesi olarak ne kadar ayırmalıyım?",
    a: "Ürün grubunuza ve hedeflediğiniz pazara göre değişir; ücretsiz görüşmede size uygun bir öneri netleştiririz. Bütçe doğrudan Meta/Google/YouTube'a ödenir, biz yönetim hizmeti veririz — bütçenizden komisyon almayız.",
  },
];

const SERVICES = [
  {
    icon: "🎥",
    title: "YouTube İçerik Üretimi",
    desc: "Ürününüzün kullanımını, faydalarını ve hikayesini anlatan uzun formatlı, eğitici videolar. Aylar sonra bile izlenmeye devam eden kalıcı bir içerik varlığı.",
  },
  {
    icon: "🗣️",
    title: "Sosyal Kanıt (Testimonial) Çekimleri",
    desc: "Gerçek müşterilerinizin kendi deneyimini anlattığı, doğal ve inandırıcı video röportajları.",
  },
  {
    icon: "🍳",
    title: "Ev İçi & Mutfak Çekimleri",
    desc: "Ürününüzün günlük yaşamda, gerçek bir ev ortamında nasıl kullanıldığını gösteren samimi format çekimler.",
  },
  {
    icon: "🎯",
    title: "Instagram & TikTok Reklamları",
    desc: "Doğal yaşam ve geleneksel yöntemlerle ilgilenen kitlelere, mevzuata uygun dille hedefli kampanyalar.",
  },
  {
    icon: "📦",
    title: "Ürün Fotoğrafçılığı",
    desc: "E-ticaret ve sosyal medya için profesyonel, ürününüzün doğallığını yansıtan stüdyo çekimleri.",
  },
  {
    icon: "🔍",
    title: "Google Reklamları",
    desc: "\"Çörekotu yağı faydaları\" gibi bilgi arayan kullanıcıyı, doğru ve mevzuata uygun içerikle ürününüze yönlendiriyoruz.",
  },
];

const ALANLAR = ["Doğal Yağ & Takviye Markaları", "Bitkisel Ürün Üreticileri", "Geleneksel Gıda Markaları", "Aktar & Şifalı Ürün Satıcıları"];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Alternatif Tıp & Doğal Ürün Reklam Ajansı Hizmetleri",
  serviceType: "Alternatif tıp ve doğal ürün sektörü içerik üretimi ve reklam yönetimi",
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
  audience: { "@type": "Audience", audienceType: "Doğal ürün markaları, bitkisel takviye üreticileri ve alternatif tıp uygulayıcıları" },
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
  { name: "Alternatif Tıp & Doğal Ürün Reklamı", path: "/alternatif-tip-urun-reklami" },
]);

export default function AlternatifTipUrunReklamiPage() {
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
            <div className="max-w-[780px]">
              <Breadcrumb items={[{ name: "Ana Sayfa", path: "/" }, { name: "Alternatif Tıp & Doğal Ürün Reklamı" }]} />
              <span className="section-tag">Ankara</span>
              <h1
                className="font-black leading-tight mb-5 mt-2"
                style={{ fontSize: "clamp(32px,5vw,54px)", letterSpacing: "-1px" }}
              >
                Alternatif Tıp & <span className="gradient-text">Doğal Ürün Reklamı</span>
              </h1>
              <p className="text-[#8a8a9a] text-[18px] leading-relaxed mb-4">
                Çörekotu yağından bitkisel takviyeye, geleneksel yöntemlerden doğal kozmetiğe — ürününüzün
                hikayesini YouTube, sosyal kanıt ve ev içi çekimlerle güvenilir bir şekilde anlatıyoruz.
              </p>
              <p className="text-[#8a8a9a] text-[16px] leading-relaxed mb-8">
                Bu alanda güven, cilalı reklamla değil gerçek deneyimle kurulur. Reklam mevzuatına ve
                platform politikalarına uygun kalarak, izleyicinin kendini gördüğü içgüdüsel içerikler
                üretiyoruz.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="https://wa.me/905520772700?text=Merhaba%2C%20do%C4%9Fal%20%C3%BCr%C3%BCn%20markam%20i%C3%A7in%20i%C3%A7erik%20%2F%20reklam%20hizmeti%20almak%20istiyorum." target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  WhatsApp&apos;tan Ücretsiz Teklif Al
                </a>
                <Link href="/ucretsiz-analiz" className="btn btn-outline">
                  Ücretsiz Analiz İste
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Hizmet Verdiğimiz Alanlar ── */}
        <section className="py-14" style={{ background: "var(--bg-alt)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
          <div className="max-w-[1200px] mx-auto px-6">
            <p className="text-center text-[13px] font-semibold text-[#8a8a9a] uppercase tracking-widest mb-8">
              Hizmet verdiğimiz alanlar
            </p>
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
              {ALANLAR.map((m) => (
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
                Bu Alanda Güven, <span className="gradient-text">Sahne Işığıyla Kurulmaz</span>
              </h2>
              <p className="text-[#8a8a9a] text-[16px] leading-[1.9] mb-5">
                Doğal ürün ve geleneksel yöntem alıcısı, parlak bir reklamdan çok gerçek bir deneyime inanır.
                Komşusunun mutfağında gördüğü bir kullanımı, stüdyoda çekilmiş bir reklamdan daha ikna edici
                bulur. Biz de içeriği buna göre kurguluyoruz.
              </p>
              <p className="text-[#8a8a9a] text-[16px] leading-[1.9] mb-5">
                Aynı zamanda bu alan, reklam politikaları açısından en hassas alanlardan biri. "Tedavi eder"
                gibi bir ifade tek başına reklamınızı reddettirebilir, hatta hesabınızı kısıtlayabilir.
                200+ Ankara işletmesiyle 10 yılı aşkın süredir çalışan ekibimiz, bu sınırların nerede
                olduğunu biliyor ve mesajınızı gücünden ödün vermeden bu sınırlar içinde kuruyor.
              </p>
              <p className="text-[#8a8a9a] text-[16px] leading-[1.9]">
                YouTube'da uzun ömürlü eğitici içerik, Instagram'da sosyal kanıt, mutfağınızda gerçek
                kullanım — üçünü birlikte kurguladığımızda ortaya çıkan şey reklam değil, güven.
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
                Üründen <span className="gradient-text">Güvene Giden Yol</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: "01", title: "Tanışma & Analiz", desc: "Ürününüzü, kullanım alışkanlıklarını ve mevcut dijital durumunuzu inceliyoruz." },
                { step: "02", title: "İçerik Kurgusu", desc: "YouTube, testimonial ve ev içi çekim planını mevzuata uygun dille hazırlıyoruz." },
                { step: "03", title: "Çekim & Yayın", desc: "İçerikleri üretip, reklam kampanyalarını yayına alıyoruz." },
                { step: "04", title: "Rapor & Optimizasyon", desc: "İzlenme, etkileşim ve satışı ölçüyor, bütçeyi en verimli içeriğe kaydırıyoruz." },
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
              Mevcut Instagram/YouTube hesabınızı inceleyip, markanıza özel içerik ve reklam
              yol haritasını 24-48 saat içinde önünüze koyalım. Görüşme ücretsiz, karar sizin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/ucretsiz-analiz" className="btn btn-primary">
                Ücretsiz Analiz İste
              </Link>
              <a href="https://wa.me/905520772700?text=Merhaba%2C%20do%C4%9Fal%20%C3%BCr%C3%BCn%20markam%20i%C3%A7in%20%C3%BCcretsiz%20analiz%20istiyorum." target="_blank" rel="noopener noreferrer" className="btn btn-outline">
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
