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

  // ─── Alanya Pro Cleaning ───────────────────────────────────────────────────
  {
    slug: "alanyapro",
    name: "Alanya Pro Cleaning",
    package: "Kurumsal Paketi",
    envKey: "ALANYAPRO",

    metaCampaigns: [
      {
        name: "Genel Kampanyalar",
        startDate: "31 Mayıs 2025",
        endDate: "Devam ediyor",
        dailyBudget: "300 ₺/gün",
        status: "Aktif",
      },
      {
        name: "Abonelik Paketleri",
        startDate: "31 Mayıs 2025",
        endDate: "Devam ediyor",
        dailyBudget: "100 ₺/gün",
        status: "Aktif",
      },
    ],

    googleCampaigns: [
      {
        name: "Türkçe Arama Kampanyası",
        startDate: "31 Mayıs 2025",
        endDate: "Devam ediyor",
        dailyBudget: "200 ₺/gün",
        status: "Aktif",
      },
      {
        name: "İngilizce Arama Kampanyası",
        startDate: "31 Mayıs 2025",
        endDate: "Devam ediyor",
        dailyBudget: "150 ₺/gün",
        status: "Aktif",
      },
    ],

    websiteUpdates: [
      {
        date: "20 Mayıs 2025",
        text: "Wix ile yapılan altyapı şu an aktif. Yeni teknoloji ve altyapı yapay zeka desteğiyle yapımı devam ediyor. Muhtemel Bitiş Tarihi: 10 Haziran 2025",
      },
    ],

    updates: [
      {
        date: "31 Mayıs 2025",
        text: "Meta Ads Genel Kampanyalar reklamı açıldı. Kampanya içerisinde Genel Reels ve Postlarımız tek kampanya içerisinde toplanarak maksimum dönüşüm hedeflendi.",
      },
      {
        date: "31 Mayıs 2025",
        text: "Abonelik paketleri kampanyası günlük 100 TL bütçe ile açıldı.",
      },
      {
        date: "31 Mayıs 2025",
        text: "Google Ads bakiyesi tükenmişti, 1.000 ₺ sonu 7458 olan karttan çekildi.",
      },
    ],

    contentCalendar: [
      { date: "1 Haziran",  content: "İnşaat Sonrası Temizlik Görsel ve Videosu Yayınlanacak" },
      { date: "3 Haziran",  content: "Haziran özel kampanya Görsel ve Videosu Yayınlanacak" },
    ],

    invoices: [
      {
        period: "25 Şubat – 25 Mart 2025",
        amount: "20.000 ₺ + KDV",
        status: "Ödendi",
      },
      {
        period: "25 Mart – 25 Nisan 2025",
        amount: "20.000 ₺ + KDV",
        status: "Ödendi",
      },
      {
        period: "Ajans hesabından Reklam Ödemesi",
        amount: "1.900 ₺",
        status: "Bekliyor",
        dueDate: "1 Haziran 2025",
      },
      {
        period: "25 Nisan – 25 Mayıs 2025",
        amount: "20.000 ₺ + KDV",
        status: "Bekliyor",
        dueDate: "1 Haziran 2025",
      },
    ],
    invoiceNote: "Alanya Pro Cleaning için ödeme periyodu her ayın 25'idir.",
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
