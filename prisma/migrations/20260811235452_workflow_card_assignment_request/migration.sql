-- AlterTable
ALTER TABLE "WorkflowCard" ADD COLUMN     "requestedAt" TIMESTAMP(3),
ADD COLUMN     "requestedById" TEXT;

-- AddForeignKey
ALTER TABLE "WorkflowCard" ADD CONSTRAINT "WorkflowCard_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
