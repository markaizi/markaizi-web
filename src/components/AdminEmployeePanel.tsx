"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface EmployeeData {
  id: string;
  username: string;
  name: string;
  email: string;
  canWriteNotes: boolean;
  assignments: {
    id: string;
    client: { id: string; slug: string; name: string };
    canViewCampaigns: boolean;
    canManageCampaigns: boolean;
    canViewContent: boolean;
    canManageContent: boolean;
    canViewUpdates: boolean;
    canManageUpdates: boolean;
    canViewInvoices: boolean;
    canManageInvoices: boolean;
  }[];
}

const SECTIONS = [
  { label: "Kampanyalar", viewKey: "canViewCampaigns" as const, manageKey: "canManageCampaigns" as const },
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
  canViewCampaigns: boolean;
  canManageCampaigns: boolean;
  canViewContent: boolean;
  canManageContent: boolean;
  canViewUpdates: boolean;
  canManageUpdates: boolean;
  canViewInvoices: boolean;
  canManageInvoices: boolean;
};

const DEFAULT_PERMS: Omit<LocalAssign, "id"> = {
  canViewCampaigns: true, canManageCampaigns: false,
  canViewContent: true,   canManageContent: true,
  canViewUpdates: true,   canManageUpdates: true,
  canViewInvoices: false, canManageInvoices: false,
};

export default function AdminEmployeePanel({
  employees,
  allClients,
}: {
  employees: EmployeeData[];
  allClients: { id: string; slug: string; name: string }[];
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ username: "", name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleLogout() {
    try { await fetch("/api/musteri/auth/logout", { method: "POST" }); } catch { /* ignore */ }
    window.location.href = "/musteri/giris";
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr("");
    const res = await fetch("/api/musteri/admin/employees", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    });
    const json = await res.json(); setLoading(false);
    if (json.ok) { setShowForm(false); setForm({ username: "", name: "", email: "", password: "" }); router.refresh(); }
    else setErr(json.error ?? "Hata.");
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ background: "rgba(5,5,5,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2">
          <a href="/musteri/admin"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all"
            style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)", color: "#c084fc" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(168,85,247,0.2)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(168,85,247,0.1)"; }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M5 12l7 7M5 12l7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Admin Paneli
          </a>
          <span className="text-[#555]">/</span>
          <span className="text-[14px] font-semibold text-white">Çalışanlar</span>
        </div>
        <button onClick={handleLogout} className="text-[12px] text-[#8a8a9a] hover:text-[#f87171] transition-colors flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
            <path d="M18.364 5.636A9 9 0 1 1 5.636 18.364" strokeLinecap="round"/>
            <path d="M12 3v9" strokeLinecap="round"/>
          </svg>
          Çıkış
        </button>
      </header>

      <main className="max-w-[860px] mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-black text-[24px] text-white mb-1">Çalışanlar</h1>
            <p className="text-[14px] text-[#8a8a9a]">{employees.length} çalışan</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn btn-primary text-sm px-5 py-2.5">+ Yeni Çalışan</button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="rounded-2xl p-6 mb-8 space-y-4"
            style={{ background: "var(--surface)", border: "1px solid rgba(168,85,247,0.3)" }}>
            <p className="font-semibold text-white text-[15px]">Yeni Çalışan</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: "username", label: "Kullanıcı Adı", placeholder: "ali.yilmaz", type: "text" },
                { key: "name",     label: "Ad Soyad",       placeholder: "Ali Yılmaz",  type: "text" },
                { key: "email",    label: "E-posta",         placeholder: "ali@markaizi.com", type: "email" },
                { key: "password", label: "Şifre",           placeholder: "Min. 6 karakter",  type: "password" },
              ].map(({ key, label, placeholder, type }) => (
                <div key={key}>
                  <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">{label}</label>
                  <input required type={type} value={form[key as keyof typeof form]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full px-3 py-2.5 rounded-lg text-[14px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-purple-500/50"
                    style={{ background: "var(--bg)", border: "1px solid var(--border)" }} />
                </div>
              ))}
            </div>
            {err && <p className="text-[12px] text-red-400">{err}</p>}
            <div className="flex gap-2">
              <button type="submit" disabled={loading} className="btn btn-primary text-sm px-5 py-2">{loading ? "..." : "Oluştur"}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline text-sm px-5 py-2">İptal</button>
            </div>
          </form>
        )}

        <div className="space-y-6">
          {employees.length === 0 && !showForm && (
            <p className="text-[13px] text-[#8a8a9a] text-center py-12">Henüz çalışan yok.</p>
          )}
          {employees.map((emp) => (
            <EmployeeCard key={emp.id} employee={emp} allClients={allClients} router={router} />
          ))}
        </div>
      </main>
    </div>
  );
}

