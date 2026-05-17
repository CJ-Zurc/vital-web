import { Select } from "@/components/ui/Select";

const statusOptions = [
  { value: "all", label: "All Appointments" },
  { value: "approved", label: "Approved" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "rejected", label: "Rejected" },
];

export function AppointmentStatusFilter() {
  return (
    <section className="rounded-lg border border-gray-300 bg-white p-4 sm:p-6">
      <Select
        label="Filter by Status"
        defaultValue="all"
        options={statusOptions}
        className="h-10 rounded-md py-0 text-base sm:max-w-xs"
      />
    </section>
  );
}
