import Logo from "@/components/Logo";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "var(--bg-alt)", borderTop: "1px solid var(--border)" }}>
      <div className="max-w-[1200px] mx-auto px-6 pt-[72px] pb-0">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-16 mb-16">
          {/* Brand */}
          <div>
            <a href="#" className="inline-block mb-5">
              <Logo height={56} />
            </a>
            <p className="text-sm text-[#8a8a9a] leading-relaxed max-w-[240px]">
              Ankara Siteler merkezli dijital reklam ajansı. Mobilyacıdan doktora, avizeciden aksesuarcıya her işletmeye dijital büyüme.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
            <FooterCol
              title="Hizmetler"
              links={[
                { label: "Sosyal Medya Yönetimi", href: "/hizmetler/sosyal-medya-yonetimi" },
                { label: "Meta Reklamları",        href: "/hizmetler/meta-reklamlari" },
                { label: "Google Reklamları",      href: "/hizmetler/google-reklamlari" },
                { label: "TikTok Reklamları",      href: "/hizmetler/tiktok-reklamlari" },
                { label: "Yapay Zeka & Otomasyon", href: "/hizmetler/yapay-zeka-otomasyon" },
                { label: "Web Tasarım & Hosting",  href: "/hizmetler/web-tasarim-hosting" },
              ]}
            />
            <FooterCol
              title="Şirket"
              links={[
                { label: "Hakkımızda", href: "#hakkimizda" },
                { label: "Portföy",    href: "#portfolio" },
                { label: "İletişim",   href: "#iletisim" },
                { label: "Kariyer",    href: "/cv" },
              ]}
            />
            <FooterCol
              title="İletişim"
              links={[
                { label: "markaizicom@gmail.com",  href: "mailto:markaizicom@gmail.com" },
                { label: "+90 (552) 077 27 00",    href: "tel:+905520772700" },
                { label: "Siteler, Ankara",          href: "https://maps.google.com/?q=Zübeyde+Hanım+Mahallesi+Elif+Sokak+No:7+Ankara" },
                { label: "SSS",                      href: "/sss" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <div className="max-w-[1200px] mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[13px] text-[#8a8a9a]">© {year} markaizi. Tüm hakları saklıdır.</p>
          <div className="flex flex-wrap gap-4 justify-center sm:justify-end">
            {[
              { label: "KVKK", href: "/kvkk" },
              { label: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
              { label: "Çerez Politikası", href: "/cerez-politikasi" },
              { label: "Kullanım Şartları", href: "/kullanim-sartlari" },
            ].map((l) => (
              <a key={l.label} href={l.href} className="text-[13px] text-[#8a8a9a] hover:text-white transition-colors">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#8a8a9a] mb-5">{title}</h3>
      <ul className="flex flex-col gap-3">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} className="text-[14px] text-white/50 hover:text-white transition-colors">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
