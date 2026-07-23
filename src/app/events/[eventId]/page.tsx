// src/app/events/[eventId]/page.tsx
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  ENTERED: "Checked in",
  EXITED: "Exited",
  CANCELED: "Canceled",
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

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      invitations: true,
    },
  });

  if (!event || event.userId !== session.user.id) {
    notFound();
  }

  const statusCounts = event.invitations.reduce(function tally(
    acc: Record<string, number>,
    invite,
  ) {
    acc[invite.status] = (acc[invite.status] ?? 0) + invite.quantity;
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-4xl">
      <p className="eyebrow mb-1">Event</p>
      <h1 className="font-display text-3xl text-ink">{event.name}</h1>
      <p className="mt-1 text-sm text-muted">
        {new Date(event.date).toLocaleString()}
      </p>
      {event.location ? (
        <p className="text-sm text-muted">{event.location}</p>
      ) : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        {Object.entries(STATUS_LABELS).map(function renderStat([key, label]) {
          return (
            <div key={key} className="card-surface p-4">
              <p className="font-display text-2xl text-ink">
                {statusCounts[key] ?? 0}
              </p>
              <p className="eyebrow mt-1">{label}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-10 card-surface p-6">
        <p className="eyebrow mb-4">
          {event.invitations.length} invite
          {event.invitations.length === 1 ? "" : "s"}
        </p>
        {event.invitations.length === 0 ? (
          <p className="text-sm text-muted">No invites sent yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {event.invitations.map(function renderInvite(invite) {
              return (
                <li
                  key={invite.id}
                  className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-paper"
                >
                  <div>
                    <p className="text-sm text-ink">{invite.inviteeName}</p>
                    <p className="font-mono text-xs text-muted">
                      {invite.email ?? invite.phoneNumber ?? "no contact"} ·
                      code {invite.code}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-muted uppercase">
                    {invite.status} · ×{invite.quantity}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <a
        href={`/events/${event.id}/check-in`}
        className="btn-seal mt-8 inline-flex"
      >
        Open check-in terminal
      </a>
    </div>
  );
}
