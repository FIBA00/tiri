import Link from "next/link";
import { Users, ArrowRight, Bookmark, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EventSummaryCardProps {
  eventId: string;
  eventName: string;
  date: string;
  rawDate: string;
  description?: string | null;
  location?: string | null;
  inviteCount: number;
  isDraft?: boolean;
}

export function EventSummaryCard({
  eventId,
  eventName,
  date,
  rawDate,
  location,
  inviteCount,
  isDraft = false,
}: EventSummaryCardProps) {
  const d = new Date(rawDate);
  const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = d.getDate();

  return (
    <Link href={`/events/${eventId}`} className="block h-full">
      <div className="card-surface group relative flex flex-col h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-seal/30 bg-paper">
        <div className="flex items-start gap-4">
          {/* Tear-off Calendar Graphic */}
          <div className="flex flex-col items-center justify-center min-w-[3.5rem] bg-paper-raised border border-hairline rounded-xl overflow-hidden shadow-sm">
            <div className="bg-seal/10 text-seal text-[0.65rem] font-bold uppercase tracking-wider w-full text-center py-1 border-b border-hairline">
              {month}
            </div>
            <div className="font-display text-xl font-bold text-ink py-2">
              {day}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-xl font-semibold text-ink truncate group-hover:text-seal transition-colors">
                {eventName}
              </h3>
              {isDraft && (
                <Badge variant="outline" className="border-gold/30 bg-gold/10 text-gold text-xs flex items-center gap-1 shrink-0">
                  <Bookmark className="h-3 w-3" />
                  Draft
                </Badge>
              )}
            </div>
            
            {location && (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted truncate">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{location}</span>
              </p>
            )}
          </div>
        </div>

        <div className="mt-auto pt-6 flex items-center justify-between border-t border-hairline mt-6">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted bg-paper-raised px-3 py-1.5 rounded-lg border border-hairline group-hover:border-seal/20 group-hover:text-ink transition-colors">
            <Users className="h-4 w-4" />
            {inviteCount} guest{inviteCount === 1 ? "" : "s"}
          </span>
          <div className="w-8 h-8 rounded-full bg-seal/10 flex items-center justify-center text-seal opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
