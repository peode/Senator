-- AlterTable
ALTER TABLE "Section" ADD COLUMN "floors" INTEGER NOT NULL DEFAULT 9;

-- CreateTable
CREATE TABLE "ApartmentUnit" (
    "id" SERIAL NOT NULL,
    "apartmentId" TEXT NOT NULL,
    "floor" INTEGER NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ApartmentUnit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApartmentUnit_apartmentId_floor_key" ON "ApartmentUnit"("apartmentId", "floor");

-- AddForeignKey
ALTER TABLE "ApartmentUnit" ADD CONSTRAINT "ApartmentUnit_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Квартири для вже наявних планувань: кожне планування на кожному поверсі секції
INSERT INTO "ApartmentUnit" ("apartmentId", "floor")
SELECT "Apartment"."id", "floor"
FROM "Apartment"
JOIN "Section" ON "Section"."id" = "Apartment"."sectionId"
CROSS JOIN LATERAL generate_series(1, "Section"."floors") AS "floor";
