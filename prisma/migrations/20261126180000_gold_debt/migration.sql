-- Altın (gram) cinsinden borç + ödeme defteri (v3.18.0). Yalnızca ekleme: iki yeni tablo; mevcut tablolara dokunmaz.
-- CreateTable
CREATE TABLE "GoldDebt" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "totalGrams" DECIMAL(10,2) NOT NULL,
    "notes" TEXT,
    "autoMatch" TEXT,
    "autoShare" DECIMAL(5,4),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoldDebt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoldDebtPayment" (
    "id" TEXT NOT NULL,
    "debtId" TEXT NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL,
    "grams" DECIMAL(10,2),
    "tlAmount" DECIMAL(14,2),
    "gramPrice" DECIMAL(14,2),
    "priceSource" TEXT,
    "note" TEXT,
    "sourceEntryId" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GoldDebtPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GoldDebtPayment_sourceEntryId_key" ON "GoldDebtPayment"("sourceEntryId");

-- CreateIndex
CREATE INDEX "GoldDebtPayment_debtId_paidAt_idx" ON "GoldDebtPayment"("debtId", "paidAt");

-- AddForeignKey
ALTER TABLE "GoldDebtPayment" ADD CONSTRAINT "GoldDebtPayment_debtId_fkey" FOREIGN KEY ("debtId") REFERENCES "GoldDebt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
