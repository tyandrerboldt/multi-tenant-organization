/*
  Warnings:

  - The `size` column on the `PropertyFeature` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `iptu` column on the `PropertyFeature` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `condominio` column on the `PropertyFeature` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `total_size` column on the `PropertyFeature` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "PropertyFeature" DROP COLUMN "size",
ADD COLUMN     "size" DECIMAL(65,30),
DROP COLUMN "iptu",
ADD COLUMN     "iptu" DECIMAL(65,30),
DROP COLUMN "condominio",
ADD COLUMN     "condominio" DECIMAL(65,30),
DROP COLUMN "total_size",
ADD COLUMN     "total_size" DECIMAL(65,30);
