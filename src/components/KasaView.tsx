"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PanelShell, Card, Field, Btn, Modal, Chip, Tabs, ClientLink, agendaApi, inputCls, inputStyle, fmtTL, TZ } from "@/components/agenda/ui";
import { getInvoiceStage, INVOICE_STAGE_COLOR, INVOICE_STAGE_LABEL } from "@/lib/invoiceStage";
import {
  computeKasa, monthlyHistory, monthOf, isIncoming, isDebt, isInvestment, parseInstallment, INVESTMENT_CATEGORY,
  type KasaCalcEntry, type KasaCalcCardTx, type KasaDirection, type InstallmentGroup,
} from "@/lib/kasaCalc";

// Mİ Asistan iOS uygulamasındaki "Ödemeler / Kasa" ekranının web karşılığı.
// Hesaplar src/lib/kasaCalc.ts'te — burada yalnızca gösterim ve etkileşim var.

type Sheet =
  | { kind: "borclar" }
  | { kind: "kart"; entryId: string }
  | { kind: "taksit"; base: string }
  | { kind: "tahsil" }
  | { kind: "gider" }
  | { kind: "alacak" }
  | { kind: "gecmis" }
  | { kind: "yatirim" }
  | { kind: "ay"; month: string };

const DIR_LABEL: Record<KasaDirection, string> = { GELIR: "Gelir", GIDER: "Gider", BORC: "Borç / ödeme", ALACAK: "Alacak" };
const CATEGORIES = ["Müşteri Ödemesi", "Kira", "Maaş", "Eğitim", "Abonelik", "muhasebe", "Eşya Taksiti", "Mobilya Taksiti", "borc_alacak", "kredi_karti", "ek_hesap", "genel"];
const dayMonth = (iso: string) => new Date(iso).toLocaleDateString("tr-TR", { timeZone: TZ, day: "numeric", month: "long" });
const monthName = (key: string) => new Date(`${key}-15T12:00:00Z`).toLocaleDateString("tr-TR", { month: "long", year: "numeric" });

export interface FinansClient {
  id: string; slug: string; name: string; active: boolean; fee: number; paymentDays: number[]; graceDays: number;
}

