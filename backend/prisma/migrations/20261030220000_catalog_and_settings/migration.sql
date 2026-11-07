-- CreateEnum
CREATE TYPE "SectionStatus" AS ENUM ('SELLING', 'PLANNED', 'SOLD', 'COMING_SOON');

-- CreateTable
CREATE TABLE "Section" (
    "id" INTEGER NOT NULL,
    "status" "SectionStatus" NOT NULL DEFAULT 'PLANNED',
    "price" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Apartment" (
    "id" TEXT NOT NULL,
    "sectionId" INTEGER NOT NULL,
    "rooms" INTEGER NOT NULL,
    "area" DOUBLE PRECISION NOT NULL,
    "points" JSONB NOT NULL,

    CONSTRAINT "Apartment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "hours" TEXT NOT NULL,
    "socials" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Apartment_sectionId_idx" ON "Apartment"("sectionId");

-- AddForeignKey
ALTER TABLE "Apartment" ADD CONSTRAINT "Apartment_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

