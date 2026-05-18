import Link from "next/link";
import {
  Calendar,
  Clock3,
  FileText,
  MessageSquare,
  Search,
} from "lucide-react";
import { PatientDashboardLayout } from "@/components/ui/PatientDashboardLayout";
import { cn } from "@/lib/cn";

const quickActions = [
  {
    title: "Find a Doctor",
    description: "Search specialists",
    href: "/patient/dashboard/find-doctors",
    icon: Search,
  },
  {
    title: "My Appointments",
    description: "View history",
    href: "/patient/dashboard/appointments",
    icon: Calendar,
  },
  {
    title: "Prescriptions",
    description: "Access records",
    href: "/patient/dashboard/prescriptions",
    icon: FileText,
  },
  {
    title: "Messages",
    description: "Chat with doctors",
    href: "/patient/dashboard/messages",
    icon: MessageSquare,
  },
];

const appointments = [
  {
    doctor: "Dr. Maria Santos",
    specialty: "Cardiology",
    date: "2026-04-20 at 10:00 AM",
    type: "Virtual",
    status: "Approved",
  },
  {
    doctor: "Dr. Ramon Cruz",
    specialty: "General Practice",
    date: "2026-04-22 at 2:00 PM",
    type: "In-Person",
    status: "Pending",
  },
];

export default function DashboardPage() {
  return (
    <PatientDashboardLayout
      activeHref="/patient/dashboard"
      contentClassName="w-full px-5 py-7 sm:px-8 lg:px-10"
    >
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-heading text-3xl font-bold tracking-normal text-gray-900">
            Welcome back, Juan!
          </h2>
          <p className="mt-2 text-sm text-gray-500">Here&apos;s your health overview</p>
        </div>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="group min-h-40 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-bgh-soft hover:shadow-md"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-100">
                <Icon className="h-6 w-6" strokeWidth={2} />
              </span>
              <h3 className="mt-6 font-heading text-sm font-bold text-gray-900">
                {action.title}
              </h3>
              <p className="mt-1 text-xs text-gray-500">{action.description}</p>
            </Link>
          );
        })}
      </div>

      <section className="mt-8 rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-6">
          <h3 className="font-heading text-lg font-bold text-gray-900">
            Upcoming Appointments
          </h3>
          <Link
            href="/patient/dashboard/appointments"
            className="text-sm font-semibold text-gray-700 transition hover:text-bgh-green"
          >
            View All
          </Link>
        </div>

        <div className="space-y-4 p-6">
          {appointments.map((appointment) => (
            <article
              key={`${appointment.doctor}-${appointment.date}`}
              className="flex flex-col gap-4 rounded-xl border border-gray-100 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-emerald-600">
                  <Calendar className="h-5 w-5" strokeWidth={2} />
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-gray-900">
                    {appointment.doctor}
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">{appointment.specialty}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                    <Clock3 className="h-3.5 w-3.5" strokeWidth={2} />
                    {appointment.date}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 sm:justify-end">
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold",
                    appointment.type === "Virtual"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-600"
                  )}
                >
                  {appointment.type}
                </span>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold",
                    appointment.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  )}
                >
                  {appointment.status}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PatientDashboardLayout>
  );
}
