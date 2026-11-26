import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import * as agenda from "@/lib/agenda";
import * as gold from "@/lib/gold";
import { audit, titleOf } from "@/lib/audit";

/**
 * Servis hatalarını anlaşılır HTTP yanıtlarına çevirir (panel + bot uçları ortak).
 * `log` verilirse işlem (başarılı / başarısız) işlem kaydına yazılır.
 */
export async function respond(fn: () => Promise<unknown>, log?: { source: "panel" | "bot"; actor?: string | null; action: string; detail?: unknown }) {
  try {
    const result = await fn();
    if (log) await audit({ ...log, target: titleOf(result) });
    return NextResponse.json({ ok: true, result });
  } catch (e) {
    const fail = (error: string, status: number) => {
      if (log) void audit({ ...log, ok: false, detail: { istek: log.detail, hata: error } });
      return NextResponse.json({ error }, { status });
    };
    if (e instanceof ZodError) return fail(e.issues[0]?.message ?? "Geçersiz veri.", 400);
    if (e instanceof agenda.AgendaRuleError) return fail(e.message, 400);
    if (e instanceof Prisma.PrismaClientKnownRequestError && (e.code === "P2025" || e.code === "P2003")) {
      return fail(e.code === "P2025" ? "Kayıt bulunamadı." : "Bağlı firma/kayıt bulunamadı.", 404);
    }
    if (e instanceof Error && e.name === "NotFoundError") return fail("Kayıt bulunamadı.", 404);
    console.error("[ajanda]", e);
    return fail("İşlem yapılamadı.", 500);
  }
}

export type AgendaResource = "events" | "tasks" | "notes" | "kasa" | "card-tx" | "installments" | "cards" | "gold-debts" | "gold-payments";

export const createByResource: Record<AgendaResource, (body: unknown) => Promise<unknown>> = {
  events: agenda.createEvent,
  tasks: agenda.createTask,
  notes: agenda.createNote,
  kasa: agenda.createKasaEntry,
  "card-tx": agenda.addCardTransaction,
  installments: agenda.createInstallmentPlan,
  cards: agenda.createDebtCard, // yeni kart / ek hesap (borç 0 olabilir, limit opsiyonel)
  "gold-debts": gold.createGoldDebt, // altın (gram) cinsinden borç
  "gold-payments": gold.addGoldPayment, // gram ya da TL (+ gram fiyatı) ile ödeme
};

const isAction = (body: unknown, action: string) =>
  !!body && typeof body === "object" && (body as { action?: string }).action === action;

// PATCH gövdesi { action: "restore" } → çöp kutusundan geri al; kasa'da { action: "pay", amount } → borç ödemesi,
// { action: "limit", limit } → kart / ek hesap limiti (boş / 0 = limiti kaldır).
export const updateByResource: Partial<Record<AgendaResource, (id: string, body: unknown) => Promise<unknown>>> = {
  events: agenda.updateEvent,
  tasks: (id, body) => (isAction(body, "restore") ? agenda.restoreTask(id) : agenda.updateTask(id, body)),
  notes: (id, body) => (isAction(body, "restore") ? agenda.restoreNote(id) : agenda.updateNote(id, body)),
  kasa: (id, body) => {
    if (isAction(body, "pay")) return agenda.payDebt(id, (body as { amount?: unknown }).amount);
    if (isAction(body, "limit")) return agenda.setCardLimit(id, (body as { limit?: unknown }).limit);
    if (isAction(body, "restore")) return agenda.restoreKasaEntry(id);
    return agenda.updateKasaEntry(id, body);
  },
  "card-tx": (id, body) => (isAction(body, "restore") ? agenda.restoreCardTransaction(id) : agenda.updateCardTransaction(id, body)),
  "gold-debts": (id, body) => (isAction(body, "restore") ? gold.restoreGoldDebt(id) : gold.updateGoldDebt(id, body)),
  "gold-payments": (id, body) => (isAction(body, "restore") ? gold.restoreGoldPayment(id) : gold.updateGoldPayment(id, body)),
};

export const deleteByResource: Partial<Record<AgendaResource, (id: string) => Promise<unknown>>> = {
  events: agenda.deleteEvent,
  tasks: agenda.trashTask,
  notes: agenda.trashNote,
  kasa: agenda.trashKasaEntry,
  "card-tx": agenda.trashCardTransaction,
  "gold-debts": gold.trashGoldDebt,
  "gold-payments": gold.trashGoldPayment,
};

export function isResource(r: string): r is AgendaResource {
  return r in createByResource;
}
