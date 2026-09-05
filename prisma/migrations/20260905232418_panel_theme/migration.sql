-- CreateEnum
CREATE TYPE "PanelTheme" AS ENUM ('KOYU', 'AYDINLIK');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "panelTheme" "PanelTheme" NOT NULL DEFAULT 'KOYU';
