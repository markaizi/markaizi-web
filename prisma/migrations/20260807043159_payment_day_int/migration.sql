-- paymentDay: String? -> Int?
-- Sayısal olmayan/boş değerleri NULL'a çevirerek veri kaybı olmadan cast et.
ALTER TABLE "User"
  ALTER COLUMN "paymentDay" TYPE INTEGER
  USING (
    CASE
      WHEN "paymentDay" ~ '^[0-9]+$' THEN "paymentDay"::INTEGER
      ELSE NULL
    END
  );
