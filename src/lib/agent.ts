/**
 * Telegram + Claude botunun kullandığı işlemler (v3.11.0) — /api/agent.
 *
 * Bot veritabanına doğrudan dokunmaz; yalnızca buradaki adlandırılmış işlemleri çağırır. Yazmalar panelle AYNI servis
 * katmanından geçer (src/lib/agenda.ts) → aynı doğrulama ve iş kuralları. Kalıcı silme yoktur: "sil" çöp kutusuna taşır,
 * ziyaret silmek yerine iptal edilir. Her yazma işlemi işlem kaydına (AuditLog) düşer.
 *
 * Tarihler: "YYYY-AA-GG" veya "YYYY-AA-GGTSS:DD" — İstanbul saati kabul edilir.
 */
import { z } from "zod";
import { prisma } from "@/lib/db";
import * as A from "@/lib/agenda";
import { computeKasa, isDebt, isIncoming } from "@/lib/kasaCalc";
import { CLIENT_PAYMENT_CATEGORY } from "@/lib/clientPayments";

const TZ = "Europe/Istanbul";
const ymd = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: TZ });
const hm = (d: Date) => d.toLocaleTimeString("tr-TR", { timeZone: TZ, hour: "2-digit", minute: "2-digit" });
const gun = (d: Date) => d.toLocaleDateString("tr-TR", { timeZone: TZ, weekday: "long", day: "numeric", month: "long" });

export class AgentError extends Error {}

/** "2026-11-24" → o gün 10:00; "2026-11-24T14:30" → o saat (İstanbul). */
function parseDate(v: unknown, field = "tarih"): Date {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?$/.test(v)) {
    throw new AgentError(`${field} "YYYY-AA-GG" veya "YYYY-AA-GGTSS:DD" biçiminde olmalı.`);
  }
  const d = new Date(`${v.length === 10 ? `${v}T10:00` : v}:00+03:00`);
  if (isNaN(d.getTime())) throw new AgentError(`${field} geçersiz.`);
  return d;
}

const norm = (s: string) =>
  s.toLocaleLowerCase("tr-TR").replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

