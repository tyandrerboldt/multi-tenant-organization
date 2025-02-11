-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "enableRent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "enableSale" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rentalValue" DECIMAL(65,30),
ADD COLUMN     "saleValue" DECIMAL(65,30);
