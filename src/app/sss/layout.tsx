import { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Sıkça Sorulan Sorular — markaizi Ankara Dijital Reklam Ajansı" },
  description:
    "Ankara dijital reklam ajansı hakkında merak edilenlerin yanıtları. Sosyal medya yönetimi, Google Ads, Meta reklamları ve çalışma süreci hakkında SSS.",
  alternates: { canonical: "https://markaizi.com.tr/sss" },
};

export default function SSSLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
