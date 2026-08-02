/*
  Warnings:

  - You are about to drop the column `canManageCampaigns` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `canViewCampaigns` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `visibility` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the `Campaign` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('BEKLIYOR', 'YAPILDI');

-- CreateEnum
CREATE TYPE "ReportPlatform" AS ENUM ('META', 'GOOGLE', 'WEBSITE');

-- DropForeignKey
ALTER TABLE "Campaign" DROP CONSTRAINT "Campaign_clientId_fkey";

-- AlterTable
ALTER TABLE "Assignment" DROP COLUMN "canManageCampaigns",
DROP COLUMN "canViewCampaigns";

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "dailyGoogleSpend" TEXT,
ADD COLUMN     "dailyMetaSpend" TEXT;

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "visibility",
ADD COLUMN     "status" "RequestStatus" NOT NULL DEFAULT 'BEKLIYOR';

-- DropTable
DROP TABLE "Campaign";

-- DropEnum
DROP TYPE "CampaignStatus";

-- DropEnum
DROP TYPE "NoteVisibility";

-- DropEnum
DROP TYPE "Platform";

-- CreateTable
CREATE TABLE "AdReport" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "platform" "ReportPlatform" NOT NULL,
    "month" TEXT NOT NULL,
    "spend" TEXT,
    "impressions" TEXT,
    "clicks" TEXT,
    "summary" TEXT,
    "authorId" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdReport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AdReport" ADD CONSTRAINT "AdReport_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdReport" ADD CONSTRAINT "AdReport_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
