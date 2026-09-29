-- CreateEnum
CREATE TYPE "PaymentLinkStatus" AS ENUM ('AKTIF', 'ODENDI', 'IPTAL');

-- CreateEnum
CREATE TYPE "PaymentAttemptStatus" AS ENUM ('BEKLIYOR', 'BASARILI', 'BASARISIZ');

-- CreateTable
CREATE TABLE "PaymentLink" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "amountKurus" INTEGER NOT NULL,
    "status" "PaymentLinkStatus" NOT NULL DEFAULT 'AKTIF',
    "clientId" TEXT,
    "createdById" TEXT,
    "paidAt" TIMESTAMP(3),
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentAttempt" (
    "id" TEXT NOT NULL,
    "merchantOid" TEXT NOT NULL,
    "paymentLinkId" TEXT NOT NULL,
    "amountKurus" INTEGER NOT NULL,
    "status" "PaymentAttemptStatus" NOT NULL DEFAULT 'BEKLIYOR',
    "payerName" TEXT NOT NULL,
    "payerEmail" TEXT NOT NULL,
    "payerPhone" TEXT NOT NULL,
    "payerAddress" TEXT NOT NULL,
    "userIp" TEXT NOT NULL,
    "totalAmountKurus" INTEGER,
    "paymentType" TEXT,
    "failedReasonCode" TEXT,
    "failedReasonMsg" TEXT,
    "testMode" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "PaymentAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentLink_code_key" ON "PaymentLink"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentAttempt_merchantOid_key" ON "PaymentAttempt"("merchantOid");

-- CreateIndex
CREATE INDEX "PaymentAttempt_paymentLinkId_idx" ON "PaymentAttempt"("paymentLinkId");

-- AddForeignKey
ALTER TABLE "PaymentLink" ADD CONSTRAINT "PaymentLink_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentAttempt" ADD CONSTRAINT "PaymentAttempt_paymentLinkId_fkey" FOREIGN KEY ("paymentLinkId") REFERENCES "PaymentLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;
