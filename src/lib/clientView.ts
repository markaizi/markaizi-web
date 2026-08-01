/**
 * DB satırlarını ClientPortal'ın beklediği ClientData şekline dönüştürür.
 * Tarihler Türkçe metne formatlanır; enumlar eski string etiketlere eşlenir.
 * Böylece mevcut portal UI'ı değişmeden DB'den beslenir.
 */
import { prisma } from "@/lib/db";
import type {
  ClientData,
  Campaign,
  CampaignStatus,
  InvoiceStatus,
} from "@/lib/clients";
import {
  Platform,
  UpdateKind,
  CampaignStatus as DbCampaignStatus,
  InvoiceStatus as DbInvoiceStatus,
} from "@prisma/client";

const fmtFull = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" });
const fmtShort = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long" });

const trDate = (d: Date | null | undefined) => (d ? fmtFull.format(d) : "");
const trDateShort = (d: Date | null | undefined) => (d ? fmtShort.format(d) : "");

const CAMPAIGN_STATUS: Record<DbCampaignStatus, CampaignStatus> = {
  AKTIF: "Aktif",
  DURAKLATILDI: "Duraklatıldı",
  TAMAMLANDI: "Tamamlandı",
  ODEME_HATASI: "Ödeme Hatası",
};

const INVOICE_STATUS: Record<DbInvoiceStatus, InvoiceStatus> = {
  ODENDI: "Ödendi",
  BEKLIYOR: "Bekliyor",
  GUNU_GELMEDI: "Günü Gelmedi",
};

type CampaignRow = {
  name: string;
  startDate: Date | null;
  endDate: Date | null;
  ongoing: boolean;
  dailyBudget: string;
  status: DbCampaignStatus;
};

function toCampaign(c: CampaignRow): Campaign {
  return {
    name: c.name,
    startDate: trDate(c.startDate),
    endDate: c.ongoing ? "Devam ediyor" : trDate(c.endDate),
    dailyBudget: c.dailyBudget,
    status: CAMPAIGN_STATUS[c.status],
  };
}

export interface ClientView {
  id: string;
  data: ClientData;
}

/** Slug ile firmayı DB'den çekip portal-şekline dönüştürür (yoksa null). */
export async function getClientView(slug: string): Promise<ClientView | null> {
  const client = await prisma.client.findUnique({
    where: { slug },
    include: {
      campaigns: { orderBy: { sortOrder: "asc" } },
      updates: { orderBy: { date: "asc" } },
      contentItems: { orderBy: { scheduledDate: "asc" } },
      invoices: { orderBy: { id: "asc" } },
    },
  });
  if (!client) return null;

  const meta = client.campaigns.filter((c) => c.platform === Platform.META).map(toCampaign);
  const google = client.campaigns.filter((c) => c.platform === Platform.GOOGLE).map(toCampaign);
  const tiktok = client.campaigns.filter((c) => c.platform === Platform.TIKTOK).map(toCampaign);

  const agencyUpdates = client.updates
    .filter((u) => u.kind === UpdateKind.AJANS)
    .map((u) => ({ date: trDate(u.date), text: u.text }));
  const websiteUpdates = client.updates
    .filter((u) => u.kind === UpdateKind.WEBSITE)
    .map((u) => ({ date: trDate(u.date), text: u.text }));

  const data: ClientData = {
    slug: client.slug,
    name: client.name,
    envKey: "", // portal'da kullanılmıyor
    metaCampaigns: meta,
    googleCampaigns: google,
    tiktokCampaigns: tiktok,
    websiteUpdates,
    updates: agencyUpdates,
    contentCalendar: client.contentItems.map((ci) => ({
      date: trDateShort(ci.scheduledDate),
      content: ci.title,
    })),
    invoices: client.invoices.map((inv) => ({
      period: inv.period,
      amount: inv.amount,
      status: INVOICE_STATUS[inv.status],
      dueDate: inv.dueDate ? trDate(inv.dueDate) : undefined,
    })),
    invoiceNote: client.invoiceNote ?? undefined,
  };

  return { id: client.id, data };
}
