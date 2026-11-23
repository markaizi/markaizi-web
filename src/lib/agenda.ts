/**
 * Ajanda + Kasa servis katmanı (v3.4.0).
 *
 * Tüm yazma işlemleri buradan geçer: admin panelinin API uçları ve 3. aşamadaki
 * Telegram + Claude botunun /api/agent/* uçları AYNI fonksiyonları kullanır. Böylece
 * "ziyaret tamamlanınca firmanın son ziyaret tarihi güncellenir", "aylık düzenli ödeme
 * ödenince sonraki ayın kaydı açılır" gibi kurallar tek yerde kalır.
 *
 * Kasa yalnızca ADMIN'e aittir — bu modülü çağıran her uç requireAdmin (veya bot
 * token'ı) ile korunmalıdır.
 */
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { DEBT_CATEGORIES, type KasaCalcCardTx, type KasaCalcEntry } from "@/lib/kasaCalc";

export const TZ = "Europe/Istanbul";

// db.ts genişletilmiş (retry) client döndürüyor — transaction içi client tipi ondan türetilir.
type Tx = Omit<typeof prisma, "$extends" | "$transaction" | "$disconnect" | "$connect" | "$on">;

// ── Ortak şemalar ───────────────────────────────────────────
const isoDate = z.string().refine((v) => !isNaN(new Date(v).getTime()), { message: "Geçersiz tarih." });
const optText = (max: number) => z.string().trim().max(max).nullable().optional();
const clientId = z.string().trim().min(1).max(60).nullable().optional();

export const eventInput = z.object({
  title: z.string().trim().min(1, "Başlık gerekli.").max(200),
  description: optText(2000),
  clientNote: optText(500),
  startAt: isoDate,
  endAt: isoDate.nullable().optional(),
  allDay: z.boolean().optional(),
  locationName: optText(200),
  locationAddress: optText(500),
  status: z.enum(["PLANLI", "TAMAMLANDI", "IPTAL"]).optional(),
  visibleToClient: z.boolean().optional(),
  clientId,
});
export const eventPatch = eventInput.partial();

export const taskInput = z.object({
  title: z.string().trim().min(1, "Başlık gerekli.").max(300),
  description: optText(4000),
  priority: z.enum(["DUSUK", "ORTA", "YUKSEK", "ACIL"]).optional(),
  status: z.enum(["YAPILACAK", "YAPILIYOR", "TAMAMLANDI"]).optional(),
  dueAt: isoDate.nullable().optional(),
  visibleToClient: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  clientId,
});
export const taskPatch = taskInput.partial();

export const noteInput = z.object({
  kind: z.enum(["NOT", "HAFIZA"]).optional(),
  title: z.string().trim().min(1, "Başlık gerekli.").max(300),
  content: z.string().trim().min(1, "İçerik gerekli.").max(20000),
  category: optText(60),
  tags: z.array(z.string().trim().max(40)).max(20).optional(),
  pinned: z.boolean().optional(),
  visibleToClient: z.boolean().optional(), // müşteri panelinde gösterilsin mi (v3.6.0)
  clientId,
});
export const notePatch = noteInput.partial();

