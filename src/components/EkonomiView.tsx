"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface EkonomiFeedItem {
  id: string;
  type: "GELIR" | "GIDER";
  amount: number;
  description: string;
  date: string;
  category: string | null;
  deletable: boolean;
}

export interface RecurringExpenseItem {
  id: string;
  title: string;
  category: string;
  amount: string;
  dayOfMonth: number;
  active: boolean;
}

export interface EkonomiData {
  currentMonthLabel: string;
  currentMonth: { gelir: number; gider: number; net: number };
  allTime: { gelir: number; gider: number; net: number };
  bekleyenFaturaToplam: number;
  gecikmisFaturaToplam: number;
  faturaOzet: {
    gunuGelmedi: { adet: number; toplam: number };
    bekliyor: { adet: number; toplam: number };
    gecikmede: { adet: number; toplam: number };
  };
  monthlyHistory: { key: string; label: string; gelir: number; gider: number; net: number }[];
  feed: EkonomiFeedItem[];
  recurringExpenses: RecurringExpenseItem[];
}

const GIDER_KATEGORILERI = ["Kira/Ofis", "Personel/Maaş", "Reklam Bütçesi", "Yazılım/Abonelik", "Vergi/SGK", "Diğer"];

function csvEscape(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function downloadCsv(filename: string, feed: EkonomiFeedItem[]) {
  const header = ["Tarih", "Tür", "Açıklama", "Kategori", "Tutar"];
  const rows = feed.map((f) => [fmtDate(f.date), f.type === "GELIR" ? "Gelir" : "Gider", f.description, f.category ?? "", String(f.amount)]);
  const csv = "﻿" + [header, ...rows].map((r) => r.map(csvEscape).join(";")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function fmtTL(n: number): string {
  return n.toLocaleString("tr-TR") + " ₺";
}

function fmtAmount(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return raw;
  const num = parseInt(digits, 10);
  if (isNaN(num)) return raw;
  return num.toLocaleString("tr-TR") + " ₺";
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

interface RangeSummary { feed: EkonomiFeedItem[]; gelir: number; gider: number; net: number }

export default function EkonomiView({ data, readOnly = false, backHref = "/musteri/admin" }: { data: EkonomiData; readOnly?: boolean; backHref?: string }) {
  const router = useRouter();
  const [feed, setFeed] = useState(data.feed);
  const [type, setType] = useState<"GELIR" | "GIDER">("GIDER");
  const [category, setCategory] = useState(GIDER_KATEGORILERI[0]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(todayStr);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showBulk, setShowBulk] = useState(false);

  // Tarih aralığı / ay detayı — aynı panel ikisi için de kullanılır.
  const [detailTitle, setDetailTitle] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [detailData, setDetailData] = useState<RangeSummary | null>(null);
  const [rangeStart, setRangeStart] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10));
  const [rangeEnd, setRangeEnd] = useState(todayStr);

  async function loadRange(title: string, start: string, end: string) {
    setDetailTitle(title);
    setDetailLoading(true);
    setDetailError("");
    setDetailData(null);
    const res = await fetch(`/api/musteri/admin/ekonomi/rapor?start=${start}&end=${end}`);
    const json = await res.json().catch(() => ({}));
    setDetailLoading(false);
    if (!res.ok) { setDetailError(json.error ?? "Rapor alınamadı."); return; }
    setDetailData(json);
  }

  async function handleLogout() {
    try { await fetch("/api/musteri/auth/logout", { method: "POST" }); } catch { /* ignore */ }
    window.location.href = "/musteri/giris";
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!amount.trim() || !description.trim()) return;
    setSaving(true);
    setError("");
    const res = await fetch("/api/musteri/admin/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, amount: amount.trim(), description: description.trim(), date, category: type === "GIDER" ? category : undefined }),
    });
    const json = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) { setError(json.error ?? "Kaydedilemedi."); return; }
    setAmount("");
    setDescription("");
    router.refresh();
    setFeed((prev) => [
      { id: json.transaction.id, type, amount: parseInt(amount.replace(/[^\d]/g, ""), 10) || 0, description: description.trim(), date: new Date(date).toISOString(), category: type === "GIDER" ? category : null, deletable: true },
      ...prev,
    ]);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const res = await fetch(`/api/musteri/admin/transactions/${id}`, { method: "DELETE" });
    if (res.ok) {
      setFeed((prev) => prev.filter((f) => f.id !== id));
      router.refresh();
    }
    setDeletingId(null);
  }

  const kasaColor = data.currentMonth.net >= 0 ? "#34d399" : "#f87171";
  const genelKasaColor = data.allTime.net >= 0 ? "#c084fc" : "#f87171";

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <header className="sticky top-0 z-50 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-3"
        style={{ background: "rgba(5,5,5,0.9)", WebkitBackdropFilter: "blur(20px)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <a href={backHref} className="font-black text-[16px] sm:text-[18px] gradient-text flex-shrink-0">markaizi</a>
          <span className="hidden sm:inline text-[#555]">/</span>
          <a href={backHref} className="hidden sm:inline text-[14px] text-[#8a8a9a] hover:text-white transition-colors">{readOnly ? "Çalışan Paneli" : "Admin"}</a>
          <span className="hidden sm:inline text-[#555]">/</span>
          <span className="text-[13px] sm:text-[14px] font-semibold text-white truncate">Ekonomi</span>
        </div>
        <button onClick={handleLogout} className="text-[12px] sm:text-[13px] text-[#8a8a9a] hover:text-[#f87171] transition-colors flex-shrink-0 min-h-[44px] px-1 flex items-center">
          Çıkış
        </button>
      </header>

      <main className="max-w-[960px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6">
          <h1 className="font-black text-[22px] sm:text-[24px] text-white mb-1">Ekonomi</h1>
          <p className="text-[13px] text-[#8a8a9a]">{data.currentMonthLabel} — ajansın genel gelir/gider durumu.</p>
        </div>

        {/* Genel Toplam — tüm zamanlar. "Bugüne kadar toplam ne kazandım/harcadım,
            genel kasada ne kaldı" sorusunun cevabı; aylık rakamlarla karıştırılmasın
            diye ayrı ve daha vurgulu bir bantta. */}
        <div className="rounded-2xl p-5 mb-6" style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.1),rgba(236,72,153,0.06))", border: "1px solid rgba(168,85,247,0.25)" }}>
          <p className="text-[11px] font-bold uppercase tracking-wide mb-3" style={{ color: "#c084fc" }}>Genel Toplam · Tüm Zamanlar</p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-[10px] text-[#8a8a9a] uppercase tracking-wide mb-1">Toplam Gelir</p>
              <p className="text-[16px] sm:text-[19px] font-black" style={{ color: "#34d399" }}>{fmtTL(data.allTime.gelir)}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#8a8a9a] uppercase tracking-wide mb-1">Toplam Gider</p>
              <p className="text-[16px] sm:text-[19px] font-black" style={{ color: "#f87171" }}>{fmtTL(data.allTime.gider)}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#8a8a9a] uppercase tracking-wide mb-1">Genel Kasada Kalan</p>
              <p className="text-[16px] sm:text-[19px] font-black" style={{ color: genelKasaColor }}>{fmtTL(data.allTime.net)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="rounded-2xl p-4" style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)" }}>
            <p className="text-[10px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1">Gelir</p>
            <p className="text-[16px] sm:text-[19px] font-black" style={{ color: "#34d399" }}>{fmtTL(data.currentMonth.gelir)}</p>
          </div>
          <div className="rounded-2xl p-4" style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>
            <p className="text-[10px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1">Gider</p>
            <p className="text-[16px] sm:text-[19px] font-black" style={{ color: "#f87171" }}>{fmtTL(data.currentMonth.gider)}</p>
          </div>
          <div className="rounded-2xl p-4" style={{ background: data.currentMonth.net >= 0 ? "rgba(168,85,247,0.08)" : "rgba(248,113,113,0.08)", border: `1px solid ${data.currentMonth.net >= 0 ? "rgba(168,85,247,0.2)" : "rgba(248,113,113,0.2)"}` }}>
            <p className="text-[10px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1">Bu Ay Kasada Kalan</p>
            <p className="text-[16px] sm:text-[19px] font-black" style={{ color: kasaColor }}>{fmtTL(data.currentMonth.net)}</p>
          </div>
          <div className="rounded-2xl p-4" style={{ background: data.gecikmisFaturaToplam > 0 ? "rgba(248,113,113,0.08)" : "rgba(251,191,36,0.08)", border: `1px solid ${data.gecikmisFaturaToplam > 0 ? "rgba(248,113,113,0.2)" : "rgba(251,191,36,0.2)"}` }}>
            <p className="text-[10px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1">Tahsil Edilecek</p>
            <p className="text-[16px] sm:text-[19px] font-black" style={{ color: data.gecikmisFaturaToplam > 0 ? "#f87171" : "#fbbf24" }}>{fmtTL(data.bekleyenFaturaToplam)}</p>
            <p className="text-[10px] mt-1 text-[#8a8a9a]">vadesi gelmiş faturalar</p>
          </div>
        </div>

        {/* Fatura durumu — vade tarihine göre otomatik ayrışır. Vadesi gelmemiş
            faturalar burada ayrı durur, "Tahsil Edilecek" rakamına karışmaz. */}
        <div className="mb-8">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-[15px] font-bold text-white">Fatura Durumu</h2>
            <a href="/musteri/admin/odemeler" className="text-[12px] text-[#c084fc] hover:text-white transition-colors">Ödemeler →</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FaturaKutu baslik="Günü Gelmedi" aciklama="vadesi henüz gelmedi" renk="#8a8a9a" adet={data.faturaOzet.gunuGelmedi.adet} toplam={data.faturaOzet.gunuGelmedi.toplam} />
            <FaturaKutu baslik="Bekliyor" aciklama="vadesi geldi, tahsil edilmeli" renk="#fbbf24" adet={data.faturaOzet.bekliyor.adet} toplam={data.faturaOzet.bekliyor.toplam} />
            <FaturaKutu baslik="Gecikmede" aciklama="vadesi 7+ gün geçti" renk="#f87171" adet={data.faturaOzet.gecikmede.adet} toplam={data.faturaOzet.gecikmede.toplam} />
          </div>
        </div>

        {!readOnly && <RecurringExpensesSection initial={data.recurringExpenses} />}

        {/* Elle gelir/gider ekleme — salt okunur erişimde gizli */}
        {!readOnly && (
        <div className="rounded-2xl p-5 mb-8" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-semibold text-white">Gelir / Gider Ekle</p>
            <button type="button" onClick={() => setShowBulk(true)} className="text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
              style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "#8a8a9a" }}>
              + Toplu Gider Ekle
            </button>
          </div>
          <form onSubmit={handleAdd} className="space-y-3">
            <div className="flex gap-2">
              <button type="button" onClick={() => setType("GIDER")}
                className="flex-1 text-[13px] font-semibold py-2.5 rounded-xl transition-colors"
                style={type === "GIDER"
                  ? { background: "rgba(248,113,113,0.15)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)" }
                  : { background: "var(--bg)", color: "#8a8a9a", border: "1px solid var(--border)" }}>
                Gider
              </button>
              <button type="button" onClick={() => setType("GELIR")}
                className="flex-1 text-[13px] font-semibold py-2.5 rounded-xl transition-colors"
                style={type === "GELIR"
                  ? { background: "rgba(52,211,153,0.15)", color: "#34d399", border: "1px solid rgba(52,211,153,0.3)" }
                  : { background: "var(--bg)", color: "#8a8a9a", border: "1px solid var(--border)" }}>
                Gelir
              </button>
            </div>
            {type === "GIDER" && (
              <select
                id="ekonomi-kategori"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="Gider kategorisi"
                className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-white outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
              >
                {GIDER_KATEGORILERI.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            )}
            <label htmlFor="ekonomi-aciklama" className="sr-only">Açıklama</label>
            <input
              id="ekonomi-aciklama"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Açıklama — örn. Ofis kirası"
              className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-white placeholder-[#555] outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="ekonomi-tutar" className="sr-only">Tutar</label>
                <input
                  id="ekonomi-tutar"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onBlur={(e) => setAmount(fmtAmount(e.target.value))}
                  placeholder="Örn: 5.000 ₺"
                  className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-white placeholder-[#555] outline-none"
                  style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                />
              </div>
              <div>
                <label htmlFor="ekonomi-tarih" className="sr-only">Tarih</label>
                <input
                  id="ekonomi-tarih"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-white outline-none"
                  style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                />
              </div>
            </div>
            {error && <p className="text-[12px]" style={{ color: "#f87171" }}>{error}</p>}
            <button type="submit" disabled={saving} className="btn btn-primary w-full">
              {saving ? "Kaydediliyor..." : "Ekle"}
            </button>
          </form>
        </div>
        )}

        {/* Tarih aralığı raporu — "belli tarih aralığı" detaylı görünüm */}
        <div className="rounded-2xl p-5 mb-8" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <p className="text-[13px] font-semibold text-white mb-3">Tarih Aralığı Raporu</p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-[10px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Başlangıç</label>
              <input type="date" value={rangeStart} onChange={(e) => setRangeStart(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-white outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }} />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Bitiş</label>
              <input type="date" value={rangeEnd} onChange={(e) => setRangeEnd(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-white outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }} />
            </div>
          </div>
          <button
            type="button"
            onClick={() => loadRange(`${fmtDate(new Date(rangeStart).toISOString())} — ${fmtDate(new Date(rangeEnd).toISOString())}`, rangeStart, rangeEnd)}
            className="btn btn-outline w-full text-sm"
          >
            Raporu Göster
          </button>
        </div>

        {/* Bu ayın hareketleri */}
        <div className="mb-8">
          <div className="flex items-center justify-between px-1 mb-3">
            <p className="text-[13px] font-bold uppercase tracking-wide text-[#8a8a9a]">Bu Ayın Hareketleri</p>
            {feed.length > 0 && (
              <button
                onClick={() => downloadCsv(`ekonomi-${data.currentMonthLabel.replace(/\s+/g, "-").toLowerCase()}.csv`, feed)}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
                style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "#8a8a9a" }}
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                CSV İndir
              </button>
            )}
          </div>
          <div className="space-y-2">
            {feed.map((f) => (
              <div key={f.id} className="rounded-xl px-4 py-3 flex items-center justify-between gap-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="min-w-0">
                  <p className="text-[13.5px] font-semibold text-white truncate">{f.description}</p>
                  <p className="text-[11px] text-[#8a8a9a] mt-0.5">
                    {fmtDate(f.date)}
                    {f.category && <span className="ml-1.5 opacity-80">· {f.category}</span>}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[14px] font-bold" style={{ color: f.type === "GELIR" ? "#34d399" : "#f87171" }}>
                    {f.type === "GELIR" ? "+" : "−"}{fmtTL(f.amount)}
                  </span>
                  {!readOnly && f.deletable && (
                    <button
                      onClick={() => handleDelete(f.id)}
                      disabled={deletingId === f.id}
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md text-[#555] hover:text-[#f87171] transition-colors flex-shrink-0 -mr-2.5"
                    >
                      <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2.5">
                        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
            {feed.length === 0 && (
              <div className="px-5 py-10 text-center rounded-xl" style={{ border: "1px solid var(--border)" }}>
                <p className="text-[14px] text-[#555]">Bu ay henüz hareket yok.</p>
              </div>
            )}
          </div>
        </div>

        {/* Aylık geçmiş — bir aya tıklayınca o ayın kalemleri detay panelinde açılır */}
        <div>
          <p className="text-[13px] font-bold uppercase tracking-wide text-[#8a8a9a] px-1 mb-3">Aylık Geçmiş</p>

          {/* Mobil: kart listesi */}
          <div className="md:hidden space-y-2">
            {data.monthlyHistory.map((m) => (
              <button key={m.key} onClick={() => loadRange(m.label, `${m.key}-01`, monthEndStr(m.key))}
                className="w-full text-left rounded-xl px-4 py-3 transition-colors hover:brightness-110" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[14px] font-semibold text-white">{m.label}</span>
                  <span className="text-[15px] font-black flex-shrink-0" style={{ color: m.net >= 0 ? "#c084fc" : "#f87171" }}>{fmtTL(m.net)}</span>
                </div>
                <p className="text-[12px] text-[#8a8a9a] mt-1">
                  Gelir <span style={{ color: "#34d399" }}>{fmtTL(m.gelir)}</span> · Gider <span style={{ color: "#f87171" }}>{fmtTL(m.gider)}</span>
                </p>
              </button>
            ))}
          </div>

          {/* Masaüstü: tablo */}
          <div className="hidden md:block rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="grid grid-cols-4 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[#8a8a9a]" style={{ borderBottom: "1px solid var(--border)" }}>
              <span>Ay</span>
              <span className="text-right">Gelir</span>
              <span className="text-right">Gider</span>
              <span className="text-right">Net</span>
            </div>
            {data.monthlyHistory.map((m) => (
              <button key={m.key} onClick={() => loadRange(m.label, `${m.key}-01`, monthEndStr(m.key))}
                className="grid grid-cols-4 px-4 py-3 text-[13px] w-full text-left transition-colors hover:bg-white/[0.03]" style={{ borderBottom: "1px solid var(--border)" }}>
                <span className="text-white font-medium truncate">{m.label}</span>
                <span className="text-right" style={{ color: "#34d399" }}>{fmtTL(m.gelir)}</span>
                <span className="text-right" style={{ color: "#f87171" }}>{fmtTL(m.gider)}</span>
                <span className="text-right font-bold" style={{ color: m.net >= 0 ? "#c084fc" : "#f87171" }}>{fmtTL(m.net)}</span>
              </button>
            ))}
          </div>
        </div>
      </main>

      {showBulk && !readOnly && (
        <BulkExpenseModal
          onClose={() => setShowBulk(false)}
          onSaved={() => { setShowBulk(false); router.refresh(); }}
        />
      )}

      {detailTitle && (
        <DetailModal
          title={detailTitle}
          loading={detailLoading}
          error={detailError}
          data={detailData}
          onClose={() => setDetailTitle(null)}
        />
      )}
    </div>
  );
}

// Bir ay anahtarından ("2026-09") o ayın son gününü "YYYY-MM-DD" olarak üretir.
function monthEndStr(key: string): string {
  const [y, m] = key.split("-").map(Number);
  const lastDay = new Date(y, m, 0).getDate();
  return `${key}-${String(lastDay).padStart(2, "0")}`;
}

// ── Tarih aralığı / ay detayı paneli ─────────────────────────────────────────
function DetailModal({
  title, loading, error, data, onClose,
}: {
  title: string; loading: boolean; error: string; data: RangeSummary | null; onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.75)", WebkitBackdropFilter: "blur(8px)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-[520px] rounded-2xl p-5 sm:p-7 relative max-h-[85vh] overflow-y-auto" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <button type="button" onClick={onClose} aria-label="Kapat" className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-all hover:bg-white/[0.08]">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-[#8a8a9a]" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
        </button>
        <h2 className="font-bold text-[17px] text-white mb-4">{title}</h2>

        {loading && <p className="text-[13px] text-[#8a8a9a] text-center py-10">Yükleniyor...</p>}
        {error && <p className="text-[13px] text-center py-10" style={{ color: "#f87171" }}>{error}</p>}

        {data && (
          <>
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="rounded-xl p-3" style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)" }}>
                <p className="text-[9.5px] text-[#8a8a9a] uppercase tracking-wide mb-1">Gelir</p>
                <p className="text-[14px] font-black" style={{ color: "#34d399" }}>{fmtTL(data.gelir)}</p>
              </div>
              <div className="rounded-xl p-3" style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>
                <p className="text-[9.5px] text-[#8a8a9a] uppercase tracking-wide mb-1">Gider</p>
                <p className="text-[14px] font-black" style={{ color: "#f87171" }}>{fmtTL(data.gider)}</p>
              </div>
              <div className="rounded-xl p-3" style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)" }}>
                <p className="text-[9.5px] text-[#8a8a9a] uppercase tracking-wide mb-1">Net</p>
                <p className="text-[14px] font-black" style={{ color: data.net >= 0 ? "#c084fc" : "#f87171" }}>{fmtTL(data.net)}</p>
              </div>
            </div>

            {data.feed.length > 0 && (
              <button
                onClick={() => downloadCsv(`ekonomi-rapor.csv`, data.feed)}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors mb-3 flex items-center gap-1.5"
                style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "#8a8a9a" }}
              >
                CSV İndir
              </button>
            )}

            <div className="space-y-2">
              {data.feed.map((f) => (
                <div key={f.id} className="rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-3" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold text-white truncate">{f.description}</p>
                    <p className="text-[10.5px] text-[#8a8a9a] mt-0.5">{fmtDate(f.date)}{f.category && <span className="ml-1.5 opacity-80">· {f.category}</span>}</p>
                  </div>
                  <span className="text-[13px] font-bold flex-shrink-0" style={{ color: f.type === "GELIR" ? "#34d399" : "#f87171" }}>
                    {f.type === "GELIR" ? "+" : "−"}{fmtTL(f.amount)}
                  </span>
                </div>
              ))}
              {data.feed.length === 0 && <p className="text-[13px] text-[#555] text-center py-8">Bu aralıkta hareket yok.</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Toplu gider girişi ────────────────────────────────────────────────────────
function BulkExpenseModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  type Row = { description: string; category: string; amount: string; date: string };
  const emptyRow = (): Row => ({ description: "", category: GIDER_KATEGORILERI[0], amount: "", date: todayStr() });
  const [rows, setRows] = useState<Row[]>([emptyRow(), emptyRow()]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateRow(i: number, patch: Partial<Row>) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  async function handleSave() {
    setError("");
    const valid = rows.filter((r) => r.description.trim() && r.amount.trim());
    if (valid.length === 0) { setError("En az bir satır doldurun."); return; }

    setSaving(true);
    const res = await fetch("/api/musteri/admin/transactions/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rows: valid.map((r) => ({ type: "GIDER", amount: r.amount.trim(), description: r.description.trim(), date: r.date, category: r.category })),
      }),
    });
    const json = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) { setError(json.error ?? "Kaydedilemedi."); return; }
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.75)", WebkitBackdropFilter: "blur(8px)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-[640px] rounded-2xl p-5 sm:p-7 relative max-h-[85vh] overflow-y-auto" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <button type="button" onClick={onClose} aria-label="Kapat" className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-all hover:bg-white/[0.08]">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-[#8a8a9a]" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
        </button>
        <h2 className="font-bold text-[17px] text-white mb-1">Toplu Gider Ekle</h2>
        <p className="text-[13px] text-[#8a8a9a] mb-5">Birden fazla gideri tek seferde kaydedin.</p>

        <div className="space-y-3 mb-4">
          {rows.map((r, i) => (
            <div key={i} className="rounded-xl p-3.5" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2.5">
                <input value={r.description} onChange={(e) => updateRow(i, { description: e.target.value })}
                  placeholder="Açıklama — örn. Elektrik faturası"
                  className="w-full px-3 py-2.5 rounded-lg text-[13.5px] text-white placeholder-[#555] outline-none"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }} />
                <select value={r.category} onChange={(e) => updateRow(i, { category: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg text-[13.5px] text-white outline-none"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  {GIDER_KATEGORILERI.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <input value={r.amount} onChange={(e) => updateRow(i, { amount: e.target.value })}
                  onBlur={(e) => updateRow(i, { amount: fmtAmount(e.target.value) })}
                  placeholder="Tutar — örn. 1.500 ₺"
                  className="w-full px-3 py-2.5 rounded-lg text-[13.5px] text-white placeholder-[#555] outline-none"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }} />
                <input type="date" value={r.date} onChange={(e) => updateRow(i, { date: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg text-[13.5px] text-white outline-none"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }} />
              </div>
            </div>
          ))}
        </div>

        <button type="button" onClick={() => setRows((prev) => [...prev, emptyRow()])}
          className="text-[12px] font-semibold text-[#c084fc] mb-4">
          + Satır Ekle
        </button>

        {error && <p className="text-[12px] mb-3" style={{ color: "#f87171" }}>{error}</p>}

        <div className="flex gap-2">
          <button onClick={handleSave} disabled={saving} className="btn btn-primary text-sm px-5 py-2.5 flex-1">
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
          <button onClick={onClose} disabled={saving} className="btn btn-outline text-sm px-5 py-2.5">İptal</button>
        </div>
      </div>
    </div>
  );
}

// ── Düzenli Giderler ──────────────────────────────────────────────────────────
function RecurringExpensesSection({ initial }: { initial: RecurringExpenseItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const emptyForm = { title: "", category: GIDER_KATEGORILERI[0], amount: "", dayOfMonth: "1" };
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.amount.trim()) return;
    setSaving(true);
    setError("");
    const res = await fetch("/api/musteri/admin/recurring-expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: form.title.trim(), category: form.category, amount: form.amount.trim(), dayOfMonth: Number(form.dayOfMonth) || 1 }),
    });
    const json = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) { setError(json.error ?? "Kaydedilemedi."); return; }
    setItems((prev) => [...prev, json.item]);
    setForm(emptyForm);
    setShowForm(false);
    router.refresh();
  }

  async function handleToggleActive(id: string, active: boolean) {
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, active } : r)));
    await fetch(`/api/musteri/admin/recurring-expenses/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active }),
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu düzenli gideri sil? Geçmiş kayıtlar kalır, sadece otomatik üretim durur.")) return;
    setItems((prev) => prev.filter((r) => r.id !== id));
    await fetch(`/api/musteri/admin/recurring-expenses/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="rounded-2xl p-5 mb-8" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[13px] font-semibold text-white">Düzenli Giderler</p>
          <p className="text-[11px] text-[#8a8a9a] mt-0.5">Kira, sabit fatura gibi her ay otomatik düşen kalemler.</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors flex-shrink-0"
            style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "#8a8a9a" }}>
            + Ekle
          </button>
        )}
      </div>

      {items.length > 0 && (
        <div className="space-y-2 mb-3">
          {items.map((r) => (
            <div key={r.id} className="rounded-xl px-4 py-3 flex items-center justify-between gap-3" style={{ background: "var(--bg)", border: "1px solid var(--border)", opacity: r.active ? 1 : 0.5 }}>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-white truncate">{r.title}</p>
                <p className="text-[11px] text-[#8a8a9a] mt-0.5">{r.category} · her ayın {r.dayOfMonth}. günü</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-[13px] font-bold" style={{ color: "#f87171" }}>{fmtAmount(r.amount)}</span>
                <button onClick={() => handleToggleActive(r.id, !r.active)} className="text-[11px] font-semibold px-2 py-1 rounded-md"
                  style={{ color: r.active ? "#34d399" : "#8a8a9a" }}>
                  {r.active ? "Aktif" : "Pasif"}
                </button>
                <button onClick={() => handleDelete(r.id)} className="text-[#555] hover:text-[#f87171] transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {items.length === 0 && !showForm && <p className="text-[12.5px] text-[#555]">Henüz düzenli gider tanımlanmadı.</p>}

      {showForm && (
        <form onSubmit={handleAdd} className="rounded-xl p-3.5 space-y-2.5" style={{ background: "var(--bg)", border: "1px solid rgba(168,85,247,0.3)" }}>
          <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Örn: Ofis Kirası" className="w-full px-3 py-2.5 rounded-lg text-[13.5px] text-white placeholder-[#555] outline-none"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }} />
          <div className="grid grid-cols-2 gap-2.5">
            <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-lg text-[13.5px] text-white outline-none"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              {GIDER_KATEGORILERI.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
            <input value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              onBlur={(e) => setForm((f) => ({ ...f, amount: fmtAmount(e.target.value) }))}
              placeholder="Tutar" className="w-full px-3 py-2.5 rounded-lg text-[13.5px] text-white placeholder-[#555] outline-none"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Ayın Kaçında Düşsün</label>
            <input type="number" min={1} max={28} value={form.dayOfMonth} onChange={(e) => setForm((f) => ({ ...f, dayOfMonth: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-lg text-[13.5px] text-white outline-none"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }} />
          </div>
          {error && <p className="text-[11px]" style={{ color: "#f87171" }}>{error}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="btn btn-primary text-sm px-4 py-2 flex-1">{saving ? "..." : "Kaydet"}</button>
            <button type="button" onClick={() => { setShowForm(false); setForm(emptyForm); }} className="btn btn-outline text-sm px-4 py-2">İptal</button>
          </div>
        </form>
      )}
    </div>
  );
}

// Fatura durumu kutusu — adet + toplam tutar
function FaturaKutu({
  baslik, aciklama, renk, adet, toplam,
}: {
  baslik: string; aciklama: string; renk: string; adet: number; toplam: number;
}) {
  const bos = adet === 0;
  return (
    <div className="rounded-2xl p-4" style={{
      background: bos ? "var(--surface)" : `${renk}14`,
      border: `1px solid ${bos ? "var(--border)" : `${renk}38`}`,
    }}>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: bos ? "#3a3a44" : renk }} />
        <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: bos ? "#8a8a9a" : renk }}>{baslik}</p>
      </div>
      <p className="text-[18px] font-black text-white">
        {fmtTL(toplam)}
      </p>
      <p className="text-[11px] text-[#8a8a9a] mt-0.5">
        {adet} fatura · {aciklama}
      </p>
    </div>
  );
}
