import {
  AppointmentCard,
  type Appointment,
} from "@/components/ui/AppointmentCard";
import { AppointmentStatusFilter } from "@/components/ui/AppointmentStatusFilter";
import {
  PatientDashboardLayout,
  PatientPageHeader,
} from "@/components/ui/PatientDashboardLayout";

const appointments: Appointment[] = [
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

export default function PatientAppointmentsPage() {
  return (
    <PatientDashboardLayout activeHref="/patient/dashboard/appointments">
      <PatientPageHeader
        title="Appointment History"
        description="View and manage your appointments"
      />

      <AppointmentStatusFilter />

      <section className="mt-6 space-y-4">
        {appointments.map((appointment, index) => (
          <AppointmentCard
            key={`${appointment.doctor}-${appointment.date}-${index}`}
            appointment={appointment}
          />
        ))}
      </section>
    </PatientDashboardLayout>
  );
}
