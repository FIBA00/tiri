import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, QrCode } from "lucide-react";
import { EventPublishButton } from "@/features/event/components/event-publish-button";
import { EventTabs } from "@/features/event/components/event-tabs";

export default async function EventLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    redirect("/auth/sign-in");
  }

  const eventDetails = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!eventDetails || eventDetails.userId !== session.user.id) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12 flex flex-col">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="border-seal/30 bg-seal/10 text-seal text-xs">
              Event Management
            </Badge>
            {eventDetails.isDraft ? (
              <Badge variant="outline" className="border-gold/30 bg-gold/10 text-gold text-xs">
                Draft Event
              </Badge>
            ) : null}
          </div>
          <h1 className="font-display text-3xl font-bold text-ink">{eventDetails.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-seal" />
              {new Date(eventDetails.date).toLocaleString("en-US", {
                dateStyle: "full",
                timeStyle: "short",
              })}
            </span>
            {eventDetails.location ? (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-emerald" />
                {eventDetails.location}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {eventDetails.isDraft ? (
            <EventPublishButton eventId={eventDetails.id} />
          ) : null}
          <Link href={`/check-in/${eventDetails.id}`}>
            <Button variant={eventDetails.isDraft ? "outline" : "default"} className={eventDetails.isDraft ? "" : "btn-seal inline-flex items-center gap-2"}>
              <QrCode className="h-4 w-4 mr-2" />
              Door Check-in Terminal
            </Button>
          </Link>
        </div>
      </div>

      <EventTabs eventId={eventId} />

      <div>
        {children}
      </div>
    </div>
  );
}
