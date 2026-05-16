import Link from "next/link";
import {
  Calendar,
  ClipboardCopy,
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
  { label: "Prescriptions", href: "/patient/dashboard/prescriptions", icon: FileText, active: true },
  { label: "Health Records", href: "/patient/dashboard/health-records", icon: UserRound },
  { label: "Profile", href: "/patient/dashboard/profile", icon: UserRound },
];

const documents = [
  {
    type: "Prescription",
    doctor: "Dr. Maria Santos",
    date: "2026-04-15",
    code: "RX-2026-001234",
    sectionTitle: "Medications:",
    details: ["Amlodipine 5mg - 1 tablet daily", "Aspirin 80mg - 1 tablet daily"],
  },
  {
    type: "Medical Certificate",
    doctor: "Dr. Ramon Cruz",
    date: "2026-03-28",
    code: "MC-2026-005678",
    sectionTitle: "Purpose:",
    details: ["Fit to work"],
    note: "Valid until: 2026-04-28",
  },
  {
    type: "Prescription",
    doctor: "Dr. Ana Reyes",
    date: "2026-03-15",
    code: "RX-2026-009821",
    sectionTitle: "Medications:",
    details: ["Cetirizine 10mg - 1 tablet daily", "Saline nasal spray - as needed"],
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

export default function PatientPrescriptionsPage() {
  return (
    <main className="min-h-screen bg-bgh-bg text-gray-900">
      <div className="flex min-h-screen">
        <PatientSidebar />

        <section className="w-full md:pl-64">
          <div className="w-full px-5 py-8 sm:px-8 lg:px-10">
            <header className="mb-8">
              <h2 className="font-heading text-3xl font-bold tracking-normal text-gray-900">
                Prescriptions &amp; Medical Certificates
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Access and download your medical documents
              </p>
            </header>

            <section className="space-y-4">
              {documents.map((document) => (
                <article
                  key={document.code}
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
                            {document.type}
                          </h3>
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            Active
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">Issued by {document.doctor}</p>
                        <p className="mt-1 text-xs text-gray-600">Date: {document.date}</p>
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

                  <div className="mt-6 rounded-md bg-gray-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Unique Access Code</p>
                        <p className="mt-2 font-mono text-sm font-bold text-gray-950">
                          {document.code}
                        </p>
                      </div>
                      <Button className="h-8 rounded-md bg-transparent px-2 py-0 text-sm text-gray-600 hover:bg-gray-100 hover:text-bgh-dark">
                        <ClipboardCopy className="h-4 w-4" strokeWidth={1.8} />
                        Copy
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 rounded-md bg-emerald-50/60 p-4 text-sm">
                    <p className="font-bold text-gray-950">{document.sectionTitle}</p>
                    <div className="mt-3 space-y-2 text-gray-950">
                      {document.details.map((detail) => (
                        <p key={detail}>
                          {document.sectionTitle === "Medications:" && (
                            <span className="mr-2 text-bgh-green">.</span>
                          )}
                          {detail}
                        </p>
                      ))}
                    </div>
                    {document.note && <p className="mt-4 text-xs text-gray-600">{document.note}</p>}
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
