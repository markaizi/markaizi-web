"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PanelShell, Card, Tabs, Field, Btn, Chip, Modal, Stat, ClientLink, agendaApi, inputCls, inputStyle,
  fmtDay, fmtDate, fmtTime, dayKey, todayKey, TZ,
} from "@/components/agenda/ui";
import FilterSelect, { FilterIcons, PriorityFilter, type PriorityLevel } from "@/components/FilterSelect";

export interface AjandaEvent {
  id: string; title: string; description: string | null; clientNote: string | null;
  startAt: string; endAt: string | null; allDay: boolean; locationName: string | null;
  status: "PLANLI" | "TAMAMLANDI" | "IPTAL"; visibleToClient: boolean; clientId: string | null; clientName: string | null; clientSlug?: string | null;
}
export interface AjandaTask {
  id: string; title: string; description: string | null; priority: "DUSUK" | "ORTA" | "YUKSEK" | "ACIL";
  status: "YAPILACAK" | "YAPILIYOR" | "TAMAMLANDI"; dueAt: string | null; completedAt: string | null;
  visibleToClient: boolean; clientId: string | null; clientName: string | null; clientSlug?: string | null;
}
export interface AjandaNote {
  id: string; kind: "NOT" | "HAFIZA"; title: string; content: string; category: string | null; tags: string[];
  pinned: boolean; clientId: string | null; clientName: string | null; clientSlug?: string | null; updatedAt: string;
  visibleToClient: boolean;
}
export interface VisitRow {
  id: string; slug: string; name: string; region: string | null; lastVisitAt: string | null;
  daysSince: number | null; interval: number; overdue: boolean; nextVisitAt: string | null;
}
export interface AjandaData {
  events: AjandaEvent[]; tasks: AjandaTask[]; notes: AjandaNote[];
  clients: { id: string; name: string }[]; tracking: VisitRow[];
  nowIso: string; // sunucu saati — render saf kalsın diye Date.now() yerine
}

type Tab = "plan" | "ziyaret" | "isler" | "notlar";

const STATUS_META = {
  PLANLI: { label: "Planlı", color: "#60a5fa" },
  TAMAMLANDI: { label: "Gidildi", color: "#34d399" },
  IPTAL: { label: "İptal", color: "#8a8a9a" },
} as const;
// Renkler öncelik filtresiyle aynı (v3.14.0): düşük yeşil, orta turuncu, yüksek kırmızı, acil koyu kırmızı.
const PRIORITY_META = {
  ACIL: { label: "Acil", color: "#f43f5e" },
  YUKSEK: { label: "Yüksek", color: "#f87171" },
  ORTA: { label: "Orta", color: "#fb923c" },
  DUSUK: { label: "Düşük", color: "#34d399" },
} as const;
/** Öncelik filtresinde "Yüksek" acil işleri de kapsar. */
const priorityLevel = (p: AjandaTask["priority"]): PriorityLevel => (p === "ACIL" ? "YUKSEK" : p);

/** ISO → <input type="datetime-local"> değeri (İstanbul saati). */
function toLocalInput(iso: string): string {
  return new Date(iso).toLocaleString("sv-SE", { timeZone: TZ }).slice(0, 16).replace(" ", "T");
}

