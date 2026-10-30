import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";
import ServiceFAQ, { FAQItem } from "@/components/ServiceFAQ";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import SektorLinkleri from "@/components/SektorLinkleri";

export const metadata: Metadata = {
  title: { absolute: "Sağlık & Klinik Reklam Ajansı — Diş, Estetik, Tıp Merkezleri | markaizi" },
  description:
    "Diş klinikleri, estetik klinikleri, fizik tedavi merkezleri ve geleneksel-tamamlayıcı tıp (GETAT) merkezleri için sosyal medya yönetimi, Google İşletme Profili, yerel SEO ve mevzuata uygun dijital pazarlama. 12 Kasım 2025 Sağlıkta Tanıtım Yönetmeliği ve Meta/Google sağlık politikalarını bilen ajans.",
  keywords:
    "sağlık reklam ajansı, klinik reklam ajansı, diş kliniği reklamı, estetisyen instagram reklamı, ankara sağlık dijital pazarlama, diş hekimi sosyal medya yönetimi, getat tanıtım, sağlıkta tanıtım yönetmeliği, poliklinik dijital pazarlama",
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
    a: "İki katman var. Birincisi platform kuralları: Meta ve Google sağlıkla ilgili reklamlarda bazı hedeflemeleri kısıtlar, 'tedavi eder', 'kesin sonuç' gibi ifadeleri reddeder. İkincisi mevzuat: 12 Kasım 2025'te yürürlüğe giren Sağlık Hizmetlerinde Tanıtım ve Bilgilendirme Faaliyetleri Hakkında Yönetmelik, hekim ve sağlık kuruluşlarının neyi, nasıl paylaşabileceğini sınırlıyor (hasta teşekkürleri, fiyat ve kampanya bilgisi, öncesi-sonrası görselleri, sponsorlu tanıtım gibi). Bu kuralları bilmeyen bir ajans sizi hem hesap kısıtlanması hem idari yaptırım riskine açar. Biz çalışmayı baştan bu iki katmana göre kuruyoruz.",
  },
  {
    q: "Hasta öncesi/sonrası fotoğraflarını reklamda kullanabilir miyiz?",
    a: "Yönetmeliğe göre belirli koşullarla mümkün: görsellerin tarihi belirtilmeli, aynı ortam ve teknik koşullarda çekilmeli, filtre, makyaj veya yanıltıcı düzenleme olmamalı, hastanın açık rızası alınmalı (rıza her zaman geri çekilebilir), görsel karşılığında ödeme veya indirim verilmemeli ve yurt içi tanıtımda 'Her cerrahi veya girişimsel işlemde sonuçlar kişiden kişiye değişiklik gösterebilir.' uyarısı yer almalı. Ayrıca bu tür görsellerde yorum, beğeni ve yeniden paylaşımın kapatılması gerekiyor. Kapsam ve ayrıntılar için yönetmelik metnine ve hukuk danışmanınıza bakmanızı öneririz; biz süreci bu çerçevede kuruyoruz.",
  },
  {
    q: "Klinik içi çekim ve içerik üretimini nasıl yapıyorsunuz?",
    a: "Çalışmamız ağırlıklı olarak strateji, bilgilendirme içeriği, web sitesi ve Google tarafında yürüyor. Görsel ihtiyacınız varsa kliniğinizin kendi çektiği materyali yönetmeliğe uygun, temiz bir görsel dile getiriyor ya da ayrı bir video çekimi anlaşması yapıyoruz. Hekim bilgilendirme videosu gibi içeriklerde güven veren, sade bir anlatım hastanın karar sürecini doğrudan etkiler.",
  },
  {
    q: "Google Haritalar'da öne çıkmak için ne yapıyorsunuz?",
    a: "\"Yakınımdaki diş kliniği\" gibi lokal aramalarda görünürlüğünüz için işletme profilinizi doğru kategori, hizmet ve çalışma saatleriyle düzenler, bilgilerin web sitenizle tutarlı olmasını sağlarız. Yorumlar hastanın kendi değerlendirmesidir; yönetmelik, hasta teşekkürleriyle reklam niteliğinde paylaşım yapılmasını yasakladığı için yorumları kendi sayfalarınızda reklam malzemesi olarak kullanmaz, yalnızca mevzuata uygun ve kısa yanıtlar vermenizi öneririz.",
  },
  {
    q: "Klinikler Instagram ve Google'da ücretli reklam verebilir mi?",
    a: "Bu en çok karıştırılan konu. Yönetmeliğe ilişkin hukuk kaynaklarının özetine göre sağlık hekimleri ve özel sağlık tesisleri için sponsorlu tanıtım genel olarak yasak; tesisin açılışını izleyen ilk bir ay istisna olarak anılıyor. Ücret, indirim ve kampanya bilgisi de tanıtımda verilemiyor. Ücretsiz ve öne çıkmaya yönelik olmayan işletme profili, web sitesi ve bilgilendirme içeriği ise serbest. Sizin durumunuzun (hekim, tesis, sağlık turizmi, açılış dönemi) bu kurallara nasıl girdiğini hukuk danışmanınızla teyit etmenizi, biz de çalışmayı ona göre kurmamızı öneririz. Aynı kural güzellik merkezleri için geçerli olmayabilir; bkz. güzellik merkezi sayfamız.",
  },
  {
    q: "Geleneksel ve tamamlayıcı tıp (GETAT) merkezleri için tanıtım yapabiliyor musunuz?",
    a: "GETAT uygulamaları yalnızca yetkili sağlık meslek mensuplarınca ve yetkilendirilmiş birimlerde yapılabiliyor; tanıtımda 'alternatif tıp' gibi modern tıbbın yerine geçme izlenimi veren ifadeler sorun yaratıyor. Bu nedenle GETAT merkezleriyle bilgilendirme odaklı, mevzuata uygun bir dijital varlık kuruyoruz. Ayrıntılar için GETAT sayfamıza bakabilirsiniz.",
  },
  {
    q: "Reklam bütçesi olarak ne kadar ayırmalıyım?",
    a: "Klinik büyüklüğüne ve hedeflediğiniz tedavi türüne göre değişir; ücretsiz görüşmede ihtiyacınıza uygun bir öneri netleştiririz. Bütçe doğrudan Meta/Google'a ödenir, biz yönetim hizmeti veririz — bütçenizden komisyon almayız.",
  },
];

