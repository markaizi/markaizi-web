import { prisma } from "@/lib/db";
import type { SessionPayload } from "@/lib/session";

const DEFAULT_COLUMNS = ["Yapılacak", "Devam Ediyor", "Kontrol", "Tamamlandı"];

// İş Akışı panosunun tüm verisini çeker — hem API route'u (client-side yenileme
// için) hem de sayfa server component'leri (ilk yükleme sunucuda hazır olsun
// diye) aynı fonksiyonu kullanır, tek doğru kaynak.
export async function getWorkflowBoardData(session: SessionPayload) {
  let columnCount = await prisma.workflowColumn.count();
  if (columnCount === 0) {
    await prisma.workflowColumn.createMany({
      data: DEFAULT_COLUMNS.map((title, i) => ({ title, sortOrder: i })),
    });
    columnCount = DEFAULT_COLUMNS.length;
  }

  const [columns, employees, clients] = await Promise.all([
    prisma.workflowColumn.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        cards: {
          where: { archivedAt: null },
          orderBy: { sortOrder: "asc" },
          include: {
            assignee: { select: { id: true, name: true } },
            creator: { select: { id: true, name: true } },
            client: { select: { slug: true, name: true } },
            contentItem: { select: { id: true, scheduledDate: true } },
            requestedBy: { select: { id: true, name: true } },
          },
        },
      },
    }),
    prisma.user.findMany({
      where: { role: { in: ["ADMIN", "EMPLOYEE"] }, active: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    session.role === "ADMIN"
      ? prisma.client.findMany({ where: { active: true }, select: { id: true, slug: true, name: true }, orderBy: { name: "asc" } })
      : prisma.client.findMany({
          where: { active: true, assignments: { some: { userId: session.uid } } },
          select: { id: true, slug: true, name: true },
          orderBy: { name: "asc" },
        }),
  ]);

  const isAdmin = session.role === "ADMIN";
  let canCreateCards = isAdmin;
  let canDragCards = isAdmin;
  let canWriteRevisionNote = isAdmin;
  let canDeleteAnyCard = isAdmin;
  let canManageColumns = isAdmin;
  let seeAllCards = true;
  let canCompleteCards = isAdmin;
  if (!isAdmin) {
    const me = await prisma.user.findUnique({
      where: { id: session.uid },
      select: {
        workflowCanCreateCards: true,
        workflowCanDragCards: true,
        workflowCanWriteRevisionNote: true,
        workflowCanDeleteAnyCard: true,
        workflowCanManageColumns: true,
        workflowSeeAllCards: true,
        adminCanCompleteCards: true,
      },
    });
    canCreateCards = !!me?.workflowCanCreateCards;
    canDragCards = !!me?.workflowCanDragCards;
    canWriteRevisionNote = !!me?.workflowCanWriteRevisionNote;
    canDeleteAnyCard = !!me?.workflowCanDeleteAnyCard;
    canManageColumns = !!me?.workflowCanManageColumns;
    seeAllCards = me?.workflowSeeAllCards ?? true;
    canCompleteCards = !!me?.adminCanCompleteCards;
  }

  // "Yapılacak" sütunu, kimin elinde iş kaldığının referans sütunu — admin
  // yeniden adlandırırsa en soldaki (sortOrder en düşük) sütuna düşülür.
  const todoColumn = columns.find((c) => c.title === "Yapılacak") ?? columns[0];
  const isIdle =
    !isAdmin && !!todoColumn && !todoColumn.cards.some((card) => card.assigneeId === session.uid);

  // "Tamamlandı" sütunu herkese açık — kim neyi bitirmiş herkes görsün, moral/takım
  // görünürlüğü için. Admin yeniden adlandırırsa en sağdaki (sortOrder en yüksek)
  // sütuna düşülür. hiddenFromEmployees ile bu sütun tamamen gizlenmişse (aşağıdaki
  // filter'da eleniyor) bu istisna da devreye girmez — admin'in gizleme kararı önceliklidir.
  const doneColumn = columns.find((c) => c.title === "Tamamlandı") ?? columns[columns.length - 1];

  // dueDate Prisma'dan tam DateTime olarak gelir; istemci tarafı (fmtDate,
  // <input type="date">) "YYYY-MM-DD" bekliyor — burada tek noktadan normalize edilir.
  // hiddenFromEmployees=true olan sütunlar çalışanlara panoda hiç gösterilmez.
  // seeAllCards=false olan çalışan yalnızca kendine atanmış + sahipsiz kartları görür —
  // ANCAK "Yapılacak" sütununda hiç kartı kalmadıysa (isIdle) o sütunda, "Tamamlandı"
  // sütununda ise her zaman istisnai olarak herkesin kartını görür.
  const normalizedColumns = columns
    .filter((col) => isAdmin || !col.hiddenFromEmployees)
    .map((col) => ({
      ...col,
      cards: col.cards
        .filter((card) => {
          if (seeAllCards) return true;
          if (col.id === doneColumn?.id) return true;
          if (!card.assigneeId || card.assigneeId === session.uid) return true;
          return isIdle && col.id === todoColumn?.id;
        })
        .map((card) => ({
          ...card,
          dueDate: card.dueDate ? card.dueDate.toISOString().slice(0, 10) : null,
        })),
    }));

  return {
    columns: normalizedColumns, employees, clients,
    currentUserId: session.uid,
    isAdmin, canCreateCards, canDragCards, canWriteRevisionNote, canDeleteAnyCard, canManageColumns,
    isIdle, canCompleteCards,
  };
}
