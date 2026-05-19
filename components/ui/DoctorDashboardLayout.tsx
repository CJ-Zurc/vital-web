import Link from "next/link";
import type { ReactNode } from "react";
import {
  Calendar,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  MessageSquare,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export type DoctorNavHref =
  | "/doctor/dashboard"
  | "/doctor/dashboard/schedule"
  | "/doctor/dashboard/appointment-request"
  | "/doctor/dashboard/messages";

type DoctorNavItem = {
  label: string;
  href: DoctorNavHref;
  icon: LucideIcon;
};

type DoctorDashboardLayoutProps = {
  activeHref: DoctorNavHref;
  children: ReactNode;
  contentClassName?: string;
};

const navItems: DoctorNavItem[] = [
  { label: "Dashboard", href: "/doctor/dashboard", icon: LayoutDashboard },
  { label: "Schedule", href: "/doctor/dashboard/schedule", icon: Calendar },
  {
    label: "Appointment Requests",
    href: "/doctor/dashboard/appointment-request",
    icon: ClipboardList,
  },
  { label: "Messages", href: "/doctor/dashboard/messages", icon: MessageSquare },
];

function DoctorSidebar({ activeHref }: { activeHref: DoctorNavHref }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col bg-bgh-dark text-white md:flex">
      <div className="px-6 pb-7 pt-6">
        <Link href="/doctor/dashboard" className="block">
          <h1 className="font-heading text-xl font-bold leading-none">VITAL</h1>
          <p className="mt-2 text-xs text-white/70">Doctor Portal</p>
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

export function DoctorDashboardLayout({
  activeHref,
  children,
  contentClassName = "w-full px-5 py-7 sm:px-8 lg:px-10",
}: DoctorDashboardLayoutProps) {
  return (
    <main className="min-h-screen bg-bgh-bg text-gray-900">
      <div className="flex min-h-screen">
        <DoctorSidebar activeHref={activeHref} />

        <section className="w-full md:pl-64">
          <div className={contentClassName}>{children}</div>
        </section>
      </div>
    </main>
  );
}
