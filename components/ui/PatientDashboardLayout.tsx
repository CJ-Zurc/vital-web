import Link from "next/link";
import type { ReactNode } from "react";
import {
  Calendar,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Search,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export type PatientNavHref =
  | "/patient/dashboard"
  | "/patient/dashboard/find-doctors"
  | "/patient/dashboard/appointments"
  | "/patient/dashboard/messages"
  | "/patient/dashboard/prescriptions"
  | "/patient/dashboard/health-records"
  | "/patient/dashboard/profile";

type PatientNavItem = {
  label: string;
  href: PatientNavHref;
  icon: LucideIcon;
};

type PatientDashboardLayoutProps = {
  activeHref: PatientNavHref;
  children: ReactNode;
  contentClassName?: string;
};

type PatientPageHeaderProps = {
  title: string;
  description: string;
};

const navItems: PatientNavItem[] = [
  { label: "Dashboard", href: "/patient/dashboard", icon: LayoutDashboard },
  { label: "Find Doctors", href: "/patient/dashboard/find-doctors", icon: Search },
  { label: "Appointments", href: "/patient/dashboard/appointments", icon: Calendar },
  { label: "Messages", href: "/patient/dashboard/messages", icon: MessageSquare },
  { label: "Prescriptions", href: "/patient/dashboard/prescriptions", icon: FileText },
  { label: "Health Records", href: "/patient/dashboard/health-records", icon: UserRound },
  { label: "Profile", href: "/patient/dashboard/profile", icon: UserRound },
];

function PatientSidebar({ activeHref }: { activeHref: PatientNavHref }) {
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
                item.href === activeHref && "bg-bgh-green text-white shadow-sm"
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

export function PatientDashboardLayout({
  activeHref,
  children,
  contentClassName = "w-full px-5 py-8 sm:px-8 lg:px-10",
}: PatientDashboardLayoutProps) {
  return (
    <main className="min-h-screen bg-bgh-bg text-gray-900">
      <div className="flex min-h-screen">
        <PatientSidebar activeHref={activeHref} />

        <section className="w-full md:pl-64">
          <div className={contentClassName}>{children}</div>
        </section>
      </div>
    </main>
  );
}

export function PatientPageHeader({ title, description }: PatientPageHeaderProps) {
  return (
    <header className="mb-8">
      <h2 className="font-heading text-3xl font-bold tracking-normal text-gray-900">
        {title}
      </h2>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
    </header>
  );
}
