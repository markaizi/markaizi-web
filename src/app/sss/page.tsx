import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";

const FAQS = [
  {
    category: "Genel",
    items: [
      {
        q: "markaizi ile çalışmaya nasıl başlayabilirim?",
        a: "Web sitemizin iletişim formunu doldurun veya WhatsApp / e-posta üzerinden bize ulaşın. 24 saat içinde sizi arayarak ihtiyaçlarınızı dinler, size özel ücretsiz bir teklif hazırlarız.",
      },
      {
        q: "Minimum kaç aylık sözleşme yapıyorsunuz?",
        a: "Standart sözleşmelerimiz 3 aylıktır. Bu süre, reklam kampanyalarının optimize edilmesi ve sosyal medya büyümesinin gözlemlenmesi için gereken minimum süreyi yansıtır. Uzun dönem çalışmalarda özel indirimler sunuyoruz.",
      },
      {
        q: "Ödeme nasıl yapılıyor?",
        a: "Aylık hizmet bedeli, hizmet başlangıç tarihinden itibaren her ay peşin olarak banka havalesi veya EFT yoluyla ödenir. Reklam bütçesi ise platformlara (Meta, Google vb.) direkt müşteri tarafından yüklenir.",
      },
      {
        q: "Reklam bütçesi paket fiyatına dahil mi?",
        a: "Hayır. Paket fiyatımız yönetim hizmetini kapsar. Reklam platformlarına (Facebook, Instagram, Google, TikTok) yatırılacak bütçe müşteri tarafından belirlenir ve doğrudan platforma aktarılır. Bu sayede bütçeniz tamamen şeffaf biçimde yönetilir.",
      },
    ],
  },
  {
    category: "Sosyal Medya & İçerik",
    items: [
      {
        q: "Paylaşılacak içerikleri kim hazırlıyor?",
        a: "İçeriklerin tamamını markaizi ekibi hazırlar: metin yazarlığı, görsel tasarım ve video montaj. Her ay başında içerik takvimini sizinle paylaşır, onayınızı alırız. Sonrasında tüm planlama, zamanlama ve yayınlamayı biz yönetiriz.",
      },
      {
        q: "Hesabımın şifresini paylaşmak zorunda mıyım?",
        a: "Hayır. Instagram ve Facebook için hesabınıza 'Yönetici' olarak erişim yetkisi verebilirsiniz — şifrenizi asla talep etmiyoruz. Google Ads ve TikTok için ise hesabınızı bize bağlayan erişim yönetimi yöntemlerini kullanıyoruz.",
      },
      {
        q: "Ne zaman sonuç görürüm?",
        a: "Organik sosyal medya büyümesinde ilk anlamlı sonuçlar genellikle 2-3. ayda görülür. Reklam kampanyalarında ise ilk 1-2 haftada tıklama ve erişim verileri gelmeye başlar; dönüşüm optimizasyonu genellikle 4-6 hafta içinde oturur.",
      },
    ],
  },
  {
    category: "Reklam Yönetimi",
    items: [
      {
        q: "Reklam bütçemin ne kadar olması gerekiyor?",
        a: "Meta reklamlarında günlük minimum 100-200 ₺ ile başlanabilir. Google Ads için sektöre göre değişse de günlük 150-300 ₺ uygun bir başlangıç noktasıdır. Bütçeyi ne kadar artırırsanız, veri birikimi hızlanır ve optimizasyon daha etkili olur.",
      },
      {
        q: "Reklam hesabım kimin üzerine açılıyor?",
        a: "Reklam hesapları her zaman müşteriye ait olur. Biz hesabınıza ortak erişim yetkisi alarak yönetimi üstleniriz. Çalışma ilişkimiz sona erdiğinde hesap tamamen sizde kalır.",
      },
      {
        q: "Reklam performansını nasıl takip edebilirim?",
        a: "Haftalık ve aylık raporları e-posta ile iletiyoruz. Dilediğiniz zaman reklam hesaplarınıza kendi giriş bilgilerinizle erişip anlık verileri görebilirsiniz. Ayrıca özel bir dashboard talep eden müşterilerimiz için Google Looker Studio raporu da hazırlıyoruz.",
      },
    ],
  },
  {
    category: "Web Tasarım",
    items: [
      {
        q: "Web sitem ne kadar sürede hazır olur?",
        a: "Basit tanıtım siteleri 7-10 iş günü, kurumsal siteler 3-4 hafta, SEO'lu gelişmiş siteler 5-6 hafta, e-ticaret siteleri ise 6-8 hafta içinde teslim edilir. Süre içerik teminine (metin, görsel) bağlı olarak değişebilir.",
      },
      {
        q: "Siteyi yaptırdıktan sonra güncelleyebilir miyim?",
        a: "Evet. Tüm sitelere kolay kullanımlı bir yönetim paneli (CMS) entegre ediyoruz. Teknik bilgi gerektirmeden metin, görsel ve fiyat gibi içerikleri kendiniz güncelleyebilirsiniz.",
      },
      {
        q: "Hosting ve domain ücreti ayrıca mı ödeniyor?",
        a: "Temel paketlerde ilk yıl hosting ve domain kurulumu hizmet bedeline dahildir. İkinci yıldan itibaren hosting bedeli ve domain yenileme ücreti ayrıca fatura edilir; güncel tutarı size özel teklifte paylaşırız.",
      },
    ],
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.flatMap((group) =>
    group.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    }))
  ),
};

