"use client";

import { useState } from "react";
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

      <main className="max-w-[720px] mx-auto px-6 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="font-black text-[24px] text-white mb-1">Çalışanlar</h1>
            <p className="text-[14px] text-[#8a8a9a]">{employees.length} çalışan · bir çalışana tıklayınca yetkilerini düzenle</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn btn-primary text-sm px-5 py-2.5 self-start sm:self-auto">+ Yeni Çalışan</button>
        </div>

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
          ) : (
            employees.map((emp, i) => (
              <div
                key={emp.id}
                onClick={() => router.push(`/musteri/admin/calisanlar/${emp.id}`)}
                className="group flex items-center gap-3 px-5 py-4 cursor-pointer transition-colors"
                style={{
                  background: "var(--surface)",
                  borderBottom: i < employees.length - 1 ? "1px solid var(--border)" : "none",
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