const SERVICES = [
  {
    icon: "📋",
    title: "Bilgilendirme İçeriği",
    desc: "Hekimin uzmanlık alanı kapsamında, yönetmeliğe uygun, sade ve doğru bilgilendirme içerikleri. Hasta karar vermeden önce güvenilir bilgi arar.",
  },
  {
    icon: "🎯",
    title: "Meta Kampanyaları (Mevzuata Uygun Kapsamda)",
    desc: "Sağlık tesislerinde sponsorlu tanıtım kısıtlıdır. Uygun olduğu durumlarda (ör. açılış dönemi, sağlık turizmi için yurt dışı hedefleme) platform ve yönetmelik kurallarına göre kampanya kurgusu yapıyoruz.",
  },
  {
    icon: "🔍",
    title: "Google Reklamları",
    desc: "\"Ankara diş kliniği\", \"estetisyen randevu\" gibi aramalar yapan, randevuya hazır hastayı size yönlendiriyoruz.",
  },
  {
    icon: "📍",
    title: "Google Haritalar & Yerel SEO",
    desc: "\"Yakınımdaki klinik\" aramalarında doğru ve tutarlı görünün. İşletme profili bilgileri, hizmet kategorileri ve web sitesiyle uyum.",
  },
  {
    icon: "📱",
    title: "Sosyal Medya Yönetimi",
    desc: "Tedavi süreçlerini ve klinik kültürünü anlatan, hasta teşekkürü ve fiyat/kampanya içermeyen düzenli, güven veren içerik takvimi.",
  },
  {
    icon: "🌐",
    title: "Randevu Odaklı Web Sitesi",
    desc: "WhatsApp/telefon entegreli, mobilde hızlı açılan, randevu almayı kolaylaştıran modern klinik web siteleri.",
  },
];

