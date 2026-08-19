-- CreateEnum
CREATE TYPE "ClientNotificationSeverity" AS ENUM ('YESIL', 'SARI', 'KIRMIZI');

-- AlterTable
ALTER TABLE "ClientNotification" ADD COLUMN "severity" "ClientNotificationSeverity" NOT NULL DEFAULT 'SARI';
ALTER TABLE "ClientNotification" ADD COLUMN "poppedAt" TIMESTAMP(3);
ALTER TABLE "ClientNotification" ADD COLUMN "reply" TEXT;
ALTER TABLE "ClientNotification" ADD COLUMN "repliedAt" TIMESTAMP(3);
