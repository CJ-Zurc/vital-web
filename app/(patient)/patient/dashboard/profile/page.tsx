import {
  PatientDashboardLayout,
  PatientPageHeader,
} from "@/components/ui/PatientDashboardLayout";

export default function PatientProfilePage() {
  return (
    <PatientDashboardLayout activeHref="/patient/dashboard/profile">
      <PatientPageHeader title="Profile" description="Your profile page is ready." />
    </PatientDashboardLayout>
  );
}