// "42.500", "42500,50", "42.500 ₺" ve sayı kabul edilir; rakam içermeyen ya da 0/negatif tutar reddedilir.
const amount = z.union([z.number(), z.string()]).transform((v, ctx) => {
  let n = NaN;
  if (typeof v === "number") n = v;
  else if (/\d/.test(v)) n = Number(v.replace(/[^\d,.-]/g, "").replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", "."));
  if (!isFinite(n) || n <= 0) { ctx.addIssue({ code: "custom", message: "Geçersiz tutar." }); return z.NEVER; }
  return Math.round(n * 100) / 100;
});

export const kasaInput = z.object({
  title: z.string().trim().min(1, "Başlık gerekli.").max(200),
  amount,
  direction: z.enum(["GELIR", "GIDER", "BORC", "ALACAK"]),
  category: z.string().trim().min(1).max(60).optional(),
  status: z.enum(["BEKLIYOR", "ODENDI"]).optional(),
  dueDate: isoDate,
  isRecurring: z.boolean().optional(),
  notes: optText(2000),
  clientId,
  employeeId: z.string().trim().min(1).max(60).nullable().optional(), // maaş / avans → çalışan
  paidAt: isoDate.nullable().optional(), // ödeme / tahsilat tarihi — verilmezse "şimdi" (v3.10.0)
});
export const kasaPatch = kasaInput.partial();

export const cardTxInput = z.object({
  entryId: z.string().min(1),
  title: z.string().trim().min(1).max(200),
  amount,
  category: z.string().trim().max(60).optional(),
  transactionDate: isoDate.optional(),
  notes: optText(1000),
});

// ── Yardımcılar ─────────────────────────────────────────────
const toDate = (v: string | null | undefined) => (v === undefined ? undefined : v === null ? null : new Date(v));

export function daysSince(d: Date | null, now = new Date()): number | null {
  if (!d) return null;
  return Math.floor((now.getTime() - d.getTime()) / 86_400_000);
}

/**
 * Firmanın son ziyaret tarihini takvimden yeniden hesaplar: en son TAMAMLANDI ziyaret (bugüne kadar).
 * "Gidildi" → "Geri al" veya ziyaret silme durumunda tarih eski hâline döner (v3.10.0).
 */
async function syncLastVisit(tx: Tx, cid: string | null | undefined) {
  if (!cid) return;
  const last = await tx.agendaEvent.findFirst({
    where: { clientId: cid, status: "TAMAMLANDI", startAt: { lte: new Date() } },
    orderBy: { startAt: "desc" },
    select: { startAt: true },
  });
  await tx.client.update({ where: { id: cid }, data: { lastVisitAt: last?.startAt ?? null } });
}

// ── Etkinlik / ziyaret ──────────────────────────────────────
export async function createEvent(raw: unknown) {
  const d = eventInput.parse(raw);
  const startAt = new Date(d.startAt);
  // Varsayılan ziyaret süresi 150 dk (Mİ Asistan kuralı).
  const endAt = d.endAt ? new Date(d.endAt) : d.allDay ? null : new Date(startAt.getTime() + 150 * 60_000);
  return prisma.$transaction(async (tx) => {
    const ev = await tx.agendaEvent.create({
      data: {
        title: d.title, description: d.description ?? null, clientNote: d.clientNote ?? null,
        startAt, endAt, allDay: d.allDay ?? false,
        locationName: d.locationName ?? null, locationAddress: d.locationAddress ?? null,
        status: d.status ?? "PLANLI", visibleToClient: d.visibleToClient ?? true, clientId: d.clientId ?? null,
      },
    });
    if (ev.status === "TAMAMLANDI") await syncLastVisit(tx, ev.clientId);
    return ev;
  });
}

export async function updateEvent(id: string, raw: unknown) {
  const d = eventPatch.parse(raw);
  return prisma.$transaction(async (tx) => {
    const before = await tx.agendaEvent.findUniqueOrThrow({ where: { id }, select: { clientId: true } });
    const ev = await tx.agendaEvent.update({
      where: { id },
      data: {
        ...d,
        startAt: d.startAt ? new Date(d.startAt) : undefined,
        endAt: toDate(d.endAt),
      },
    });
    // Durum, tarih veya firma değişmiş olabilir → ilgili firma(lar)ın son ziyareti takvimden yeniden hesaplanır.
    await syncLastVisit(tx, ev.clientId);
    if (before.clientId !== ev.clientId) await syncLastVisit(tx, before.clientId);
    return ev;
  });
}

export async function deleteEvent(id: string) {
  return prisma.$transaction(async (tx) => {
    const ev = await tx.agendaEvent.delete({ where: { id } });
    await syncLastVisit(tx, ev.clientId);
    return ev;
  });
}

// ── İşler ───────────────────────────────────────────────────
export async function createTask(raw: unknown) {
  const d = taskInput.parse(raw);
  const status = d.status ?? "YAPILACAK";
  return prisma.agendaTask.create({
    data: {
      title: d.title, description: d.description ?? null, priority: d.priority ?? "ORTA", status,
      dueAt: toDate(d.dueAt) ?? null, visibleToClient: d.visibleToClient ?? true, sortOrder: d.sortOrder ?? 0,
      clientId: d.clientId ?? null, completedAt: status === "TAMAMLANDI" ? new Date() : null,
    },
  });
}

export async function updateTask(id: string, raw: unknown) {
  const d = taskPatch.parse(raw);
  const completedAt = d.status === undefined ? undefined : d.status === "TAMAMLANDI" ? new Date() : null;
  return prisma.agendaTask.update({ where: { id }, data: { ...d, dueAt: toDate(d.dueAt), completedAt } });
}

/** Çöp kutusuna taşır — geri alınabilir. */
export const trashTask = (id: string) => prisma.agendaTask.update({ where: { id }, data: { deletedAt: new Date() } });
export const restoreTask = (id: string) => prisma.agendaTask.update({ where: { id }, data: { deletedAt: null } });

// ── Notlar / hafıza ─────────────────────────────────────────
export async function createNote(raw: unknown) {
  const d = noteInput.parse(raw);
  return prisma.agendaNote.create({
    data: {
      kind: d.kind ?? "NOT", title: d.title, content: d.content, category: d.category ?? null,
      tags: d.tags ?? [], pinned: d.pinned ?? false, clientId: d.clientId ?? null,
      visibleToClient: !!d.clientId && (d.visibleToClient ?? false),
    },
  });
}
export const updateNote = (id: string, raw: unknown) => prisma.agendaNote.update({ where: { id }, data: notePatch.parse(raw) });
export const trashNote = (id: string) => prisma.agendaNote.update({ where: { id }, data: { deletedAt: new Date() } });
export const restoreNote = (id: string) => prisma.agendaNote.update({ where: { id }, data: { deletedAt: null } });

// ── Kasa ────────────────────────────────────────────────────
function addMonths(d: Date, n: number): Date {
  const r = new Date(d);
  const day = r.getUTCDate();
  r.setUTCDate(1);
  r.setUTCMonth(r.getUTCMonth() + n);
  const last = new Date(Date.UTC(r.getUTCFullYear(), r.getUTCMonth() + 1, 0)).getUTCDate();
  r.setUTCDate(Math.min(day, last));
  return r;
}

/**
 * Aylık düzenli kayıt ödendiyse sonraki ayın kaydını (yoksa) açar.
 * Gün kayması olmasın diye (30'undaki kira Şubat'ta 28'e düşüp orada kalmasın) hedef gün, aynı başlıklı
 * kayıtların en büyük gününden alınır; kısa ayda ayın son gününe sığdırılır.
 */
async function ensureNextRecurring(tx: Tx, e: { id: string; title: string; amount: Prisma.Decimal; direction: "GELIR" | "GIDER" | "BORC" | "ALACAK"; category: string; dueDate: Date; isRecurring: boolean; recurrencePeriod: string; remindDaysBefore: number; notes: string | null; clientId: string | null; employeeId: string | null }) {
  if (!e.isRecurring || e.recurrencePeriod !== "monthly") return;
  const siblings = await tx.kasaEntry.findMany({
    where: { title: e.title, direction: e.direction, isRecurring: true },
    orderBy: { dueDate: "desc" }, take: 12, select: { dueDate: true },
  });
  const anchorDay = Math.max(e.dueDate.getUTCDate(), ...siblings.map((x) => x.dueDate.getUTCDate()));
  const nextDue = addMonths(e.dueDate, 1);
  const lastDay = new Date(Date.UTC(nextDue.getUTCFullYear(), nextDue.getUTCMonth() + 1, 0)).getUTCDate();
  nextDue.setUTCDate(Math.min(anchorDay, lastDay));
  const exists = await tx.kasaEntry.findFirst({
    // ±5 gün pencere; çöp kutusundakiler dahil (silinen sonraki ay kaydı geri gelmesin).
    where: {
      title: e.title, direction: e.direction,
      dueDate: { gte: new Date(nextDue.getTime() - 5 * 86_400_000), lte: new Date(nextDue.getTime() + 5 * 86_400_000) },
    },
    select: { id: true },
  });
  if (exists) return;
  await tx.kasaEntry.create({
    data: {
      title: e.title, amount: e.amount, direction: e.direction, category: e.category, dueDate: nextDue,
      isRecurring: true, recurrencePeriod: "monthly", remindDaysBefore: e.remindDaysBefore, notes: e.notes, clientId: e.clientId,
      employeeId: e.employeeId,
    },
  });
}

export async function createKasaEntry(raw: unknown) {
  const d = kasaInput.parse(raw);
  const status = d.status ?? (d.direction === "GELIR" ? "ODENDI" : "BEKLIYOR");
  return prisma.$transaction(async (tx) => {
    const e = await tx.kasaEntry.create({
      data: {
        title: d.title, amount: new Prisma.Decimal(d.amount), direction: d.direction, category: d.category ?? "genel",
        status, paidAt: status === "ODENDI" ? (d.paidAt ? new Date(d.paidAt) : new Date()) : null, dueDate: new Date(d.dueDate),
        isRecurring: d.isRecurring ?? false, recurrencePeriod: d.isRecurring ? "monthly" : "none",
        notes: d.notes ?? null, clientId: d.clientId ?? null, employeeId: d.employeeId ?? null,
      },
    });
    if (status === "ODENDI") await ensureNextRecurring(tx, e);
    return e;
  });
}

export async function updateKasaEntry(id: string, raw: unknown) {
  const d = kasaPatch.parse(raw);
  return prisma.$transaction(async (tx) => {
    const before = await tx.kasaEntry.findUniqueOrThrow({ where: { id }, select: { status: true } });
    const becamePaid = d.status === "ODENDI" && before.status !== "ODENDI";
    const e = await tx.kasaEntry.update({
      where: { id },
      data: {
        ...d,
        amount: d.amount === undefined ? undefined : new Prisma.Decimal(d.amount),
        dueDate: d.dueDate ? new Date(d.dueDate) : undefined,
        recurrencePeriod: d.isRecurring === undefined ? undefined : d.isRecurring ? "monthly" : "none",
        // Ödeme tarihi: açıkça verildiyse o; yeni ödendiyse şimdi; ödenmedi'ye dönerse temizlenir.
        paidAt: d.status === "BEKLIYOR" ? null
          : d.paidAt ? new Date(d.paidAt)
          : becamePaid ? new Date() : undefined,
      },
    });
    if (becamePaid) await ensureNextRecurring(tx, e);
    return e;
  });
}

export const trashKasaEntry = (id: string) => prisma.kasaEntry.update({ where: { id }, data: { deletedAt: new Date() } });
export const restoreKasaEntry = (id: string) => prisma.kasaEntry.update({ where: { id }, data: { deletedAt: null } });

/** Kart / ek hesap borcu mu? Harcama ekleme ve "ödeme yap" yalnızca bu kayıtlarda geçerlidir. */
async function requireDebtCard(tx: Tx, id: string) {
  const e = await tx.kasaEntry.findUniqueOrThrow({ where: { id } });
  if (!DEBT_CATEGORIES.includes(e.category) || e.deletedAt) throw new AgendaRuleError("Bu kayıt bir kart / hesap borcu değil.");
  return e;
}

/** İş kuralı ihlali — API'de 400 olarak kullanıcıya gösterilir. */
export class AgendaRuleError extends Error {}

/**
 * Kart/ek hesap harcaması: bağlı borç kaydının tutarını artırır (kasadaki nakitten düşmez).
 * Mİ Asistan'daki add_card_expense(paymentMethod='credit_card') ile aynı davranış.
 */
export async function addCardTransaction(raw: unknown) {
  const d = cardTxInput.parse(raw);
  return prisma.$transaction(async (tx) => {
    const entry = await requireDebtCard(tx, d.entryId);
    const t = await tx.kasaCardTransaction.create({
      data: {
        entryId: entry.id, title: d.title, amount: new Prisma.Decimal(d.amount), category: d.category ?? "alisveris",
        transactionDate: d.transactionDate ? new Date(d.transactionDate) : new Date(), notes: d.notes ?? null,
      },
    });
    await tx.kasaEntry.update({ where: { id: entry.id }, data: { amount: entry.amount.add(d.amount), status: "BEKLIYOR", paidAt: null } });
    return t;
  });
}

const cardTxPatch = cardTxInput.partial();

/** Kart harcamasını düzeltir: tutar değişirse kart bakiyesi fark kadar, kart değişirse (taşıma) iki kart birden güncellenir. */
export async function updateCardTransaction(id: string, raw: unknown) {
  const d = cardTxPatch.parse(raw);
  return prisma.$transaction(async (tx) => {
    const t = await tx.kasaCardTransaction.findUniqueOrThrow({ where: { id } });
    if (t.deletedAt) throw new AgendaRuleError("Silinmiş harcama düzenlenemez.");
    const newAmount = d.amount === undefined ? t.amount : new Prisma.Decimal(d.amount);
    const newEntryId = d.entryId ?? t.entryId;
    if (newEntryId !== t.entryId) {
      const from = await requireDebtCard(tx, t.entryId);
      const to = await requireDebtCard(tx, newEntryId);
      await tx.kasaEntry.update({ where: { id: from.id }, data: { amount: Prisma.Decimal.max(from.amount.sub(t.amount), 0) } });
      await tx.kasaEntry.update({ where: { id: to.id }, data: { amount: to.amount.add(newAmount), status: "BEKLIYOR", paidAt: null } });
    } else if (!newAmount.equals(t.amount)) {
      const card = await requireDebtCard(tx, t.entryId);
      await tx.kasaEntry.update({ where: { id: card.id }, data: { amount: Prisma.Decimal.max(card.amount.add(newAmount).sub(t.amount), 0) } });
    }
    return tx.kasaCardTransaction.update({
      where: { id },
      data: {
        entryId: newEntryId, amount: newAmount, title: d.title, category: d.category,
        transactionDate: d.transactionDate ? new Date(d.transactionDate) : undefined,
      },
    });
  });
}

/** Kart harcamasını çöp kutusuna taşır ve kart bakiyesinden düşer. */
export async function trashCardTransaction(id: string) {
  return prisma.$transaction(async (tx) => {
    const t = await tx.kasaCardTransaction.findUniqueOrThrow({ where: { id } });
    if (t.deletedAt) return t;
    const card = await tx.kasaEntry.findUniqueOrThrow({ where: { id: t.entryId } });
    await tx.kasaEntry.update({ where: { id: card.id }, data: { amount: Prisma.Decimal.max(card.amount.sub(t.amount), 0) } });
    return tx.kasaCardTransaction.update({ where: { id }, data: { deletedAt: new Date() } });
  });
}

export async function restoreCardTransaction(id: string) {
  return prisma.$transaction(async (tx) => {
    const t = await tx.kasaCardTransaction.findUniqueOrThrow({ where: { id } });
    if (!t.deletedAt) return t;
    const card = await requireDebtCard(tx, t.entryId);
    await tx.kasaEntry.update({ where: { id: card.id }, data: { amount: card.amount.add(t.amount), status: "BEKLIYOR", paidAt: null } });
    return tx.kasaCardTransaction.update({ where: { id }, data: { deletedAt: null } });
  });
}

/**
 * Kart/hesap borcuna ödeme: borç bakiyesini düşer, kasadan çıkan ödemeyi ayrı bir ODENDI BORC kaydı olarak
 * yazar (Mİ Asistan'daki pay_debt ile aynı). Kart kaydı bakiye 0 olsa da BEKLIYOR kalır — kart listeden
 * kaybolmasın, yeni harcama eklenebilsin (v3.10.0). Borçtan fazla ödeme reddedilir.
 */
export async function payDebt(entryId: string, rawAmount: unknown) {
  const amt = amount.parse(rawAmount);
  return prisma.$transaction(async (tx) => {
    const e = await requireDebtCard(tx, entryId);
    if (e.amount.lessThan(amt)) throw new AgendaRuleError(`Ödeme borçtan fazla olamaz (güncel borç ${e.amount.toFixed(2)} ₺).`);
    const remaining = e.amount.sub(amt);
    await tx.kasaEntry.update({ where: { id: e.id }, data: { amount: remaining, status: "BEKLIYOR", paidAt: null } });
    return tx.kasaEntry.create({
      data: {
        title: `${e.title} ödemesi`, amount: new Prisma.Decimal(amt), direction: "BORC", category: "borc_odemesi",
        status: "ODENDI", paidAt: new Date(), dueDate: new Date(), notes: `Kalan borç: ${remaining.toFixed(2)} TL`,
      },
    });
  });
}

const installmentInput = z.object({
  title: z.string().trim().min(1, "Başlık gerekli.").max(160),
  amount, // taksit tutarı
  count: z.number().int().min(2, "En az 2 taksit.").max(60),
  firstDueDate: isoDate,
  category: z.string().trim().min(1).max(60).optional(),
  clientId,
});
const TR_MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

/** Taksit planı: "Başlık (i/N - Ay)" biçiminde N adet aylık BORC kaydı — Borçlarım'da tek satır olarak gruplanır. */
export async function createInstallmentPlan(raw: unknown) {
  const d = installmentInput.parse(raw);
  const first = new Date(d.firstDueDate);
  const day = first.getUTCDate();
  return prisma.$transaction(async (tx) => {
    const rows = [];
    for (let i = 0; i < d.count; i++) {
      const due = addMonths(first, i);
      const last = new Date(Date.UTC(due.getUTCFullYear(), due.getUTCMonth() + 1, 0)).getUTCDate();
      due.setUTCDate(Math.min(day, last));
      rows.push(await tx.kasaEntry.create({
        data: {
          title: `${d.title} (${i + 1}/${d.count} - ${TR_MONTHS[due.getUTCMonth()]})`, amount: new Prisma.Decimal(d.amount),
          direction: "BORC", category: d.category ?? "Taksit", status: "BEKLIYOR", dueDate: due, clientId: d.clientId ?? null,
        },
      }));
    }
    return rows;
  });
}

export { DEBT_CATEGORIES };

/**
 * Kasa hesaplarının girdisi: silinmemiş tüm kayıtlar + kart harcamaları (kayıt sayısı küçük).
 * Hesaplar `computeKasa` (src/lib/kasaCalc.ts) ile yapılır — panel ve bot aynı sonucu görür.
 */
export async function loadKasaData(): Promise<{ entries: KasaCalcEntry[]; cardTxs: KasaCalcCardTx[] }> {
  const [entries, txs] = await Promise.all([
    prisma.kasaEntry.findMany({ where: { deletedAt: null }, orderBy: { dueDate: "asc" }, include: { client: { select: { name: true, slug: true } } } }),
    prisma.kasaCardTransaction.findMany({
      where: { deletedAt: null, entry: { deletedAt: null } },
      orderBy: { transactionDate: "desc" },
      include: { entry: { select: { title: true } } },
    }),
  ]);
  return {
    entries: entries.map((e) => ({
      id: e.id, title: e.title, amount: Number(e.amount), direction: e.direction, category: e.category, status: e.status,
      dueDate: e.dueDate.toISOString(), paidAt: e.paidAt?.toISOString() ?? null, isRecurring: e.isRecurring,
      clientId: e.clientId, clientName: e.client?.name ?? null, clientSlug: e.client?.slug ?? null, employeeId: e.employeeId,
      // Kasa öncesi geçmiş tahsilat: eski faturalardan ("invoice:") veya elle bildirilen geçmiş aylardan ("gecmis:").
      historical: !!e.legacyId && (e.legacyId.startsWith("invoice:") || e.legacyId.startsWith("gecmis:")),
    })),
    cardTxs: txs.map((t) => ({
      id: t.id, entryId: t.entryId, entryTitle: t.entry.title, title: t.title, amount: Number(t.amount),
      category: t.category, transactionDate: t.transactionDate.toISOString(),
    })),
  };
}

/** Ziyaret takibi listesi: aktif firmalar, son ziyaretten bu yana geçen güne göre. */
export async function getVisitTracking(now = new Date()) {
  const clients = await prisma.client.findMany({
    where: { active: true, visitTrackingActive: true },
    select: {
      id: true, slug: true, name: true, region: true, lastVisitAt: true, visitIntervalDays: true,
      agendaEvents: { where: { status: "PLANLI", startAt: { gte: now } }, orderBy: { startAt: "asc" }, take: 1, select: { startAt: true } },
    },
  });
  return clients
    .map((c) => {
      const days = daysSince(c.lastVisitAt, now);
      return {
        id: c.id, slug: c.slug, name: c.name, region: c.region,
        lastVisitAt: c.lastVisitAt?.toISOString() ?? null,
        daysSince: days,
        interval: c.visitIntervalDays,
        overdue: days === null || days >= c.visitIntervalDays,
        nextVisitAt: c.agendaEvents[0]?.startAt.toISOString() ?? null,
      };
    })
    .sort((a, b) => (b.daysSince ?? 9999) - (a.daysSince ?? 9999));
}