export default function AjandaView({ data: allData, initialClientId = "", initialTab = "plan" }: {
  data: AjandaData; initialClientId?: string; initialTab?: Tab;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>(initialTab);
  // Firma filtresi (v3.6.0): seçiliyse tüm sekmeler yalnızca o firmanın kayıtlarını gösterir.
  const [firm, setFirm] = useState(initialClientId);
  // Öncelik filtresi (v3.14.0): yalnızca İşler'i daraltır; aynı bayrağa tekrar basınca kalkar.
  const [prio, setPrio] = useState<PriorityLevel | null>(null);
  const firmData: AjandaData = useMemo(() => !firm ? allData : {
    ...allData,
    events: allData.events.filter((e) => e.clientId === firm),
    tasks: allData.tasks.filter((t) => t.clientId === firm),
    notes: allData.notes.filter((n) => n.clientId === firm),
    tracking: allData.tracking.filter((r) => r.id === firm),
  }, [allData, firm]);
  const data: AjandaData = useMemo(() => !prio ? firmData : {
    ...firmData, tasks: firmData.tasks.filter((t) => priorityLevel(t.priority) === prio),
  }, [firmData, prio]);
  const prioCounts = useMemo(() => {
    const c: Record<PriorityLevel, number> = { DUSUK: 0, ORTA: 0, YUKSEK: 0 };
    for (const t of firmData.tasks) if (t.status !== "TAMAMLANDI") c[priorityLevel(t.priority)]++;
    return c;
  }, [firmData]);
  const firmDefault = firm || null;
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState<Partial<AjandaEvent> | null>(null);
  const [taskForm, setTaskForm] = useState<Partial<AjandaTask> | null>(null);
  const [noteForm, setNoteForm] = useState<Partial<AjandaNote> | null>(null);

  async function run(key: string, fn: () => Promise<unknown>) {
    setBusy(key);
    setError("");
    try {
      await fn();
      router.refresh();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "İşlem yapılamadı.");
      return false;
    } finally {
      setBusy(null);
    }
  }

  const overdueCount = data.tracking.filter((t) => t.overdue).length;
  const openTasks = data.tasks.filter((t) => t.status !== "TAMAMLANDI");
  const today = todayKey();
  const upcoming = data.events.filter((e) => dayKey(e.startAt) >= today);
  const todayCount = upcoming.filter((e) => dayKey(e.startAt) === today && e.status === "PLANLI").length;

  return (
    <PanelShell
      title="Ajanda"
      subtitle="Ziyaret planı, 14 gün takibi, işler ve notlar."
      actions={
        <div className="flex items-center gap-2">
          <Link href="/musteri/admin/islem-kaydi" className="hidden sm:flex text-[12px] text-[#8a8a9a] hover:underline px-2 min-h-[44px] items-center">İşlem kaydı</Link>
          <Link href="/musteri/admin/cop-kutusu" className="text-[12px] text-[#8a8a9a] hover:underline px-2 min-h-[44px] flex items-center">Çöp kutusu</Link>
          <Btn variant="primary" onClick={() => setEventForm({ visibleToClient: true, status: "PLANLI", clientId: firmDefault })}>+ Ziyaret</Btn>
          <Btn onClick={() => setTaskForm({ priority: "ORTA", visibleToClient: true, clientId: firmDefault })}>+ İş</Btn>
        </div>
      }
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Stat label="Bugün" value={`${todayCount} ziyaret`} color="#60a5fa" />
        <Stat label="Önümüzdeki 7 gün" value={`${upcoming.filter((e) => e.status === "PLANLI" && new Date(e.startAt).getTime() < new Date(data.nowIso).getTime() + 7 * 864e5).length} ziyaret`} color="#c084fc" />
        <Stat label="14 günü geçen" value={`${overdueCount} firma`} color={overdueCount ? "#f87171" : "#34d399"} />
        <Stat label="Açık iş" value={String(openTasks.length)} color="#fb923c" />
      </div>

      {error && (
        <div className="mb-4 rounded-xl px-4 py-3 text-[13px]" style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)" }}>{error}</div>
      )}

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <FilterSelect
          value={firm}
          onChange={setFirm}
          ariaLabel="Firma filtresi"
          icon={FilterIcons.building}
          searchPlaceholder="Firma ara…"
          minWidth={220}
          options={[
            { value: "", label: "Tüm firmalar", muted: true, icon: FilterIcons.all },
            ...allData.clients.map((c) => ({ value: c.id, label: c.name })),
          ]}
        />
        <PriorityFilter value={prio} counts={prioCounts}
          onChange={(p) => { setPrio(p); if (p) setTab("isler"); }} />
        {(firm || prio) && (
          <button onClick={() => { setFirm(""); setPrio(null); }}
            className="text-[12px] font-semibold text-[#8a8a9a] hover:text-[#f87171] transition-colors px-2 h-[36px]">
            Filtreleri temizle
          </button>
        )}
      </div>

      <Tabs<Tab>
        active={tab}
        onChange={setTab}
        tabs={[
          { id: "plan", label: "Plan" },
          { id: "ziyaret", label: "Ziyaret Takibi", badge: overdueCount },
          { id: "isler", label: "İşler", badge: openTasks.filter((t) => t.priority === "ACIL" || t.priority === "YUKSEK").length },
          { id: "notlar", label: "Notlar & Hafıza" },
        ]}
      />

      {tab === "plan" && (
        <PlanTab events={data.events} busy={busy}
          onEdit={(e) => setEventForm(e)}
          onStatus={(e, status) => run(e.id, () => agendaApi("PATCH", `events/${e.id}`, { status }))}
          onDelete={(e) => confirm(`"${e.title}" silinsin mi?`) && run(e.id, () => agendaApi("DELETE", `events/${e.id}`))}
        />
      )}
      {tab === "ziyaret" && (
        <VisitTab rows={data.tracking} onPlan={(r) => setEventForm({ clientId: r.id, title: `${r.name} Çekim / Ziyaret`, visibleToClient: true, status: "PLANLI" })} />
      )}
      {tab === "isler" && (
        <TasksTab tasks={data.tasks} busy={busy} filtered={!!prio}
          onEdit={(t) => setTaskForm(t)}
          onToggle={(t) => run(t.id, () => agendaApi("PATCH", `tasks/${t.id}`, { status: t.status === "TAMAMLANDI" ? "YAPILACAK" : "TAMAMLANDI" }))}
          onDelete={(t) => confirm(`"${t.title}" çöp kutusuna taşınsın mı?`) && run(t.id, () => agendaApi("DELETE", `tasks/${t.id}`))}
        />
      )}
      {tab === "notlar" && (
        <NotesTab notes={data.notes} busy={busy}
          onAdd={() => setNoteForm({ kind: "NOT", clientId: firmDefault })}
          onEdit={(n) => setNoteForm(n)}
          onPin={(n) => run(n.id, () => agendaApi("PATCH", `notes/${n.id}`, { pinned: !n.pinned }))}
          onDelete={(n) => confirm(`"${n.title}" çöp kutusuna taşınsın mı?`) && run(n.id, () => agendaApi("DELETE", `notes/${n.id}`))}
        />
      )}

      {eventForm && (
        <EventForm initial={eventForm} clients={data.clients} nowIso={data.nowIso} busy={busy === "event-form"}
          onClose={() => setEventForm(null)}
          onSave={async (body) => {
            const ok = await run("event-form", () =>
              eventForm.id ? agendaApi("PATCH", `events/${eventForm.id}`, body) : agendaApi("POST", "events", body));
            if (ok) setEventForm(null);
          }}
        />
      )}
      {taskForm && (
        <TaskForm initial={taskForm} clients={data.clients} busy={busy === "task-form"}
          onClose={() => setTaskForm(null)}
          onSave={async (body) => {
            const ok = await run("task-form", () =>
              taskForm.id ? agendaApi("PATCH", `tasks/${taskForm.id}`, body) : agendaApi("POST", "tasks", body));
            if (ok) setTaskForm(null);
          }}
        />
      )}
      {noteForm && (
        <NoteForm initial={noteForm} clients={data.clients} busy={busy === "note-form"}
          onClose={() => setNoteForm(null)}
          onSave={async (body) => {
            const ok = await run("note-form", () =>
              noteForm.id ? agendaApi("PATCH", `notes/${noteForm.id}`, body) : agendaApi("POST", "notes", body));
            if (ok) setNoteForm(null);
          }}
        />
      )}
    </PanelShell>
  );
}

