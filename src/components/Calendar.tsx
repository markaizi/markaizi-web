"use client";

import { useState, useEffect, useCallback } from "react";

export interface CalendarItem {
  id: string;
  clientId: string;
  clientName: string;
  clientSlug: string;
  title: string;
  description?: string | null;
  scheduledDate: string; // "YYYY-MM-DD"
  status: "PLANLANDI" | "DUZENLENIYOR" | "HAZIR" | "YAYINLANDI";
}

interface ClientOption { id: string; slug: string; name: string; }

// ── Renkler ───────────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<string, string> = {
  PLANLANDI: "Planlandı", DUZENLENIYOR: "Düzenleniyor", HAZIR: "Hazır", YAYINLANDI: "Yayınlandı",
};
const STATUS_COLOR: Record<string, string> = {
  PLANLANDI: "#8a8a9a", DUZENLENIYOR: "#fbbf24", HAZIR: "#60a5fa", YAYINLANDI: "#34d399",
};
const STATUS_BG: Record<string, string> = {
  PLANLANDI: "rgba(138,138,154,0.18)", DUZENLENIYOR: "rgba(251,191,36,0.18)",
  HAZIR: "rgba(96,165,250,0.18)", YAYINLANDI: "rgba(52,211,153,0.18)",
};
const CLIENT_PALETTE     = ["#c084fc","#60a5fa","#34d399","#f472b6","#fb923c","#a78bfa","#38bdf8","#4ade80"];
const CLIENT_PALETTE_BG  = [
  "rgba(192,132,252,0.18)","rgba(96,165,250,0.18)","rgba(52,211,153,0.18)","rgba(244,114,182,0.18)",
  "rgba(251,146,60,0.18)","rgba(167,139,250,0.18)","rgba(56,189,248,0.18)","rgba(74,222,128,0.18)",
];

function slugHash(slug: string) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) & 0xffff;
  return h % CLIENT_PALETTE.length;
}

// ── Tarih yardımcıları ────────────────────────────────────────────────────────

const TR_MONTHS   = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
const TR_DAYS_S   = ["Pt","Sa","Ça","Pe","Cu","Ct","Pa"];
const TR_DAYS_L   = ["Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi","Pazar"];

function pad(n: number) { return String(n).padStart(2, "0"); }
function toYMD(d: Date) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function addDays(d: Date, n: number) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function weekStart(d: Date) {
  const r = new Date(d);
  const wd = (r.getDay() + 6) % 7;
  r.setDate(r.getDate() - wd);
  r.setHours(0, 0, 0, 0);
  return r;
}
function daysInMonth(y: number, m: number) { return new Date(y, m, 0).getDate(); }
function firstWeekday(y: number, m: number) { return (new Date(y, m - 1, 1).getDay() + 6) % 7; }

// ── Tipler ────────────────────────────────────────────────────────────────────

type ViewMode = "monthly" | "weekly" | "daily";
type ContentStatus = "PLANLANDI" | "DUZENLENIYOR" | "HAZIR" | "YAYINLANDI";

export interface CalendarProps {
  clientSlug?: string;
  showClientName?: boolean;
  canEdit?: boolean;
}

// ── İçerik Modal ─────────────────────────────────────────────────────────────

interface ModalState {
  mode: "create" | "edit";
  item?: CalendarItem;
  date?: string;
}

