-- AlterEnum: mevcut HAFTALIK/AYLIK değerleri korunur, yalnızca yeni seçenekler eklenir
ALTER TYPE "BillingPeriod" ADD VALUE 'IKI_HAFTALIK';
ALTER TYPE "BillingPeriod" ADD VALUE 'IKI_AYLIK';
ALTER TYPE "BillingPeriod" ADD VALUE 'OZEL_GUN';
ALTER TYPE "BillingPeriod" ADD VALUE 'MANUEL';

-- AlterTable: OZEL_GUN periyodu için gün aralığı (diğer periyotlarda NULL)
ALTER TABLE "Client" ADD COLUMN "billingIntervalDays" INTEGER;