export default function KasaView({ entries: allEntries, cardTxs, clients, employees = [], nowIso, initialTab = "genel" }: {
  entries: KasaCalcEntry[]; cardTxs: KasaCalcCardTx[]; clients: FinansClient[]; employees?: { id: string; name: string }[];
  nowIso: string; initialTab?: "genel" | "musteri";
}) {
  const [tab, setTab] = useState<"genel" | "musteri">(initialTab);
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [stack, setStack] = useState<Sheet[]>([]);
  const [form, setForm] = useState<Partial<KasaCalcEntry> | null>(null);
  const [cardTxFor, setCardTxFor] = useState<KasaCalcEntry | null>(null);
  const [payFor, setPayFor] = useState<KasaCalcEntry | null>(null);
  const [txEdit, setTxEdit] = useState<KasaCalcCardTx | null>(null);
  const [filter, setFilter] = useState<"ALL" | "IN" | "OUT">("ALL");
  const [invForm, setInvForm] = useState<Partial<KasaCalcEntry> | null>(null);

  const k = useMemo(() => computeKasa(allEntries, cardTxs, nowIso), [allEntries, cardTxs, nowIso]);
  // Yatırımlar gider / borç / alacak listelerine girmez; kendi bölümünde (k.investments) gösterilir.
  const entries = useMemo(() => allEntries.filter((e) => !isInvestment(e)), [allEntries]);
  const editEntry = (e: KasaCalcEntry) => (isInvestment(e) ? setInvForm(e) : setForm(e));
  const sheet = stack[stack.length - 1];
  const open = (s: Sheet) => setStack((st) => [...st, s]);
  const back = () => setStack((st) => st.slice(0, -1));

  async function run(key: string, fn: () => Promise<unknown>) {
    setBusy(key);
    setError("");
    try { await fn(); router.refresh(); return true; }
    catch (e) { setError(e instanceof Error ? e.message : "İşlem yapılamadı."); return false; }
    finally { setBusy(null); }
  }
  const markPaid = (e: KasaCalcEntry) => run(e.id, () => agendaApi("PATCH", `kasa/${e.id}`, { status: "ODENDI" }));

  // Yaklaşan ödemeler (30 gün) — kart bakiyeleri hariç
  const horizon = new Date(nowIso).getTime() + 30 * 86_400_000;
  const upcoming = entries.filter((e) => e.status === "BEKLIYOR" && !isIncoming(e.direction) && !isDebt(e) && new Date(e.dueDate).getTime() <= horizon);

  // İşlem geçmişi: ödenmiş kayıtlar + kart harcamaları
  const history = [
    // Kasadan çıkan yatırımlar da nakit hareketidir → geçmişte görünür (allEntries).
    ...allEntries.filter((e) => e.status === "ODENDI" && e.paidAt).map((e) => ({
      id: e.id, date: e.paidAt!, title: e.title, sub: isInvestment(e) ? "Yatırım" : e.category, chip: null as string | null,
      clientName: e.clientName, clientSlug: e.clientSlug ?? null,
      amount: e.amount, incoming: isIncoming(e.direction), entry: e,
    })),
    ...cardTxs.map((t) => ({
      id: t.id, date: t.transactionDate, title: t.title, sub: t.category, chip: t.entryTitle,
      clientName: null as string | null, clientSlug: null as string | null,
      amount: t.amount, incoming: false, entry: null as KasaCalcEntry | null,
    })),
  ]
    .filter((h) => filter === "ALL" || (filter === "IN" ? h.incoming : !h.incoming))
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <PanelShell
      title="Finans"
      subtitle="Kasa, müşteri ödemeleri, borçlar ve giderler — tek yerde. Yalnızca sen görürsün."
      actions={
        <div className="flex items-center gap-2">
          <Link href="/musteri/admin/islem-kaydi" className="hidden sm:flex text-[12px] text-[#8a8a9a] hover:underline px-2 min-h-[44px] items-center">İşlem kaydı</Link>
          <Link href="/musteri/admin/cop-kutusu" className="text-[12px] text-[#8a8a9a] hover:underline px-2 min-h-[44px] flex items-center">Çöp kutusu</Link>
          <Btn variant="primary" onClick={() => setForm({ direction: "BORC", status: "BEKLIYOR" })}>+ Kayıt</Btn>
        </div>
      }
    >
      {error && <div className="mb-4 rounded-xl px-4 py-3 text-[13px]" style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)" }}>{error}</div>}

      <Tabs<"genel" | "musteri">
        active={tab}
        onChange={setTab}
        tabs={[
          { id: "genel", label: "Genel Durum" },
          { id: "musteri", label: "Müşteri Ödemeleri", badge: k.openReceivables.filter((e) => e.category === "Müşteri Ödemesi").length },
        ]}
      />

      {tab === "musteri" && (
        <ClientPaymentsTab entries={entries} clients={clients} nowIso={nowIso} busy={busy}
          onPaid={markPaid} onEdit={(e) => setForm(e)}
          onAdd={(c, monthKey) => setForm({
            direction: "ALACAK", status: "BEKLIYOR", category: "Müşteri Ödemesi", clientId: c.id, clientName: c.name,
            title: monthKey ? `${c.name} ${monthName(monthKey).split(" ")[0]} Ödemesi` : `${c.name} `,
            amount: c.fee ? Math.round(c.fee / Math.max(c.paymentDays.length, 1)) : undefined,
            dueDate: monthKey ? new Date(`${monthKey}-${String(Math.min(c.paymentDays[0] ?? 1, 28)).padStart(2, "0")}T10:00:00+03:00`).toISOString() : undefined,
          })} />
      )}

      {tab === "genel" && (<>
      <div className="rounded-2xl p-5 mb-3 flex flex-wrap items-end justify-between gap-3" style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.25)" }}>
        <div>
          <p className="text-[13px] font-semibold text-[#8a8a9a]">💵 {k.year} Toplam Gelir</p>
          <p className="text-[28px] sm:text-[32px] font-black" style={{ color: "#34d399" }}>{fmtTL(k.yearIncome)}</p>
          <p className="text-[11px] text-[#8a8a9a]">Yeni yılda sıfırdan başlar</p>
        </div>
        <div className="text-right">
          <p className="text-[12px] text-[#8a8a9a]">Tüm zamanlar</p>
          <p className="text-[18px] sm:text-[20px] font-black" style={{ color: "#34d399" }}>{fmtTL(k.totalIncome)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <Tile label="Kasada Kalan" value={fmtTL(k.cash)} sub="Güncel net nakit (TRY)" color="#22d3ee" />
        <Tile label="Güncel Borçlarım" value={fmtTL(k.debtTotal)} sub={`${k.debtItemCount} kalem · Detay`} color="#f87171" onClick={() => open({ kind: "borclar" })} />
        <Tile label="Güncel Ay Gelir" value={fmtTL(k.monthIncomeTarget)} sub="Alacaklar dahil hedef" color="#60a5fa" />
        <Tile label="Güncel Ay Gider" value={fmtTL(k.monthExpenseTotal)} sub={`${k.monthExpenseCount} gider kalemi · Detay`} color="#fb923c" onClick={() => open({ kind: "gider" })} />
        <Tile label="Tahsil Edilenler" value={fmtTL(k.collectedTotal)} sub="Detay için dokun" color="#34d399" onClick={() => open({ kind: "tahsil" })} />
        <Tile label="Alacaklar" value={fmtTL(k.openReceivablesTotal)} sub={`${k.openReceivables.length} bekleyen · Detay`} color="#f87171" onClick={() => open({ kind: "alacak" })} />
        <Tile wide label="📈 Yatırım" value={fmtTL(k.investmentTotal)} color="#fbbf24" onClick={() => open({ kind: "yatirim" })}
          sub={k.investments.length ? `${k.investments.length} kalem · Detay` : "Henüz yatırım yok · Eklemek için dokun"} />
      </div>

      <button onClick={() => open({ kind: "gecmis" })} className="w-full rounded-2xl px-5 py-4 mb-8 flex items-center justify-between text-left min-h-[56px]"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <span className="text-[15px] font-semibold text-white">🗓️ Geçmiş Ayları Gör</span>
        <span className="text-[#8a8a9a]">›</span>
      </button>

      {upcoming.length > 0 && (
        <>
          <SectionTitle>Yaklaşan ödemeler · 30 gün</SectionTitle>
          <Card className="mb-8 !py-1">
            {upcoming.map((e) => (
              <Row key={e.id} onClick={() => setForm(e)}
                title={`${dayMonth(e.dueDate)} · ${e.title}`}
                sub={<>{e.category}{e.isRecurring ? " · her ay" : ""}{new Date(e.dueDate).getTime() < new Date(nowIso).getTime() - 86_400_000 && <span className="text-[#f87171] font-semibold"> · Gecikmede</span>}</>}
                right={<div className="flex items-center gap-2"><Amount value={-e.amount} /><Btn small variant="ok" disabled={busy === e.id} onClick={() => markPaid(e)}>Ödendi</Btn></div>} />
            ))}
          </Card>
        </>
      )}

      <SectionTitle>İşlem geçmişi</SectionTitle>
      <Card className="!py-3">
        <div className="grid grid-cols-3 gap-1 p-1 rounded-xl mb-2" style={{ background: "var(--bg)" }}>
          {([["ALL", "Tümü"], ["IN", "Gelir"], ["OUT", "Gider"]] as const).map(([id, label]) => (
            <button key={id} onClick={() => setFilter(id)} className="rounded-lg py-2 text-[13px] font-semibold min-h-[38px]"
              style={filter === id ? { background: "var(--surface)", color: "var(--fg, #fff)", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" } : { color: "#8a8a9a" }}>
              {label}
            </button>
          ))}
        </div>
        {history.slice(0, 60).map((h) => (
          <Row key={h.id} onClick={h.entry ? () => editEntry(h.entry!) : undefined}
            title={`${dayMonth(h.date)} · ${h.title}`}
            sub={<>{h.chip && <Chip color="#c084fc">{h.chip}</Chip>} {h.clientName ? <ClientLink slug={h.clientSlug} name={h.clientName} /> : <span>{h.sub}</span>}</>}
            right={<Amount value={h.incoming ? h.amount : -h.amount} />} />
        ))}
        {history.length === 0 && <p className="text-[13px] text-[#8a8a9a] py-3">Kayıt yok.</p>}
      </Card>

      </>)}

      {/* ── Detay pencereleri ─────────────────────────────── */}
      {sheet?.kind === "borclar" && (
        <Modal title="Güncel Borçlarım" onClose={back}>
          <div className="flex justify-between items-center mb-4">
            <p className="text-[13px] text-[#8a8a9a]">Toplam</p>
            <p className="text-[20px] font-black text-[#f87171]">{fmtTL(k.debtTotal)}</p>
          </div>
          <SectionTitle>Kart & hesap borçları (harcamalar için dokun)</SectionTitle>
          <div className="rounded-2xl px-4 mb-5" style={{ background: "var(--bg)" }}>
            {k.debtCards.map((e) => (
              <Row key={e.id} onClick={() => open({ kind: "kart", entryId: e.id })}
                title={<>{e.title} <span className="text-[#8a8a9a]">›</span></>}
                sub={<span className="text-[15px] font-bold text-[#f87171]">{fmtTL(e.amount)}</span>}
                right={<Btn small variant="primary" onClick={() => setPayFor(e)}>Ödeme Yap</Btn>} />
            ))}
          </div>
          {k.installments.length > 0 && (
            <>
              <SectionTitle>Taksitli borçlar (detay için dokun)</SectionTitle>
              <div className="rounded-2xl px-4" style={{ background: "var(--bg)" }}>
                {k.installments.map((g) => (
                  <Row key={g.base} onClick={() => open({ kind: "taksit", base: g.base })}
                    title={g.base}
                    sub={<><Chip color="#60a5fa">{g.paidCount}/{g.total} Ödendi</Chip> <span>Kalan {g.remainingCount} taksit</span></>}
                    right={<span className="text-[15px] font-bold text-[#f87171]">{fmtTL(g.remainingAmount)} ›</span>} />
                ))}
              </div>
            </>
          )}
          <div className="flex justify-end mt-5"><Btn onClick={() => setForm({ direction: "BORC", status: "BEKLIYOR" })}>+ Borç ekle</Btn></div>
        </Modal>
      )}

      {sheet?.kind === "kart" && (() => {
        const card = entries.find((e) => e.id === sheet.entryId);
        if (!card) return null;
        const txs = cardTxs.filter((t) => t.entryId === card.id);
        return (
          <Modal title={card.title} onClose={back}>
            <div className="rounded-2xl px-4 py-4 mb-5 flex justify-between items-center" style={{ background: "var(--bg)" }}>
              <span className="text-[14px] text-[#8a8a9a]">Güncel kart borcu</span>
              <span className="text-[20px] font-black text-[#f87171]">{fmtTL(card.amount)}</span>
            </div>
            <SectionTitle>Eklenen harcamalar ({txs.length})</SectionTitle>
            <div className="rounded-2xl px-4 mb-5" style={{ background: "var(--bg)" }}>
              {txs.map((t) => (
                <Row key={t.id} onClick={() => setTxEdit(t)} title={t.title} sub={`${dayMonth(t.transactionDate)} · ${t.category} · düzenlemek için dokun`}
                  right={<span className="text-[14px] font-semibold text-white">{fmtTL(t.amount)}</span>} />
              ))}
              {txs.length === 0 && <p className="text-[13px] text-[#8a8a9a] py-3">Henüz harcama eklenmedi.</p>}
            </div>
            <div className="flex justify-end gap-2">
              <Btn onClick={() => setCardTxFor(card)}>+ Harcama</Btn>
              <Btn variant="primary" onClick={() => setPayFor(card)}>Ödeme Yap</Btn>
            </div>
          </Modal>
        );
      })()}

      {sheet?.kind === "taksit" && (() => {
        const g: InstallmentGroup | undefined = k.installments.find((x) => x.base === sheet.base);
        if (!g) return null;
        return (
          <Modal title={g.base} onClose={back}>
            <div className="grid grid-cols-2 gap-2 mb-5">
              <MiniStat label="Ödenen" value={`${g.paidCount}/${g.total} taksit`} color="#60a5fa" />
              <MiniStat label="Kalan" value={fmtTL(g.remainingAmount)} color="#f87171" />
            </div>
            <div className="rounded-2xl px-4" style={{ background: "var(--bg)" }}>
              {g.entries.map((e) => {
                const inst = parseInstallment(e.title);
                return (
                  <Row key={e.id} title={`${inst ? `${inst.index}. taksit` : e.title} · ${dayMonth(e.dueDate)}`}
                    sub={e.status === "ODENDI" ? <span className="text-[#34d399]">Ödendi</span> : <span className="text-[#fb923c]">Bekliyor</span>}
                    right={<div className="flex items-center gap-2"><Amount value={-e.amount} />{e.status === "BEKLIYOR" && <Btn small variant="ok" disabled={busy === e.id} onClick={() => markPaid(e)}>Ödendi</Btn>}</div>} />
                );
              })}
            </div>
          </Modal>
        );
      })()}

      {sheet?.kind === "tahsil" && (
        <Modal title="Tahsil Edilenler" onClose={back}>
          <p className="text-[13px] text-[#8a8a9a] mb-3">{monthName(k.month)} · toplam {fmtTL(k.collectedTotal)}</p>
          <div className="rounded-2xl px-4" style={{ background: "var(--bg)" }}>
            {[...k.collectedThisMonth].sort((a, b) => (b.paidAt ?? "").localeCompare(a.paidAt ?? "")).map((e) => (
              <Row key={e.id} onClick={() => setForm(e)} title={e.clientName ? <ClientLink slug={e.clientSlug} name={e.clientName} /> : e.title}
                sub={<>{e.clientName ? `${e.title.replace(e.clientName, "").trim()} · ` : ""}{e.paidAt && dayMonth(e.paidAt)} <Chip color="#34d399">Tahsil Edildi</Chip></>}
                right={<Amount value={e.amount} />} />
            ))}
          </div>
        </Modal>
      )}

      {sheet?.kind === "gider" && (
        <Modal title="Güncel Ay Giderler" onClose={back}>
          <p className="text-[13px] text-[#8a8a9a] mb-3">{monthName(k.month)} · toplam {fmtTL(k.monthExpenseTotal)}</p>
          <SectionTitle>Planlı / nakit giderler</SectionTitle>
          <div className="rounded-2xl px-4 mb-5" style={{ background: "var(--bg)" }}>
            {[...k.monthExpenses].sort((a, b) => b.dueDate.localeCompare(a.dueDate)).map((e) => (
              <Row key={e.id} onClick={() => setForm(e)} title={`${dayMonth(e.dueDate)} · ${e.title}`}
                sub={<><Chip color="#fb923c">Gider</Chip> {e.status === "ODENDI" ? <span>Ödendi</span> : <span className="text-[#f87171]">Bekliyor</span>}</>}
                right={<div className="flex items-center gap-2"><Amount value={-e.amount} />{e.status === "BEKLIYOR" && <Btn small variant="ok" disabled={busy === e.id} onClick={() => markPaid(e)}>Ödendi</Btn>}</div>} />
            ))}
          </div>
          <SectionTitle>Kredi kartı harcamaları</SectionTitle>
          <div className="rounded-2xl px-4" style={{ background: "var(--bg)" }}>
            {k.monthCardTxs.map((t) => (
              <Row key={t.id} title={`${dayMonth(t.transactionDate)} · ${t.title}`} sub={<><Chip color="#c084fc">{t.entryTitle}</Chip> {t.category}</>} right={<Amount value={-t.amount} />} />
            ))}
            {k.monthCardTxs.length === 0 && <p className="text-[13px] text-[#8a8a9a] py-3">Bu ay kart harcaması yok.</p>}
          </div>
        </Modal>
      )}

      {sheet?.kind === "alacak" && (
        <Modal title="Alacaklar" onClose={back}>
          <p className="text-[13px] text-[#8a8a9a] mb-3">Vadesi bu ay veya daha önce olan, henüz alınmamış ödemeler. Tüm bekleyen alacaklar: {fmtTL(k.pendingReceivablesAll)}</p>
          <div className="rounded-2xl px-4" style={{ background: "var(--bg)" }}>
            {k.openReceivables.map((e) => (
              <Row key={e.id} onClick={() => setForm(e)} title={e.clientName ? <ClientLink slug={e.clientSlug} name={e.clientName} /> : e.title}
                sub={<>{e.title} · {dayMonth(e.dueDate)} <Chip color="#fb923c">Bekliyor</Chip></>}
                right={<div className="flex items-center gap-2"><Amount value={e.amount} /><Btn small variant="primary" disabled={busy === e.id} onClick={() => markPaid(e)}>Alındı</Btn></div>} />
            ))}
            {k.openReceivables.length === 0 && <p className="text-[13px] text-[#8a8a9a] py-3">Bekleyen alacak yok.</p>}
          </div>
        </Modal>
      )}

      {sheet?.kind === "yatirim" && (
        <Modal title="Yatırım" onClose={back}>
          <div className="flex justify-between items-center mb-4">
            <p className="text-[13px] text-[#8a8a9a]">Toplam</p>
            <p className="text-[20px] font-black text-[#fbbf24]">{fmtTL(k.investmentTotal)}</p>
          </div>
          <div className="rounded-2xl px-4" style={{ background: "var(--bg)" }}>
            {k.investments.map((e) => (
              <Row key={e.id} onClick={() => setInvForm(e)} title={e.title}
                sub={<>{dayMonth(e.dueDate)} {e.status === "ODENDI" ? <Chip color="#22d3ee">Kasadan</Chip> : <Chip color="#8a8a9a">Kasa dışı</Chip>}</>}
                right={<span className="text-[15px] font-bold text-[#fbbf24]">{fmtTL(e.amount)}</span>} />
            ))}
            {k.investments.length === 0 && <p className="text-[13px] text-[#8a8a9a] py-3">Henüz yatırım eklenmedi.</p>}
          </div>
          <p className="text-[11px] text-[#8a8a9a] mt-3">Yatırım gider sayılmaz; ay giderine ve borçlara girmez. “Kasadan” işaretli olanlar Kasada Kalan’dan düşülür.</p>
          <div className="flex justify-end mt-4"><Btn variant="primary" onClick={() => setInvForm({})}>+ Yatırım ekle</Btn></div>
        </Modal>
      )}

      {sheet?.kind === "gecmis" && (
        <Modal title="Geçmiş Aylar" onClose={back}>
          <div className="rounded-2xl px-4" style={{ background: "var(--bg)" }}>
            {monthlyHistory(entries, cardTxs).filter((m) => m.key <= monthOf(nowIso)).map((m) => (
              <Row key={m.key} onClick={() => open({ kind: "ay", month: m.key })} title={<>{monthName(m.key)} <span className="text-[#8a8a9a]">›</span></>}
                sub={<><span className="text-[#34d399]">+{fmtTL(m.gelir)}</span> · <span className="text-[#f87171]">−{fmtTL(m.gider)}</span></>}
                right={<span className="text-[15px] font-bold" style={{ color: m.net >= 0 ? "#34d399" : "#f87171" }}>{fmtTL(m.net)}</span>} />
            ))}
          </div>
          <p className="text-[11px] text-[#8a8a9a] mt-3">Gelir: o ay tahsil edilenler. Gider: o ayın planlı giderleri + kart harcamaları. Ayrıntı için aya dokun.</p>
        </Modal>
      )}

      {sheet?.kind === "ay" && (() => {
        const mk = sheet.month;
        const incomes = entries.filter((e) => e.status === "ODENDI" && isIncoming(e.direction) && e.paidAt && monthOf(e.paidAt) === mk)
          .sort((a, b) => (b.paidAt ?? "").localeCompare(a.paidAt ?? ""));
        const expenses = entries.filter((e) => (e.direction === "BORC" || e.direction === "GIDER") && !isDebt(e) && e.category !== "borc_odemesi" && monthOf(e.dueDate) === mk)
          .sort((a, b) => b.dueDate.localeCompare(a.dueDate));
        const debtPayments = entries.filter((e) => e.category === "borc_odemesi" && e.paidAt && monthOf(e.paidAt) === mk);
        const txs = cardTxs.filter((t) => monthOf(t.transactionDate) === mk);
        const tot = (l: { amount: number }[]) => l.reduce((a, x) => a + x.amount, 0);
        return (
          <Modal title={monthName(mk)} onClose={back}>
            <div className="grid grid-cols-3 gap-2 mb-5">
              <MiniStat label="Gelir" value={fmtTL(tot(incomes))} color="#34d399" />
              <MiniStat label="Gider" value={fmtTL(tot(expenses) + tot(txs))} color="#f87171" />
              <MiniStat label="Net" value={fmtTL(tot(incomes) - tot(expenses) - tot(txs))} color="#c084fc" />
            </div>
            <SectionTitle>Tahsil edilenler ({incomes.length})</SectionTitle>
            <div className="rounded-2xl px-4 mb-5" style={{ background: "var(--bg)" }}>
              {incomes.map((e) => <Row key={e.id} onClick={() => setForm(e)} title={e.clientName ? <ClientLink slug={e.clientSlug} name={e.clientName} /> : e.title} sub={`${e.clientName ? `${e.title} · ` : ""}${dayMonth(e.paidAt!)}`} right={<Amount value={e.amount} />} />)}
              {!incomes.length && <p className="text-[13px] text-[#8a8a9a] py-3">Kayıt yok.</p>}
            </div>
            <SectionTitle>Giderler ({expenses.length})</SectionTitle>
            <div className="rounded-2xl px-4 mb-5" style={{ background: "var(--bg)" }}>
              {expenses.map((e) => (
                <Row key={e.id} onClick={() => setForm(e)} title={`${dayMonth(e.dueDate)} · ${e.title}`}
                  sub={<>{e.category} {e.status === "ODENDI" ? <span>· Ödendi</span> : <span className="text-[#f87171]">· Bekliyor</span>}</>}
                  right={<Amount value={-e.amount} />} />
              ))}
              {!expenses.length && <p className="text-[13px] text-[#8a8a9a] py-3">Kayıt yok.</p>}
            </div>
            <SectionTitle>Kart harcamaları ({txs.length})</SectionTitle>
            <div className="rounded-2xl px-4 mb-5" style={{ background: "var(--bg)" }}>
              {txs.map((t) => <Row key={t.id} title={`${dayMonth(t.transactionDate)} · ${t.title}`} sub={<><Chip color="#c084fc">{t.entryTitle}</Chip> {t.category}</>} right={<Amount value={-t.amount} />} />)}
              {!txs.length && <p className="text-[13px] text-[#8a8a9a] py-3">Kayıt yok.</p>}
            </div>
            {debtPayments.length > 0 && (
              <>
                <SectionTitle>Kart / hesap borcu ödemeleri</SectionTitle>
                <div className="rounded-2xl px-4" style={{ background: "var(--bg)" }}>
                  {debtPayments.map((e) => <Row key={e.id} title={e.title} sub={dayMonth(e.paidAt!)} right={<Amount value={-e.amount} />} />)}
                </div>
              </>
            )}
          </Modal>
        );
      })()}

      {form && (
        <EntryForm initial={form} clients={clients.map((c) => ({ id: c.id, name: c.active ? c.name : `${c.name} (pasif)` }))} employees={employees} busy={busy === "form"} onClose={() => setForm(null)}
          onDelete={form.id ? async () => {
            if (!confirm(`"${form.title}" çöp kutusuna taşınsın mı?`)) return;
            if (await run("form", () => agendaApi("DELETE", `kasa/${form.id}`))) setForm(null);
          } : undefined}
          onSave={async (body, installments) => {
            const ok = await run("form", () =>
              form.id ? agendaApi("PATCH", `kasa/${form.id}`, body)
              : installments ? agendaApi("POST", "installments", { title: body.title, amount: body.amount, count: installments, firstDueDate: body.dueDate, category: body.category, clientId: body.clientId })
              : agendaApi("POST", "kasa", body));
            if (ok) setForm(null);
          }} />
      )}
      {invForm && (
        <InvestmentForm initial={invForm} busy={busy === "inv"} onClose={() => setInvForm(null)}
          onDelete={invForm.id ? async () => {
            if (!confirm(`"${invForm.title}" çöp kutusuna taşınsın mı?`)) return;
            if (await run("inv", () => agendaApi("DELETE", `kasa/${invForm.id}`))) setInvForm(null);
          } : undefined}
          onSave={async (body) => {
            if (await run("inv", () => (invForm.id ? agendaApi("PATCH", `kasa/${invForm.id}`, body) : agendaApi("POST", "kasa", body)))) setInvForm(null);
          }} />
      )}
      {cardTxFor && (
        <AmountModal title={`${cardTxFor.title} — harcama ekle`} withTitle busy={busy === "cardtx"} onClose={() => setCardTxFor(null)}
          hint="Kart borcuna eklenir, kasadaki nakitten düşmez."
          onSave={async (amount, title) => {
            if (await run("cardtx", () => agendaApi("POST", "card-tx", { entryId: cardTxFor.id, title, amount }))) setCardTxFor(null);
          }} />
      )}
      {txEdit && (
        <TxEditModal tx={txEdit} cards={k.debtCards} busy={busy === "txedit"} onClose={() => setTxEdit(null)}
          onSave={async (body) => { if (await run("txedit", () => agendaApi("PATCH", `card-tx/${txEdit.id}`, body))) setTxEdit(null); }}
          onDelete={async () => {
            if (!confirm(`"${txEdit.title}" silinsin mi? Kart borcundan ${fmtTL(txEdit.amount)} düşülür (çöp kutusundan geri alınabilir).`)) return;
            if (await run("txedit", () => agendaApi("DELETE", `card-tx/${txEdit.id}`))) setTxEdit(null);
          }} />
      )}
      {payFor && (
        <AmountModal title={`${payFor.title} — ödeme`} busy={busy === "pay"} onClose={() => setPayFor(null)} defaultAmount={payFor.amount}
          hint="Borç bakiyesi düşer ve ödeme kasadan çıkış olarak yazılır."
          onSave={async (amount) => {
            if (await run("pay", () => agendaApi("PATCH", `kasa/${payFor.id}`, { action: "pay", amount }))) setPayFor(null);
          }} />
      )}
    </PanelShell>
  );
}

// ── Küçük parçalar ─────────────────────────────────────────
function Tile({ label, value, sub, color, onClick, wide }: { label: string; value: string; sub: string; color: string; onClick?: () => void; wide?: boolean }) {
  const body = (
    <>
      <p className="text-[12px] sm:text-[13px] font-semibold text-[#8a8a9a] mb-1">{label}</p>
      <p className="text-[18px] sm:text-[24px] font-black leading-tight" style={{ color }}>{value}</p>
      <p className="text-[11px] sm:text-[12px] text-[#8a8a9a] mt-1">{sub}</p>
    </>
  );
  const style = { background: `${color}12`, border: `1px solid ${color}33` };
  return onClick
    ? <button onClick={onClick} className={`rounded-2xl p-4 text-left transition-opacity hover:opacity-85 ${wide ? "col-span-2" : ""}`} style={style}>{body}</button>
    : <div className={`rounded-2xl p-4 ${wide ? "col-span-2" : ""}`} style={style}>{body}</div>;
}

function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl p-3" style={{ background: `${color}12`, border: `1px solid ${color}33` }}>
      <p className="text-[11px] text-[#8a8a9a]">{label}</p>
      <p className="text-[16px] font-black" style={{ color }}>{value}</p>
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <p className="text-[12px] font-bold uppercase tracking-wide text-[#8a8a9a] mb-2">{children}</p>;
}