// ── Plan ───────────────────────────────────────────────────
function PlanTab({ events, busy, onEdit, onStatus, onDelete }: {
  events: AjandaEvent[]; busy: string | null;
  onEdit: (e: AjandaEvent) => void; onStatus: (e: AjandaEvent, s: AjandaEvent["status"]) => void; onDelete: (e: AjandaEvent) => void;
}) {
  const [view, setView] = useState<"liste" | "ay">("liste");
  const [showPast, setShowPast] = useState(false);
  const [showCancelled, setShowCancelled] = useState(false);
  const today = todayKey();
  const [month, setMonth] = useState(today.slice(0, 7));
  const [selectedDay, setSelectedDay] = useState(today);

  const groups = useMemo(() => {
    const list = events
      .filter((e) => (showPast ? true : dayKey(e.startAt) >= today))
      .filter((e) => (showCancelled ? true : e.status !== "IPTAL"));
    const sorted = showPast ? [...list].reverse() : list;
    const map = new Map<string, AjandaEvent[]>();
    for (const e of sorted) {
      const k = dayKey(e.startAt);
      map.set(k, [...(map.get(k) ?? []), e]);
    }
    if (showPast) for (const [k, v] of map) map.set(k, [...v].reverse());
    return [...map.entries()];
  }, [events, showPast, showCancelled, today]);

  const card = (e: AjandaEvent) => {
    const meta = STATUS_META[e.status];
    return (
      <Card key={e.id} className="!p-3.5">
        <div className="flex flex-wrap items-start gap-3">
          <div className="w-[70px] flex-shrink-0">
            <p className="text-[15px] font-bold text-white">{e.allDay ? "Tüm gün" : fmtTime(e.startAt)}</p>
            {e.endAt && !e.allDay && <p className="text-[11px] text-[#8a8a9a]">– {fmtTime(e.endAt)}</p>}
          </div>
          <div className="flex-1 min-w-[180px]">
            <button onClick={() => onEdit(e)} className="text-left">
              <p className={`text-[14px] font-semibold ${e.status === "IPTAL" ? "line-through text-[#8a8a9a]" : "text-white"}`}>{e.title}</p>
            </button>
            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              <Chip color={meta.color}>{meta.label}</Chip>
              {e.clientName && <ClientLink chip slug={e.clientSlug} name={e.clientName} />}
              {e.locationName && (
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${e.clientName ?? ""} ${e.locationName} Ankara`.trim())}`}
                  target="_blank" rel="noopener noreferrer" className="text-[12px] text-[#8a8a9a] hover:underline" title="Haritada aç">📍 {e.locationName}</a>
              )}
              {e.clientId && !e.visibleToClient && <span className="text-[11px] text-[#8a8a9a]">· müşteriden gizli</span>}
            </div>
            {e.description && <p className="text-[12px] text-[#8a8a9a] mt-1.5 whitespace-pre-line">{e.description}</p>}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {e.status === "PLANLI" && <Btn small variant="ok" disabled={busy === e.id} onClick={() => onStatus(e, "TAMAMLANDI")}>✓ Gidildi</Btn>}
            {e.status === "PLANLI" && <Btn small disabled={busy === e.id} onClick={() => onStatus(e, "IPTAL")}>İptal</Btn>}
            {e.status !== "PLANLI" && <Btn small disabled={busy === e.id} onClick={() => onStatus(e, "PLANLI")}>Geri al</Btn>}
            <Btn small variant="danger" disabled={busy === e.id} onClick={() => onDelete(e)}>Sil</Btn>
          </div>
        </div>
      </Card>
    );
  };

  // ── Ay görünümü (v3.10.0) ── yüklü aralık: son 30 gün + önümüzdeki 60 gün
  const months = useMemo(() => {
    const set = new Set<string>([today.slice(0, 7), ...events.map((e) => dayKey(e.startAt).slice(0, 7))]);
    return [...set].sort();
  }, [events, today]);
  const byDay = useMemo(() => {
    const map = new Map<string, AjandaEvent[]>();
    for (const e of events) { if (e.status === "IPTAL") continue; const k = dayKey(e.startAt); map.set(k, [...(map.get(k) ?? []), e]); }
    return map;
  }, [events]);
  const [yy, mm] = month.split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(yy, mm, 0)).getUTCDate();
  const firstDow = (new Date(Date.UTC(yy, mm - 1, 1)).getUTCDay() + 6) % 7; // Pazartesi = 0
  const monthLabel = new Date(Date.UTC(yy, mm - 1, 15)).toLocaleDateString("tr-TR", { month: "long", year: "numeric" });
  const mi = months.indexOf(month);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          {(["liste", "ay"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} className="px-4 text-[12px] font-semibold min-h-[40px] sm:min-h-[32px]"
              style={view === v ? { background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "#fff" } : { background: "var(--bg)", color: "var(--fg, #c8c8d0)" }}>
              {v === "liste" ? "Liste" : "Ay"}
            </button>
          ))}
        </div>
        {view === "liste" && (
          <>
            <Btn small variant={showPast ? "primary" : "ghost"} onClick={() => setShowPast((v) => !v)}>{showPast ? "Geçmiş açık (son 30 gün)" : "Geçmişi göster"}</Btn>
            <Btn small variant={showCancelled ? "primary" : "ghost"} onClick={() => setShowCancelled((v) => !v)}>{showCancelled ? "İptaller görünüyor" : "İptalleri göster"}</Btn>
          </>
        )}
      </div>

      {view === "ay" && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <Btn small disabled={mi <= 0} onClick={() => setMonth(months[mi - 1])}>‹</Btn>
            <span className="text-[15px] font-bold text-white capitalize">{monthLabel}</span>
            <Btn small disabled={mi < 0 || mi >= months.length - 1} onClick={() => setMonth(months[mi + 1])}>›</Btn>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((d) => <div key={d} className="text-center text-[10px] font-semibold text-[#8a8a9a] py-1">{d}</div>)}
            {Array.from({ length: firstDow }, (_, i) => <div key={`b${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const k = `${month}-${String(i + 1).padStart(2, "0")}`;
              const list = byDay.get(k) ?? [];
              const sel = k === selectedDay;
              return (
                <button key={k} onClick={() => setSelectedDay(k)}
                  className="rounded-xl min-h-[52px] p-1 flex flex-col items-center justify-start gap-0.5"
                  style={{
                    background: sel ? "rgba(168,85,247,0.18)" : "var(--surface)",
                    border: `1px solid ${sel ? "rgba(168,85,247,0.6)" : k === today ? "rgba(168,85,247,0.35)" : "var(--border)"}`,
                  }}>
                  <span className="text-[12px] font-semibold" style={{ color: k === today ? "#a855f7" : "var(--fg, #fff)" }}>{i + 1}</span>
                  <span className="flex gap-0.5 flex-wrap justify-center">
                    {list.slice(0, 4).map((e) => <span key={e.id} className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_META[e.status].color }} />)}
                  </span>
                  {list.length > 0 && <span className="text-[9px] text-[#8a8a9a] leading-none">{list.length}</span>}
                </button>
              );
            })}
          </div>
          <p className="text-[12px] font-bold uppercase tracking-wide mb-2 text-[#8a8a9a]">{fmtDay(`${selectedDay}T12:00:00+03:00`)}</p>
          <div className="space-y-2">
            {(byDay.get(selectedDay) ?? []).map(card)}
            {!(byDay.get(selectedDay) ?? []).length && <Card><p className="text-[14px] text-[#8a8a9a]">Bu gün için ziyaret yok.</p></Card>}
          </div>
        </div>
      )}

      {view === "liste" && (
        <>
          {groups.length === 0 && <Card><p className="text-[14px] text-[#8a8a9a]">Planlı ziyaret yok.</p></Card>}
          <div className="space-y-5">
            {groups.map(([k, list]) => (
              <div key={k}>
                <p className="text-[12px] font-bold uppercase tracking-wide mb-2" style={{ color: k === today ? "#c084fc" : "#8a8a9a" }}>
                  {k === today ? "Bugün · " : ""}{fmtDay(list[0].startAt)}
                </p>
                <div className="space-y-2">{list.map(card)}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Ziyaret takibi ─────────────────────────────────────────
function VisitTab({ rows, onPlan }: { rows: VisitRow[]; onPlan: (r: VisitRow) => void }) {
  return (
    <div className="space-y-2">
      <p className="text-[12px] text-[#8a8a9a] mb-2">Son ziyaretten bu yana geçen güne göre sıralı. Bir ziyareti &ldquo;Gidildi&rdquo; işaretleyince firmanın son ziyaret tarihi otomatik güncellenir.</p>
      {rows.map((r) => {
        const color = r.overdue ? "#f87171" : (r.daysSince ?? 0) >= r.interval - 3 ? "#fbbf24" : "#34d399";
        return (
          <Card key={r.id} className="!p-3.5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[160px]">
                <Link href={`/musteri/${r.slug}`} className="text-[14px] font-semibold text-white hover:underline">{r.name}</Link>
                <p className="text-[12px] text-[#8a8a9a]">
                  Son ziyaret: {r.lastVisitAt ? fmtDate(r.lastVisitAt) : "kayıt yok"}
                  {r.nextVisitAt ? ` · Sonraki: ${fmtDay(r.nextVisitAt)} ${fmtTime(r.nextVisitAt)}` : " · planlı ziyaret yok"}
                </p>
              </div>
              <Chip color={color}>{r.daysSince === null ? "Hiç gidilmedi" : `${r.daysSince} gün`}</Chip>
              {!r.nextVisitAt && <Btn small variant="primary" onClick={() => onPlan(r)}>Ziyaret planla</Btn>}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// ── İşler ──────────────────────────────────────────────────
function TasksTab({ tasks, busy, filtered, onEdit, onToggle, onDelete }: {
  tasks: AjandaTask[]; filtered?: boolean; busy: string | null; onEdit: (t: AjandaTask) => void; onToggle: (t: AjandaTask) => void; onDelete: (t: AjandaTask) => void;
}) {
  const order = { ACIL: 0, YUKSEK: 1, ORTA: 2, DUSUK: 3 };
  const open = tasks.filter((t) => t.status !== "TAMAMLANDI").sort((a, b) => order[a.priority] - order[b.priority]);
  const done = tasks.filter((t) => t.status === "TAMAMLANDI");
  const row = (t: AjandaTask) => (
    <Card key={t.id} className="!p-3.5">
      <div className="flex items-start gap-3">
        <button onClick={() => onToggle(t)} disabled={busy === t.id} aria-label="Tamamlandı olarak işaretle"
          className="mt-0.5 w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center text-[13px]"
          style={{ border: "2px solid " + (t.status === "TAMAMLANDI" ? "#34d399" : "var(--border)"), background: t.status === "TAMAMLANDI" ? "rgba(52,211,153,0.15)" : "transparent", color: "#34d399" }}>
          {t.status === "TAMAMLANDI" ? "✓" : ""}
        </button>
        <div className="flex-1 min-w-0">
          <button onClick={() => onEdit(t)} className="text-left">
            <p className={`text-[14px] font-semibold ${t.status === "TAMAMLANDI" ? "line-through text-[#8a8a9a]" : "text-white"}`}>{t.title}</p>
          </button>
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            <Chip color={PRIORITY_META[t.priority].color}>{PRIORITY_META[t.priority].label}</Chip>
            {t.clientName && <ClientLink chip slug={t.clientSlug} name={t.clientName} />}
            {t.dueAt && <span className="text-[12px] text-[#8a8a9a]">⏰ {fmtDate(t.dueAt)}</span>}
            {t.clientId && !t.visibleToClient && <span className="text-[11px] text-[#8a8a9a]">· müşteriden gizli</span>}
          </div>
          {t.description && <p className="text-[12px] text-[#8a8a9a] mt-1.5 whitespace-pre-line">{t.description}</p>}
        </div>
        <Btn small variant="danger" disabled={busy === t.id} onClick={() => onDelete(t)}>Sil</Btn>
      </div>
    </Card>
  );
  return (
    <div>
      <div className="space-y-2">{open.length ? open.map(row) : <Card><p className="text-[14px] text-[#8a8a9a]">{filtered ? "Bu öncelikte açık iş yok." : "Açık iş yok 🎉"}</p></Card>}</div>
      {done.length > 0 && (
        <details className="mt-6">
          <summary className="text-[12px] font-bold uppercase tracking-wide text-[#8a8a9a] cursor-pointer mb-2">Son 14 günde tamamlananlar ({done.length})</summary>
          <div className="space-y-2">{done.map(row)}</div>
        </details>
      )}
    </div>
  );
}

// ── Notlar & hafıza ────────────────────────────────────────
function norm(s: string) {
  return s.toLocaleLowerCase("tr-TR");
}
function NotesTab({ notes, busy, onAdd, onEdit, onPin, onDelete }: {
  notes: AjandaNote[]; busy: string | null; onAdd: () => void; onEdit: (n: AjandaNote) => void; onPin: (n: AjandaNote) => void; onDelete: (n: AjandaNote) => void;
}) {
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<"ALL" | "NOT" | "HAFIZA">("ALL");
  const list = notes.filter((n) => (kind === "ALL" || n.kind === kind) &&
    (!q || norm(`${n.title} ${n.content} ${n.clientName ?? ""} ${n.tags.join(" ")}`).includes(norm(q))));
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Notlarda ara…" className={`${inputCls} !w-auto flex-1 min-w-[200px]`} style={inputStyle} />
        {(["ALL", "NOT", "HAFIZA"] as const).map((k) => (
          <Btn key={k} small variant={kind === k ? "primary" : "ghost"} onClick={() => setKind(k)}>
            {k === "ALL" ? `Tümü (${notes.length})` : k === "NOT" ? `Notlar (${notes.filter((n) => n.kind === "NOT").length})` : `Hafıza (${notes.filter((n) => n.kind === "HAFIZA").length})`}
          </Btn>
        ))}
        <Btn small variant="primary" onClick={onAdd}>+ Not</Btn>
      </div>
      <div className="grid sm:grid-cols-2 gap-2">
        {list.map((n) => (
          <Card key={n.id} className="!p-3.5">
            <div className="flex items-start gap-2 mb-1">
              <button onClick={() => onEdit(n)} className="text-left flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-white">{n.pinned ? "📌 " : ""}{n.title}</p>
              </button>
              <button onClick={() => onPin(n)} disabled={busy === n.id} className="text-[12px] text-[#8a8a9a] hover:text-white px-1" aria-label="Sabitle">{n.pinned ? "Bırak" : "Sabitle"}</button>
              <button onClick={() => onDelete(n)} disabled={busy === n.id} className="text-[12px] text-[#f87171] px-1">Sil</button>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              <Chip color={n.kind === "HAFIZA" ? "#2dd4bf" : "#60a5fa"}>{n.kind === "HAFIZA" ? "Hafıza" : "Not"}</Chip>
              {n.clientName && <ClientLink chip slug={n.clientSlug} name={n.clientName} />}
              {n.visibleToClient && <Chip color="#34d399">Müşteri görüyor</Chip>}
              {n.category && <span className="text-[11px] text-[#8a8a9a]">{n.category}</span>}
            </div>
            <p className="text-[12px] text-[#c8c8d0] whitespace-pre-line line-clamp-6">{n.content}</p>
          </Card>
        ))}
      </div>
      {list.length === 0 && <Card><p className="text-[14px] text-[#8a8a9a]">Eşleşen not yok.</p></Card>}
    </div>
  );
}

// ── Formlar ────────────────────────────────────────────────
function ClientSelect({ value, onChange, clients }: { value: string; onChange: (v: string) => void; clients: { id: string; name: string }[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} style={inputStyle}>
      <option value="" style={{ background: "var(--surface)" }}>— Firmasız —</option>
      {clients.map((c) => <option key={c.id} value={c.id} style={{ background: "var(--surface)" }}>{c.name}</option>)}
    </select>
  );
}

function EventForm({ initial, clients, nowIso, busy, onClose, onSave }: {
  initial: Partial<AjandaEvent>; clients: { id: string; name: string }[]; nowIso: string; busy: boolean; onClose: () => void; onSave: (b: Record<string, unknown>) => void;
}) {
  const defaultStart = () => {
    const d = new Date(new Date(nowIso).getTime() + 86_400_000);
    return `${d.toLocaleDateString("en-CA", { timeZone: TZ })}T10:00`;
  };
  const [title, setTitle] = useState(initial.title ?? "");
  const [clientId, setClientId] = useState(initial.clientId ?? "");
  const [start, setStart] = useState(initial.startAt ? toLocalInput(initial.startAt) : defaultStart());
  const [duration, setDuration] = useState(() => initial.startAt && initial.endAt ? Math.round((+new Date(initial.endAt) - +new Date(initial.startAt)) / 60000) : 150);
  const [allDay, setAllDay] = useState(initial.allDay ?? false);
  const [locationName, setLocationName] = useState(initial.locationName ?? "");
  const [description, setDescription] = useState(initial.description ?? "");
  const [clientNote, setClientNote] = useState(initial.clientNote ?? "");
  const [visible, setVisible] = useState(initial.visibleToClient ?? true);

  function pickClient(id: string) {
    setClientId(id);
    const c = clients.find((x) => x.id === id);
    if (c && !title.trim()) setTitle(`${c.name} Çekim / Ziyaret`);
  }

  return (
    <Modal dismissable={false} title={initial.id ? "Ziyareti düzenle" : "Yeni ziyaret / etkinlik"} onClose={onClose}>
      <form className="space-y-3" onSubmit={(e) => {
        e.preventDefault();
        const startAt = new Date(start);
        onSave({
          title: title.trim(), clientId: clientId || null, startAt: startAt.toISOString(),
          endAt: allDay ? null : new Date(startAt.getTime() + duration * 60000).toISOString(),
          allDay, locationName: locationName.trim() || null, description: description.trim() || null,
          clientNote: clientNote.trim() || null, visibleToClient: visible,
        });
      }}>
        <Field label="Firma"><ClientSelect value={clientId} onChange={pickClient} clients={clients} /></Field>
        <Field label="Başlık"><input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} style={inputStyle} placeholder="Firma Çekim / Ziyaret" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Başlangıç"><input type="datetime-local" required value={start} onChange={(e) => setStart(e.target.value)} className={inputCls} style={inputStyle} /></Field>
          <Field label="Süre (dk)"><input type="number" min={15} step={15} value={duration} disabled={allDay} onChange={(e) => setDuration(Number(e.target.value) || 150)} className={inputCls} style={inputStyle} /></Field>
        </div>
        <label className="flex items-center gap-2 text-[13px] text-[#c8c8d0]"><input type="checkbox" checked={allDay} onChange={(e) => setAllDay(e.target.checked)} /> Tüm gün</label>
        <Field label="Konum"><input value={locationName} onChange={(e) => setLocationName(e.target.value)} className={inputCls} style={inputStyle} placeholder="Siteler" /></Field>
        <Field label="Açıklama (yalnızca sen görürsün)"><textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className={inputCls} style={inputStyle} /></Field>
        {clientId && (
          <>
            <label className="flex items-center gap-2 text-[13px] text-[#c8c8d0]"><input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} /> Müşteri panelinde görünsün</label>
            {visible && <Field label="Müşteriye not (opsiyonel)"><input value={clientNote} onChange={(e) => setClientNote(e.target.value)} className={inputCls} style={inputStyle} placeholder="Kampanya çekimi yapılacak" /></Field>}
          </>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <Btn onClick={onClose}>Vazgeç</Btn>
          <Btn type="submit" variant="primary" disabled={busy}>{busy ? "Kaydediliyor…" : "Kaydet"}</Btn>
        </div>
      </form>
    </Modal>
  );
}

function TaskForm({ initial, clients, busy, onClose, onSave }: {
  initial: Partial<AjandaTask>; clients: { id: string; name: string }[]; busy: boolean; onClose: () => void; onSave: (b: Record<string, unknown>) => void;
}) {
  const [title, setTitle] = useState(initial.title ?? "");
  const [clientId, setClientId] = useState(initial.clientId ?? "");
  const [priority, setPriority] = useState<AjandaTask["priority"]>(initial.priority ?? "ORTA");
  const [dueAt, setDueAt] = useState(initial.dueAt ? new Date(initial.dueAt).toLocaleDateString("en-CA", { timeZone: TZ }) : "");
  const [description, setDescription] = useState(initial.description ?? "");
  const [visible, setVisible] = useState(initial.visibleToClient ?? true);
  return (
    <Modal dismissable={false} title={initial.id ? "İşi düzenle" : "Yeni iş"} onClose={onClose}>
      <form className="space-y-3" onSubmit={(e) => {
        e.preventDefault();
        onSave({
          title: title.trim(), clientId: clientId || null, priority,
          dueAt: dueAt ? new Date(`${dueAt}T18:00`).toISOString() : null,
          description: description.trim() || null, visibleToClient: visible,
        });
      }}>
        <Field label="İş"><input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} style={inputStyle} /></Field>
        <Field label="Firma"><ClientSelect value={clientId} onChange={setClientId} clients={clients} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Öncelik">
            <select value={priority} onChange={(e) => setPriority(e.target.value as AjandaTask["priority"])} className={inputCls} style={inputStyle}>
              {(Object.keys(PRIORITY_META) as AjandaTask["priority"][]).map((p) => <option key={p} value={p} style={{ background: "var(--surface)" }}>{PRIORITY_META[p].label}</option>)}
            </select>
          </Field>
          <Field label="Son tarih"><input type="date" value={dueAt} onChange={(e) => setDueAt(e.target.value)} className={inputCls} style={inputStyle} /></Field>
        </div>
        <Field label="Açıklama"><textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className={inputCls} style={inputStyle} /></Field>
        {clientId && <label className="flex items-center gap-2 text-[13px] text-[#c8c8d0]"><input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} /> Müşteri panelinde görünsün</label>}
        <div className="flex justify-end gap-2 pt-2">
          <Btn onClick={onClose}>Vazgeç</Btn>
          <Btn type="submit" variant="primary" disabled={busy}>{busy ? "Kaydediliyor…" : "Kaydet"}</Btn>
        </div>
      </form>
    </Modal>
  );
}

function NoteForm({ initial, clients, busy, onClose, onSave }: {
  initial: Partial<AjandaNote>; clients: { id: string; name: string }[]; busy: boolean; onClose: () => void; onSave: (b: Record<string, unknown>) => void;
}) {
  const [title, setTitle] = useState(initial.title ?? "");
  const [content, setContent] = useState(initial.content ?? "");
  const [kind, setKind] = useState<AjandaNote["kind"]>(initial.kind ?? "NOT");
  const [clientId, setClientId] = useState(initial.clientId ?? "");
  const [visible, setVisible] = useState(initial.visibleToClient ?? false);
  return (
    <Modal dismissable={false} title={initial.id ? "Notu düzenle" : "Yeni not"} onClose={onClose}>
      <form className="space-y-3" onSubmit={(e) => {
        e.preventDefault();
        onSave({ title: title.trim(), content: content.trim(), kind, clientId: clientId || null, visibleToClient: !!clientId && visible });
      }}>
        <Field label="Başlık"><input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} style={inputStyle} /></Field>
        <Field label="İçerik"><textarea required rows={8} value={content} onChange={(e) => setContent(e.target.value)} className={inputCls} style={inputStyle} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tür">
            <select value={kind} onChange={(e) => setKind(e.target.value as AjandaNote["kind"])} className={inputCls} style={inputStyle}>
              <option value="NOT" style={{ background: "var(--surface)" }}>Not</option>
              <option value="HAFIZA" style={{ background: "var(--surface)" }}>Hafıza (kural / karar)</option>
            </select>
          </Field>
          <Field label="Firma"><ClientSelect value={clientId} onChange={setClientId} clients={clients} /></Field>
        </div>
        {clientId ? (
          <label className="flex items-start gap-2 text-[13px] text-[#c8c8d0]">
            <input type="checkbox" className="mt-0.5" checked={visible} onChange={(e) => setVisible(e.target.checked)} />
            <span>Müşteri kendi panelinde görsün <span className="block text-[11px] text-[#8a8a9a]">Ör. sabit Instagram metni, adres/telefon bilgisi. İç notları (bütçe, ajans anlaşmaları) işaretleme.</span></span>
          </label>
        ) : (
          <p className="text-[11px] text-[#8a8a9a]">Firmasız notlar müşteriye hiçbir zaman gösterilmez.</p>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <Btn onClick={onClose}>Vazgeç</Btn>
          <Btn type="submit" variant="primary" disabled={busy}>{busy ? "Kaydediliyor…" : "Kaydet"}</Btn>
        </div>
      </form>
    </Modal>
  );
}
