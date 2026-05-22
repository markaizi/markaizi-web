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
              <Logo height={40} />
            </a>
            <p className="text-sm text-[#8a8a9a] leading-relaxed max-w-[220px]">
              Dijital dünyada markanızın en güçlü sesi.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
            <FooterCol
              title="Hizmetler"
              links={[
                { label: "Sosyal Medya Yönetimi", href: "#hizmetler" },
                { label: "Meta Reklamları",        href: "#hizmetler" },
                { label: "Google Reklamları",      href: "#hizmetler" },
                { label: "TikTok Reklamları",      href: "#hizmetler" },
                { label: "İçerik Üretimi",         href: "#hizmetler" },
                { label: "Web Tasarım & Hosting",  href: "#hizmetler" },
              ]}
            />
            <FooterCol
              title="Şirket"
              links={[
                { label: "Hakkımızda", href: "#hakkimizda" },
                { label: "Portföy",    href: "#portfolio" },
                { label: "Fiyatlar",   href: "#fiyatlar" },
                { label: "İletişim",   href: "#iletisim" },
              ]}
            />
            <FooterCol
              title="İletişim"
              links={[
                { label: "markaizicom@gmail.com",  href: "mailto:markaizicom@gmail.com" },
                { label: "+90 (552) 077 27 00",    href: "tel:+905520772700" },
                { label: "Ankara, Türkiye",        href: "#" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <div className="max-w-[1200px] mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[13px] text-[#8a8a9a]">© {year} markaizi. Tüm hakları saklıdır.</p>
          <div className="flex gap-6">
            {["Gizlilik Politikası", "Kullanım Şartları"].map((l) => (
              <a key={l} href="#" className="text-[13px] text-[#8a8a9a] hover:text-white transition-colors">
                {l}
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
      <h5 className="text-[13px] font-bold uppercase tracking-wider text-[#8a8a9a] mb-5">{title}</h5>
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