function Amount({ value }: { value: number }) {
  return <span className="text-[14px] sm:text-[15px] font-bold whitespace-nowrap" style={{ color: value >= 0 ? "#34d399" : "var(--fg, #fff)" }}>{value >= 0 ? "+" : "−"}{fmtTL(Math.abs(value))}</span>;
}

function Row({ title, sub, right, onClick }: { title: ReactNode; sub?: ReactNode; right?: ReactNode; onClick?: () => void }) {
  return (
    <div className="flex items-center gap-3 py-3" style={{ borderTop: "1px solid var(--border)" }}>
      <div className={`flex-1 min-w-0 ${onClick ? "cursor-pointer" : ""}`} onClick={onClick}>
        <p className="text-[14px] font-semibold text-white">{title}</p>
        {sub && <div className="text-[12px] text-[#8a8a9a] mt-0.5 flex flex-wrap items-center gap-1">{sub}</div>}
      </div>
      {right && <div className="flex-shrink-0">{right}</div>}
    </div>
  );
}

function AmountModal({ title, hint, withTitle, defaultAmount, busy, onClose, onSave }: {
  title: string; hint: string; withTitle?: boolean; defaultAmount?: number; busy: boolean; onClose: () => void; onSave: (amount: string, title: string) => void;
}) {
  const [amount, setAmount] = useState(defaultAmount ? String(defaultAmount) : "");
  const [label, setLabel] = useState("");
  return (
    <Modal dismissable={false} title={title} onClose={onClose}>
      <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); onSave(amount, label.trim()); }}>
        {withTitle && <Field label="Açıklama"><input required value={label} onChange={(e) => setLabel(e.target.value)} className={inputCls} style={inputStyle} placeholder="Market" /></Field>}
        <Field label="Tutar (₺)"><input required inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputCls} style={inputStyle} /></Field>
        <p className="text-[11px] text-[#8a8a9a]">{hint}</p>
        <div className="flex justify-end gap-2 pt-2">
          <Btn onClick={onClose}>Vazgeç</Btn>
          <Btn type="submit" variant="primary" disabled={busy}>{busy ? "Kaydediliyor…" : "Kaydet"}</Btn>
        </div>
      </form>
    </Modal>
  );
}

