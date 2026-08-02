"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Notes from "@/components/Notes";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ClientDetailData {
  id: string;
  slug: string;
  name: string;
  invoiceNote: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  billingAmount: string;
  billingPeriod: "HAFTALIK" | "AYLIK" | "";
  active: boolean;
  campaigns: {
    id: string;
    platform: "META" | "GOOGLE" | "TIKTOK";
    name: string;
    dailyBudget: string;
    status: "AKTIF" | "DURAKLATILDI" | "TAMAMLANDI" | "ODEME_HATASI";
    ongoing: boolean;
    startDate: string | null;
    endDate: string | null;
  }[];
  updates: {
    id: string;
    kind: "AJANS" | "WEBSITE";
    text: string;
    date: string;
  }[];
  invoices: {
    id: string;
    period: string;
    amount: string;
    status: "ODENDI" | "BEKLIYOR" | "GUNU_GELMEDI";
    dueDate: string | null;
  }[];
  contentItems: {
    id: string;
    title: string;
    description: string;
    scheduledDate: string;
    status: "PLANLANDI" | "DUZENLENIYOR" | "HAZIR" | "YAYINLANDI";
    publishedAt: string | null;
  }[];
  users: { id: string; username: string | null; name: string; email: string; canWriteNotes: boolean }[];
}

// ── Yardımcılar ───────────────────────────────────────────────────────────────

const PLATFORM_LABEL: Record<string, string> = { META: "Meta", GOOGLE: "Google", TIKTOK: "TikTok" };
const PLATFORM_COLOR: Record<string, string> = {
  META: "rgba(168,85,247,0.15)",
  GOOGLE: "rgba(59,130,246,0.15)",
  TIKTOK: "rgba(236,72,153,0.15)",
};
const PLATFORM_TEXT: Record<string, string> = {
  META: "#c084fc",
  GOOGLE: "#60a5fa",
  TIKTOK: "#f472b6",
};
const STATUS_LABEL: Record<string, string> = {
  AKTIF: "Aktif",
  DURAKLATILDI: "Duraklatıldı",
  TAMAMLANDI: "Tamamlandı",
  ODEME_HATASI: "Ödeme Hatası",
  ODENDI: "Ödendi",
  BEKLIYOR: "Bekliyor",
  GUNU_GELMEDI: "Günü Gelmedi",
};
const STATUS_COLOR: Record<string, string> = {
  AKTIF: "#34d399",
  DURAKLATILDI: "#fbbf24",
  TAMAMLANDI: "#8a8a9a",
  ODEME_HATASI: "#f87171",
  ODENDI: "#34d399",
  BEKLIYOR: "#fbbf24",
  GUNU_GELMEDI: "#8a8a9a",
  PLANLANDI: "#8a8a9a",
  DUZENLENIYOR: "#fbbf24",
  HAZIR: "#60a5fa",
  YAYINLANDI: "#34d399",
};

const CONTENT_STATUS_BG: Record<string, string> = {
  PLANLANDI: "rgba(138,138,154,0.12)",
  DUZENLENIYOR: "rgba(251,191,36,0.12)",
  HAZIR: "rgba(96,165,250,0.12)",
  YAYINLANDI: "rgba(52,211,153,0.12)",
};

function fmtAmount(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return raw;
  const num = parseInt(digits, 10);
  if (isNaN(num)) return raw;
  return num.toLocaleString("tr-TR") + " ₺";
}

function fmtBudget(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return raw;
  const num = parseInt(digits, 10);
  if (isNaN(num)) return raw;
  return num.toLocaleString("tr-TR") + " ₺/gün";
}

// ── Paylaşılan UI ─────────────────────────────────────────────────────────────

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full px-3 py-2 rounded-lg text-[14px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-purple-500/50"
      style={{ background: "var(--bg)", border: "1px solid var(--border)", ...props.style }}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full px-3 py-2 rounded-lg text-[14px] text-white outline-none focus:ring-1 focus:ring-purple-500/50"
      style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      rows={3}
      className="w-full px-3 py-2 rounded-lg text-[14px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-purple-500/50 resize-none"
      style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
    />
  );
}

function ErrMsg({ msg }: { msg: string }) {
  return msg ? <p className="text-[12px] text-red-400 mt-1">{msg}</p> : null;
}

function SaveBtn({ loading, label = "Kaydet" }: { loading: boolean; label?: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="btn btn-primary text-sm px-5 py-2"
    >
      {loading ? "..." : label}
    </button>
  );
}

function DeleteBtn({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={loading}
      className="text-[12px] text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded">
      {loading ? "..." : "Sil"}
    </button>
  );
}

function EditBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="text-[12px] text-[#8a8a9a] hover:text-purple-400 transition-colors px-2 py-1 rounded">
      Düzenle
    </button>
  );
}

// ── Ana bileşen ───────────────────────────────────────────────────────────────

