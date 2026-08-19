"use client";

import { useState, useEffect } from "react";
import type { ClientData } from "@/lib/clients";
import Calendar from "@/components/Calendar";
import Notes from "@/components/Notes";
import ClientNotificationBell from "@/components/ClientNotificationBell";

type Tab = "website" | "updates" | "calendar" | "invoice" | "raporlar" | "notlar";

function fmtAmount(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return raw;
  const num = parseInt(digits, 10);
  if (isNaN(num)) return raw;
  return num.toLocaleString("tr-TR") + " ₺";
}

// "YYYY-MM-DD" → "10 Eylül 2026"
function fmtDate(raw: string): string {
  if (!raw) return raw;
  const dt = new Date(raw + "T00:00:00");
  if (isNaN(dt.getTime())) return raw;
  return dt.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "website",  label: "Website",             emoji: "🌐" },
  { id: "updates",  label: "Güncellemeler",        emoji: "📝" },
  { id: "calendar", label: "İçerik Takvimi",       emoji: "📅" },
  { id: "invoice",  label: "Fatura",               emoji: "💳" },
  { id: "raporlar", label: "Reklam Raporları",     emoji: "📊" },
  { id: "notlar",   label: "Müşteri İstekleri",    emoji: "🗒️" },
];

// ── Ana bileşen ──────────────────────────────────────────────────────────────
export default function ClientPortal({
  client,
  isAdminView = false,
  isClientViewer = false,
  isAdmin = false,
}: {
  client: ClientData;
  isAdminView?: boolean;
  isClientViewer?: boolean;
  isAdmin?: boolean;
}) {
  async function handleLogout() {
    try {
      await fetch("/api/musteri/auth/logout", { method: "POST" });
    } catch { /* yine de yönlendir */ }
    window.location.href = isAdminView ? "/musteri/admin" : "/musteri/giris";
  }

  return (
    <>
      <Dashboard
        client={client}
        onLogout={handleLogout}
        isAdminView={isAdminView}
        isClientViewer={isClientViewer}
        isAdmin={isAdmin}
      />
      {isClientViewer && <ClientNotificationBell />}
    </>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({
  client,
  onLogout,
  isAdminView,
  isClientViewer,
  isAdmin,
}: {
  client: ClientData;
  onLogout: () => void;
  isAdminView: boolean;
  isClientViewer: boolean;
  isAdmin: boolean;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("calendar");

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ background: "rgba(5,5,5,0.9)", WebkitBackdropFilter: "blur(20px)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <a href="/" className="font-black text-[18px] gradient-text flex-shrink-0">markaizi</a>
          <span className="text-[#555] flex-shrink-0">/</span>
          <span className="text-[14px] font-semibold text-white truncate">{client.name}</span>
        </div>
        {isAdminView ? (
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
        ) : (
          <div className="flex items-center gap-4 flex-shrink-0">
            <a href="/musteri/profil" className="text-[12px] text-[#8a8a9a] hover:text-white transition-colors flex items-center gap-1.5 min-h-[44px] px-1">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Profil
            </a>
            <button onClick={onLogout} className="text-[12px] text-[#8a8a9a] hover:text-[#f87171] transition-colors flex items-center gap-1.5 min-h-[44px] px-1">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
                <path d="M18.364 5.636A9 9 0 1 1 5.636 18.364" strokeLinecap="round"/>
                <path d="M12 3v9" strokeLinecap="round"/>
              </svg>
              Çıkış
            </button>
          </div>
        )}
      </header>

      <main className="max-w-[1080px] mx-auto px-6 py-10">
        {/* Hoş geldin + özet */}
        <div className="mb-7">
          <div className="flex items-center gap-3 mb-5">
            <div>
              <h2 className="font-black text-[22px] text-white">Merhaba, {client.name} 👋</h2>
              <p className="text-[13px] text-[#8a8a9a] mt-0.5">Aşağıdan dilediğiniz bölüme geçebilirsiniz.</p>
            </div>
          </div>
          {/* Inline özet */}
          <QuickSummary client={client} onNavigate={setActiveTab} />
        </div>

        {/* Sekmeler — yatay pill bar */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 mb-7 -mx-6 px-6 sm:mx-0 sm:px-0" style={{ scrollbarWidth: "none" }}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all flex-shrink-0"
                style={
                  isActive
                    ? {
                        background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(168,85,247,0.2))",
                        border: "1px solid rgba(168,85,247,0.5)",
                        color: "#e2d0ff",
                      }
                    : {
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        color: "#8a8a9a",
                      }
                }
              >
                <span className="text-[14px]">{tab.emoji}</span>
                {tab.label}
              </button>
            );
          })}
        </div>

        <div>
          {activeTab === "website"  && <WebsiteTab  client={client} />}
          {activeTab === "updates"  && <UpdatesTab  client={client} />}
          {activeTab === "calendar" && <CalendarTab clientSlug={client.slug} />}
          {activeTab === "invoice"  && <InvoiceTab  client={client} />}
          {activeTab === "raporlar" && <ReportsTab  client={client} />}
          {activeTab === "notlar"   && (
            <Notes
              clientSlug={client.slug}
              isClient={isClientViewer}
              isStaff={isAdminView}
              isAdmin={isAdmin}
            />
          )}
        </div>
      </main>
    </div>
  );
}

