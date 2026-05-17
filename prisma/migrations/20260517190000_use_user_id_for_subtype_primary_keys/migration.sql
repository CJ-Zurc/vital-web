-- Remap VITAL subtype tables so their primary key is the parent vital_users.id.
-- Existing dependent foreign key values are converted from subtype.id to subtype.userId.

-- Drop foreign keys that currently reference subtype-local id columns.
ALTER TABLE "hospital_affiliations" DROP CONSTRAINT IF EXISTS "hospital_affiliations_doctorId_fkey";
ALTER TABLE "doctor_qr_codes" DROP CONSTRAINT IF EXISTS "doctor_qr_codes_doctorId_fkey";
ALTER TABLE "schedules" DROP CONSTRAINT IF EXISTS "schedules_doctorId_fkey";
ALTER TABLE "external_health_records" DROP CONSTRAINT IF EXISTS "external_health_records_patientId_fkey";
ALTER TABLE "health_records" DROP CONSTRAINT IF EXISTS "health_records_patientId_fkey";
ALTER TABLE "doctor_record_access" DROP CONSTRAINT IF EXISTS "doctor_record_access_doctorId_fkey";
ALTER TABLE "doctor_record_access" DROP CONSTRAINT IF EXISTS "doctor_record_access_patientId_fkey";
ALTER TABLE "appointments" DROP CONSTRAINT IF EXISTS "appointments_patientId_fkey";
ALTER TABLE "appointments" DROP CONSTRAINT IF EXISTS "appointments_doctorId_fkey";
ALTER TABLE "notes" DROP CONSTRAINT IF EXISTS "notes_doctorId_fkey";
ALTER TABLE "reports" DROP CONSTRAINT IF EXISTS "reports_doctorId_fkey";
ALTER TABLE "consent_records" DROP CONSTRAINT IF EXISTS "consent_records_patientId_fkey";
ALTER TABLE "prescriptions" DROP CONSTRAINT IF EXISTS "prescriptions_doctorId_fkey";
ALTER TABLE "medical_certificates" DROP CONSTRAINT IF EXISTS "medical_certificates_doctorId_fkey";
ALTER TABLE "messages" DROP CONSTRAINT IF EXISTS "messages_senderId_fkey";
ALTER TABLE "messages" DROP CONSTRAINT IF EXISTS "messages_receiverId_fkey";
ALTER TABLE "feedback" DROP CONSTRAINT IF EXISTS "feedback_patientId_fkey";
ALTER TABLE "notifications" DROP CONSTRAINT IF EXISTS "notifications_patientId_fkey";
ALTER TABLE "audit_logs" DROP CONSTRAINT IF EXISTS "audit_logs_adminId_fkey";
ALTER TABLE "system_content" DROP CONSTRAINT IF EXISTS "system_content_adminId_fkey";

-- Convert dependent ids to the shared parent user id.
UPDATE "hospital_affiliations" AS target
SET "doctorId" = source."userId"
FROM "vital_doctors" AS source
WHERE target."doctorId" = source."id";

UPDATE "doctor_qr_codes" AS target
SET "doctorId" = source."userId"
FROM "vital_doctors" AS source
WHERE target."doctorId" = source."id";

UPDATE "schedules" AS target
SET "doctorId" = source."userId"
FROM "vital_doctors" AS source
WHERE target."doctorId" = source."id";

UPDATE "external_health_records" AS target
SET "patientId" = source."userId"
FROM "vital_patients" AS source
WHERE target."patientId" = source."id";

UPDATE "health_records" AS target
SET "patientId" = source."userId"
FROM "vital_patients" AS source
WHERE target."patientId" = source."id";

UPDATE "doctor_record_access" AS target
SET "doctorId" = source."userId"
FROM "vital_doctors" AS source
WHERE target."doctorId" = source."id";

UPDATE "doctor_record_access" AS target
SET "patientId" = source."userId"
FROM "vital_patients" AS source
WHERE target."patientId" = source."id";

UPDATE "appointments" AS target
SET "patientId" = source."userId"
FROM "vital_patients" AS source
WHERE target."patientId" = source."id";

UPDATE "appointments" AS target
SET "doctorId" = source."userId"
FROM "vital_doctors" AS source
WHERE target."doctorId" = source."id";