function ContentModal({
  state, clientSlug, showClientName, clients, onClose, onSaved, onDeleted,
}: {
  state: ModalState;
  clientSlug?: string;
  showClientName: boolean;
  clients: ClientOption[];
  onClose: () => void;
  onSaved: (item: CalendarItem) => void;
  onDeleted: (id: string) => void;
}) {
  const isEdit = state.mode === "edit";
  const [title, setTitle] = useState(isEdit ? (state.item?.title ?? "") : "");
  const [description, setDescription] = useState(isEdit ? (state.item?.description ?? "") : "");
  const [status, setStatus] = useState<ContentStatus>(isEdit ? (state.item?.status ?? "PLANLANDI") : "PLANLANDI");
  const [date, setDate] = useState(isEdit ? (state.item?.scheduledDate ?? "") : (state.date ?? ""));
  const [selSlug, setSelSlug] = useState(() => {
    if (clientSlug) return clientSlug;
    if (isEdit) return state.item?.clientSlug ?? "";
    return clients[0]?.slug ?? "";
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [err, setErr] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return setErr("Başlık zorunlu.");
    if (!date) return setErr("Tarih zorunlu.");
    if (!selSlug) return setErr("Firma seçin.");
    setSaving(true); setErr("");
    try {
      if (isEdit && state.item) {
        const res = await fetch(`/api/musteri/admin/content/${state.item.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: title.trim(), description: description.trim() || null, scheduledDate: date, status }),
        });
        const data = await res.json();
        if (!res.ok) { setSaving(false); return setErr(data.error ?? "Hata oluştu."); }
        onSaved({ ...state.item, title: title.trim(), description: description.trim() || null, scheduledDate: date, status });
      } else {
        const res = await fetch(`/api/musteri/admin/clients/${selSlug}/content`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: title.trim(), description: description.trim() || null, scheduledDate: date, status }),
        });
        const data = await res.json();
        if (!res.ok) { setSaving(false); return setErr(data.error ?? "Hata oluştu."); }
        const found = clients.find(c => c.slug === selSlug);
        onSaved({
          id: data.id,
          clientId: found?.id ?? "",
          clientName: found?.name ?? selSlug,
          clientSlug: selSlug,
          title: title.trim(),
          description: description.trim() || null,
          scheduledDate: date,
          status,
        });
      }
      onClose();
    } catch { setErr("Ağ hatası."); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!state.item) return;
    if (!confirm("Bu içerik planını silmek istediğinize emin misiniz?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/musteri/admin/content/${state.item.id}`, { method: "DELETE" });
      if (!res.ok) { const d = await res.json(); setDeleting(false); return setErr(d.error ?? "Silinemedi."); }
      onDeleted(state.item.id);
      onClose();
    } catch { setErr("Ağ hatası."); }
    finally { setDeleting(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-md rounded-2xl p-6 space-y-4"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>

        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-white">
            {isEdit ? "İçerik Düzenle" : "Yeni İçerik Planla"}
          </h2>
          <button onClick={onClose} className="text-[#555] hover:text-white transition-colors text-[22px] leading-none">×</button>
        </div>

        <form onSubmit={handleSave} className="space-y-3">
          {/* Firma seçici — sadece çok firmalı admin görünümünde, create modunda */}
          {showClientName && !isEdit && clients.length > 0 && (
            <div>
              <label className="block text-[11px] text-[#8a8a9a] mb-1.5 font-medium uppercase tracking-wide">Firma</label>
              <select value={selSlug} onChange={e => setSelSlug(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-[13px] text-white outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                {clients.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
          )}

          <div>
            <label className="block text-[11px] text-[#8a8a9a] mb-1.5 font-medium uppercase tracking-wide">Başlık</label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="İçerik başlığı..."
              className="w-full rounded-xl px-3 py-2.5 text-[13px] text-white placeholder-[#555] outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }} />
          </div>

          <div>
            <label className="block text-[11px] text-[#8a8a9a] mb-1.5 font-medium uppercase tracking-wide">Açıklama (isteğe bağlı)</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Kısa not..." rows={2}
              className="w-full rounded-xl px-3 py-2.5 text-[13px] text-white placeholder-[#555] outline-none resize-none"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-[#8a8a9a] mb-1.5 font-medium uppercase tracking-wide">Tarih</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-[13px] text-white outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border)", colorScheme: "dark" }} />
            </div>
            <div>
              <label className="block text-[11px] text-[#8a8a9a] mb-1.5 font-medium uppercase tracking-wide">Durum</label>
              <select value={status} onChange={e => setStatus(e.target.value as ContentStatus)}
                className="w-full rounded-xl px-3 py-2.5 text-[13px] text-white outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                {(["PLANLANDI","DUZENLENIYOR","HAZIR","YAYINLANDI"] as ContentStatus[]).map(s => (
                  <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                ))}
              </select>
            </div>
          </div>

          {err && <p className="text-[12px] text-red-400">{err}</p>}

          <div className="flex items-center gap-3 pt-1">
            {isEdit && (
              <button type="button" onClick={handleDelete} disabled={deleting}
                className="px-4 py-2 rounded-xl text-[13px] font-medium transition-colors"
                style={{ background: "rgba(248,113,113,0.12)", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }}>
                {deleting ? "Siliniyor..." : "Sil"}
              </button>
            )}
            <button type="button" onClick={onClose}
              className="ml-auto px-4 py-2 rounded-xl text-[13px] font-medium text-[#8a8a9a] transition-colors hover:text-white"
              style={{ border: "1px solid var(--border)" }}>
              İptal
            </button>
            <button type="submit" disabled={saving}
              className="px-5 py-2 rounded-xl text-[13px] font-semibold text-white transition-all"
              style={{ background: saving ? "rgba(168,85,247,0.4)" : "rgba(168,85,247,0.85)", border: "1px solid rgba(168,85,247,0.4)" }}>
              {saving ? "Kaydediliyor..." : isEdit ? "Kaydet" : "Planla"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Ana bileşen ───────────────────────────────────────────────────────────────

export default function Calendar({ showClientName = false, clientSlug, canEdit = false }: CalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [view,    setView]    = useState<ViewMode>("monthly");
  const [year,    setYear]    = useState(today.getFullYear());
  const [month,   setMonth]   = useState(today.getMonth() + 1);
  const [wStart,  setWStart]  = useState(() => weekStart(today));
  const [dayDate, setDayDate] = useState(today);
  const [items,   setItems]   = useState<CalendarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selDay,  setSelDay]  = useState<string | null>(null);
  const [modal,   setModal]   = useState<ModalState | null>(null);
  const [dragId,  setDragId]  = useState<string | null>(null);
  const [clients, setClients] = useState<ClientOption[]>([]);

  const fetchItems = useCallback(async (from: string, to: string) => {
    setLoading(true);
    try {
      const slug = clientSlug ? `&clientSlug=${encodeURIComponent(clientSlug)}` : "";
      const res = await fetch(`/api/musteri/calendar?from=${from}&to=${to}${slug}`);
      const data = await res.json();
      setItems(data.items ?? []);
    } catch { setItems([]); }
    finally { setLoading(false); }
  }, [clientSlug]);

  // Admin global takvimdeyken firma listesini çek
  useEffect(() => {
    if (!canEdit || !showClientName) return;
    fetch("/api/musteri/admin/clients")
      .then(r => r.json())
      .then(d => setClients((d.clients ?? []).map((c: { id: string; slug: string; name: string }) => ({ id: c.id, slug: c.slug, name: c.name }))))
      .catch(() => {});
  }, [canEdit, showClientName]);

  useEffect(() => {
    if (view === "monthly") {
      fetchItems(`${year}-${pad(month)}-01`, toYMD(new Date(year, month, 1)));
    } else if (view === "weekly") {
      fetchItems(toYMD(wStart), toYMD(addDays(wStart, 7)));
    } else {
      fetchItems(toYMD(dayDate), toYMD(addDays(dayDate, 1)));
    }
  }, [view, year, month, wStart, dayDate, fetchItems]);

  const byDate = new Map<string, CalendarItem[]>();
  for (const item of items) {
    const arr = byDate.get(item.scheduledDate) ?? [];
    arr.push(item);
    byDate.set(item.scheduledDate, arr);
  }

  const todayStr = toYMD(today);

  function prevMonth() { if (month === 1) { setYear(y => y - 1); setMonth(12); } else setMonth(m => m - 1); setSelDay(null); }
  function nextMonth() { if (month === 12) { setYear(y => y + 1); setMonth(1); } else setMonth(m => m + 1); setSelDay(null); }
  function goToday() { setYear(today.getFullYear()); setMonth(today.getMonth() + 1); setWStart(weekStart(today)); setDayDate(today); setSelDay(null); }
  function prevWeek() { setWStart(d => addDays(d, -7)); setSelDay(null); }
  function nextWeek() { setWStart(d => addDays(d, 7)); setSelDay(null); }
  function prevDay()  { setDayDate(d => addDays(d, -1)); }
  function nextDay()  { setDayDate(d => addDays(d, 1)); }

  function switchView(v: ViewMode) {
    if (v === "weekly") setWStart(weekStart(new Date(year, month - 1, 1)));
    if (v === "daily")  setDayDate(new Date(year, month - 1, 1));
    setView(v); setSelDay(null);
  }

  const title =
    view === "monthly" ? `${TR_MONTHS[month - 1]} ${year}` :
    view === "weekly"  ? (() => {
      const e = addDays(wStart, 6);
      return wStart.getMonth() === e.getMonth()
        ? `${wStart.getDate()}–${e.getDate()} ${TR_MONTHS[wStart.getMonth()]} ${wStart.getFullYear()}`
        : `${wStart.getDate()} ${TR_MONTHS[wStart.getMonth()]} – ${e.getDate()} ${TR_MONTHS[e.getMonth()]} ${e.getFullYear()}`;
    })()
    : `${dayDate.getDate()} ${TR_MONTHS[dayDate.getMonth()]} ${dayDate.getFullYear()} ${TR_DAYS_L[(dayDate.getDay() + 6) % 7]}`;

  function openCreate(date: string) {
    if (!canEdit) return;
    setModal({ mode: "create", date });
  }
  function openEdit(item: CalendarItem) {
    if (!canEdit) return;
    setModal({ mode: "edit", item });
  }
  function handleSaved(item: CalendarItem) {
    setItems(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) return prev.map(i => i.id === item.id ? item : i);
      return [...prev, item];
    });
  }
  function handleDeleted(id: string) {
    setItems(prev => prev.filter(i => i.id !== id));
  }

  // Drag & drop: scheduledDate güncelleme
  async function handleDrop(targetDate: string) {
    if (!dragId) return;
    const item = items.find(i => i.id === dragId);
    if (!item || item.scheduledDate === targetDate) { setDragId(null); return; }
    const prevDate = item.scheduledDate;
    setItems(prev => prev.map(i => i.id === dragId ? { ...i, scheduledDate: targetDate } : i));
    setDragId(null);
    try {
      const res = await fetch(`/api/musteri/admin/content/${dragId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduledDate: targetDate }),
      });
      if (!res.ok) setItems(prev => prev.map(i => i.id === dragId ? { ...i, scheduledDate: prevDate } : i));
    } catch {
      setItems(prev => prev.map(i => i.id === dragId ? { ...i, scheduledDate: prevDate } : i));
    }
  }

  // clientSlug-only görünümde clients listesi item'dan türet
  const effectiveClients: ClientOption[] = showClientName
    ? clients
    : clientSlug
      ? (items.length > 0
          ? [{ id: items[0].clientId, slug: clientSlug, name: items[0].clientName }]
          : [{ id: "", slug: clientSlug, name: clientSlug }])
      : [];

  return (
    <div>
      {modal && (
        <ContentModal
          state={modal}
          clientSlug={clientSlug}
          showClientName={showClientName}
          clients={effectiveClients}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
        />
      )}

      {/* ── Kontrol satırı ── */}
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          {(["monthly","weekly","daily"] as ViewMode[]).map((v) => (
            <button key={v} onClick={() => switchView(v)}
              className="px-3 py-2 text-[12px] font-medium transition-colors"
              style={{
                background: view === v ? "rgba(168,85,247,0.2)" : "transparent",
                color: view === v ? "#c084fc" : "#8a8a9a",
                borderRight: v !== "daily" ? "1px solid var(--border)" : "none",
              }}>
              {v === "monthly" ? "Aylık" : v === "weekly" ? "Haftalık" : "Günlük"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={view === "monthly" ? prevMonth : view === "weekly" ? prevWeek : prevDay}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-white/[0.06]"
            style={{ border: "1px solid var(--border)", color: "#8a8a9a" }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className="text-[14px] font-bold text-white min-w-[160px] text-center">{title}</span>
          <button onClick={view === "monthly" ? nextMonth : view === "weekly" ? nextWeek : nextDay}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-white/[0.06]"
            style={{ border: "1px solid var(--border)", color: "#8a8a9a" }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {loading && <span className="text-[11px] text-[#555]">Yükleniyor...</span>}
          {canEdit && (
            <button
              onClick={() => {
                const d = view === "monthly" ? `${year}-${pad(month)}-01`
                        : view === "weekly"  ? toYMD(wStart)
                        : toYMD(dayDate);
                openCreate(d);
              }}
              className="text-[12px] px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 font-medium"
              style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)", color: "#c084fc" }}>
              + İçerik Ekle
            </button>
          )}
          <button onClick={goToday}
            className="text-[12px] px-3 py-1.5 rounded-lg transition-colors"
            style={{ border: "1px solid var(--border)", color: "#8a8a9a" }}
            onMouseEnter={e => (e.currentTarget.style.color="#fff")}
            onMouseLeave={e => (e.currentTarget.style.color="#8a8a9a")}>
            Bugün
          </button>
        </div>
      </div>

      {view === "monthly" && (
        <MonthlyView
          year={year} month={month} byDate={byDate}
          todayStr={todayStr} selDay={selDay} setSelDay={setSelDay}
          showClientName={showClientName} items={items} loading={loading}
          canEdit={canEdit} onDayClick={openCreate} onItemClick={openEdit}
          dragId={dragId} setDragId={setDragId} onDrop={handleDrop}
        />
      )}
      {view === "weekly" && (
        <WeeklyView
          wStart={wStart} byDate={byDate}
          todayStr={todayStr} showClientName={showClientName}
          loading={loading} items={items}
          canEdit={canEdit} onDayClick={openCreate} onItemClick={openEdit}
          dragId={dragId} setDragId={setDragId} onDrop={handleDrop}
        />
      )}
      {view === "daily" && (
        <DailyView
          dayDate={dayDate} setDayDate={setDayDate}
          items={items} todayStr={todayStr}
          showClientName={showClientName} loading={loading}
          wStart={wStart}
          canEdit={canEdit} onDayClick={openCreate} onItemClick={openEdit}
        />
      )}
    </div>
  );
}

// ── İçerik kartı (paylaşılan) ─────────────────────────────────────────────────

function ItemChip({
  item, showClientName, canEdit, onItemClick, onDragStart, onDragEnd, compact = false,
}: {
  item: CalendarItem;
  showClientName: boolean;
  canEdit: boolean;
  onItemClick: (item: CalendarItem) => void;
  onDragStart?: (id: string) => void;
  onDragEnd?: () => void;
  compact?: boolean;
}) {
  const color = showClientName ? CLIENT_PALETTE[slugHash(item.clientSlug)] : STATUS_COLOR[item.status];
  const bg    = showClientName ? CLIENT_PALETTE_BG[slugHash(item.clientSlug)] : STATUS_BG[item.status];

  if (compact) {
    return (
      <div
        draggable={canEdit}
        onDragStart={canEdit ? (e) => { e.stopPropagation(); onDragStart?.(item.id); } : undefined}
        onDragEnd={canEdit ? onDragEnd : undefined}
        onClick={canEdit ? (e) => { e.stopPropagation(); onItemClick(item); } : undefined}
        className={`text-[10px] font-medium px-1.5 py-0.5 rounded truncate leading-4 ${canEdit ? "cursor-pointer hover:opacity-80 active:opacity-60 transition-opacity" : ""}`}
        style={{ background: bg, color }}>
        {showClientName ? item.clientName : item.title}
      </div>
    );
  }

  return (
    <div
      draggable={canEdit}
      onDragStart={canEdit ? (e) => { e.stopPropagation(); onDragStart?.(item.id); } : undefined}
      onDragEnd={canEdit ? onDragEnd : undefined}
      onClick={canEdit ? (e) => { e.stopPropagation(); onItemClick(item); } : undefined}
      className={`flex items-start gap-2 rounded-xl p-3 transition-all ${canEdit ? "cursor-pointer hover:brightness-110 active:scale-[0.98]" : ""}`}
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <div className="flex-1 min-w-0">
        <p className="text-white text-[13px] font-semibold leading-snug truncate">{item.title}</p>
        {showClientName && (
          <p className="text-[11px] mt-0.5 truncate" style={{ color }}>{item.clientName}</p>
        )}
        {item.description && (
          <p className="text-[11px] mt-0.5 line-clamp-1" style={{ color: "#666" }}>{item.description}</p>
        )}
      </div>
      <span className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 font-medium mt-0.5"
        style={{ background: STATUS_BG[item.status], color: STATUS_COLOR[item.status] }}>
        {STATUS_LABEL[item.status]}
      </span>
    </div>
  );
}

// ── Aylık Görünüm ─────────────────────────────────────────────────────────────

function MonthlyView({ year, month, byDate, todayStr, selDay, setSelDay, showClientName, items, loading, canEdit, onDayClick, onItemClick, dragId, setDragId, onDrop }: {
  year: number; month: number;
  byDate: Map<string, CalendarItem[]>;
  todayStr: string; selDay: string | null; setSelDay: (d: string | null) => void;
  showClientName: boolean; items: CalendarItem[]; loading: boolean;
  canEdit: boolean; onDayClick: (d: string) => void; onItemClick: (i: CalendarItem) => void;
  dragId: string | null; setDragId: (id: string | null) => void; onDrop: (d: string) => void;
}) {
  const [dragOver, setDragOver] = useState<string | null>(null);
  const totalDays = daysInMonth(year, month);
  const startWd   = firstWeekday(year, month);

  return (
    <>
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        <div className="grid grid-cols-7" style={{ background: "var(--surface-2,#0a0a0f)", borderBottom: "1px solid var(--border)" }}>
          {["Pt","Sa","Ça","Pe","Cu","Ct","Pa"].map(d => (
            <div key={d} className="py-2.5 text-center text-[11px] font-bold uppercase tracking-wider text-[#555]">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7" style={{ background: "var(--bg)" }}>
          {Array.from({ length: startWd }).map((_, i) => (
            <div key={`e${i}`} className="min-h-[72px] sm:min-h-[90px]"
              style={{ borderRight:"1px solid var(--border)", borderBottom:"1px solid var(--border)", background:"rgba(255,255,255,0.01)" }}/>
          ))}
          {Array.from({ length: totalDays }).map((_, i) => {
            const day       = i + 1;
            const dateStr   = `${year}-${pad(month)}-${pad(day)}`;
            const dayItems  = byDate.get(dateStr) ?? [];
            const isToday   = dateStr === todayStr;
            const isSel     = selDay === dateStr;
            const isDragTgt = dragOver === dateStr && dragId !== null;
            const col       = (startWd + i) % 7;
            return (
              <div key={day}
                onClick={() => {
                  if (canEdit && dayItems.length === 0) { onDayClick(dateStr); return; }
                  setSelDay(isSel ? null : dateStr);
                }}
                onDragOver={canEdit ? (e) => { e.preventDefault(); setDragOver(dateStr); } : undefined}
                onDragLeave={canEdit ? () => setDragOver(null) : undefined}
                onDrop={canEdit ? (e) => { e.preventDefault(); setDragOver(null); onDrop(dateStr); } : undefined}
                className="min-h-[72px] sm:min-h-[90px] p-2 transition-colors"
                style={{
                  borderRight: col === 6 ? "none" : "1px solid var(--border)",
                  borderBottom: "1px solid var(--border)",
                  background: isDragTgt ? "rgba(168,85,247,0.15)" : isSel ? "rgba(168,85,247,0.08)" : "transparent",
                  cursor: canEdit ? "pointer" : "default",
                  outline: isDragTgt ? "2px dashed rgba(168,85,247,0.5)" : "none",
                  outlineOffset: "-2px",
                }}
                onMouseEnter={e => { if (!isSel && !isDragTgt) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                onMouseLeave={e => { if (!isSel && !isDragTgt) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="w-6 h-6 flex items-center justify-center rounded-full text-[12px] font-semibold"
                    style={isToday ? { background:"rgba(168,85,247,0.9)", color:"#fff" }
                                   : { color: isSel ? "#c084fc" : "#8a8a9a" }}>
                    {day}
                  </span>
                  <div className="flex items-center gap-1">
                    {dayItems.length > 1 && <span className="text-[10px] text-[#555]">{dayItems.length}</span>}
                    {canEdit && (
                      <button type="button"
                        onClick={(e) => { e.stopPropagation(); onDayClick(dateStr); }}
                        className="w-5 h-5 flex items-center justify-center rounded transition-all text-[#444] hover:text-[#c084fc] hover:bg-purple-500/10 text-[14px] leading-none"
                        title="İçerik ekle">+</button>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  {dayItems.slice(0, 3).map(item => (
                    <ItemChip key={item.id} item={item} showClientName={showClientName} canEdit={canEdit}
                      compact onItemClick={onItemClick}
                      onDragStart={setDragId} onDragEnd={() => setDragId(null)} />
                  ))}
                  {dayItems.length > 3 && <div className="text-[10px] text-[#555] px-1">+{dayItems.length - 3}</div>}
                </div>
              </div>
            );
          })}
          {(() => {
            const last = (startWd + totalDays - 1) % 7;
            const rem  = last === 6 ? 0 : 6 - last;
            return Array.from({ length: rem }).map((_, i) => (
              <div key={`t${i}`} className="min-h-[72px] sm:min-h-[90px]"
                style={{ borderRight: i < rem - 1 ? "1px solid var(--border)" : "none",
                         borderBottom:"1px solid var(--border)", background:"rgba(255,255,255,0.01)" }}/>
            ));
          })()}
        </div>
      </div>

      {/* Seçili gün detayı */}
      {selDay && (
        <div className="mt-4 rounded-2xl p-5 space-y-3" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold text-[#8a8a9a]">
              {new Date(selDay + "T12:00:00").toLocaleDateString("tr-TR", { day:"numeric", month:"long", year:"numeric" })}
            </p>
            {canEdit && (
              <button onClick={() => onDayClick(selDay)}
                className="text-[12px] px-3 py-1 rounded-lg font-medium transition-colors"
                style={{ background: "rgba(168,85,247,0.12)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.2)" }}>
                + Ekle
              </button>
            )}
          </div>
          {(byDate.get(selDay) ?? []).length === 0
            ? <p className="text-[13px] text-[#555]">Bu günde içerik yok.</p>
            : (byDate.get(selDay) ?? []).map(item => (
                <ItemChip key={item.id} item={item} showClientName={showClientName} canEdit={canEdit}
                  onItemClick={onItemClick} onDragStart={setDragId} onDragEnd={() => setDragId(null)} />
              ))
          }
        </div>
      )}

      {!loading && items.length === 0 && (
        <p className="text-[13px] text-[#8a8a9a] text-center py-6">Bu ay için planlanmış içerik yok.</p>
      )}
    </>
  );
}

// ── Haftalık Görünüm ──────────────────────────────────────────────────────────

function WeeklyView({ wStart, byDate, todayStr, showClientName, loading, items, canEdit, onDayClick, onItemClick, dragId, setDragId, onDrop }: {
  wStart: Date; byDate: Map<string, CalendarItem[]>;
  todayStr: string; showClientName: boolean; loading: boolean; items: CalendarItem[];
  canEdit: boolean; onDayClick: (d: string) => void; onItemClick: (i: CalendarItem) => void;
  dragId: string | null; setDragId: (id: string | null) => void; onDrop: (d: string) => void;
}) {
  const [dragOver, setDragOver] = useState<string | null>(null);
  const days = Array.from({ length: 7 }, (_, i) => addDays(wStart, i));
  const TR_MONTHS_S = ["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];

  return (
    <>
      {/* Desktop */}
      <div className="hidden sm:block rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        <div className="grid grid-cols-7" style={{ background:"var(--surface-2,#0a0a0f)", borderBottom:"1px solid var(--border)" }}>
          {days.map((d, i) => {
            const isToday = toYMD(d) === todayStr;
            return (
              <div key={i} className="py-3 text-center" style={{ borderRight: i < 6 ? "1px solid var(--border)" : "none" }}>
                <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: isToday ? "#c084fc" : "#555" }}>
                  {["Pt","Sa","Ça","Pe","Cu","Ct","Pa"][i]}
                </p>
                <p className="text-[20px] font-black mt-0.5" style={{ color: isToday ? "#c084fc" : "#fff" }}>{d.getDate()}</p>
                <p className="text-[10px] text-[#555]">{TR_MONTHS_S[d.getMonth()]}</p>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-7 items-start" style={{ background:"var(--bg)" }}>
          {days.map((d, i) => {
            const dateStr  = toYMD(d);
            const dayItems = byDate.get(dateStr) ?? [];
            const isToday  = dateStr === todayStr;
            const isDragTgt = dragOver === dateStr && dragId !== null;
            return (
              <div key={i}
                onDragOver={canEdit ? (e) => { e.preventDefault(); setDragOver(dateStr); } : undefined}
                onDragLeave={canEdit ? () => setDragOver(null) : undefined}
                onDrop={canEdit ? (e) => { e.preventDefault(); setDragOver(null); onDrop(dateStr); } : undefined}
                className="p-2 min-h-[140px]"
                style={{
                  borderRight: i < 6 ? "1px solid var(--border)" : "none",
                  background: isDragTgt ? "rgba(168,85,247,0.12)" : isToday ? "rgba(168,85,247,0.04)" : "transparent",
                  outline: isDragTgt ? "2px dashed rgba(168,85,247,0.4)" : "none",
                  outlineOffset: "-2px",
                  transition: "background 0.1s",
                }}>
                {dayItems.length === 0 ? (
                  <div onClick={canEdit ? () => onDayClick(dateStr) : undefined}
                    className={`h-full flex items-center justify-center py-6 ${canEdit ? "cursor-pointer group" : ""}`}>
                    <span className={`text-[11px] transition-colors ${canEdit ? "text-[#333] group-hover:text-[#c084fc]" : "text-[#333]"}`}>
                      {canEdit ? "+ Ekle" : "—"}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {dayItems.map(item => {
                      const color = showClientName ? CLIENT_PALETTE[slugHash(item.clientSlug)] : STATUS_COLOR[item.status];
                      const bg    = showClientName ? CLIENT_PALETTE_BG[slugHash(item.clientSlug)] : STATUS_BG[item.status];
                      return (
                        <div key={item.id}
                          draggable={canEdit}
                          onDragStart={canEdit ? (e) => { e.stopPropagation(); setDragId(item.id); } : undefined}
                          onDragEnd={canEdit ? () => setDragId(null) : undefined}
                          onClick={canEdit ? (e) => { e.stopPropagation(); onItemClick(item); } : undefined}
                          className={`rounded-lg px-2 py-1.5 text-[11px] transition-all ${canEdit ? "cursor-pointer hover:brightness-110" : ""}`}
                          style={{ background: bg }}>
                          <p className="font-semibold leading-snug" style={{ color }}>{item.title}</p>
                          {showClientName && <p className="mt-0.5 opacity-80" style={{ color }}>{item.clientName}</p>}
                          <p className="text-[10px] mt-0.5" style={{ color: STATUS_COLOR[item.status] }}>{STATUS_LABEL[item.status]}</p>
                        </div>
                      );
                    })}
                    {canEdit && (
                      <button onClick={() => onDayClick(dateStr)}
                        className="w-full text-[10px] py-1 rounded-lg text-[#444] hover:text-[#c084fc] hover:bg-purple-500/10 transition-all">
                        + Ekle
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobil */}
      <div className="sm:hidden space-y-3">
        {days.map((d, i) => {
          const dateStr  = toYMD(d);
          const dayItems = byDate.get(dateStr) ?? [];
          const isToday  = dateStr === todayStr;
          return (
            <div key={i} className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${isToday ? "rgba(168,85,247,0.35)" : "var(--border)"}` }}>
              <div className="px-4 py-2.5 flex items-center gap-3"
                style={{ background: isToday ? "rgba(168,85,247,0.1)" : "var(--surface)", borderBottom: dayItems.length > 0 || canEdit ? "1px solid var(--border)" : "none" }}>
                <span className="text-[13px] font-bold" style={{ color: isToday ? "#c084fc" : "#8a8a9a" }}>{TR_DAYS_S[i]}</span>
                <span className="text-[20px] font-black text-white">{d.getDate()}</span>
                <span className="text-[12px] text-[#555]">{TR_MONTHS_S[d.getMonth()]}</span>
                <div className="ml-auto flex items-center gap-2">
                  {dayItems.length > 0 && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background:"rgba(168,85,247,0.12)", color:"#c084fc" }}>
                      {dayItems.length}
                    </span>
                  )}
                  {canEdit && (
                    <button onClick={() => onDayClick(dateStr)}
                      className="text-[20px] leading-none text-[#555] hover:text-[#c084fc] transition-colors">+</button>
                  )}
                </div>
              </div>
              {dayItems.length > 0 && (
                <div className="p-3 space-y-2" style={{ background:"var(--bg)" }}>
                  {dayItems.map(item => (
                    <ItemChip key={item.id} item={item} showClientName={showClientName} canEdit={canEdit}
                      onItemClick={onItemClick} onDragStart={setDragId} onDragEnd={() => setDragId(null)} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!loading && items.length === 0 && (
        <p className="text-[13px] text-[#8a8a9a] text-center py-8">Bu haftada planlanmış içerik yok.</p>
      )}
    </>
  );
}

// ── Günlük Görünüm ────────────────────────────────────────────────────────────

const TR_MONTHS_S2 = ["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];

function DailyView({ dayDate, setDayDate, items, todayStr, showClientName, loading, wStart, canEdit, onDayClick, onItemClick }: {
  dayDate: Date; setDayDate: (d: Date) => void;
  items: CalendarItem[]; todayStr: string;
  showClientName: boolean; loading: boolean; wStart: Date;
  canEdit: boolean; onDayClick: (d: string) => void; onItemClick: (i: CalendarItem) => void;
}) {
  const dateStr = toYMD(dayDate);
  const isToday = dateStr === todayStr;
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(wStart, i));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 rounded-2xl overflow-hidden" style={{ border:"1px solid var(--border)" }}>
        {weekDays.map((d, i) => {
          const ds  = toYMD(d);
          const sel = ds === dateStr;
          const tod = ds === todayStr;
          return (
            <button key={i} onClick={() => setDayDate(d)}
              className="py-3 flex flex-col items-center gap-0.5 transition-colors"
              style={{
                background: sel ? "rgba(168,85,247,0.15)" : tod ? "rgba(168,85,247,0.05)" : "var(--surface)",
                borderRight: i < 6 ? "1px solid var(--border)" : "none",
              }}>
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: sel ? "#c084fc" : "#555" }}>
                {["Pt","Sa","Ça","Pe","Cu","Ct","Pa"][i]}
              </span>
              <span className="text-[18px] font-black" style={{ color: sel ? "#c084fc" : tod ? "#a78bfa" : "#fff" }}>
                {d.getDate()}
              </span>
              <span className="text-[9px]" style={{ color:"#555" }}>{TR_MONTHS_S2[d.getMonth()]}</span>
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border:"1px solid var(--border)" }}>
        <div className="px-5 py-3 flex items-center justify-between"
          style={{ background: isToday ? "rgba(168,85,247,0.08)" : "var(--surface)", borderBottom:"1px solid var(--border)" }}>
          <p className="text-[14px] font-bold text-white">
            {dayDate.toLocaleDateString("tr-TR", { day:"numeric", month:"long", year:"numeric", weekday:"long" })}
          </p>
          <div className="flex items-center gap-2">
            {isToday && (
              <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold"
                style={{ background:"rgba(168,85,247,0.15)", color:"#c084fc" }}>Bugün</span>
            )}
            {canEdit && (
              <button onClick={() => onDayClick(dateStr)}
                className="text-[12px] px-3 py-1 rounded-lg font-medium transition-colors"
                style={{ background: "rgba(168,85,247,0.12)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.2)" }}>
                + Ekle
              </button>
            )}
          </div>
        </div>

        {!loading && items.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-[13px] text-[#555]">Bu günde planlanmış içerik yok.</p>
            {canEdit && (
              <button onClick={() => onDayClick(dateStr)}
                className="mt-3 text-[12px] px-4 py-2 rounded-xl font-medium transition-colors"
                style={{ background: "rgba(168,85,247,0.12)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.2)" }}>
                + İlk içeriği planla
              </button>
            )}
          </div>
        ) : (
          <div className="p-4 space-y-3" style={{ background:"var(--bg)" }}>
            {items.map(item => (
              <ItemChip key={item.id} item={item} showClientName={showClientName} canEdit={canEdit}
                onItemClick={onItemClick} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
