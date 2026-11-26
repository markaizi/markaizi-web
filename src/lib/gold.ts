/**
 * Altın (gram) cinsinden borç servisi (v3.18.0) — panel API'si, bot ve otomatik kural aynı fonksiyonları kullanır.
 *
 * Borç gram olarak tutulur. Ödeme üç şekilde girilebilir:
 *   1) doğrudan gram,  2) TL + gram fiyatı (gram = TL ÷ fiyat),  3) yalnızca TL → güncel gram altın kuru servisten alınır.
 * Otomatik kural: borçta `autoMatch` + `autoShare` tanımlıysa, başlığı eşleşen bir kasa gideri ÖDENDİ olduğunda
 * tutarın payı güncel kurla grama çevrilip düşülür. Kur alınamazsa ödeme "kur bekliyor" olarak yine de yazılır —
 * hiçbir ödeme sessizce kaybolmaz; kur girilince hesaplanır.
 *
 * Bu dosya agenda.ts'i içe aktarmaz (agenda.ts bunu içe aktarır).
 */
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { audit } from "@/lib/audit";
import { AgendaRuleError, amount, parseTrNumber } from "@/lib/agendaShared";
import { gramsFor, goldSummary, normTitle, round2, type GoldDebtView } from "@/lib/goldCalc";

// ── Gram altın kuru ─────────────────────────────────────────
const PRICE_URL = "https://finans.truncgil.com/v4/today.json";

export interface GoldPrice { price: number; buying: number | null; updatedAt: string | null; source: string }

/**
 * Güncel gram altın (has, TL) — satış fiyatı: TL'yi altına çevirirken altın bu fiyattan alınır.
 * Dış servise bağlıdır; ulaşılamazsa hata fırlatır (çağıran taraf elle kur ister ya da ödemeyi "kur bekliyor" yazar).
 */
