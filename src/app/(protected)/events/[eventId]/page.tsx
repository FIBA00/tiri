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
    <div className="flex flex-col gap-8 pb-12">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {Object.entries(STATUS_CONFIG).map(function RenderStatCard([key, config]) {
          const count = statusCounts[key] ?? 0;
          const Icon = config.icon;

          return (
            <div key={key} className="bg-paper-raised border border-hairline rounded-2xl p-6 flex items-center justify-between shadow-sm transition-transform hover:-translate-y-1 duration-300">
              <div>
                <p className="font-display text-3xl font-bold text-ink">{count}</p>
                <p className="text-sm font-medium text-muted mt-1">{config.label}</p>
              </div>
              <div className={`p-4 rounded-2xl ${config.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-8">
          <EventGuestList invitations={eventDetails.invitations} />
          
          {eventDetails.latitude && eventDetails.longitude ? (
            <div className="bg-paper-raised border border-hairline rounded-2xl p-6 md:p-8 flex flex-col gap-6 shadow-sm">
              <h3 className="font-display text-xl font-bold text-ink flex items-center gap-3">
                <div className="p-2 bg-seal/10 rounded-lg">
                  <MapPin className="h-5 w-5 text-seal" />
                </div>
                Event Location
              </h3>
              <div className="rounded-2xl overflow-hidden border border-hairline shadow-inner aspect-video w-full bg-paper relative z-0">
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
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-paper-raised border border-hairline rounded-2xl p-6 md:p-8 flex flex-col gap-6 shadow-sm sticky top-24">
            <h3 className="font-display text-xl font-bold text-ink flex items-center gap-3">
              <div className="p-2 bg-seal/10 rounded-lg">
                <Mail className="h-5 w-5 text-seal" />
              </div>
              Email Template
            </h3>
            <div className="w-full aspect-[3/4] max-h-[600px] overflow-hidden rounded-xl border border-hairline">
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
      </div>
    </div>
  );
}
