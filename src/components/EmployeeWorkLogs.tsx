"use client";

import { useMemo, useState } from "react";
import { getCurrentPeriod } from "@/lib/workLogPeriods";

export interface WorkLogItem {
  id: string;
  date: string; // ISO
  description: string;
  amount: string | null;
}

export interface ArchivedPeriodSummary {
  key: string;
  label: string;
  count: number;
  total: number;
}

function parseAmount(raw: string | null): number {
  if (!raw) return 0;
  const digits = raw.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

function fmtPaymentDay(day: number | null) {
  return day ? `Her ayın ${day}. günü` : "Henüz belirtilmedi";
}

function WorkLogRow({
  log,
  onDelete,
  deleting,
}: {
  log: WorkLogItem;
  onDelete?: (id: string) => void;
  deleting?: boolean;
}) {
  return (
    <div className="rounded-xl p-4 flex items-start justify-between gap-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <div className="min-w-0">
        <p className="text-[11px] text-[#555] mb-1">{fmtDate(log.date)}</p>
        <p className="text-[14px] text-white font-medium">{log.description}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span
          className="text-[12px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
          style={log.amount
            ? { background: "rgba(52,211,153,0.12)", color: "#34d399" }
            : { background: "rgba(251,191,36,0.12)", color: "#fbbf24" }}
        >
          {log.amount ?? "Bekliyor"}
        </span>
        {!log.amount && onDelete && (
          <button onClick={() => onDelete(log.id)} disabled={deleting} className="text-[11px] text-[#555] hover:text-red-400 transition-colors">
            {deleting ? "..." : "Sil"}
          </button>
        )}
      </div>
    </div>
  );
}

function ArchivedPeriodCard({
  summary,
  onExpand,
  expanded,
  loading,
  entries,
  onDelete,
  deletingId,
}: {
  summary: ArchivedPeriodSummary;
  onExpand: () => void;
  expanded: boolean;
  loading: boolean;
  entries: WorkLogItem[] | undefined;
  onDelete: (id: string) => void;
  deletingId: string | null;
}) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <button
        onClick={onExpand}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-white/[0.02]"
      >
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-white">{summary.label}</p>
          <p className="text-[12px] text-[#8a8a9a] mt-0.5">{summary.count} kayıt</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-[13px] font-bold" style={{ color: "#34d399" }}>
            {summary.total > 0 ? `${summary.total.toLocaleString("tr-TR")} ₺` : "—"}
          </span>
          <svg viewBox="0 0 24 24" fill="none" className={`w-4 h-4 text-[#555] transition-transform ${expanded ? "rotate-180" : ""}`} stroke="currentColor" strokeWidth="2.5">
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>
      {expanded && (
        <div className="px-5 pb-5 space-y-3" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="pt-4" />
          {loading ? (
            <p className="text-[13px] text-[#555] text-center py-6">Yükleniyor...</p>
          ) : (
            (entries ?? []).map((log) => (
              <WorkLogRow key={log.id} log={log} onDelete={onDelete} deleting={deletingId === log.id} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function EmployeeWorkLogs({
  employeeName,
  paymentDay,
  currentLogs: initialCurrentLogs,
  archivedSummary,
}: {
  employeeName: string;
  paymentDay: number | null;
  currentLogs: WorkLogItem[];
  archivedSummary: ArchivedPeriodSummary[];
}) {
  const currentPeriod = useMemo(() => getCurrentPeriod(paymentDay), [paymentDay]);

  const [currentLogs, setCurrentLogs] = useState(initialCurrentLogs);
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [addedElsewhere, setAddedElsewhere] = useState(false);

  const [bulkMode, setBulkMode] = useState(false);
  const [bulkDate, setBulkDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [bulkDescriptions, setBulkDescriptions] = useState<string[]>([""]);
  const [bulkSaving, setBulkSaving] = useState(false);
  const [bulkErr, setBulkErr] = useState("");

  const [summaries, setSummaries] = useState(archivedSummary);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [archivedEntries, setArchivedEntries] = useState<Record<string, WorkLogItem[]>>({});
  const [archivedDeletingId, setArchivedDeletingId] = useState<string | null>(null);

  const currentTotal = currentLogs.reduce((s, l) => s + parseAmount(l.amount), 0);
  const totalEarnings = currentTotal + summaries.reduce((s, sm) => s + sm.total, 0);

  async function handleLogout() {
    try { await fetch("/api/musteri/auth/logout", { method: "POST" }); } catch { /* ignore */ }
    window.location.href = "/musteri/giris";
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) return;
    setSaving(true);
    setErr("");
    setAddedElsewhere(false);
    const res = await fetch("/api/musteri/calisan/worklogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, description: description.trim() }),
    });
    const json = await res.json();
    setSaving(false);
    if (json.ok) {
      const logDate = new Date(json.log.date);
      if (logDate >= currentPeriod.start && logDate <= currentPeriod.end) {
        setCurrentLogs((prev) => [json.log, ...prev]);
      } else {
        setAddedElsewhere(true);
      }
      setDescription("");
    } else {
      setErr(json.error ?? "Hata.");
    }
  }

  async function handleBulkSave(e: React.FormEvent) {
    e.preventDefault();
    const items = bulkDescriptions.map((d) => d.trim()).filter(Boolean);
    if (items.length === 0) return;
    setBulkSaving(true);
    setBulkErr("");
    setAddedElsewhere(false);
    const res = await fetch("/api/musteri/calisan/worklogs/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: bulkDate, descriptions: items }),
    });
    const json = await res.json();
    setBulkSaving(false);
    if (json.ok) {
      const logDate = new Date(json.logs[0].date);
      if (logDate >= currentPeriod.start && logDate <= currentPeriod.end) {
        setCurrentLogs((prev) => [...json.logs, ...prev]);
      } else {
        setAddedElsewhere(true);
      }
      setBulkDescriptions([""]);
    } else {
      setBulkErr(json.error ?? "Hata.");
    }
  }

  async function handleDeleteCurrent(id: string) {
    if (!confirm("Bu kaydı sil?")) return;
    setDeletingId(id);
    const res = await fetch(`/api/musteri/calisan/worklogs/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCurrentLogs((prev) => prev.filter((l) => l.id !== id));
    } else {
      const j = await res.json().catch(() => ({}));
      setErr(j.error ?? "Silinemedi.");
    }
    setDeletingId(null);
  }

  async function handleDeleteArchived(periodKey: string, id: string) {
    if (!confirm("Bu kaydı sil?")) return;
    setArchivedDeletingId(id);
    const res = await fetch(`/api/musteri/calisan/worklogs/${id}`, { method: "DELETE" });
    if (res.ok) {
      setArchivedEntries((prev) => ({
        ...prev,
        [periodKey]: (prev[periodKey] ?? []).filter((l) => l.id !== id),
      }));
      // Silinen kayıt zaten fiyatlandırılmamıştı (kural gereği) — sadece kayıt sayısı azalır.
      setSummaries((prev) => prev.map((s) => (s.key === periodKey ? { ...s, count: s.count - 1 } : s)));
    } else {
      const j = await res.json().catch(() => ({}));
      setErr(j.error ?? "Silinemedi.");
    }
    setArchivedDeletingId(null);
  }

  async function handleExpand(periodKey: string) {
    if (expandedKey === periodKey) {
      setExpandedKey(null);
      return;
    }
    setExpandedKey(periodKey);
    if (archivedEntries[periodKey]) return;
    setLoadingKey(periodKey);
    const res = await fetch(`/api/musteri/calisan/worklogs/period?periodEnd=${periodKey}`);
    const json = await res.json();
    setLoadingKey(null);
    if (json.logs) {
      setArchivedEntries((prev) => ({ ...prev, [periodKey]: json.logs }));
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ background: "rgba(5,5,5,0.9)", WebkitBackdropFilter: "blur(20px)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2">
          <a href="/musteri/calisan"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all"
            style={{ background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)", color: "#60a5fa" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(96,165,250,0.2)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(96,165,250,0.1)"; }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M5 12l7 7M5 12l7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Çalışan Paneli
          </a>
          <span className="text-[#555]">/</span>
          <span className="text-[14px] font-semibold text-white">İş Kayıtlarım</span>
        </div>
        <button onClick={handleLogout} className="text-[12px] text-[#8a8a9a] hover:text-[#f87171] transition-colors flex items-center gap-1.5 min-h-[44px] px-1">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
            <path d="M18.364 5.636A9 9 0 1 1 5.636 18.364" strokeLinecap="round"/>
            <path d="M12 3v9" strokeLinecap="round"/>
          </svg>
          Çıkış
        </button>
      </header>

      <main className="max-w-[720px] mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="font-black text-[24px] text-white mb-1">İş Kayıtlarım</h1>
          <p className="text-[14px] text-[#8a8a9a]">Merhaba {employeeName} — yaptığın işleri günlük olarak buraya ekle.</p>
        </div>

        {/* Mobilde form önce gelsin (asıl amaç kayıt eklemek), masaüstünde özet önce */}
        <div className="flex flex-col">
        {/* Özet */}
        <div className="order-2 sm:order-1 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl p-5" style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)" }}>
            <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "#34d399" }}>Bu Dönem Kazancı</p>
            <p className="text-[28px] font-black text-white mt-1">{currentTotal > 0 ? `${currentTotal.toLocaleString("tr-TR")} ₺` : "—"}</p>
            <p className="text-[11px] text-[#8a8a9a] mt-1">{currentPeriod.label}</p>
          </div>
          <div className="rounded-2xl p-5" style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)" }}>
            <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "#fbbf24" }}>Toplam Kazancım</p>
            <p className="text-[28px] font-black text-white mt-1">{totalEarnings > 0 ? `${totalEarnings.toLocaleString("tr-TR")} ₺` : "—"}</p>
            <p className="text-[11px] text-[#8a8a9a] mt-1">Tüm zamanlar</p>
          </div>
          <div className="rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#8a8a9a]">Ödeme Günü</p>
            <p className="text-[16px] font-semibold text-white mt-1.5">{fmtPaymentDay(paymentDay)}</p>
          </div>
        </div>

        {/* Yeni kayıt formu */}
        <div className="order-1 sm:order-2 rounded-2xl p-5 space-y-4 mb-8" style={{ background: "var(--surface)", border: "1px solid rgba(96,165,250,0.3)" }}>
          <div className="flex items-center justify-between gap-3">
            <p className="font-semibold text-white text-[14px]">{bulkMode ? "Toplu İş Gir" : "Yeni İş Kaydı"}</p>
            <button
              type="button"
              onClick={() => setBulkMode((v) => !v)}
              className="text-[12px] font-semibold text-[#60a5fa] hover:text-white transition-colors px-2.5 py-1 rounded-lg"
              style={{ background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.25)" }}
            >
              {bulkMode ? "Tekli Gir" : "Toplu Gir"}
            </button>
          </div>

          {!bulkMode ? (
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Tarih</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg text-[14px] text-white outline-none focus:ring-1 focus:ring-blue-500/50"
                    style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Ne yaptın?</label>
                  <input
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Örn: Alitel 03 dron videosu editlendi"
                    className="w-full px-3 py-2.5 rounded-lg text-[14px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-blue-500/50"
                    style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                  />
                </div>
              </div>
              {err && <p className="text-[12px] text-red-400">{err}</p>}
              {addedElsewhere && (
                <p className="text-[12px]" style={{ color: "#60a5fa" }}>
                  Kaydedildi — seçtiğin tarih geçmiş bir döneme ait olduğu için aşağıdaki listede değil, ilgili arşiv döneminde görünecek.
                </p>
              )}
              <button type="submit" disabled={saving} className="btn btn-primary text-sm px-5 py-2.5">
                {saving ? "Ekleniyor..." : "Ekle"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleBulkSave} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Tarih</label>
                <input
                  type="date"
                  required
                  value={bulkDate}
                  onChange={(e) => setBulkDate(e.target.value)}
                  className="w-full sm:w-[220px] px-3 py-2.5 rounded-lg text-[14px] text-white outline-none focus:ring-1 focus:ring-blue-500/50"
                  style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Yapılan İşler</label>
                <div className="space-y-2">
                  {bulkDescriptions.map((d, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        value={d}
                        onChange={(e) => setBulkDescriptions((prev) => prev.map((v, j) => (j === i ? e.target.value : v)))}
                        placeholder={`İş ${i + 1}...`}
                        className="flex-1 min-w-0 px-3 py-2.5 rounded-lg text-[14px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-blue-500/50"
                        style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                      />
                      {bulkDescriptions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setBulkDescriptions((prev) => prev.filter((_, j) => j !== i))}
                          className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-lg text-[#555] hover:text-[#f87171] transition-colors"
                          style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                        >
                          <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2.5">
                            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setBulkDescriptions((prev) => [...prev, ""])}
                  className="mt-2 text-[12px] font-semibold text-[#60a5fa] hover:text-white transition-colors"
                >
                  + Satır Ekle
                </button>
              </div>

              {bulkErr && <p className="text-[12px] text-red-400">{bulkErr}</p>}
              {addedElsewhere && (
                <p className="text-[12px]" style={{ color: "#60a5fa" }}>
                  Kaydedildi — seçtiğin tarih geçmiş bir döneme ait olduğu için aşağıdaki listede değil, ilgili arşiv döneminde görünecek.
                </p>
              )}
              <button type="submit" disabled={bulkSaving} className="btn btn-primary text-sm px-5 py-2.5">
                {bulkSaving ? "Kaydediliyor..." : "Toplu Kaydet"}
              </button>
            </form>
          )}
        </div>
        </div>

        {/* Mevcut dönem */}
        <div className="mb-8">
          <p className="text-[13px] font-bold uppercase tracking-wide text-[#8a8a9a] mb-3">Bu Dönem — {currentPeriod.label}</p>
          <div className="space-y-3">
            {currentLogs.map((l) => (
              <WorkLogRow key={l.id} log={l} onDelete={handleDeleteCurrent} deleting={deletingId === l.id} />
            ))}
            {currentLogs.length === 0 && (
              <p className="text-[13px] text-[#8a8a9a] text-center py-10">Bu dönemde henüz kayıt yok. Yukarıdan ilk kaydını ekle.</p>
            )}
          </div>
        </div>

        {/* Arşiv */}
        {summaries.some((s) => s.count > 0) && (
          <div>
            <p className="text-[13px] font-bold uppercase tracking-wide text-[#8a8a9a] mb-3">Geçmiş Dönemler</p>
            <div className="space-y-3">
              {summaries.filter((s) => s.count > 0).map((summary) => (
                <ArchivedPeriodCard
                  key={summary.key}
                  summary={summary}
                  expanded={expandedKey === summary.key}
                  loading={loadingKey === summary.key}
                  entries={archivedEntries[summary.key]}
                  onExpand={() => handleExpand(summary.key)}
                  onDelete={(id) => handleDeleteArchived(summary.key, id)}
                  deletingId={archivedDeletingId}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
