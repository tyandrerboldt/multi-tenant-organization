/*
  Warnings:

  - The values [EXCELEENT] on the enum `PropertySituation` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PropertySituation_new" AS ENUM ('NEW', 'EXCELLENT', 'GOOD', 'NEEDS_RENOVATION', 'LAUNCH');
ALTER TABLE "Property" ALTER COLUMN "situation" TYPE "PropertySituation_new" USING ("situation"::text::"PropertySituation_new");
ALTER TYPE "PropertySituation" RENAME TO "PropertySituation_old";
ALTER TYPE "PropertySituation_new" RENAME TO "PropertySituation";
DROP TYPE "PropertySituation_old";
COMMIT;
