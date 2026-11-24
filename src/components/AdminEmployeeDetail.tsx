"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/** Çalışana yapılan ödeme — Finans'tan (Kasa) girilir, burada yalnızca görüntülenir (v3.6.0). */
export interface EmployeePaymentRow {
  id: string; date: string; title: string; amount: number; status: "ODENDI" | "BEKLIYOR"; source: "kasa" | "eski";
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
  adminCompleteCardsScope: "NONE" | "OWN" | "ALL";
  payments: EmployeePaymentRow[];
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

const COMPLETE_SCOPE_OPTIONS: { value: "NONE" | "OWN" | "ALL"; label: string }[] = [
  { value: "NONE", label: "Kapalı" },
  { value: "OWN", label: "Sadece Kendi Kartları" },
  { value: "ALL", label: "Tüm Çalışanların Kartları" },
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
  });
  const [wfLoading, setWfLoading] = useState<string | null>(null);

  // "Tamamlandı'ya Kart Taşıma" 3 durumlu (Kapalı/Kendi/Herkes) — diğer
  // yetkiler gibi basit açık/kapalı değil, ayrı state ile yönetiliyor.
  const [completeScope, setCompleteScope] = useState(employee.adminCompleteCardsScope);
  const [completeScopeSaving, setCompleteScopeSaving] = useState(false);

  async function handleCompleteScopeChange(val: "NONE" | "OWN" | "ALL") {
    setCompleteScopeSaving(true);
    setCompleteScope(val);
    await fetch(`/api/musteri/admin/employees/${employee.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ adminCompleteCardsScope: val }),
    });
    setCompleteScopeSaving(false);
  }

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

  const [showAssignments, setShowAssignments] = useState(false);
  const assignedCount = localAssign.size;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <header className="sticky top-0 z-50 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-3"
        style={{ background: "var(--header-bg)", WebkitBackdropFilter: "blur(20px)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link href="/musteri/admin" className="font-black text-[16px] sm:text-[18px] gradient-text flex-shrink-0">markaizi</Link>
          <span className="hidden sm:inline text-[#555]">/</span>
          <Link href="/musteri/admin/calisanlar" className="hidden sm:inline text-[14px] text-[#8a8a9a] hover:text-white transition-colors">Çalışanlar</Link>
          <span className="hidden sm:inline text-[#555]">/</span>
          <span className="text-[13px] sm:text-[14px] font-semibold text-white truncate">{employee.name}</span>
        </div>
        <Link href="/musteri/admin/calisanlar" className="text-[12px] sm:text-[13px] text-[#8a8a9a] hover:text-white transition-colors flex-shrink-0">← Çalışanlara Dön</Link>
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
            <p className="text-[12px] text-[#8a8a9a] mt-0.5">Normalde sadece admin&apos;e özel işlemler — istediğini tek tek aç, hepsi varsayılan kapalı.</p>
          </div>
          <div className="space-y-3">
            {/* Tamamlandı'ya Kart Taşıma — 3 durumlu: Kapalı / Sadece Kendi / Herkes */}
            <div className="py-2">
              <p className="text-[13px] font-semibold text-white">Tamamlandı&apos;ya Kart Taşıma</p>
              <p className="text-[11px] text-[#8a8a9a] mt-0.5 mb-2.5">
                İş Akışı&apos;nda &quot;Tamamlandı&quot; sütununa kart taşıyabilir. Kart bir kez oraya taşındıktan sonra yine sadece admin dokunabilir.
              </p>
              <div className="flex gap-1.5 flex-wrap">
                {COMPLETE_SCOPE_OPTIONS.map((opt) => {
                  const active = completeScope === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleCompleteScopeChange(opt.value)}
                      disabled={completeScopeSaving}
                      className="text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-colors"
                      style={active
                        ? { background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.4)" }
                        : { background: "var(--surface-2, #141420)", color: "#8a8a9a", border: "1px solid var(--border)" }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

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

        {/* Ödemeler — Finans'tan girilir, burada yalnızca görünür (v3.6.0) */}
        <div className="rounded-2xl p-6 space-y-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="font-semibold text-white text-[14px]">Ödemeler</p>
              <p className="text-[12px] text-[#8a8a9a] mt-0.5">
                Maaş ve avanslar Finans&apos;tan girilir (kayıtta &quot;Çalışan&quot; seçilerek). Çalışan kendi panelinde aynı listeyi görür; buradan değiştirilemez.
              </p>
            </div>
            <Link href="/musteri/admin/finans" className="text-[13px] font-semibold px-4 py-2 rounded-xl flex-shrink-0"
              style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)", color: "#c084fc" }}>Finans&apos;a git</Link>
          </div>
          {employee.payments.length === 0 && <p className="text-[13px] text-[#8a8a9a] py-2">Kayıtlı ödeme yok.</p>}
          {employee.payments.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-3 py-2.5" style={{ borderTop: "1px solid var(--border)" }}>
              <div className="min-w-0">
                <p className="text-[13px] text-white">{p.title}</p>
                <p className="text-[11px] text-[#8a8a9a]">
                  {new Date(p.date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                  {p.status === "BEKLIYOR" ? " · Bekliyor" : ""}{p.source === "eski" ? " · eski kayıt" : ""}
                </p>
              </div>
              <p className="text-[14px] font-bold whitespace-nowrap" style={{ color: p.status === "ODENDI" ? "#34d399" : "#fbbf24" }}>
                {p.amount.toLocaleString("tr-TR")} ₺
              </p>
            </div>
          ))}
        </div>
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
