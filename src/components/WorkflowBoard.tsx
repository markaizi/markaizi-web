"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type Priority = "DUSUK" | "ORTA" | "YUKSEK";

interface CardData {
  id: string;
  columnId: string;
  title: string;
  description: string | null;
  revisionNote: string | null;
  priority: Priority;
  dueDate: string | null;
  sortOrder: number;
  assignee: { id: string; name: string } | null;
  creator: { id: string; name: string };
  client: { slug: string; name: string } | null;
  contentItem: { id: string; scheduledDate: string } | null;
}

interface ColumnData {
  id: string;
  title: string;
  sortOrder: number;
  triggersWorkLog: boolean;
  triggersContentItem: boolean;
  adminOnly: boolean;
  hiddenFromEmployees: boolean;
  cards: CardData[];
}

interface PersonOption { id: string; name: string; }
interface ClientOption { id: string; slug: string; name: string; }

const PRIORITY_LABEL: Record<Priority, string> = { DUSUK: "Düşük", ORTA: "Orta", YUKSEK: "Yüksek" };
const PRIORITY_COLOR: Record<Priority, string> = { DUSUK: "#34d399", ORTA: "#60a5fa", YUKSEK: "#f87171" };

function fmtDate(d: string) {
  const dt = new Date(d + "T00:00:00");
  return dt.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}

// Basılı tutma ile sürükleme başlatma eşikleri
const TOUCH_LONG_PRESS_MS = 380;
const TOUCH_CANCEL_DIST = 10; // bu kadar erken hareket ederse kaydırma niyeti sayılır
const MOUSE_DRAG_DIST = 4;

interface PressState {
  id: string;
  pointerId: number;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  pointerType: string;
  dragging: boolean;
  scrolling: boolean;
  timer: number | null;
  target: HTMLElement;
  scrollEl: HTMLElement | null;
}

interface BoardInitialData {
  columns: ColumnData[];
  employees: PersonOption[];
  clients: ClientOption[];
  currentUserId: string;
  isAdmin: boolean;
  canCreateCards: boolean;
  canDragCards: boolean;
  canWriteRevisionNote: boolean;
  canDeleteAnyCard: boolean;
  canManageColumns: boolean;
}

