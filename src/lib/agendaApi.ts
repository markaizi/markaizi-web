import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import * as agenda from "@/lib/agenda";

/** Servis hatalarını anlaşılır HTTP yanıtlarına çevirir (panel + bot uçları ortak). */
export async function respond(fn: () => Promise<unknown>) {
  try {
    const result = await fn();
    return NextResponse.json({ ok: true, result });
  } catch (e) {
    if (e instanceof ZodError) return NextResponse.json({ error: e.issues[0]?.message ?? "Geçersiz veri." }, { status: 400 });
    if (e instanceof agenda.AgendaRuleError) return NextResponse.json({ error: e.message }, { status: 400 });
    if (e instanceof Prisma.PrismaClientKnownRequestError && (e.code === "P2025" || e.code === "P2003")) {
      return NextResponse.json({ error: e.code === "P2025" ? "Kayıt bulunamadı." : "Bağlı firma/kayıt bulunamadı." }, { status: 404 });
    }
    if (e instanceof Error && e.name === "NotFoundError") return NextResponse.json({ error: "Kayıt bulunamadı." }, { status: 404 });
    console.error("[ajanda]", e);
    return NextResponse.json({ error: "İşlem yapılamadı." }, { status: 500 });
  }
}

export type AgendaResource = "events" | "tasks" | "notes" | "kasa" | "card-tx" | "installments";

export const createByResource: Record<AgendaResource, (body: unknown) => Promise<unknown>> = {
  events: agenda.createEvent,
  tasks: agenda.createTask,
  notes: agenda.createNote,
  kasa: agenda.createKasaEntry,
  "card-tx": agenda.addCardTransaction,
  installments: agenda.createInstallmentPlan,
};

const isAction = (body: unknown, action: string) =>
  !!body && typeof body === "object" && (body as { action?: string }).action === action;

// PATCH gövdesi { action: "restore" } → çöp kutusundan geri al; kasa'da { action: "pay", amount } → borç ödemesi.
export const updateByResource: Partial<Record<AgendaResource, (id: string, body: unknown) => Promise<unknown>>> = {
  events: agenda.updateEvent,
  tasks: (id, body) => (isAction(body, "restore") ? agenda.restoreTask(id) : agenda.updateTask(id, body)),
  notes: (id, body) => (isAction(body, "restore") ? agenda.restoreNote(id) : agenda.updateNote(id, body)),
  kasa: (id, body) => {
    if (isAction(body, "pay")) return agenda.payDebt(id, (body as { amount?: unknown }).amount);
    if (isAction(body, "restore")) return agenda.restoreKasaEntry(id);
    return agenda.updateKasaEntry(id, body);
  },
  "card-tx": (id, body) => (isAction(body, "restore") ? agenda.restoreCardTransaction(id) : agenda.updateCardTransaction(id, body)),
};

export const deleteByResource: Partial<Record<AgendaResource, (id: string) => Promise<unknown>>> = {
  events: agenda.deleteEvent,
  tasks: agenda.trashTask,
  notes: agenda.trashNote,
  kasa: agenda.trashKasaEntry,
  "card-tx": agenda.trashCardTransaction,
};

export function isResource(r: string): r is AgendaResource {
  return r in createByResource;
}