export async function fetchGramGoldPrice(): Promise<GoldPrice> {
  const res = await fetch(PRICE_URL, { signal: AbortSignal.timeout(8000), cache: "no-store", headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`kur servisi HTTP ${res.status}`);
  const json = (await res.json()) as { Update_Date?: string; GRA?: { Selling?: unknown; Buying?: unknown } };
  const price = parseTrNumber(json.GRA?.Selling as never);
  // Akıl dışı değer (servis biçim değiştirirse) borca yazılmasın.
  if (!isFinite(price) || price < 500 || price > 1_000_000) throw new Error("kur servisi beklenmeyen değer döndürdü");
  const buying = parseTrNumber(json.GRA?.Buying as never);
  return { price: round2(price), buying: isFinite(buying) ? round2(buying) : null, updatedAt: json.Update_Date ?? null, source: "truncgil" };
}

// ── Şemalar ─────────────────────────────────────────────────
const isoDate = z.string().refine((v) => !isNaN(new Date(v).getTime()), { message: "Geçersiz tarih." });
const optAmount = z.union([z.number(), z.string(), z.null()]).optional().transform((v, ctx) => {
  if (v === undefined || v === null || v === "") return undefined;
  const n = parseTrNumber(v);
  if (!isFinite(n) || n <= 0) { ctx.addIssue({ code: "custom", message: "Geçersiz sayı." }); return z.NEVER; }
  return Math.round(n * 100) / 100;
});
const share = z.union([z.number(), z.string(), z.null()]).optional().transform((v, ctx) => {
  if (v === undefined || v === null || v === "") return null;
  let n = parseTrNumber(v);
  if (n > 1) n = n / 100; // "50" → %50
  if (!isFinite(n) || n <= 0 || n > 1) { ctx.addIssue({ code: "custom", message: "Oran %1–%100 arasında olmalı." }); return z.NEVER; }
  return Math.round(n * 10000) / 10000;
});

const debtInput = z.object({
  title: z.string().trim().min(1, "Borç adı gerekli.").max(120),
  totalGrams: amount, // gr
  notes: z.string().trim().max(2000).nullable().optional(),
  autoMatch: z.string().trim().max(120).nullable().optional(),
  autoShare: share,
});
const debtPatch = debtInput.partial();

const paymentInput = z.object({
  debtId: z.string().min(1),
  paidAt: isoDate.optional(),
  grams: optAmount,
  tlAmount: optAmount,
  gramPrice: optAmount,
  note: z.string().trim().max(500).nullable().optional(),
});
const paymentPatch = paymentInput.omit({ debtId: true });

const dec = (n: number | null | undefined) => (n === null || n === undefined ? null : new Prisma.Decimal(n));
const num = (d: Prisma.Decimal | null) => (d === null ? null : Number(d));

// ── Okuma ───────────────────────────────────────────────────
export async function loadGoldDebts(): Promise<GoldDebtView[]> {
  const rows = await prisma.goldDebt.findMany({
    where: { deletedAt: null }, orderBy: { createdAt: "asc" },
    include: { payments: { where: { deletedAt: null }, orderBy: { paidAt: "asc" } } },
  });
  return rows.map((d) => ({
    id: d.id, title: d.title, totalGrams: Number(d.totalGrams), notes: d.notes, autoMatch: d.autoMatch, autoShare: num(d.autoShare),
    payments: d.payments.map((p) => ({
      id: p.id, paidAt: p.paidAt.toISOString(), grams: num(p.grams), tlAmount: num(p.tlAmount), gramPrice: num(p.gramPrice),
      priceSource: p.priceSource, note: p.note, auto: !!p.sourceEntryId,
    })),
  }));
}

// ── Borç ────────────────────────────────────────────────────
export async function createGoldDebt(raw: unknown) {
  const d = debtInput.parse(raw);
  const same = await prisma.goldDebt.findFirst({ where: { deletedAt: null, title: { equals: d.title, mode: "insensitive" } } });
  if (same) throw new AgendaRuleError(`"${same.title}" adında bir altın borcu zaten var.`);
  if (!!d.autoMatch !== !!d.autoShare) throw new AgendaRuleError("Otomatik kural için hem bağlı gider başlığı hem oran gerekli.");
  return prisma.goldDebt.create({
    data: { title: d.title, totalGrams: dec(d.totalGrams)!, notes: d.notes || null, autoMatch: d.autoMatch || null, autoShare: d.autoMatch ? dec(d.autoShare) : null },
  });
}

export async function updateGoldDebt(id: string, raw: unknown) {
  const d = debtPatch.parse(raw);
  const before = await prisma.goldDebt.findUniqueOrThrow({ where: { id } });
  const autoMatch = d.autoMatch === undefined ? before.autoMatch : d.autoMatch || null;
  const autoShare = d.autoShare === undefined || !("autoShare" in (raw as object)) ? before.autoShare : dec(d.autoShare);
  if (!!autoMatch !== !!autoShare) throw new AgendaRuleError("Otomatik kural için hem bağlı gider başlığı hem oran gerekli (kuralı kaldırmak için ikisini de boşalt).");
  return prisma.goldDebt.update({
    where: { id },
    data: {
      title: d.title, totalGrams: d.totalGrams === undefined ? undefined : dec(d.totalGrams)!,
      notes: d.notes === undefined ? undefined : d.notes || null, autoMatch, autoShare,
    },
  });
}

export const trashGoldDebt = (id: string) => prisma.goldDebt.update({ where: { id }, data: { deletedAt: new Date() } });
export const restoreGoldDebt = (id: string) => prisma.goldDebt.update({ where: { id }, data: { deletedAt: null } });

// ── Ödeme ───────────────────────────────────────────────────
/** Girilen alanlardan gram / fiyat / kaynak çıkarır. Gram doğrudan verilmediyse TL ÷ fiyat; fiyat yoksa servisten. */
async function resolveGrams(p: { grams?: number; tlAmount?: number; gramPrice?: number }) {
  if (p.grams !== undefined) {
    // Gram elle verildi: TL de varsa gerçekleşen fiyat bilgi olarak saklanır.
    const price = p.gramPrice ?? (p.tlAmount ? round2(p.tlAmount / p.grams) : null);
    return { grams: p.grams, gramPrice: price, priceSource: p.tlAmount || p.gramPrice ? "elle" : null };
  }
  if (p.tlAmount === undefined) throw new AgendaRuleError("Gram ya da TL tutarı gerekli.");
  if (p.gramPrice !== undefined) return { grams: gramsFor(p.tlAmount, p.gramPrice), gramPrice: p.gramPrice, priceSource: "elle" };
  try {
    const g = await fetchGramGoldPrice();
    return { grams: gramsFor(p.tlAmount, g.price), gramPrice: g.price, priceSource: "otomatik" };
  } catch {
    throw new AgendaRuleError("Güncel gram altın kuru alınamadı — gram fiyatını elle gir.");
  }
}

export async function addGoldPayment(raw: unknown) {
  const d = paymentInput.parse(raw);
  const debt = await prisma.goldDebt.findUniqueOrThrow({ where: { id: d.debtId } });
  if (debt.deletedAt) throw new AgendaRuleError("Bu borç silinmiş.");
  const r = await resolveGrams(d);
  const p = await prisma.goldDebtPayment.create({
    data: {
      debtId: debt.id, paidAt: d.paidAt ? new Date(d.paidAt) : new Date(), grams: dec(r.grams), tlAmount: dec(d.tlAmount),
      gramPrice: dec(r.gramPrice), priceSource: r.priceSource, note: d.note || null,
    },
  });
  return { ...p, title: `${debt.title} — ${r.grams} gr` };
}

/** Ödemeyi düzeltir. "Kur bekleyen" ödemeye gram fiyatı (ya da gram) girilince hesaplanıp kesinleşir. */
export async function updateGoldPayment(id: string, raw: unknown) {
  const d = paymentPatch.parse(raw);
  const before = await prisma.goldDebtPayment.findUniqueOrThrow({ where: { id }, include: { debt: { select: { title: true } } } });
  if (before.deletedAt) throw new AgendaRuleError("Silinmiş ödeme düzenlenemez.");
  const touchesAmount = d.grams !== undefined || d.tlAmount !== undefined || d.gramPrice !== undefined;
  const tlAmount = d.tlAmount ?? num(before.tlAmount) ?? undefined;
  const r = touchesAmount
    ? await resolveGrams({ grams: d.grams, tlAmount, gramPrice: d.gramPrice ?? (d.grams === undefined && d.tlAmount !== undefined ? num(before.gramPrice) ?? undefined : undefined) })
    : null;
  const p = await prisma.goldDebtPayment.update({
    where: { id },
    data: {
      paidAt: d.paidAt ? new Date(d.paidAt) : undefined,
      note: d.note === undefined ? undefined : d.note || null,
      ...(r ? { grams: dec(r.grams), tlAmount: dec(tlAmount), gramPrice: dec(r.gramPrice), priceSource: r.priceSource } : {}),
    },
  });
  return { ...p, title: `${before.debt.title} — ${num(p.grams) ?? "?"} gr` };
}

export async function trashGoldPayment(id: string) {
  const p = await prisma.goldDebtPayment.update({ where: { id }, data: { deletedAt: new Date() }, include: { debt: { select: { title: true } } } });
  return { ...p, title: `${p.debt.title} — ödeme` };
}
export async function restoreGoldPayment(id: string) {
  const p = await prisma.goldDebtPayment.update({ where: { id }, data: { deletedAt: null }, include: { debt: { select: { title: true } } } });
  return { ...p, title: `${p.debt.title} — ödeme` };
}

// ── Otomatik kural ──────────────────────────────────────────
type PaidEntry = { id: string; title: string; amount: Prisma.Decimal; direction: string; paidAt: Date | null; deletedAt: Date | null };

/**
 * Bir kasa gideri hangi altın borcuna, kaç TL olarak sayılır? Yazmaz — yalnızca eşleştirir (otomatik kural ve
 * doğrulama betikleri aynı kararı kullansın diye ayrı). Eşleşme yoksa, gider zaten işlendiyse ya da borç bittiyse null.
 */
export async function matchGoldRule(entry: Pick<PaidEntry, "id" | "title" | "amount" | "direction" | "deletedAt">) {
  if (entry.deletedAt || (entry.direction !== "BORC" && entry.direction !== "GIDER")) return null;
  const title = normTitle(entry.title);
  const debts = (await loadGoldDebts()).filter((d) => d.autoMatch && d.autoShare && normTitle(d.autoMatch) && title.includes(normTitle(d.autoMatch)));
  if (!debts.length) return null;
  if (await prisma.goldDebtPayment.findUnique({ where: { sourceEntryId: entry.id } })) return null; // bu gider zaten işlendi
  const debt = debts.find((d) => goldSummary(d).remainingGrams > 0); // bir gider yalnızca bir borca sayılır
  if (!debt) return null;
  return { debt, share: debt.autoShare!, tl: round2(Number(entry.amount) * debt.autoShare!) };
}

/**
 * Bir kasa gideri ÖDENDİ olduğunda çağrılır (agenda.ts). Eşleşen altın borcu için TL payını grama çevirip düşer.
 * ASLA hata fırlatmaz — asıl ödeme işlemi etkilenmesin. Kur alınamazsa ödeme "kur bekliyor" olarak yine de yazılır.
 */
export async function applyGoldAutoRules(entry: PaidEntry) {
  try {
    const m = await matchGoldRule(entry);
    if (!m) return;
    let price: number | null = null;
    try { price = (await fetchGramGoldPrice()).price; } catch (e) { console.error("[altın] kur alınamadı:", e instanceof Error ? e.message : e); }
    const grams = price ? gramsFor(m.tl, price) : null;
    await prisma.goldDebtPayment.create({
      data: {
        debtId: m.debt.id, paidAt: entry.paidAt ?? new Date(), grams: dec(grams), tlAmount: dec(m.tl), gramPrice: dec(price),
        priceSource: price ? "otomatik" : null, sourceEntryId: entry.id,
        note: `Otomatik: “${entry.title}” ödemesinin %${Math.round(m.share * 100)}’i`,
      },
    });
    await audit({
      source: "panel", actor: "otomatik kural", action: grams === null ? "altin.otomatik_kur_bekliyor" : "altin.otomatik",
      target: m.debt.title, detail: { kasaKaydi: entry.title, tl: m.tl, gramFiyat: price, gram: grams },
    });
  } catch (e) {
    console.error("[altın] otomatik kural çalışmadı:", e);
    await audit({ source: "panel", actor: "otomatik kural", action: "altin.otomatik", target: entry.title, ok: false, detail: { hata: e instanceof Error ? e.message : String(e) } });
  }
}

/** Gider "ödenmedi"ye döner ya da silinirse, ondan doğan otomatik altın ödemesi de geri alınır (çöp kutusu mantığı). */
export async function revertGoldAutoPayment(entryId: string) {
  try {
    const p = await prisma.goldDebtPayment.findUnique({ where: { sourceEntryId: entryId }, include: { debt: { select: { title: true } } } });
    if (!p) return;
    await prisma.goldDebtPayment.update({ where: { id: p.id }, data: { deletedAt: p.deletedAt ?? new Date(), sourceEntryId: null } });
    await audit({ source: "panel", actor: "otomatik kural", action: "altin.otomatik_geri_al", target: p.debt.title, detail: { gram: num(p.grams), tl: num(p.tlAmount) } });
  } catch (e) {
    console.error("[altın] otomatik ödeme geri alınamadı:", e);
  }
}

/** Bir kasa kaydının doğurduğu altın ödemesi (bot yanıtında "şu kadar gram düşüldü" demek için). */
export async function goldPaymentForEntry(entryId: string) {
  const p = await prisma.goldDebtPayment.findUnique({ where: { sourceEntryId: entryId }, include: { debt: { select: { id: true, title: true } } } });
  if (!p || p.deletedAt) return null;
  const debt = (await loadGoldDebts()).find((d) => d.id === p.debt.id);
  return { borc: p.debt.title, tl: num(p.tlAmount), gramFiyat: num(p.gramPrice), gram: num(p.grams), kurBekliyor: p.grams === null, kalanGr: debt ? goldSummary(debt).remainingGrams : null };
}
