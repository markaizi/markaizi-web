/**
 * Müşteri portalı (ClientPortal) veri tipleri.
 * Gerçek veri Prisma'dan gelir (src/lib/clientView.ts), bu dosya sadece tipleri tanımlar.
 */

export type InvoiceStatus = "Ödendi" | "Bekliyor" | "Günü Gelmedi";
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
  summary?: string;
  publishedAt: string;
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
}
