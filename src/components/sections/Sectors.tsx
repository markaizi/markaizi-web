import Link from "next/link";
import { KAFE_DISTRICT_PAGES, KAFE_HUB } from "@/lib/kafe-pages";
import { CITY_PAGES } from "@/lib/mobilya-pages";

// Ana sayfa: sektöre özel sayfalara giriş. Kafe & restoran kartı Ankara ilçe
// sayfalarına, mobilya kartı bölge sayfalarına doğrudan link verir.
export default function Sectors() {
  return (
    <section id="sektorler" className="py-24" style={{ background: "var(--bg-alt)" }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center max-w-[700px] mx-auto mb-14 reveal">
          <span className="section-tag">Sektöre Özel Uzmanlık</span>
          <h2 className="font-black leading-tight mb-4" style={{ fontSize: "clamp(28px,4vw,40px)" }}>
            Sektörünüzü Tanıyan <span className="gradient-text">Bir Ekip</span>
          </h2>
          <p className="text-[#8a8a9a] text-[17px] leading-relaxed">
            Bir koltuk takımı haftalarca araştırılır, bir kafe ise beş dakikada seçilir. Her sektörün müşterisi farklı karar
            verdiği için reklamı, içeriği ve Google görünürlüğünü sektöre göre kuruyoruz.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Kafe & Restoran */}
          <div className="reveal rounded-2xl p-7 sm:p-8 flex flex-col" style={{ background: "var(--surface)", border: "1px solid rgba(168,85,247,0.3)" }}>
            <p className="text-[12px] font-bold uppercase tracking-[1.5px] text-[#c084fc] mb-2">Ankara · 25 İlçe</p>
            <h3 className="text-[22px] font-black text-white mb-3">Kafe & Restoran Reklam Ajansı</h3>
            <p className="text-[14.5px] text-[#8a8a9a] leading-relaxed mb-5">
              Ankara&apos;daki kafe, restoran, kahvaltı salonu ve pastaneler için sosyal medya yönetimi, Instagram reklamları,
              Google Haritalar ve yemek/mekân çekimi. Çankaya&apos;dan Gölbaşı&apos;na, Keçiören&apos;den Beypazarı&apos;na
              Ankara&apos;nın tüm ilçelerinde.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {KAFE_DISTRICT_PAGES.map((p) => (
                <Link
                  key={p.path}
                  href={p.path}
                  className="text-[12.5px] font-semibold px-3 py-1.5 rounded-full text-[#c084fc] transition-all hover:bg-white/[0.06]"
                  style={{ border: "1px solid rgba(168,85,247,0.3)" }}
                >
                  {p.h1Plain}
                </Link>
              ))}
            </div>
            <Link href={KAFE_HUB.path} className="mt-auto text-[14px] font-semibold text-white">
              Ankara kafe & restoran hizmetleri →
            </Link>
          </div>

          {/* Mobilya */}
          <div className="reveal rounded-2xl p-7 sm:p-8 flex flex-col" style={{ background: "var(--surface)", border: "1px solid rgba(168,85,247,0.3)" }}>
            <p className="text-[12px] font-bold uppercase tracking-[1.5px] text-[#c084fc] mb-2">Siteler&apos;den Türkiye&apos;ye</p>
            <h3 className="text-[22px] font-black text-white mb-3">Mobilya Reklam Ajansı</h3>
            <p className="text-[14.5px] text-[#8a8a9a] leading-relaxed mb-5">
              Mobilya mağazaları, üreticileri ve bayileri için Instagram ve Google reklamları, sosyal medya yönetimi ve showroom
              çekimi. 7 yıldır birlikte çalıştığımız Alitel Mobilya her yıl İstikbal bayileri arasında Türkiye birincisi.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {CITY_PAGES.map((p) => (
                <Link
                  key={p.path}
                  href={p.path}
                  className="text-[12.5px] font-semibold px-3 py-1.5 rounded-full text-[#c084fc] transition-all hover:bg-white/[0.06]"
                  style={{ border: "1px solid rgba(168,85,247,0.3)" }}
                >
                  {p.linkLabel}
                </Link>
              ))}
              <Link
                href="/vaka-calismalari/alitel-mobilya"
                className="text-[12.5px] font-semibold px-3 py-1.5 rounded-full text-[#c084fc] transition-all hover:bg-white/[0.06]"
                style={{ border: "1px solid rgba(168,85,247,0.3)" }}
              >
                Alitel Vaka Çalışması
              </Link>
            </div>
            <Link href="/mobilya-reklam-ajansi" className="mt-auto text-[14px] font-semibold text-white">
              Mobilya hizmetleri →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { href: "/saglik-klinik-reklam-ajansi", t: "Sağlık & Klinik Reklam Ajansı", d: "Diş, estetik ve güzellik merkezleri, fizik tedavi ve alternatif tıp için reklam politikalarına uygun Instagram ve Google reklamları." },
            { href: "/dogal-urun-takviye-reklam-ajansi", t: "Doğal Ürün & Takviye Reklam Ajansı", d: "Takviye, doğal yağ ve doğal kozmetik markaları için ürün videosu, YouTube içeriği ve e-ticaret reklamı." },
          ].map((x) => (
            <Link key={x.href} href={x.href} className="reveal rounded-2xl p-6 transition-all hover:border-purple-500/40" style={{ background: "var(--surface)", border: "1px solid var(--border)", textDecoration: "none" }}>
              <h3 className="text-[17px] font-bold text-white mb-2">{x.t}</h3>
              <p className="text-[14px] text-[#8a8a9a] leading-relaxed mb-3">{x.d}</p>
              <span className="text-[13px] font-semibold text-[#c084fc]">Detaylar →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
