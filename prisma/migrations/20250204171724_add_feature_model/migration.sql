/*
  Warnings:

  - You are about to drop the `Feature` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FeatureToProperty` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_FeatureToProperty" DROP CONSTRAINT "_FeatureToProperty_A_fkey";

-- DropForeignKey
ALTER TABLE "_FeatureToProperty" DROP CONSTRAINT "_FeatureToProperty_B_fkey";

-- DropTable
DROP TABLE "Feature";

-- DropTable
DROP TABLE "_FeatureToProperty";

-- CreateTable
CREATE TABLE "PropertyFeature" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "rooms" TEXT,
    "bathrooms" TEXT,
    "garage_spaces" TEXT,
    "size" TEXT,
    "apartment_type" TEXT,
    "apartment_features" TEXT[],
    "apartment_complex_features" TEXT[],
    "home_type" TEXT,
    "home_features" TEXT[],
    "home_complex_features" TEXT[],
    "re_land_type" TEXT,
    "re_land_features" TEXT[],
    "commercial_type" TEXT,
    "commercial_features" TEXT[],
    "beds" TEXT,
    "rent_type" TEXT,
    "season_type" TEXT,
    "season_features" TEXT[],
    "room_rent_features" TEXT[],
    "iptu" TEXT,
    "condominio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyFeature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PropertyFeature_propertyId_key" ON "PropertyFeature"("propertyId");

-- CreateIndex
CREATE INDEX "PropertyFeature_propertyId_idx" ON "PropertyFeature"("propertyId");

-- AddForeignKey
ALTER TABLE "PropertyFeature" ADD CONSTRAINT "PropertyFeature_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
