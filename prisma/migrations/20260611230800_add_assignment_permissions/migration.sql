-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "canManageContent" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "canManageUpdates" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "canViewCampaigns" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "canViewInvoices" BOOLEAN NOT NULL DEFAULT false;
