import Link from "next/link";
import { redirect } from "next/navigation";
import { GetEvents } from "@/features/event/services/get-events";
import { EventSummaryCard } from "@/features/event/components/event-summary-card";
import { GetServerSession } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { CalendarPlus, Sparkles } from "lucide-react";

export default async function DashboardPage() {
  const session = await GetServerSession();
  if (!session?.user?.id) {
    redirect("/auth/sign-in");
  }

  const { data: events } = await GetEvents(
    { page: 1, limit: 20, sort: "date", order: "desc" },
    session.user.id,
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12 flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-hairline pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-seal/10 text-seal text-xs font-semibold mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            Organizer Dashboard
          </div>
          <h1 className="font-display text-3xl font-bold text-ink">
            Welcome back, {session.user.name || "Organizer"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            Manage your events, check-in invites, and custom email templates.
          </p>
        </div>

        <Link href="/events/new">
          <Button className="btn-seal inline-flex items-center gap-2 px-6">
            <CalendarPlus className="h-4 w-4" />
            Create New Event
          </Button>
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="card-surface p-12 text-center flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-seal/10 text-seal flex items-center justify-center">
            <CalendarPlus className="h-8 w-8" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-ink">No Events Created Yet</h3>
            <p className="text-sm text-muted max-w-sm mt-1">
              Start by creating your first event invitation and building your guest list.
            </p>
          </div>
          <Link href="/events/new">
            <Button className="btn-seal mt-2 inline-flex items-center gap-2">
              <CalendarPlus className="h-4 w-4" />
              Create Your First Event
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((eventItem) => (
            <EventSummaryCard
              key={eventItem.id}
              eventId={eventItem.id}
              eventName={eventItem.name}
              date={new Date(eventItem.date).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
              inviteCount={eventItem._count.invitations}
              isDraft={eventItem.isDraft}
            />
          ))}
        </div>
      )}
    </div>
  );
}