export default function WorkflowBoard({ initialData }: { initialData?: BoardInitialData }) {
  const [columns, setColumns] = useState<ColumnData[]>(initialData?.columns ?? []);
  const [employees, setEmployees] = useState<PersonOption[]>(initialData?.employees ?? []);
  const [clients, setClients] = useState<ClientOption[]>(initialData?.clients ?? []);
  const [currentUserId, setCurrentUserId] = useState(initialData?.currentUserId ?? "");
  const [isAdmin, setIsAdmin] = useState(initialData?.isAdmin ?? false);
  const [canCreateCards, setCanCreateCards] = useState(initialData?.canCreateCards ?? true);
  const [canDragCards, setCanDragCards] = useState(initialData?.canDragCards ?? true);
  const [canWriteRevisionNote, setCanWriteRevisionNote] = useState(initialData?.canWriteRevisionNote ?? false);
  const [canDeleteAnyCard, setCanDeleteAnyCard] = useState(initialData?.canDeleteAnyCard ?? false);
  const [canManageColumns, setCanManageColumns] = useState(initialData?.canManageColumns ?? false);
  const [loading, setLoading] = useState(!initialData);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [modal, setModal] = useState<{ mode: "create" | "edit"; columnId?: string; card?: CardData } | null>(null);
  const [addingColumn, setAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [renamingCol, setRenamingCol] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [colError, setColError] = useState("");
  const [showArchive, setShowArchive] = useState(false);

  // ── Sürükleme: mouse'ta anında, dokunmada basılı tutunca (Pointer Events) ──
  const [dragCardId, setDragCardId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const pressRef = useRef<PressState | null>(null);
  const dragOverColRef = useRef<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.userSelect = dragCardId ? "none" : "";
    return () => { document.body.style.userSelect = ""; };
  }, [dragCardId]);

  const load = useCallback(async () => {
    setLoadError(null);
    const res = await fetch("/api/musteri/is-akisi/board");
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setLoadError(body.error ?? "Pano yüklenemedi.");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setColumns(data.columns);
    setEmployees(data.employees);
    setClients(data.clients);
    setCurrentUserId(data.currentUserId);
    setIsAdmin(data.isAdmin);
    setCanCreateCards(data.canCreateCards);
    setCanDragCards(data.canDragCards);
    setCanWriteRevisionNote(data.canWriteRevisionNote);
    setCanDeleteAnyCard(data.canDeleteAnyCard);
    setCanManageColumns(data.canManageColumns);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!initialData) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load]);

  async function handleMoveCard(cardId: string, targetColumnId: string) {
    const card = columns.flatMap((c) => c.cards).find((c) => c.id === cardId);
    if (!card || card.columnId === targetColumnId) return;
    const targetCol = columns.find((c) => c.id === targetColumnId);
    if (!isAdmin && targetCol?.adminOnly) return; // sadece admin bu sütuna kart taşıyabilir
    const prevColumnId = card.columnId;

    // İyimser güncelleme
    setColumns((prev) => {
      const moved = { ...card, columnId: targetColumnId };
      return prev.map((col) => {
        if (col.id === prevColumnId) return { ...col, cards: col.cards.filter((c) => c.id !== cardId) };
        if (col.id === targetColumnId) return { ...col, cards: [...col.cards, moved] };
        return col;
      });
    });

    const res = await fetch(`/api/musteri/is-akisi/cards/${cardId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ columnId: targetColumnId }),
    });
    if (!res.ok) load(); // başarısızsa sunucudan tazele
  }

  function autoScrollBoard(clientX: number) {
    const el = boardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const edge = 56;
    if (clientX < rect.left + edge) el.scrollLeft -= 18;
    else if (clientX > rect.right - edge) el.scrollLeft += 18;
  }

  function activateDrag() {
    const p = pressRef.current;
    if (!p) return;
    p.dragging = true;
    try { p.target.setPointerCapture(p.pointerId); } catch { /* zaten yakalanmış olabilir */ }
    dragOverColRef.current = null;
    setDragCardId(p.id);
    setDragPos({ x: p.startX, y: p.startY });
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(12);
  }

  // Mouse: karta basar basmaz sürüklemeye hazır olur, birkaç piksel hareketle sürükleme başlar (eskisi gibi).
  // Dokunma: touch-action:none ile tarayıcının kendi kaydırma/iptal yarışına girmesini engelliyoruz.
  // Karta basılı tutulursa (erken hareket yoksa) sürükleme moduna geçer; erken hareket olursa
  // bunu kaydırma niyeti sayıp listeyi kendimiz (elle) kaydırıyoruz.
  function onCardPointerDown(e: React.PointerEvent<HTMLDivElement>, card: CardData) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const scrollEl = (e.currentTarget as HTMLElement).closest(".wf-cards-scroll") as HTMLElement | null;
    pressRef.current = {
      id: card.id,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      pointerType: e.pointerType,
      dragging: false,
      scrolling: false,
      timer: null,
      target: e.currentTarget,
      scrollEl,
    };
    if (e.pointerType !== "mouse") {
      pressRef.current.timer = window.setTimeout(() => {
        if (pressRef.current?.id === card.id && !pressRef.current.dragging && !pressRef.current.scrolling) {
          activateDrag();
        }
      }, TOUCH_LONG_PRESS_MS);
    }
  }

  function onCardPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const p = pressRef.current;
    if (!p) return;

    // Kaydırma moduna geçmişse: native touch-action kapalı olduğu için listeyi elle kaydırıyoruz
    if (p.scrolling) {
      if (p.scrollEl) p.scrollEl.scrollTop -= e.clientY - p.lastY;
      if (boardRef.current) boardRef.current.scrollLeft -= e.clientX - p.lastX;
      p.lastX = e.clientX;
      p.lastY = e.clientY;
      return;
    }

    if (!p.dragging) {
      const dist = Math.hypot(e.clientX - p.startX, e.clientY - p.startY);
      if (p.pointerType === "mouse") {
        if (dist <= MOUSE_DRAG_DIST) return;
        activateDrag();
      } else {
        if (dist > TOUCH_CANCEL_DIST) {
          if (p.timer) window.clearTimeout(p.timer);
          p.scrolling = true;
          p.lastX = e.clientX;
          p.lastY = e.clientY;
        }
        return; // dokunmada sürükleme sadece uzun basışla başlar
      }
    }

    setDragPos({ x: e.clientX, y: e.clientY });
    autoScrollBoard(e.clientX);
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const colEl = el?.closest("[data-column-id]") as HTMLElement | null;
    const colId = colEl?.getAttribute("data-column-id") ?? null;
    dragOverColRef.current = colId;
    setDragOverCol(colId);
  }

  function onCardPointerUp(e: React.PointerEvent<HTMLDivElement>, card: CardData) {
    const p = pressRef.current;
    if (p?.timer) window.clearTimeout(p.timer);
    pressRef.current = null;
    if (p?.dragging) {
      if (dragOverColRef.current) handleMoveCard(p.id, dragOverColRef.current);
      dragOverColRef.current = null;
      setDragCardId(null);
      setDragPos(null);
      setDragOverCol(null);
    } else if (p && !p.scrolling) {
      // Sürükleme/kaydırma olmadı → tıklama/dokunma sayılır, kartı aç
      setModal({ mode: "edit", card });
    }
  }

  function onCardPointerCancel() {
    const p = pressRef.current;
    if (p?.timer) window.clearTimeout(p.timer);
    pressRef.current = null;
    setDragCardId(null);
    setDragPos(null);
    setDragOverCol(null);
  }

  function handleSaved(card: CardData) {
    setColumns((prev) => {
      const exists = prev.some((col) => col.cards.some((c) => c.id === card.id));
      if (exists) {
        return prev.map((col) => ({
          ...col,
          cards: col.id === card.columnId
            ? [...col.cards.filter((c) => c.id !== card.id), card]
            : col.cards.filter((c) => c.id !== card.id),
        }));
      }
      return prev.map((col) => (col.id === card.columnId ? { ...col, cards: [...col.cards, card] } : col));
    });
    setModal(null);
  }

  function handleDeleted(cardId: string) {
    setColumns((prev) => prev.map((col) => ({ ...col, cards: col.cards.filter((c) => c.id !== cardId) })));
    setModal(null);
  }

  async function handleAddColumn() {
    const title = newColumnTitle.trim();
    if (!title) return;
    const res = await fetch("/api/musteri/is-akisi/columns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (res.ok) {
      const data = await res.json();
      setColumns((prev) => [...prev, data.column]);
      setNewColumnTitle("");
      setAddingColumn(false);
    }
  }

  async function handleRenameColumn(id: string) {
    const title = renameValue.trim();
    if (!title) { setRenamingCol(null); return; }
    setColumns((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));
    setRenamingCol(null);
    await fetch(`/api/musteri/is-akisi/columns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
  }

  async function handleDeleteColumn(id: string) {
    setColError("");
    const res = await fetch(`/api/musteri/is-akisi/columns/${id}`, { method: "DELETE" });
    if (res.ok) {
      setColumns((prev) => prev.filter((c) => c.id !== id));
    } else {
      const data = await res.json().catch(() => ({}));
      setColError(data.error ?? "Sütun silinemedi.");
      setTimeout(() => setColError(""), 4000);
    }
  }

  async function handleToggleTrigger(id: string, next: boolean) {
    setColumns((prev) => prev.map((c) => (c.id === id ? { ...c, triggersWorkLog: next } : c)));
    await fetch(`/api/musteri/is-akisi/columns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ triggersWorkLog: next }),
    });
  }

  async function handleToggleContentTrigger(id: string, next: boolean) {
    setColumns((prev) => prev.map((c) => (c.id === id ? { ...c, triggersContentItem: next } : c)));
    await fetch(`/api/musteri/is-akisi/columns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ triggersContentItem: next }),
    });
  }

  function handleContentLinked(cardId: string, contentItem: { id: string; scheduledDate: string }) {
    setColumns((prev) => prev.map((col) => ({
      ...col,
      cards: col.cards.map((c) => (c.id === cardId ? { ...c, contentItem } : c)),
    })));
  }

  async function handleToggleAdminOnly(id: string, next: boolean) {
    setColumns((prev) => prev.map((c) => (c.id === id ? { ...c, adminOnly: next } : c)));
    await fetch(`/api/musteri/is-akisi/columns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminOnly: next }),
    });
  }

  async function handleToggleHidden(id: string, next: boolean) {
    setColumns((prev) => prev.map((c) => (c.id === id ? { ...c, hiddenFromEmployees: next } : c)));
    await fetch(`/api/musteri/is-akisi/columns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hiddenFromEmployees: next }),
    });
  }

  function handleMoveColumn(id: string, direction: "left" | "right") {
    setColumns((prev) => {
      const idx = prev.findIndex((c) => c.id === id);
      const swapIdx = direction === "left" ? idx - 1 : idx + 1;
      if (idx === -1 || swapIdx < 0 || swapIdx >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
      // Mevcut sortOrder değerleri dizi index'leriyle birebir örtüşmeyebilir (sütun
      // silindiğinde boşluk kalır) — çakışmayı önlemek için TÜM sütunları yeni index'lerine
      // göre yeniden numaralandırıyoruz, sadece yer değiştiren ikiliyi değil.
      next.forEach((col, i) => {
        if (col.sortOrder !== i) {
          fetch(`/api/musteri/is-akisi/columns/${col.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sortOrder: i }),
          });
        }
      });
      return next.map((col, i) => ({ ...col, sortOrder: i }));
    });
  }

  if (loading) {
    return <div className="py-20 text-center text-[#8a8a9a] text-[14px]">Yükleniyor...</div>;
  }

  if (loadError) {
    return (
      <div className="py-20 text-center">
        <p className="text-[14px] mb-4" style={{ color: "#f87171" }}>{loadError}</p>
        <button onClick={() => { setLoading(true); load(); }} className="btn btn-outline text-sm px-5 py-2">
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <div>
      {colError && (
        <div className="mb-4 px-4 py-2.5 rounded-xl text-[13px]" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)", color: "#f87171" }}>
          {colError}
        </div>
      )}

      {canCreateCards && (
        <div className="flex justify-end mb-3">
          <button
            onClick={() => setShowArchive(true)}
            className="text-[12px] font-semibold text-[#8a8a9a] hover:text-[#c084fc] transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2">
              <path d="M3 7h18M5 7l1 13a1 1 0 001 1h10a1 1 0 001-1l1-13M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Arşiv
          </button>
        </div>
      )}

      <div
        ref={boardRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory sm:snap-none"
        style={{ scrollbarWidth: "thin" }}
      >
        {columns.map((col, colIdx) => {
          const isDragTarget = dragOverCol === col.id && dragCardId !== null;
          const locked = !isAdmin && col.adminOnly;
          return (
            <div
              key={col.id}
              data-column-id={col.id}
              className="flex-shrink-0 w-[82vw] max-w-[320px] sm:w-auto sm:flex-1 sm:min-w-[280px] sm:max-w-[420px] snap-center max-h-[calc(100vh-235px)] sm:max-h-[calc(100vh-210px)] rounded-2xl flex flex-col"
              style={{
                background: isDragTarget ? "rgba(168,85,247,0.06)" : "var(--surface)",
                border: `1px solid ${isDragTarget ? "rgba(168,85,247,0.4)" : "var(--border)"}`,
                transition: "background 0.15s, border-color 0.15s",
              }}
            >
              {/* Sütun başlığı */}
              <div className="flex items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3" style={{ borderBottom: "1px solid var(--border)" }}>
                {renamingCol === col.id ? (
                  <input
                    autoFocus
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={() => handleRenameColumn(col.id)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleRenameColumn(col.id); if (e.key === "Escape") setRenamingCol(null); }}
                    className="flex-1 min-w-0 px-2 py-1 rounded-lg text-[13px] font-bold text-white outline-none"
                    style={{ background: "var(--bg)", border: "1px solid rgba(168,85,247,0.4)" }}
                  />
                ) : (
                  <button
                    disabled={!canManageColumns}
                    onClick={() => { setRenamingCol(col.id); setRenameValue(col.title); }}
                    className="text-[13px] font-bold text-white truncate text-left"
                    style={{ cursor: canManageColumns ? "text" : "default" }}
                  >
                    {col.title}
                  </button>
                )}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="text-[11px] font-semibold text-[#8a8a9a] px-2 py-0.5 rounded-full mr-0.5" style={{ background: "var(--bg)" }}>
                    {col.cards.length}
                  </span>
                  {col.adminOnly && !isAdmin && (
                    <span
                      title="Bu sütuna yalnızca admin kart taşıyabilir ve buradaki kartlara yalnızca admin dokunabilir"
                      className="w-6 h-6 flex items-center justify-center text-[#c084fc]"
                    >
                      <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2">
                        <rect x="5" y="11" width="14" height="9" rx="2" />
                        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                      </svg>
                    </span>
                  )}
                  {canManageColumns && (
                    <>
                      {isAdmin && (
                        <button
                          onClick={() => handleToggleAdminOnly(col.id, !col.adminOnly)}
                          title={col.adminOnly ? "Bu sütun kilitli — yalnızca admin kart taşıyabilir/dokunabilir (kapatmak için tıkla)" : "Bu sütunu kilitle — yalnızca admin kart taşıyabilsin ve dokunabilsin"}
                          className="w-6 h-6 flex items-center justify-center rounded-md transition-colors"
                          style={{
                            color: col.adminOnly ? "#c084fc" : "#555",
                            background: col.adminOnly ? "rgba(168,85,247,0.15)" : "transparent",
                          }}
                        >
                          <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2">
                            <rect x="5" y="11" width="14" height="9" rx="2" />
                            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                          </svg>
                        </button>
                      )}
                      {isAdmin && (
                        <button
                          onClick={() => handleToggleHidden(col.id, !col.hiddenFromEmployees)}
                          title={col.hiddenFromEmployees ? "Bu sütun çalışanlardan gizli — yalnızca sen görüyorsun (göstermek için tıkla)" : "Bu sütunu çalışanlardan gizle — panoda yalnızca sen görebilirsin"}
                          className="w-6 h-6 flex items-center justify-center rounded-md transition-colors"
                          style={{
                            color: col.hiddenFromEmployees ? "#fb923c" : "#555",
                            background: col.hiddenFromEmployees ? "rgba(251,146,60,0.15)" : "transparent",
                          }}
                        >
                          {col.hiddenFromEmployees ? (
                            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2">
                              <path d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-10-8-10-8a18.5 18.5 0 015.06-5.94M9.9 4.24A10.94 10.94 0 0112 4c7 0 10 8 10 8a18.5 18.5 0 01-2.16 3.19M14.12 14.12a3 3 0 11-4.24-4.24" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M1 1l22 22" strokeLinecap="round" />
                            </svg>
                          ) : (
                            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => handleToggleTrigger(col.id, !col.triggersWorkLog)}
                        title={col.triggersWorkLog ? "Bu sütuna taşınan kartlar otomatik iş kaydı oluşturur — kapatmak için tıkla" : "Bu sütuna taşınan kartlar otomatik iş kaydı oluştursun mu?"}
                        className="w-6 h-6 flex items-center justify-center rounded-md transition-colors"
                        style={{
                          color: col.triggersWorkLog ? "#c084fc" : "#555",
                          background: col.triggersWorkLog ? "rgba(168,85,247,0.15)" : "transparent",
                        }}
                      >
                        <svg viewBox="0 0 24 24" fill={col.triggersWorkLog ? "currentColor" : "none"} className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2">
                          <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleToggleContentTrigger(col.id, !col.triggersContentItem)}
                        title={col.triggersContentItem ? "Bu sütuna taşınan kartlarda İçerik Takvimi'ne ekleme seçeneği görünür — kapatmak için tıkla" : "Bu sütuna taşınan kartlarda İçerik Takvimi'ne ekleme seçeneği görünsün mü?"}
                        className="w-6 h-6 flex items-center justify-center rounded-md transition-colors"
                        style={{
                          color: col.triggersContentItem ? "#2dd4bf" : "#555",
                          background: col.triggersContentItem ? "rgba(45,212,191,0.15)" : "transparent",
                        }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="17" rx="2" />
                          <path d="M3 9h18M8 2v4M16 2v4" strokeLinecap="round" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleMoveColumn(col.id, "left")}
                        disabled={colIdx === 0}
                        title="Sola taşı"
                        className="w-6 h-6 flex items-center justify-center rounded-md text-[#555] hover:text-white disabled:opacity-25 disabled:hover:text-[#555] transition-colors"
                      >
                        <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2.5">
                          <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleMoveColumn(col.id, "right")}
                        disabled={colIdx === columns.length - 1}
                        title="Sağa taşı"
                        className="w-6 h-6 flex items-center justify-center rounded-md text-[#555] hover:text-white disabled:opacity-25 disabled:hover:text-[#555] transition-colors"
                      >
                        <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2.5">
                          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteColumn(col.id)}
                        title="Sütunu sil"
                        className="text-[#555] hover:text-[#f87171] transition-colors w-6 h-6 flex items-center justify-center rounded-md"
                      >
                        <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2.5">
                          <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Kartlar */}
              <div className="wf-cards-scroll flex-1 overflow-y-auto px-2 py-2 sm:px-2.5 sm:py-2.5 flex flex-col gap-1.5" style={{ minHeight: 80 }}>
                {col.cards.map((card) => {
                  const interactive = canDragCards && !locked;
                  return (
                  <div
                    key={card.id}
                    onPointerDown={interactive ? (e) => onCardPointerDown(e, card) : undefined}
                    onPointerMove={interactive ? onCardPointerMove : undefined}
                    onPointerUp={interactive ? (e) => onCardPointerUp(e, card) : undefined}
                    onPointerCancel={interactive ? onCardPointerCancel : undefined}
                    onLostPointerCapture={interactive ? onCardPointerCancel : undefined}
                    onClick={!interactive ? () => setModal({ mode: "edit", card }) : undefined}
                    className="rounded-lg px-2.5 py-2 transition-all select-none"
                    style={{
                      background: "var(--surface-2, #141420)",
                      border: "1px solid var(--border)",
                      borderLeft: card.revisionNote ? "3px solid #fb923c" : "1px solid var(--border)",
                      opacity: dragCardId === card.id ? 0.35 : 1,
                      cursor: !interactive ? "pointer" : dragCardId === card.id ? "grabbing" : "grab",
                      touchAction: "none",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(168,85,247,0.35)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-[7px] h-[7px] rounded-full flex-shrink-0"
                        style={{ background: PRIORITY_COLOR[card.priority] }}
                        title={PRIORITY_LABEL[card.priority]}
                      />
                      <p className="text-[12.5px] font-semibold text-white truncate">{card.title}</p>
                    </div>

                    {(card.client || card.dueDate) && (
                      <div className="flex flex-wrap items-center gap-1 mt-1">
                        {card.client && (
                          <span className="text-[9.5px] font-semibold px-1.5 py-0.5 rounded-md text-[#c084fc]" style={{ background: "rgba(168,85,247,0.1)" }}>
                            {card.client.name}
                          </span>
                        )}
                        {card.dueDate && (
                          <span className="text-[9.5px] font-medium text-[#8a8a9a]">📅 {fmtDate(card.dueDate)}</span>
                        )}
                      </div>
                    )}

                    {card.revisionNote && (
                      <div className="mt-1.5 px-2 py-1 rounded-md flex items-start gap-1"
                        style={{ background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.25)" }}>
                        <span className="text-[10px] flex-shrink-0 leading-tight">🔄</span>
                        <p className="text-[10px] font-medium text-[#fb923c] leading-snug line-clamp-2">{card.revisionNote}</p>
                      </div>
                    )}

                    {card.assignee && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black flex-shrink-0"
                          style={{ background: "var(--grad-soft)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.3)" }}>
                          {card.assignee.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-[10px] text-[#8a8a9a] truncate">{card.assignee.name}</span>
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>

              {/* Kart ekle */}
              {canCreateCards && !locked && (
                <button
                  onClick={() => setModal({ mode: "create", columnId: col.id })}
                  className="mx-2 mb-2 sm:mx-2.5 sm:mb-2.5 text-[12px] font-semibold text-[#8a8a9a] hover:text-[#c084fc] py-2.5 rounded-lg transition-colors text-left px-1.5"
                >
                  + Kart Ekle
                </button>
              )}
            </div>
          );
        })}

        {/* Sütun ekle */}
        {canManageColumns && (
          <div className="flex-shrink-0 w-[70vw] max-w-[240px] sm:w-[240px] snap-center">
            {addingColumn ? (
              <div className="rounded-2xl p-3" style={{ background: "var(--surface)", border: "1px solid rgba(168,85,247,0.3)" }}>
                <input
                  autoFocus
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleAddColumn(); if (e.key === "Escape") setAddingColumn(false); }}
                  placeholder="Sütun adı..."
                  className="w-full px-3 py-2 rounded-lg text-[13px] text-white placeholder-[#555] outline-none mb-2"
                  style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                />
                <div className="flex gap-2">
                  <button onClick={handleAddColumn} className="btn btn-primary text-[12px] px-3 py-1.5 flex-1">Ekle</button>
                  <button onClick={() => setAddingColumn(false)} className="btn btn-outline text-[12px] px-3 py-1.5">İptal</button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAddingColumn(true)}
                className="w-full rounded-2xl py-4 text-[13px] font-semibold transition-all"
                style={{ background: "rgba(168,85,247,0.06)", border: "1px dashed rgba(168,85,247,0.25)", color: "#c084fc" }}
              >
                + Sütun Ekle
              </button>
            )}
          </div>
        )}
      </div>

      {/* Sürüklenen kartın önizlemesi (parmağı/imleci takip eder) */}
      {dragCardId && dragPos && (() => {
        const draggedCard = columns.flatMap((c) => c.cards).find((c) => c.id === dragCardId);
        if (!draggedCard) return null;
        return (
          <div
            className="fixed z-[1200] pointer-events-none rounded-xl px-3.5 py-2.5"
            style={{
              left: dragPos.x,
              top: dragPos.y,
              transform: "translate(-50%, -50%) rotate(-2deg)",
              background: "var(--surface-2, #141420)",
              border: "1px solid rgba(168,85,247,0.5)",
              boxShadow: "0 14px 32px rgba(0,0,0,0.45)",
              maxWidth: 220,
            }}
          >
            <p className="text-[13px] font-semibold text-white truncate">{draggedCard.title}</p>
          </div>
        );
      })()}

      {modal && (
        <CardModal
          state={modal}
          columns={columns}
          employees={employees}
          clients={clients}
          currentUserId={currentUserId}
          isAdmin={isAdmin}
          canCreateCards={canCreateCards}
          canWriteRevisionNote={canWriteRevisionNote}
          canDeleteAnyCard={canDeleteAnyCard}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
          onContentLinked={handleContentLinked}
        />
      )}

      {showArchive && <ArchiveModal onClose={() => setShowArchive(false)} onRestored={load} />}
    </div>
  );
}

// ── Arşiv Modalı ─────────────────────────────────────────────────────────────

interface ArchivedCard {
  id: string;
  title: string;
  archivedAt: string;
  column: { title: string };
  assignee: { name: string } | null;
}

function ArchiveModal({ onClose, onRestored }: { onClose: () => void; onRestored: () => void }) {
  const [cards, setCards] = useState<ArchivedCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    const res = await fetch("/api/musteri/is-akisi/cards/archived");
    if (res.ok) {
      const data = await res.json();
      setCards(data.cards);
    } else {
      const body = await res.json().catch(() => ({}));
      setLoadError(body.error ?? "Arşiv yüklenemedi.");
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleRestore(id: string) {
    setBusyId(id);
    const res = await fetch(`/api/musteri/is-akisi/cards/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived: false }),
    });
    if (res.ok) {
      setCards((prev) => prev.filter((c) => c.id !== id));
      onRestored();
    }
    setBusyId(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu kart kalıcı olarak silinsin mi?")) return;
    setBusyId(id);
    const res = await fetch(`/api/musteri/is-akisi/cards/${id}`, { method: "DELETE" });
    if (res.ok) setCards((prev) => prev.filter((c) => c.id !== id));
    setBusyId(null);
  }

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.75)", WebkitBackdropFilter: "blur(8px)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="archive-modal-title"
        className="w-full max-w-[480px] rounded-2xl p-5 sm:p-7 relative max-h-[80vh] overflow-y-auto"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <button type="button" onClick={onClose} aria-label="Kapat" className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-all hover:bg-white/[0.08]">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-[#8a8a9a]" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>

        <h2 id="archive-modal-title" className="font-bold text-[17px] text-white mb-5">Arşivlenmiş Kartlar</h2>

        {loading ? (
          <p className="text-[13px] text-[#8a8a9a]">Yükleniyor...</p>
        ) : loadError ? (
          <div className="text-center py-4">
            <p className="text-[13px] mb-3" style={{ color: "#f87171" }}>{loadError}</p>
            <button onClick={load} className="btn btn-outline text-sm px-4 py-1.5">Tekrar Dene</button>
          </div>
        ) : cards.length === 0 ? (
          <p className="text-[13px] text-[#8a8a9a]">Arşivde kart yok.</p>
        ) : (
          <div className="space-y-2">
            {cards.map((c) => (
              <div key={c.id} className="rounded-xl px-3.5 py-3 flex items-center justify-between gap-3" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-white truncate">{c.title}</p>
                  <p className="text-[11px] text-[#8a8a9a] mt-0.5 truncate">
                    {c.column.title}{c.assignee ? ` · ${c.assignee.name}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleRestore(c.id)}
                    disabled={busyId === c.id}
                    className="text-[11px] font-semibold text-[#c084fc] px-2.5 py-1.5 rounded-lg"
                    style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)" }}
                  >
                    Geri Yükle
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    disabled={busyId === c.id}
                    className="text-[11px] font-semibold text-[#f87171] px-2.5 py-1.5 rounded-lg"
                    style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)" }}
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Kart Modalı ──────────────────────────────────────────────────────────────

function CardModal({
  state, columns, employees, clients, currentUserId, isAdmin, canCreateCards, canWriteRevisionNote, canDeleteAnyCard, onClose, onSaved, onDeleted, onContentLinked,
}: {
  state: { mode: "create" | "edit"; columnId?: string; card?: CardData };
  columns: ColumnData[];
  employees: PersonOption[];
  clients: ClientOption[];
  currentUserId: string;
  isAdmin: boolean;
  canCreateCards: boolean;
  canWriteRevisionNote: boolean;
  canDeleteAnyCard: boolean;
  onClose: () => void;
  onSaved: (card: CardData) => void;
  onDeleted: (id: string) => void;
  onContentLinked: (cardId: string, contentItem: { id: string; scheduledDate: string }) => void;
}) {
  const isEdit = state.mode === "edit";
  const card = state.card;
  const cardColumn = columns.find((c) => c.id === (card?.columnId ?? state.columnId));
  const locked = !isAdmin && !!cardColumn?.adminOnly;
  // Alan bazlı erişim: temel alanlar (başlık/öncelik/tarih/atanan/firma) "kart açma" yetkisi
  // ister; açıklama pano erişimi olan herkese açık (admin-only sütun hariç); revize notu
  // ayrı, varsayılan kapalı bir yetkiyle korunur. Admin-only sütunda (locked) admin dışında
  // hiçbir alan düzenlenemez.
  const readOnly = isEdit && (!canCreateCards || locked);
  const descriptionDisabled = isEdit && locked;
  const revisionNoteDisabled = !(isAdmin || canWriteRevisionNote) || (isEdit && locked);
  const canSubmitAnything = !isEdit || !readOnly || !descriptionDisabled || !revisionNoteDisabled;
  const [title, setTitle] = useState(card?.title ?? "");
  const [description, setDescription] = useState(card?.description ?? "");
  const [revisionNote, setRevisionNote] = useState(card?.revisionNote ?? "");
  const [priority, setPriority] = useState<Priority>(card?.priority ?? "ORTA");
  const [dueDate, setDueDate] = useState(card?.dueDate ?? "");
  const [assigneeId, setAssigneeId] = useState(card?.assignee?.id ?? "");
  const [clientId, setClientId] = useState(() => {
    if (!card?.client) return "";
    return clients.find((c) => c.slug === card.client!.slug)?.id ?? "";
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [error, setError] = useState("");
  const [contentItem, setContentItem] = useState(card?.contentItem ?? null);
  const [contentDate, setContentDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [contentSaving, setContentSaving] = useState(false);
  const [contentError, setContentError] = useState("");

  // Arşivleme her zaman yalnızca admin'e açık; silme izni ayrıca kilitli sütunlarda (locked) herkes için kapanır.
  const canArchive = isEdit && isAdmin;
  const canDelete = isEdit && !locked && (isAdmin || canDeleteAnyCard || (canCreateCards && card?.creator.id === currentUserId));
  const canAddToContent = isEdit && !readOnly && !!card?.client && !!cardColumn?.triggersContentItem && !contentItem;

  async function handleAddToContent() {
    if (!card) return;
    setContentSaving(true);
    setContentError("");
    const res = await fetch(`/api/musteri/is-akisi/cards/${card.id}/content-item`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scheduledDate: contentDate }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setContentItem(data.contentItem);
      onContentLinked(card.id, data.contentItem);
    } else {
      setContentError(data.error ?? "Eklenemedi.");
    }
    setContentSaving(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    setError("");

    // Sadece gerçekten düzenleyebildiği alanları gönder — sunucu, isteğe eklenmiş her alan
    // için ilgili yetkiyi tek tek kontrol ediyor; örneğin sadece açıklama yazma hakkı olan
    // biri title/priority gönderirse (değişmemiş olsa bile) reddedilir.
    let body: Record<string, unknown>;
    if (!isEdit) {
      body = {
        title: title.trim(),
        description: description.trim() || null,
        revisionNote: revisionNoteDisabled ? undefined : revisionNote.trim() || null,
        priority,
        dueDate: dueDate || null,
        assigneeId: assigneeId || null,
        clientId: clientId || null,
        columnId: state.columnId,
      };
    } else {
      body = {};
      if (!readOnly) {
        body.title = title.trim();
        body.priority = priority;
        body.dueDate = dueDate || null;
        body.assigneeId = assigneeId || null;
        body.clientId = clientId || null;
      }
      if (!descriptionDisabled) body.description = description.trim() || null;
      if (!revisionNoteDisabled) body.revisionNote = revisionNote.trim() || null;
    }

    const url = isEdit ? `/api/musteri/is-akisi/cards/${card!.id}` : "/api/musteri/is-akisi/cards";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Kaydedilemedi."); setSaving(false); return; }
      onSaved(data.card);
    } catch {
      setError("Bağlantı hatası.");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!card) return;
    setDeleting(true);
    const res = await fetch(`/api/musteri/is-akisi/cards/${card.id}`, { method: "DELETE" });
    if (res.ok) { onDeleted(card.id); return; }
    const data = await res.json().catch(() => ({}));
    setError(data.error ?? "Silinemedi.");
    setDeleting(false);
  }

  async function handleArchive() {
    if (!card) return;
    setArchiving(true);
    const res = await fetch(`/api/musteri/is-akisi/cards/${card.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived: true }),
    });
    if (res.ok) { onDeleted(card.id); return; }
    const data = await res.json().catch(() => ({}));
    setError(data.error ?? "Arşivlenemedi.");
    setArchiving(false);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.75)", WebkitBackdropFilter: "blur(8px)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <form
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="card-modal-title"
        className="w-full max-w-[440px] rounded-2xl p-5 sm:p-7 relative max-h-[88vh] overflow-y-auto"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <button type="button" onClick={onClose} aria-label="Kapat" className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-all hover:bg-white/[0.08]">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-[#8a8a9a]" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>

        <div className="flex items-center gap-2 mb-6">
          <h2 id="card-modal-title" className="font-bold text-[17px] text-white">{isEdit ? "Kartı Düzenle" : "Yeni Kart"}</h2>
          {readOnly && (
            <span
              className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
              style={locked
                ? { background: "rgba(168,85,247,0.15)", color: "#c084fc" }
                : { background: "rgba(138,138,154,0.15)", color: "#8a8a9a" }}
            >
              {locked ? "Sadece Admin Dokunabilir" : "Sadece Açıklama Ekleyebilirsin"}
            </span>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Başlık</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus={!readOnly}
              disabled={readOnly}
              placeholder="Örn. RetroCar Reels çekimi"
              className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-white placeholder-[#555] outline-none disabled:opacity-70"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Açıklama</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              disabled={descriptionDisabled}
              placeholder="Detaylar..."
              className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-white placeholder-[#555] outline-none resize-y disabled:opacity-70"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#fb923c" }}>
              🔄 Revize Notu <span className="normal-case font-normal opacity-70">(varsa)</span>
            </label>
            <textarea
              value={revisionNote}
              onChange={(e) => setRevisionNote(e.target.value)}
              rows={2}
              disabled={revisionNoteDisabled}
              className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-white placeholder-[#555] outline-none resize-y disabled:opacity-70"
              style={{ background: "var(--bg)", border: "1px solid rgba(251,146,60,0.3)" }}
            />
            {revisionNoteDisabled ? (
              <p className="text-[11px] text-[#666] mt-1.5">Revize notu yazma yetkin yok.</p>
            ) : (
              <p className="text-[11px] text-[#666] mt-1.5">
                Bir not yazarsan kartın üzerinde turuncu vurgu ile görünür. İş tamamlanınca temizleyebilirsin.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Öncelik</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                disabled={readOnly}
                className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-white outline-none disabled:opacity-70"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
              >
                <option value="DUSUK">Düşük</option>
                <option value="ORTA">Orta</option>
                <option value="YUKSEK">Yüksek</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Çekim Tarihi</label>
              {readOnly ? (
                <p className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-white"
                  style={{ background: "var(--bg)", border: "1px solid var(--border)", opacity: 0.7 }}>
                  {dueDate
                    ? new Date(dueDate + "T00:00:00").toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })
                    : "—"}
                </p>
              ) : (
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-white outline-none"
                  style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                />
              )}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Atanan Kişi</label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              disabled={readOnly}
              className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-white outline-none disabled:opacity-70"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
            >
              <option value="">Atanmadı</option>
              {employees.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {(clients.length > 0 || (readOnly && card?.client)) && (
            <div>
              <label className="block text-[11px] font-semibold text-[#8a8a9a] uppercase tracking-wide mb-1.5">Firma (opsiyonel)</label>
              {readOnly ? (
                // Salt-okunur görünümde firma adı doğrudan karttan gösterilir — çalışanın
                // atanmadığı bir firma seçenek listesinde (clients) bulunmayabilir, bu yüzden
                // <select>'e bağımlı kalmadan gerçek ismi buradan basıyoruz.
                <p className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-white"
                  style={{ background: "var(--bg)", border: "1px solid var(--border)", opacity: 0.7 }}>
                  {card?.client?.name ?? "Yok"}
                </p>
              ) : (
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-white outline-none"
                  style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                >
                  <option value="">Yok</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              )}
            </div>
          )}

          {contentItem && (
            <div className="px-3.5 py-2.5 rounded-xl flex items-center gap-2" style={{ background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.25)" }}>
              <span className="text-[13px]">✓</span>
              <p className="text-[12.5px] font-medium" style={{ color: "#2dd4bf" }}>
                İçerik Takvimi&apos;nde — {new Date(contentItem.scheduledDate).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          )}

          {canAddToContent && (
            <div className="p-3.5 rounded-xl" style={{ background: "rgba(45,212,191,0.06)", border: "1px dashed rgba(45,212,191,0.3)" }}>
              <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#2dd4bf" }}>
                📅 İçerik Takvimine Ekle
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={contentDate}
                  onChange={(e) => setContentDate(e.target.value)}
                  className="flex-1 min-w-0 px-3 py-2 rounded-lg text-[13px] text-white outline-none"
                  style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                />
                <button
                  type="button"
                  onClick={handleAddToContent}
                  disabled={contentSaving}
                  className="text-[12px] font-semibold px-3.5 rounded-lg flex-shrink-0"
                  style={{ background: "rgba(45,212,191,0.15)", color: "#2dd4bf", border: "1px solid rgba(45,212,191,0.3)" }}
                >
                  {contentSaving ? "..." : "Ekle"}
                </button>
              </div>
              {contentError && <p className="text-[11px] mt-1.5" style={{ color: "#f87171" }}>{contentError}</p>}
              <p className="text-[11px] text-[#666] mt-1.5">Yayınlanma tarihini gir, kart doğrudan {card?.client?.name} için İçerik Takvimi&apos;ne eklensin.</p>
            </div>
          )}
        </div>

        {error && <p className="text-[12px] text-red-400 mt-4">{error}</p>}

        {canSubmitAnything && (
          <div className="flex gap-3 mt-7">
            {canArchive && (
              <button type="button" onClick={handleArchive} disabled={archiving || deleting}
                className="text-[13px] font-semibold text-[#c084fc] px-4 py-2.5 rounded-xl transition-all"
                style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)" }}>
                {archiving ? "Arşivleniyor..." : "Arşivle"}
              </button>
            )}
            {canDelete && (
              <button type="button" onClick={handleDelete} disabled={deleting || archiving}
                className="text-[13px] font-semibold text-[#f87171] px-4 py-2.5 rounded-xl transition-all"
                style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)" }}>
                {deleting ? "Siliniyor..." : "Sil"}
              </button>
            )}
            <button type="submit" disabled={saving} className="btn btn-primary flex-1">
              {saving ? "Kaydediliyor..." : isEdit ? "Kaydet" : "Kartı Oluştur"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