export default function AdminClientDetail({ data, unreadNoteCount = 0 }: { data: ClientDetailData; unreadNoteCount?: number }) {
  const router = useRouter();
  const [tab, setTab] = useState<"genel" | "kampanyalar" | "icerikler" | "guncellemeler" | "faturalar" | "notlar" | "kullanici">("genel");

  async function handleLogout() {
    try { await fetch("/api/musteri/auth/logout", { method: "POST" }); } catch { /* ignore */ }
    window.location.href = "/musteri/giris";
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ background: "rgba(5,5,5,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <a href="/musteri/admin"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all flex-shrink-0"
            style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)", color: "#c084fc" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(168,85,247,0.2)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(168,85,247,0.1)"; }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M5 12l7 7M5 12l7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Admin Paneli
          </a>
          <span className="text-[#555] flex-shrink-0">/</span>
          <span className="text-[14px] font-semibold text-white truncate">{data.name}</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-[12px] text-[#8a8a9a] hover:text-[#f87171] transition-colors flex items-center gap-1.5 flex-shrink-0"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
            <path d="M18.364 5.636A9 9 0 1 1 5.636 18.364" strokeLinecap="round"/>
            <path d="M12 3v9" strokeLinecap="round"/>
          </svg>
          Çıkış
        </button>
      </header>

      <main className="max-w-[860px] mx-auto px-6 py-8">
        {/* Üst bilgi */}
        <div className="mb-6 flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-[20px]"
            style={{ background: "var(--grad-soft)", border: "1px solid rgba(168,85,247,0.25)", color: "#c084fc" }}
          >
            {data.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-black text-[22px] text-white">{data.name}</h1>
            <p className="text-[13px] text-[#8a8a9a]">/{data.slug}</p>
          </div>
        </div>

        {/* Sekmeler */}
        <div className="flex gap-1 mb-7 flex-wrap">
          {(["genel", "kampanyalar", "icerikler", "guncellemeler", "faturalar", "notlar", "kullanici"] as const).map((t) => {
            const labels: Record<typeof t, string> = {
              genel: "Genel",
              kampanyalar: "Kampanyalar",
              icerikler: "İçerikler",
              guncellemeler: "Güncellemeler",
              faturalar: "Faturalar",
              notlar: "Notlar",
              kullanici: "Kullanıcı",
            };
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-4 py-2 rounded-full text-[13px] font-medium transition-all flex items-center gap-1.5"
                style={{
                  background: tab === t ? "rgba(168,85,247,0.2)" : "var(--surface)",
                  border: `1px solid ${tab === t ? "rgba(168,85,247,0.4)" : "var(--border)"}`,
                  color: tab === t ? "#c084fc" : "#8a8a9a",
                }}
              >
                {labels[t]}
                {t === "notlar" && unreadNoteCount > 0 && tab !== "notlar" && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: "rgba(251,146,60,0.2)", color: "#fb923c" }}>
                    {unreadNoteCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* İçerik */}
        {tab === "genel" && <GenelTab data={data} router={router} />}
        {tab === "kampanyalar" && <KampanyalarTab slug={data.slug} campaigns={data.campaigns} router={router} />}
        {tab === "icerikler" && <IceriklerTab slug={data.slug} contentItems={data.contentItems} router={router} />}
        {tab === "guncellemeler" && <GuncellemelerTab slug={data.slug} updates={data.updates} router={router} />}
        {tab === "faturalar" && <FaturalarTab slug={data.slug} invoices={data.invoices} router={router} />}
        {tab === "notlar" && <Notes clientSlug={data.slug} canWrite isAjans isAdmin />}
        {tab === "kullanici" && <KullaniciTab slug={data.slug} users={data.users} router={router} />}
      </main>
    </div>
  );
}

// ── Genel sekmesi ─────────────────────────────────────────────────────────────

function GenelTab({ data, router }: { data: ClientDetailData; router: ReturnType<typeof useRouter> }) {
  const [form, setForm] = useState({
    name: data.name, invoiceNote: data.invoiceNote,
    contactPerson: data.contactPerson, contactEmail: data.contactEmail, contactPhone: data.contactPhone,
    billingAmount: data.billingAmount, billingPeriod: data.billingPeriod || "AYLIK",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setOk(false);
    const res = await fetch(`/api/musteri/admin/clients/${data.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    setLoading(false);
    if (json.ok) { setOk(true); router.refresh(); }
    else setErr(json.error ?? "Hata.");
  }

  async function handleDeactivate() {
    if (!confirm(`"${data.name}" firmayı deaktive et? Panel listesinden kaldırılır.`)) return;
    await fetch(`/api/musteri/admin/clients/${data.slug}`, { method: "DELETE" });
    router.push("/musteri/admin");
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="rounded-2xl p-6 space-y-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <Field label="Firma Adı">
          <Input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Yetkili Kişi (opsiyonel)">
            <Input value={form.contactPerson} onChange={(e) => setForm((f) => ({ ...f, contactPerson: e.target.value }))} placeholder="Örn: Ahmet Yılmaz" />
          </Field>
          <Field label="Telefon (opsiyonel)">
            <Input type="tel" value={form.contactPhone} onChange={(e) => setForm((f) => ({ ...f, contactPhone: e.target.value }))} placeholder="0532 000 00 00" />
          </Field>
        </div>
        <Field label="E-posta (opsiyonel)">
          <Input type="email" value={form.contactEmail} onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))} placeholder="firma@ornek.com" />
        </Field>

        <div className="pt-1 pb-1">
          <p className="text-[13px] font-semibold text-white">Ödeme Planı</p>
          <p className="text-[11px] text-[#8a8a9a] mt-0.5">
            Doluysa, bir fatura &quot;Ödendi&quot; yapıldığında sonraki dönemin faturası otomatik oluşur.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Ücret (opsiyonel)">
            <Input value={form.billingAmount}
              onChange={(e) => setForm((f) => ({ ...f, billingAmount: e.target.value }))}
              onBlur={(e) => setForm((f) => ({ ...f, billingAmount: fmtAmount(e.target.value) }))}
              placeholder="Örn: 20.000 ₺" />
          </Field>
          <Field label="Ödeme Periyodu">
            <Select value={form.billingPeriod} onChange={(e) => setForm((f) => ({ ...f, billingPeriod: e.target.value as "HAFTALIK" | "AYLIK" }))}>
              <option value="AYLIK">Aylık</option>
              <option value="HAFTALIK">Haftalık</option>
            </Select>
          </Field>
        </div>

        <Field label="Fatura Notu (opsiyonel)">
          <Textarea value={form.invoiceNote} onChange={(e) => setForm((f) => ({ ...f, invoiceNote: e.target.value }))} placeholder="Fatura ile ilgili ek bilgi..." />
        </Field>
        <ErrMsg msg={err} />
        {ok && <p className="text-[12px] text-green-400">Kaydedildi.</p>}
        <div className="flex justify-between items-center pt-1">
          <SaveBtn loading={loading} />
          <button type="button" onClick={handleDeactivate} className="text-[12px] text-red-400 hover:text-red-300 transition-colors">
            Firmayı Deaktive Et
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Kampanyalar sekmesi ───────────────────────────────────────────────────────

type Campaign = ClientDetailData["campaigns"][number];

function KampanyalarTab({ slug, campaigns, router }: { slug: string; campaigns: Campaign[]; router: ReturnType<typeof useRouter> }) {
  const emptyForm = { platform: "META" as Campaign["platform"], name: "", dailyBudget: "", status: "AKTIF" as Campaign["status"], ongoing: false, startDate: "", endDate: "" };
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editLoading, setEditLoading] = useState(false);
  const [editErr, setEditErr] = useState("");

  function startEdit(c: Campaign) {
    setEditingId(c.id);
    setEditForm({
      platform: c.platform,
      name: c.name,
      dailyBudget: c.dailyBudget,
      status: c.status,
      ongoing: c.ongoing,
      startDate: c.startDate ?? "",
      endDate: c.endDate ?? "",
    });
    setEditErr("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    setEditLoading(true);
    setEditErr("");
    const res = await fetch(`/api/musteri/admin/campaigns/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...editForm, startDate: editForm.startDate || null, endDate: editForm.endDate || null }),
    });
    const json = await res.json();
    setEditLoading(false);
    if (json.ok) { setEditingId(null); router.refresh(); }
    else setEditErr(json.error ?? "Hata.");
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const res = await fetch(`/api/musteri/admin/clients/${slug}/campaigns`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, startDate: form.startDate || null, endDate: form.endDate || null }),
    });
    const json = await res.json();
    setLoading(false);
    if (json.ok) { setShowForm(false); setForm(emptyForm); router.refresh(); }
    else setErr(json.error ?? "Hata.");
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu kampanyayı sil?")) return;
    setDeleting(id);
    await fetch(`/api/musteri/admin/campaigns/${id}`, { method: "DELETE" });
    setDeleting(null);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {campaigns.map((c) => editingId === c.id ? (
        <form key={c.id} onSubmit={handleSave} className="rounded-2xl p-5 space-y-4" style={{ background: "var(--surface)", border: "1px solid rgba(168,85,247,0.4)" }}>
          <p className="font-semibold text-white text-[14px]">Kampanyayı Düzenle</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Platform">
              <Select value={editForm.platform} onChange={(e) => setEditForm((x) => ({ ...x, platform: e.target.value as Campaign["platform"] }))}>
                <option value="META">Meta</option>
                <option value="GOOGLE">Google</option>
                <option value="TIKTOK">TikTok</option>
              </Select>
            </Field>
            <Field label="Durum">
              <Select value={editForm.status} onChange={(e) => setEditForm((x) => ({ ...x, status: e.target.value as Campaign["status"] }))}>
                <option value="AKTIF">Aktif</option>
                <option value="DURAKLATILDI">Duraklatıldı</option>
                <option value="TAMAMLANDI">Tamamlandı</option>
                <option value="ODEME_HATASI">Ödeme Hatası</option>
              </Select>
            </Field>
          </div>
          <Field label="Kampanya Adı">
            <Input required value={editForm.name} onChange={(e) => setEditForm((x) => ({ ...x, name: e.target.value }))} placeholder="Örn: Yaz Kampanyası 2026" />
          </Field>
          <Field label="Günlük Bütçe">
            <Input required value={editForm.dailyBudget}
              onChange={(e) => setEditForm((x) => ({ ...x, dailyBudget: e.target.value }))}
              onBlur={(e) => setEditForm((x) => ({ ...x, dailyBudget: fmtBudget(e.target.value) }))}
              placeholder="100" />
          </Field>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="edit-ongoing" checked={editForm.ongoing} onChange={(e) => setEditForm((x) => ({ ...x, ongoing: e.target.checked }))} className="accent-purple-500" />
            <label htmlFor="edit-ongoing" className="text-[13px] text-[#8a8a9a]">Devam ediyor (süresiz)</label>
          </div>
          {!editForm.ongoing && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Başlangıç"><Input type="date" value={editForm.startDate} onChange={(e) => setEditForm((x) => ({ ...x, startDate: e.target.value }))} /></Field>
              <Field label="Bitiş"><Input type="date" value={editForm.endDate} onChange={(e) => setEditForm((x) => ({ ...x, endDate: e.target.value }))} /></Field>
            </div>
          )}
          <ErrMsg msg={editErr} />
          <div className="flex gap-2">
            <SaveBtn loading={editLoading} label="Kaydet" />
            <button type="button" onClick={() => setEditingId(null)} className="btn btn-outline text-sm px-5 py-2">İptal</button>
          </div>
        </form>
      ) : (
        <div key={c.id} className="rounded-xl p-4 flex items-start gap-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 mt-0.5" style={{ background: PLATFORM_COLOR[c.platform], color: PLATFORM_TEXT[c.platform] }}>
            {PLATFORM_LABEL[c.platform]}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[14px] font-semibold truncate">{c.name}</p>
            <p className="text-[12px] text-[#8a8a9a] mt-0.5">{fmtBudget(c.dailyBudget)} · {c.ongoing ? "Devam ediyor" : `${c.startDate ?? "?"} → ${c.endDate ?? "?"}`}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[12px] font-medium px-2 py-1 rounded-full" style={{ color: STATUS_COLOR[c.status], background: `${STATUS_COLOR[c.status]}18` }}>{STATUS_LABEL[c.status]}</span>
            <EditBtn onClick={() => startEdit(c)} />
            <DeleteBtn onClick={() => handleDelete(c.id)} loading={deleting === c.id} />
          </div>
        </div>
      ))}

      {campaigns.length === 0 && (
        <p className="text-[13px] text-[#8a8a9a] text-center py-8">Henüz kampanya yok.</p>
      )}

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="btn btn-outline text-sm w-full py-3 mt-2">+ Kampanya Ekle</button>
      ) : (
        <form onSubmit={handleAdd} className="rounded-2xl p-5 space-y-4 mt-2" style={{ background: "var(--surface)", border: "1px solid rgba(168,85,247,0.3)" }}>
          <p className="font-semibold text-white text-[14px]">Yeni Kampanya</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Platform">
              <Select value={form.platform} onChange={(e) => setForm((x) => ({ ...x, platform: e.target.value as Campaign["platform"] }))}>
                <option value="META">Meta</option>
                <option value="GOOGLE">Google</option>
                <option value="TIKTOK">TikTok</option>
              </Select>
            </Field>
            <Field label="Durum">
              <Select value={form.status} onChange={(e) => setForm((x) => ({ ...x, status: e.target.value as Campaign["status"] }))}>
                <option value="AKTIF">Aktif</option>
                <option value="DURAKLATILDI">Duraklatıldı</option>
                <option value="TAMAMLANDI">Tamamlandı</option>
                <option value="ODEME_HATASI">Ödeme Hatası</option>
              </Select>
            </Field>
          </div>
          <Field label="Kampanya Adı">
            <Input required value={form.name} onChange={(e) => setForm((x) => ({ ...x, name: e.target.value }))} placeholder="Örn: Yaz Kampanyası 2026" />
          </Field>
          <Field label="Günlük Bütçe">
            <Input required value={form.dailyBudget}
              onChange={(e) => setForm((x) => ({ ...x, dailyBudget: e.target.value }))}
              onBlur={(e) => setForm((x) => ({ ...x, dailyBudget: fmtBudget(e.target.value) }))}
              placeholder="100" />
          </Field>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="add-ongoing" checked={form.ongoing} onChange={(e) => setForm((x) => ({ ...x, ongoing: e.target.checked }))} className="accent-purple-500" />
            <label htmlFor="add-ongoing" className="text-[13px] text-[#8a8a9a]">Devam ediyor (süresiz)</label>
          </div>
          {!form.ongoing && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Başlangıç"><Input type="date" value={form.startDate} onChange={(e) => setForm((x) => ({ ...x, startDate: e.target.value }))} /></Field>
              <Field label="Bitiş"><Input type="date" value={form.endDate} onChange={(e) => setForm((x) => ({ ...x, endDate: e.target.value }))} /></Field>
            </div>
          )}
          <ErrMsg msg={err} />
          <div className="flex gap-2">
            <SaveBtn loading={loading} label="Ekle" />
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline text-sm px-5 py-2">İptal</button>
          </div>
        </form>
      )}
    </div>
  );
}

