"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";

type SessionInfo = { name: string; redirect: string } | null;

const NAV_LINKS = [
  { href: "/#hizmetler",  label: "Hizmetler",  section: "hizmetler" },
  { href: "/#hakkimizda", label: "Hakkımızda", section: "hakkimizda" },
  { href: "/#portfolio",  label: "Portföy",    section: "portfolio" },
  { href: "/#fiyatlar",   label: "Fiyatlar",   section: "fiyatlar" },
  { href: "/blog",        label: "Blog",       section: null },
];

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [open, setOpen]               = useState(false);
  const [loginOpen, setLoginOpen]     = useState(false);
  const [session, setSession]         = useState<SessionInfo>(undefined as unknown as SessionInfo);
  const pathname  = usePathname();
  const isHome    = pathname === "/";

  useEffect(() => {
    fetch("/api/musteri/auth/me")
      .then((r) => r.json())
      .then((d) => setSession(d.ok ? { name: d.name, redirect: d.redirect } : null))
      .catch(() => setSession(null));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (open || loginOpen) ? "hidden" : "";
  }, [open, loginOpen]);

  const close      = () => setOpen(false);
  const closeLogin = () => setLoginOpen(false);

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
            : { padding: "20px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }
        }
      >
        <nav className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <Logo height={52} />
            <span
              className="font-extralight text-[16px] text-white/80 tracking-[0.14em] hidden sm:block select-none"
              style={{ letterSpacing: "0.14em" }}
            >
              marka<span style={{ color: "#c084fc" }}>izi</span>
            </span>
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

            {/* Müşteri Girişi / Panel */}
            <li>
              {session ? (
                <a
                  href={session.redirect}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-all ml-1"
                  style={{ color: "#c084fc", background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}
                >
                  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {session.name.split(" ")[0]}
                </a>
              ) : session === null ? (
                <button
                  onClick={() => setLoginOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-all hover:text-white hover:bg-white/[0.06] ml-1"
                  style={{ color: "#8a8a9a" }}
                >
                  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Müşteri Girişi
                </button>
              ) : null}
            </li>

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

          {/* Mobil: Müşteri Girişi ikonu + Hamburger */}
          <div className="md:hidden flex items-center gap-3">
            {session ? (
              <a
                href={session.redirect}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full transition-all text-[13px] font-medium"
                style={{ border: "1px solid rgba(168,85,247,0.3)", color: "#c084fc", background: "rgba(168,85,247,0.1)" }}
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 flex-shrink-0" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {session.name.split(" ")[0]}
              </a>
            ) : session === null ? (
              <button
                onClick={() => setLoginOpen(true)}
                aria-label="Müşteri Girişi"
                className="flex items-center gap-1.5 px-3 py-2 rounded-full transition-all hover:bg-white/[0.08] text-[13px] font-medium"
                style={{ border: "1px solid var(--border)", color: "#c084fc" }}
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 flex-shrink-0" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Müşteri Girişi
              </button>
            ) : null}
          {/* Hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menüyü aç"
            className="flex flex-col gap-[5px] p-1 z-[1001] relative"
          >
            {[
              open ? { transform: "translateY(7px) rotate(45deg)" } : {},
              open ? { opacity: 0 } : {},
              open ? { transform: "translateY(-7px) rotate(-45deg)" } : {},
            ].map((style, i) => (
              <span key={i} className="block w-6 h-[2px] bg-white rounded transition-all duration-300" style={style} />
            ))}
          </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <div
        className="fixed inset-0 z-[999] flex flex-col transition-transform duration-300"
        style={{
          background: "rgba(5,5,5,0.97)",
          backdropFilter: "blur(20px)",
          transform: open ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Kapatma butonu */}
        <div className="flex justify-end px-6 pt-6 pb-2">
          <button
            onClick={close}
            aria-label="Menüyü kapat"
            className="flex items-center gap-2 px-4 py-2 rounded-full transition-all"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
            <span className="text-[14px] font-semibold text-white">Kapat</span>
          </button>
        </div>

        {/* Menü linkleri */}
        <ul className="flex flex-col items-center justify-center gap-8 flex-1">
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

      {/* Müşteri Girişi Modal */}
      {loginOpen && (
        <LoginModal onClose={closeLogin} />
      )}
    </>
  );
}

// ── Müşteri Giriş Modalı ──────────────────────────────────────────────────────
function LoginModal({ onClose }: { onClose: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const overlayRef              = useRef<HTMLDivElement>(null);

  // ESC ile kapat
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res  = await fetch("/api/musteri/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim().toLowerCase(), password }),
      });
      const data = await res.json();
      if (data.ok) {
        onClose();
        // Tam sayfa yönlendirme → middleware yeni cookie ile çalışır
        window.location.href = data.redirect;
      } else {
        setError(data.error ?? "Kullanıcı adı veya şifre hatalı.");
      }
    } catch {
      setError("Bağlantı hatası. Tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[1100] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        className="w-full max-w-[380px] rounded-2xl p-8 relative"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        {/* Kapat */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-all hover:bg-white/[0.08]"
          aria-label="Kapat"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-[#8a8a9a]" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>

        {/* Başlık */}
        <div className="text-center mb-7">
          <div
            className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: "var(--grad-soft)", border: "1px solid rgba(168,85,247,0.3)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="#c084fc" strokeWidth="1.8">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="font-bold text-[18px] text-white mb-1">Müşteri Girişi</h2>
          <p className="text-[13px] text-[#8a8a9a]">Panele erişmek için bilgilerinizi girin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-username" className="block text-[12px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-2">
              Kullanıcı Adı
            </label>
            <input
              id="login-username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="kullaniciadiniz"
              autoFocus
              autoComplete="username"
              className="w-full px-4 py-3 rounded-xl text-[16px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-purple-500/50"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
            />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-[12px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-2">
              Şifre
            </label>
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-xl text-[16px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-purple-500/50"
              style={{ background: "var(--bg)", border: `1px solid ${error ? "rgba(239,68,68,0.5)" : "var(--border)"}` }}
            />
            {error && <p className="text-[12px] text-red-400 mt-2">{error}</p>}
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary w-full mt-1">
            {loading ? "Kontrol ediliyor..." : "Giriş Yap"}
          </button>
        </form>

        <p className="text-[12px] text-[#555] text-center mt-5">
          Şifrenizi unuttuysanız{" "}
          <a href="https://wa.me/905520772700" className="text-[#c084fc] underline underline-offset-2">
            WhatsApp&apos;tan yazın
          </a>
        </p>
      </div>
    </div>
  );
}
