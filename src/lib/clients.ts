/**
 * Müşteri portalı (ClientPortal) veri tipleri.
 * Gerçek veri Prisma'dan gelir (src/lib/clientView.ts), bu dosya sadece tipleri tanımlar.
 */

export type InvoiceStatus = "Ödendi" | "Bekliyor" | "Günü Gelmedi" | "Gecikmede";
export type RequestStatus = "Bekliyor" | "Yapıldı";
export type ReportPlatform = "META" | "GOOGLE" | "WEBSITE";

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
  paid?: boolean;      // Ham durum — toplam ödenen hesabı için (status metni gecikme/vade gösterir)
}

/** Müşteri isteği */
export interface ClientRequest {
  id: string;
  text: string;
  status: RequestStatus;
  createdAt: string;
}

/** Aylık reklam raporu */
export interface AdReportItem {
  id: string;
  platform: ReportPlatform;
  month: string;        // "Temmuz 2026"
  spend?: string;        // "12.500 ₺"
  impressions?: string;  // "45.000"
  clicks?: string;       // "1.200"
  messages?: string;     // "84"
  summary?: string;
  publishedAt: string;
  hasPdf?: boolean;
  pdfFilename?: string;
}

export interface ClientAgendaVisit {
  date: string;  // "Pazartesi, 30 Kasım 2026"
  time: string;  // "10:00" (tüm gün etkinlikte boş)
  title: string;
  note?: string;
}
export interface ClientAgenda {
  upcomingVisits: ClientAgendaVisit[];
  pastVisits: ClientAgendaVisit[];
  openTasks: { title: string; status: "Yapılacak" | "Yapılıyor"; dueDate?: string }[];
  doneTasks: { title: string; completedAt: string }[]; // son 30 gün
  sharedNotes: { title: string; content: string }[];   // admin'in "müşteri görsün" dediği notlar (v3.6.0)
}

export interface ClientData {
  slug: string;
  name: string;
  envKey: string;

  dailyMetaSpend?: string;
  dailyGoogleSpend?: string;

  websiteUpdates?: ClientUpdate[];
  updates?: ClientUpdate[];
  contentCalendar?: { date: string; content: string }[];

  invoices?: Invoice[];
  invoiceNote?: string;

  requests?: ClientRequest[];
  adReports?: AdReportItem[];

  // Ajanda (v3.4.0): admin'in "müşteri görsün" işaretlediği ziyaretler ve işler.
  // Tarihler sunucuda İstanbul saatine göre Türkçe metne çevrilmiş gelir.
  agenda?: ClientAgenda;

  // Aktif bir KIRMIZI bildirim varsa dolu gelir — Raporlar ve İçerik Takvimi
  // sekmeleri kilitlenir (bkz. getClientView).
  notificationLock?: { title: string; body: string } | null;
}
