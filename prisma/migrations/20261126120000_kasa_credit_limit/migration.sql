-- Kart / ek hesap limiti (v3.17.0). Yalnızca ekleme: boş bırakılabilir tek sütun; mevcut veriye dokunmaz.
-- AlterTable
ALTER TABLE "KasaEntry" ADD COLUMN "creditLimit" DECIMAL(14,2);
