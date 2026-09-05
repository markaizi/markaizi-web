"use client";

import { useState } from "react";

export interface WorkLogRow {
  id: string;
  date: string;
  description: string;
  amount: string | null;
  adminNote: string | null;
}

export interface EmployeeWorklogs {
  userId: string;
  name: string;
  periodLabel: string;
  logs: WorkLogRow[];
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

function EditableRow({
  log, draftValue, onDraftChange, noteValue, onNoteChange, onSave, saving,
}: {
  log: WorkLogRow;
  draftValue: string;
  onDraftChange: (v: string) => void;
  noteValue: string;
  onNoteChange: (v: string) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const [showNote, setShowNote] = useState(!!noteValue);
  return (
    <div className="px-4 sm:px-5 py-3.5">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-[#555] mb-1">{fmtDate(log.date)}</p>
          <p className="text-[13px] text-white">{log.description}</p>
        </div>
        <input
          value={draftValue}
          onChange={(e) => onDraftChange(e.target.value)}
          placeholder="Örn: 250 ₺"
          className="w-28 px-2.5 py-1.5 rounded-lg text-[13px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-purple-500/50 flex-shrink-0"
          style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
        />
        <button
          onClick={() => setShowNote((v) => !v)}
          title="Çalışana görünecek bir not ekle"
          className="text-[11px] font-semibold flex-shrink-0 transition-colors"
          style={{ color: noteValue ? "#fbbf24" : "#555" }}
        >
          📝{noteValue ? " Not var" : " Not ekle"}
        </button>
        <button onClick={onSave} disabled={saving} className="text-[11px] font-semibold text-[#c084fc] hover:text-white transition-colors flex-shrink-0">
          {saving ? "..." : "Kaydet"}
        </button>
      </div>
      {showNote && (
        <input
          value={noteValue}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Örn: Müşteri çok beğendi, normalden yüksek yazdım"
          className="w-full mt-2.5 px-2.5 py-1.5 rounded-lg text-[12.5px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-amber-500/50"
          style={{ background: "var(--bg)", border: "1px solid rgba(251,191,36,0.25)" }}
        />
      )}
    </div>
  );
}

function EmployeeSection({ employee }: { employee: EmployeeWorklogs }) {
  const [expanded, setExpanded] = useState(false);
  const [logs, setLogs] = useState(employee.logs);
  const [amountDrafts, setAmountDrafts] = useState<Record<string, string>>(
    () => Object.fromEntries(employee.logs.map((l) => [l.id, l.amount ?? ""]))
  );
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>(
    () => Object.fromEntries(employee.logs.map((l) => [l.id, l.adminNote ?? ""]))
  );
  const [savingId, setSavingId] = useState<string | null>(null);

  const unpriced = logs.filter((l) => !l.amount).length;

  async function handleSave(logId: string) {
    setSavingId(logId);
    const amount = amountDrafts[logId]?.trim() || null;
    const adminNote = noteDrafts[logId]?.trim() || null;
    const res = await fetch(`/api/musteri/admin/worklogs/${logId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount, adminNote }),
    });
    const json = await res.json().catch(() => ({}));
    setSavingId(null);
    if (json.ok) {
      setLogs((prev) => prev.map((l) => (l.id === logId ? { ...l, amount: json.log.amount, adminNote: json.log.adminNote } : l)));
    }
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-4 text-left transition-colors hover:bg-white/[0.02]"
      >
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-white">{employee.name}</p>
          <p className="text-[12px] text-[#8a8a9a] mt-0.5">{employee.periodLabel} · {logs.length} kayıt</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {unpriced > 0 && (
            <span className="text-[11px] font-bold px-2 py-1 rounded-full" style={{ background: "rgba(34,211,238,0.12)", color: "#22d3ee" }}>
              {unpriced} bekliyor
            </span>
          )}
          <svg viewBox="0 0 24 24" fill="none" className={`w-4 h-4 text-[#555] transition-transform ${expanded ? "rotate-180" : ""}`} stroke="currentColor" strokeWidth="2.5">
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>
      {expanded && (
        <div className="divide-y" style={{ borderTop: "1px solid var(--border)", borderColor: "var(--border)" }}>
          {logs.map((l) => (
            <EditableRow
              key={l.id}
              log={l}
              draftValue={amountDrafts[l.id] ?? ""}
              onDraftChange={(v) => setAmountDrafts((d) => ({ ...d, [l.id]: v }))}
              noteValue={noteDrafts[l.id] ?? ""}
              onNoteChange={(v) => setNoteDrafts((d) => ({ ...d, [l.id]: v }))}
              onSave={() => handleSave(l.id)}
              saving={savingId === l.id}
            />
          ))}
          {logs.length === 0 && (
            <p className="text-[13px] text-[#555] text-center py-6">Bu dönemde henüz kayıt yok.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function UcretGirisiView({ employees }: { employees: EmployeeWorklogs[] }) {
  async function handleLogout() {
    try { await fetch("/api/musteri/auth/logout", { method: "POST" }); } catch { /* ignore */ }
    window.location.href = "/musteri/giris";
  }

  const totalUnpriced = employees.reduce((s, e) => s + e.logs.filter((l) => !l.amount).length, 0);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <header className="sticky top-0 z-50 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-3"
        style={{ background: "var(--header-bg)", WebkitBackdropFilter: "blur(20px)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <a href="/musteri/calisan"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all flex-shrink-0"
            style={{ background: "rgba(192,132,252,0.1)", border: "1px solid rgba(192,132,252,0.2)", color: "#c084fc" }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M5 12l7 7M5 12l7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Çalışan Paneli
          </a>
          <span className="text-[#555] hidden sm:inline">/</span>
          <span className="text-[13px] sm:text-[14px] font-semibold text-white truncate">Ücret Girişi</span>
        </div>
        <button onClick={handleLogout} className="text-[12px] sm:text-[13px] text-[#8a8a9a] hover:text-[#f87171] transition-colors flex-shrink-0 min-h-[44px] px-1 flex items-center">
          Çıkış
        </button>
      </header>

      <main className="max-w-[720px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="mb-6">
          <h1 className="font-black text-[22px] sm:text-[24px] text-white mb-1">Ücret Girişi</h1>
          <p className="text-[13px] text-[#8a8a9a]">Çalışanların bu dönem girdiği işler — karşısına ücret yaz.</p>
        </div>

        {totalUnpriced > 0 && (
          <div className="mb-6 px-4 py-3 rounded-xl flex items-center gap-3"
            style={{ background: "rgba(34,211,238,0.07)", border: "1px solid rgba(34,211,238,0.2)" }}>
            <span className="text-[15px] flex-shrink-0">📝</span>
            <p className="text-[13px]" style={{ color: "#22d3ee" }}>
              Toplam <span className="font-semibold">{totalUnpriced}</span> fiyatlandırılmamış kayıt var.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {employees.map((e) => (
            <EmployeeSection key={e.userId} employee={e} />
          ))}
          {employees.length === 0 && (
            <p className="text-[13px] text-[#8a8a9a] text-center py-10">Henüz çalışan yok.</p>
          )}
        </div>
      </main>
    </div>
  );
}