export default function SSSPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-16" style={{ background: "var(--bg)" }}>
          <div className="absolute top-[-150px] right-[-100px] w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle,rgba(236,72,153,0.15) 0%,transparent 70%)", filter: "blur(80px)" }} />
          <div className="max-w-[860px] mx-auto px-6 relative z-10 text-center">
            <span className="section-tag">SSS</span>
            <h1 className="font-black leading-tight mt-4 mb-4" style={{ fontSize: "clamp(32px,5vw,52px)" }}>
              Sıkça Sorulan <span className="gradient-text">Sorular</span>
            </h1>
            <p className="text-[#8a8a9a] text-[17px]">
              Aklınızdaki soruların cevabını burada bulamazsanız bizimle doğrudan iletişime geçin.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16" style={{ background: "var(--bg-alt)" }}>
          <div className="max-w-[860px] mx-auto px-6 space-y-12">
            {FAQS.map((group) => (
              <div key={group.category}>
                <h2 className="text-[13px] font-bold uppercase tracking-widest text-[#c084fc] mb-5">{group.category}</h2>
                <div className="space-y-3">
                  {group.items.map((item) => (
                    <details
                      key={item.q}
                      className="faq-details rounded-xl overflow-hidden transition-all duration-200"
                      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                    >
                      <summary className="faq-summary w-full flex items-center justify-between gap-4 p-5 cursor-pointer list-none">
                        <span className="font-semibold text-[15px] text-white leading-snug">{item.q}</span>
                        <span className="faq-icon flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200">
                          <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="white" strokeWidth="2.5">
                            <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
                          </svg>
                        </span>
                      </summary>
                      <div className="px-5 pb-5">
                        <p className="text-[14px] text-[#8a8a9a] leading-[1.8]">{item.a}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}

            {/* CTA */}
            <div className="text-center p-10 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid rgba(168,85,247,0.2)" }}>
              <p className="font-bold text-[18px] mb-2">Sorunuz hâlâ yanıtsız mı?</p>
              <p className="text-[#8a8a9a] text-[14px] mb-6">WhatsApp veya e-posta ile doğrudan bize ulaşın, hemen yanıt verelim.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="https://wa.me/905520772700" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  WhatsApp&apos;tan Yaz
                </a>
                <a href="mailto:markaizicom@gmail.com" className="btn btn-outline">
                  E-posta Gönder
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsApp />
    </>
  );
}