UPDATE "notes" AS target
SET "doctorId" = source."userId"
FROM "vital_doctors" AS source
WHERE target."doctorId" = source."id";

UPDATE "reports" AS target
SET "doctorId" = source."userId"
FROM "vital_doctors" AS source
WHERE target."doctorId" = source."id";

UPDATE "consent_records" AS target
SET "patientId" = source."userId"
FROM "vital_patients" AS source
WHERE target."patientId" = source."id";

UPDATE "prescriptions" AS target
SET "doctorId" = source."userId"
FROM "vital_doctors" AS source
WHERE target."doctorId" = source."id";

UPDATE "medical_certificates" AS target
SET "doctorId" = source."userId"
FROM "vital_doctors" AS source
WHERE target."doctorId" = source."id";

UPDATE "messages" AS target
SET "senderId" = source."userId"
FROM "vital_patients" AS source
WHERE target."senderId" = source."id";

UPDATE "messages" AS target
SET "receiverId" = source."userId"
FROM "vital_patients" AS source
WHERE target."receiverId" = source."id";

UPDATE "feedback" AS target
SET "patientId" = source."userId"
FROM "vital_patients" AS source
WHERE target."patientId" = source."id";

UPDATE "notifications" AS target
SET "patientId" = source."userId"
FROM "vital_patients" AS source
WHERE target."patientId" = source."id";

UPDATE "audit_logs" AS target
SET "adminId" = source."userId"
FROM "vital_admins" AS source
WHERE target."adminId" = source."id";

UPDATE "system_content" AS target
SET "adminId" = source."userId"
FROM "vital_admins" AS source
WHERE target."adminId" = source."id";

-- Replace subtype-local primary keys with shared userId primary keys.
ALTER TABLE "vital_patients" DROP CONSTRAINT IF EXISTS "vital_patients_pkey";
ALTER TABLE "vital_doctors" DROP CONSTRAINT IF EXISTS "vital_doctors_pkey";
ALTER TABLE "vital_admins" DROP CONSTRAINT IF EXISTS "vital_admins_pkey";

DROP INDEX IF EXISTS "vital_patients_userId_key";
DROP INDEX IF EXISTS "vital_doctors_userId_key";
DROP INDEX IF EXISTS "vital_admins_userId_key";

ALTER TABLE "vital_patients" DROP COLUMN "id";
ALTER TABLE "vital_doctors" DROP COLUMN "id";
ALTER TABLE "vital_admins" DROP COLUMN "id";

ALTER TABLE "vital_patients" ADD CONSTRAINT "vital_patients_pkey" PRIMARY KEY ("userId");
ALTER TABLE "vital_doctors" ADD CONSTRAINT "vital_doctors_pkey" PRIMARY KEY ("userId");
ALTER TABLE "vital_admins" ADD CONSTRAINT "vital_admins_pkey" PRIMARY KEY ("userId");

-- Recreate foreign keys against subtype userId primary keys.
ALTER TABLE "hospital_affiliations" ADD CONSTRAINT "hospital_affiliations_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "vital_doctors"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "doctor_qr_codes" ADD CONSTRAINT "doctor_qr_codes_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "vital_doctors"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "vital_doctors"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "external_health_records" ADD CONSTRAINT "external_health_records_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "vital_patients"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "health_records" ADD CONSTRAINT "health_records_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "vital_patients"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "doctor_record_access" ADD CONSTRAINT "doctor_record_access_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "vital_doctors"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "doctor_record_access" ADD CONSTRAINT "doctor_record_access_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "vital_patients"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "vital_patients"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "vital_doctors"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "notes" ADD CONSTRAINT "notes_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "vital_doctors"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "reports" ADD CONSTRAINT "reports_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "vital_doctors"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "consent_records" ADD CONSTRAINT "consent_records_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "vital_patients"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "vital_doctors"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "medical_certificates" ADD CONSTRAINT "medical_certificates_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "vital_doctors"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "vital_patients"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "messages" ADD CONSTRAINT "messages_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "vital_patients"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "vital_patients"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "vital_patients"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "vital_admins"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "system_content" ADD CONSTRAINT "system_content_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "vital_admins"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
