-- AlterTable
ALTER TABLE "User" ADD COLUMN     "adminCanCompleteCards" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "adminCanPriceWorklogs" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "adminCanViewEconomy" BOOLEAN NOT NULL DEFAULT false;
