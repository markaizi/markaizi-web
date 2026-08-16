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
  title: "Sağlık & Klinik Reklam Ajansı — Diş, Estetik, Tıp Merkezleri | markaizi",
  description:
    "Diş klinikleri, estetisyen ve güzellik merkezleri, fizik tedavi ve alternatif tıp uygulayıcıları için Instagram & Google reklamları, sosyal medya yönetimi ve klinik çekimi. Sağlık reklam politikalarını bilen ajans.",
  keywords:
    "sağlık reklam ajansı, klinik reklam ajansı, diş kliniği reklamı, estetisyen instagram reklamı, ankara sağlık dijital pazarlama, diş hekimi sosyal medya yönetimi, alternatif tıp reklamı, poliklinik google reklamları",
  alternates: { canonical: "https://markaizi.com.tr/saglik-klinik-reklam-ajansi" },
  openGraph: {
    title: "Sağlık & Klinik Reklam Ajansı — Ankara | markaizi",
    description:
      "Diş, estetik ve sağlık merkezleri için reklam politikalarına uygun, hasta odaklı dijital pazarlama.",
    type: "website",
    locale: "tr_TR",
    url: "https://markaizi.com.tr/saglik-klinik-reklam-ajansi",
  },
};

const FAQ: FAQItem[] = [
  {
    q: "Sağlık sektöründe reklam vermenin genel reklamdan farkı ne?",
    a: "Meta ve Google, sağlıkla ilgili reklamlara ekstra kurallar uyguluyor: bazı hedefleme seçenekleri kısıtlı, 'tedavi eder', 'kesin sonuç' gibi iddialı ifadeler reddediliyor, öncesi-sonrası görsellerinde de belirli sınırlar var. Bu kuralları bilmeyen bir ajans kampanyanızı sürekli reddedilme veya hesap kısıtlanması riskiyle karşı karşıya bırakır. Biz kampanyaları baştan bu kurallara uygun kuruyoruz.",
  },
  {
    q: "Hasta öncesi/sonrası fotoğraflarını reklamda kullanabilir miyiz?",
    a: "Kullanılabilir ama hem platform politikaları hem hasta onam/KVKK süreçleri gerektirir — hastanın yazılı izni olmadan hiçbir görsel veya vaka bilgisi paylaşılmaz. İzin süreçlerini nasıl yöneteceğinizi de birlikte netleştiririz.",
  },
  {
    q: "Klinik/muayenehane içi çekimleri siz mi yapıyorsunuz?",
    a: "Evet. Kliniğinize gelip hekim tanıtım videosu, tedavi süreci anlatımı ve mekan çekimi yapıyoruz. Sağlık sektöründe hastanın karar sürecinde güven duygusu belirleyicidir — profesyonel, temiz ve güven veren görsel dil bunu doğrudan etkiler.",
  },
  {
    q: "Google Haritalar'da öne çıkmak için ne yapıyorsunuz?",
    a: "\"Yakınımdaki diş kliniği\" gibi lokal aramalarda görünürlüğünüzü artırmak için işletme profilinizi optimize eder, hasta yorumlarını yönetir ve randevu odaklı içerik ekleriz. Sağlık sektöründe hasta kararının büyük kısmı Google Haritalar üzerinden şekilleniyor.",
  },
  {
    q: "Reklam bütçesi olarak ne kadar ayırmalıyım?",
    a: "Klinik büyüklüğüne ve hedeflediğiniz tedavi türüne göre değişir; ücretsiz görüşmede ihtiyacınıza uygun bir öneri netleştiririz. Bütçe doğrudan Meta/Google'a ödenir, biz yönetim hizmeti veririz — bütçenizden komisyon almayız.",
  },
];

const SERVICES = [
  {
    icon: "🎬",
    title: "Klinik & Hekim Çekimi",
    desc: "Muayenehane/klinik içi profesyonel fotoğraf ve tanıtım videosu. Güven veren, temiz bir görsel dil hasta kararını doğrudan etkiler.",
  },
  {
    icon: "🎯",
    title: "Instagram & Facebook Reklamları",
    desc: "Diş, estetik, fizik tedavi gibi ilgi alanlarına göre hedefli kampanyalar — sağlık reklam politikalarına uygun kurgu.",
  },
  {
    icon: "🔍",
    title: "Google Reklamları",
    desc: "\"Ankara diş kliniği\", \"estetisyen randevu\" gibi aramalar yapan, randevuya hazır hastayı size yönlendiriyoruz.",
  },
  {
    icon: "📍",
    title: "Google Haritalar & Yerel SEO",
    desc: "\"Yakınımdaki klinik\" aramalarında öne çıkın. İşletme profili optimizasyonu ve hasta yorumu yönetimi.",
  },
  {
    icon: "📱",
    title: "Sosyal Medya Yönetimi",
    desc: "Tedavi süreçlerini, hasta memnuniyetini ve klinik kültürünü anlatan düzenli, güven veren içerik takvimi.",
  },
  {
    icon: "🌐",
    title: "Randevu Odaklı Web Sitesi",
    desc: "WhatsApp/telefon entegreli, mobilde hızlı açılan, randevu almayı kolaylaştıran modern klinik web siteleri.",
  },
];

