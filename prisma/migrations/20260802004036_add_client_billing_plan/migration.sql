-- CreateEnum
CREATE TYPE "BillingPeriod" AS ENUM ('HAFTALIK', 'AYLIK');

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "billingAmount" TEXT,
ADD COLUMN     "billingPeriod" "BillingPeriod";
