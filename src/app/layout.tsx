import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "markaizi — Dijital Reklam Ajansı",
  description:
    "Markanızı dijitalde zirveye taşıyan reklam ajansı. Sosyal medya yönetimi, Google & Meta reklamları, içerik üretimi, web tasarım ve hosting hizmetleri.",
  keywords:
    "dijital reklam ajansı, sosyal medya yönetimi, google reklamları, meta ads, tiktok reklamları, içerik üretimi, web tasarım",
  openGraph: {
    title: "markaizi — Dijital Reklam Ajansı",
    description: "Markanızı dijitalde zirveye taşıyoruz.",
    type: "website",
    locale: "tr_TR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
