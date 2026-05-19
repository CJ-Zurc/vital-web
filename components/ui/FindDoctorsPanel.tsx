"use client";

import { useState } from "react";
import {
  Award,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Search,
  Star,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PatientPageHeader } from "@/components/ui/PatientDashboardLayout";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/cn";

type Doctor = {
  initial: string;
  name: string;
  specialty: string;
  rating: string;
  reviews: string;
  nextAvailable: string;
  experience: string;
  hospital: string;
  about: string;
  education: string;
};

const doctors: Doctor[] = [
  {
    initial: "M",
    name: "Dr. Maria Santos",
    specialty: "Cardiology",
    rating: "4.8",
    reviews: "124",
    nextAvailable: "May 20, 2026",
    experience: "15 years experience",
    hospital: "Bernardino General Hospital 1",
    about:
      "Dr. Santos is a board-certified cardiologist with extensive experience in treating cardiovascular diseases. She specializes in preventive cardiology and non-invasive cardiac imaging.",
    education: "University of the Philippines College of Medicine",
  },
  {
    initial: "R",
    name: "Dr. Ramon Cruz",
    specialty: "General Practice",
    rating: "4.9",
    reviews: "98",
    nextAvailable: "May 21, 2026",
    experience: "12 years experience",
    hospital: "Bernardino General Hospital 1",
    about:
      "Dr. Cruz provides comprehensive primary care with a focus on preventive medicine, chronic condition management, and family wellness.",
    education: "University of Santo Tomas Faculty of Medicine and Surgery",
  },
  {
    initial: "A",
    name: "Dr. Ana Reyes",
    specialty: "Pediatrics",
    rating: "4.7",
    reviews: "156",
    nextAvailable: "May 25, 2026",
    experience: "10 years experience",
    hospital: "Bernardino General Hospital 1",
    about:
      "Dr. Reyes cares for infants, children, and adolescents, supporting families through routine checkups, immunizations, and pediatric health concerns.",
    education: "Ateneo School of Medicine and Public Health",
  },
  {
    initial: "J",
    name: "Dr. Jose Garcia",
    specialty: "Dermatology",
    rating: "4.6",
    reviews: "87",
    nextAvailable: "May 22, 2026",
    experience: "9 years experience",
    hospital: "Bernardino General Hospital 1",
    about:
      "Dr. Garcia specializes in medical dermatology, skin health screening, acne treatment, and common inflammatory skin conditions.",
    education: "Far Eastern University - Nicanor Reyes Medical Foundation",
  },
];

const specialties = [
  { value: "all", label: "All Specialties" },
  { value: "cardiology", label: "Cardiology" },
  { value: "general-practice", label: "General Practice" },
  { value: "pediatrics", label: "Pediatrics" },
  { value: "dermatology", label: "Dermatology" },
];

const weekDays = ["MON", "TUES", "WEDS", "THURS", "FRI", "SAT", "SUN"];
const calendarDays = [
  null,
  null,
  null,
  null,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
];
const availableSchedules: Record<number, { label: string; times: string[] }> = {
  19: {
    label: "Tuesday, May 19",
    times: ["9:00 AM", "11:00 AM", "1:00 PM"],
  },
  20: {
    label: "Wednesday, May 20",
    times: ["9:00 AM", "11:00 AM", "1:00 PM"],
  },
  22: {
    label: "Friday, May 22",
    times: ["10:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
  },
  27: {
    label: "Wednesday, May 27",
    times: ["8:30 AM", "10:30 AM", "3:00 PM"],
  },
};
const appointmentTimes = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

function DoctorAvatar({ initial, size = "md" }: { initial: string; size?: "md" | "lg" }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-emerald-50 font-heading font-bold text-bgh-green",
        size === "lg" ? "h-24 w-24 text-4xl" : "h-16 w-16 text-2xl"
      )}
    >
      {initial}
    </div>
  );
}

function DoctorResultCard({
  doctor,
  onViewProfile,
}: {
  doctor: Doctor;
  onViewProfile: (doctor: Doctor) => void;
}) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <DoctorAvatar initial={doctor.initial} />

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
        {doctor.hospital}
      </p>

      <div className="mt-5 flex flex-col gap-4 border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-600">
          Next available:{" "}
          <span className="font-semibold text-gray-950">{doctor.nextAvailable}</span>
        </p>
        <Button
          className="h-8 rounded-md px-4 py-0 text-sm"
          onClick={() => onViewProfile(doctor)}
        >
          View Profile
        </Button>
      </div>
    </article>
  );
}