function TxEditModal({ tx, cards, busy, onClose, onSave, onDelete }: {
  tx: KasaCalcCardTx; cards: KasaCalcEntry[]; busy: boolean; onClose: () => void;
  onSave: (b: Record<string, unknown>) => void; onDelete: () => void;
}) {
  const [title, setTitle] = useState(tx.title);
  const [amount, setAmount] = useState(String(tx.amount));
  const [entryId, setEntryId] = useState(tx.entryId);
  return (
    <Modal dismissable={false} title="Harcamayı düzenle" onClose={onClose}>
      <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); onSave({ title: title.trim(), amount, entryId }); }}>
        <Field label="Açıklama"><input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} style={inputStyle} /></Field>
        <Field label="Tutar (₺)"><input required inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputCls} style={inputStyle} /></Field>
        <Field label="Kart / hesap">
          <select value={entryId} onChange={(e) => setEntryId(e.target.value)} className={inputCls} style={inputStyle}>
            {cards.map((c) => <option key={c.id} value={c.id} style={{ background: "var(--surface)" }}>{c.title}</option>)}
          </select>
          <span className="block text-[11px] text-[#8a8a9a] mt-1">Başka kart seçersen harcama o karta taşınır; iki kartın bakiyesi de güncellenir.</span>
        </Field>
        <div className="flex justify-between gap-2 pt-2">
          <Btn variant="danger" onClick={onDelete}>Sil</Btn>
          <div className="flex gap-2">
            <Btn onClick={onClose}>Vazgeç</Btn>
            <Btn type="submit" variant="primary" disabled={busy}>{busy ? "Kaydediliyor…" : "Kaydet"}</Btn>
          </div>
        </div>
      </form>
    </Modal>
  );
}