/** Firma adını (yazım hatasına / kısaltmaya dayanıklı) tek bir firmaya çözer; belirsizse adayları söyler. */
async function resolveClient(name: unknown): Promise<{ id: string; name: string } | null> {
  if (name === undefined || name === null || name === "") return null;
  if (typeof name !== "string") throw new AgentError("firma metin olmalı.");
  const q = norm(name);
  const all = await prisma.client.findMany({ select: { id: true, name: true, slug: true, active: true } });
  const score = (c: { name: string; slug: string }) => {
    const n = norm(c.name);
    if (n === q || c.slug === q.replace(/ /g, "")) return 3;
    if (n.startsWith(q) || q.startsWith(n)) return 2;
    const words = q.split(" ").filter((w) => w.length >= 3);
    return words.length && words.every((w) => n.includes(w)) ? 1 : n.split(" ").some((w) => w.length >= 4 && q.includes(w)) ? 1 : 0;
  };
  const ranked = all.map((c) => ({ c, s: score(c) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s || Number(b.c.active) - Number(a.c.active));
  if (!ranked.length) throw new AgentError(`"${name}" adında firma bulunamadı. Firmalar: ${all.filter((c) => c.active).map((c) => c.name).join(", ")}`);
  const top = ranked.filter((x) => x.s === ranked[0].s);
  if (top.length > 1) throw new AgentError(`"${name}" birden fazla firmayla eşleşiyor: ${top.map((x) => x.c.name).join(", ")}. Hangisi?`);
  return { id: top[0].c.id, name: top[0].c.name };
}

async function resolveCard(name: unknown) {
  if (typeof name !== "string" || !name.trim()) throw new AgentError("kart adı gerekli.");
  const cards = await prisma.kasaEntry.findMany({ where: { deletedAt: null, category: { in: A.DEBT_CATEGORIES } }, select: { id: true, title: true, amount: true } });
  const q = norm(name).split(" ");
  const hits = cards.filter((c) => q.every((w) => norm(c.title).includes(w)));
  if (hits.length === 1) return hits[0];
  throw new AgentError(hits.length ? `"${name}" birden fazla kartla eşleşiyor: ${hits.map((c) => c.title).join(", ")}.` : `"${name}" adında kart yok. Kartlar: ${cards.map((c) => c.title).join(", ")}`);
}

const str = (max = 300) => z.string().trim().min(1).max(max);
const opt = <T extends z.ZodTypeAny>(t: T) => t.nullable().optional();

type Handler = { write: boolean; run: (args: Record<string, unknown>) => Promise<unknown> };

const eventOut = (e: { id: string; title: string; startAt: Date; status: string; locationName: string | null; client?: { name: string } | null }) => ({
  id: e.id, baslik: e.title, gun: gun(e.startAt), tarih: ymd(e.startAt), saat: hm(e.startAt), durum: e.status, konum: e.locationName, firma: e.client?.name ?? null,
});

export const ACTIONS: Record<string, Handler> = {
  // ── OKUMA ────────────────────────────────────────────────
  ozet: {
    write: false,
    async run() {
      const now = new Date();
      const today = ymd(now);
      const end = new Date(now.getTime() + 2 * 86_400_000);
      const [events, tracking, openTasks, kasa] = await Promise.all([
        prisma.agendaEvent.findMany({ where: { status: { not: "IPTAL" }, startAt: { gte: new Date(`${today}T00:00:00+03:00`), lt: end } }, orderBy: { startAt: "asc" }, include: { client: { select: { name: true } } } }),
        A.getVisitTracking(now),
        prisma.agendaTask.findMany({ where: { deletedAt: null, status: { not: "TAMAMLANDI" } }, orderBy: [{ priority: "desc" }, { sortOrder: "asc" }], take: 15, include: { client: { select: { name: true } } } }),
        A.loadKasaData(),
      ]);
      const k = computeKasa(kasa.entries, kasa.cardTxs, now.toISOString());
      return {
        bugun: today, gunAdi: gun(now),
        yakinZiyaretler: events.map(eventOut),
        ziyaretiGecikenFirmalar: tracking.filter((t) => t.overdue).map((t) => `${t.name} (${t.daysSince === null ? "hiç gidilmedi" : `${t.daysSince} gün`})`),
        acikIsler: openTasks.map((t) => ({ id: t.id, baslik: t.title, oncelik: t.priority, firma: t.client?.name ?? null })),
        finans: {
          kasadaKalan: k.cash, toplamBorc: k.debtTotal, buAyTahsilEdilen: k.collectedTotal,
          tahsilEdilecek: k.openReceivables.map((e) => ({ id: e.id, baslik: e.title, tutar: e.amount, vade: ymd(new Date(e.dueDate)) })),
        },
      };
    },
  },
  ziyaretler: {
    write: false,
    async run(a) {
      const p = z.object({ baslangic: opt(z.string()), bitis: opt(z.string()), firma: opt(z.string()) }).parse(a);
      const from = p.baslangic ? parseDate(p.baslangic.slice(0, 10) + "T00:00", "baslangic") : new Date(`${ymd(new Date())}T00:00:00+03:00`);
      const to = p.bitis ? parseDate(p.bitis.slice(0, 10) + "T23:59", "bitis") : new Date(from.getTime() + 14 * 86_400_000);
      const c = await resolveClient(p.firma);
      const rows = await prisma.agendaEvent.findMany({ where: { startAt: { gte: from, lte: to }, ...(c ? { clientId: c.id } : {}) }, orderBy: { startAt: "asc" }, take: 80, include: { client: { select: { name: true } } } });
      return rows.map(eventOut);
    },
  },
  isler: {
    write: false,
    async run(a) {
      const p = z.object({ firma: opt(z.string()), tamamlananlar: opt(z.boolean()) }).parse(a);
      const c = await resolveClient(p.firma);
      const rows = await prisma.agendaTask.findMany({
        where: { deletedAt: null, ...(c ? { clientId: c.id } : {}), status: p.tamamlananlar ? "TAMAMLANDI" : { not: "TAMAMLANDI" } },
        orderBy: [{ updatedAt: "desc" }], take: 50, include: { client: { select: { name: true } } },
      });
      return rows.map((t) => ({ id: t.id, baslik: t.title, durum: t.status, oncelik: t.priority, firma: t.client?.name ?? null, sonTarih: t.dueAt ? ymd(t.dueAt) : null, musteriGoruyor: t.visibleToClient }));
    },
  },
  firmalar: {
    write: false,
    async run() {
      const rows = await A.getVisitTracking();
      const passive = await prisma.client.findMany({ where: { active: false }, select: { name: true } });
      return {
        aktif: rows.map((r) => ({ ad: r.name, sonZiyaret: r.lastVisitAt ? ymd(new Date(r.lastVisitAt)) : null, gunOnce: r.daysSince, sonrakiZiyaret: r.nextVisitAt ? `${ymd(new Date(r.nextVisitAt))} ${hm(new Date(r.nextVisitAt))}` : null, gecikmis: r.overdue })),
        pasif: passive.map((p) => p.name),
      };
    },
  },
  finans: {
    write: false,
    async run() {
      const now = new Date();
      const { entries, cardTxs } = await A.loadKasaData();
      const k = computeKasa(entries, cardTxs, now.toISOString());
      const horizon = now.getTime() + 30 * 86_400_000;
      return {
        yil: k.year, yillikGelir: k.yearIncome, tumZamanlarGelir: k.totalIncome, kasadaKalan: k.cash,
        toplamBorc: k.debtTotal, buAyGelirHedefi: k.monthIncomeTarget, buAyGider: k.monthExpenseTotal, buAyTahsilEdilen: k.collectedTotal,
        kartlar: k.debtCards.map((c) => ({ id: c.id, ad: c.title, borc: c.amount })),
        taksitliBorclar: k.installments.map((g) => ({ ad: g.base, odenen: `${g.paidCount}/${g.total}`, kalanTutar: g.remainingAmount })),
        tahsilEdilecek: k.openReceivables.map((e) => ({ id: e.id, baslik: e.title, tutar: e.amount, vade: ymd(new Date(e.dueDate)) })),
        yaklasanOdemeler: entries
          .filter((e) => e.status === "BEKLIYOR" && !isIncoming(e.direction) && !isDebt(e) && new Date(e.dueDate).getTime() <= horizon)
          .map((e) => ({ id: e.id, baslik: e.title, tutar: e.amount, vade: ymd(new Date(e.dueDate)) })),
      };
    },
  },
  notlar: {
    write: false,
    async run(a) {
      const p = z.object({ ara: opt(z.string()), firma: opt(z.string()) }).parse(a);
      const c = await resolveClient(p.firma);
      const rows = await prisma.agendaNote.findMany({ where: { deletedAt: null, ...(c ? { clientId: c.id } : {}) }, orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }], include: { client: { select: { name: true } } } });
      const q = p.ara ? norm(p.ara) : "";
      return rows.filter((n) => !q || norm(`${n.title} ${n.content}`).includes(q)).slice(0, 15)
        .map((n) => ({ id: n.id, tur: n.kind, baslik: n.title, icerik: n.content.slice(0, 700), firma: n.client?.name ?? null, musteriGoruyor: n.visibleToClient }));
    },
  },

  // ── YAZMA ────────────────────────────────────────────────
  ziyaret_ekle: {
    write: true,
    async run(a) {
      const p = z.object({ firma: opt(z.string()), baslik: opt(str(200)), tarih: z.string(), sureDk: opt(z.number().int().min(15).max(720)), konum: opt(str(200)), aciklama: opt(str(2000)) }).parse(a);
      const c = await resolveClient(p.firma);
      const startAt = parseDate(p.tarih);
      if (!c && !p.baslik) throw new AgentError("firma veya baslik gerekli.");
      // Aynı firma + aynı gün zaten planlı ziyaret varsa mükerrer açma.
      if (c) {
        const day = ymd(startAt);
        const dup = await prisma.agendaEvent.findFirst({ where: { clientId: c.id, status: "PLANLI", startAt: { gte: new Date(`${day}T00:00:00+03:00`), lt: new Date(`${day}T23:59:59+03:00`) } } });
        if (dup) throw new AgentError(`${c.name} için ${day} günü zaten planlı ziyaret var (${hm(dup.startAt)}, id ${dup.id}). Saatini değiştirmek için ziyaret_guncelle kullan.`);
      }
      const ev = await A.createEvent({
        title: p.baslik ?? `${c!.name} Çekim / Ziyaret`, startAt: startAt.toISOString(), clientId: c?.id ?? null,
        endAt: p.sureDk ? new Date(startAt.getTime() + p.sureDk * 60_000).toISOString() : undefined,
        locationName: p.konum ?? null, description: p.aciklama ?? null,
      });
      return eventOut({ ...ev, client: c });
    },
  },
  ziyaret_guncelle: {
    write: true,
    async run(a) {
      const p = z.object({ id: str(60), tarih: opt(z.string()), durum: opt(z.enum(["PLANLI", "TAMAMLANDI", "IPTAL"])), baslik: opt(str(200)), konum: opt(str(200)), aciklama: opt(str(2000)) }).parse(a);
      const before = await prisma.agendaEvent.findUnique({ where: { id: p.id } });
      if (!before) throw new AgentError("Ziyaret bulunamadı.");
      const patch: Record<string, unknown> = {};
      if (p.tarih) {
        const startAt = parseDate(p.tarih);
        const dur = before.endAt ? before.endAt.getTime() - before.startAt.getTime() : 150 * 60_000;
        patch.startAt = startAt.toISOString(); patch.endAt = new Date(startAt.getTime() + dur).toISOString();
      }
      if (p.durum) patch.status = p.durum;
      if (p.baslik) patch.title = p.baslik;
      if (p.konum) patch.locationName = p.konum;
      if (p.aciklama) patch.description = p.aciklama;
      const ev = await A.updateEvent(p.id, patch);
      const client = ev.clientId ? await prisma.client.findUnique({ where: { id: ev.clientId }, select: { name: true } }) : null;
      return eventOut({ ...ev, client });
    },
  },
  is_ekle: {
    write: true,
    async run(a) {
      const p = z.object({ baslik: str(), firma: opt(z.string()), oncelik: opt(z.enum(["DUSUK", "ORTA", "YUKSEK", "ACIL"])), sonTarih: opt(z.string()), aciklama: opt(str(4000)), musteriGorsun: opt(z.boolean()) }).parse(a);
      const c = await resolveClient(p.firma);
      const t = await A.createTask({
        title: p.baslik, clientId: c?.id ?? null, priority: p.oncelik ?? "ORTA", description: p.aciklama ?? null,
        dueAt: p.sonTarih ? parseDate(p.sonTarih.slice(0, 10) + "T18:00", "sonTarih").toISOString() : null,
        // Bot üzerinden eklenen iş varsayılan olarak müşteriye KAPALI — iç not sızmasın; açıkça istenirse açılır.
        visibleToClient: p.musteriGorsun ?? false,
      });
      return { id: t.id, baslik: t.title, firma: c?.name ?? null, musteriGoruyor: t.visibleToClient };
    },
  },
  is_guncelle: {
    write: true,
    async run(a) {
      const p = z.object({ id: str(60), durum: opt(z.enum(["YAPILACAK", "YAPILIYOR", "TAMAMLANDI"])), baslik: opt(str()), oncelik: opt(z.enum(["DUSUK", "ORTA", "YUKSEK", "ACIL"])), sonTarih: opt(z.string()), musteriGorsun: opt(z.boolean()) }).parse(a);
      const patch: Record<string, unknown> = {};
      if (p.durum) patch.status = p.durum;
      if (p.baslik) patch.title = p.baslik;
      if (p.oncelik) patch.priority = p.oncelik;
      if (p.sonTarih) patch.dueAt = parseDate(p.sonTarih.slice(0, 10) + "T18:00", "sonTarih").toISOString();
      if (typeof p.musteriGorsun === "boolean") patch.visibleToClient = p.musteriGorsun;
      const t = await A.updateTask(p.id, patch);
      return { id: t.id, baslik: t.title, durum: t.status };
    },
  },
  not_ekle: {
    write: true,
    async run(a) {
      const p = z.object({ baslik: str(), icerik: str(20000), firma: opt(z.string()), tur: opt(z.enum(["NOT", "HAFIZA"])) }).parse(a);
      const c = await resolveClient(p.firma);
      const n = await A.createNote({ title: p.baslik, content: p.icerik, kind: p.tur ?? "NOT", clientId: c?.id ?? null });
      return { id: n.id, baslik: n.title, firma: c?.name ?? null };
    },
  },
  tahsilat: {
    write: true,
    async run(a) {
      const p = z.object({ id: opt(str(60)), firma: opt(z.string()), tarih: opt(z.string()) }).parse(a);
      let entryId = p.id ?? null;
      if (!entryId) {
        const c = await resolveClient(p.firma);
        if (!c) throw new AgentError("id veya firma gerekli.");
        const pending = await prisma.kasaEntry.findMany({ where: { clientId: c.id, deletedAt: null, status: "BEKLIYOR", direction: { in: ["ALACAK", "GELIR"] }, category: CLIENT_PAYMENT_CATEGORY }, orderBy: { dueDate: "asc" } });
        if (!pending.length) throw new AgentError(`${c.name} için bekleyen ödeme yok.`);
        // Birden fazla bekleyen varsa en eski vadeli olan kapatılır; hangisinin kapandığı yanıtta söylenir.
        entryId = pending[0].id;
      }
      const before = await prisma.kasaEntry.findUnique({ where: { id: entryId } });
      if (!before || before.deletedAt) throw new AgentError("Kayıt bulunamadı.");
      if (!isIncoming(before.direction)) throw new AgentError("Bu kayıt bir alacak değil — odeme_yapildi kullan.");
      if (before.status === "ODENDI") throw new AgentError(`"${before.title}" zaten tahsil edilmiş.`);
      const e = await A.updateKasaEntry(entryId, { status: "ODENDI", ...(p.tarih ? { paidAt: parseDate(p.tarih).toISOString() } : {}) });
      return { id: e.id, baslik: e.title, tutar: Number(e.amount), tahsilTarihi: e.paidAt ? ymd(e.paidAt) : null };
    },
  },
  odeme_yapildi: {
    write: true,
    async run(a) {
      const p = z.object({ id: str(60), tarih: opt(z.string()) }).parse(a);
      const before = await prisma.kasaEntry.findUnique({ where: { id: p.id } });
      if (!before || before.deletedAt) throw new AgentError("Kayıt bulunamadı.");
      if (isDebt(before)) throw new AgentError("Bu bir kart / hesap borcu — kart_odeme kullan.");
      const e = await A.updateKasaEntry(p.id, { status: "ODENDI", ...(p.tarih ? { paidAt: parseDate(p.tarih).toISOString() } : {}) });
      return { id: e.id, baslik: e.title, tutar: Number(e.amount) };
    },
  },
  kasa_ekle: {
    write: true,
    async run(a) {
      const p = z.object({ baslik: str(200), tutar: z.union([z.number(), z.string()]), tur: z.enum(["GELIR", "GIDER", "BORC", "ALACAK"]), vade: opt(z.string()), kategori: opt(str(60)), firma: opt(z.string()), odendi: opt(z.boolean()), herAy: opt(z.boolean()) }).parse(a);
      const c = await resolveClient(p.firma);
      const due = p.vade ? parseDate(p.vade, "vade") : new Date();
      const e = await A.createKasaEntry({
        title: p.baslik, amount: p.tutar, direction: p.tur, dueDate: due.toISOString(), clientId: c?.id ?? null,
        category: p.kategori ?? (c && (p.tur === "ALACAK" || p.tur === "GELIR") ? CLIENT_PAYMENT_CATEGORY : "genel"),
        status: p.odendi ?? p.tur === "GELIR" ? "ODENDI" : "BEKLIYOR", isRecurring: p.herAy ?? false,
      });
      return { id: e.id, baslik: e.title, tutar: Number(e.amount), durum: e.status, firma: c?.name ?? null };
    },
  },
  kart_harcama: {
    write: true,
    async run(a) {
      const p = z.object({ kart: z.string(), baslik: str(200), tutar: z.union([z.number(), z.string()]), kategori: opt(str(60)) }).parse(a);
      const card = await resolveCard(p.kart);
      await A.addCardTransaction({ entryId: card.id, title: p.baslik, amount: p.tutar, category: p.kategori ?? undefined });
      const after = await prisma.kasaEntry.findUniqueOrThrow({ where: { id: card.id } });
      return { kart: card.title, harcama: p.baslik, yeniBorc: Number(after.amount) };
    },
  },
  kart_odeme: {
    write: true,
    async run(a) {
      const p = z.object({ kart: z.string(), tutar: z.union([z.number(), z.string()]) }).parse(a);
      const card = await resolveCard(p.kart);
      await A.payDebt(card.id, p.tutar);
      const after = await prisma.kasaEntry.findUniqueOrThrow({ where: { id: card.id } });
      return { kart: card.title, kalanBorc: Number(after.amount) };
    },
  },
  sil: {
    write: true,
    async run(a) {
      const p = z.object({ tur: z.enum(["is", "not", "kasa", "ziyaret"]), id: str(60) }).parse(a);
      if (p.tur === "ziyaret") { const e = await A.updateEvent(p.id, { status: "IPTAL" }); return { baslik: e.title, sonuc: "iptal edildi (silinmedi)" }; }
      const r = p.tur === "is" ? await A.trashTask(p.id) : p.tur === "not" ? await A.trashNote(p.id) : await A.trashKasaEntry(p.id);
      return { baslik: r.title, sonuc: "çöp kutusuna taşındı (panelden geri alınabilir)" };
    },
  },
};
