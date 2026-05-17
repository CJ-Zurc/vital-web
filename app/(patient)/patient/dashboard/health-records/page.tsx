import {
  Calendar,
  Download,
  Eye,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  PatientDashboardLayout,
  PatientPageHeader,
} from "@/components/ui/PatientDashboardLayout";

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

export default function HealthRecordsPage() {
  return (
    <PatientDashboardLayout activeHref="/patient/dashboard/health-records">
      <PatientPageHeader
        title="Health Records"
        description="Your complete medical history and test results"
      />

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
    </PatientDashboardLayout>
  );
}
