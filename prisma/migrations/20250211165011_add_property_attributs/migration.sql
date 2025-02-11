/*
  Warnings:

  - The `rooms` column on the `PropertyFeature` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `bathrooms` column on the `PropertyFeature` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `garage_spaces` column on the `PropertyFeature` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `beds` column on the `PropertyFeature` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PropertySituation" AS ENUM ('NEW', 'EXCELEENT', 'GOOD', 'NEEDS_RENOVATION', 'LAUNCH');

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "situation" "PropertySituation";

-- AlterTable
ALTER TABLE "PropertyFeature" ADD COLUMN     "complement" TEXT,
ADD COLUMN     "suites" INTEGER,
ADD COLUMN     "total_size" TEXT,
DROP COLUMN "rooms",
ADD COLUMN     "rooms" INTEGER,
DROP COLUMN "bathrooms",
ADD COLUMN     "bathrooms" INTEGER,
DROP COLUMN "garage_spaces",
ADD COLUMN     "garage_spaces" INTEGER,
DROP COLUMN "beds",
ADD COLUMN     "beds" INTEGER;
