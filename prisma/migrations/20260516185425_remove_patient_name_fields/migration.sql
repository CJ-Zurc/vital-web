/*
  Warnings:

  - You are about to drop the column `extensionName` on the `vital_patients` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `vital_patients` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "vital_patients" DROP COLUMN "extensionName",
DROP COLUMN "lastName";
