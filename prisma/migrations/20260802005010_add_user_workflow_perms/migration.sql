-- AlterTable
ALTER TABLE "User" ADD COLUMN     "workflowAccess" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "workflowCanDeleteAnyCard" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "workflowCanManageCards" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "workflowCanManageColumns" BOOLEAN NOT NULL DEFAULT false;
