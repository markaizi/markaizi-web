/**
 * Müşteri portal veri yapısı.
 *
 * Yeni müşteri eklemek için CLIENTS dizisine yeni bir obje ekle,
 * ardından Vercel'de CLIENT_PASSWORD_{ENVKEY} env var'ını oluştur.
 */

export type CampaignStatus = "Aktif" | "Duraklatıldı" | "Tamamlandı" | "Ödeme Hatası";
export type InvoiceStatus  = "Ödendi" | "Bekliyor" | "Günü Gelmedi";

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
        name: "Mayıs Mesaj Kampanyaları",
        startDate: "1 Mayıs 2026",
        endDate: "Devam ediyor",
        dailyBudget: "200 ₺/gün",
        status: "Aktif",
      },
      {
        name: "Mayıs Bilinirlik Kampanyaları",
        startDate: "1 Mayıs 2026",
        endDate: "Devam ediyor",
        dailyBudget: "200 ₺/gün",
        status: "Aktif",
      },
      {
        name: "Yasin Düşüyor Reels Kampanyası",
        startDate: "21 Mayıs 2026",
        endDate: "Devam ediyor",
        dailyBudget: "100 ₺/gün",
        status: "Aktif",
      },
      {
        name: "%70'e Varan İndirimler — Instagram",
        startDate: "31 Mayıs 2026",
        endDate: "6 Haziran 2025",
        dailyBudget: "120 ₺/gün",
        status: "Aktif",
      },
      {
        name: "%70'e Varan İndirimler — Mesaj",
        startDate: "31 Mayıs 2026",
        endDate: "Devam ediyor",
        dailyBudget: "100 ₺/gün",
        status: "Aktif",
      },
    ],

    googleCampaigns: [],

    websiteUpdates: [
      {
        date: "31 Mayıs 2026",
        text: "Yapılması planlanan web sitesi için döküman hazırlandı, sunum yapılacak.",
      },
      {
        date: "2 Haziran 2026",
        text: "Web sitesi Şahin bey'e sunuldu, alternatif tasarım yapılacak.",
      },
    ],

    updates: [
      {
        date: "31 Mayıs 2026",
        text: "Instagram üzerinden günlük 120 TL, 7 gün süreyle '%70'e varan indirimler' kampanyası yayınlandı.",
      },
      {
        date: "31 Mayıs 2026",
        text: "Meta üzerinden '%70'e varan indirimler' günlük 100 TL bütçe ile mesaj dönüşümü olarak yayınlandı.",
      },
      {
        date: "31 Mayıs 2026",
        text: "'Doğru avize evinizin imzasıdır' videosu yeterince izlendi; günlük 50 TL bütçeli kampanya kapatıldı.",
      },
      {
        date: "31 Mayıs 2026",
        text: "'%70'e varan indirimler' videosu, Mayıs bilinirlik kampanyası içerisine günlük 50 TL bütçe ile eklendi.",
      },
      {
        date: "1 Haziran 2026",
        text: "Google reklamları ve web sitesi ile ilgili görüşüldü, teklif verilecek.",
      },
      {
        date: "2 Haziran 2026",
        text: "1 Haziran çekimleri tamamı editlendi, sunuldu ve planlanacak.",
      },
    ],

    contentCalendar: [
      { date: "1 Haziran", content: "Evinizin atmosferini değiştirecek avize reels" },
      { date: "2 Haziran", content: "Işığın dekorasyonla buluştuğu avize reels" },
      { date: "3 Haziran", content: "Gramofonlar reels" },
      { date: "4 Haziran", content: "Tablo Çekilişi (1 Ay)" },
      { date: "5 Haziran", content: "Onu görmüşümdür Viral" },
      { date: "6 Haziran", content: "Avize Modeli" },
      { date: "7 Haziran", content: "Kedi El Sallama Viral" },
      { date: "8 Haziran", content: "Melisa Tık Tık %70" },
      { date: "9 Haziran", content: "Şahin Uçuyor YZ" },
    ],

    invoices: [
      {
        period: "13 Nisan – 13 Mayıs 2026",
        amount: "20.000 ₺",
        status: "Ödendi",
      },
      {
        period: "13 Mayıs – 13 Haziran 2026",
        amount: "20.000 ₺",
        status: "Bekliyor",
        dueDate: "20 Haziran 2026",
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
        startDate: "31 Mayıs 2026",
        endDate: "Devam ediyor",
        dailyBudget: "280 ₺/gün",
        status: "Aktif",
      },
      {
        name: "Abonelik Paketleri",
        startDate: "31 Mayıs 2026",
        endDate: "Devam ediyor",
        dailyBudget: "100 ₺/gün",
        status: "Aktif",
      },
    ],

    googleCampaigns: [
      {
        name: "Türkçe Arama Kampanyası",
        startDate: "31 Mayıs 2026",
        endDate: "Devam ediyor",
        dailyBudget: "200 ₺/gün",
        status: "Aktif",
      },
      {
        name: "İngilizce Arama Kampanyası",
        startDate: "31 Mayıs 2026",
        endDate: "Devam ediyor",
        dailyBudget: "150 ₺/gün",
        status: "Aktif",
      },
    ],

    websiteUpdates: [
      {
        date: "20 Mayıs 2026",
        text: "Wix ile yapılan altyapı şu an aktif. Yeni teknoloji ve altyapı yapay zeka desteğiyle yapımı devam ediyor. Muhtemel Bitiş Tarihi: 10 Haziran 2025",
      },
    ],

    updates: [
      {
        date: "31 Mayıs 2026",
        text: "Meta Ads Genel Kampanyalar reklamı açıldı. Kampanya içerisinde Genel Reels ve Postlarımız tek kampanya içerisinde toplanarak maksimum dönüşüm hedeflendi.",
      },
      {
        date: "31 Mayıs 2026",
        text: "Abonelik paketleri kampanyası günlük 100 TL bütçe ile açıldı.",
      },
      {
        date: "31 Mayıs 2026",
        text: "Google Ads bakiyesi tükenmişti, 1.000 ₺ sonu 7458 olan karttan çekildi.",
      },
      {
        date: "1 Haziran 2026",
        text: "Meta hesabında optimize ve bütçe düzenlemesi yapıldı.",
      },
    ],

    contentCalendar: [
      { date: "2 Haziran", content: "İnşaat Sonrası Temizlik Görsel ve Videosu Yayınlanacak" },
      { date: "4 Haziran", content: "Haziran özel kampanya Görsel ve Videosu Yayınlanacak" },
    ],

    invoices: [
      {
        period: "25 Şubat – 25 Mart 2026",
        amount: "20.000 ₺ + KDV",
        status: "Ödendi",
      },
      {
        period: "25 Mart – 25 Nisan 2026",
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
        period: "25 Nisan – 25 Mayıs 2026",
        amount: "20.000 ₺ + KDV",
        status: "Bekliyor",
        dueDate: "1 Haziran 2025",
      },
    ],
    invoiceNote: "Alanya Pro Cleaning için ödeme periyodu her ayın 25'idir.",
  },

  // ─── Fitrina ───────────────────────────────────────────────────────────────
  {
    slug: "fitrina",
    name: "Fitrina",
    package: "Meta - Basit Yönetim",
    envKey: "FITRINA",

    metaCampaigns: [
      { name: "D3K2 - Site Trafiği",        startDate: "14 Mayıs 2026", endDate: "Devam ediyor", dailyBudget: "800 ₺/gün", status: "Aktif" },
      { name: "Ferrotrin - Site Trafiği",    startDate: "15 Mayıs 2026", endDate: "Devam ediyor", dailyBudget: "400 ₺/gün", status: "Aktif" },
      { name: "Ferrotrin - Bilinirlik",      startDate: "15 Mayıs 2026", endDate: "Devam ediyor", dailyBudget: "200 ₺/gün", status: "Aktif" },
      { name: "Magnezyum - Site Trafiği",    startDate: "16 Mayıs 2026", endDate: "Devam ediyor", dailyBudget: "400 ₺/gün", status: "Aktif" },
      { name: "Magnezyum - Bilinirlik",      startDate: "16 Mayıs 2026", endDate: "Devam ediyor", dailyBudget: "200 ₺/gün", status: "Aktif" },
      { name: "Omega 3 - Site Trafiği",      startDate: "17 Mayıs 2026", endDate: "Devam ediyor", dailyBudget: "500 ₺/gün", status: "Aktif" },
      { name: "Omega 3 - Bilinirlik",        startDate: "17 Mayıs 2026", endDate: "Devam ediyor", dailyBudget: "300 ₺/gün", status: "Aktif" },
    ],

    googleCampaigns: [],
    updates: [],
    contentCalendar: [],

    invoices: [
      { period: "1 Ocak – 1 Şubat 2026",   amount: "10.000 ₺ + KDV", status: "Ödendi" },
      { period: "1 Şubat – 1 Mart 2026",    amount: "10.000 ₺ + KDV", status: "Ödendi" },
      { period: "1 Mart – 1 Nisan 2026",     amount: "10.000 ₺ + KDV", status: "Ödendi" },
      { period: "1 Nisan – 1 Mayıs 2026",   amount: "10.000 ₺ + KDV", status: "Ödendi" },
      { period: "1 Mayıs – 1 Haziran 2026", amount: "10.000 ₺ + KDV", status: "Bekliyor", dueDate: "5 Haziran 2026" },
    ],
    invoiceNote: "Fitrina için ödeme periyodu her ayın 1'idir.",
  },

  // ─── RetroCar ──────────────────────────────────────────────────────────────
  {
    slug: "retrocar",
    name: "RetroCar",
    package: "Meta - Basit Yönetim",
    envKey: "RETROCAR",

    metaCampaigns: [
      { name: "Yeni yerimizde hizmetinizdeyiz",      startDate: "24 Mayıs 2026", endDate: "Devam ediyor", dailyBudget: "150 ₺/gün", status: "Aktif" },
      { name: "Genel Kampanyalar bilinirlik",         startDate: "4 Haziran 2026", endDate: "Devam ediyor", dailyBudget: "100 ₺/gün", status: "Aktif" },
      { name: "Kayıt kamerası kampanyası",            startDate: "4 Haziran 2026", endDate: "Devam ediyor", dailyBudget: "100 ₺/gün", status: "Aktif" },
      { name: "Araç ses yalıtım",                    startDate: "4 Haziran 2026", endDate: "Devam ediyor", dailyBudget: "100 ₺/gün", status: "Aktif" },
    ],

    googleCampaigns: [],
    contentCalendar: [],

    updates: [
      { date: "25 Mayıs 2026", text: "2 yeni hedef kitle oluşturulmuş ve optimize edilmiştir." },
      { date: "26 Mayıs 2026", text: "Remarketing için özel hedef kitle oluşturulmuş ve reklamlarda kullanılmaya başlanmıştır." },
      { date: "4 Haziran 2026", text: "Genel kampanyalar adı altında 8 videomuz bilinirlik reklamı içerisinde kullanılmaya başlandı." },
      { date: "4 Haziran 2026", text: "Kayıt kamerası kampanyası ve araç ses yalıtım kampanyası 100'er TL bütçe ile mesaj kampanyası olarak başlatıldı." },
    ],

    invoices: [
      { period: "25 Mayıs – 25 Haziran 2026", amount: "10.000 ₺", status: "Günü Gelmedi", dueDate: "1 Temmuz 2026" },
    ],
    invoiceNote: "RetroCar için ödeme periyodu her ayın 25'idir.",
  },

  // ─── Sarsılmaz Mobilya ─────────────────────────────────────────────────────
  {
    slug: "sarsilmaz",
    name: "Sarsılmaz Mobilya",
    package: "Başlangıç Paketi",
    envKey: "SARSILMAZ",

    metaCampaigns: [
      { name: "Bahçe takımları toplu kampanya",    startDate: "10 Mart 2026", endDate: "Devam ediyor", dailyBudget: "200 ₺/gün", status: "Ödeme Hatası" },
      { name: "Porselen masa takımları toplu",     startDate: "10 Mart 2026", endDate: "Devam ediyor", dailyBudget: "150 ₺/gün", status: "Ödeme Hatası" },
      { name: "Albatros balkon takımı 1",          startDate: "10 Mart 2026", endDate: "Devam ediyor", dailyBudget: "100 ₺/gün", status: "Ödeme Hatası" },
      { name: "Albatros balkon takımı 2",          startDate: "10 Mart 2026", endDate: "Devam ediyor", dailyBudget: "150 ₺/gün", status: "Ödeme Hatası" },
    ],

    googleCampaigns: [],
    updates: [],

    contentCalendar: [
      { date: "3 Haziran", content: "Dron videosu" },
    ],

    invoices: [
      { period: "20 Mart – 20 Mayıs 2026", amount: "15.000 ₺", status: "Bekliyor", dueDate: "1 Haziran 2026" },
    ],
    invoiceNote: "Sarsılmaz Mobilya için ödeme periyodu her ayın 20'sidir.",
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