function EntryForm({ initial, clients, employees, busy, onClose, onSave, onDelete }: {
  initial: Partial<KasaCalcEntry>; clients: { id: string; name: string }[]; employees: { id: string; name: string }[]; busy: boolean;
  onClose: () => void; onSave: (b: Record<string, unknown>, installments?: number) => void; onDelete?: () => void;
}) {
  const today = () => new Date().toLocaleDateString("en-CA", { timeZone: TZ });
  const [paidAt, setPaidAt] = useState(() => initial.paidAt ? new Date(initial.paidAt).toLocaleDateString("en-CA", { timeZone: TZ }) : today());
  const [installments, setInstallments] = useState("");
  const [direction, setDirection] = useState<KasaDirection>(initial.direction ?? "BORC");
  const [title, setTitle] = useState(initial.title ?? "");
  const [amount, setAmount] = useState(initial.amount !== undefined ? String(initial.amount) : "");
  const [category, setCategory] = useState(initial.category ?? "genel");
  const [dueDate, setDueDate] = useState(new Date(initial.dueDate ?? new Date().toISOString()).toLocaleDateString("en-CA", { timeZone: TZ }));
  const [status, setStatus] = useState(initial.status ?? "BEKLIYOR");
  const [isRecurring, setIsRecurring] = useState(initial.isRecurring ?? false);
  const [clientId, setClientId] = useState(() => initial.clientId ?? clients.find((c) => c.name === initial.clientName)?.id ?? "");
  const [employeeId, setEmployeeId] = useState(initial.employeeId ?? "");
  return (
    <Modal dismissable={false} title={initial.id ? "Kaydı düzenle" : "Yeni kasa kaydı"} onClose={onClose}>
      <form className="space-y-3" onSubmit={(e) => {
        e.preventDefault();
        onSave({
          direction, title: title.trim(), amount, category,
          dueDate: new Date(`${dueDate}T10:00:00+03:00`).toISOString(), status, isRecurring, clientId: clientId || null,
          employeeId: employeeId || null,
          // Ödeme / tahsilat tarihi: hangi aya sayılacağını bu belirler.
          ...(status === "ODENDI" ? { paidAt: new Date(`${paidAt}T10:00:00+03:00`).toISOString() } : {}),
        }, !initial.id && direction === "BORC" && Number(installments) >= 2 ? Number(installments) : undefined);
      }}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tür">
            <select value={direction} onChange={(e) => setDirection(e.target.value as KasaDirection)} className={inputCls} style={inputStyle}>
              {(Object.keys(DIR_LABEL) as KasaDirection[]).map((d) => <option key={d} value={d} style={{ background: "var(--surface)" }}>{DIR_LABEL[d]}</option>)}
            </select>
          </Field>
          <Field label="Durum">
            <select value={status} onChange={(e) => setStatus(e.target.value as "BEKLIYOR" | "ODENDI")} className={inputCls} style={inputStyle}>
              <option value="BEKLIYOR" style={{ background: "var(--surface)" }}>Bekliyor</option>
              <option value="ODENDI" style={{ background: "var(--surface)" }}>Ödendi / tahsil edildi</option>
            </select>
          </Field>
        </div>
        <Field label="Başlık"><input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} style={inputStyle} placeholder="Ev kirası" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tutar (₺)"><input required inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputCls} style={inputStyle} /></Field>
          <Field label="Vade"><input type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputCls} style={inputStyle} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Kategori">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls} style={inputStyle}>
              {[...new Set([category, ...CATEGORIES])].map((c) => <option key={c} value={c} style={{ background: "var(--surface)" }}>{c}</option>)}
            </select>
          </Field>
          <Field label="Firma">
            <select value={clientId} onChange={(e) => setClientId(e.target.value)} className={inputCls} style={inputStyle}>
              <option value="" style={{ background: "var(--surface)" }}>—</option>
              {clients.map((c) => <option key={c.id} value={c.id} style={{ background: "var(--surface)" }}>{c.name}</option>)}
            </select>
          </Field>
        </div>
        {(direction === "BORC" || direction === "GIDER") && employees.length > 0 && (
          <Field label="Çalışan (maaş / avans ise)">
            <select value={employeeId} onChange={(e) => {
              setEmployeeId(e.target.value);
              if (e.target.value && category === "genel") setCategory("Maaş");
            }} className={inputCls} style={inputStyle}>
              <option value="" style={{ background: "var(--surface)" }}>—</option>
              {employees.map((u) => <option key={u.id} value={u.id} style={{ background: "var(--surface)" }}>{u.name}</option>)}
            </select>
            <span className="block text-[11px] text-[#8a8a9a] mt-1">Seçilirse çalışan bu ödemeyi kendi panelinde görür (değiştiremez).</span>
          </Field>
        )}
        {status === "ODENDI" && (
          <Field label={direction === "ALACAK" || direction === "GELIR" ? "Tahsil tarihi" : "Ödeme tarihi"}>
            <input type="date" required value={paidAt} max={today()} onChange={(e) => setPaidAt(e.target.value)} className={inputCls} style={inputStyle} />
            <span className="block text-[11px] text-[#8a8a9a] mt-1">Kayıt bu tarihin ayına sayılır.</span>
          </Field>
        )}
        {!initial.id && direction === "BORC" && !isRecurring && (
          <Field label="Taksit sayısı (opsiyonel)">
            <input type="number" min={2} max={60} value={installments} onChange={(e) => setInstallments(e.target.value)} className={inputCls} style={inputStyle} placeholder="Tek seferlikse boş bırak" />
            <span className="block text-[11px] text-[#8a8a9a] mt-1">Girilirse tutar taksit tutarıdır; vade ilk taksitin günü olur, her ay bir taksit açılır.</span>
          </Field>
        )}
        <label className="flex items-center gap-2 text-[13px] text-[#c8c8d0]"><input type="checkbox" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} /> Her ay tekrar eder (ödenince sonraki ayın kaydı açılır)</label>
        <div className="flex justify-between gap-2 pt-2">
          {onDelete ? <Btn variant="danger" onClick={onDelete}>Sil</Btn> : <span />}
          <div className="flex gap-2">
            <Btn onClick={onClose}>Vazgeç</Btn>
            <Btn type="submit" variant="primary" disabled={busy}>{busy ? "Kaydediliyor…" : "Kaydet"}</Btn>
          </div>
        </div>
      </form>
    </Modal>
  );
}

