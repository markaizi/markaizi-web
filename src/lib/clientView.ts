/**
 * DB satırlarını ClientPortal'ın beklediği ClientData şekline dönüştürür.
 * Tarihler Türkçe metne formatlanır; enumlar eski string etiketlere eşlenir.
 * Böylece mevcut portal UI'ı değişmeden DB'den beslenir.
 */
import { prisma } from "@/lib/db";
import type { SessionPayload } from "@/lib/session";
import { INVOICE_STAGE_LABEL } from "@/lib/invoiceStage";
import { listClientPayments } from "@/lib/clientPayments";
import type { ClientData, InvoiceStatus, RequestStatus } from "@/lib/clients";
import {
  UpdateKind,
  RequestStatus as DbRequestStatus,
} from "@prisma/client";

const fmtFull = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" });
const fmtShort = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long" });

// Ajanda tarihleri — sunucu UTC'de çalıştığı için saat dilimi açıkça verilir.
const fmtVisitDay = new Intl.DateTimeFormat("tr-TR", { timeZone: "Europe/Istanbul", weekday: "long", day: "numeric", month: "long", year: "numeric" });
const fmtVisitTime = new Intl.DateTimeFormat("tr-TR", { timeZone: "Europe/Istanbul", hour: "2-digit", minute: "2-digit" });
const fmtVisitDate = new Intl.DateTimeFormat("tr-TR", { timeZone: "Europe/Istanbul", day: "numeric", month: "long", year: "numeric" });

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

  // Ajanda: yalnızca visibleToClient kayıtlar; açıklama (admin notu) hiçbir zaman gönderilmez.
  const now = new Date();
  const [upcomingVisits, pastVisits, openTasks, sharedNotes] = await Promise.all([
    prisma.agendaEvent.findMany({
      where: { clientId: client.id, visibleToClient: true, status: "PLANLI", startAt: { gte: now } },
      orderBy: { startAt: "asc" }, take: 5,
      select: { title: true, startAt: true, allDay: true, clientNote: true },
    }),
    prisma.agendaEvent.findMany({
      where: { clientId: client.id, visibleToClient: true, status: "TAMAMLANDI" },
      orderBy: { startAt: "desc" }, take: 12,
      select: { title: true, startAt: true, allDay: true, clientNote: true },
    }),
    // Açık işler + son 30 günde tamamlananlar — müşteri işlerinin durumunu görsün.
    prisma.agendaTask.findMany({
      where: {
        clientId: client.id, visibleToClient: true, deletedAt: null,
        OR: [{ status: { not: "TAMAMLANDI" } }, { completedAt: { gte: new Date(now.getTime() - 30 * 86_400_000) } }],
      },
      orderBy: [{ status: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
      select: { title: true, status: true, dueAt: true, completedAt: true },
    }),
    // Yalnızca admin'in açıkça "müşteri görsün" dediği notlar (ör. sabit Instagram metni).
    prisma.agendaNote.findMany({
      where: { clientId: client.id, visibleToClient: true, deletedAt: null },
      orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
      select: { title: true, content: true },
    }),
  ]);
  const toVisit = (e: { title: string; startAt: Date; allDay: boolean; clientNote: string | null }) => ({
    date: fmtVisitDay.format(e.startAt),
    time: e.allDay ? "" : fmtVisitTime.format(e.startAt),
    title: e.title,
    note: e.clientNote ?? undefined,
  });

  const payments = showInvoices ? await listClientPayments(client.id, client.overdueGraceDays) : [];

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
    // Kaynak: Kasa'daki müşteri ödemeleri + 1 Ekim 2026 öncesi fatura arşivi (src/lib/clientPayments.ts).
    invoices: (showInvoices ? payments : []).map((p) => ({
      period: p.period,
      amount: p.amount,
      status: INVOICE_STAGE_LABEL[p.stage] as InvoiceStatus,
      dueDate: p.dueDate ? trDate(new Date(`${p.dueDate}T12:00:00Z`)) : undefined,
      paid: p.paid,
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
    agenda: {
      upcomingVisits: upcomingVisits.map(toVisit),
      pastVisits: pastVisits.map(toVisit),
      openTasks: openTasks.filter((t) => t.status !== "TAMAMLANDI").map((t) => ({
        title: t.title,
        status: t.status === "YAPILIYOR" ? "Yapılıyor" as const : "Yapılacak" as const,
        dueDate: t.dueAt ? fmtVisitDate.format(t.dueAt) : undefined,
      })),
      sharedNotes,
      doneTasks: openTasks.filter((t) => t.status === "TAMAMLANDI").map((t) => ({
        title: t.title,
        completedAt: t.completedAt ? fmtVisitDate.format(t.completedAt) : "",
      })),
    },
    notificationLock: redLock ? { title: redLock.title, body: redLock.body } : null,
  };

  return { id: client.id, data };
}
