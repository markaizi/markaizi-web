"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface WorkLogEntry { id: string; date: string; description: string; amount: string | null; adminNote?: string | null; }
export interface ArchivedPeriodSummary {
  key: string; label: string; count: number; total: number;
  advancesInPeriod: number; remaining: number; paid: boolean;
}
export interface PaymentHistoryEntry {
  id: string; kind: "AVANS" | "DONEM_ODEMESI"; amount: number;
  description: string | null; periodLabel: string | null; date: string;
}

export interface EmployeeDetailData {
  id: string;
  username: string;
  name: string;
  email: string;
  workflowAccess: boolean;
  workflowCanCreateCards: boolean;
  workflowCanDragCards: boolean;
  workflowCanWriteRevisionNote: boolean;
  workflowCanDeleteAnyCard: boolean;
  workflowCanManageColumns: boolean;
  workflowSeeAllCards: boolean;
  adminCanCompleteCards: boolean;
  adminCanPriceWorklogs: boolean;
  adminCanViewEconomy: boolean;
  paymentDay: number | null;
  currentPeriod: { key: string; label: string };
  currentLogs: WorkLogEntry[];
  archivedSummary: ArchivedPeriodSummary[];
  paymentHistory: PaymentHistoryEntry[];
  assignments: {
    id: string;
    client: { id: string; slug: string; name: string };
    canViewContent: boolean;
    canManageContent: boolean;
    canViewUpdates: boolean;
    canManageUpdates: boolean;
    canViewInvoices: boolean;
    canManageInvoices: boolean;
  }[];
}

