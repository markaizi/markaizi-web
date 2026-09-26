import { SITE_URL } from "@/lib/seo";

// Kurucu bilgisi — kişi sayfası, Organization.founder, video yazarı ve llms.txt
// aynı kaynaktan beslenir. Kişisel sosyal medya/LinkedIn hesapları açıldıkça
// SAME_AS listesine ekle: Google'ın "Samet Sağlam" aramasında kişiyi markaizi
// ile eşleştirmesini en çok bu bağlantılar güçlendirir.
export const FOUNDER = {
  name: "Samet Sağlam",
  alternateName: "Samet Saglam",
  path: "/samet-saglam",
  jobTitle: "Kurucu",
  sameAs: [] as string[],
};

export const FOUNDER_URL = `${SITE_URL}${FOUNDER.path}`;
export const FOUNDER_ID = `${FOUNDER_URL}#person`;

// Diğer şemalarda kısa referans (tam tanım kişi sayfasında)
export const founderRef = {
  "@type": "Person",
  "@id": FOUNDER_ID,
  name: FOUNDER.name,
  url: FOUNDER_URL,
};

export function founderJsonLd() {
  return {
    "@type": "Person",
    "@id": FOUNDER_ID,
    name: FOUNDER.name,
    alternateName: FOUNDER.alternateName,
    url: FOUNDER_URL,
    jobTitle: "markaizi Kurucusu",
    description:
      "Samet Sağlam, Ankara Siteler merkezli dijital reklam ajansı markaizi'nin kurucusudur. Mobilya sektörü başta olmak üzere işletmelere Meta ve Google reklamları, sosyal medya ve içerik stratejisi konusunda hizmet verir; YouTube kanalında işletme sahipleri için dijital pazarlama rehberleri anlatır.",
    worksFor: { "@type": "Organization", name: "markaizi", url: SITE_URL },
    workLocation: { "@type": "Place", name: "Siteler, Ankara, Türkiye" },
    knowsAbout: [
      "Dijital pazarlama",
      "Meta (Instagram ve Facebook) reklamları",
      "Google reklamları",
      "Sosyal medya yönetimi",
      "Mobilya sektörü pazarlaması",
      "Reklam kreatifi ve video içerik stratejisi",
    ],
    ...(FOUNDER.sameAs.length ? { sameAs: FOUNDER.sameAs } : {}),
  };
}
