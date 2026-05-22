"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const links = [
  { href: "#hizmetler", label: "Hizmetler" },
  { href: "#hakkimizda", label: "Hakkımızda" },
  { href: "#portfolio", label: "Portföy" },
  { href: "#fiyatlar", label: "Fiyatlar" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menü açıkken body scroll kilitle
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const close = () => setOpen(false);

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
          <Link href="#" className="text-[22px] font-black tracking-tight">
            marka<span className="gradient-text">izi</span>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-2">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="px-4 py-2 text-sm font-medium text-[#8a8a9a] rounded-full transition-all hover:text-white hover:bg-white/[0.06]"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#iletisim" className="btn btn-primary text-sm px-[22px] py-[10px]">
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
            <span
              className="block w-6 h-[2px] bg-white rounded transition-all duration-300"
              style={open ? { transform: "translateY(7px) rotate(45deg)" } : {}}
            />
            <span
              className="block w-6 h-[2px] bg-white rounded transition-all duration-300"
              style={open ? { opacity: 0 } : {}}
            />
            <span
              className="block w-6 h-[2px] bg-white rounded transition-all duration-300"
              style={open ? { transform: "translateY(-7px) rotate(-45deg)" } : {}}
            />
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
          {[...links, { href: "#iletisim", label: "İletişim" }].map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={close}
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
