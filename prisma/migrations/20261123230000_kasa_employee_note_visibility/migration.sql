-- AlterTable
ALTER TABLE "AgendaNote" ADD COLUMN     "visibleToClient" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "KasaEntry" ADD COLUMN     "employeeId" TEXT;

-- CreateIndex
CREATE INDEX "KasaEntry_employeeId_idx" ON "KasaEntry"("employeeId");

-- AddForeignKey
ALTER TABLE "KasaEntry" ADD CONSTRAINT "KasaEntry_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

