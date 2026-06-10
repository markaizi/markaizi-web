import { PrismaClient } from "@prisma/client";

// Next.js dev modunda hot-reload her seferinde yeni bağlantı açmasın diye
// Prisma client'ı global'de tekilleştiriyoruz.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