function parseAmount(raw: string | null): number {
  if (!raw) return 0;
  const digits = raw.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

function fmtLogDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

function WorkLogEditableRow({
  log,
  draftValue,
  onDraftChange,
  noteValue,
  onNoteChange,
  onSave,
  onDelete,
  saving,
  deleting,
}: {
  log: WorkLogEntry;
  draftValue: string;
  onDraftChange: (v: string) => void;
  noteValue: string;
  onNoteChange: (v: string) => void;
  onSave: () => void;
  onDelete: () => void;
  saving: boolean;
  deleting: boolean;
}) {
  const [showNote, setShowNote] = useState(!!noteValue);
  return (
    <div className="px-6 py-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-[#555] mb-1">{fmtLogDate(log.date)}</p>
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
          title="Çalışana görünecek bir not ekle (örn. neden normalden yüksek)"
          className="text-[11px] font-semibold flex-shrink-0 transition-colors"
          style={{ color: noteValue ? "#fbbf24" : "#555" }}
        >
          📝{noteValue ? " Not var" : " Not ekle"}
        </button>
        <button onClick={onSave} disabled={saving} className="text-[11px] font-semibold text-[#c084fc] hover:text-white transition-colors flex-shrink-0">
          {saving ? "..." : "Kaydet"}
        </button>
        <button onClick={onDelete} disabled={deleting} className="text-[11px] text-[#555] hover:text-red-400 transition-colors flex-shrink-0">
          {deleting ? "..." : "Sil"}
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

interface ClientOption { id: string; slug: string; name: string; }

const SECTIONS = [
  { label: "İçerikler",    viewKey: "canViewContent"   as const, manageKey: "canManageContent"   as const },
  { label: "Güncellemeler",viewKey: "canViewUpdates"   as const, manageKey: "canManageUpdates"   as const },
  { label: "Faturalar",    viewKey: "canViewInvoices"  as const, manageKey: "canManageInvoices"  as const },
];

type SectionState = "yok" | "goruntule" | "duzenle";
type ViewKey = typeof SECTIONS[number]["viewKey"];
type ManageKey = typeof SECTIONS[number]["manageKey"];

function getState(view: boolean, manage: boolean): SectionState {
  if (manage) return "duzenle";
  if (view) return "goruntule";
  return "yok";
}

type LocalAssign = {
  id: string | null;
  canViewContent: boolean;
  canManageContent: boolean;
  canViewUpdates: boolean;
  canManageUpdates: boolean;
  canViewInvoices: boolean;
  canManageInvoices: boolean;
};

const DEFAULT_PERMS: Omit<LocalAssign, "id"> = {
  canViewContent: true,   canManageContent: true,
  canViewUpdates: true,   canManageUpdates: true,
  canViewInvoices: false, canManageInvoices: false,
};

const WORKFLOW_TOGGLES = [
  { key: "workflowAccess" as const, label: "Erişim", desc: "İş Akışı panosunu görebilir. Kapalıysa diğer yetkiler etkisiz." },
  { key: "workflowCanCreateCards" as const, label: "Kart Açma ve Düzenleme", desc: "Yeni kart oluşturur; başlık, öncelik, tarih, atanan kişi ve firma alanlarını düzenler; kendi oluşturduğu kartı siler. Kapalıysa sadece açıklama ekleyebilir." },
  { key: "workflowCanDragCards" as const, label: "Kart Taşıma (Sürükleme)", desc: "Kartları sütunlar arasında sürükleyip taşıyabilir." },
  { key: "workflowCanWriteRevisionNote" as const, label: "Revize Notu Yazma", desc: "Kartlara revize notu ekleyebilir/düzenleyebilir. Kapalıysa sadece admin yazabilir." },
  { key: "workflowCanDeleteAnyCard" as const, label: "Tüm Kartları Silme", desc: "Başkasının oluşturduğu kartları da silebilir." },
  { key: "workflowCanManageColumns" as const, label: "Sütun Yönetimi", desc: "Sütun ekler, yeniden adlandırır, siler." },
  { key: "workflowSeeAllCards" as const, label: "Tüm Kartları Görme", desc: "Kapalıysa panoda yalnızca kendine atanmış kartları ve kimseye atanmamış kartları görür." },
];

// Yönetici Yetkileri — normalde sadece admin'e özel işlemler, admin açıkça
// izin verdiğinde tek tek açılır. workflowAccess'ten bağımsızdır.
const ADMIN_TOGGLES = [
  { key: "adminCanCompleteCards" as const, label: "Tamamlandı'ya Kart Taşıma", desc: "İş Akışı'nda \"Tamamlandı\" sütununa kart taşıyabilir. Kart bir kez oraya taşındıktan sonra yine sadece admin dokunabilir." },
  { key: "adminCanPriceWorklogs" as const, label: "Çalışanlara Ücret Girme", desc: "Tüm çalışanların bu dönem iş kayıtlarını görüp karşılarına ücret yazabilir (Ücret Girişi sayfası)." },
  { key: "adminCanViewEconomy" as const, label: "Ekonomiyi Görme", desc: "Ekonomi sayfasını salt okunur görebilir — gelir/gider ekleyemez, kayıt silemez." },
];

export default function AdminEmployeeDetail({
  employee,
  allClients,
}: {
  employee: EmployeeDetailData;
  allClients: ClientOption[];
}) {
  const router = useRouter();

  // ── Çalışan bilgi formu ──────────────────────────────────────────────────
  const [form, setForm] = useState({ name: employee.name, email: employee.email, username: employee.username, password: "" });
  const [savingInfo, setSavingInfo] = useState(false);
  const [infoErr, setInfoErr] = useState("");
  const [infoOk, setInfoOk] = useState(false);

  async function handleSaveInfo(e: React.FormEvent) {
    e.preventDefault();
    setSavingInfo(true); setInfoErr(""); setInfoOk(false);
    const body: Record<string, string> = { name: form.name, email: form.email, username: form.username };
    if (form.password) body.password = form.password;
    const res = await fetch(`/api/musteri/admin/employees/${employee.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    const json = await res.json();
    setSavingInfo(false);
    if (json.ok) { setInfoOk(true); setForm((f) => ({ ...f, password: "" })); router.refresh(); }
    else setInfoErr(json.error ?? "Hata.");
  }

  async function handleDelete() {
    if (!confirm(`"${employee.name}" çalışanı sil? Bu işlem geri alınamaz.`)) return;
    await fetch(`/api/musteri/admin/employees/${employee.id}`, { method: "DELETE" });
    router.push("/musteri/admin/calisanlar");
  }

  // ── İş Akışı yetkileri ───────────────────────────────────────────────────
  const [wf, setWf] = useState({
    workflowAccess: employee.workflowAccess,
    workflowCanCreateCards: employee.workflowCanCreateCards,
    workflowCanDragCards: employee.workflowCanDragCards,
    workflowCanWriteRevisionNote: employee.workflowCanWriteRevisionNote,
    workflowCanDeleteAnyCard: employee.workflowCanDeleteAnyCard,
    workflowCanManageColumns: employee.workflowCanManageColumns,
    workflowSeeAllCards: employee.workflowSeeAllCards,
    adminCanCompleteCards: employee.adminCanCompleteCards,
    adminCanPriceWorklogs: employee.adminCanPriceWorklogs,
    adminCanViewEconomy: employee.adminCanViewEconomy,
  });
  const [wfLoading, setWfLoading] = useState<string | null>(null);

  async function handleWfToggle(key: keyof typeof wf, val: boolean) {
    setWfLoading(key);
    setWf((w) => ({ ...w, [key]: val }));
    await fetch(`/api/musteri/admin/employees/${employee.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ [key]: val }),
    });
    setWfLoading(null);
  }

  // ── Firma atamaları ──────────────────────────────────────────────────────
  const [localAssign, setLocalAssign] = useState<Map<string, LocalAssign>>(() => {
    const m = new Map<string, LocalAssign>();
    employee.assignments.forEach((a) => {
      m.set(a.client.id, {
        id: a.id,
        canViewContent: a.canViewContent, canManageContent: a.canManageContent,
        canViewUpdates: a.canViewUpdates, canManageUpdates: a.canManageUpdates,
        canViewInvoices: a.canViewInvoices, canManageInvoices: a.canManageInvoices,
      });
    });
    return m;
  });

  async function handleToggleClient(client: ClientOption) {
    const current = localAssign.get(client.id);
    if (current) {
      const newMap = new Map(localAssign);
      newMap.delete(client.id);
      setLocalAssign(newMap);
      if (current.id) {
        await fetch(`/api/musteri/admin/assignments/${current.id}`, { method: "DELETE" });
        router.refresh();
      }
    } else {
      const newMap = new Map(localAssign);
      newMap.set(client.id, { id: null, ...DEFAULT_PERMS });
      setLocalAssign(newMap);
      const res = await fetch("/api/musteri/admin/assignments", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: employee.id, clientSlug: client.slug, ...DEFAULT_PERMS }),
      });
      const json = await res.json();
      if (json.ok) {
        newMap.set(client.id, { id: json.id, ...DEFAULT_PERMS });
        setLocalAssign(new Map(newMap));
        router.refresh();
      }
    }
  }

  async function handleSectionChange(clientId: string, section: typeof SECTIONS[number], state: SectionState) {
    const current = localAssign.get(clientId);
    if (!current) return;
    const updates: Partial<Record<ViewKey | ManageKey, boolean>> = {
      [section.viewKey]: state !== "yok",
      [section.manageKey]: state === "duzenle",
    };
    const updated = { ...current, ...updates };
    const newMap = new Map(localAssign);
    newMap.set(clientId, updated);
    setLocalAssign(newMap);
    if (current.id) {
      await fetch(`/api/musteri/admin/assignments/${current.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updates),
      });
    }
  }

  // ── Ödeme günü ────────────────────────────────────────────────────────────
  const [paymentDay, setPaymentDay] = useState<number | null>(employee.paymentDay);
  const [paymentDaySaving, setPaymentDaySaving] = useState(false);

  async function handleSavePaymentDay(val: number | null) {
    setPaymentDay(val);
    setPaymentDaySaving(true);
    await fetch(`/api/musteri/admin/employees/${employee.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paymentDay: val }),
    });
    setPaymentDaySaving(false);
    router.refresh();
  }

  // ── İş Kayıtları — mevcut dönem ──────────────────────────────────────────
  const [currentLogs, setCurrentLogs] = useState(employee.currentLogs);
  const [amountDrafts, setAmountDrafts] = useState<Record<string, string>>(
    () => Object.fromEntries(employee.currentLogs.map((l) => [l.id, l.amount ?? ""]))
  );
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>(
    () => Object.fromEntries(employee.currentLogs.map((l) => [l.id, l.adminNote ?? ""]))
  );
  const [savingLogId, setSavingLogId] = useState<string | null>(null);
  const [deletingLogId, setDeletingLogId] = useState<string | null>(null);
  const [bulkSavingCurrent, setBulkSavingCurrent] = useState(false);

  async function handleBulkSaveCurrent() {
    const toSave = currentLogs.filter((l) =>
      (amountDrafts[l.id] ?? "").trim() !== (l.amount ?? "") || (noteDrafts[l.id] ?? "").trim() !== (l.adminNote ?? "")
    );
    if (toSave.length === 0) return;
    setBulkSavingCurrent(true);
    const results = await Promise.all(toSave.map(async (l) => {
      const amount = amountDrafts[l.id]?.trim() || null;
      const adminNote = noteDrafts[l.id]?.trim() || null;
      const res = await fetch(`/api/musteri/admin/worklogs/${l.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount, adminNote }),
      });
      const json = await res.json();
      return { id: l.id, ok: !!json.ok, amount: json.log?.amount as string | null | undefined, adminNote: json.log?.adminNote as string | null | undefined };
    }));
    setCurrentLogs((prev) => prev.map((l) => {
      const r = results.find((x) => x.id === l.id);
      return r?.ok ? { ...l, amount: r.amount ?? null, adminNote: r.adminNote ?? null } : l;
    }));
    setBulkSavingCurrent(false);
  }

  async function handleSaveAmount(logId: string) {
    setSavingLogId(logId);
    const amount = amountDrafts[logId]?.trim() || null;
    const adminNote = noteDrafts[logId]?.trim() || null;
    const res = await fetch(`/api/musteri/admin/worklogs/${logId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount, adminNote }),
    });
    const json = await res.json();
    setSavingLogId(null);
    if (json.ok) {
      setCurrentLogs((prev) => prev.map((l) => (l.id === logId ? { ...l, amount: json.log.amount, adminNote: json.log.adminNote } : l)));
    }
  }

  async function handleDeleteLog(logId: string) {
    if (!confirm("Bu iş kaydını sil?")) return;
    setDeletingLogId(logId);
    await fetch(`/api/musteri/admin/worklogs/${logId}`, { method: "DELETE" });
    setCurrentLogs((prev) => prev.filter((l) => l.id !== logId));
    setDeletingLogId(null);
  }

  const currentTotal = currentLogs.reduce((s, l) => s + parseAmount(l.amount), 0);

  // ── İş Kayıtları — arşiv (lazy-load) ─────────────────────────────────────
  const [summaries, setSummaries] = useState(employee.archivedSummary);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [archivedEntries, setArchivedEntries] = useState<Record<string, WorkLogEntry[]>>({});
  const [archivedAmountDrafts, setArchivedAmountDrafts] = useState<Record<string, string>>({});
  const [archivedNoteDrafts, setArchivedNoteDrafts] = useState<Record<string, string>>({});
  const [archivedSavingId, setArchivedSavingId] = useState<string | null>(null);
  const [archivedDeletingId, setArchivedDeletingId] = useState<string | null>(null);
  const [bulkSavingArchived, setBulkSavingArchived] = useState<string | null>(null);

  async function handleBulkSaveArchived(periodKey: string) {
    const entries = archivedEntries[periodKey] ?? [];
    const toSave = entries.filter((l) =>
      (archivedAmountDrafts[l.id] ?? "").trim() !== (l.amount ?? "") || (archivedNoteDrafts[l.id] ?? "").trim() !== (l.adminNote ?? "")
    );
    if (toSave.length === 0) return;
    setBulkSavingArchived(periodKey);
    const results = await Promise.all(toSave.map(async (l) => {
      const amount = archivedAmountDrafts[l.id]?.trim() || null;
      const adminNote = archivedNoteDrafts[l.id]?.trim() || null;
      const res = await fetch(`/api/musteri/admin/worklogs/${l.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount, adminNote }),
      });
      const json = await res.json();
      return { id: l.id, ok: !!json.ok, amount: json.log?.amount as string | null | undefined, adminNote: json.log?.adminNote as string | null | undefined, before: l.amount };
    }));
    setArchivedEntries((prev) => ({
      ...prev,
      [periodKey]: (prev[periodKey] ?? []).map((l) => {
        const r = results.find((x) => x.id === l.id);
        return r?.ok ? { ...l, amount: r.amount ?? null, adminNote: r.adminNote ?? null } : l;
      }),
    }));
    const delta = results.reduce((s, r) => (r.ok ? s + (parseAmount(r.amount ?? null) - parseAmount(r.before)) : s), 0);
    if (delta !== 0) {
      setSummaries((prev) => prev.map((s) => (s.key === periodKey ? { ...s, total: s.total + delta } : s)));
    }
    setBulkSavingArchived(null);
  }

  // Ödeme günü değişince (handleSavePaymentDay → router.refresh()) sunucudan gelen
  // yeni employee.currentPeriod/currentLogs/archivedSummary ile client state'i
  // yeniden senkronize et — useState'in ilk değeri prop değişince kendiliğinden
  // güncellenmez.
  useEffect(() => {
    setCurrentLogs(employee.currentLogs);
    setAmountDrafts(Object.fromEntries(employee.currentLogs.map((l) => [l.id, l.amount ?? ""])));
    setNoteDrafts(Object.fromEntries(employee.currentLogs.map((l) => [l.id, l.adminNote ?? ""])));
    setSummaries(employee.archivedSummary);
    setArchivedEntries({});
    setArchivedAmountDrafts({});
    setArchivedNoteDrafts({});
    setExpandedKey(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee.currentPeriod.key]);

  async function handleExpandPeriod(periodKey: string) {
    if (expandedKey === periodKey) { setExpandedKey(null); return; }
    setExpandedKey(periodKey);
    if (archivedEntries[periodKey]) return;
    setLoadingKey(periodKey);
    const res = await fetch(`/api/musteri/admin/worklogs/period?userId=${employee.id}&periodEnd=${periodKey}`);
    const json = await res.json();
    setLoadingKey(null);
    if (json.logs) {
      setArchivedEntries((prev) => ({ ...prev, [periodKey]: json.logs }));
      setArchivedAmountDrafts((prev) => ({
        ...prev,
        ...Object.fromEntries(json.logs.map((l: WorkLogEntry) => [l.id, l.amount ?? ""])),
      }));
      setArchivedNoteDrafts((prev) => ({
        ...prev,
        ...Object.fromEntries(json.logs.map((l: WorkLogEntry) => [l.id, l.adminNote ?? ""])),
      }));
    }
  }

  async function handleSaveArchivedAmount(periodKey: string, logId: string) {
    setArchivedSavingId(logId);
    const before = (archivedEntries[periodKey] ?? []).find((l) => l.id === logId);
    const amount = archivedAmountDrafts[logId]?.trim() || null;
    const adminNote = archivedNoteDrafts[logId]?.trim() || null;
    const res = await fetch(`/api/musteri/admin/worklogs/${logId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount, adminNote }),
    });
    const json = await res.json();
    setArchivedSavingId(null);
    if (json.ok) {
      setArchivedEntries((prev) => ({
        ...prev,
        [periodKey]: (prev[periodKey] ?? []).map((l) => (l.id === logId ? { ...l, amount: json.log.amount, adminNote: json.log.adminNote } : l)),
      }));
      const delta = parseAmount(json.log.amount) - parseAmount(before?.amount ?? null);
      if (delta !== 0) {
        setSummaries((prev) => prev.map((s) => (s.key === periodKey ? { ...s, total: s.total + delta } : s)));
      }
    }
  }

  async function handleDeleteArchivedLog(periodKey: string, logId: string) {
    if (!confirm("Bu iş kaydını sil?")) return;
    setArchivedDeletingId(logId);
    const before = (archivedEntries[periodKey] ?? []).find((l) => l.id === logId);
    await fetch(`/api/musteri/admin/worklogs/${logId}`, { method: "DELETE" });
    setArchivedEntries((prev) => ({
      ...prev,
      [periodKey]: (prev[periodKey] ?? []).filter((l) => l.id !== logId),
    }));
    setSummaries((prev) => prev.map((s) => (s.key === periodKey
      ? { ...s, count: s.count - 1, total: s.total - parseAmount(before?.amount ?? null) }
      : s)));
    setArchivedDeletingId(null);
  }

  // ── Avans / Ara Ödeme ─────────────────────────────────────────────────────
  const [showAdvanceForm, setShowAdvanceForm] = useState(false);
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [advanceDesc, setAdvanceDesc] = useState("");
  const [advanceDate, setAdvanceDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [advanceSaving, setAdvanceSaving] = useState(false);
  const [advanceError, setAdvanceError] = useState("");
  const [paymentHistory, setPaymentHistory] = useState(employee.paymentHistory);

  async function handleAddAdvance(e: React.FormEvent) {
    e.preventDefault();
    if (!advanceAmount.trim()) return;
    setAdvanceSaving(true);
    setAdvanceError("");
    const res = await fetch(`/api/musteri/admin/employees/${employee.id}/advance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: advanceAmount.trim(), description: advanceDesc.trim() || undefined, date: advanceDate }),
    });
    const json = await res.json();
    setAdvanceSaving(false);
    if (!res.ok) { setAdvanceError(json.error ?? "Kaydedilemedi."); return; }
    setPaymentHistory((prev) => [
      { id: json.payment.id, kind: "AVANS", amount: parseAmount(advanceAmount), description: advanceDesc.trim() || null, periodLabel: null, date: new Date(advanceDate).toISOString() },
      ...prev,
    ]);
    setAdvanceAmount("");
    setAdvanceDesc("");
    setShowAdvanceForm(false);
    router.refresh();
  }

  // ── Dönem Ödemesi ─────────────────────────────────────────────────────────
  const [payingKey, setPayingKey] = useState<string | null>(null);
  const [payErrorKey, setPayErrorKey] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);

  async function handlePayPeriod(periodKey: string) {
    setPayingKey(periodKey);
    setPayErrorKey(null);
    setPayError(null);
    const res = await fetch(`/api/musteri/admin/employees/${employee.id}/period-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ periodEnd: periodKey }),
    });
    const json = await res.json();
    setPayingKey(null);
    if (!res.ok) { setPayErrorKey(periodKey); setPayError(json.error ?? "Ödeme kaydedilemedi."); return; }
    setSummaries((prev) => prev.map((s) => (s.key === periodKey ? { ...s, paid: true } : s)));
    setPaymentHistory((prev) => [
      { id: json.payment.id, kind: "DONEM_ODEMESI", amount: json.remaining, description: null, periodLabel: summaries.find((s) => s.key === periodKey)?.label ?? null, date: new Date().toISOString() },
      ...prev,
    ]);
    router.refresh();
  }

  const [showAssignments, setShowAssignments] = useState(false);
  const assignedCount = localAssign.size;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <header className="sticky top-0 z-50 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-3"
        style={{ background: "rgba(5,5,5,0.9)", WebkitBackdropFilter: "blur(20px)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <a href="/musteri/admin" className="font-black text-[16px] sm:text-[18px] gradient-text flex-shrink-0">markaizi</a>
          <span className="hidden sm:inline text-[#555]">/</span>
          <a href="/musteri/admin/calisanlar" className="hidden sm:inline text-[14px] text-[#8a8a9a] hover:text-white transition-colors">Çalışanlar</a>
          <span className="hidden sm:inline text-[#555]">/</span>
          <span className="text-[13px] sm:text-[14px] font-semibold text-white truncate">{employee.name}</span>
        </div>
        <a href="/musteri/admin/calisanlar" className="text-[12px] sm:text-[13px] text-[#8a8a9a] hover:text-white transition-colors flex-shrink-0">← Çalışanlara Dön</a>
      </header>

      <main className="max-w-[720px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Üst bilgi */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-[20px]"
            style={{ background: "var(--grad-soft)", border: "1px solid rgba(168,85,247,0.25)", color: "#c084fc" }}>
            {employee.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h1 className="font-black text-[22px] text-white truncate">{employee.name}</h1>
            <p className="text-[13px] text-[#8a8a9a] truncate">@{employee.username} · {employee.email}</p>
          </div>
          <span className="ml-auto flex-shrink-0 text-[12px] px-2.5 py-1 rounded-full"
            style={{ background: assignedCount > 0 ? "rgba(168,85,247,0.12)" : "rgba(138,138,154,0.1)", color: assignedCount > 0 ? "#c084fc" : "#555" }}>
            {assignedCount} firma
          </span>
        </div>

        {/* Çalışan bilgileri */}
        <form onSubmit={handleSaveInfo} className="rounded-2xl p-6 space-y-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <p className="font-semibold text-white text-[14px]">Çalışan Bilgileri</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Ad Soyad</label>
              <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg text-[14px] text-white outline-none focus:ring-1 focus:ring-purple-500/50"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Kullanıcı Adı</label>
              <input required value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg text-[14px] text-white outline-none focus:ring-1 focus:ring-purple-500/50"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">E-posta</label>
              <input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg text-[14px] text-white outline-none focus:ring-1 focus:ring-purple-500/50"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Yeni Şifre</label>
              <input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="Boş bırakırsan değişmez"
                className="w-full px-3 py-2.5 rounded-lg text-[14px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-purple-500/50"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }} />
            </div>
          </div>

          {infoErr && <p className="text-[12px] text-red-400">{infoErr}</p>}
          {infoOk && <p className="text-[12px] text-green-400">Kaydedildi.</p>}
          <div className="flex justify-between items-center pt-1">
            <button type="submit" disabled={savingInfo} className="btn btn-primary text-sm px-5 py-2">
              {savingInfo ? "Kaydediliyor..." : "Kaydet"}
            </button>
            <button type="button" onClick={handleDelete} className="text-[12px] text-red-400 hover:text-red-300 transition-colors">
              Çalışanı Sil
            </button>
          </div>
        </form>

        {/* İş Akışı Yetkileri */}
        <div className="rounded-2xl p-6 space-y-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div>
            <p className="font-semibold text-white text-[14px]">İş Akışı Yetkileri</p>
            <p className="text-[12px] text-[#8a8a9a] mt-0.5">Ajans-içi kanban panosu için bu çalışana özel yetkiler.</p>
          </div>
          <div className="space-y-3">
            {WORKFLOW_TOGGLES.map((t) => {
              const active = wf[t.key];
              const dimmed = t.key !== "workflowAccess" && !wf.workflowAccess;
              return (
                <div key={t.key} className="flex items-center justify-between gap-4 py-2" style={{ opacity: dimmed ? 0.45 : 1 }}>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-white">{t.label}</p>
                    <p className="text-[11px] text-[#8a8a9a] mt-0.5">{t.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleWfToggle(t.key, !active)}
                    disabled={wfLoading === t.key}
                    className="flex-shrink-0 relative w-11 h-6 rounded-full transition-colors"
                    style={{ background: active ? "rgba(168,85,247,0.6)" : "var(--surface-2, #141420)", border: "1px solid var(--border)" }}
                    aria-label={t.label}
                  >
                    <span
                      className="absolute top-[2px] w-5 h-5 rounded-full bg-white transition-transform"
                      style={{ transform: active ? "translateX(21px)" : "translateX(2px)" }}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Yönetici Yetkileri */}
        <div className="rounded-2xl p-6 space-y-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div>
            <p className="font-semibold text-white text-[14px]">Yönetici Yetkileri</p>
            <p className="text-[12px] text-[#8a8a9a] mt-0.5">Normalde sadece admin'e özel işlemler — istediğini tek tek aç, hepsi varsayılan kapalı.</p>
          </div>
          <div className="space-y-3">
            {ADMIN_TOGGLES.map((t) => {
              const active = wf[t.key];
              return (
                <div key={t.key} className="flex items-center justify-between gap-4 py-2">
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-white">{t.label}</p>
                    <p className="text-[11px] text-[#8a8a9a] mt-0.5">{t.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleWfToggle(t.key, !active)}
                    disabled={wfLoading === t.key}
                    className="flex-shrink-0 relative w-11 h-6 rounded-full transition-colors"
                    style={{ background: active ? "rgba(251,191,36,0.6)" : "var(--surface-2, #141420)", border: "1px solid var(--border)" }}
                    aria-label={t.label}
                  >
                    <span
                      className="absolute top-[2px] w-5 h-5 rounded-full bg-white transition-transform"
                      style={{ transform: active ? "translateX(21px)" : "translateX(2px)" }}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Firma Atamaları — özet + ayrı modal */}
        <div className="rounded-2xl p-6 flex items-center justify-between gap-3 flex-wrap" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div>
            <p className="font-semibold text-white text-[14px]">Firma Atamaları</p>
            <p className="text-[12px] text-[#8a8a9a] mt-0.5">
              {assignedCount > 0 ? `${assignedCount} firmaya atanmış — erişim ve yetkileri buradan düzenle.` : "Henüz firma atanmadı."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAssignments(true)}
            className="text-[13px] font-semibold px-4 py-2 rounded-xl transition-all flex-shrink-0"
            style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)", color: "#c084fc" }}
          >
            Firma Atamalarını Düzenle
          </button>
        </div>

        {/* Ödeme Günü */}
        <div className="rounded-2xl p-6 space-y-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div>
            <p className="font-semibold text-white text-[14px]">Ödeme Günü</p>
            <p className="text-[12px] text-[#8a8a9a] mt-0.5">İş kayıtları bu güne göre dönemlere ayrılıp arşivlenir. Çalışan kendi panelinde bunu görür.</p>
          </div>
          <select
            value={paymentDay ?? ""}
            onChange={(e) => handleSavePaymentDay(e.target.value ? Number(e.target.value) : null)}
            disabled={paymentDaySaving}
            className="w-full px-3 py-2.5 rounded-lg text-[14px] text-white outline-none focus:ring-1 focus:ring-purple-500/50"
            style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
          >
            <option value="">Belirtilmedi (takvim ayına göre arşivlenir)</option>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>Her ayın {d}. günü</option>
            ))}
          </select>
        </div>

        {/* Avans / Ara Ödeme */}
        <div className="rounded-2xl p-6 space-y-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="font-semibold text-white text-[14px]">Avans / Ara Ödeme</p>
              <p className="text-[12px] text-[#8a8a9a] mt-0.5">Döneme bağlı olmadan istenildiği an verilebilir — anında Ekonomi&apos;ye gider yazılır.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowAdvanceForm((v) => !v)}
              className="text-[13px] font-semibold px-4 min-h-[44px] rounded-xl transition-all flex-shrink-0"
              style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.25)", color: "#fbbf24" }}
            >
              {showAdvanceForm ? "İptal" : "+ Avans Ver"}
            </button>
          </div>
          {showAdvanceForm && (
            <form onSubmit={handleAddAdvance} className="space-y-3 pt-1">
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={advanceAmount}
                  onChange={(e) => setAdvanceAmount(e.target.value)}
                  placeholder="Örn: 2.000 ₺"
                  className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-white placeholder-[#555] outline-none"
                  style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                />
                <input
                  type="date"
                  value={advanceDate}
                  onChange={(e) => setAdvanceDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-white outline-none"
                  style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                />
              </div>
              <input
                value={advanceDesc}
                onChange={(e) => setAdvanceDesc(e.target.value)}
                placeholder="Açıklama (opsiyonel)"
                className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-white placeholder-[#555] outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
              />
              {advanceError && <p className="text-[12px]" style={{ color: "#f87171" }}>{advanceError}</p>}
              <button type="submit" disabled={advanceSaving} className="btn btn-primary text-sm px-5 py-2">
                {advanceSaving ? "Kaydediliyor..." : "Avansı Kaydet"}
              </button>
            </form>
          )}
          {paymentHistory.length > 0 && (
            <div className="pt-2 space-y-1.5" style={{ borderTop: paymentHistory.length > 0 ? "1px solid var(--border)" : undefined }}>
              <p className="text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide pt-2">Ödeme Geçmişi</p>
              {paymentHistory.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 text-[13px] py-1">
                  <span className="text-[#c8c8d8] truncate">
                    {p.kind === "AVANS" ? "Avans" : `Dönem Ödemesi${p.periodLabel ? ` — ${p.periodLabel}` : ""}`}
                    {p.description ? ` · ${p.description}` : ""}
                  </span>
                  <span className="flex-shrink-0 flex items-center gap-2">
                    <span className="text-[#555] text-[11px]">{fmtLogDate(p.date)}</span>
                    <span className="font-bold" style={{ color: "#f87171" }}>{p.amount.toLocaleString("tr-TR")} ₺</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* İş Kayıtları — Mevcut Dönem */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="px-6 py-4 flex items-center justify-between gap-3 flex-wrap" style={{ borderBottom: "1px solid var(--border)" }}>
            <div>
              <p className="font-semibold text-white text-[14px]">Bu Dönem — {employee.currentPeriod.label}</p>
              <p className="text-[12px] text-[#8a8a9a] mt-0.5">Çalışanın günlük girdiği işler — karşısına ücret yaz.</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[12px] font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(52,211,153,0.12)", color: "#34d399" }}>
                Toplam {currentTotal.toLocaleString("tr-TR")} ₺
              </span>
              {currentLogs.length > 0 && (
                <button
                  onClick={handleBulkSaveCurrent}
                  disabled={bulkSavingCurrent}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors"
                  style={{ background: "rgba(168,85,247,0.12)", color: "#c084fc" }}
                >
                  {bulkSavingCurrent ? "Kaydediliyor..." : "Toplu Kaydet"}
                </button>
              )}
              {currentLogs.length > 0 && (
                <a
                  href={`/api/musteri/admin/worklogs/pdf?userId=${employee.id}&periodEnd=${employee.currentPeriod.key}`}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors"
                  style={{ background: "rgba(96,165,250,0.12)", color: "#60a5fa" }}
                >
                  PDF İndir
                </a>
              )}
            </div>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {currentLogs.map((l) => (
              <WorkLogEditableRow
                key={l.id}
                log={l}
                draftValue={amountDrafts[l.id] ?? ""}
                onDraftChange={(v) => setAmountDrafts((d) => ({ ...d, [l.id]: v }))}
                noteValue={noteDrafts[l.id] ?? ""}
                onNoteChange={(v) => setNoteDrafts((d) => ({ ...d, [l.id]: v }))}
                onSave={() => handleSaveAmount(l.id)}
                onDelete={() => handleDeleteLog(l.id)}
                saving={savingLogId === l.id}
                deleting={deletingLogId === l.id}
              />
            ))}
            {currentLogs.length === 0 && (
              <p className="text-[13px] text-[#8a8a9a] text-center py-8">Bu dönemde henüz iş kaydı yok.</p>
            )}
          </div>
        </div>

        {/* İş Kayıtları — Arşiv */}
        {summaries.some((s) => s.count > 0) && (
          <div className="space-y-3">
            <p className="text-[13px] font-bold uppercase tracking-wide text-[#8a8a9a] px-1">Geçmiş Dönemler</p>
            {summaries.filter((s) => s.count > 0).map((summary) => (
              <div key={summary.key} className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between gap-3 px-5 py-4 flex-wrap">
                  <button
                    onClick={() => handleExpandPeriod(summary.key)}
                    className="flex items-center gap-3 text-left flex-1 min-w-0"
                  >
                    <svg viewBox="0 0 24 24" fill="none" className={`w-4 h-4 text-[#555] flex-shrink-0 transition-transform ${expandedKey === summary.key ? "rotate-180" : ""}`} stroke="currentColor" strokeWidth="2.5">
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-white">{summary.label}</p>
                      <p className="text-[12px] text-[#8a8a9a] mt-0.5">{summary.count} kayıt</p>
                    </div>
                  </button>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[13px] font-bold" style={{ color: "#34d399" }}>
                      {summary.total > 0 ? `${summary.total.toLocaleString("tr-TR")} ₺` : "—"}
                    </span>
                    <a
                      href={`/api/musteri/admin/worklogs/pdf?userId=${employee.id}&periodEnd=${summary.key}`}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors"
                      style={{ background: "rgba(96,165,250,0.12)", color: "#60a5fa" }}
                    >
                      PDF
                    </a>
                  </div>
                </div>
                <div className="px-5 pb-4 flex items-center justify-between gap-3 flex-wrap" style={{ borderTop: "1px solid var(--border)" }}>
                  <div className="pt-3 min-w-0">
                    {summary.paid ? (
                      <span className="text-[12px] font-semibold" style={{ color: "#34d399" }}>✓ Ödendi</span>
                    ) : summary.advancesInPeriod > 0 ? (
                      <p className="text-[12px] text-[#8a8a9a]">
                        Bu dönemde avans: {summary.advancesInPeriod.toLocaleString("tr-TR")} ₺ · Ödenecek: <span className="font-semibold text-white">{summary.remaining.toLocaleString("tr-TR")} ₺</span>
                      </p>
                    ) : (
                      <p className="text-[12px] text-[#8a8a9a]">Ödenecek: <span className="font-semibold text-white">{summary.remaining.toLocaleString("tr-TR")} ₺</span></p>
                    )}
                    {payErrorKey === summary.key && payError && (
                      <p className="text-[11px] mt-1" style={{ color: "#f87171" }}>{payError}</p>
                    )}
                  </div>
                  {!summary.paid && (
                    <button
                      onClick={() => handlePayPeriod(summary.key)}
                      disabled={payingKey === summary.key}
                      className="mt-3 text-[12px] font-semibold px-3.5 min-h-[44px] rounded-lg transition-colors flex-shrink-0"
                      style={{ background: "rgba(52,211,153,0.12)", color: "#34d399", border: "1px solid rgba(52,211,153,0.25)" }}
                    >
                      {payingKey === summary.key ? "Ödeniyor..." : "Öde"}
                    </button>
                  )}
                </div>
                {expandedKey === summary.key && (
                  <div style={{ borderTop: "1px solid var(--border)" }}>
                    {loadingKey !== summary.key && (archivedEntries[summary.key] ?? []).length > 0 && (
                      <div className="px-6 py-3 flex justify-end" style={{ borderBottom: "1px solid var(--border)" }}>
                        <button
                          onClick={() => handleBulkSaveArchived(summary.key)}
                          disabled={bulkSavingArchived === summary.key}
                          className="text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors"
                          style={{ background: "rgba(168,85,247,0.12)", color: "#c084fc" }}
                        >
                          {bulkSavingArchived === summary.key ? "Kaydediliyor..." : "Toplu Kaydet"}
                        </button>
                      </div>
                    )}
                    <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                    {loadingKey === summary.key ? (
                      <p className="text-[13px] text-[#555] text-center py-6">Yükleniyor...</p>
                    ) : (
                      (archivedEntries[summary.key] ?? []).map((l) => (
                        <WorkLogEditableRow
                          key={l.id}
                          log={l}
                          draftValue={archivedAmountDrafts[l.id] ?? ""}
                          onDraftChange={(v) => setArchivedAmountDrafts((d) => ({ ...d, [l.id]: v }))}
                          noteValue={archivedNoteDrafts[l.id] ?? ""}
                          onNoteChange={(v) => setArchivedNoteDrafts((d) => ({ ...d, [l.id]: v }))}
                          onSave={() => handleSaveArchivedAmount(summary.key, l.id)}
                          onDelete={() => handleDeleteArchivedLog(summary.key, l.id)}
                          saving={archivedSavingId === l.id}
                          deleting={archivedDeletingId === l.id}
                        />
                      ))
                    )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {showAssignments && (
        <AssignmentsModal
          allClients={allClients}
          localAssign={localAssign}
          onToggleClient={handleToggleClient}
          onSectionChange={handleSectionChange}
          onClose={() => setShowAssignments(false)}
        />
      )}
    </div>
  );
}

// ── Firma Atamaları Modalı ────────────────────────────────────────────────────

function AssignmentsModal({
  allClients, localAssign, onToggleClient, onSectionChange, onClose,
}: {
  allClients: ClientOption[];
  localAssign: Map<string, LocalAssign>;
  onToggleClient: (client: ClientOption) => void;
  onSectionChange: (clientId: string, section: typeof SECTIONS[number], state: SectionState) => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.75)", WebkitBackdropFilter: "blur(8px)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-[560px] rounded-2xl relative max-h-[85vh] flex flex-col overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="px-6 py-5 flex items-start justify-between gap-3" style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <h2 className="font-bold text-[17px] text-white">Firma Atamaları</h2>
            <p className="text-[12px] text-[#8a8a9a] mt-0.5">Hangi firmalara erişebileceğini ve hangi bölümleri görüp yönetebileceğini seç.</p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full transition-all hover:bg-white/[0.08]">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-[#8a8a9a]" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto divide-y" style={{ borderColor: "var(--border)" }}>
          {allClients.map((client) => {
            const assigned = localAssign.get(client.id);
            return (
              <div key={client.id}>
                <label className="flex items-center gap-3 px-6 py-3 cursor-pointer hover:bg-white/[0.02] transition-colors select-none">
                  <input
                    type="checkbox"
                    checked={!!assigned}
                    onChange={() => onToggleClient(client)}
                    className="w-4 h-4 rounded accent-purple-500 cursor-pointer flex-shrink-0"
                  />
                  <span className="text-[14px] text-white font-medium flex-1">{client.name}</span>
                  {assigned && <span className="text-[11px] text-[#c084fc]">atandı</span>}
                </label>

                {assigned && (
                  <div className="px-6 pb-4 grid grid-cols-2 gap-x-6 gap-y-3" style={{ paddingLeft: "3.25rem" }}>
                    {SECTIONS.map((sec) => {
                      const state = getState(assigned[sec.viewKey], assigned[sec.manageKey]);
                      return (
                        <div key={sec.label}>
                          <p className="text-[10px] font-semibold text-[#555] uppercase tracking-wide mb-1.5">{sec.label}</p>
                          <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                            {(["yok", "goruntule", "duzenle"] as SectionState[]).map((s) => (
                              <button
                                key={s}
                                onClick={() => onSectionChange(client.id, sec, s)}
                                className="flex-1 text-[11px] py-1 transition-colors"
                                style={{
                                  background: state === s
                                    ? s === "yok" ? "rgba(138,138,154,0.2)" : s === "goruntule" ? "rgba(96,165,250,0.2)" : "rgba(168,85,247,0.2)"
                                    : "transparent",
                                  color: state === s
                                    ? s === "yok" ? "#8a8a9a" : s === "goruntule" ? "#60a5fa" : "#c084fc"
                                    : "#555",
                                  fontWeight: state === s ? 600 : 400,
                                }}>
                                {s === "yok" ? "Yok" : s === "goruntule" ? "Görüntüle" : "Düzenle"}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          {allClients.length === 0 && (
            <p className="text-[13px] text-[#8a8a9a] text-center py-8">Henüz firma yok.</p>
          )}
        </div>

        <div className="px-6 py-4" style={{ borderTop: "1px solid var(--border)" }}>
          <button type="button" onClick={onClose} className="btn btn-primary text-sm px-5 py-2 w-full">
            Bitti
          </button>
        </div>
      </div>
    </div>
  );
}
