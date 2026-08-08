import Link from "next/link";
import { Calendar, Users, ArrowRight, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EventSummaryCardProps {
  eventId: string;
  eventName: string;
  date: string;
  inviteCount: number;
  isDraft?: boolean;
}

export function EventSummaryCard({
  eventId,
  eventName,
  date,
  inviteCount,
  isDraft = false,
}: EventSummaryCardProps) {
  return (
    <Link
      href={`/events/${eventId}`}
      className="card-surface group block p-6 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-seal/10 text-seal">
          <Calendar className="h-5 w-5" />
        </div>
        <div className="flex items-center gap-2">
          {isDraft ? (
            <Badge variant="outline" className="border-gold/30 bg-gold/10 text-gold text-xs flex items-center gap-1">
              <Bookmark className="h-3 w-3" />
              Draft
            </Badge>
          ) : null}
          <ArrowRight className="h-4 w-4 text-muted opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1" />
        </div>
      </div>

      <h3 className="mt-4 font-display text-xl font-semibold text-ink">{eventName}</h3>

      <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
        <Calendar className="h-3.5 w-3.5" />
        {date}
      </p>

      <div className="mt-4 flex items-center gap-1.5 text-sm text-muted">
        <Users className="h-3.5 w-3.5" />
        {inviteCount} guest{inviteCount === 1 ? "" : "s"} invited
      </div>
    </Link>
  );
}
