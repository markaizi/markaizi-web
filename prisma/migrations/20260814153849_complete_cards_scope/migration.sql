-- CreateEnum
CREATE TYPE "CompleteCardsScope" AS ENUM ('NONE', 'OWN', 'ALL');

-- AlterTable (adminCanCompleteCards tüm satırlarda false idi, kimse kullanmıyordu — doğrulandı)
ALTER TABLE "User" ADD COLUMN     "adminCompleteCardsScope" "CompleteCardsScope" NOT NULL DEFAULT 'NONE';
ALTER TABLE "User" DROP COLUMN "adminCanCompleteCards";
