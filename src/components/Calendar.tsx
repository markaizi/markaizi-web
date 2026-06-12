"use client";

import { useState, useEffect, useCallback } from "react";

export interface CalendarItem {
  id: string;
  clientId: string;
  clientName: string;
  clientSlug: string;
  title: string;
  scheduledDate: string; // "YYYY-MM-DD"
  status: "PLANLANDI" | "DUZENLENIYOR" | "HAZIR" | "YAYINLANDI";
}

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

function toYMD(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function addDays(d: Date, n: number) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

/** Monday of the week containing d */
function weekStart(d: Date) {
  const r = new Date(d);
  const wd = (r.getDay() + 6) % 7; // 0=Mon
  r.setDate(r.getDate() - wd);
  r.setHours(0, 0, 0, 0);
  return r;
}

function daysInMonth(y: number, m: number) { return new Date(y, m, 0).getDate(); }
function firstWeekday(y: number, m: number) { return (new Date(y, m - 1, 1).getDay() + 6) % 7; }

// ── Tipler ────────────────────────────────────────────────────────────────────

type ViewMode = "monthly" | "weekly" | "daily";

export interface CalendarProps {
  /** Belirli bir firmaya kısıtla (admin firma panelinden açıldığında gerekli) */
  clientSlug?: string;
  showClientName?: boolean;
}

// ── Ana bileşen ───────────────────────────────────────────────────────────────

export default function Calendar({ showClientName = false, clientSlug }: CalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [view,      setView]      = useState<ViewMode>("monthly");
  const [year,      setYear]      = useState(today.getFullYear());
  const [month,     setMonth]     = useState(today.getMonth() + 1);
  const [wStart,    setWStart]    = useState(() => weekStart(today));
  const [dayDate,   setDayDate]   = useState(today);
  const [items,     setItems]     = useState<CalendarItem[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [selDay,    setSelDay]    = useState<string | null>(null);

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

  useEffect(() => {
    if (view === "monthly") {
      fetchItems(
        `${year}-${pad(month)}-01`,
        toYMD(new Date(year, month, 1))
      );
    } else if (view === "weekly") {
      fetchItems(toYMD(wStart), toYMD(addDays(wStart, 7)));
    } else {
      fetchItems(toYMD(dayDate), toYMD(addDays(dayDate, 1)));
    }
  }, [view, year, month, wStart, dayDate, fetchItems]);

  // Group items by date
  const byDate = new Map<string, CalendarItem[]>();
  for (const item of items) {
    const arr = byDate.get(item.scheduledDate) ?? [];
    arr.push(item);
    byDate.set(item.scheduledDate, arr);
  }

  const todayStr = toYMD(today);

  // ── Navigasyon işlevleri ────────────────────────────────────────────────────

  function prevMonth() {
    if (month === 1) { setYear(y => y - 1); setMonth(12); } else setMonth(m => m - 1);
    setSelDay(null);
  }
  function nextMonth() {
    if (month === 12) { setYear(y => y + 1); setMonth(1); } else setMonth(m => m + 1);
    setSelDay(null);
  }
  function goToday() {
    setYear(today.getFullYear()); setMonth(today.getMonth() + 1);
    setWStart(weekStart(today)); setDayDate(today); setSelDay(null);
  }
  function prevWeek() { setWStart(d => addDays(d, -7)); setSelDay(null); }
  function nextWeek() { setWStart(d => addDays(d, 7)); setSelDay(null); }
  function prevDay()  { setDayDate(d => addDays(d, -1)); }
  function nextDay()  { setDayDate(d => addDays(d, 1)); }

  // Görünüm değişince uyumlu tarih senkronu
  function switchView(v: ViewMode) {
    if (v === "weekly") setWStart(weekStart(new Date(year, month - 1, 1)));
    if (v === "daily")  setDayDate(new Date(year, month - 1, 1));
    setView(v);
    setSelDay(null);
  }

  // ── Başlık metni ────────────────────────────────────────────────────────────

  const title =
    view === "monthly" ? `${TR_MONTHS[month - 1]} ${year}` :
    view === "weekly"  ? (() => {
      const e = addDays(wStart, 6);
      return wStart.getMonth() === e.getMonth()
        ? `${wStart.getDate()}–${e.getDate()} ${TR_MONTHS[wStart.getMonth()]} ${wStart.getFullYear()}`
        : `${wStart.getDate()} ${TR_MONTHS[wStart.getMonth()]} – ${e.getDate()} ${TR_MONTHS[e.getMonth()]} ${e.getFullYear()}`;
    })()
    : `${dayDate.getDate()} ${TR_MONTHS[dayDate.getMonth()]} ${dayDate.getFullYear()} ${TR_DAYS_L[(dayDate.getDay() + 6) % 7]}`;

  return (
    <div>
      {/* ── Kontrol satırı ── */}
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        {/* Görünüm seçici */}
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

        {/* Navigasyon */}
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

        {/* Bugün + yükleniyor */}
        <div className="flex items-center gap-2">
          {loading && <span className="text-[11px] text-[#555]">Yükleniyor...</span>}
          <button onClick={goToday}
            className="text-[12px] px-3 py-1.5 rounded-lg transition-colors"
            style={{ border: "1px solid var(--border)", color: "#8a8a9a" }}
            onMouseEnter={e => (e.currentTarget.style.color="#fff")}
            onMouseLeave={e => (e.currentTarget.style.color="#8a8a9a")}>
            Bugün
          </button>
        </div>
      </div>

      {/* ── Görünüm ── */}
      {view === "monthly" && (
        <MonthlyView
          year={year} month={month} byDate={byDate}
          todayStr={todayStr} selDay={selDay} setSelDay={setSelDay}
          showClientName={showClientName} items={items} loading={loading}
        />
      )}
      {view === "weekly" && (
        <WeeklyView
          wStart={wStart} byDate={byDate}
          todayStr={todayStr} showClientName={showClientName}
          loading={loading} items={items}
        />
      )}
      {view === "daily" && (
        <DailyView
          dayDate={dayDate} setDayDate={setDayDate}
          items={items} todayStr={todayStr}
          showClientName={showClientName} loading={loading}
          wStart={wStart}
        />
      )}
    </div>
  );
}

// ── İçerik kartı (paylaşılan) ─────────────────────────────────────────────────

function ItemChip({ item, showClientName }: { item: CalendarItem; showClientName: boolean }) {
  const color = showClientName ? CLIENT_PALETTE[slugHash(item.clientSlug)] : STATUS_COLOR[item.status];
  const bg    = showClientName ? CLIENT_PALETTE_BG[slugHash(item.clientSlug)] : STATUS_BG[item.status];
  return (
    <div className="flex items-start gap-2 rounded-xl p-3"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <div className="flex-1 min-w-0">
        <p className="text-white text-[13px] font-semibold leading-snug truncate">{item.title}</p>
        {showClientName && (
          <p className="text-[11px] mt-0.5 truncate" style={{ color }}>{item.clientName}</p>
        )}
      </div>
      <span className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 font-medium mt-0.5"
        style={{ background: bg, color }}>
        {STATUS_LABEL[item.status]}
      </span>
    </div>
  );
}

// ── Aylık Görünüm ─────────────────────────────────────────────────────────────

function MonthlyView({ year, month, byDate, todayStr, selDay, setSelDay, showClientName, items, loading }: {
  year: number; month: number;
  byDate: Map<string, CalendarItem[]>;
  todayStr: string; selDay: string | null; setSelDay: (d: string | null) => void;
  showClientName: boolean; items: CalendarItem[]; loading: boolean;
}) {
  function pad(n: number) { return String(n).padStart(2, "0"); }
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
            const day     = i + 1;
            const dateStr = `${year}-${pad(month)}-${pad(day)}`;
            const dayItems = byDate.get(dateStr) ?? [];
            const isToday  = dateStr === todayStr;
            const isSel    = selDay === dateStr;
            const col      = (startWd + i) % 7;
            return (
              <div key={day} onClick={() => setSelDay(isSel ? null : dateStr)}
                className="min-h-[72px] sm:min-h-[90px] p-2 cursor-pointer transition-colors"
                style={{
                  borderRight: col === 6 ? "none" : "1px solid var(--border)",
                  borderBottom: "1px solid var(--border)",
                  background: isSel ? "rgba(168,85,247,0.08)" : "transparent",
                }}
                onMouseEnter={e => { if (!isSel) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                onMouseLeave={e => { if (!isSel) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="w-6 h-6 flex items-center justify-center rounded-full text-[12px] font-semibold"
                    style={isToday ? { background:"rgba(168,85,247,0.9)", color:"#fff" }
                                   : { color: isSel ? "#c084fc" : "#8a8a9a" }}>
                    {day}
                  </span>
                  {dayItems.length > 1 && <span className="text-[10px] text-[#555]">{dayItems.length}</span>}
                </div>
                <div className="space-y-1">
                  {dayItems.slice(0, 3).map(item => {
                    const color = showClientName ? CLIENT_PALETTE[slugHash(item.clientSlug)] : STATUS_COLOR[item.status];
                    const bg    = showClientName ? CLIENT_PALETTE_BG[slugHash(item.clientSlug)] : STATUS_BG[item.status];
                    return (
                      <div key={item.id} className="text-[10px] font-medium px-1.5 py-0.5 rounded truncate leading-4"
                        style={{ background: bg, color }}>
                        {showClientName ? item.clientName : item.title}
                      </div>
                    );
                  })}
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
          <p className="text-[13px] font-semibold text-[#8a8a9a]">
            {new Date(selDay + "T12:00:00").toLocaleDateString("tr-TR", { day:"numeric", month:"long", year:"numeric" })}
          </p>
          {(byDate.get(selDay) ?? []).length === 0
            ? <p className="text-[13px] text-[#555]">Bu günde içerik yok.</p>
            : (byDate.get(selDay) ?? []).map(item => (
                <ItemChip key={item.id} item={item} showClientName={showClientName} />
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

function WeeklyView({ wStart, byDate, todayStr, showClientName, loading, items }: {
  wStart: Date; byDate: Map<string, CalendarItem[]>;
  todayStr: string; showClientName: boolean; loading: boolean; items: CalendarItem[];
}) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(wStart, i));
  const TR_MONTHS_S = ["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];

  return (
    <>
      {/* Desktop: 7 sütun */}
      <div className="hidden sm:block rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        {/* Başlıklar */}
        <div className="grid grid-cols-7" style={{ background:"var(--surface-2,#0a0a0f)", borderBottom:"1px solid var(--border)" }}>
          {days.map((d, i) => {
            const isToday = toYMD(d) === todayStr;
            return (
              <div key={i} className="py-3 text-center" style={{ borderRight: i < 6 ? "1px solid var(--border)" : "none" }}>
                <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: isToday ? "#c084fc" : "#555" }}>
                  {["Pt","Sa","Ça","Pe","Cu","Ct","Pa"][i]}
                </p>
                <p className="text-[20px] font-black mt-0.5" style={{ color: isToday ? "#c084fc" : "#fff" }}>
                  {d.getDate()}
                </p>
                <p className="text-[10px] text-[#555]">{TR_MONTHS_S[d.getMonth()]}</p>
              </div>
            );
          })}
        </div>
        {/* İçerikler */}
        <div className="grid grid-cols-7 items-start" style={{ background:"var(--bg)" }}>
          {days.map((d, i) => {
            const dateStr  = toYMD(d);
            const dayItems = byDate.get(dateStr) ?? [];
            const isToday  = dateStr === todayStr;
            return (
              <div key={i} className="p-2 min-h-[140px]"
                style={{
                  borderRight: i < 6 ? "1px solid var(--border)" : "none",
                  background: isToday ? "rgba(168,85,247,0.04)" : "transparent",
                }}>
                {dayItems.length === 0 && (
                  <div className="h-full flex items-center justify-center py-6">
                    <span className="text-[11px] text-[#333]">—</span>
                  </div>
                )}
                <div className="space-y-1.5">
                  {dayItems.map(item => {
                    const color = showClientName ? CLIENT_PALETTE[slugHash(item.clientSlug)] : STATUS_COLOR[item.status];
                    const bg    = showClientName ? CLIENT_PALETTE_BG[slugHash(item.clientSlug)] : STATUS_BG[item.status];
                    return (
                      <div key={item.id} className="rounded-lg px-2 py-1.5 text-[11px]" style={{ background: bg }}>
                        <p className="font-semibold leading-snug" style={{ color }} >{item.title}</p>
                        {showClientName && <p className="mt-0.5 opacity-80" style={{ color }}>{item.clientName}</p>}
                        <p className="text-[10px] mt-0.5" style={{ color: STATUS_COLOR[item.status] }}>{STATUS_LABEL[item.status]}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobil: dikey liste */}
      <div className="sm:hidden space-y-3">
        {days.map((d, i) => {
          const dateStr  = toYMD(d);
          const dayItems = byDate.get(dateStr) ?? [];
          const isToday  = dateStr === todayStr;
          return (
            <div key={i} className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${isToday ? "rgba(168,85,247,0.35)" : "var(--border)"}` }}>
              <div className="px-4 py-2.5 flex items-center gap-3"
                style={{ background: isToday ? "rgba(168,85,247,0.1)" : "var(--surface)", borderBottom: dayItems.length > 0 ? "1px solid var(--border)" : "none" }}>
                <span className="text-[13px] font-bold" style={{ color: isToday ? "#c084fc" : "#8a8a9a" }}>
                  {TR_DAYS_S[i]}
                </span>
                <span className="text-[20px] font-black text-white">{d.getDate()}</span>
                <span className="text-[12px] text-[#555]">{TR_MONTHS_S[d.getMonth()]}</span>
                {dayItems.length > 0 && (
                  <span className="ml-auto text-[11px] px-2 py-0.5 rounded-full" style={{ background:"rgba(168,85,247,0.12)", color:"#c084fc" }}>
                    {dayItems.length}
                  </span>
                )}
              </div>
              {dayItems.length > 0 && (
                <div className="p-3 space-y-2" style={{ background:"var(--bg)" }}>
                  {dayItems.map(item => <ItemChip key={item.id} item={item} showClientName={showClientName} />)}
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

function DailyView({ dayDate, setDayDate, items, todayStr, showClientName, loading, wStart }: {
  dayDate: Date; setDayDate: (d: Date) => void;
  items: CalendarItem[]; todayStr: string;
  showClientName: boolean; loading: boolean; wStart: Date;
}) {
  const dateStr = toYMD(dayDate);
  const isToday = dateStr === todayStr;
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(wStart, i));

  return (
    <div className="space-y-4">
      {/* Hafta şeridi — hızlı gün seçimi */}
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

      {/* İçerik listesi */}
      <div className="rounded-2xl overflow-hidden" style={{ border:"1px solid var(--border)" }}>
        <div className="px-5 py-3 flex items-center justify-between"
          style={{ background: isToday ? "rgba(168,85,247,0.08)" : "var(--surface)", borderBottom:"1px solid var(--border)" }}>
          <p className="text-[14px] font-bold text-white">
            {dayDate.toLocaleDateString("tr-TR", { day:"numeric", month:"long", year:"numeric", weekday:"long" })}
          </p>
          {isToday && (
            <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold"
              style={{ background:"rgba(168,85,247,0.15)", color:"#c084fc" }}>Bugün</span>
          )}
        </div>

        {!loading && items.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-[13px] text-[#555]">Bu günde planlanmış içerik yok.</p>
          </div>
        ) : (
          <div className="p-4 space-y-3" style={{ background:"var(--bg)" }}>
            {items.map(item => <ItemChip key={item.id} item={item} showClientName={showClientName} />)}
          </div>
        )}
      </div>
    </div>
  );
}

