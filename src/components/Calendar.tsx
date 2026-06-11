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

// 8 renk paleti — her firma için slug hash'ine göre seçilir
const CLIENT_PALETTE = [
  "#c084fc", "#60a5fa", "#34d399", "#f472b6",
  "#fb923c", "#a78bfa", "#38bdf8", "#4ade80",
];
const CLIENT_PALETTE_BG = [
  "rgba(192,132,252,0.18)", "rgba(96,165,250,0.18)", "rgba(52,211,153,0.18)", "rgba(244,114,182,0.18)",
  "rgba(251,146,60,0.18)",  "rgba(167,139,250,0.18)", "rgba(56,189,248,0.18)", "rgba(74,222,128,0.18)",
];

function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) & 0xffff;
  return h % CLIENT_PALETTE.length;
}

const TR_MONTHS = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
const TR_DAYS   = ["Pt","Sa","Ça","Pe","Cu","Ct","Pa"];

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function firstWeekday(year: number, month: number) {
  // 0=Mon … 6=Sun
  return (new Date(year, month - 1, 1).getDay() + 6) % 7;
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

interface CalendarProps {
  showClientName?: boolean;
  /** Optionally navigate to firm detail instead of showing inline */
  onItemClick?: (item: CalendarItem) => void;
}

export default function Calendar({ showClientName = false, onItemClick }: CalendarProps) {
  const today = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [items, setItems] = useState<CalendarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const fetchItems = useCallback(async (y: number, m: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/musteri/calendar?year=${y}&month=${m}`);
      const data = await res.json();
      setItems(data.items ?? []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(year, month); }, [year, month, fetchItems]);

  // Group items by date string
  const byDate = new Map<string, CalendarItem[]>();
  for (const item of items) {
    const d = byDate.get(item.scheduledDate) ?? [];
    d.push(item);
    byDate.set(item.scheduledDate, d);
  }

  function prevMonth() {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
    setSelectedDay(null);
  }
  function nextMonth() {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
    setSelectedDay(null);
  }
  function goToday() {
    setYear(today.getFullYear());
    setMonth(today.getMonth() + 1);
    setSelectedDay(null);
  }

  const totalDays  = daysInMonth(year, month);
  const startWd    = firstWeekday(year, month);
  const todayStr   = `${today.getFullYear()}-${pad2(today.getMonth()+1)}-${pad2(today.getDate())}`;
  const selectedItems = selectedDay ? (byDate.get(selectedDay) ?? []) : [];

  return (
    <div>
      {/* Navigasyon */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <button onClick={prevMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-white/[0.06]"
            style={{ border: "1px solid var(--border)", color: "#8a8a9a" }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h2 className="text-[16px] font-bold text-white min-w-[140px] text-center">
            {TR_MONTHS[month - 1]} {year}
          </h2>
          <button onClick={nextMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-white/[0.06]"
            style={{ border: "1px solid var(--border)", color: "#8a8a9a" }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-3">
          {loading && (
            <span className="text-[11px] text-[#555]">Yükleniyor...</span>
          )}
          <button onClick={goToday}
            className="text-[12px] px-3 py-1.5 rounded-lg transition-colors"
            style={{ border: "1px solid var(--border)", color: "#8a8a9a" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={e => (e.currentTarget.style.color = "#8a8a9a")}>
            Bugün
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        {/* Hafta günleri */}
        <div className="grid grid-cols-7"
          style={{ background: "var(--surface-2, #0a0a0f)", borderBottom: "1px solid var(--border)" }}>
          {TR_DAYS.map(d => (
            <div key={d} className="py-2.5 text-center text-[11px] font-bold uppercase tracking-wider text-[#555]">
              {d}
            </div>
          ))}
        </div>

        {/* Günler */}
        <div className="grid grid-cols-7" style={{ background: "var(--bg)" }}>
          {/* Boş hücreler */}
          {Array.from({ length: startWd }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[72px] sm:min-h-[90px]"
              style={{ borderRight: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
                       background: "rgba(255,255,255,0.01)" }} />
          ))}

          {/* Gün hücreleri */}
          {Array.from({ length: totalDays }).map((_, i) => {
            const day     = i + 1;
            const dateStr = `${year}-${pad2(month)}-${pad2(day)}`;
            const dayItems = byDate.get(dateStr) ?? [];
            const isToday  = dateStr === todayStr;
            const isSelected = selectedDay === dateStr;
            const col      = (startWd + i) % 7;
            const isLastCol = col === 6;

            return (
              <div
                key={day}
                onClick={() => setSelectedDay(isSelected ? null : dateStr)}
                className="min-h-[72px] sm:min-h-[90px] p-2 cursor-pointer transition-colors"
                style={{
                  borderRight: isLastCol ? "none" : "1px solid var(--border)",
                  borderBottom: "1px solid var(--border)",
                  background: isSelected ? "rgba(168,85,247,0.08)" : "transparent",
                }}
                onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                {/* Gün numarası */}
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className="w-6 h-6 flex items-center justify-center rounded-full text-[12px] font-semibold"
                    style={isToday
                      ? { background: "rgba(168,85,247,0.9)", color: "#fff" }
                      : { color: isSelected ? "#c084fc" : "#8a8a9a" }}>
                    {day}
                  </span>
                  {dayItems.length > 0 && (
                    <span className="text-[10px] text-[#555]">{dayItems.length > 1 ? dayItems.length : ""}</span>
                  )}
                </div>

                {/* İçerik noktaları */}
                <div className="space-y-1">
                  {dayItems.slice(0, 3).map((item) => {
                    const color = showClientName
                      ? CLIENT_PALETTE[hashSlug(item.clientSlug)]
                      : STATUS_COLOR[item.status];
                    const bg = showClientName
                      ? CLIENT_PALETTE_BG[hashSlug(item.clientSlug)]
                      : STATUS_BG[item.status];
                    return (
                      <div key={item.id}
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded truncate leading-4"
                        style={{ background: bg, color }}>
                        {showClientName ? item.clientName : item.title}
                      </div>
                    );
                  })}
                  {dayItems.length > 3 && (
                    <div className="text-[10px] text-[#555] px-1">+{dayItems.length - 3} daha</div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Sağ dolgu hücreleri */}
          {(() => {
            const lastCol = (startWd + totalDays - 1) % 7;
            const remaining = lastCol === 6 ? 0 : 6 - lastCol;
            return Array.from({ length: remaining }).map((_, i) => (
              <div key={`tail-${i}`} className="min-h-[72px] sm:min-h-[90px]"
                style={{
                  borderRight: i < remaining - 1 ? "1px solid var(--border)" : "none",
                  borderBottom: "1px solid var(--border)",
                  background: "rgba(255,255,255,0.01)",
                }} />
            ));
          })()}
        </div>
      </div>

      {/* Seçilen gün detayı */}
      {selectedDay && (
        <div className="mt-4 rounded-2xl p-5 space-y-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <p className="text-[13px] font-semibold text-[#8a8a9a]">
            {new Date(selectedDay + "T12:00:00").toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
          </p>
          {selectedItems.length === 0 ? (
            <p className="text-[13px] text-[#555]">Bu günde içerik yok.</p>
          ) : (
            selectedItems.map((item) => {
              const idx = hashSlug(item.clientSlug);
              return (
                <div key={item.id}
                  className="flex items-start gap-3 rounded-xl p-3"
                  style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-[14px] font-semibold truncate">{item.title}</p>
                    {showClientName && (
                      <p className="text-[11px] mt-0.5" style={{ color: CLIENT_PALETTE[idx] }}>
                        {item.clientName}
                      </p>
                    )}
                  </div>
                  <span className="text-[11px] px-2.5 py-1 rounded-full flex-shrink-0 font-medium"
                    style={{ background: STATUS_BG[item.status], color: STATUS_COLOR[item.status] }}>
                    {STATUS_LABEL[item.status]}
                  </span>
                  {onItemClick && (
                    <button onClick={() => onItemClick(item)}
                      className="text-[11px] text-[#555] hover:text-white transition-colors flex-shrink-0">
                      →
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Boşsa açıklama */}
      {!loading && items.length === 0 && (
        <p className="text-[13px] text-[#8a8a9a] text-center py-6">Bu ay için planlanmış içerik yok.</p>
      )}
    </div>
  );
}
