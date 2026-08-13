import { prisma } from "@/lib/db";

// Art arda gelen ücret girişleri bu pencere içindeyse tek bildirimde birikir
// ("3 işiniz için ücret girildi" gibi) — admin toplu fiyatlandırma yaptığında
// çalışanın bildirim kutusu tek tek girişlerle dolmasın diye.
const PRICED_MERGE_WINDOW_MS = 3 * 60 * 1000;
const PRICED_BODY_MAX_LINES = 12;

function buildPricedLine(description: string, amount: string, adminNote?: string | null): string {
  let line = `"${description}" — ${amount}`;
  if (adminNote) line += `\nNot: ${adminNote}`;
  return line;
}

/** Bir iş kaydına ücret girildiğinde çağrılır — ilgili çalışana bildirim üretir/günceller. */
export async function notifyWorklogPriced(
  recipientId: string,
  description: string,
  amount: string,
  adminNote?: string | null
) {
  const line = buildPricedLine(description, amount, adminNote);

  const recent = await prisma.staffNotification.findFirst({
    where: {
      recipientId,
      type: "WORKLOG_PRICED",
      readAt: null,
      createdAt: { gte: new Date(Date.now() - PRICED_MERGE_WINDOW_MS) },
    },
    orderBy: { createdAt: "desc" },
  });

  if (recent) {
    const count = recent.count + 1;
    const lines = [...recent.body.split("\n\n"), line].slice(-PRICED_BODY_MAX_LINES);
    await prisma.staffNotification.update({
      where: { id: recent.id },
      data: {
        count,
        title: `${count} iş için ücretiniz girildi`,
        body: lines.join("\n\n"),
      },
    });
    return;
  }

  await prisma.staffNotification.create({
    data: {
      recipientId,
      type: "WORKLOG_PRICED",
      title: "1 iş için ücretiniz girildi",
      body: line,
      count: 1,
    },
  });
}

/** Admin'in bireysel veya toplu gönderdiği bildirim — her alıcı için ayrı satır (fan-out). */
export async function sendAdminNotifications(params: {
  recipientIds: string[];
  title: string;
  body: string;
  popup: boolean;
}) {
  const { recipientIds, title, body, popup } = params;
  if (recipientIds.length === 0) return { count: 0 };

  const result = await prisma.staffNotification.createMany({
    data: recipientIds.map((recipientId) => ({
      recipientId,
      type: "ADMIN_MESSAGE" as const,
      title,
      body,
      popup,
    })),
  });
  return { count: result.count };
}
