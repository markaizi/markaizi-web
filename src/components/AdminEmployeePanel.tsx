"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface EmployeeSummary {
  id: string;
  username: string;
  name: string;
  email: string;
  assignedCount: number;
  workflowAccess: boolean;
  unpricedLogCount: number;
}

interface MonthlySummaryRow { id: string; name: string; count: number; total: number; }

function prevMonth(y: number, m0: number): [number, number] {
  return m0 === 0 ? [y - 1, 11] : [y, m0 - 1];
}
function nextMonth(y: number, m0: number): [number, number] {
  return m0 === 11 ? [y + 1, 0] : [y, m0 + 1];
}

function MonthlyWorkLogReport() {
  const now = new Date();
  const [[y, m0], setYm] = useState<[number, number]>(prevMonth(now.getFullYear(), now.getMonth()));
  const [rows, setRows] = useState<MonthlySummaryRow[]>([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const monthKey = `${y}-${String(m0 + 1).padStart(2, "0")}`;
  const monthLabel = new Date(y, m0, 1).toLocaleDateString("tr-TR", { month: "long", year: "numeric" });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/musteri/admin/worklogs/summary?month=${monthKey}`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        setRows(json.rows ?? []);
        setGrandTotal(json.grandTotal ?? 0);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [monthKey]);

  return (
    <div className="rounded-2xl overflow-hidden mb-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <div className="px-5 py-4 flex items-center justify-between gap-3 flex-wrap" style={{ borderBottom: "1px solid var(--border)" }}>
        <div>
          <p className="font-semibold text-white text-[14px]">Aylık İş Kayıtları Raporu</p>
          <p className="text-[12px] text-[#8a8a9a] mt-0.5">Ay bittiğinde tüm çalışanların kayıtlarını toplu PDF olarak indir.</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => setYm(prevMonth(y, m0))} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5" style={{ border: "1px solid var(--border)" }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-[#8a8a9a]" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <span className="text-[13px] font-semibold text-white w-32 text-center">{monthLabel}</span>
          <button onClick={() => setYm(nextMonth(y, m0))} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5" style={{ border: "1px solid var(--border)" }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-[#8a8a9a]" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>

      <div className="px-5 py-4">
        {loading ? (
          <p className="text-[13px] text-[#555] text-center py-4">Yükleniyor...</p>
        ) : rows.length === 0 ? (
          <p className="text-[13px] text-[#8a8a9a] text-center py-4">{monthLabel} için kayıt yok.</p>
        ) : (
          <>
            <div className="space-y-2 mb-4">
              {rows.map((r) => (
                <div key={r.id} className="flex items-center justify-between text-[13px]">
                  <span className="text-white">{r.name} <span className="text-[#555]">· {r.count} kayıt</span></span>
                  <span className="font-semibold" style={{ color: "#34d399" }}>{r.total.toLocaleString("tr-TR")} ₺</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--border)" }}>
              <span className="text-[13px] font-bold text-white">Genel Toplam: {grandTotal.toLocaleString("tr-TR")} ₺</span>
              <a
                href={`/api/musteri/admin/worklogs/pdf?month=${monthKey}`}
                className="btn btn-primary text-sm px-4 py-2"
              >
                PDF İndir
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function AdminEmployeePanel({
  employees,
}: {
  employees: EmployeeSummary[];
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ username: "", name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState("");
  const filtered = query.trim()
    ? employees.filter((e) => {
        const q = query.trim().toLowerCase();
        return e.name.toLowerCase().includes(q) || e.username.toLowerCase().includes(q) || e.email.toLowerCase().includes(q);
      })
    : employees;

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
        <button onClick={handleLogout} className="text-[12px] text-[#8a8a9a] hover:text-[#f87171] transition-colors flex items-center gap-1.5 min-h-[44px] px-1">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
            <path d="M18.364 5.636A9 9 0 1 1 5.636 18.364" strokeLinecap="round"/>
            <path d="M12 3v9" strokeLinecap="round"/>
          </svg>
          Çıkış
        </button>
      </header>

      <main className="max-w-[720px] mx-auto px-6 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="font-black text-[24px] text-white mb-1">Çalışanlar</h1>
            <p className="text-[14px] text-[#8a8a9a]">{employees.length} çalışan · bir çalışana tıklayınca yetkilerini düzenle</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn btn-primary text-sm px-5 py-2.5 self-start sm:self-auto">+ Yeni Çalışan</button>
        </div>

        <MonthlyWorkLogReport />

        {employees.length > 5 && (
          <div className="relative mb-4">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Çalışan ara..."
              className="w-full pl-10 pr-4 py-3 rounded-xl text-[14px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-purple-500/50"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            />
          </div>
        )}

        {showForm && (
          <form onSubmit={handleCreate} className="rounded-2xl p-6 mb-6 space-y-4"
            style={{ background: "var(--surface)", border: "1px solid rgba(168,85,247,0.3)" }}>
            <p className="font-semibold text-white text-[15px]">Yeni Çalışan</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          {employees.length === 0 ? (
            <p className="text-[13px] text-[#8a8a9a] text-center py-12">Henüz çalışan yok.</p>
          ) : filtered.length === 0 ? (
            <p className="text-[13px] text-[#555] text-center py-12">&quot;{query}&quot; ile eşleşen çalışan yok.</p>
          ) : (
            filtered.map((emp, i) => (
              <div
                key={emp.id}
                onClick={() => router.push(`/musteri/admin/calisanlar/${emp.id}`)}
                className="group flex items-center gap-3 px-5 py-4 cursor-pointer transition-colors"
                style={{
                  background: "var(--surface)",
                  borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.025)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--surface)")}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-[13px] font-black"
                  style={{ background: "var(--grad-soft)", color: "#c084fc" }}>
                  {emp.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white font-semibold text-[14px] truncate">{emp.name}</p>
                  <p className="text-[12px] text-[#555] truncate">@{emp.username} · {emp.email}</p>
                </div>
                {!emp.workflowAccess && (
                  <span className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(138,138,154,0.12)", color: "#8a8a9a" }} title="İş Akışı erişimi kapalı">
                    İş Akışı Kapalı
                  </span>
                )}
                {emp.unpricedLogCount > 0 && (
                  <span className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(34,211,238,0.12)", color: "#22d3ee" }} title={`${emp.unpricedLogCount} fiyatlandırılmamış iş kaydı`}>
                    {emp.unpricedLogCount} yeni
                  </span>
                )}
                <span className="flex-shrink-0 text-[12px] px-2.5 py-1 rounded-full"
                  style={{ background: emp.assignedCount > 0 ? "rgba(168,85,247,0.12)" : "rgba(138,138,154,0.1)", color: emp.assignedCount > 0 ? "#c084fc" : "#555" }}>
                  {emp.assignedCount} firma
                </span>
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 flex-shrink-0 text-[#444] group-hover:text-[#c084fc] transition-colors" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
