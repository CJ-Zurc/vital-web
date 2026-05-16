import Link from "next/link";
import {
  Calendar,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Paperclip,
  Search,
  Send,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";

const navItems = [
  { label: "Dashboard", href: "/patient/dashboard", icon: LayoutDashboard },
  { label: "Find Doctors", href: "/patient/dashboard/find-doctors", icon: Search },
  { label: "Appointments", href: "/patient/dashboard/appointments", icon: Calendar },
  { label: "Messages", href: "/patient/dashboard/messages", icon: MessageSquare, active: true },
  { label: "Prescriptions", href: "/patient/dashboard/prescriptions", icon: FileText },
  { label: "Health Records", href: "/patient/dashboard/health-records", icon: UserRound },
  { label: "Profile", href: "/patient/dashboard/profile", icon: UserRound },
];

const conversations = [
  {
    doctor: "Dr. Maria Santos",
    specialty: "Cardiology",
    preview: "Please continue taking your medication...",
    time: "10:30 AM",
    unread: 2,
    active: true,
  },
  {
    doctor: "Dr. Ramon Cruz",
    specialty: "General Practice",
    preview: "Your test results are ready for review.",
    time: "Yesterday",
  },
];

const messages = [
  {
    text: "Good morning, Doctor. I have been experiencing some chest discomfort.",
    time: "9:45 AM",
    sent: true,
  },
  {
    text: "Good morning. Can you describe the discomfort? Is it sharp, dull, or pressure-like?",
    time: "9:50 AM",
  },
  {
    text: "It feels like pressure, especially after physical activity.",
    time: "9:52 AM",
    sent: true,
  },
  {
    text: "I see. How long does this pressure last? And have you noticed any other symptoms?",
    time: "9:55 AM",
  },
  {
    text: "It usually lasts about 5-10 minutes. Sometimes I feel a bit short of breath.",
    time: "10:00 AM",
    sent: true,
  },
  {
    text: "Thank you for the information. Please continue taking your medication as prescribed. I would like to schedule a follow-up consultation next week to monitor your condition.",
    time: "10:30 AM",
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

export default function PatientMessagesPage() {
  return (
    <main className="min-h-screen bg-bgh-bg text-gray-900">
      <div className="flex min-h-screen">
        <PatientSidebar />

        <section className="w-full md:pl-64">
          <div className="h-screen w-full p-4">
            <section className="grid h-full overflow-hidden rounded-lg border border-gray-300 bg-white lg:grid-cols-[320px_1fr]">
              <aside className="min-h-0 border-b border-gray-300 lg:border-b-0 lg:border-r">
                <div className="border-b border-gray-200 p-4">
                  <h2 className="font-heading text-lg font-bold text-gray-950">Messages</h2>
                  <div className="relative mt-4">
                    <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                      aria-label="Search conversations"
                      placeholder="Search conversations..."
                      className="h-10 rounded-md pl-10"
                    />
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto lg:max-h-none">
                  {conversations.map((conversation) => (
                    <button
                      key={conversation.doctor}
                      className={cn(
                        "flex w-full items-start justify-between gap-3 border-b border-gray-200 px-4 py-5 text-left transition hover:bg-gray-50",
                        conversation.active && "bg-gray-50"
                      )}
                    >
                      <span className="min-w-0">
                        <span className="block font-heading text-lg font-bold text-gray-950">
                          {conversation.doctor}
                        </span>
                        <span className="mt-2 block text-xs text-gray-600">{conversation.specialty}</span>
                        <span className="mt-2 flex items-center gap-2 text-sm text-gray-700">
                          <span className="truncate">{conversation.preview}</span>
                          {conversation.unread && (
                            <span className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-bgh-green px-1.5 text-xs font-semibold text-white">
                              {conversation.unread}
                            </span>
                          )}
                        </span>
                      </span>
                      <span className="shrink-0 text-xs text-gray-600">{conversation.time}</span>
                    </button>
                  ))}
                </div>
              </aside>

              <div className="flex min-h-0 flex-col">
                <header className="border-b border-gray-300 px-4 py-5">
                  <h3 className="font-heading text-lg font-bold text-gray-950">Dr. Maria Santos</h3>
                  <p className="mt-1 text-sm text-gray-600">Cardiology</p>
                </header>

                <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={`${message.time}-${message.text}`}
                        className={cn("flex", message.sent ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[min(450px,82vw)] rounded-md px-4 py-3 text-sm leading-relaxed",
                            message.sent
                              ? "bg-bgh-green text-white"
                              : "bg-gray-200 text-gray-950"
                          )}
                        >
                          <p className="font-semibold">{message.text}</p>
                          <p className={cn("mt-1 text-xs", message.sent ? "text-white/90" : "text-gray-600")}>
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <footer className="border-t border-gray-300 p-4">
                  <div className="flex items-center gap-3">
                    <Button
                      aria-label="Attach file"
                      className="h-10 w-10 shrink-0 rounded-md bg-transparent p-0 text-gray-600 hover:bg-gray-100 hover:text-bgh-dark"
                    >
                      <Paperclip className="h-5 w-5" strokeWidth={1.8} />
                    </Button>
                    <Input
                      aria-label="Type your message"
                      placeholder="Type your message..."
                      className="h-11 rounded-md py-0 text-base"
                    />
                    <Button className="h-11 shrink-0 rounded-md px-4 py-0 text-sm">
                      <Send className="h-4 w-4" strokeWidth={1.8} />
                      Send
                    </Button>
                  </div>
                </footer>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
