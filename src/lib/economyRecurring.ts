/**
 * Düzenli giderler (kira, sabit fatura gibi) için gerçek bir cron yok — bu
 * fonksiyon Ekonomi sayfası admin tarafından her açıldığında çağrılır ve
 * bugüne kadar üretilmesi gereken ama henüz üretilmemiş ayların Transaction
 * kaydını oluşturur. Birden fazla ay atlanmışsa (admin bir süre girmediyse)
 * hepsini sırayla üretir — "catch-up" mantığı.
 */
import { prisma } from "@/lib/db";
import { monthKey } from "@/lib/economy";

function firstDayOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

export async function generateDueRecurringExpenses(now: Date = new Date()): Promise<number> {
  const active = await prisma.recurringExpense.findMany({ where: { active: true } });
  if (active.length === 0) return 0;

  const currentKey = monthKey(now);
  let generated = 0;

  for (const re of active) {
    // Başlangıç noktası: daha önce üretim yapıldıysa bir sonraki ay, yoksa
    // tanımın oluşturulduğu ay — geriye dönük (oluşturulmadan önceki aylar için) üretim yapılmaz.
    let cursor = re.lastGeneratedPeriod
      ? addMonths(new Date(`${re.lastGeneratedPeriod}-01T00:00:00`), 1)
      : firstDayOfMonth(re.createdAt);

    let lastPeriod = re.lastGeneratedPeriod;

    while (monthKey(cursor) <= currentKey) {
      const day = Math.min(re.dayOfMonth, 28);
      const occurrenceDate = new Date(cursor.getFullYear(), cursor.getMonth(), day);
      if (occurrenceDate > now) break; // bu ayın günü henüz gelmedi — sonraki aylar da gelmemiştir

      await prisma.transaction.create({
        data: {
          type: "GIDER",
          amount: re.amount,
          description: re.title,
          category: re.category,
          date: occurrenceDate,
          recurringExpenseId: re.id,
        },
      });
      generated++;
      lastPeriod = monthKey(cursor);
      cursor = addMonths(cursor, 1);
    }

    if (lastPeriod !== re.lastGeneratedPeriod) {
      await prisma.recurringExpense.update({ where: { id: re.id }, data: { lastGeneratedPeriod: lastPeriod } });
    }
  }

  return generated;
}
