import Link from "next/link";
import {
  Building2,
  Calendar,
  Clock3,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  MoreVertical,
  Search,
  UserRound,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/cn";

const navItems = [
  { label: "Dashboard", href: "/patient/dashboard", icon: LayoutDashboard },
  { label: "Find Doctors", href: "/patient/dashboard/find-doctors", icon: Search },
  { label: "Appointments", href: "/patient/dashboard/appointments", icon: Calendar, active: true },
  { label: "Messages", href: "/patient/dashboard/messages", icon: MessageSquare },
  { label: "Prescriptions", href: "/patient/dashboard/prescriptions", icon: FileText },
  { label: "Health Records", href: "/patient/dashboard/health-records", icon: UserRound },
  { label: "Profile", href: "/patient/dashboard/profile", icon: UserRound },
];

const statusOptions = [
  { value: "all", label: "All Appointments" },
  { value: "approved", label: "Approved" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "rejected", label: "Rejected" },
];

const appointments = [
  {
    doctor: "Dr. Maria Santos",
    specialty: "Cardiology",
    date: "2026-04-20",
    time: "10:00 AM",
    type: "Virtual",
    status: "Approved",
    complaint: "Chest pain and palpitations",
  },
  {
    doctor: "Dr. Ramon Cruz",
    specialty: "General Practice",
    date: "2026-04-22",
    time: "2:00 PM",
    type: "In-Person",
    status: "Pending",
    complaint: "Annual checkup",
  },
  {
    doctor: "Dr. Ana Reyes",
    specialty: "Pediatrics",
    date: "2026-04-15",
    time: "11:00 AM",
    type: "Virtual",
    status: "Completed",
    complaint: "Follow-up consultation",
  },
  {
    doctor: "Dr. Jose Garcia",
    specialty: "Dermatology",
    date: "2026-04-10",
    time: "3:00 PM",
    type: "Virtual",
    status: "Cancelled",
    complaint: "Skin rash",
  },
  {
    doctor: "Dr. Maria Santos",
    specialty: "Cardiology",
    date: "2026-03-28",
    time: "9:00 AM",
    type: "In-Person",
    status: "Rejected",
    complaint: "Heart rate concern",
    rejectionReason: "Please book an in-person consultation for this concern.",
  },
];

const statusStyles: Record<string, string> = {
  Approved: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-gray-200 text-gray-600",
  Rejected: "bg-red-100 text-bgh-red",
};

function PatientSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col bg-bgh-dark text-white md:flex">
      <div className="px-6 pb-7 pt-6">
        <Link href="/patient/dashboard" className="block">
          <h1 className="font-heading text-xl font-bold leading-none">VITAL</h1>
          <p className="mt-2 text-xs text-white/70">Patient Portal</p>
        </Link>
      </div>

      <nav className="flex-1 space-y-2 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex h-12 items-center gap-3 rounded-md px-4 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white",
                item.active && "bg-bgh-green text-white shadow-sm"
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={1.8} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <Button
          variant="primary"
          className="h-11 w-full justify-start rounded-md bg-transparent px-4 py-0 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-5 w-5" strokeWidth={1.8} />
          Logout
        </Button>
      </div>
    </aside>
  );
}

export default function PatientAppointmentsPage() {
  return (
    <main className="min-h-screen bg-bgh-bg text-gray-900">
      <div className="flex min-h-screen">
        <PatientSidebar />

        <section className="w-full md:pl-64">
          <div className="w-full px-5 py-8 sm:px-8 lg:px-10">
            <header className="mb-8">
              <h2 className="font-heading text-3xl font-bold tracking-normal text-gray-900">
                Appointment History
              </h2>
              <p className="mt-2 text-sm text-gray-500">View and manage your appointments</p>
            </header>

            <section className="rounded-lg border border-gray-300 bg-white p-4 sm:p-6">
              <Select
                label="Filter by Status"
                defaultValue="all"
                options={statusOptions}
                className="h-10 rounded-md py-0 text-base sm:max-w-xs"
              />
            </section>

            <section className="mt-6 space-y-4">
              {appointments.map((appointment, index) => {
                const VisitIcon = appointment.type === "Virtual" ? Video : Building2;

                return (
                  <article
                    key={`${appointment.doctor}-${appointment.date}-${index}`}
                    className="rounded-lg border border-gray-300 bg-white p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-bgh-green">
                        <VisitIcon className="h-5 w-5" strokeWidth={2} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-heading text-lg font-bold text-gray-950">
                              {appointment.doctor}
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">{appointment.specialty}</p>
                          </div>

                          <div className="flex items-center gap-4">
                            <span
                              className={cn(
                                "rounded-full px-3 py-1 text-xs font-semibold",
                                statusStyles[appointment.status]
                              )}
                            >
                              {appointment.status}
                            </span>
                            <Button
                              aria-label="Appointment actions"
                              className="h-8 w-8 rounded-md bg-transparent p-0 text-gray-600 hover:bg-gray-100 hover:text-bgh-dark"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 text-sm text-gray-950 md:grid-cols-3">
                      <p className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" strokeWidth={1.8} />
                        {appointment.date}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-gray-500" strokeWidth={1.8} />
                        {appointment.time}
                      </p>
                      <p>
                        <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-gray-700">
                          {appointment.type}
                        </span>
                      </p>
                    </div>

                    <div className="mt-5 rounded-md bg-gray-50 p-4 text-sm">
                      <p className="text-gray-600">Chief Complaint:</p>
                      <p className="mt-2 text-gray-950">{appointment.complaint}</p>
                      {appointment.rejectionReason && (
                        <div className="mt-3 text-bgh-red">
                          <p>Rejection Reason:</p>
                          <p className="mt-2">{appointment.rejectionReason}</p>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