// ── Güncellemeler sekmesi ─────────────────────────────────────────────────────

type Update = ClientDetailData["updates"][number];

function GuncellemelerTab({ slug, updates, router }: { slug: string; updates: Update[]; router: ReturnType<typeof useRouter> }) {
  const emptyForm = { kind: "AJANS" as Update["kind"], text: "", date: new Date().toISOString().split("T")[0] };
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editLoading, setEditLoading] = useState(false);
  const [editErr, setEditErr] = useState("");

  function startEdit(u: Update) {
    setEditingId(u.id);
    setEditForm({ kind: u.kind, text: u.text, date: u.date });
    setEditErr("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    setEditLoading(true);
    setEditErr("");
    const res = await fetch(`/api/musteri/admin/updates/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    const json = await res.json();
    setEditLoading(false);
    if (json.ok) { setEditingId(null); router.refresh(); }
    else setEditErr(json.error ?? "Hata.");
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const res = await fetch(`/api/musteri/admin/clients/${slug}/updates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    setLoading(false);
    if (json.ok) { setShowForm(false); setForm(emptyForm); router.refresh(); }
    else setErr(json.error ?? "Hata.");
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu güncellemeyi sil?")) return;
    setDeleting(id);
    await fetch(`/api/musteri/admin/updates/${id}`, { method: "DELETE" });
    setDeleting(null);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {updates.map((u) => editingId === u.id ? (
        <form key={u.id} onSubmit={handleSave} className="rounded-2xl p-5 space-y-4" style={{ background: "var(--surface)", border: "1px solid rgba(168,85,247,0.4)" }}>
          <p className="font-semibold text-white text-[14px]">Güncellemeyi Düzenle</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Tür">
              <Select value={editForm.kind} onChange={(e) => setEditForm((x) => ({ ...x, kind: e.target.value as Update["kind"] }))}>
                <option value="AJANS">Ajans</option>
                <option value="WEBSITE">Web Site</option>
              </Select>
            </Field>
            <Field label="Tarih">
              <Input type="date" value={editForm.date} onChange={(e) => setEditForm((x) => ({ ...x, date: e.target.value }))} />
            </Field>
          </div>
          <Field label="Güncelleme Metni">
            <Textarea required value={editForm.text} onChange={(e) => setEditForm((x) => ({ ...x, text: e.target.value }))} placeholder="Yapılan çalışmayı açıklayın..." />
          </Field>
          <ErrMsg msg={editErr} />
          <div className="flex gap-2">
            <SaveBtn loading={editLoading} label="Kaydet" />
            <button type="button" onClick={() => setEditingId(null)} className="btn btn-outline text-sm px-5 py-2">İptal</button>
          </div>
        </form>
      ) : (
        <div key={u.id} className="rounded-xl p-4 flex items-start gap-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 mt-0.5"
            style={{ background: u.kind === "AJANS" ? "rgba(168,85,247,0.15)" : "rgba(59,130,246,0.15)", color: u.kind === "AJANS" ? "#c084fc" : "#60a5fa" }}>
            {u.kind === "AJANS" ? "Ajans" : "Web Site"}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[13px] leading-relaxed whitespace-pre-wrap">{u.text}</p>
            <p className="text-[11px] text-[#555] mt-1">{u.date}</p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <EditBtn onClick={() => startEdit(u)} />
            <DeleteBtn onClick={() => handleDelete(u.id)} loading={deleting === u.id} />
          </div>
        </div>
      ))}

      {updates.length === 0 && (
        <p className="text-[13px] text-[#8a8a9a] text-center py-8">Henüz güncelleme yok.</p>
      )}

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="btn btn-outline text-sm w-full py-3 mt-2">+ Güncelleme Ekle</button>
      ) : (
        <form onSubmit={handleAdd} className="rounded-2xl p-5 space-y-4 mt-2" style={{ background: "var(--surface)", border: "1px solid rgba(168,85,247,0.3)" }}>
          <p className="font-semibold text-white text-[14px]">Yeni Güncelleme</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Tür">
              <Select value={form.kind} onChange={(e) => setForm((x) => ({ ...x, kind: e.target.value as Update["kind"] }))}>
                <option value="AJANS">Ajans</option>
                <option value="WEBSITE">Web Site</option>
              </Select>
            </Field>
            <Field label="Tarih">
              <Input type="date" value={form.date} onChange={(e) => setForm((x) => ({ ...x, date: e.target.value }))} />
            </Field>
          </div>
          <Field label="Güncelleme Metni">
            <Textarea required value={form.text} onChange={(e) => setForm((x) => ({ ...x, text: e.target.value }))} placeholder="Yapılan çalışmayı açıklayın..." />
          </Field>
          <ErrMsg msg={err} />
          <div className="flex gap-2">
            <SaveBtn loading={loading} label="Ekle" />
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline text-sm px-5 py-2">İptal</button>
          </div>
        </form>
      )}
    </div>
  );
}

