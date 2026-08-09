export const SITE_URL = "https://markaizi.com.tr";
export const ORG_NAME = "markaizi";
export const LOGO_URL = `${SITE_URL}/logo.svg`;
export const SAME_AS = [
  "https://instagram.com/markaizicom",
  "https://tiktok.com/@markaizicom",
  "https://share.google/S5wQdPjBKZT7DQ9zu",
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
