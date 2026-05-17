import {
  MapPin,
  Search,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  PatientDashboardLayout,
  PatientPageHeader,
} from "@/components/ui/PatientDashboardLayout";
import { Select } from "@/components/ui/Select";

const doctors = [
  {
    initial: "M",
    name: "Dr. Maria Santos",
    specialty: "Cardiology",
    rating: "4.8",
    reviews: "124",
    nextAvailable: "Apr 20, 2026",
  },
  {
    initial: "R",
    name: "Dr. Ramon Cruz",
    specialty: "General Practice",
    rating: "4.9",
    reviews: "98",
    nextAvailable: "Apr 18, 2026",
  },
  {
    initial: "A",
    name: "Dr. Ana Reyes",
    specialty: "Pediatrics",
    rating: "4.7",
    reviews: "156",
    nextAvailable: "Apr 25, 2026",
  },
  {
    initial: "J",
    name: "Dr. Jose Garcia",
    specialty: "Dermatology",
    rating: "4.6",
    reviews: "87",
    nextAvailable: "Apr 19, 2026",
  },
];

const specialties = [
  { value: "all", label: "All Specialties" },
  { value: "cardiology", label: "Cardiology" },
  { value: "general-practice", label: "General Practice" },
  { value: "pediatrics", label: "Pediatrics" },
  { value: "dermatology", label: "Dermatology" },
];

export default function FindDoctorsPage() {
  return (
    <PatientDashboardLayout activeHref="/patient/dashboard/find-doctors">
      <PatientPageHeader
        title="Find a Doctor"
        description="Search and book appointments with our specialists"
      />

      <section className="rounded-lg border border-gray-300 bg-white p-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <Input
              aria-label="Search by doctor name"
              placeholder="Search by doctor name..."
              className="h-11 rounded-md pl-11 text-base"
            />
          </div>
          <Select
            aria-label="Filter by specialty"
            defaultValue="all"
            options={specialties}
            className="h-11 rounded-md py-0 text-base"
          />
          <Input aria-label="Preferred appointment date" type="date" className="h-11 rounded-md py-0 text-base" />
        </div>
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-2">
        {doctors.map((doctor) => (
          <article
            key={doctor.name}
            className="rounded-lg border border-gray-300 bg-white p-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-2xl font-bold text-bgh-green">
                {doctor.initial}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-gray-950">
                      {doctor.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">{doctor.specialty}</p>
                    <p className="mt-2 flex items-center gap-1 text-sm text-gray-700">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{doctor.rating}</span>
                      <span className="text-xs text-gray-500">({doctor.reviews} reviews)</span>
                    </p>
                  </div>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Available
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-5 flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" strokeWidth={1.8} />
              Bernardino General Hospital 1
            </p>

            <div className="mt-5 flex flex-col gap-4 border-t border-gray-300 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-600">
                Next available:{" "}
                <span className="font-semibold text-gray-950">{doctor.nextAvailable}</span>
              </p>
              <Button className="h-8 rounded-md px-4 py-0 text-sm">View Profile</Button>
            </div>
          </article>
        ))}
      </section>
    </PatientDashboardLayout>
  );
}
