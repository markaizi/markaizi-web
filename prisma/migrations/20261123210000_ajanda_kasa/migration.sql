-- CreateEnum
CREATE TYPE "AgendaEventStatus" AS ENUM ('PLANLI', 'TAMAMLANDI', 'IPTAL');

-- CreateEnum
CREATE TYPE "AgendaTaskStatus" AS ENUM ('YAPILACAK', 'YAPILIYOR', 'TAMAMLANDI');

-- CreateEnum
CREATE TYPE "AgendaPriority" AS ENUM ('DUSUK', 'ORTA', 'YUKSEK', 'ACIL');

-- CreateEnum
CREATE TYPE "AgendaNoteKind" AS ENUM ('NOT', 'HAFIZA');

-- CreateEnum
CREATE TYPE "KasaDirection" AS ENUM ('GELIR', 'GIDER', 'BORC', 'ALACAK');

-- CreateEnum
CREATE TYPE "KasaStatus" AS ENUM ('BEKLIYOR', 'ODENDI');

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "agendaLegacyId" TEXT,
ADD COLUMN     "lastVisitAt" TIMESTAMP(3),
ADD COLUMN     "paymentDay" INTEGER,
ADD COLUMN     "paymentDay2" INTEGER,
ADD COLUMN     "region" TEXT,
ADD COLUMN     "visitIntervalDays" INTEGER NOT NULL DEFAULT 14,
ADD COLUMN     "visitTrackingActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "AgendaEvent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "clientNote" TEXT,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3),
    "allDay" BOOLEAN NOT NULL DEFAULT false,
    "locationName" TEXT,
    "locationAddress" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "status" "AgendaEventStatus" NOT NULL DEFAULT 'PLANLI',
    "visibleToClient" BOOLEAN NOT NULL DEFAULT true,
    "clientId" TEXT,
    "legacyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgendaEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgendaTask" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priority" "AgendaPriority" NOT NULL DEFAULT 'ORTA',
    "status" "AgendaTaskStatus" NOT NULL DEFAULT 'YAPILACAK',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "dueAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "visibleToClient" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "clientId" TEXT,
    "legacyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgendaTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgendaNote" (
    "id" TEXT NOT NULL,
    "kind" "AgendaNoteKind" NOT NULL DEFAULT 'NOT',
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "importance" INTEGER NOT NULL DEFAULT 3,
    "deletedAt" TIMESTAMP(3),
    "clientId" TEXT,
    "legacyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgendaNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KasaEntry" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "direction" "KasaDirection" NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'genel',
    "status" "KasaStatus" NOT NULL DEFAULT 'BEKLIYOR',
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurrencePeriod" TEXT NOT NULL DEFAULT 'none',
    "remindDaysBefore" INTEGER NOT NULL DEFAULT 3,
    "notes" TEXT,
    "deletedAt" TIMESTAMP(3),
    "clientId" TEXT,
    "legacyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KasaEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KasaCardTransaction" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'alisveris',
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "deletedAt" TIMESTAMP(3),
    "legacyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KasaCardTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AgendaEvent_legacyId_key" ON "AgendaEvent"("legacyId");

-- CreateIndex
CREATE INDEX "AgendaEvent_startAt_idx" ON "AgendaEvent"("startAt");

-- CreateIndex
CREATE INDEX "AgendaEvent_clientId_startAt_idx" ON "AgendaEvent"("clientId", "startAt");

-- CreateIndex
CREATE UNIQUE INDEX "AgendaTask_legacyId_key" ON "AgendaTask"("legacyId");

-- CreateIndex
CREATE INDEX "AgendaTask_status_sortOrder_idx" ON "AgendaTask"("status", "sortOrder");

-- CreateIndex
CREATE INDEX "AgendaTask_clientId_status_idx" ON "AgendaTask"("clientId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "AgendaNote_legacyId_key" ON "AgendaNote"("legacyId");

-- CreateIndex
CREATE INDEX "AgendaNote_kind_clientId_idx" ON "AgendaNote"("kind", "clientId");

-- CreateIndex
CREATE UNIQUE INDEX "KasaEntry_legacyId_key" ON "KasaEntry"("legacyId");

-- CreateIndex
CREATE INDEX "KasaEntry_direction_status_dueDate_idx" ON "KasaEntry"("direction", "status", "dueDate");

-- CreateIndex
CREATE UNIQUE INDEX "KasaCardTransaction_legacyId_key" ON "KasaCardTransaction"("legacyId");

-- CreateIndex
CREATE INDEX "KasaCardTransaction_entryId_transactionDate_idx" ON "KasaCardTransaction"("entryId", "transactionDate");

-- CreateIndex
CREATE UNIQUE INDEX "Client_agendaLegacyId_key" ON "Client"("agendaLegacyId");

-- AddForeignKey
ALTER TABLE "AgendaEvent" ADD CONSTRAINT "AgendaEvent_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendaTask" ADD CONSTRAINT "AgendaTask_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendaNote" ADD CONSTRAINT "AgendaNote_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KasaEntry" ADD CONSTRAINT "KasaEntry_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KasaCardTransaction" ADD CONSTRAINT "KasaCardTransaction_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "KasaEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

