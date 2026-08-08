-- AlterTable
ALTER TABLE "WorkflowColumn" ADD COLUMN     "triggersContentItem" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ContentItem" ADD COLUMN     "workflowCardId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ContentItem_workflowCardId_key" ON "ContentItem"("workflowCardId");

-- AddForeignKey
ALTER TABLE "ContentItem" ADD CONSTRAINT "ContentItem_workflowCardId_fkey" FOREIGN KEY ("workflowCardId") REFERENCES "WorkflowCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;
