import { PrismaClient } from "@prisma/client";
import { runWithRetry } from "@/lib/dbRetry";

// Geçici bağlantı kesintilerinde (Neon compute uyanması, bağlantı sıfırlanması)
// panelin komple hata ekranına düşmemesi için okumalar yeniden denenir.
//
// ÖNEMLİ — yalnızca OKUMA işlemleri yeniden denenir:
// Okumalar idempotent olduğu için tekrarlanması her zaman güvenlidir. Yazma
// işlemlerinde (create/update/delete) hata kullanıcıya olduğu gibi iletilir;
// çünkü "bağlantı koptu" hatasında yazmanın sunucuya ulaşıp ulaşmadığı her
// durumda kesin bilinemez ve kör bir tekrar çift kayıt oluşturabilir. Yazmayı
// kullanıcının kendisinin tekrar denemesi doğru davranıştır.
const READ_OPERATIONS = new Set([
  "findMany",
  "findFirst",
  "findFirstOrThrow",
  "findUnique",
  "findUniqueOrThrow",
  "count",
  "aggregate",
  "groupBy",
]);

function createPrismaClient() {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

  return client.$extends({
    name: "retryTransientReads",
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          if (!READ_OPERATIONS.has(operation)) return query(args);
          return runWithRetry(() => query(args), `${model}.${operation}`);
        },
      },
    },
  });
}

// Next.js dev modunda hot-reload her seferinde yeni bağlantı açmasın diye
// Prisma client'ı global'de tekilleştiriyoruz.
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