function DoctorProfileHeader({
  doctor,
  onBack,
  onBookAppointment,
}: {
  doctor: Doctor;
  onBack: () => void;
  onBookAppointment: () => void;
}) {
  return (
    <section className="rounded-xl border border-gray-300 bg-white p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <DoctorAvatar initial={doctor.initial} size="lg" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="font-heading text-3xl font-bold tracking-normal text-gray-950">
                {doctor.name}
              </h2>
              <p className="mt-3 text-lg text-gray-600">{doctor.specialty}</p>
            </div>

            <Button
              variant="secondary"
              className="h-9 rounded-md border border-gray-300 px-4 py-0 text-sm"
              onClick={onBack}
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Results
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600">
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-gray-950">{doctor.rating}</span>
              <span>({doctor.reviews} reviews)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="h-4 w-4" strokeWidth={1.8} />
              {doctor.experience}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" strokeWidth={1.8} />
              {doctor.hospital}
            </span>
          </div>

          <Button
            className="mt-5 h-12 rounded-md px-6 py-0 text-base"
            onClick={onBookAppointment}
          >
            <Calendar className="h-5 w-5" />
            Book Appointment
          </Button>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-300 pt-6">
        <h3 className="font-heading text-lg font-bold text-gray-950">About</h3>
        <p className="mt-3 text-base leading-6 text-gray-600">{doctor.about}</p>

        <h3 className="mt-5 font-heading text-lg font-bold text-gray-950">
          Education
        </h3>
        <p className="mt-3 text-base text-gray-600">{doctor.education}</p>
      </div>
    </section>
  );
}

