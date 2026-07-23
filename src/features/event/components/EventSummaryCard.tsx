// src/features/event/components/EventSummaryCard.tsx
import Link from "next/link";

type EventSummaryCardProps = {
  eventId: string;
  eventName: string;
  date: string;
  inviteCount: number;
};

export function EventSummaryCard({
  eventId,
  eventName,
  date,
  inviteCount,
}: EventSummaryCardProps) {
  return (
    <Link
      href={`/events/${eventId}`}
      className="card-surface block p-6 hover:border-seal transition-colors"
    >
      <h3 className="font-display text-xl text-ink">{eventName}</h3>
      <p className="mt-1 text-sm text-muted">{date}</p>
      <p className="mt-4 text-sm text-muted">{inviteCount} guests invited</p>
    </Link>
  );
}