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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

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
                WebkitBackdropFilter: "blur(20px)", backdropFilter: "blur(20px)",
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

          {/* Desktop Links — lg: (1024px). 768–1023px arası hamburger kullanılır:
              md:'de (768px) logo + 4 link + Müşteri Girişi + İletişim butonu 782px yer
              kaplıyor ve İletişim butonu ekranın dışında kalıyordu. */}
          <ul className="hidden lg:flex items-center gap-1">
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
          <div className="lg:hidden flex items-center gap-3">
            {session ? (
              <a
                href={session.redirect}
                className="flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-full transition-all text-[13px] font-medium"
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
                className="flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-full transition-all hover:bg-white/[0.08] text-[13px] font-medium"
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
            className="flex flex-col items-center justify-center gap-[5px] min-w-[44px] min-h-[44px] z-[1001] relative"
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

      {/* Mobile Menu
          Kapalıyken ekranın sağına park ediliyor ama DOM'da kalıyor; inert +
          aria-hidden olmadan klavye kullanıcıları göremedikleri linklere
          tab'lıyor, ekran okuyucular da onları okuyordu. */}
      <div
        id="mobil-menu"
        inert={!open}
        aria-hidden={!open}
        className="fixed inset-0 z-[10000] flex flex-col transition-transform duration-300"
        style={{
          background: "rgba(5,5,5,0.97)",
          WebkitBackdropFilter: "blur(20px)", backdropFilter: "blur(20px)",
          transform: open ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Üst şerit: logo + kapat */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <Link href="/" onClick={close} className="flex items-center gap-2.5">
            <Logo height={44} />
            <span className="font-extralight text-[15px] text-white/80 tracking-[0.14em] select-none">
              marka<span style={{ color: "#c084fc" }}>izi</span>
            </span>
          </Link>
          <button
            onClick={close}
            aria-label="Menüyü kapat"
            className="flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-full transition-all"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
            <span className="text-[14px] font-semibold text-white">Kapat</span>
          </button>
        </div>

        {/* Menü linkleri */}
        <ul className="flex flex-col items-center justify-center gap-7 flex-1">
          {[...NAV_LINKS, { href: isHome ? "#iletisim" : "/#iletisim", label: "İletişim", section: "iletisim" as string | null }].map((l) => {
            // Aktif sayfa göstergesi yoktu — hepsi aynı gri linkti.
            // Hash linkleri (/#hizmetler) pathname ile eşleşmez; yalnızca
            // /blog gibi gerçek sayfalar vurgulanır.
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => handleNavClick(e, l as typeof NAV_LINKS[number])}
                  aria-current={active ? "page" : undefined}
                  className="text-[28px] font-bold transition-colors"
                  style={{ color: active ? "#fff" : "#8a8a9a" }}
                >
                  {l.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Alt blok: en yüksek niyetli aksiyonlar. Menüde telefon/WhatsApp
            yoktu — mobilde bunlar formdan daha çok dönüşüyor. */}
        <div className="px-6 pb-10 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="flex gap-3">
            <a
              href="tel:+905520772700"
              className="btn btn-outline flex-1 gap-2 px-4"
              onClick={close}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px]" stroke="currentColor" strokeWidth="1.8">
                <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1A19.5 19.5 0 015 12.9 19.8 19.8 0 011.9 4.2 2 2 0 013.9 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.8.7a2 2 0 011.8 2z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Hemen Ara
            </a>
            <a
              href="https://wa.me/905520772700"
              target="_blank"
              rel="noopener noreferrer"
              className="btn flex-1 gap-2 px-4 text-white"
              style={{ background: "#25d366" }}
              onClick={close}
            >
              {/* WhatsApp.tsx'teki resmi marka yolu — sadeleştirilmiş bir çizim
                  genel konuşma balonu gibi okunuyordu. */}
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
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
      style={{ background: "rgba(0,0,0,0.75)", WebkitBackdropFilter: "blur(8px)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
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
          <h2 id="login-modal-title" className="font-bold text-[18px] text-white mb-1">Müşteri Girişi</h2>
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
          <Link href="/musteri/sifremi-unuttum" className="text-[#c084fc] underline underline-offset-2">
            Şifremi unuttum
          </Link>
        </p>
      </div>
    </div>
  );
}
