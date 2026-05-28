import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular — markaizi Ankara Dijital Reklam Ajansı",
  description:
    "Ankara dijital reklam ajansı hakkında merak edilenlerin yanıtları. Sosyal medya yönetimi, Google Ads, Meta reklamları, paket fiyatları ve çalışma süreci hakkında SSS.",
  keywords:
    "dijital reklam ajansı sss, sosyal medya yönetimi fiyatları ankara, google ads fiyat ankara, meta reklam maliyeti, ankara ajans nasıl çalışır, reklam bütçesi ne kadar olmalı",
  alternates: { canonical: "https://markaizi.com.tr/sss" },
};

export default function SSSLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