function AvailabilityCalendar() {
  const [selectedDay, setSelectedDay] = useState(22);
  const selectedSchedule = availableSchedules[selectedDay];

  return (
    <section className="mt-6 rounded-xl border border-gray-300 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="font-heading text-2xl font-bold tracking-normal text-gray-950">
        Available Schedule
      </h2>

      <div className="mt-8 flex items-center justify-between">
        <h3 className="font-heading text-xl font-bold text-gray-950">May 2026</h3>
        <div className="flex items-center gap-5 text-bgh-dark">
          <button
            type="button"
            className="rounded-md p-1 transition hover:bg-emerald-50"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="rounded-md p-1 transition hover:bg-emerald-50"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-md border border-gray-300">
        <div className="grid grid-cols-7 border-b border-gray-300 bg-gray-50">
          {weekDays.map((day) => (
            <div
              key={day}
              className="px-2 py-3 text-center text-xs font-bold text-gray-600 sm:text-sm"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => (
            <button
              key={`${day ?? "blank"}-${index}`}
              type="button"
              disabled={!day || !availableSchedules[day]}
              onClick={() => day && setSelectedDay(day)}
              className={cn(
                "flex h-9 items-center justify-center border-b border-r border-gray-300 text-sm font-semibold transition last:border-r-0",
                index % 7 === 6 && "border-r-0",
                index >= 28 && "border-b-0",
                !day && "cursor-default",
                day && !availableSchedules[day] && "cursor-default text-gray-700",
                day &&
                  availableSchedules[day] &&
                  day !== selectedDay &&
                  "bg-emerald-50 text-gray-950 hover:bg-emerald-100",
                day === selectedDay && "bg-bgh-green text-white"
              )}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-7">
        <h3 className="flex items-center gap-2 font-heading text-xl font-bold text-gray-950">
          <Calendar className="h-5 w-5" strokeWidth={1.8} />
          {selectedSchedule.label}
        </h3>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {selectedSchedule.times.map((time) => (
            <button
              key={time}
              type="button"
              className="flex h-10 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white text-sm font-semibold text-gray-950 transition hover:border-bgh-green hover:bg-emerald-50"
            >
              <Clock3 className="h-4 w-4 text-gray-500" strokeWidth={1.8} />
              {time}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 rounded-md bg-gray-50 px-4 py-4 text-sm leading-6 text-gray-600">
        <span className="font-semibold text-gray-700">Note:</span> Schedule shows
        typical availability. Click &quot;Book Appointment&quot; to see real-time
        slot availability and book your consultation.
      </p>
    </section>
  );
}

function DoctorProfileView({
  doctor,
  onBack,
  onBookAppointment,
}: {
  doctor: Doctor;
  onBack: () => void;
  onBookAppointment: () => void;
}) {
  return (
    <div className="mx-auto max-w-5xl">
      <DoctorProfileHeader
        doctor={doctor}
        onBack={onBack}
        onBookAppointment={onBookAppointment}
      />
      <AvailabilityCalendar />
    </div>
  );
}

function AppointmentTypeOption({
  active,
  description,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  description: string;
  icon: typeof Video;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-19 items-center gap-3 rounded-md border p-4 text-left transition",
        active
          ? "border-bgh-green bg-emerald-50"
          : "border-gray-300 bg-white hover:border-bgh-soft hover:bg-gray-50"
      )}
    >
      <Icon
        className={cn("h-6 w-6 shrink-0", active ? "text-bgh-green" : "text-gray-500")}
        strokeWidth={1.8}
      />
      <span>
        <span className="block font-heading text-base font-bold text-gray-950">
          {label}
        </span>
        <span className="mt-1 block text-xs text-gray-700">{description}</span>
      </span>
    </button>
  );
}

function AppointmentFormView({
  doctor,
  onCancel,
}: {
  doctor: Doctor;
  onCancel: () => void;
}) {
  const [appointmentType, setAppointmentType] = useState<"virtual" | "in-person">(
    "virtual"
  );
  const [selectedTime, setSelectedTime] = useState("9:00 AM");

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-9">
        <h2 className="font-heading text-3xl font-bold tracking-normal text-gray-950">
          Book Appointment
        </h2>
        <p className="mt-2 text-base text-gray-600">
          Schedule a consultation with {doctor.name}
        </p>
      </header>

      <section className="rounded-xl border border-gray-300 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <p className="mb-4 text-sm font-semibold text-gray-950">
            Appointment Type
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <AppointmentTypeOption
              active={appointmentType === "virtual"}
              description="Online video call"
              icon={Video}
              label="Virtual Consultation"
              onClick={() => setAppointmentType("virtual")}
            />
            <AppointmentTypeOption
              active={appointmentType === "in-person"}
              description="At the hospital"
              icon={Building2}
              label="In-Person Visit"
              onClick={() => setAppointmentType("in-person")}
            />
          </div>
        </div>

        <div className="mt-6">
          <Input
            label="Preferred Date"
            placeholder="dd/mm/yyyy"
            className="h-11 rounded-md py-0 text-base"
          />
        </div>

        <div className="mt-6">
          <p className="mb-4 text-sm font-semibold text-gray-950">Preferred Time</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {appointmentTimes.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setSelectedTime(time)}
                className={cn(
                  "flex h-10 items-center justify-center gap-2 rounded-md border text-sm font-semibold transition",
                  selectedTime === time
                    ? "border-bgh-green bg-emerald-50 text-gray-950"
                    : "border-gray-300 bg-white text-gray-950 hover:border-bgh-soft hover:bg-gray-50"
                )}
              >
                <Clock3 className="h-4 w-4 text-gray-500" strokeWidth={1.8} />
                {time}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <Textarea
            label="Chief Complaint"
            placeholder="Please describe your symptoms or reason for consultation..."
            className="min-h-40 rounded-md text-base"
          />
        </div>

        <p className="mt-6 rounded-md bg-emerald-50 px-4 py-4 text-sm leading-6 text-gray-950">
          <span className="font-semibold">Note:</span> Your appointment request will
          be reviewed by the doctor. You will receive a confirmation within 24 hours.
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          <Button
            type="button"
            variant="secondary"
            className="h-11 rounded-md border border-gray-300 px-4 py-0 text-base"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="button" className="h-11 rounded-md px-4 py-0 text-base">
            Submit Appointment Request
          </Button>
        </div>
      </section>
    </div>
  );
}

function DoctorSearchView({ onViewProfile }: { onViewProfile: (doctor: Doctor) => void }) {
  return (
    <>
      <PatientPageHeader
        title="Find a Doctor"
        description="Search and book appointments with our specialists"
      />

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
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
          <Input
            aria-label="Preferred appointment date"
            type="date"
            className="h-11 rounded-md py-0 text-base"
          />
        </div>
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-2">
        {doctors.map((doctor) => (
          <DoctorResultCard
            key={doctor.name}
            doctor={doctor}
            onViewProfile={onViewProfile}
          />
        ))}
      </section>
    </>
  );
}

export function FindDoctorsPanel() {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isBookingAppointment, setIsBookingAppointment] = useState(false);

  if (selectedDoctor && isBookingAppointment) {
    return (
      <AppointmentFormView
        doctor={selectedDoctor}
        onCancel={() => setIsBookingAppointment(false)}
      />
    );
  }

  if (selectedDoctor) {
    return (
      <DoctorProfileView
        doctor={selectedDoctor}
        onBack={() => {
          setSelectedDoctor(null);
          setIsBookingAppointment(false);
        }}
        onBookAppointment={() => setIsBookingAppointment(true)}
      />
    );
  }

  return (
    <DoctorSearchView
      onViewProfile={(doctor) => {
        setSelectedDoctor(doctor);
        setIsBookingAppointment(false);
      }}
    />
  );
}