// ── Yatırım kaydı (v3.16.0) ─────────────────────────────────
// KasaEntry'de category "yatirim": ODENDI = kasadan çıktı (nakitten düşer), BEKLIYOR = kasa dışı kaynak.
function InvestmentForm({ initial, busy, onClose, onSave, onDelete }: {
  initial: Partial<KasaCalcEntry>; busy: boolean; onClose: () => void; onSave: (b: Record<string, unknown>) => void; onDelete?: () => void;
}) {
  const ymd = (iso?: string) => (iso ? new Date(iso) : new Date()).toLocaleDateString("en-CA", { timeZone: TZ });
  const [title, setTitle] = useState(initial.title ?? "");
  const [amount, setAmount] = useState(initial.amount !== undefined ? String(initial.amount) : "");
  const [date, setDate] = useState(ymd(initial.dueDate));
  const [fromCash, setFromCash] = useState(initial.status === "ODENDI");
  return (
    <Modal dismissable={false} title={initial.id ? "Yatırımı düzenle" : "Yeni yatırım"} onClose={onClose}>
      <form className="space-y-3" onSubmit={(e) => {
        e.preventDefault();
        const iso = new Date(`${date}T10:00:00+03:00`).toISOString();
        onSave({
          direction: "GIDER", category: INVESTMENT_CATEGORY, title: title.trim(), amount, dueDate: iso, isRecurring: false,
          status: fromCash ? "ODENDI" : "BEKLIYOR", ...(fromCash ? { paidAt: iso } : {}),
        });
      }}>
        <Field label="Başlık"><input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} style={inputStyle} placeholder="Altın, fon, döviz…" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tutar (₺)"><input required inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputCls} style={inputStyle} /></Field>
          <Field label="Tarih"><input type="date" required value={date} max={fromCash ? ymd() : undefined} onChange={(e) => setDate(e.target.value)} className={inputCls} style={inputStyle} /></Field>
        </div>
        <label className="flex items-start gap-2 text-[13px] text-[#c8c8d0]">
          <input type="checkbox" className="mt-0.5" checked={fromCash} onChange={(e) => setFromCash(e.target.checked)} />
          <span>Kasadan düş<span className="block text-[11px] text-[#8a8a9a]">İşaretlenirse bu tutar Kasada Kalan’dan çıkar. İşaretlenmezse yalnızca Yatırım toplamında görünür.</span></span>
        </label>
        <div className="flex justify-between gap-2 pt-2">
          {onDelete ? <Btn variant="danger" onClick={onDelete}>Sil</Btn> : <span />}
          <div className="flex gap-2">
            <Btn onClick={onClose}>Vazgeç</Btn>
            <Btn type="submit" variant="primary" disabled={busy}>{busy ? "Kaydediliyor…" : "Kaydet"}</Btn>
          </div>
        </div>
      </form>
    </Modal>
  );
}

