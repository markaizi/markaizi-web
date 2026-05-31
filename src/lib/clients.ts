/**
 * Müşteri portal veri yapısı.
 *
 * Yeni müşteri eklemek için CLIENTS dizisine yeni bir obje ekle,
 * ardından Vercel'de CLIENT_PASSWORD_{ENVKEY} env var'ını oluştur.
 *
 * Şifre hiçbir zaman bu dosyada saklanmaz — Vercel env var'larından okunur.
 */

export type UpdateType = "icerik" | "reklam" | "teknik" | "rapor" | "genel";
export type CampaignStatus = "Aktif" | "Duraklatıldı" | "Tamamlandı";
export type InvoiceStatus = "Bekliyor" | "Ödendi";

export interface ClientUpdate {
  date: string;       // "28 Mayıs 2025"
  text: string;       // güncelleme açıklaması
  type: UpdateType;
}

export interface ClientCampaign {
  name: string;
  platform: string;
  status: CampaignStatus;
  budget?: string;
  reach?: string;
  clicks?: string;
  note?: string;
}

export interface ClientData {
  slug: string;       // URL: /musteri/{slug}
  name: string;       // Görünen isim
  package: string;    // Hangi paket
  envKey: string;     // Env var adı: CLIENT_PASSWORD_{envKey}
  campaigns: ClientCampaign[];
  updates: ClientUpdate[];
  contentCalendar?: { date: string; content: string }[];
  nextInvoice?: {
    amount: string;
    dueDate: string;
    status: InvoiceStatus;
  };
}

export const CLIENTS: ClientData[] = [
  // ─── Şahin Avize ───────────────────────────────────────────────────────────
  {
    slug: "sahinavize",
    name: "Şahin Avize",
    package: "Büyüme Paketi",
    envKey: "SAHINAVIZE",
    campaigns: [
      {
        name: "Meta Ads — Mayıs 2025",
        platform: "Instagram & Facebook",
        status: "Aktif",
        budget: "5.000 ₺",
        reach: "18.400",
        clicks: "420",
        note: "Carousel formatı en yüksek etkileşimi alıyor.",
      },
      {
        name: "Google İşletme Profili",
        platform: "Google",
        status: "Aktif",
        note: "Profil optimize edildi, fotoğraflar güncellendi.",
      },
    ],
    updates: [
      {
        date: "28 Mayıs 2025",
        text: "Bu hafta 5 Reels videosu yayınlandı. Erişim oranları geçen haftaya göre %18 arttı.",
        type: "icerik",
      },
      {
        date: "26 Mayıs 2025",
        text: "Meta reklam kampanyası optimize edildi. Tıklama başı maliyet %12 düşürüldü.",
        type: "reklam",
      },
      {
        date: "22 Mayıs 2025",
        text: "Google İşletme Profili fotoğrafları ve açıklaması güncellendi.",
        type: "teknik",
      },
      {
        date: "19 Mayıs 2025",
        text: "Mayıs ayı içerik takvimi hazırlandı ve onaylandı.",
        type: "genel",
      },
    ],
    contentCalendar: [
      { date: "2 Haziran", content: "Yeni sezon avize koleksiyonu Reels videosu" },
      { date: "4 Haziran", content: "Müşteri yorumu paylaşımı — Story + Feed" },
      { date: "6 Haziran", content: "Avize bakım ipuçları carousel" },
      { date: "9 Haziran", content: "Ürün tanıtım Reels — kristal koleksiyon" },
      { date: "11 Haziran", content: "Özel gün paylaşımı (Sevgililer Günü arifesi)" },
      { date: "13 Haziran", content: "Before/After dekorasyon Reels" },
    ],
    nextInvoice: {
      amount: "29.900 ₺",
      dueDate: "1 Haziran 2025",
      status: "Bekliyor",
    },
  },
  // ─── Yeni müşteri eklemek için buraya kopyala ──────────────────────────────
  // {
  //   slug: "musteri-slug",
  //   name: "Müşteri Adı",
  //   package: "Başlangıç Paketi",
  //   envKey: "MUSTERIADI",       ← Vercel'de CLIENT_PASSWORD_MUSTERIADI oluştur
  //   campaigns: [],
  //   updates: [],
  // },
];

export function getClient(slug: string): ClientData | undefined {
  return CLIENTS.find((c) => c.slug === slug);
}
