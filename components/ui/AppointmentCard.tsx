import { Building2, Calendar, Clock3, MoreVertical, Video } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export type Appointment = {
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  type: "Virtual" | "In-Person";
  status: "Approved" | "Pending" | "Completed" | "Cancelled" | "Rejected";
  complaint: string;
  rejectionReason?: string;
};

type AppointmentCardProps = {
  appointment: Appointment;
};

const statusStyles: Record<Appointment["status"], string> = {
  Approved: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-gray-200 text-gray-600",
  Rejected: "bg-red-100 text-bgh-red",
};

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  const VisitIcon = appointment.type === "Virtual" ? Video : Building2;

  return (
    <article className="rounded-lg border border-gray-300 bg-white p-6">
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
}
