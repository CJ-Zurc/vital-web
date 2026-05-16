/*
  Warnings:

  - The `fromStatus` column on the `appointment_logs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `changedByRole` column on the `appointment_logs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `endDate` on the `medical_certificates` table. All the data in the column will be lost.
  - You are about to drop the column `haId` on the `vital_doctors` table. All the data in the column will be lost.
  - You are about to drop the column `emergencyContactName` on the `vital_patients` table. All the data in the column will be lost.
  - You are about to drop the column `emergencyContactNumber` on the `vital_patients` table. All the data in the column will be lost.
  - You are about to drop the column `homeAddress` on the `vital_patients` table. All the data in the column will be lost.
  - You are about to drop the column `sex` on the `vital_patients` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[authId]` on the table `vital_patients` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `toStatus` on the `appointment_logs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `authId` to the `vital_patients` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `vital_users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_scheduleSlotId_fkey";

-- AlterTable
ALTER TABLE "appointment_logs" DROP COLUMN "fromStatus",
ADD COLUMN     "fromStatus" TEXT,
DROP COLUMN "toStatus",
ADD COLUMN     "toStatus" TEXT NOT NULL,
DROP COLUMN "changedByRole",
ADD COLUMN     "changedByRole" TEXT;

-- AlterTable
ALTER TABLE "appointments" ALTER COLUMN "scheduleSlotId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "audit_logs" ADD COLUMN     "field" TEXT,
ALTER COLUMN "actionType" DROP NOT NULL,
ALTER COLUMN "targetEntity" DROP NOT NULL;

-- AlterTable
ALTER TABLE "doctor_record_access" ADD COLUMN     "invoicedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "hospital_affiliations" ADD COLUMN     "haId" TEXT;

-- AlterTable
ALTER TABLE "invoices" ALTER COLUMN "filePath" DROP NOT NULL,
ALTER COLUMN "patientName" DROP NOT NULL,
ALTER COLUMN "doctorName" DROP NOT NULL,
ALTER COLUMN "consultationDate" DROP NOT NULL,
ALTER COLUMN "service" DROP NOT NULL,
ALTER COLUMN "paymentMethod" DROP NOT NULL;

-- AlterTable
ALTER TABLE "medical_certificates" DROP COLUMN "endDate",
ADD COLUMN     "endTime" TIME,
ALTER COLUMN "filePath" DROP NOT NULL;

-- AlterTable
ALTER TABLE "messages" ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable
ALTER TABLE "notifications" ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "proofFilePath" DROP NOT NULL,
ALTER COLUMN "referenceNumber" DROP NOT NULL,
ALTER COLUMN "amount" DROP NOT NULL;

-- AlterTable
ALTER TABLE "pre_consultations" ALTER COLUMN "chiefComplaint" DROP NOT NULL;

-- AlterTable
ALTER TABLE "reports" ALTER COLUMN "clinicalFindings" DROP NOT NULL,
ALTER COLUMN "diagnosis" DROP NOT NULL,
ALTER COLUMN "recommendations" DROP NOT NULL;

-- AlterTable
ALTER TABLE "vital_doctors" DROP COLUMN "haId";

-- AlterTable
ALTER TABLE "vital_patients" DROP COLUMN "emergencyContactName",
DROP COLUMN "emergencyContactNumber",
DROP COLUMN "homeAddress",
DROP COLUMN "sex",
ADD COLUMN     "authId" TEXT NOT NULL,
ADD COLUMN     "extensionName" TEXT,
ADD COLUMN     "isOnboardingComplete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isRecordAvailable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "profilePic" TEXT;

-- AlterTable
ALTER TABLE "vital_users" DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL;

-- DropEnum
DROP TYPE "ChangedByRole";

-- CreateIndex
CREATE UNIQUE INDEX "vital_patients_authId_key" ON "vital_patients"("authId");

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_scheduleSlotId_fkey" FOREIGN KEY ("scheduleSlotId") REFERENCES "schedules"("id") ON DELETE SET NULL ON UPDATE CASCADE;
