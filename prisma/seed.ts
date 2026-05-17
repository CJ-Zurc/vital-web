import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding VITAL database...");

  // ─── Clean existing seed data ─────────────────────────────────────────────
  await prisma.vitalPatient.deleteMany({});
  await prisma.vitalDoctor.deleteMany({});
  await prisma.vitalAdmin.deleteMany({});
  await prisma.vitalUser.deleteMany({});

  // ─── Patient ──────────────────────────────────────────────────────────────
  const patient = await prisma.vitalUser.create({
    data: {
      authId: "seed-patient-auth-id-001",
      role: "patient",
      patient: {
        create: {
          authId: "seed-patient-auth-id-001",
          isRecordAvailable: false,
          isOnboardingComplete: false,
        },
      },
    },
  });

  // ─── Doctor ───────────────────────────────────────────────────────────────
  const doctor = await prisma.vitalUser.create({
    data: {
      authId: "seed-doctor-auth-id-001",
      role: "doctor",
      doctor: {
        create: {
          authId: "seed-doctor-auth-id-001",
          title: "Dr.",
          specialty: "General Medicine",
          availabilityType: "both",
          virtualFee: 500,
          inPersonFee: 800,
          starRating: 0,
          bio: "Experienced general practitioner.",
        },
      },
    },
  });

  // ─── Admin ────────────────────────────────────────────────────────────────
  const admin = await prisma.vitalUser.create({
    data: {
      authId: "seed-admin-auth-id-001",
      role: "admin",
      admin: {
        create: {
          authId: "seed-admin-auth-id-001",
        },
      },
    },
  });

  console.log("✅ Seeded:");
  console.log(`   Patient  → vitalUserId: ${patient.id} | authId: ${patient.authId}`);
  console.log(`   Doctor   → vitalUserId: ${doctor.id} | authId: ${doctor.authId}`);
  console.log(`   Admin    → vitalUserId: ${admin.id}  | authId: ${admin.authId}`);
  console.log("");
  console.log("Use these authIds as the 'sub' claim in a test JWT to simulate each role.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
