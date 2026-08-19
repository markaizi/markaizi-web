-- AlterTable: firma bazlı gecikme eşiği (boşsa genel varsayılan kullanılır)
ALTER TABLE "Client" ADD COLUMN "overdueGraceDays" INTEGER;

-- AlterTable: rapor mesajlaşma sayısı + PDF depolama
ALTER TABLE "AdReport" ADD COLUMN "messages" TEXT;
ALTER TABLE "AdReport" ADD COLUMN "pdfData" BYTEA;
ALTER TABLE "AdReport" ADD COLUMN "pdfFilename" TEXT;
ALTER TABLE "AdReport" ADD COLUMN "pdfMimeType" TEXT;

-- CreateTable: firma bazlı admin bildirimleri
CREATE TABLE "ClientNotification" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientNotification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClientNotification" ADD CONSTRAINT "ClientNotification_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
