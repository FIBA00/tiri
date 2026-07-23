// src/app/dashboard/page.tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { GetEvents } from "@/features/event/services/get-events";
import { EventSummaryCard } from "@/features/event/components/EventSummaryCard";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/auth/sign-in");
  }

  const { data: events } = await GetEvents(
    { page: 1, limit: 20, sort: "date", order: "desc" },
    session.user.id,
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-display text-3xl text-ink">Dashboard</h1>
      {events.length === 0 ? (
        <p className="mt-8 text-muted">No events yet.</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventSummaryCard
              key={event.id}
              eventId={event.id}
              eventName={event.name}
              date={new Date(event.date).toLocaleDateString()}
              inviteCount={event._count.invitations}
            />
          ))}
        </div>
      )}
    </div>
  );
}
