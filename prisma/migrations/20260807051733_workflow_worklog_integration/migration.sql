-- AlterTable
ALTER TABLE "WorkflowColumn" ADD COLUMN     "triggersWorkLog" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "WorkflowCard" ADD COLUMN     "archivedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "WorkLog" ADD COLUMN     "workflowCardId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "WorkLog_workflowCardId_key" ON "WorkLog"("workflowCardId");

-- AddForeignKey
ALTER TABLE "WorkLog" ADD CONSTRAINT "WorkLog_workflowCardId_fkey" FOREIGN KEY ("workflowCardId") REFERENCES "WorkflowCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;