const ALANLAR = ["Diş Klinikleri", "Estetik Klinikleri", "Fizik Tedavi Merkezleri", "GETAT Merkezleri", "Özel Poliklinikler"];

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
  audience: { "@type": "Audience", audienceType: "Diş klinikleri, estetik klinikleri, fizik tedavi merkezleri, GETAT merkezleri ve özel poliklinikler" },
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
                Diş kliniğinden estetik kliniğine, fizik tedaviden GETAT merkezlerine — hasta güveni
                gerektiren bir sektörde mevzuatı ve platform kurallarını bilen bir ekiple çalışın.
              </p>
              <p className="text-[#8a8a9a] text-[16px] leading-relaxed mb-8">
                Sağlıkta tanıtım, 12 Kasım 2025&apos;ten beri yeni bir yönetmeliğe tabi; Meta ve Google&apos;ın da
                kendine özgü kısıtlamaları var. Bu kuralları bilmeden yapılan paylaşım ve kampanyalar hem
                hesap hem idari yaptırım riski taşır — biz baştan doğru kuruyoruz.
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

        {/* ── Yönetmelik ── */}
        <section className="py-20" style={{ background: "var(--bg-alt)" }}>
          <div className="max-w-[860px] mx-auto px-6">
            <span className="section-tag">Mevzuat</span>
            <h2 className="font-black leading-tight mt-2 mb-5" style={{ fontSize: "clamp(26px,3.5vw,38px)" }}>
              12 Kasım 2025 Sağlıkta Tanıtım Yönetmeliği: <span className="gradient-text">Neler Yapılabilir?</span>
            </h2>
            <p className="text-[#8a8a9a] text-[16px] leading-[1.9] mb-8">
              Sağlık Hizmetlerinde Tanıtım ve Bilgilendirme Faaliyetleri Hakkında Yönetmelik, 12 Kasım 2025
              tarihli Resmî Gazete&apos;de (sayı 33075) yayımlandı ve hekimler, özel sağlık tesisleri ile sağlık
              turizmi aktörleri için tanıtım kurallarını yeniden belirledi. Aşağıdaki liste, hukuk
              kaynaklarındaki özetlere dayanan genel bir çerçevedir.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-2xl p-7" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <h3 className="text-[17px] font-bold mb-4 text-white">Genel olarak yapılabilenler</h3>
                <ul className="space-y-2.5">
                  {[
                    "Yetkili hekimin kendi uzmanlık alanı kapsamında doğru bilgilendirmesi",
                    "Web sitesi ve bilgilendirme içeriği",
                    "Ücretsiz ve öne çıkmaya yönelik olmayan işletme profili / arama motoru kaydı",
                    "Koşullara uygun öncesi-sonrası görseli (tarihli, aynı ortam, düzenlemesiz, açık rızalı, uyarı metinli)",
                    "Sağlık turizminde, yetki belgeli kuruluşlar için yurt dışına yönelik tanıtım",
                  ].map((b) => (
                    <li key={b} className="flex gap-3 text-[14px] text-[#c0c0d0] leading-relaxed">
                      <span className="mt-[8px] w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--grad)" }} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl p-7" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <h3 className="text-[17px] font-bold mb-4 text-white">Genel olarak yapılamayanlar</h3>
                <ul className="space-y-2.5">
                  {[
                    "Hasta veya yakınlarının teşekkür/memnuniyet ifadeleriyle reklam niteliğinde paylaşım",
                    "Ücret, indirim, kampanya ve promosyon bilgisi",
                    "Çekiliş ve hediye ile pazarlama",
                    "Üstünlük algısı yaratan veya yanıltıcı tanıtım; sertifika temelli unvan",
                    "Sponsorlu tanıtım (tesisin açılışını izleyen ilk ay istisna olarak anılıyor)",
                    "Öncesi-sonrası görsel karşılığında ödeme, indirim veya hediye vaadi",
                  ].map((b) => (
                    <li key={b} className="flex gap-3 text-[14px] text-[#c0c0d0] leading-relaxed">
                      <span className="mt-[8px] w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#ec4899" }} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-[#8a8a9a] text-[13px] leading-relaxed mt-6">
              Bu bölüm genel bilgilendirmedir, hukuki danışmanlık değildir. Kapsam ve istisnalar hekimin,
              tesisin ve faaliyetin türüne göre değişir; kesin uygulama için yönetmeliğin resmî metnine ve
              hukuk danışmanınıza başvurun. Güzellik merkezleri ve GETAT için ayrı sayfalarımıza bakın:{" "}
              <Link href="/guzellik-merkezi-reklam-ajansi" className="text-[#c084fc] underline underline-offset-2">güzellik merkezi</Link>,{" "}
              <Link href="/getat-merkezi-dijital-pazarlama" className="text-[#c084fc] underline underline-offset-2">GETAT merkezi</Link>.
              Rehber yazımız:{" "}
              <Link href="/blog/saglikta-tanitim-ve-bilgilendirme-yonetmeligi-rehberi" className="text-[#c084fc] underline underline-offset-2">klinikler ve hekimler sosyal medyada ne paylaşabilir?</Link>
            </p>
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
                { step: "02", title: "Mevzuat Uyumlu Strateji", desc: "Yönetmelik ve Meta/Google sağlık kurallarına uygun içerik ve kampanya planı." },
                { step: "03", title: "Reklam & İçerik", desc: "İçerikler ve uygun kampanyalar yayına giriyor, sosyal medyanız düzenli, güven veren içerikle besleniyor." },
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

        <SektorLinkleri current="/saglik-klinik-reklam-ajansi" />

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
