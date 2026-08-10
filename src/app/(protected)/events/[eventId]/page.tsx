import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  CheckCircle2,
  Clock,
  LogOut,
  XCircle,
  MapPin,
  Mail,
} from "lucide-react";
import { TemplatePreview } from "@/features/event/components/template-preview";
import { EventGuestList } from "@/features/invite/components/event-guest-list";

const STATUS_CONFIG: Record<
  string,
  { label: string; icon: any; color: string; badge: string }
> = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    badge: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  ENTERED: {
    label: "Checked In",
    icon: CheckCircle2,
    color: "text-emerald bg-emerald/10 border-emerald/20",
    badge: "bg-emerald/10 text-emerald border-emerald/20",
  },
  EXITED: {
    label: "Exited",
    icon: LogOut,
    color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    badge: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  CANCELED: {
    label: "Canceled",
    icon: XCircle,
    color: "text-seal bg-seal/10 border-seal/20",
    badge: "bg-seal/10 text-seal border-seal/20",
  },
};

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    redirect("/auth/sign-in");
  }

  const eventDetails = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      invitations: true,
      template: true,
    },
  });

  if (!eventDetails || eventDetails.userId !== session.user.id) {
    notFound();
  }

  const statusCounts = eventDetails.invitations.reduce(function Tally(
    acc: Record<string, number>,
    invite,
  ) {
    acc[invite.status] = (acc[invite.status] ?? 0) + invite.quantity;
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {Object.entries(STATUS_CONFIG).map(function RenderStatCard([key, config]) {
          const count = statusCounts[key] ?? 0;
          const Icon = config.icon;

          return (
            <div key={key} className="card-surface p-5 flex items-center justify-between">
              <div>
                <p className="font-display text-3xl font-bold text-ink">{count}</p>
                <p className="text-xs font-medium text-muted mt-1">{config.label}</p>
              </div>
              <div className={`p-3 rounded-2xl ${config.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      {eventDetails.latitude && eventDetails.longitude ? (
        <div className="card-surface p-6 flex flex-col gap-4">
          <h3 className="font-display text-base font-semibold text-ink flex items-center gap-2">
            <MapPin className="h-4 w-4 text-seal" />
            Geospatial Map Coordinates
          </h3>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted mb-2">
            <span>Latitude: {eventDetails.latitude}</span>
            <span>Longitude: {eventDetails.longitude}</span>
          </div>
          <div className="rounded-xl overflow-hidden border border-hairline shadow-sm aspect-[21/9] w-full bg-paper relative z-0">
            <iframe
              title="Event Location Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              src={`https://maps.google.com/maps?q=${eventDetails.latitude},${eventDetails.longitude}&z=15&output=embed`}
            />
          </div>
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-3">
        <EventGuestList invitations={eventDetails.invitations} />

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-seal" />
            <h3 className="font-display text-lg font-semibold text-ink">Email Template Used</h3>
          </div>
          <TemplatePreview
            html={eventDetails.template?.html}
            eventName={eventDetails.name}
            date={new Date(eventDetails.date).toLocaleString()}
            location={eventDetails.location || undefined}
            description={eventDetails.description || undefined}
          />
        </div>
      </div>
    </div>
  );
}
