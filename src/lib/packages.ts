export type PackageType = "abonelik" | "tek-seferlik";

export interface Package {
  slug: string;
  name: string;
  fullName: string;
  price: number; // TL (tam sayı)
  priceKurus: number; // Kuruş (price * 100)
  type: PackageType;
  period?: string; // "/ay" gibi
  desc: string;
}

export const PACKAGES: Package[] = [
  // Sosyal Medya Abonelik Paketleri
  {
    slug: "baslangic",
    name: "Başlangıç",
    fullName: "Sosyal Medya Başlangıç Paketi",
    price: 20000,
    priceKurus: 2000000,
    type: "abonelik",
    period: "/ay",
    desc: "Instagram & Facebook yönetimi, haftada 3 paylaşım",
  },
  {
    slug: "buyume",
    name: "Büyüme",
    fullName: "Sosyal Medya Büyüme Paketi",
    price: 30000,
    priceKurus: 3000000,
    type: "abonelik",
    period: "/ay",
    desc: "Instagram, Facebook & TikTok yönetimi, haftada 5 paylaşım",
  },
  {
    slug: "kurumsal",
    name: "Kurumsal",
    fullName: "Sosyal Medya Kurumsal Paketi",
    price: 40000,
    priceKurus: 4000000,
    type: "abonelik",
    period: "/ay",
    desc: "Tüm platformlar tam yönetim, haftada 7 paylaşım",
  },
  {
    slug: "elite",
    name: "Elite",
    fullName: "Sosyal Medya Elite Paketi",
    price: 60000,
    priceKurus: 6000000,
    type: "abonelik",
    period: "/ay",
    desc: "Tüm platformlar + web sitesi, SEO & yapay zeka entegrasyonu",
  },
  // Web Tasarım Tek Seferlik Paketler
  {
    slug: "web-basit",
    name: "Basit Tanıtım Sitesi",
    fullName: "Web Tasarım — Basit Tanıtım Sitesi",
    price: 14900,
    priceKurus: 1490000,
    type: "tek-seferlik",
    desc: "5 sayfaya kadar, mobil uyumlu, 1 yıl hosting dahil",
  },
  {
    slug: "web-kurumsal",
    name: "Kurumsal Web Sitesi",
    fullName: "Web Tasarım — Kurumsal Web Sitesi",
    price: 29900,
    priceKurus: 2990000,
    type: "tek-seferlik",
    desc: "15 sayfaya kadar, SEO optimizasyonu, 1 yıl hosting & destek",
  },
  {
    slug: "web-seo",
    name: "Gelişmiş SEO'lu Site",
    fullName: "Web Tasarım — Gelişmiş SEO'lu Site",
    price: 49900,
    priceKurus: 4990000,
    type: "tek-seferlik",
    desc: "Sınırsız sayfa, kapsamlı SEO, 6 ay takip & raporlama",
  },
];

export function getPackage(slug: string): Package | undefined {
  return PACKAGES.find((p) => p.slug === slug);
}