// ── Faturalar sekmesi ─────────────────────────────────────────────────────────

type Invoice = ClientDetailData["invoices"][number];

function FaturalarTab({ slug, invoices, router }: { slug: string; invoices: Invoice[]; router: ReturnType<typeof useRouter> }) {
  const emptyForm = { period: "", amount: "", status: "BEKLIYOR" as Invoice["status"], dueDate: "" };
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editLoading, setEditLoading] = useState(false);
  const [editErr, setEditErr] = useState("");

  function startEdit(inv: Invoice) {
    setEditingId(inv.id);
    setEditForm({ period: inv.period, amount: inv.amount, status: inv.status, dueDate: inv.dueDate ?? "" });
    setEditErr("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    setEditLoading(true);
    setEditErr("");
    const res = await fetch(`/api/musteri/admin/invoices/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...editForm, dueDate: editForm.dueDate || null }),
    });
    const json = await res.json();
    setEditLoading(false);
    if (json.ok) { setEditingId(null); router.refresh(); }
    else setEditErr(json.error ?? "Hata.");
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const res = await fetch(`/api/musteri/admin/clients/${slug}/invoices`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, dueDate: form.dueDate || null }),
    });
    const json = await res.json();
    setLoading(false);
    if (json.ok) { setShowForm(false); setForm(emptyForm); router.refresh(); }
    else setErr(json.error ?? "Hata.");
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu faturayı sil?")) return;
    setDeleting(id);
    await fetch(`/api/musteri/admin/invoices/${id}`, { method: "DELETE" });
    setDeleting(null);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {invoices.map((inv) => editingId === inv.id ? (
        <form key={inv.id} onSubmit={handleSave} className="rounded-2xl p-5 space-y-4" style={{ background: "var(--surface)", border: "1px solid rgba(168,85,247,0.4)" }}>
          <p className="font-semibold text-white text-[14px]">Faturayı Düzenle</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Dönem">
              <Input required value={editForm.period} onChange={(e) => setEditForm((x) => ({ ...x, period: e.target.value }))} placeholder="Haziran 2026" />
            </Field>
            <Field label="Tutar">
              <Input required value={editForm.amount}
                onChange={(e) => setEditForm((x) => ({ ...x, amount: e.target.value }))}
                onBlur={(e) => setEditForm((x) => ({ ...x, amount: fmtAmount(e.target.value) }))}
                placeholder="15.000 ₺" />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Durum">
              <Select value={editForm.status} onChange={(e) => setEditForm((x) => ({ ...x, status: e.target.value as Invoice["status"] }))}>
                <option value="BEKLIYOR">Bekliyor</option>
                <option value="ODENDI">Ödendi</option>
                <option value="GUNU_GELMEDI">Günü Gelmedi</option>
              </Select>
            </Field>
            <Field label="Vade Tarihi (opsiyonel)">
              <Input type="date" value={editForm.dueDate} onChange={(e) => setEditForm((x) => ({ ...x, dueDate: e.target.value }))} />
            </Field>
          </div>
          <ErrMsg msg={editErr} />
          <div className="flex gap-2">
            <SaveBtn loading={editLoading} label="Kaydet" />
            <button type="button" onClick={() => setEditingId(null)} className="btn btn-outline text-sm px-5 py-2">İptal</button>
          </div>
        </form>
      ) : (
        <div key={inv.id} className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-white text-[14px] font-semibold leading-snug">{inv.period}</p>
              <p className="text-[13px] text-[#8a8a9a] mt-0.5">{fmtAmount(inv.amount)}{inv.dueDate ? ` · Vade: ${inv.dueDate}` : ""}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[12px] font-medium px-2 py-1 rounded-full" style={{ color: STATUS_COLOR[inv.status], background: `${STATUS_COLOR[inv.status]}18` }}>{STATUS_LABEL[inv.status]}</span>
              <EditBtn onClick={() => startEdit(inv)} />
              <DeleteBtn onClick={() => handleDelete(inv.id)} loading={deleting === inv.id} />
            </div>
          </div>
        </div>
      ))}

      {invoices.length === 0 && (
        <p className="text-[13px] text-[#8a8a9a] text-center py-8">Henüz fatura yok.</p>
      )}

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="btn btn-outline text-sm w-full py-3 mt-2">+ Fatura Ekle</button>
      ) : (
        <form onSubmit={handleAdd} className="rounded-2xl p-5 space-y-4 mt-2" style={{ background: "var(--surface)", border: "1px solid rgba(168,85,247,0.3)" }}>
          <p className="font-semibold text-white text-[14px]">Yeni Fatura</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Dönem">
              <Input required value={form.period} onChange={(e) => setForm((x) => ({ ...x, period: e.target.value }))} placeholder="Haziran 2026" />
            </Field>
            <Field label="Tutar">
              <Input required value={form.amount}
                onChange={(e) => setForm((x) => ({ ...x, amount: e.target.value }))}
                onBlur={(e) => setForm((x) => ({ ...x, amount: fmtAmount(e.target.value) }))}
                placeholder="15.000 ₺" />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Durum">
              <Select value={form.status} onChange={(e) => setForm((x) => ({ ...x, status: e.target.value as Invoice["status"] }))}>
                <option value="BEKLIYOR">Bekliyor</option>
                <option value="ODENDI">Ödendi</option>
                <option value="GUNU_GELMEDI">Günü Gelmedi</option>
              </Select>
            </Field>
            <Field label="Vade Tarihi (opsiyonel)">
              <Input type="date" value={form.dueDate} onChange={(e) => setForm((x) => ({ ...x, dueDate: e.target.value }))} />
            </Field>
          </div>
          <ErrMsg msg={err} />
          <div className="flex gap-2">
            <SaveBtn loading={loading} label="Ekle" />
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline text-sm px-5 py-2">İptal</button>
          </div>
        </form>
      )}
    </div>
  );
}

// ── İçerikler sekmesi ────────────────────────────────────────────────────────

type ContentItem = ClientDetailData["contentItems"][number];

const CONTENT_STATUS_LABEL: Record<ContentItem["status"], string> = {
  PLANLANDI: "Planlandı",
  DUZENLENIYOR: "Düzenleniyor",
  HAZIR: "Hazır",
  YAYINLANDI: "Yayınlandı",
};

function IceriklerTab({
  slug,
  contentItems,
  router,
}: {
  slug: string;
  contentItems: ContentItem[];
  router: ReturnType<typeof useRouter>;
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    scheduledDate: "",
    status: "PLANLANDI" as ContentItem["status"],
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const res = await fetch(`/api/musteri/admin/clients/${slug}/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, description: form.description || undefined }),
    });
    const json = await res.json();
    setLoading(false);
    if (json.ok) {
      setShowForm(false);
      setForm({ title: "", description: "", scheduledDate: "", status: "PLANLANDI" });
      router.refresh();
    } else setErr(json.error ?? "Hata.");
  }

  async function handleStatusChange(id: string, status: ContentItem["status"]) {
    const data: Record<string, string | null> = { status };
    if (status === "YAYINLANDI") data.publishedAt = new Date().toISOString();
    await fetch(`/api/musteri/admin/content/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu içeriği sil?")) return;
    setDeleting(id);
    await fetch(`/api/musteri/admin/content/${id}`, { method: "DELETE" });
    setDeleting(null);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {contentItems.map((ci) => (
        <div key={ci.id} className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-white text-[14px] font-semibold leading-snug">{ci.title}</p>
              {ci.description && (
                <p className="text-[12px] text-[#8a8a9a] mt-0.5 leading-relaxed">{ci.description}</p>
              )}
              <p className="text-[11px] text-[#555] mt-1">
                {ci.scheduledDate}
                {ci.publishedAt ? ` · Yayınlandı: ${ci.publishedAt}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                style={{
                  background: CONTENT_STATUS_BG[ci.status],
                  color: STATUS_COLOR[ci.status],
                }}
              >
                {CONTENT_STATUS_LABEL[ci.status]}
              </span>
              <Select
                value={ci.status}
                onChange={(e) => handleStatusChange(ci.id, e.target.value as ContentItem["status"])}
                style={{ width: "auto", fontSize: "11px", padding: "3px 6px", color: STATUS_COLOR[ci.status] }}
              >
                <option value="PLANLANDI">Planlandı</option>
                <option value="DUZENLENIYOR">Düzenleniyor</option>
                <option value="HAZIR">Hazır</option>
                <option value="YAYINLANDI">Yayınlandı</option>
              </Select>
              <DeleteBtn onClick={() => handleDelete(ci.id)} loading={deleting === ci.id} />
            </div>
          </div>
        </div>
      ))}

      {contentItems.length === 0 && (
        <p className="text-[13px] text-[#8a8a9a] text-center py-8">Henüz içerik yok.</p>
      )}

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="btn btn-outline text-sm w-full py-3 mt-2">
          + İçerik Ekle
        </button>
      ) : (
        <form onSubmit={handleAdd} className="rounded-2xl p-5 space-y-4 mt-2" style={{ background: "var(--surface)", border: "1px solid rgba(168,85,247,0.3)" }}>
          <p className="font-semibold text-white text-[14px]">Yeni İçerik</p>
          <Field label="Başlık">
            <Input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Örn: Mayıs Tanıtım Videosu" />
          </Field>
          <Field label="Açıklama (opsiyonel)">
            <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="İçerik detayları, notlar..." />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Yayın Tarihi">
              <Input type="date" required value={form.scheduledDate} onChange={(e) => setForm((f) => ({ ...f, scheduledDate: e.target.value }))} />
            </Field>
            <Field label="Durum">
              <Select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as ContentItem["status"] }))}>
                <option value="PLANLANDI">Planlandı</option>
                <option value="DUZENLENIYOR">Düzenleniyor</option>
                <option value="HAZIR">Hazır</option>
                <option value="YAYINLANDI">Yayınlandı</option>
              </Select>
            </Field>
          </div>
          <ErrMsg msg={err} />
          <div className="flex gap-2">
            <SaveBtn loading={loading} label="Ekle" />
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline text-sm px-5 py-2">İptal</button>
          </div>
        </form>
      )}
    </div>
  );
}

