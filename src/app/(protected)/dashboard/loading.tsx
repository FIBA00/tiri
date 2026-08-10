import { CalendarPlus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12 flex flex-col gap-12">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/10 text-muted text-xs font-semibold w-fit">
            <Sparkles className="h-3.5 w-3.5" />
            Organizer Dashboard
          </div>
          <div className="h-10 w-64 bg-muted/20 animate-pulse rounded-lg" />
          <div className="h-4 w-96 max-w-full bg-muted/20 animate-pulse rounded" />
          <div className="h-4 w-80 max-w-full bg-muted/20 animate-pulse rounded" />
        </div>

        <Button disabled className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-6 text-base h-auto opacity-70">
          <CalendarPlus className="h-5 w-5" />
          Create New Event
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card-surface flex flex-col h-full p-6 bg-paper border border-hairline rounded-2xl animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-[3.5rem] h-16 bg-muted/20 rounded-xl" />
              <div className="flex-1 flex flex-col gap-2 pt-1">
                <div className="h-6 w-3/4 bg-muted/20 rounded" />
                <div className="h-4 w-1/2 bg-muted/20 rounded" />
              </div>
            </div>
            <div className="mt-auto pt-6 flex items-center justify-between border-t border-hairline mt-6">
              <div className="h-8 w-24 bg-muted/20 rounded-lg" />
              <div className="w-8 h-8 rounded-full bg-muted/20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
