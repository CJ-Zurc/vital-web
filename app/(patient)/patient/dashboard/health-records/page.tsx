import Link from "next/link";
import {
  Calendar,
  Download,
  Eye,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Search,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const navItems = [
  { label: "Dashboard", href: "/patient/dashboard", icon: LayoutDashboard },
  { label: "Find Doctors", href: "/patient/dashboard/find-doctors", icon: Search },
  { label: "Appointments", href: "/patient/dashboard/appointments", icon: Calendar },
  { label: "Messages", href: "/patient/dashboard/messages", icon: MessageSquare },
  { label: "Prescriptions", href: "/patient/dashboard/prescriptions", icon: FileText },
  { label: "Health Records", href: "/patient/dashboard/health-records", icon: UserRound, active: true },
  { label: "Profile", href: "/patient/dashboard/profile", icon: UserRound },
];

const stats = [
  { label: "Total Records", value: "12", icon: FileText },
  { label: "Consultations", value: "8", icon: Calendar },
  { label: "Lab Results", value: "4", icon: FileText },
];

const records = [
  {
    title: "Cardiology Consultation",
    type: "Consultation",
    doctor: "Dr. Maria Santos",
    date: "2026-04-15",
    diagnosis: "Hypertension, Stage 1",
    notes: "Patient shows improvement with current medication regimen.",
  },
  {
    title: "Complete Blood Count",
    type: "Lab Result",
    doctor: "Dr. Ramon Cruz",
    date: "2026-04-10",
    results: "All values within normal range",
  },
  {
    title: "General Checkup",
    type: "Consultation",
    doctor: "Dr. Ramon Cruz",
    date: "2026-03-28",
    diagnosis: "General health assessment",
    notes: "Vitals stable. Continue regular exercise and balanced diet.",
  },
];

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
        <Button className="h-11 w-full justify-start rounded-md bg-transparent px-4 py-0 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white">
          <LogOut className="h-5 w-5" strokeWidth={1.8} />
          Logout
        </Button>
      </div>
    </aside>
  );
}

export default function HealthRecordsPage() {
  return (
    <main className="min-h-screen bg-bgh-bg text-gray-900">
      <div className="flex min-h-screen">
        <PatientSidebar />

        <section className="w-full md:pl-64">
          <div className="w-full px-5 py-8 sm:px-8 lg:px-10">
            <header className="mb-8">
              <h2 className="font-heading text-3xl font-bold tracking-normal text-gray-900">
                Health Records
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Your complete medical history and test results
              </p>
            </header>

            <section className="grid gap-4 lg:grid-cols-3">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <article
                    key={stat.label}
                    className="flex min-h-28 items-center gap-4 rounded-lg border border-gray-300 bg-white p-6"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-bgh-green">
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="font-heading text-2xl font-bold leading-none text-gray-950">
                        {stat.value}
                      </p>
                      <p className="mt-2 text-sm text-gray-600">{stat.label}</p>
                    </div>
                  </article>
                );
              })}
            </section>

            <section className="mt-6 space-y-4">
              {records.map((record) => (
                <article
                  key={`${record.title}-${record.date}`}
                  className="rounded-lg border border-gray-300 bg-white p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-bgh-green">
                        <FileText className="h-6 w-6" strokeWidth={1.8} />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-heading text-lg font-bold text-gray-950">
                            {record.title}
                          </h3>
                          <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-600">
                            {record.type}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">By {record.doctor}</p>
                        <p className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                          <Calendar className="h-3.5 w-3.5" strokeWidth={1.8} />
                          {record.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 sm:justify-end">
                      <Button
                        variant="secondary"
                        className="h-9 rounded-md border border-gray-300 px-4 py-0 text-sm"
                      >
                        <Eye className="h-4 w-4" strokeWidth={1.8} />
                        View
                      </Button>
                      <Button className="h-9 rounded-md px-4 py-0 text-sm">
                        <Download className="h-4 w-4" strokeWidth={1.8} />
                        Download
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6 rounded-md bg-gray-50 p-4 text-sm text-gray-950">
                    {record.results ? (
                      <>
                        <p className="font-bold">Results:</p>
                        <p className="mt-2">{record.results}</p>
                      </>
                    ) : (
                      <>
                        <p className="font-bold">Diagnosis:</p>
                        <p className="mt-2">{record.diagnosis}</p>
                        <p className="mt-4 font-bold">Notes:</p>
                        <p className="mt-2">{record.notes}</p>
                      </>
                    )}
                  </div>
                </article>
              ))}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
