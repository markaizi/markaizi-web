-- CreateEnum
CREATE TYPE "DigestEventType" AS ENUM ('NOTE', 'WORKLOG', 'CARD_ENTRY');

-- CreateTable
CREATE TABLE "DigestEvent" (
    "id" TEXT NOT NULL,
    "type" "DigestEventType" NOT NULL,
    "summary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3),

    CONSTRAINT "DigestEvent_pkey" PRIMARY KEY ("id")
);
