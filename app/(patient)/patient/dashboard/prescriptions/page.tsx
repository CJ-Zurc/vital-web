import {
  ClipboardCopy,
  Download,
  Eye,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  PatientDashboardLayout,
  PatientPageHeader,
} from "@/components/ui/PatientDashboardLayout";

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

export default function PatientPrescriptionsPage() {
  return (
    <PatientDashboardLayout activeHref="/patient/dashboard/prescriptions">
      <PatientPageHeader
        title="Prescriptions & Medical Certificates"
        description="Access and download your medical documents"
      />

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
    </PatientDashboardLayout>
  );
}
