ALTER TABLE "Section"
ADD COLUMN "mobilePlanImage" BYTEA,
ADD COLUMN "mobilePlanWidth" INTEGER,
ADD COLUMN "mobilePlanHeight" INTEGER;

ALTER TABLE "Apartment"
ADD COLUMN "mobilePoints" JSONB;

UPDATE "Section"
SET
  "mobilePlanImage" = "planImage",
  "mobilePlanWidth" = "planWidth",
  "mobilePlanHeight" = "planHeight"
WHERE "planImage" IS NOT NULL;

UPDATE "Apartment"
SET "mobilePoints" = "points";