const ALANLAR = ["Diş Klinikleri", "Estetik & Güzellik Merkezleri", "Fizik Tedavi Merkezleri", "Alternatif Tıp Uygulayıcıları", "Özel Poliklinikler"];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Sağlık & Klinik Reklam Ajansı Hizmetleri",
  serviceType: "Sağlık sektörü dijital pazarlama ve reklam yönetimi",
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
  audience: { "@type": "Audience", audienceType: "Diş klinikleri, estetisyenler, fizik tedavi merkezleri ve alternatif tıp uygulayıcıları" },
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
  { name: "Sağlık & Klinik Reklam Ajansı", path: "/saglik-klinik-reklam-ajansi" },
]);

export default function SaglikKlinikReklamAjansiPage() {
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
              <Breadcrumb items={[{ name: "Ana Sayfa", path: "/" }, { name: "Sağlık & Klinik Reklam Ajansı" }]} />
              <span className="section-tag">Ankara</span>
              <h1
                className="font-black leading-tight mb-5 mt-2"
                style={{ fontSize: "clamp(32px,5vw,54px)", letterSpacing: "-1px" }}
              >
                Sağlık & Klinik <span className="gradient-text">Reklam Ajansı</span>
              </h1>
              <p className="text-[#8a8a9a] text-[18px] leading-relaxed mb-4">
                Diş kliniğinden estetisyene, fizik tedaviden alternatif tıp uygulayıcısına — hasta güveni
                gerektiren bir sektörde reklam politikalarını bilen bir ekiple çalışın.
              </p>
              <p className="text-[#8a8a9a] text-[16px] leading-relaxed mb-8">
                Sağlıkla ilgili reklamlarda Meta ve Google&apos;ın kendine özgü kısıtlamaları var. Bu kuralları
                bilmeden kurulan kampanyalar reddedilir veya hesap kısıtlanmasına yol açar — biz baştan
                doğru kuruyoruz.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="https://wa.me/905520772700?text=Merhaba%2C%20klini%C4%9Fim%2Fmuayenehanem%20i%C3%A7in%20reklam%20hizmeti%20almak%20istiyorum." target="_blank" rel="noopener noreferrer" className="btn btn-primary">
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

        {/* ── Neden Sektör Uzmanı ── */}
        <section className="py-20" style={{ background: "var(--bg)" }}>
          <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <div>
              <span className="section-tag">Neden markaizi?</span>
              <h2 className="font-black leading-tight mb-5 mt-2" style={{ fontSize: "clamp(26px,3.5vw,38px)" }}>
                Sağlıkta Reklam, <span className="gradient-text">Ekstra Dikkat İster</span>
              </h2>
              <p className="text-[#8a8a9a] text-[16px] leading-[1.9] mb-5">
                Hasta bir tedaviye karar vermeden önce güven arar; Google&apos;da araştırır, yorumları okur,
                kliniğin sosyal medyasına bakar. Bu yolculukta yanlış ya da politika dışı bir görsel, sadece
                hesabınızı değil itibarınızı da riske atar.
              </p>
              <p className="text-[#8a8a9a] text-[16px] leading-[1.9] mb-5">
                200+ Ankara işletmesiyle 10 yılı aşkın süredir çalışan ekibimiz, Meta ve Google&apos;ın sağlık
                reklamlarına özel kurallarını takip ediyor: hangi ifadeler reddedilir, hangi hedefleme
                seçenekleri kısıtlıdır, öncesi-sonrası görseli nasıl ve ne zaman kullanılabilir — bunları
                baştan doğru kurguluyoruz.
              </p>
              <p className="text-[#8a8a9a] text-[16px] leading-[1.9]">
                Amacımız hesabınızı riske atmadan, hastanın güvenini kazanan bir dijital varlık kurmak.
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
                Kliniğiniz İçin <span className="gradient-text">Neler Yapıyoruz?</span>
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
                Kliniğinizden <span className="gradient-text">Randevuya Giden Yol</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: "01", title: "Tanışma & Analiz", desc: "Kliniğinizi, tedavi alanlarınızı ve mevcut dijital durumunuzu inceliyoruz." },
                { step: "02", title: "Politika Uyumlu Strateji", desc: "Meta/Google sağlık kurallarına uygun kampanya planı ve klinik çekimi." },
                { step: "03", title: "Reklam & İçerik", desc: "Kampanyalar yayına giriyor, sosyal medyanız düzenli, güven veren içerikle besleniyor." },
                { step: "04", title: "Rapor & Optimizasyon", desc: "Gelen randevu talebini ölçüyor, bütçeyi en verimli hedef kitleye kaydırıyoruz." },
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
              Kliniğiniz İçin <span className="gradient-text">Ücretsiz Analiz</span>
            </h2>
            <p className="text-[#8a8a9a] mb-8 leading-relaxed">
              Mevcut Instagram hesabınızı ve dijital görünürlüğünüzü inceleyip, kliniğinize özel
              yol haritasını 24-48 saat içinde önünüze koyalım. Görüşme ücretsiz, karar sizin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/ucretsiz-analiz" className="btn btn-primary">
                Ücretsiz Analiz İste
              </Link>
              <a href="https://wa.me/905520772700?text=Merhaba%2C%20klinik%20i%C3%A7in%20%C3%BCcretsiz%20analiz%20istiyorum." target="_blank" rel="noopener noreferrer" className="btn btn-outline">
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
