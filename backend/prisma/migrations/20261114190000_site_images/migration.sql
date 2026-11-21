-- AlterTable
ALTER TABLE "Section" ADD COLUMN "mapPoints" JSONB;

-- CreateTable
CREATE TABLE "SiteImage" (
    "key" TEXT NOT NULL,
    "image" BYTEA NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteImage_pkey" PRIMARY KEY ("key")
);

-- Контури секцій, що досі були в коді сайту (у координатах стандартної карти ЖК)
UPDATE "Section" SET "mapPoints" = '[[303,143],[413,143],[413,273],[303,273]]' WHERE "id" = 1;
UPDATE "Section" SET "mapPoints" = '[[411,143],[519,143],[519,273],[411,273]]' WHERE "id" = 2;
UPDATE "Section" SET "mapPoints" = '[[517,143],[627,143],[627,273],[517,273]]' WHERE "id" = 3;
UPDATE "Section" SET "mapPoints" = '[[516,356],[642,356],[642,482],[516,482]]' WHERE "id" = 4;
UPDATE "Section" SET "mapPoints" = '[[640,356],[764,356],[764,482],[640,482]]' WHERE "id" = 5;
UPDATE "Section" SET "mapPoints" = '[[703,451],[795,451],[795,597],[703,597]]' WHERE "id" = 6;
UPDATE "Section" SET "mapPoints" = '[[703,598],[795,598],[795,750],[703,750]]' WHERE "id" = 7;
UPDATE "Section" SET "mapPoints" = '[[661,748],[794,748],[794,862],[661,862]]' WHERE "id" = 8;
UPDATE "Section" SET "mapPoints" = '[[535,748],[663,748],[663,862],[535,862]]' WHERE "id" = 9;
UPDATE "Section" SET "mapPoints" = '[[193,319],[287,319],[287,467],[193,467]]' WHERE "id" = 10;
UPDATE "Section" SET "mapPoints" = '[[196,467],[286,467],[286,617],[196,617]]' WHERE "id" = 11;
UPDATE "Section" SET "mapPoints" = '[[196,614],[288,614],[288,762],[196,762]]' WHERE "id" = 12;
UPDATE "Section" SET "mapPoints" = '[[196,759],[288,759],[288,907],[196,907]]' WHERE "id" = 13;
UPDATE "Section" SET "mapPoints" = '[[198,903],[294,903],[294,1087],[198,1087]]' WHERE "id" = 14;
UPDATE "Section" SET "mapPoints" = '[[293,958],[480,958],[480,1088],[293,1088]]' WHERE "id" = 15;
UPDATE "Section" SET "mapPoints" = '[[173,220],[293,220],[293,340],[173,340]]' WHERE "id" = 16;
