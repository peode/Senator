ALTER TABLE "Section"
ADD COLUMN "mobilePlanImage" BYTEA,
ADD COLUMN "mobilePlanWidth" INTEGER,
ADD COLUMN "mobilePlanHeight" INTEGER;

ALTER TABLE "Apartment"
ADD COLUMN "mobilePoints" JSONB;
