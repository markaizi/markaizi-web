export const SITE_URL = "https://markaizi.com.tr";
export const ORG_NAME = "markaizi";
export const LOGO_URL = `${SITE_URL}/logo.svg`;

// Ajansın tek, paylaşılan varlık kimliği: layout'taki Organization, ana sayfadaki ProfessionalService ve
// tüm hizmet/sektör sayfalarındaki provider/publisher bu @id ile tek bir bilgi grafiği düğümüne bağlanır.
// (Google ve yapay zekâ sistemleri aynı @id'yi tek varlık olarak birleştirir.)
export const ORG_ID = `${SITE_URL}/#organization`;

// Kendi `openGraph` nesnesini tanımlayan sayfalarda og:image kaybolmasın diye (Next.js nested
// openGraph'ı kökten ezer) — görsel src/app/opengraph-image.tsx tarafından üretilir.
export const OG_IMAGES = [
  { url: "/opengraph-image", width: 1200, height: 630, alt: "markaizi — Dijital Reklam Ajansı" },
];
import { YOUTUBE_CHANNEL_URL } from "@/lib/video-data";

export const SAME_AS = [
  "https://instagram.com/markaizicom",
  "https://tiktok.com/@markaizicom",
  "https://share.google/S5wQdPjBKZT7DQ9zu",
  ...(YOUTUBE_CHANNEL_URL ? [YOUTUBE_CHANNEL_URL] : []),
];

export interface BreadcrumbStep {
  name: string;
  path: string;
}

export function breadcrumbJsonLd(items: BreadcrumbStep[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
