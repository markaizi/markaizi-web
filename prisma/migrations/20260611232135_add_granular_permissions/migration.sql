-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "canManageCampaigns" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canManageInvoices" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canViewContent" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "canViewUpdates" BOOLEAN NOT NULL DEFAULT true;
