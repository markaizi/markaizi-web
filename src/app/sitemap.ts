import { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog-data";
import { ALL_MOBILYA_PAGES } from "@/lib/mobilya-pages";
import { KAFE_DISTRICT_PAGES, KAFE_HUB } from "@/lib/kafe-pages";
import { VIDEOS, ytThumb, ytEmbed } from "@/lib/video-data";

const BASE = "https://markaizi.com.tr";

// Sitenin en son içerik revizyon tarihi. Her istekte "şimdi" döndürmek yerine
// sabit bir tarih kullanılır — gerçek bir güncelleme olduğunda elle güncellenir.
const SITE_UPDATED = new Date("2026-09-26");

export default function sitemap(): MetadataRoute.Sitemap {
  const static_pages: MetadataRoute.Sitemap = [
    // ── Ana sayfalar ──────────────────────────────────────────
    { url: BASE,                                             lastModified: SITE_UPDATED, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/blog`,                                   lastModified: SITE_UPDATED, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/mobilya-reklam-ajansi`,                  lastModified: SITE_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/saglik-klinik-reklam-ajansi`,             lastModified: SITE_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/dogal-urun-takviye-reklam-ajansi`,        lastModified: SITE_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/ucretsiz-analiz`,                         lastModified: new Date("2026-10-01"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/reklam-hesabi-denetimi`,                  lastModified: new Date("2026-10-01"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/araclar/reklam-butcesi-hesaplayici`,      lastModified: new Date("2026-10-01"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/samet-saglam`,                           lastModified: SITE_UPDATED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/sss`,                                    lastModified: new Date("2026-10-01"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/cv`,                                     lastModified: SITE_UPDATED, changeFrequency: "monthly", priority: 0.5 },

    // ── Hizmet sayfaları ──────────────────────────────────────
    { url: `${BASE}/hizmetler/sosyal-medya-yonetimi`,        lastModified: SITE_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/hizmetler/meta-reklamlari`,              lastModified: SITE_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/hizmetler/google-reklamlari`,            lastModified: SITE_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/hizmetler/tiktok-reklamlari`,            lastModified: SITE_UPDATED, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/hizmetler/yapay-zeka-otomasyon`,         lastModified: SITE_UPDATED, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/hizmetler/web-tasarim-hosting`,          lastModified: SITE_UPDATED, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/hizmetler/dijital-pazarlama-danismanligi`, lastModified: SITE_UPDATED, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/hizmetler/dijital-pazarlama-egitimi`,    lastModified: SITE_UPDATED, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/hizmetler/video-cekimi-drone`,           lastModified: SITE_UPDATED, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/hizmetler/donusum-takibi-kurulumu`,      lastModified: new Date("2026-10-01"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/hizmetler/yapay-zeka-arama-gorunurlugu`, lastModified: new Date("2026-10-01"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/hizmetler/web-tasarim-hosting/teklif`,   lastModified: SITE_UPDATED, changeFrequency: "monthly", priority: 0.6 },

    // ── Yasal sayfalar ────────────────────────────────────────
    { url: `${BASE}/kvkk`,                                   lastModified: SITE_UPDATED, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/gizlilik-politikasi`,                    lastModified: SITE_UPDATED, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/cerez-politikasi`,                       lastModified: SITE_UPDATED, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/kullanim-sartlari`,                      lastModified: SITE_UPDATED, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/mesafeli-satis-sozlesmesi`,              lastModified: new Date("2026-09-29"), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/on-bilgilendirme-formu`,                 lastModified: new Date("2026-09-29"), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/iptal-ve-iade-kosullari`,                lastModified: new Date("2026-09-29"), changeFrequency: "yearly", priority: 0.3 },
  ];

  const blog_pages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.dateModifiedISO ?? post.dateISO),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const mobilya_pages: MetadataRoute.Sitemap = [
    ...ALL_MOBILYA_PAGES.map((p) => ({
      url: `${BASE}${p.path}`,
      lastModified: SITE_UPDATED,
      changeFrequency: "monthly" as const,
      priority: p.kind === "hizmet" ? 0.85 : 0.8,
    })),
    { url: `${BASE}/vaka-calismalari/alitel-mobilya`, lastModified: SITE_UPDATED, changeFrequency: "monthly" as const, priority: 0.85 },
  ];

  const kafe_pages: MetadataRoute.Sitemap = [
    { url: `${BASE}${KAFE_HUB.path}`, lastModified: new Date("2026-09-27"), changeFrequency: "monthly" as const, priority: 0.9 },
    ...KAFE_DISTRICT_PAGES.map((p) => ({ url: `${BASE}${p.path}`, lastModified: new Date("2026-09-27"), changeFrequency: "monthly" as const, priority: 0.8 })),
  ];

  const video_pages: MetadataRoute.Sitemap = [
    { url: `${BASE}/videolar`, lastModified: new Date(VIDEOS[0]?.dateISO ?? SITE_UPDATED), changeFrequency: "weekly" as const, priority: 0.8 },
    ...VIDEOS.map((v) => ({
      url: `${BASE}/videolar/${v.slug}`,
      lastModified: new Date(v.dateISO),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      ...(v.youtubeId
        ? { videos: [{ title: v.title, description: v.excerpt, thumbnail_loc: ytThumb(v.youtubeId), player_loc: ytEmbed(v.youtubeId) }] }
        : {}),
    })),
  ];

  return [...static_pages, ...mobilya_pages, ...kafe_pages, ...video_pages, ...blog_pages];
}
