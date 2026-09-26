export const SITE_URL = "https://markaizi.com.tr";
export const ORG_NAME = "markaizi";
export const LOGO_URL = `${SITE_URL}/logo.svg`;
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
