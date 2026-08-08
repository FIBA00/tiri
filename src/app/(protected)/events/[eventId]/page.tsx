import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Users,
  QrCode,
  CheckCircle2,
  Clock,
  LogOut,
  XCircle,
  Mail,
  Send,
  Sparkles,
} from "lucide-react";
import { TemplatePreview } from "@/features/event/components/template-preview";

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
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12 flex flex-col gap-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-hairline pb-6">
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
          <Link href={`/events/${eventDetails.id}/check-in`}>
            <Button className="btn-seal inline-flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              Door Check-in Terminal
            </Button>
          </Link>
        </div>
      </div>

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
          <div className="rounded-xl overflow-hidden border border-hairline aspect-[21/9] w-full bg-paper">
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
        <div className="lg:col-span-2 card-surface p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-hairline pb-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-seal" />
              <h3 className="font-display text-lg font-semibold text-ink">
                Invited Guests ({eventDetails.invitations.length})
              </h3>
            </div>
          </div>

          {eventDetails.invitations.length === 0 ? (
            <div className="p-8 text-center text-muted text-sm border border-dashed border-hairline rounded-xl">
              No guests invited yet.
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {eventDetails.invitations.map(function RenderInviteItem(invite) {
                const config = STATUS_CONFIG[invite.status] || STATUS_CONFIG.PENDING;
                const Icon = config.icon;

                return (
                  <li
                    key={invite.id}
                    className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl border border-hairline bg-paper hover:border-seal/30 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-seal/10 text-seal flex items-center justify-center font-bold text-sm">
                        {invite.inviteeName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink">{invite.inviteeName}</p>
                        <p className="font-mono text-xs text-muted">
                          {invite.email ?? invite.phoneNumber ?? "No contact details"} · Passcode: {invite.code}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <Badge variant="outline" className={`text-xs flex items-center gap-1 ${config.badge}`}>
                        <Icon className="h-3 w-3" />
                        {config.label}
                      </Badge>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

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
