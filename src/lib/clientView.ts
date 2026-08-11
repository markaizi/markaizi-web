/**
 * DB satırlarını ClientPortal'ın beklediği ClientData şekline dönüştürür.
 * Tarihler Türkçe metne formatlanır; enumlar eski string etiketlere eşlenir.
 * Böylece mevcut portal UI'ı değişmeden DB'den beslenir.
 */
import { prisma } from "@/lib/db";
import { getInvoiceStage, INVOICE_STAGE_LABEL } from "@/lib/invoiceStage";
import type { ClientData, InvoiceStatus, RequestStatus } from "@/lib/clients";
import {
  UpdateKind,
  RequestStatus as DbRequestStatus,
} from "@prisma/client";

const fmtFull = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" });
const fmtShort = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long" });

const trDate = (d: Date | null | undefined) => (d ? fmtFull.format(d) : "");
const trDateShort = (d: Date | null | undefined) => (d ? fmtShort.format(d) : "");

// Fatura durumu artık sabit eşlemeyle değil, vade tarihinden hesaplanır —
// böylece müşteri de "Günü Gelmedi / Bekliyor / Gecikmede" ayrımını doğru görür.

const REQUEST_STATUS: Record<DbRequestStatus, RequestStatus> = {
  BEKLIYOR: "Bekliyor",
  YAPILDI: "Yapıldı",
};

export interface ClientView {
  id: string;
  data: ClientData;
}

/** Slug ile firmayı DB'den çekip portal-şekline dönüştürür (yoksa null). */
export async function getClientView(slug: string): Promise<ClientView | null> {
  const client = await prisma.client.findUnique({
    where: { slug },
    include: {
      updates: { orderBy: { date: "asc" } },
      contentItems: { orderBy: { scheduledDate: "asc" } },
      invoices: { orderBy: { id: "asc" } },
      notes: { orderBy: { createdAt: "desc" } },
      adReports: { orderBy: { publishedAt: "desc" } },
    },
  });
  if (!client) return null;

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
    dailyMetaSpend: client.dailyMetaSpend ?? undefined,
    dailyGoogleSpend: client.dailyGoogleSpend ?? undefined,
    websiteUpdates,
    updates: agencyUpdates,
    contentCalendar: client.contentItems.map((ci) => ({
      date: trDateShort(ci.scheduledDate),
      content: ci.title,
    })),
    invoices: client.invoices.map((inv) => ({
      period: inv.period,
      amount: inv.amount,
      status: INVOICE_STAGE_LABEL[getInvoiceStage(inv)] as InvoiceStatus,
      dueDate: inv.dueDate ? trDate(inv.dueDate) : undefined,
    })),
    invoiceNote: client.invoiceNote ?? undefined,
    requests: client.notes.map((n) => ({
      id: n.id,
      text: n.text,
      status: REQUEST_STATUS[n.status],
      createdAt: n.createdAt.toISOString(),
    })),
    adReports: client.adReports.map((r) => ({
      id: r.id,
      platform: r.platform,
      month: r.month,
      spend: r.spend ?? undefined,
      impressions: r.impressions ?? undefined,
      clicks: r.clicks ?? undefined,
      summary: r.summary ?? undefined,
      publishedAt: r.publishedAt.toISOString(),
    })),
  };

  return { id: client.id, data };
}
