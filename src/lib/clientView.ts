/**
 * DB satırlarını ClientPortal'ın beklediği ClientData şekline dönüştürür.
 * Tarihler Türkçe metne formatlanır; enumlar eski string etiketlere eşlenir.
 * Böylece mevcut portal UI'ı değişmeden DB'den beslenir.
 */
import { prisma } from "@/lib/db";
import type { SessionPayload } from "@/lib/session";
import { getInvoiceStage, INVOICE_STAGE_LABEL, OVERDUE_GRACE_DAYS } from "@/lib/invoiceStage";
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

/** Firmada aktif (silinmemiş) bir KIRMIZI bildirim kilidi var mı? */
export async function hasRedLock(clientId: string): Promise<boolean> {
  const n = await prisma.clientNotification.findFirst({
    where: { clientId, severity: "KIRMIZI" },
    select: { id: true },
  });
  return !!n;
}

/**
 * Slug ile firmayı DB'den çekip portal-şekline dönüştürür (yoksa null).
 *
 * `viewer` verilirse yetki kısıtları VERİ SEVİYESİNDE uygulanır (yalnızca arayüzde gizlemek
 * yetmez; sayfa kaynağı/RSC payload'ından okunabilir):
 * - CLIENT + aktif KIRMIZI kilit → içerik takvimi ve reklam raporları boş döner
 * - EMPLOYEE → atamadaki canView ve canManage bayraklarına göre fatura/içerik/güncelleme boş döner
 */
export async function getClientView(slug: string, viewer?: SessionPayload | null): Promise<ClientView | null> {
  const client = await prisma.client.findUnique({
    where: { slug },
    include: {
      updates: { orderBy: { date: "asc" } },
      contentItems: { orderBy: { scheduledDate: "asc" } },
      invoices: { orderBy: { id: "asc" } },
      notes: { orderBy: { createdAt: "desc" } },
      adReports: {
        orderBy: { publishedAt: "desc" },
        select: {
          id: true, platform: true, month: true, spend: true, impressions: true,
          clicks: true, messages: true, summary: true, publishedAt: true, pdfFilename: true,
        },
      },
    },
  });
  if (!client) return null;

  // Aktif (silinmemiş) bir KIRMIZI bildirim varsa Raporlar ve İçerik Takvimi
  // sekmeleri kilitlenir — kilit yalnızca admin bildirimi silince kalkar,
  // okundu/popup durumundan bağımsızdır.
  const redLock = await prisma.clientNotification.findFirst({
    where: { clientId: client.id, severity: "KIRMIZI" },
    orderBy: { createdAt: "desc" },
    select: { title: true, body: true },
  });

  // Veri seviyesi kısıtlar
  const clientLocked = viewer?.role === "CLIENT" && !!redLock;
  let showInvoices = true;
  let showContent = true;
  let showUpdates = true;
  if (viewer?.role === "EMPLOYEE") {
    const a = await prisma.assignment.findUnique({
      where: { userId_clientId: { userId: viewer.uid, clientId: client.id } },
    });
    showInvoices = !!a?.canViewInvoices;
    showContent = !!a && (a.canViewContent || a.canManageContent);
    showUpdates = !!a && (a.canViewUpdates || a.canManageUpdates);
  }

  const visibleUpdates = showUpdates ? client.updates : [];
  const agencyUpdates = visibleUpdates
    .filter((u) => u.kind === UpdateKind.AJANS)
    .map((u) => ({ date: trDate(u.date), text: u.text }));
  const websiteUpdates = visibleUpdates
    .filter((u) => u.kind === UpdateKind.WEBSITE)
    .map((u) => ({ date: trDate(u.date), text: u.text }));

  const data: ClientData = {
    slug: client.slug,
    name: client.name,
    envKey: "", // portal'da kullanılmıyor
    dailyMetaSpend: showInvoices ? client.dailyMetaSpend ?? undefined : undefined,
    dailyGoogleSpend: showInvoices ? client.dailyGoogleSpend ?? undefined : undefined,
    websiteUpdates,
    updates: agencyUpdates,
    contentCalendar: (showContent && !clientLocked ? client.contentItems : []).map((ci) => ({
      date: trDateShort(ci.scheduledDate),
      content: ci.title,
    })),
    invoices: (showInvoices ? client.invoices : []).map((inv) => ({
      period: inv.period,
      amount: inv.amount,
      status: INVOICE_STAGE_LABEL[getInvoiceStage(inv, new Date(), client.overdueGraceDays ?? OVERDUE_GRACE_DAYS)] as InvoiceStatus,
      dueDate: inv.dueDate ? trDate(inv.dueDate) : undefined,
      paid: inv.status === "ODENDI",
    })),
    invoiceNote: showInvoices ? client.invoiceNote ?? undefined : undefined,
    requests: client.notes.map((n) => ({
      id: n.id,
      text: n.text,
      status: REQUEST_STATUS[n.status],
      createdAt: n.createdAt.toISOString(),
    })),
    adReports: (clientLocked ? [] : client.adReports).map((r) => ({
      id: r.id,
      platform: r.platform,
      month: r.month,
      spend: r.spend ?? undefined,
      impressions: r.impressions ?? undefined,
      clicks: r.clicks ?? undefined,
      messages: r.messages ?? undefined,
      summary: r.summary ?? undefined,
      publishedAt: r.publishedAt.toISOString(),
      hasPdf: !!r.pdfFilename,
      pdfFilename: r.pdfFilename ?? undefined,
    })),
    notificationLock: redLock ? { title: redLock.title, body: redLock.body } : null,
  };

  return { id: client.id, data };
}
