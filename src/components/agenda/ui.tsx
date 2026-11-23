"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";

// Ajanda + Kasa ekranlarının ortak parçaları. Panelin mevcut koyu/aydınlık tema
// değişkenleri (var(--surface), var(--border) …) kullanılır.

export const TZ = "Europe/Istanbul";

export function fmtTL(n: number): string {
  return n.toLocaleString("tr-TR", { maximumFractionDigits: 2 }) + " ₺";
}
export function fmtDay(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", { timeZone: TZ, weekday: "short", day: "numeric", month: "long" });
}
export function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", { timeZone: TZ, day: "numeric", month: "long", year: "numeric" });
}
export function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("tr-TR", { timeZone: TZ, hour: "2-digit", minute: "2-digit" });
}
/** İstanbul saatine göre YYYY-MM-DD — günlere gruplamak için. */
export function dayKey(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: TZ });
}
export function todayKey(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: TZ });
}

/** Admin ajanda API'sine istek atar; hata mesajını fırlatır. */
export async function agendaApi(method: "POST" | "PATCH" | "DELETE", path: string, body?: unknown) {
  const res = await fetch(`/api/musteri/admin/ajanda/${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error ?? "İşlem yapılamadı.");
  return json.result;
}

export function PanelShell({ title, subtitle, children, actions }: { title: string; subtitle?: string; children: ReactNode; actions?: ReactNode }) {
  async function handleLogout() {
    try { await fetch("/api/musteri/auth/logout", { method: "POST" }); } catch { /* ignore */ }
    window.location.assign("/musteri/giris");
  }
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <header className="sticky top-0 z-50 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-3"
        style={{ background: "var(--header-bg)", WebkitBackdropFilter: "blur(20px)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link href="/musteri/admin" className="font-black text-[16px] sm:text-[18px] gradient-text flex-shrink-0">markaizi</Link>
          <span className="hidden sm:inline text-[#555]">/</span>
          <Link href="/musteri/admin" className="hidden sm:inline text-[14px] text-[#8a8a9a] hover:text-white transition-colors">Admin</Link>
          <span className="hidden sm:inline text-[#555]">/</span>
          <span className="text-[13px] sm:text-[14px] font-semibold text-white truncate">{title}</span>
        </div>
        <button onClick={handleLogout} className="text-[12px] sm:text-[13px] text-[#8a8a9a] hover:text-[#f87171] transition-colors flex-shrink-0 min-h-[44px] px-1 flex items-center">
          Çıkış
        </button>
      </header>
      <main className="max-w-[1080px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-black text-[22px] sm:text-[24px] text-white mb-1">{title}</h1>
            {subtitle && <p className="text-[13px] text-[#8a8a9a]">{subtitle}</p>}
          </div>
          {actions}
        </div>
        {children}
      </main>
    </div>
  );
}

export function Card({ children, className = "", tone }: { children: ReactNode; className?: string; tone?: string }) {
  return (
    <div className={`rounded-2xl p-4 sm:p-5 ${className}`}
      style={{ background: tone ? `${tone}14` : "var(--surface)", border: `1px solid ${tone ? `${tone}40` : "var(--border)"}` }}>
      {children}
    </div>
  );
}

export function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-2xl p-4" style={{ background: `${color}14`, border: `1px solid ${color}33` }}>
      <p className="text-[10px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1">{label}</p>
      <p className="text-[17px] sm:text-[20px] font-black" style={{ color }}>{value}</p>
    </div>
  );
}

export function Tabs<T extends string>({ tabs, active, onChange }: { tabs: { id: T; label: string; badge?: number }[]; active: T; onChange: (t: T) => void }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 mb-6" style={{ scrollbarWidth: "none" }}>
      {tabs.map((t) => {
        const on = t.id === active;
        return (
          <button key={t.id} onClick={() => onChange(t.id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold whitespace-nowrap transition-all min-h-[44px]"
            style={on
              ? { background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "#fff", border: "1px solid transparent" }
              : { background: "var(--surface)", color: "#8a8a9a", border: "1px solid var(--border)" }}>
            {t.label}
            {!!t.badge && (
              <span className="text-[11px] px-1.5 rounded-md" style={{ background: on ? "rgba(255,255,255,0.25)" : "rgba(248,113,113,0.15)", color: on ? "#fff" : "#f87171" }}>{t.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Telefonda 16px: iOS Safari 16px altındaki alana dokununca sayfayı yakınlaştırır.
export const inputCls = "w-full rounded-xl px-3 py-2.5 text-[16px] sm:text-[14px] text-white outline-none focus:ring-2 focus:ring-[#a855f7]/50";
export const inputStyle = { background: "var(--bg)", border: "1px solid var(--border)" } as const;

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1">{label}</span>
      {children}
    </label>
  );
}

export function Btn({ children, onClick, variant = "ghost", disabled, type = "button", small }: {
  children: ReactNode; onClick?: () => void; variant?: "primary" | "ghost" | "danger" | "ok"; disabled?: boolean; type?: "button" | "submit"; small?: boolean;
}) {
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "#fff" },
    ghost: { background: "var(--bg)", color: "var(--fg, #c8c8d0)", border: "1px solid var(--border)" },
    danger: { background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.25)" },
    ok: { background: "rgba(52,211,153,0.12)", color: "#34d399", border: "1px solid rgba(52,211,153,0.3)" },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`rounded-xl font-semibold transition-opacity disabled:opacity-50 hover:opacity-85 ${small ? "px-3 py-2 sm:px-2.5 sm:py-1.5 text-[12px] min-h-[40px] sm:min-h-[32px]" : "px-4 py-2.5 text-[13px] min-h-[44px]"}`}
      style={styles[variant]}>
      {children}
    </button>
  );
}

export function Chip({ children, color }: { children: ReactNode; color: string }) {
  return (
    <span className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-md whitespace-nowrap"
      style={{ background: `${color}1f`, color, border: `1px solid ${color}40` }}>
      {children}
    </span>
  );
}

const modalStack: object[] = [];

/**
 * Pencere (v3.10.0): Esc ile kapanır, arkadaki sayfa kaymaz, ekran okuyucuya "dialog" olarak bildirilir.
 * Form pencerelerinde `dismissable={false}` verilir → dışına dokunmak yazılanı silmesin (Esc / × / Vazgeç ile kapanır).
 */
export function Modal({ title, onClose, children, dismissable = true }: { title: string; onClose: () => void; children: ReactNode; dismissable?: boolean }) {
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; });
  useEffect(() => {
    // İç içe pencerelerde Esc yalnızca en üsttekini kapatır.
    const token = {};
    modalStack.push(token);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modalStack[modalStack.length - 1] === token) closeRef.current();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      modalStack.splice(modalStack.indexOf(token), 1);
      document.body.style.overflow = prev;
    };
  }, []);
  return (
    <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={dismissable ? onClose : undefined}>
      <div role="dialog" aria-modal="true" aria-label={title}
        className="w-full sm:max-w-[520px] max-h-[92vh] overflow-y-auto overscroll-contain rounded-t-2xl sm:rounded-2xl p-5"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[17px] font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-[#8a8a9a] hover:text-white text-[22px] leading-none w-11 h-11 flex items-center justify-center -mr-2" aria-label="Kapat">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/**
 * Firma adı → firmanın admin sayfası (v3.8.0). Satırın kendi tıklamasını (düzenle vb.) tetiklemesin
 * diye olay yayılımı durdurulur. slug yoksa düz metin.
 */
export function ClientLink({ slug, name, chip = false }: { slug?: string | null; name: string; chip?: boolean }) {
  if (!slug) return chip ? <Chip color="#c084fc">{name}</Chip> : <span>{name}</span>;
  const cls = chip
    ? "inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-md whitespace-nowrap hover:underline"
    : "font-semibold hover:underline";
  const style = chip
    ? { background: "#c084fc1f", color: "#a855f7", border: "1px solid #c084fc40" }
    : { color: "#a855f7" };
  return (
    <Link href={`/musteri/admin/${slug}`} onClick={(e) => e.stopPropagation()} className={cls} style={style} title={`${name} sayfasına git`}>
      {name}
    </Link>
  );
}