// ── Çalışan Kartı ─────────────────────────────────────────────────────────────

function EmployeeCard({
  employee,
  allClients,
  router,
}: {
  employee: EmployeeData;
  allClients: { id: string; slug: string; name: string }[];
  router: ReturnType<typeof useRouter>;
}) {
  const [canWriteNotes, setCanWriteNotes] = useState(employee.canWriteNotes);
  const [notesLoading, setNotesLoading] = useState(false);

  async function handleNotesToggle(val: boolean) {
    setNotesLoading(true);
    setCanWriteNotes(val);
    await fetch(`/api/musteri/admin/employees/${employee.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ canWriteNotes: val }),
    });
    setNotesLoading(false);
  }

  const [localAssign, setLocalAssign] = useState<Map<string, LocalAssign>>(
    () => {
      const m = new Map<string, LocalAssign>();
      employee.assignments.forEach((a) => {
        m.set(a.client.id, {
          id: a.id,
          canViewCampaigns: a.canViewCampaigns,
          canManageCampaigns: a.canManageCampaigns,
          canViewContent: a.canViewContent,
          canManageContent: a.canManageContent,
          canViewUpdates: a.canViewUpdates,
          canManageUpdates: a.canManageUpdates,
          canViewInvoices: a.canViewInvoices,
          canManageInvoices: a.canManageInvoices,
        });
      });
      return m;
    }
  );

  async function handleToggleClient(client: { id: string; slug: string; name: string }) {
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

  async function handleSectionChange(
    clientId: string,
    section: typeof SECTIONS[number],
    state: SectionState
  ) {
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
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
    }
  }

  const assignedCount = localAssign.size;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-[16px] flex-shrink-0"
          style={{ background: "var(--grad-soft)", color: "#c084fc" }}>
          {employee.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-[15px]">{employee.name}</p>
          <p className="text-[12px] text-[#8a8a9a]">@{employee.username} · {employee.email}</p>
        </div>
        <span className="text-[12px] px-2.5 py-1 rounded-full flex-shrink-0"
          style={{ background: assignedCount > 0 ? "rgba(168,85,247,0.12)" : "rgba(138,138,154,0.1)", color: assignedCount > 0 ? "#c084fc" : "#555" }}>
          {assignedCount} firma
        </span>
        <button
          onClick={() => handleNotesToggle(!canWriteNotes)}
          disabled={notesLoading}
          title="Not yazma yetkisi"
          className="text-[11px] px-2.5 py-1 rounded-full transition-all flex-shrink-0"
          style={{
            background: canWriteNotes ? "rgba(52,211,153,0.12)" : "rgba(138,138,154,0.1)",
            border: `1px solid ${canWriteNotes ? "rgba(52,211,153,0.3)" : "var(--border)"}`,
            color: canWriteNotes ? "#34d399" : "#555",
          }}
        >
          {notesLoading ? "..." : canWriteNotes ? "🗒 Not: Açık" : "🗒 Not: Kapalı"}
        </button>
      </div>

      <div className="divide-y" style={{ borderColor: "var(--border)" }}>
        {allClients.map((client) => {
          const assigned = localAssign.get(client.id);
          return (
            <div key={client.id}>
              <label className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-white/[0.02] transition-colors select-none">
                <input
                  type="checkbox"
                  checked={!!assigned}
                  onChange={() => handleToggleClient(client)}
                  className="w-4 h-4 rounded accent-purple-500 cursor-pointer flex-shrink-0"
                />
                <span className="text-[14px] text-white font-medium flex-1">{client.name}</span>
                {assigned && <span className="text-[11px] text-[#c084fc]">atandı</span>}
              </label>

              {assigned && (
                <div className="px-5 pb-4 grid grid-cols-2 gap-x-6 gap-y-3" style={{ paddingLeft: "2.75rem" }}>
                  {SECTIONS.map((sec) => {
                    const state = getState(assigned[sec.viewKey], assigned[sec.manageKey]);
                    return (
                      <div key={sec.label}>
                        <p className="text-[10px] font-semibold text-[#555] uppercase tracking-wide mb-1.5">{sec.label}</p>
                        <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                          {(["yok", "goruntule", "duzenle"] as SectionState[]).map((s) => (
                            <button
                              key={s}
                              onClick={() => handleSectionChange(client.id, sec, s)}
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
      </div>
    </div>
  );
}
