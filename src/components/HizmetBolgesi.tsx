import Link from "next/link";
import SektorLinkleri from "@/components/SektorLinkleri";

const ILCELER = [
  { href: "/cankaya-kafe-restoran-reklam-ajansi", label: "Çankaya" },
  { href: "/yenimahalle-kafe-restoran-reklam-ajansi", label: "Yenimahalle" },
  { href: "/etimesgut-kafe-restoran-reklam-ajansi", label: "Etimesgut" },
  { href: "/kecioren-kafe-restoran-reklam-ajansi", label: "Keçiören" },
  { href: "/altindag-kafe-restoran-reklam-ajansi", label: "Altındağ" },
  { href: "/golbasi-kafe-restoran-reklam-ajansi", label: "Gölbaşı" },
  { href: "/beypazari-kafe-restoran-reklam-ajansi", label: "Beypazarı" },
];

// Hizmet sayfalarının altında: çalışılan sektörler ve Ankara hizmet bölgesi (yeni URL açmadan iç bağlantı).
export default function HizmetBolgesi({ hizmet }: { hizmet: string }) {
  return (
    <>
      <section className="py-14" style={{ background: "var(--bg)", borderTop: "1px solid var(--border)" }}>
        <div className="max-w-[860px] mx-auto px-6">
          <h2 className="font-black leading-tight mb-4" style={{ fontSize: "clamp(22px,3vw,30px)" }}>
            Ankara&apos;da {hizmet} <span className="gradient-text">Hizmet Bölgemiz</span>
          </h2>
          <p className="text-[#8a8a9a] text-[16px] leading-[1.9] mb-5">
            markaizi Ankara Siteler merkezli; Altındağ, Çankaya, Yenimahalle, Etimesgut, Keçiören, Mamak,
            Gölbaşı ve diğer ilçelerdeki işletmelerle çalışıyoruz. {hizmet} hizmetini Türkiye geneline de
            uzaktan veriyoruz. Yeme-içme sektöründe ilçelere özel yazdığımız sayfalar:
          </p>
          <div className="flex flex-wrap gap-3">
            {ILCELER.map((i) => (
              <Link
                key={i.href}
                href={i.href}
                className="text-[13px] px-3 py-1.5 rounded-full text-[#c084fc]"
                style={{ border: "1px solid rgba(168,85,247,0.35)" }}
              >
                {i.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <SektorLinkleri current="" />
    </>
  );
}