// ── Kullanıcı sekmesi ─────────────────────────────────────────────────────────

function KullaniciTab({
  slug,
  users,
  router,
}: {
  slug: string;
  users: ClientDetailData["users"];
  router: ReturnType<typeof useRouter>;
}) {
  const existing = users[0] ?? null;
  const [form, setForm] = useState({
    username: existing?.username ?? slug,
    name: existing?.name ?? "",
    email: existing?.email ?? "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [canWriteNotes, setCanWriteNotes] = useState(existing?.canWriteNotes ?? false);
  const [notesLoading, setNotesLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setOk("");
    const res = await fetch(`/api/musteri/admin/clients/${slug}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    setLoading(false);
    if (json.ok) {
      setOk(json.created ? "Kullanıcı oluşturuldu." : "Bilgiler güncellendi.");
      router.refresh();
    } else setErr(json.error ?? "Hata.");
  }

  async function handleNotesToggle(val: boolean) {
    if (!existing) return;
    setNotesLoading(true);
    setCanWriteNotes(val);
    await fetch(`/api/musteri/admin/clients/${slug}/users`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ canWriteNotes: val }),
    });
    setNotesLoading(false);
  }

  return (
    <div className="space-y-5">
      {existing && (
        <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-[14px]" style={{ background: "var(--grad-soft)", color: "#c084fc" }}>
            {existing.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-white text-[14px] font-semibold">{existing.name}</p>
            <p className="text-[12px] text-[#8a8a9a]">@{existing.username} · {existing.email}</p>
          </div>
        </div>
      )}

      {/* canWriteNotes toggle — yalnızca mevcut kullanıcı varsa */}
      {existing && (
        <div className="rounded-xl p-4 flex items-center justify-between gap-4"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div>
            <p className="text-white text-[14px] font-semibold">Not Yazma Yetkisi</p>
            <p className="text-[12px] text-[#8a8a9a] mt-0.5">
              Açıksa müşteri kendi firma sayfasına not bırakabilir (PAYLASIMLI).
            </p>
          </div>
          <button
            onClick={() => handleNotesToggle(!canWriteNotes)}
            disabled={notesLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all flex-shrink-0"
            style={{
              background: canWriteNotes ? "rgba(52,211,153,0.15)" : "rgba(138,138,154,0.1)",
              border: `1px solid ${canWriteNotes ? "rgba(52,211,153,0.3)" : "var(--border)"}`,
              color: canWriteNotes ? "#34d399" : "#8a8a9a",
            }}
          >
            {notesLoading ? "..." : canWriteNotes ? "✓ Açık" : "Kapalı"}
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl p-5 space-y-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <p className="font-semibold text-white text-[14px]">{existing ? "Bilgileri Güncelle / Şifre Sıfırla" : "Müşteri Girişi Oluştur"}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Kullanıcı Adı">
            <Input required value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} placeholder={slug} />
          </Field>
          <Field label="Ad Soyad">
            <Input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Ali Yılmaz" />
          </Field>
        </div>
        <Field label="E-posta">
          <Input type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="ali@firma.com" />
        </Field>
        <Field label={existing ? "Yeni Şifre" : "Şifre"}>
          <Input type="password" required={!existing} value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder={existing ? "Boş bırakırsan değişmez" : "Min. 6 karakter"} />
        </Field>
        <ErrMsg msg={err} />
        {ok && <p className="text-[12px] text-green-400">{ok}</p>}
        <SaveBtn loading={loading} label={existing ? "Güncelle" : "Oluştur"} />
      </form>
    </div>
  );
}