// ── Inline Özet (greeting altı) ───────────────────────────────────────────────
function QuickSummary({ client, onNavigate }: { client: ClientData; onNavigate: (tab: Tab) => void }) {
  const [unreadCount, setUnreadCount] = useState<number | null>(null);
  const [latestUpdate, setLatestUpdate] = useState<{ date: string; text: string } | null>(null);
  const [unseenUpdate, setUnseenUpdate] = useState(false);
  const [unseenReport, setUnseenReport] = useState<{ id: string; platform: string; month: string } | null>(null);

  useEffect(() => {
    fetch("/api/musteri/notifications")
      .then((r) => r.json())
      .then((json: { items?: { clientSlug: string; unreadCount: number }[] }) => {
        const item = json.items?.find((i) => i.clientSlug === client.slug);
        setUnreadCount(item?.unreadCount ?? 0);
      })
      .catch(() => setUnreadCount(0));

    const updates = client.updates ?? [];
    if (updates.length > 0) {
      const latest = updates[0];
      const seenKey = `seen_update_${client.slug}`;
      const lastSeen = localStorage.getItem(seenKey);
      // Kaydedilen son görülen tarih farklıysa (veya hiç yoksa) bildirim göster
      if (lastSeen !== latest.date) {
        setLatestUpdate(latest);
        setUnseenUpdate(true);
      }
    }

    const reports = client.adReports ?? [];
    if (reports.length > 0) {
      const latest = reports[0];
      const seenKey = `seen_report_${client.slug}`;
      const lastSeen = localStorage.getItem(seenKey);
      if (lastSeen !== latest.id) {
        setUnseenReport({ id: latest.id, platform: latest.platform, month: latest.month });
      }
    }
  }, [client.slug, client.updates, client.adReports]);

  const dailySpends = [
    { label: "Günlük Meta Harcaması",   emoji: "📣", color: "#60a5fa", value: client.dailyMetaSpend },
    { label: "Günlük Google Harcaması", emoji: "🔍", color: "#34d399", value: client.dailyGoogleSpend },
  ].filter((s) => s.value);

  const overdueInvoices = (client.invoices ?? []).filter((i) => i.status === "Gecikmede");
  const dueInvoices = (client.invoices ?? []).filter((i) => i.status === "Bekliyor");

  const hasNotifications = unseenUpdate || !!unseenReport || (unreadCount !== null && unreadCount > 0)
    || overdueInvoices.length > 0 || dueInvoices.length > 0;
  const hasSpends = dailySpends.length > 0;

  if (!hasNotifications && !hasSpends) return null;

  return (
    <div className="space-y-3">
      {/* Bildirimler */}
      {hasNotifications && (() => {
        type NotifItem = { key: string; onClick: () => void; icon: string; iconBg: string; border: string; bg: string; labelColor: string; label: string; sub: string };
        const items: NotifItem[] = [
          overdueInvoices.length > 0
            ? {
                key: "overdue",
                onClick: () => onNavigate("invoice"),
                icon: "⚠️",
                iconBg: "rgba(248,113,113,0.15)",
                border: "rgba(248,113,113,0.5)",
                bg: "rgba(248,113,113,0.08)",
                labelColor: "#f87171",
                label: overdueInvoices.length === 1 ? "1 faturanız gecikmede" : `${overdueInvoices.length} faturanız gecikmede`,
                sub: "Ödemeniz için lütfen fatura bölümünü kontrol edin.",
              }
            : dueInvoices.length > 0
            ? {
                key: "due",
                onClick: () => onNavigate("invoice"),
                icon: "💳",
                iconBg: "rgba(251,191,36,0.15)",
                border: "rgba(251,191,36,0.45)",
                bg: "rgba(251,191,36,0.08)",
                labelColor: "#fbbf24",
                label: dueInvoices.length === 1 ? "1 bekleyen faturanız var" : `${dueInvoices.length} bekleyen faturanız var`,
                sub: "Ödeme tarihi geldi, fatura bölümünden görüntüleyebilirsiniz.",
              }
            : null,
          unseenUpdate && latestUpdate
            ? {
                key: "update",
                onClick: () => {
                  localStorage.setItem(`seen_update_${client.slug}`, latestUpdate.date);
                  setUnseenUpdate(false);
                  onNavigate("updates");
                },
                icon: "📝",
                iconBg: "rgba(96,165,250,0.15)",
                border: "rgba(96,165,250,0.45)",
                bg: "rgba(96,165,250,0.08)",
                labelColor: "#93c5fd",
                label: "Yeni ajans güncellemesi",
                sub: `${fmtDate(latestUpdate.date)} — ${latestUpdate.text}`,
              }
            : null,
          unseenReport
            ? {
                key: "report",
                onClick: () => {
                  localStorage.setItem(`seen_report_${client.slug}`, unseenReport.id);
                  setUnseenReport(null);
                  onNavigate("raporlar");
                },
                icon: "📊",
                iconBg: "rgba(192,132,252,0.15)",
                border: "rgba(192,132,252,0.45)",
                bg: "rgba(192,132,252,0.08)",
                labelColor: "#d8b4fe",
                label: "Yeni reklam raporu yayınlandı",
                sub: `${PLATFORM_META[unseenReport.platform]?.label ?? unseenReport.platform} — ${unseenReport.month}`,
              }
            : null,
          unreadCount !== null && unreadCount > 0
            ? {
                key: "notes",
                onClick: () => { setUnreadCount(0); onNavigate("notlar"); },
                icon: "🔔",
                iconBg: "rgba(251,146,60,0.15)",
                border: "rgba(251,146,60,0.45)",
                bg: "rgba(251,146,60,0.08)",
                labelColor: "#fdba74",
                label: `${unreadCount} yeni yanıt`,
                sub: "İsteğinize ajansınızdan yeni bir yanıt var.",
              }
            : null,
        ].filter((x): x is NotifItem => x !== null);

        return (
          <div className={`grid gap-2 ${items.length > 1 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
            {items.map((item) => (
              <button
                key={item.key}
                onClick={item.onClick}
                className="text-left rounded-xl px-4 py-3.5 flex items-center gap-3 transition-all hover:brightness-110"
                style={{ background: item.bg, border: `1.5px solid ${item.border}` }}
              >
                <span
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-[17px] flex-shrink-0"
                  style={{ background: item.iconBg }}
                >
                  {item.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold" style={{ color: item.labelColor }}>{item.label}</p>
                  <p className="text-[11px] text-[#8a8a9a] truncate mt-0.5">{item.sub}</p>
                </div>
                <span className="text-[12px] font-bold flex-shrink-0" style={{ color: item.labelColor }}>→</span>
              </button>
            ))}
          </div>
        );
      })()}

      {/* Günlük reklam harcaması */}
      {hasSpends && (
        <div className={`grid gap-3 ${dailySpends.length === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
          {dailySpends.map(({ label, emoji, color, value }) => (
            <div
              key={label}
              className="rounded-xl p-4"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[15px]">{emoji}</span>
                <span className="text-[12px] font-bold uppercase tracking-wide" style={{ color }}>{label}</span>
              </div>
              <p className="text-[26px] font-black text-white leading-none">{fmtAmount(value!)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Tab: Website ──────────────────────────────────────────────────────────────
function WebsiteTab({ client }: { client: ClientData }) {
  if (!client.websiteUpdates?.length) {
    return <Empty text="Website güncellemesi henüz girilmedi." />;
  }
  return (
    <Section title="Website" subtitle="Web sitenizde yapılan çalışmalar ve güncellemeler">
      <div className="space-y-3">
        {client.websiteUpdates.map((u, i) => (
          <div
            key={i}
            className="rounded-xl p-5 flex gap-4 items-start"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <span
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg flex-shrink-0 whitespace-nowrap mt-0.5"
              style={{ background: "rgba(96,165,250,0.1)", color: "#60a5fa" }}
            >
              {fmtDate(u.date)}
            </span>
            <p className="text-[14px] text-[#c8c8d8] leading-relaxed whitespace-pre-wrap">{u.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ── Tab: Ajans Güncellemeleri ─────────────────────────────────────────────────
function UpdatesTab({ client }: { client: ClientData }) {
  if (!client.updates?.length) {
    return <Empty text="Henüz güncelleme girilmedi." />;
  }
  return (
    <Section title="Ajans Güncellemeleri" subtitle="Ekibimizin yaptığı çalışmalar ve gelişmeler">
      <div className="space-y-3">
        {client.updates.map((u, i) => (
          <div
            key={i}
            className="rounded-xl p-5 flex gap-4 items-start"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <span
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg flex-shrink-0 whitespace-nowrap mt-0.5"
              style={{ background: "rgba(168,85,247,0.1)", color: "#c084fc" }}
            >
              {fmtDate(u.date)}
            </span>
            <p className="text-[14px] text-[#c8c8d8] leading-relaxed whitespace-pre-wrap">{u.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ── Tab: İçerik Takvimi ───────────────────────────────────────────────────────
function CalendarTab({ clientSlug }: { clientSlug: string }) {
  return (
    <Section title="İçerik Takvimi" subtitle="Planlanan ve yayınlanan içerikleriniz">
      <Calendar clientSlug={clientSlug} />
    </Section>
  );
}

// ── Tab: Fatura ───────────────────────────────────────────────────────────────
const statusStyle = (s: string) => {
  if (s === "Ödendi")       return { background: "rgba(52,211,153,0.12)",  color: "#34d399",  border: "1px solid rgba(52,211,153,0.25)"  };
  if (s === "Bekliyor")     return { background: "rgba(251,191,36,0.12)",  color: "#fbbf24",  border: "1px solid rgba(251,191,36,0.25)"  };
  if (s === "Günü Gelmedi") return { background: "rgba(99,102,241,0.12)",  color: "#818cf8",  border: "1px solid rgba(99,102,241,0.25)"  };
  if (s === "Gecikmede")    return { background: "rgba(248,113,113,0.12)", color: "#f87171",  border: "1px solid rgba(248,113,113,0.25)" };
  return {};
};

const invoiceBadge = (s: string) =>
  s === "Ödendi" ? "✓ Ödendi"
  : s === "Günü Gelmedi" ? "📅 Günü Gelmedi"
  : s === "Gecikmede" ? "⚠ Gecikmede"
  : "⏳ Bekliyor";

function parseAmountNum(raw: string): number {
  const digits = raw.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

function InvoiceList({ invoices }: { invoices: NonNullable<ClientData["invoices"]> }) {
  return (
    <>
      {/* Mobil: kart düzeni */}
      <div className="md:hidden space-y-3">
        {invoices.map((inv, i) => (
          <div key={i} className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <p className="text-[13px] text-white font-medium">{inv.period}</p>
                {inv.dueDate && (
                  <p className="text-[11px] text-[#8a8a9a] mt-0.5">Son ödeme: {fmtDate(inv.dueDate)}</p>
                )}
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0" style={statusStyle(inv.status)}>
                {invoiceBadge(inv.status)}
              </span>
            </div>
            <p className="text-[15px] font-black gradient-text text-center">{fmtAmount(inv.amount)}</p>
          </div>
        ))}
      </div>

      {/* Masaüstü: tablo düzeni */}
      <div className="hidden md:block rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        <div
          className="grid grid-cols-4 px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#8a8a9a]"
          style={{ background: "var(--surface-2)" }}
        >
          <span>Dönem</span>
          <span>Son Ödeme</span>
          <span className="text-center">Tutar</span>
          <span className="text-right">Durum</span>
        </div>
        {invoices.map((inv, i) => (
          <div
            key={i}
            className="grid grid-cols-4 px-5 py-4 items-center"
            style={{
              background: i % 2 === 0 ? "var(--surface)" : "var(--bg)",
              borderTop: i > 0 ? "1px solid var(--border)" : "none",
            }}
          >
            <span className="text-[13px] text-white">{inv.period}</span>
            <span className="text-[13px] text-[#8a8a9a]">{inv.dueDate ? fmtDate(inv.dueDate) : "—"}</span>
            <span className="text-[15px] font-black gradient-text text-center">{fmtAmount(inv.amount)}</span>
            <div className="flex justify-end">
              <span className="text-[11px] font-bold px-3 py-1 rounded-full" style={statusStyle(inv.status)}>
                {invoiceBadge(inv.status)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function InvoiceTab({ client }: { client: ClientData }) {
  if (!client.invoices?.length) {
    return <Empty text="Henüz fatura bilgisi girilmedi." />;
  }

  const paid = client.invoices.filter((i) => i.paid);
  const pending = client.invoices.filter((i) => !i.paid);
  const totalPaid = paid.reduce((sum, i) => sum + parseAmountNum(i.amount), 0);
  const overdueCount = pending.filter((i) => i.status === "Gecikmede").length;

  return (
    <Section title="Fatura Bilgisi" subtitle="Ödeme geçmişiniz ve bekleyen faturalarınız">
      {client.invoiceNote && (
        <SectionNote text={client.invoiceNote} />
      )}

      {/* Özet şeridi */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 mb-6">
        <div className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <p className="text-[10px] text-[#8a8a9a] uppercase tracking-wide mb-1">Toplam Ödenen</p>
          <p className="text-[20px] font-black gradient-text leading-none">{totalPaid.toLocaleString("tr-TR")} ₺</p>
        </div>
        <div className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <p className="text-[10px] text-[#8a8a9a] uppercase tracking-wide mb-1">Bekleyen Fatura</p>
          <p className="text-[20px] font-black text-white leading-none">{pending.length}</p>
        </div>
        {overdueCount > 0 && (
          <div className="rounded-xl p-4 col-span-2 sm:col-span-1" style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.3)" }}>
            <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: "#f87171" }}>Gecikmede</p>
            <p className="text-[20px] font-black leading-none" style={{ color: "#f87171" }}>{overdueCount}</p>
          </div>
        )}
      </div>

      {pending.length > 0 && (
        <div className="mb-6">
          <p className="text-[13px] font-bold text-white mb-3">Bekleyen / Yaklaşan Faturalar</p>
          <InvoiceList invoices={pending} />
        </div>
      )}

      {paid.length > 0 && (
        <div>
          <p className="text-[13px] font-bold text-white mb-3">Geçmiş Ödemeler</p>
          <InvoiceList invoices={paid} />
        </div>
      )}
    </Section>
  );
}

// ── Tab: Reklam Raporları ─────────────────────────────────────────────────────
const PLATFORM_META: Record<string, { label: string; emoji: string; color: string }> = {
  META:    { label: "Meta",    emoji: "📣", color: "#60a5fa" },
  GOOGLE:  { label: "Google",  emoji: "🔍", color: "#34d399" },
  WEBSITE: { label: "Website", emoji: "🌐", color: "#c084fc" },
};

function fmtReportDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

function ReportsTab({ client }: { client: ClientData }) {
  const reports = client.adReports ?? [];
  const platforms = ["META", "GOOGLE", "WEBSITE"] as const;
  const hasAny = reports.length > 0;

  if (!hasAny) {
    return <Empty text="Henüz yayınlanmış reklam raporu yok." />;
  }

  return (
    <Section title="Reklam Raporları" subtitle="Aylık harcama, görüntülenme ve tıklama özetleriniz">
      <div className="space-y-4">
        {platforms.map((p) => {
          const items = reports.filter((r) => r.platform === p);
          if (items.length === 0) return null;
          return <PlatformReportCard key={p} platform={p} items={items} />;
        })}
      </div>
    </Section>
  );
}

function PlatformReportCard({
  platform,
  items,
}: {
  platform: "META" | "GOOGLE" | "WEBSITE";
  items: NonNullable<ClientData["adReports"]>;
}) {
  const [expanded, setExpanded] = useState(false);
  const meta = PLATFORM_META[platform];
  const latest = items[0];
  const history = items.slice(1);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[16px]">{meta.emoji}</span>
          <span className="text-[13px] font-bold uppercase tracking-wide" style={{ color: meta.color }}>{meta.label}</span>
          <span className="text-[12px] text-[#8a8a9a] ml-auto">{latest.month}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          <div>
            <p className="text-[10px] text-[#8a8a9a] uppercase tracking-wide mb-1">Harcama</p>
            <p className="text-[15px] font-black text-white">{latest.spend || "—"}</p>
          </div>
          <div>
            <p className="text-[10px] text-[#8a8a9a] uppercase tracking-wide mb-1">Görüntülenme</p>
            <p className="text-[15px] font-black text-white">{latest.impressions || "—"}</p>
          </div>
          <div>
            <p className="text-[10px] text-[#8a8a9a] uppercase tracking-wide mb-1">Tıklama</p>
            <p className="text-[15px] font-black text-white">{latest.clicks || "—"}</p>
          </div>
          <div>
            <p className="text-[10px] text-[#8a8a9a] uppercase tracking-wide mb-1">Mesajlaşma</p>
            <p className="text-[15px] font-black text-white">{latest.messages || "—"}</p>
          </div>
        </div>

        {latest.summary && (
          <p className="text-[13px] text-[#c8c8d0] whitespace-pre-wrap leading-relaxed mb-2">{latest.summary}</p>
        )}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <p className="text-[11px] text-[#555]">Yayınlanma: {fmtReportDate(latest.publishedAt)}</p>
          {latest.hasPdf && (
            <a
              href={`/api/musteri/reports/${latest.id}/pdf`}
              className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
              style={{ background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.25)" }}
            >
              📄 PDF Raporu İndir
            </a>
          )}
        </div>

        {history.length > 0 && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-3 text-[12px] font-semibold transition-colors"
            style={{ color: meta.color }}
          >
            {expanded ? "Geçmiş raporları gizle ▲" : `Geçmiş ${history.length} raporu göster ▼`}
          </button>
        )}
      </div>

      {expanded && history.length > 0 && (
        <div style={{ borderTop: "1px solid var(--border)" }}>
          {history.map((r) => (
            <div key={r.id} className="px-5 py-3" style={{ borderTop: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between gap-3 mb-1">
                <p className="text-[13px] font-semibold text-white">{r.month}</p>
                <p className="text-[11px] text-[#555]">{fmtReportDate(r.publishedAt)}</p>
              </div>
              <p className="text-[12px] text-[#8a8a9a]">
                {[
                  r.spend && `Harcama: ${r.spend}`,
                  r.impressions && `Görüntülenme: ${r.impressions}`,
                  r.clicks && `Tıklama: ${r.clicks}`,
                  r.messages && `Mesajlaşma: ${r.messages}`,
                ].filter(Boolean).join(" · ") || "Detay girilmemiş"}
              </p>
              {r.summary && <p className="text-[12px] text-[#8a8a9a] mt-1 whitespace-pre-wrap leading-relaxed">{r.summary}</p>}
              {r.hasPdf && (
                <a
                  href={`/api/musteri/reports/${r.id}/pdf`}
                  className="inline-block mt-2 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
                  style={{ background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.25)" }}
                >
                  📄 PDF Raporu İndir
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Yardımcılar ───────────────────────────────────────────────────────────────
function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-5">
        <h3 className="font-bold text-[18px] text-white">{title}</h3>
        <p className="text-[13px] text-[#8a8a9a] mt-0.5">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function SectionNote({ text }: { text: string }) {
  return (
    <div
      className="mt-4 flex items-start gap-2.5 rounded-xl px-4 py-3"
      style={{ background: "rgba(139,142,160,0.07)", border: "1px solid rgba(139,142,160,0.15)" }}
    >
      <span className="text-[14px] flex-shrink-0 mt-0.5">ℹ️</span>
      <p className="text-[12px] text-[#8a8a9a] leading-relaxed">{text}</p>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div
      className="rounded-2xl p-10 text-center"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <p className="text-3xl mb-3">📭</p>
      <p className="text-[14px] text-[#8a8a9a]">{text}</p>
    </div>
  );
}