// ── Müşteri Ödemeleri sekmesi (v3.6.0: yıllık tablo) ─────────────────────────
// Satır = firma, sütun = ay. Hücre rengi o ayın durumunu gösterir; tıklayınca o ayın
// kayıtları açılır (Alındı / Düzenle). Yıl değiştikçe ekran boyu sabit kalır.
const MONTHS_SHORT = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
const STAGE_RANK: Record<string, number> = { GECIKMEDI: 0, BEKLIYOR: 1, GUNU_GELMEDI: 2, ODENDI: 3 };
const fmtK = (n: number) => (n >= 1000 ? `${Math.round(n / 100) / 10}`.replace(".", ",") + "K" : String(n));

function ClientPaymentsTab({ entries, clients, nowIso, busy, onPaid, onEdit, onAdd }: {
  entries: KasaCalcEntry[]; clients: FinansClient[]; nowIso: string; busy: string | null;
  onPaid: (e: KasaCalcEntry) => void; onEdit: (e: KasaCalcEntry) => void; onAdd: (c: FinansClient, monthKey?: string) => void;
}) {
  const now = new Date(nowIso);
  const thisMonth = monthOf(nowIso);
  const payments = entries.filter((e) => e.category === "Müşteri Ödemesi" && isIncoming(e.direction) && e.clientId);
  const years = [...new Set([thisMonth.slice(0, 4), ...payments.map((e) => monthOf(e.dueDate).slice(0, 4))])].sort();
  const [year, setYear] = useState(thisMonth.slice(0, 4));
  const [cell, setCell] = useState<{ client: FinansClient; month: string } | null>(null);
  // Tablo dar ekranda yatay kayar — açılışta güncel ay görünsün diye o sütuna kaydırılır.
  const tableRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = tableRef.current;
    if (!el) return;
    const target = el.querySelector<HTMLElement>("[data-current-month]");
    el.scrollLeft = target ? Math.max(0, target.offsetLeft - el.clientWidth / 2) : 0;
  }, [year]);

  const graceOf = (cid: string | null) => clients.find((c) => c.id === cid)?.graceDays ?? 7;
  const stageOf = (e: KasaCalcEntry) =>
    getInvoiceStage({ status: e.status === "ODENDI" ? "ODENDI" : "BEKLIYOR", dueDate: new Date(e.dueDate) }, now, graceOf(e.clientId));
  const monthKeyOf = (e: KasaCalcEntry) => monthOf(e.dueDate);

  const yearPayments = payments.filter((e) => monthKeyOf(e).startsWith(year));
  const sum = (l: KasaCalcEntry[]) => l.reduce((a, e) => a + e.amount, 0);
  const due = yearPayments.filter((e) => monthKeyOf(e) <= thisMonth);
  const collected = sum(yearPayments.filter((e) => e.status === "ODENDI"));
  const actionable = payments
    .filter((e) => e.status === "BEKLIYOR" && ["GECIKMEDI", "BEKLIYOR"].includes(stageOf(e)))
    .sort((a, b) => STAGE_RANK[stageOf(a)] - STAGE_RANK[stageOf(b)] || a.dueDate.localeCompare(b.dueDate));

  // Tabloda: aktif firmalar + o yıl kaydı olan (arşivlenmiş olsa bile) firmalar
  // Aktif ve ücretli firmalar + o yıl ödemesi olan her firma (pasifler dahil).
  const rowClients = clients.filter((c) => (c.active && c.fee > 0) || yearPayments.some((e) => e.clientId === c.id));

  const cellEntries = cell ? payments.filter((e) => e.clientId === cell.client.id && monthKeyOf(e) === cell.month) : [];

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-1">
          <Btn small disabled={years.indexOf(year) <= 0} onClick={() => setYear(years[years.indexOf(year) - 1])}>‹</Btn>
          <span className="text-[17px] font-black text-white px-3">{year}</span>
          <Btn small disabled={years.indexOf(year) >= years.length - 1} onClick={() => setYear(years[years.indexOf(year) + 1])}>›</Btn>
        </div>
        <p className="text-[11px] text-[#8a8a9a] text-right">Hücreye dokun → o ayın ödemesi<span className="sm:hidden"> · tabloyu yana kaydır</span></p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <MiniStat label={`${year} vadesi gelen`} value={fmtTL(sum(due))} color="#60a5fa" />
        <MiniStat label="Tahsil edilen" value={fmtTL(collected)} color="#34d399" />
        <MiniStat label="Gelecek aylar" value={fmtTL(sum(yearPayments.filter((e) => monthKeyOf(e) > thisMonth)))} color="#8a8a9a" />
        <MiniStat label="Bekleyen / gecikmede" value={`${actionable.length} · ${fmtTL(sum(actionable))}`} color={actionable.length ? "#f87171" : "#34d399"} />
      </div>

      {actionable.length > 0 && (
        <Card className="mb-5 !py-2" tone="#f87171">
          <p className="text-[12px] font-bold uppercase tracking-wide text-[#f87171] pt-1.5 pb-1">Tahsil edilmesi gerekenler</p>
          {actionable.map((e) => {
            const st = stageOf(e);
            return (
              <div key={e.id} className="flex flex-wrap items-center gap-2 py-2" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="flex-1 min-w-[150px]">
                  <span className="text-[13px]">{e.clientName && <ClientLink slug={e.clientSlug} name={e.clientName} />}</span>
                  <button onClick={() => onEdit(e)} className="block text-left text-[11px] text-[#8a8a9a] hover:underline">{e.title} · vade {dayMonth(e.dueDate)}</button>
                </div>
                <Chip color={INVOICE_STAGE_COLOR[st]}>{INVOICE_STAGE_LABEL[st]}</Chip>
                <span className="text-[14px] font-bold text-white whitespace-nowrap">{fmtTL(e.amount)}</span>
                <Btn small variant="primary" disabled={busy === e.id} onClick={() => onPaid(e)}>Alındı</Btn>
              </div>
            );
          })}
        </Card>
      )}

      <div ref={tableRef} className="rounded-2xl overflow-x-auto" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <table className="w-full text-[12px] border-collapse" style={{ minWidth: 760 }}>
          <thead>
            <tr>
              <th className="sticky left-0 z-10 text-left px-3 py-2.5 font-semibold text-[#8a8a9a]" style={{ background: "var(--surface)" }}>Firma</th>
              {MONTHS_SHORT.map((m, i) => {
                const key = `${year}-${String(i + 1).padStart(2, "0")}`;
                return <th key={m} data-current-month={key === thisMonth ? "" : undefined} className="px-1 py-2.5 font-semibold text-center" style={{ color: key === thisMonth ? "#c084fc" : "#8a8a9a" }}>{m}</th>;
              })}
              <th className="px-3 py-2.5 font-semibold text-right text-[#8a8a9a]">Alınan</th>
            </tr>
          </thead>
          <tbody>
            {rowClients.map((c) => {
              const mine = yearPayments.filter((e) => e.clientId === c.id);
              return (
                <tr key={c.id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td className="sticky left-0 z-10 px-3 py-2" style={{ background: "var(--surface)" }}>
                    <Link href={`/musteri/admin/${c.slug}`} className="block max-w-[112px] sm:max-w-none truncate font-semibold text-white hover:underline whitespace-nowrap">{c.name}</Link>
                    <span className="block max-w-[112px] sm:max-w-none truncate text-[10px] text-[#8a8a9a] whitespace-nowrap">
                      {!c.active ? "Pasif firma" : c.fee ? `${fmtTL(c.fee)} · ${c.paymentDays.length ? `ayın ${c.paymentDays.join(" ve ")}. günü` : "gün yok"}` : "ücret yok"}
                    </span>
                  </td>
                  {MONTHS_SHORT.map((m, i) => {
                    const key = `${year}-${String(i + 1).padStart(2, "0")}`;
                    const list = mine.filter((e) => monthKeyOf(e) === key);
                    if (!list.length) {
                      return (
                        <td key={m} className="px-1 py-2 text-center">
                          <button onClick={() => setCell({ client: c, month: key })} className="w-full min-w-[40px] h-10 sm:h-8 rounded-lg text-[#555] hover:bg-[rgba(168,85,247,0.08)]">·</button>
                        </td>
                      );
                    }
                    const worst = list.map(stageOf).sort((a, b) => STAGE_RANK[a] - STAGE_RANK[b])[0];
                    const color = INVOICE_STAGE_COLOR[worst];
                    return (
                      <td key={m} className="px-1 py-2 text-center">
                        <button onClick={() => setCell({ client: c, month: key })} title={INVOICE_STAGE_LABEL[worst]}
                          className="w-full min-w-[40px] h-10 sm:h-8 rounded-lg font-bold text-[11px]"
                          style={{ background: `${color}22`, color, border: `1px solid ${color}55` }}>
                          {fmtK(sum(list))}
                        </button>
                      </td>
                    );
                  })}
                  <td className="px-3 py-2 text-right font-bold text-[#34d399] whitespace-nowrap">{fmtTL(sum(mine.filter((e) => e.status === "ODENDI")))}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap gap-3 mt-3 text-[11px] text-[#8a8a9a]">
        {(["ODENDI", "BEKLIYOR", "GECIKMEDI", "GUNU_GELMEDI"] as const).map((st) => (
          <span key={st} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: INVOICE_STAGE_COLOR[st] }} />{INVOICE_STAGE_LABEL[st]}
          </span>
        ))}
        <span>· Aylık alacaklar ücret + ödeme gününden otomatik açılır; &ldquo;Alındı&rdquo; müşteri panelinde anında &ldquo;Ödendi&rdquo; olur.</span>
      </div>

      {cell && (
        <Modal title={`${cell.client.name} · ${monthName(cell.month)}`} onClose={() => setCell(null)}>
          <div className="rounded-2xl px-4 mb-4" style={{ background: "var(--bg)" }}>
            {cellEntries.map((e) => {
              const st = stageOf(e);
              return (
                <Row key={e.id} onClick={() => { setCell(null); onEdit(e); }} title={e.title}
                  sub={<>vade {dayMonth(e.dueDate)}{e.paidAt ? ` · alındı ${dayMonth(e.paidAt)}` : ""} <Chip color={INVOICE_STAGE_COLOR[st]}>{INVOICE_STAGE_LABEL[st]}</Chip></>}
                  right={<div className="flex items-center gap-2"><Amount value={e.amount} />{e.status === "BEKLIYOR" && <Btn small variant="primary" disabled={busy === e.id} onClick={() => onPaid(e)}>Alındı</Btn>}</div>} />
              );
            })}
            {cellEntries.length === 0 && <p className="text-[13px] text-[#8a8a9a] py-3">Bu ay için kayıt yok.</p>}
          </div>
          <div className="flex justify-end"><Btn onClick={() => { setCell(null); onAdd(cell.client, cell.month); }}>+ Ödeme ekle</Btn></div>
        </Modal>
      )}
    </div>
  );
}
