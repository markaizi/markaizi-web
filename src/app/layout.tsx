import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import Analytics from "@/components/Analytics";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://markaizi.com.tr"),
  title: {
    default: "markaizi — Dijital Reklam Ajansı | Ankara",
    template: "%s — markaizi",
  },
  description:
    "Ankara merkezli dijital reklam ajansı. Sosyal medya yönetimi, Google & Meta reklamları, TikTok reklamları, içerik üretimi ve web tasarım hizmetleri.",
  keywords:
    "dijital reklam ajansı ankara, sosyal medya yönetimi, google reklamları, meta ads, tiktok reklamları, içerik üretimi, web tasarım ankara, instagram yönetimi",
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
  alternates: {
    canonical: "https://markaizi.com.tr",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className="antialiased">
        <Analytics />
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
