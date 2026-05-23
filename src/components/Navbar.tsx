"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/Logo";

const NAV_LINKS = [
  { href: "/#hizmetler",  label: "Hizmetler",  section: "hizmetler" },
  { href: "/#hakkimizda", label: "Hakkımızda", section: "hakkimizda" },
  { href: "/#portfolio",  label: "Portföy",    section: "portfolio" },
  { href: "/#fiyatlar",   label: "Fiyatlar",   section: "fiyatlar" },
  { href: "/blog",        label: "Blog",       section: null },
  { href: "/sss",         label: "SSS",        section: null },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const close = () => setOpen(false);

  // Anasayfadaysa smooth scroll, değilse sayfaya git + hash
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof NAV_LINKS[number]) => {
    if (link.section && isHome) {
      e.preventDefault();
      const el = document.getElementById(link.section);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: "smooth" });
      }
      close();
    } else {
      close();
    }
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={
          scrolled
            ? {
                background: "rgba(5,5,5,0.85)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderBottom: "1px solid var(--border)",
                padding: "14px 0",
              }
            : { padding: "20px 0" }
        }
      >
        <nav className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo height={52} />
          </Link>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => handleNavClick(e, l)}
                  className="px-4 py-2 text-sm font-medium rounded-full transition-all hover:text-white hover:bg-white/[0.06]"
                  style={{
                    color: pathname === l.href ? "#fff" : "#8a8a9a",
                    background: pathname === l.href ? "rgba(255,255,255,0.06)" : "transparent",
                  }}
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={isHome ? "#iletisim" : "/#iletisim"}
                className="btn btn-primary text-sm px-[22px] py-[10px] ml-2"
                onClick={close}
              >
                İletişim
              </a>
            </li>
          </ul>

          {/* Hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menüyü aç"
            className="md:hidden flex flex-col gap-[5px] p-1 z-[1001] relative"
          >
            {[
              open ? { transform: "translateY(7px) rotate(45deg)" } : {},
              open ? { opacity: 0 } : {},
              open ? { transform: "translateY(-7px) rotate(-45deg)" } : {},
            ].map((style, i) => (
              <span key={i} className="block w-6 h-[2px] bg-white rounded transition-all duration-300" style={style} />
            ))}
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      <div
        className="fixed inset-0 z-[999] flex items-center justify-center transition-transform duration-300"
        style={{
          background: "rgba(5,5,5,0.97)",
          backdropFilter: "blur(20px)",
          transform: open ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <ul className="flex flex-col items-center gap-8">
          {[...NAV_LINKS, { href: isHome ? "#iletisim" : "/#iletisim", label: "İletişim", section: "iletisim" as string | null }].map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={(e) => handleNavClick(e, l as typeof NAV_LINKS[number])}
                className="text-[28px] font-bold text-[#8a8a9a] hover:text-white transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
