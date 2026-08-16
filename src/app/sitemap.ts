import { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog-data";

const BASE = "https://markaizi.com.tr";

// Sitenin en son içerik revizyon tarihi. Her istekte "şimdi" döndürmek yerine
// sabit bir tarih kullanılır — gerçek bir güncelleme olduğunda elle güncellenir.
const SITE_UPDATED = new Date("2026-08-17");

export default function sitemap(): MetadataRoute.Sitemap {
  const static_pages: MetadataRoute.Sitemap = [
    // ── Ana sayfalar ──────────────────────────────────────────
    { url: BASE,                                             lastModified: SITE_UPDATED, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/blog`,                                   lastModified: SITE_UPDATED, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/mobilya-reklam-ajansi`,                  lastModified: SITE_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/saglik-klinik-reklam-ajansi`,             lastModified: SITE_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/dogal-urun-takviye-reklam-ajansi`,        lastModified: SITE_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/ucretsiz-analiz`,                         lastModified: SITE_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/sss`,                                    lastModified: SITE_UPDATED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/cv`,                                     lastModified: SITE_UPDATED, changeFrequency: "monthly", priority: 0.5 },

    // ── Hizmet sayfaları ──────────────────────────────────────
    { url: `${BASE}/hizmetler/sosyal-medya-yonetimi`,        lastModified: SITE_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/hizmetler/meta-reklamlari`,              lastModified: SITE_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/hizmetler/google-reklamlari`,            lastModified: SITE_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/hizmetler/tiktok-reklamlari`,            lastModified: SITE_UPDATED, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/hizmetler/yapay-zeka-otomasyon`,         lastModified: SITE_UPDATED, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/hizmetler/web-tasarim-hosting`,          lastModified: SITE_UPDATED, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/hizmetler/web-tasarim-hosting/teklif`,   lastModified: SITE_UPDATED, changeFrequency: "monthly", priority: 0.6 },

    // ── Yasal sayfalar ────────────────────────────────────────
    { url: `${BASE}/kvkk`,                                   lastModified: SITE_UPDATED, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/gizlilik-politikasi`,                    lastModified: SITE_UPDATED, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/cerez-politikasi`,                       lastModified: SITE_UPDATED, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/kullanim-sartlari`,                      lastModified: SITE_UPDATED, changeFrequency: "yearly",  priority: 0.3 },
  ];

  const blog_pages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.dateISO),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...static_pages, ...blog_pages];
}
