import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import Analytics from "@/components/Analytics";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, ORG_NAME, LOGO_URL, SAME_AS } from "@/lib/seo";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: ORG_NAME,
  url: SITE_URL,
  inLanguage: "tr-TR",
  publisher: {
    "@type": "Organization",
    name: ORG_NAME,
    url: SITE_URL,
    logo: LOGO_URL,
    sameAs: SAME_AS,
  },
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://markaizi.com.tr"),
  title: {
    default: "markaizi — Dijital Reklam Ajansı | Ankara",
    template: "%s — markaizi",
  },
  description:
    "Ankara Siteler merkezli dijital reklam ajansı. Mobilyacı, avizeci, aksesuarcı, doktor ve yerel işletmelere özel sosyal medya yönetimi, Google & Meta reklamları, web tasarım hizmetleri.",
  keywords:
    "dijital reklam ajansı ankara, sosyal medya yönetimi ankara, google reklamları ankara, meta ads ankara, instagram yönetimi ankara, siteler dijital reklam, ankara mobilya reklamı, ankara avize reklam ajansı, ankara doktor dijital pazarlama, ankara aksesuar sosyal medya, ostim reklam ajansı, keçiören reklam ajansı, etimesgut reklam ajansı, çankaya dijital ajans, tiktok reklamları ankara, web tasarım ankara, işletme sosyal medya yönetimi, yerel işletme dijital pazarlama ankara",
  authors: [{ name: "markaizi" }],
  creator: "markaizi",
  openGraph: {
    title: "markaizi — Dijital Reklam Ajansı | Ankara",
    description: "Sosyal medya, Google & Meta reklamları, içerik üretimi ve web tasarım. Markanızı dijitalde zirveye taşıyoruz.",
    type: "website",
    locale: "tr_TR",
    url: "https://markaizi.com.tr",
    siteName: "markaizi",
  },
  twitter: {
    card: "summary_large_image",
    title: "markaizi — Dijital Reklam Ajansı",
    description: "Sosyal medya, Google & Meta reklamları, içerik üretimi ve web tasarım.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
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
