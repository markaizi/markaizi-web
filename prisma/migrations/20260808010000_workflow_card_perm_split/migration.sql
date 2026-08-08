-- AlterTable: kart oluşturma/düzenleme ile sürükleme yetkisini ayır, revize notu yetkisi ekle
ALTER TABLE "User" ADD COLUMN     "workflowCanCreateCards" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "User" ADD COLUMN     "workflowCanDragCards" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "User" ADD COLUMN     "workflowCanWriteRevisionNote" BOOLEAN NOT NULL DEFAULT false;

-- Backfill: eski workflowCanManageCards değeri hem create hem drag'e taşınıyor —
-- mevcut çalışanların davranışı bu migration ile DEĞİŞMEZ.
UPDATE "User" SET "workflowCanCreateCards" = "workflowCanManageCards", "workflowCanDragCards" = "workflowCanManageCards";

-- Eski, artık kullanılmayan alan kaldırılıyor.
ALTER TABLE "User" DROP COLUMN "workflowCanManageCards";
