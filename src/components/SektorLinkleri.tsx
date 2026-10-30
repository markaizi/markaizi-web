import Link from "next/link";

export const SEKTORLER = [
  { href: "/mobilya-reklam-ajansi", label: "Mobilya" },
  { href: "/ankara-kafe-restoran-reklam-ajansi", label: "Kafe & Restoran" },
  { href: "/saglik-klinik-reklam-ajansi", label: "Sağlık & Klinik" },
  { href: "/guzellik-merkezi-reklam-ajansi", label: "Güzellik Merkezi" },
  { href: "/getat-merkezi-dijital-pazarlama", label: "GETAT Merkezi" },
  { href: "/dogal-urun-takviye-reklam-ajansi", label: "Doğal Ürün & Takviye" },
  { href: "/e-ticaret-reklam-ajansi", label: "E-Ticaret" },
];

// Sektör sayfalarının altında, diğer sektör sayfalarına iç bağlantı bloğu.
export default function SektorLinkleri({ current }: { current: string }) {
  const items = SEKTORLER.filter((s) => s.href !== current);
  return (
    <section className="py-12" style={{ background: "var(--bg-alt)", borderTop: "1px solid var(--border)" }}>
      <div className="max-w-[860px] mx-auto px-6 text-center">
        <h2 className="font-black text-[20px] mb-2">
          Diğer <span className="gradient-text">Sektörlerde</span> Çalışmalarımız
        </h2>
        <p className="text-[#8a8a9a] text-[14px] mb-5">
          Her sektörün reklam kuralı, müşteri yolculuğu ve ölçüm mantığı farklıdır.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          {items.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="text-[14px] font-semibold text-[#c084fc] px-5 py-2.5 rounded-full transition-all hover:bg-white/[0.06]"
              style={{ border: "1px solid rgba(168,85,247,0.3)" }}
            >
              {s.label} →
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
