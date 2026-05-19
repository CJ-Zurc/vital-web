import Link from "next/link";
import type { ReactNode } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock3,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DoctorDashboardLayout } from "@/components/ui/DoctorDashboardLayout";
import { cn } from "@/lib/cn";

type StatCard = {
  label: string;
  value: string;
  icon: LucideIcon;
};

type Appointment = {
  patient: string;
  time: string;
  concern: string;
  type: "Virtual" | "In-Person";
};

type PendingRequest = {
  patient: string;
  dateTime: string;
  concern: string;
};

const stats: StatCard[] = [
  { label: "Today's Appointments", value: "3", icon: Calendar },
  { label: "Pending Requests", value: "2", icon: Clock3 },
  { label: "Total Patients", value: "127", icon: UsersRound },
  { label: "This Week", value: "45", icon: CheckCircle2 },
];

const appointments: Appointment[] = [
  {
    patient: "Juan Dela Cruz",
    time: "10:00 AM",
    concern: "Chest pain and palpitations",
    type: "Virtual",
  },
  {
    patient: "Maria Garcia",
    time: "11:00 AM",
    concern: "Follow-up consultation",
    type: "In-Person",
  },
  {
    patient: "Pedro Santos",
    time: "2:00 PM",
    concern: "High blood pressure monitoring",
    type: "Virtual",
  },
];

const pendingRequests: PendingRequest[] = [
  {
    patient: "Ana Reyes",
    dateTime: "2026-04-22 at 9:00 AM",
    concern: "Recurring headaches",
  },
  {
    patient: "Carlos Lopez",
    dateTime: "2026-04-23 at 3:00 PM",
    concern: "Annual checkup",
  },
];

function DashboardHeader() {
  return (
    <header className="mb-9">
      <h2 className="font-heading text-3xl font-bold tracking-normal text-gray-950">
        Welcome, Dr. Santos
      </h2>
      <p className="mt-2 text-base text-gray-600">
        Here&apos;s your schedule for today
      </p>
    </header>
  );
}

function StatSummaryCard({ icon: Icon, label, value }: StatCard) {
  return (
    <article className="rounded-lg border border-gray-300 bg-white px-6 py-7">
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-md bg-emerald-100 text-bgh-green">
          <Icon className="h-6 w-6" strokeWidth={1.8} />
        </span>
        <div>
          <p className="font-heading text-2xl font-bold leading-none text-gray-950">
            {value}
          </p>
          <p className="mt-2 text-sm text-gray-600">{label}</p>
        </div>
      </div>
    </article>
  );
}

function AppointmentTypeBadge({ type }: { type: Appointment["type"] }) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-semibold",
        type === "Virtual"
          ? "bg-green-100 text-green-800"
          : "bg-gray-100 text-gray-700"
      )}
    >
      {type}
    </span>
  );
}

function DashboardSection({
  action,
  children,
  title,
}: {
  action: string;
  children: ReactNode;
  title: string;
}) {
  return (
    <section className="rounded-lg border border-gray-300 bg-white p-6">
      <div className="mb-7 flex items-center justify-between gap-4">
        <h3 className="font-heading text-xl font-bold text-gray-950">{title}</h3>
        <Link
          href="#"
          className="text-sm font-semibold text-gray-950 transition hover:text-bgh-green"
        >
          {action}
        </Link>
      </div>
      {children}
    </section>
  );
}

function TodayAppointmentCard({ appointment }: { appointment: Appointment }) {
  return (
    <article className="rounded-lg border border-gray-300 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="font-heading text-lg font-bold text-gray-950">
            {appointment.patient}
          </h4>
          <p className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <Clock3 className="h-4 w-4" strokeWidth={1.8} />
            {appointment.time}
          </p>
          <p className="mt-3 text-sm text-gray-600">{appointment.concern}</p>
        </div>
        <AppointmentTypeBadge type={appointment.type} />
      </div>
    </article>
  );
}

function PendingRequestCard({ request }: { request: PendingRequest }) {
  return (
    <article className="rounded-lg border border-gray-300 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="font-heading text-lg font-bold text-gray-950">
            {request.patient}
          </h4>
          <p className="mt-3 text-sm text-gray-600">{request.dateTime}</p>
          <p className="mt-2 text-sm text-gray-600">{request.concern}</p>
        </div>
        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
          Pending
        </span>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Button className="h-9 rounded-md bg-bgh-green px-4 py-0 text-sm hover:bg-bgh-dark">
          Approve
        </Button>
        <Button
          variant="secondary"
          className="h-9 rounded-md border border-gray-300 px-4 py-0 text-sm"
        >
          Reject
        </Button>
      </div>
    </article>
  );
}

export default function DoctorDashboard() {
  return (
    <DoctorDashboardLayout activeHref="/doctor/dashboard">
      <DashboardHeader />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatSummaryCard key={stat.label} {...stat} />
        ))}
      </section>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <DashboardSection title="Today's Appointments" action="View Schedule">
          <div className="space-y-3">
            {appointments.map((appointment) => (
              <TodayAppointmentCard
                key={`${appointment.patient}-${appointment.time}`}
                appointment={appointment}
              />
            ))}
          </div>
        </DashboardSection>

        <DashboardSection title="Pending Requests" action="View All">
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <PendingRequestCard key={request.patient} request={request} />
            ))}
          </div>
        </DashboardSection>
      </div>
    </DoctorDashboardLayout>
  );
}
