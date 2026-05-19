import { FindDoctorsPanel } from "@/components/ui/FindDoctorsPanel";
import { PatientDashboardLayout } from "@/components/ui/PatientDashboardLayout";

export default function FindDoctorsPage() {
  return (
    <PatientDashboardLayout activeHref="/patient/dashboard/find-doctors">
      <FindDoctorsPanel />
    </PatientDashboardLayout>
  );
}
