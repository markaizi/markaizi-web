import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import Analytics from "@/components/Analytics";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, ORG_NAME, ORG_ID, LOGO_URL, SAME_AS, OG_IMAGES } from "@/lib/seo";
import { founderRef } from "@/lib/founder";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: ORG_NAME,
  url: SITE_URL,
  inLanguage: "tr-TR",
  publisher: {
    "@type": "Organization",
    "@id": ORG_ID,
    name: ORG_NAME,
    url: SITE_URL,
    logo: LOGO_URL,
    sameAs: SAME_AS,
    founder: founderRef,
  },
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Yalnızca 700 yükleniyor: h1/h2 bu fontu kullanıyor ve hepsi font-black (900)
// ile yazılmış. Space Grotesk'in 900 ağırlığı yok, en kalını 700 — tarayıcı
// zaten 700'e düşürüyor (sentetik kalınlaştırma yapmıyor, 700/800/900 ölçümde
// birebir aynı genişlikte). 500 ve 600 sitede hiç kullanılmıyordu; ikisi de
// indiriliyor ama hiçbir yere uygulanmıyordu.
// Not: başlıkların gerçekten daha kalın olması istenirse 800+ ağırlığı olan bir
// display fontuna geçmek gerekir (Sora, Outfit, Manrope); Space Grotesk'te bu yok.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://markaizi.com.tr"),
  title: {
    default: "markaizi — Dijital Reklam Ajansı | Ankara",
    template: "%s — markaizi",
  },
  description:
    "Ankara Siteler merkezli, Türkiye geneline hizmet veren dijital reklam ajansı. Mobilya mağazaları ve üreticileri başta olmak üzere işletmelere sosyal medya yönetimi, Google & Meta reklamları ve web tasarım.",
  keywords:
    "mobilya reklam ajansı, mobilya sosyal medya ajansı, mobilya google reklamları, mobilya meta reklamları, mobilya web sitesi, türkiye geneli dijital reklam ajansı, dijital reklam ajansı ankara, sosyal medya yönetimi ankara, google reklamları ankara, meta ads ankara, instagram yönetimi ankara, siteler dijital reklam, ankara mobilya reklamı, ankara avize reklam ajansı, ankara doktor dijital pazarlama, ankara aksesuar sosyal medya, ostim reklam ajansı, keçiören reklam ajansı, etimesgut reklam ajansı, çankaya dijital ajans, tiktok reklamları ankara, web tasarım ankara, işletme sosyal medya yönetimi, yerel işletme dijital pazarlama ankara",
  authors: [{ name: "markaizi" }],
  creator: "markaizi",
  // Kök openGraph/twitter yalnızca ortak alanları taşır. title/description/url BİLEREK yok:
  // her sayfa kendi <title>/description değerini (ve canonical'ını) miras alır; aksi halde 20+ sayfa
  // ana sayfanın OG/Twitter başlığını basıyordu. Ana sayfanın kendi OG'si src/app/page.tsx'te.
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "markaizi",
    images: OG_IMAGES,
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  // Meta (Facebook) İşletme Yöneticisi alan adı doğrulaması
  verification: {
    other: { "facebook-domain-verification": "eal8vf1qo96yyamxtnj0kqowgpmq18" },
  },
};

// themeColor: iOS Safari / Android Chrome adres çubuğunu site zeminiyle aynı
// renge boyar — koyu sayfanın üstündeki açık gri şerit kalkar.
// colorScheme: native <select> açılır listesi, tarih seçici ve kaydırma
// çubuklarının koyu temada çizilmesini sağlar.
export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="antialiased">
        <JsonLd data={websiteJsonLd} />
        <Analytics />
{children}
        <CookieBanner />
      </body>
    </html>
  );
}
