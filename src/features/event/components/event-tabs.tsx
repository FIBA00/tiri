"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, Users } from "lucide-react";

export function EventTabs({ eventId }: { eventId: string }) {
  const pathname = usePathname();

  const tabs = [
    {
      name: "Dashboard",
      href: `/events/${eventId}`,
      icon: LayoutDashboard,
      isActive: pathname === `/events/${eventId}`,
    },
    {
      name: "Guests",
      href: `/events/${eventId}/guests`,
      icon: Users,
      isActive: pathname === `/events/${eventId}/guests`,
    },
    {
      name: "Settings",
      href: `/events/${eventId}/settings`,
      icon: Settings,
      isActive: pathname === `/events/${eventId}/settings`,
    },
  ];

  return (
    <div className="flex items-center gap-6 border-b border-hairline mb-8">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              tab.isActive
                ? "border-seal text-seal"
                : "border-transparent text-muted hover:text-ink hover:border-hairline"
            }`}
          >
            <Icon className="h-4 w-4" />
            {tab.name}
          </Link>
        );
      })}
    </div>
  );
}
