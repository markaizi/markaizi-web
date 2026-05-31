/**
 * Müşteri portal veri yapısı.
 *
 * Yeni müşteri eklemek için CLIENTS dizisine yeni bir obje ekle,
 * ardından Vercel'de CLIENT_PASSWORD_{ENVKEY} env var'ını oluştur.
 */

export type CampaignStatus = "Aktif" | "Duraklatıldı" | "Tamamlandı";
export type InvoiceStatus  = "Ödendi" | "Bekliyor";

/** Meta Ads veya Google Ads kampanya satırı */
export interface Campaign {
  name: string;        // Kampanya adı
  startDate: string;   // "1 Mayıs 2025"
  endDate: string;     // "31 Mayıs 2025" veya "Devam ediyor"
  dailyBudget: string; // "150 ₺ / gün"
  status: CampaignStatus;
}

/** Ajans güncelleme notu */
export interface ClientUpdate {
  date: string;  // "28 Mayıs 2025"
  text: string;
}

/** Fatura satırı */
export interface Invoice {
  period: string;      // "13 Nisan – 13 Mayıs 2025"
  amount: string;      // "20.000 ₺"
  status: InvoiceStatus;
  dueDate?: string;    // Sadece "Bekliyor" olanlar için: "20 Haziran 2025"
}

export interface ClientData {
  slug: string;
  name: string;
  package: string;
  envKey: string;

  metaCampaigns?: Campaign[];
  googleCampaigns?: Campaign[];
  tiktokCampaigns?: Campaign[];
  websiteUpdates?: ClientUpdate[];
  updates?: ClientUpdate[];
  contentCalendar?: { date: string; content: string }[];

  invoices?: Invoice[];
  invoiceNote?: string;
}

export const CLIENTS: ClientData[] = [
  // ─── Şahin Avize ───────────────────────────────────────────────────────────
  {
    slug: "sahinavize",
    name: "Şahin Avize",
    package: "Büyüme Paketi",
    envKey: "SAHINAVIZE",

    metaCampaigns: [
      {
        name: "Şahin Avize — Mayıs Tanıtım",
        startDate: "1 Mayıs 2025",
        endDate: "Devam ediyor",
        dailyBudget: "150 ₺ / gün",
        status: "Aktif",
      },
    ],

    googleCampaigns: [],

    updates: [
      {
        date: "28 Mayıs 2025",
        text: "Bu hafta 5 Reels videosu yayınlandı. Erişim oranları geçen haftaya göre %18 arttı.",
      },
      {
        date: "26 Mayıs 2025",
        text: "Meta reklam kampanyası optimize edildi. Tıklama başı maliyet %12 düşürüldü.",
      },
      {
        date: "22 Mayıs 2025",
        text: "Google İşletme Profili fotoğrafları ve açıklaması güncellendi.",
      },
      {
        date: "19 Mayıs 2025",
        text: "Mayıs ayı içerik takvimi hazırlandı ve onaylandı.",
      },
    ],

    contentCalendar: [
      { date: "2 Haziran",  content: "Yeni sezon avize koleksiyonu Reels videosu" },
      { date: "4 Haziran",  content: "Müşteri yorumu paylaşımı — Story + Feed" },
      { date: "6 Haziran",  content: "Avize bakım ipuçları carousel" },
      { date: "9 Haziran",  content: "Ürün tanıtım Reels — kristal koleksiyon" },
      { date: "11 Haziran", content: "Özel gün paylaşımı" },
      { date: "13 Haziran", content: "Before/After dekorasyon Reels" },
    ],

    invoices: [
      {
        period: "13 Nisan – 13 Mayıs 2025",
        amount: "20.000 ₺",
        status: "Ödendi",
      },
      {
        period: "13 Mayıs – 13 Haziran 2025",
        amount: "20.000 ₺",
        status: "Bekliyor",
        dueDate: "20 Haziran 2025",
      },
    ],
    invoiceNote: "Şahin Avize için ödeme periyodu her ayın 13'üdür.",
  },

  // ─── Yeni müşteri şablonu ──────────────────────────────────────────────────
  // {
  //   slug: "musteri-slug",
  //   name: "Müşteri Adı",
  //   package: "Başlangıç Paketi",
  //   envKey: "MUSTERIADI",   ← Vercel: CLIENT_PASSWORD_MUSTERIADI
  //   metaCampaigns: [],
  //   googleCampaigns: [],
  //   updates: [],
  //   invoices: [],
  // },
];

export function getClient(slug: string): ClientData | undefined {
  return CLIENTS.find((c) => c.slug === slug);
}
