import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";

export const metadata: Metadata = {
  title: "Sayfa Bulunamadı — markaizi",
  robots: { index: false, follow: false },
};

const LINKS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hizmetler/sosyal-medya-yonetimi", label: "Sosyal Medya Yönetimi" },
  { href: "/hizmetler/meta-reklamlari", label: "Meta Reklamları" },
  { href: "/hizmetler/google-reklamlari", label: "Google Reklamları" },
  { href: "/blog", label: "Blog" },
  { href: "/sss", label: "Sıkça Sorulan Sorular" },
];

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] flex items-center px-6" style={{ background: "var(--bg)" }}>
        <div className="max-w-[720px] mx-auto text-center py-24">
          <p className="font-black text-[15px] tracking-[0.2em] uppercase mb-4 gradient-text">404</p>
          <h1 className="font-black text-[32px] sm:text-[42px] leading-tight text-white mb-4">
            Bu sayfayı bulamadık
          </h1>
          <p className="text-[16px] text-[#8a8a9a] mb-10 max-w-[520px] mx-auto leading-relaxed">
            Aradığınız sayfa taşınmış veya kaldırılmış olabilir. Aşağıdaki bağlantılardan
            devam edebilir ya da bize doğrudan yazabilirsiniz.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <a href="/" className="btn btn-primary">Ana Sayfaya Dön</a>
            <a
              href="https://wa.me/905520772700"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              WhatsApp&apos;tan Yazın
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[13px] font-semibold px-4 py-2.5 rounded-full transition-colors"
                style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "#c8c8d8" }}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <WhatsApp />
    </>
  );
}
