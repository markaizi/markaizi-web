"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

/**
 * Panel tasarımına uygun açılır filtre menüsü (v3.14.0).
 * Yerel <select> yerine: degrade vurgulu tetik, cam efektli liste, uzun listelerde arama,
 * baş harf rozeti, seçili satırda tik. Esc / dışarı tıklama kapatır, ok tuşları gezinir.
 */
export interface FilterOption {
  value: string;
  label: string;
  /** Satırın solunda gösterilir; verilmezse baş harf rozeti çıkar. */
  icon?: ReactNode;
  /** "Tümü" gibi sıfırlama seçenekleri — rozet yerine sade ikon, altında ayraç. */
  muted?: boolean;
}

export default function FilterSelect({
  value, onChange, options, icon, ariaLabel, searchPlaceholder = "Ara…", minWidth = 200, align = "left",
}: {
  value: string;
  onChange: (v: string) => void;
  options: FilterOption[];
  icon?: ReactNode;
  ariaLabel: string;
  searchPlaceholder?: string;
  minWidth?: number;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [hi, setHi] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.value === value) ?? options[0];
  const isDefault = !!selected?.muted;
  const showSearch = options.length > 7;

  const filtered = useMemo(() => {
    const s = q.trim().toLocaleLowerCase("tr");
    return s ? options.filter((o) => o.label.toLocaleLowerCase("tr").includes(s)) : options;
  }, [options, q]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [open]);

  function toggle() {
    if (open) { setOpen(false); return; }
    setQ("");
    setHi(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
    // Telefonda klavye açılmasın: aramaya yalnızca fareli cihazlarda odaklan.
    if (showSearch && window.matchMedia("(pointer: fine)").matches) setTimeout(() => searchRef.current?.focus(), 0);
  }

  function pick(v: string) {
    onChange(v);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>(`[data-idx="${hi}"]`)?.scrollIntoView({ block: "nearest" });
  }, [hi, open]);

  function onKey(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
      return;
    }
    if (e.key === "Escape") { e.preventDefault(); setOpen(false); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setHi((i) => Math.min(filtered.length - 1, i + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHi((i) => Math.max(0, i - 1)); }
    else if (e.key === "Enter") { e.preventDefault(); if (filtered[hi]) pick(filtered[hi].value); }
  }

  return (
    <div ref={rootRef} className="relative" onKeyDown={onKey}>
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className="group flex items-center gap-2 pl-2.5 pr-2 h-[40px] sm:h-[36px] rounded-xl text-[13px] font-semibold transition-all"
        style={{
          minWidth,
          background: isDefault ? "var(--surface)" : "var(--fs-trig)",
          border: `1px solid ${open || !isDefault ? "rgba(168,85,247,0.45)" : "var(--border)"}`,
          boxShadow: open ? "0 0 0 3px rgba(168,85,247,0.14)" : "none",
          color: "var(--fg)",
        }}
      >
        {icon && (
          <span className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: isDefault ? "var(--surface-2)" : "rgba(168,85,247,0.22)", color: isDefault ? "var(--fg-muted)" : "var(--fs-accent)" }}>
            {icon}
          </span>
        )}
        <span className="flex-1 text-left truncate max-w-[200px]">{selected?.label}</span>
        <svg viewBox="0 0 20 20" className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "none", color: "var(--fg-muted)" }} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5.5 8l4.5 4.5L14.5 8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute z-40 mt-2 w-[min(300px,calc(100vw-32px))] rounded-2xl overflow-hidden fs-pop"
          style={{
            [align === "right" ? "right" : "left"]: 0,
            minWidth,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: "0 18px 50px rgba(0,0,0,0.45), 0 0 0 1px rgba(168,85,247,0.08)",
          }}
        >
          {showSearch && (
            <div className="p-2" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="fs-search-wrap flex items-center gap-2 px-2.5 rounded-xl transition-shadow" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                <svg viewBox="0 0 20 20" className="w-4 h-4 flex-shrink-0" style={{ color: "var(--fg-muted)" }} fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="9" r="5.5" /><path d="M13.5 13.5L17 17" strokeLinecap="round" />
                </svg>
                <input
                  ref={searchRef}
                  value={q}
                  onChange={(e) => { setQ(e.target.value); setHi(0); }}
                  placeholder={searchPlaceholder}
                  className="flex-1 min-w-0 bg-transparent py-2 text-[16px] sm:text-[13px] text-white outline-none placeholder-[#555]"
                />
              </div>
            </div>
          )}
          <div ref={listRef} role="listbox" aria-label={ariaLabel} className="max-h-[300px] overflow-y-auto p-1.5" style={{ scrollbarWidth: "thin" }}>
            {filtered.length === 0 && <p className="px-3 py-4 text-center text-[12px] text-[#8a8a9a]">Sonuç yok</p>}
            {filtered.map((o, i) => {
              const sel = o.value === value;
              const active = i === hi;
              const nextIsNormal = o.muted && filtered[i + 1] && !filtered[i + 1].muted;
              return (
                <div key={o.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={sel}
                    data-idx={i}
                    onMouseEnter={() => setHi(i)}
                    onClick={() => pick(o.value)}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-[13px] transition-colors min-h-[40px]"
                    style={{
                      background: sel ? "var(--fs-sel)" : active ? "var(--surface-2)" : "transparent",
                      color: sel ? "var(--fs-accent)" : "var(--fg)",
                      fontWeight: sel ? 600 : 500,
                    }}
                  >
                    <span className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-[11px] font-bold"
                      style={o.icon || o.muted
                        ? { background: "var(--surface-2)", color: "var(--fg-muted)" }
                        : { background: sel ? "linear-gradient(135deg,#7c3aed,#a855f7)" : "rgba(168,85,247,0.12)", color: sel ? "#fff" : "var(--fs-accent)" }}>
                      {o.icon ?? (o.muted ? "•" : o.label.trim().charAt(0).toLocaleUpperCase("tr"))}
                    </span>
                    <span className="flex-1 truncate">{o.label}</span>
                    {sel && (
                      <svg viewBox="0 0 20 20" className="w-4 h-4 flex-shrink-0" fill="none" stroke="var(--fs-accent)" strokeWidth="2.4">
                        <path d="M5 10.5l3.2 3.2L15 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                  {nextIsNormal && !q && <div className="my-1 mx-2 h-px" style={{ background: "var(--border)" }} />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/** Filtre tetiklerinde kullanılan küçük ikonlar. */
export const FilterIcons = {
  building: (
    <svg viewBox="0 0 20 20" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3.5 17V4.5a1 1 0 011-1h6a1 1 0 011 1V17M11.5 8h4a1 1 0 011 1v8M2.5 17h15M6.5 7h2M6.5 10h2M6.5 13h2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 20 20" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="10" cy="7" r="3.2" /><path d="M3.8 17c.8-3 3.3-4.8 6.2-4.8s5.4 1.8 6.2 4.8" strokeLinecap="round" />
    </svg>
  ),
  sort: (
    <svg viewBox="0 0 20 20" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 4v12M6 16l-2.5-2.5M6 16l2.5-2.5M14 16V4M14 4l-2.5 2.5M14 4l2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  all: (
    <svg viewBox="0 0 20 20" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.5" y="3.5" width="5" height="5" rx="1.2" /><rect x="11.5" y="3.5" width="5" height="5" rx="1.2" />
      <rect x="3.5" y="11.5" width="5" height="5" rx="1.2" /><rect x="11.5" y="11.5" width="5" height="5" rx="1.2" />
    </svg>
  ),
};

export type PriorityLevel = "DUSUK" | "ORTA" | "YUKSEK";
export const PRIORITY_LEVELS: { id: PriorityLevel; label: string; color: string }[] = [
  { id: "DUSUK", label: "Düşük", color: "#34d399" },
  { id: "ORTA", label: "Orta", color: "#fb923c" },
  { id: "YUKSEK", label: "Yüksek", color: "#f87171" },
];

/**
 * Öncelik filtresi: yeşil / turuncu / kırmızı bayrak. Birine basınca yalnızca o öncelik görünür,
 * aynısına tekrar basınca filtre kalkar (null = tümü).
 */
export function PriorityFilter({ value, onChange, counts }: {
  value: PriorityLevel | null;
  onChange: (v: PriorityLevel | null) => void;
  counts?: Partial<Record<PriorityLevel, number>>;
}) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-xl" role="group" aria-label="Öncelik filtresi"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      {PRIORITY_LEVELS.map((p) => {
        const on = value === p.id;
        const dim = value !== null && !on;
        const n = counts?.[p.id];
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onChange(on ? null : p.id)}
            aria-pressed={on}
            title={on ? `${p.label} öncelik filtresini kaldır` : `Yalnızca ${p.label.toLocaleLowerCase("tr")} öncelikli işler`}
            className="flex items-center gap-1.5 h-[32px] sm:h-[28px] px-2 rounded-lg text-[12px] font-semibold transition-all"
            style={{
              background: on ? `${p.color}24` : "transparent",
              boxShadow: on ? `inset 0 0 0 1px ${p.color}66, 0 0 14px ${p.color}33` : "none",
              color: on ? p.color : "var(--fg-muted)",
              opacity: dim ? 0.45 : 1,
            }}
          >
            <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none">
              <path d="M5 17.5V3" stroke={p.color} strokeWidth="1.8" strokeLinecap="round" />
              <path d="M5 3.5h9.2l-2 3.25 2 3.25H5" fill={on ? p.color : `${p.color}55`} stroke={p.color} strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            <span className="hidden sm:inline">{p.label}</span>
            {n !== undefined && (
              <span className="text-[11px] tabular-nums" style={{ color: on ? p.color : "var(--fg-faint)" }}>{n}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
