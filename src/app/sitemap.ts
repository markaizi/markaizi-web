import { MetadataRoute } from "next";

const BASE = "https://markaizi.com.tr";

const BLOG_SLUGS = [
  "instagram-algoritmasi",
  "google-ads-butce-optimizasyonu",
  "meta-ads-roas",
  "tiktok-for-business",
  "yapay-zeka-icerik",
  "core-web-vitals",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const static_pages: MetadataRoute.Sitemap = [
    { url: BASE,                                          lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/blog`,                                lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/sss`,                                 lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/hizmetler/sosyal-medya-yonetimi`,    lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/hizmetler/meta-reklamlari`,          lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/hizmetler/google-reklamlari`,        lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/hizmetler/tiktok-reklamlari`,        lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/hizmetler/icerik-uretimi`,           lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/hizmetler/web-tasarim-hosting`,      lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/kvkk`,                               lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/gizlilik-politikasi`,                lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/cerez-politikasi`,                   lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/kullanim-sartlari`,                  lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];

  const blog_pages: MetadataRoute.Sitemap = BLOG_SLUGS.map((slug) => ({
    url: `${BASE}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...static_pages, ...blog_pages];
}
