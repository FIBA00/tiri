"use client";

import { GenerateInviteEmailHtml } from "@/lib/email-renderer";

interface TemplatePreviewProps {
  html?: string | null;
  eventName?: string;
  date?: string;
  location?: string;
  description?: string;
  guestName?: string;
}

export function TemplatePreview({
  html,
  eventName = "Bethlehem & Yonas Wedding",
  date = "Saturday, Nov 14, 2026 at 6:00 PM",
  location = "Skylight Hotel Rooftop, Addis Ababa",
  description = "Formal attire requested. Parking available on premise.",
  guestName = "Abebe Bikila",
}: TemplatePreviewProps) {
  const renderedHtml = GenerateInviteEmailHtml(
    guestName,
    eventName,
    "A1B2C3D4",
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'><rect width='180' height='180' fill='%236d28d9'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff' font-family='monospace' font-size='16'>PASS: A1B2C3D4</text></svg>",
    html || undefined,
    date,
    location,
    description
  );

  return (
    <div className="card-surface w-full rounded-2xl overflow-hidden shadow-lg border border-hairline bg-white">
      <div className="bg-paper-raised px-4 py-2 border-b border-hairline flex items-center justify-between text-xs text-muted font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-yellow-400/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-emerald/80 inline-block" />
        </div>
        <span>Email Preview</span>
      </div>
      <div className="p-4 overflow-x-auto max-h-[500px]">
        <iframe
          title="Email HTML Preview"
          srcDoc={renderedHtml}
          className="w-full min-h-[420px] border-0 rounded-xl"
        />
      </div>
    </div>
  );
}
