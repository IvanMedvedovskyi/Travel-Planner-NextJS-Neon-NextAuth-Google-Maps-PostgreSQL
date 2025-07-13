/*
  Warnings:

  - Made the column `endDate` on table `Trip` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Trip" ALTER COLUMN "endDate" SET NOT NULL;
