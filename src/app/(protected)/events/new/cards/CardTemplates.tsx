import { CardTemplateProps } from "@/types/props.types.ts";

export function ClassicSealTemplate({
  eventName,
  date,
  venueName,
  guestName,
}: CardTemplateProps) {
  return (
    <div className="card-surface aspect-[3/2] w-full max-w-lg p-8 flex items-center border-2 border-gold">
      <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-seal text-paper-raised font-display text-2xl">
        T
      </span>
      <div className="ml-6 border-l border-hairline pl-6 flex-1">
        <p className="eyebrow">You are invited</p>
        <h3 className="mt-2 font-display text-2xl text-ink">{eventName}</h3>
        <p className="mt-2 text-sm text-muted">{date}</p>
        <p className="text-sm text-muted">{venueName}</p>
        {guestName ? (
          <p className="mt-4 font-mono text-xs text-gold">for {guestName}</p>
        ) : null}
      </div>
    </div>
  );
}

export function MinimalLineTemplate({
  eventName,
  date,
  venueName,
  guestName,
}: CardTemplateProps) {
  return (
    <div className="card-surface aspect-[3/2] w-full max-w-lg p-8 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <p className="eyebrow">Invitation</p>
        {guestName ? (
          <p className="font-mono text-xs text-muted">{guestName}</p>
        ) : null}
      </div>
      <div>
        <h3 className="font-display text-3xl text-ink leading-tight">
          {eventName}
        </h3>
        <div className="mt-4 h-px w-16 bg-seal" />
        <div className="mt-4 flex gap-6">
          <p className="text-sm text-muted">{date}</p>
          <p className="text-sm text-muted">{venueName}</p>
        </div>
      </div>
    </div>
  );
}

export function EmeraldBorderTemplate({
  eventName,
  date,
  venueName,
  guestName,
}: CardTemplateProps) {
  return (
    <div className="aspect-[3/2] w-full max-w-lg p-2 bg-emerald rounded-2xl">
      <div className="h-full w-full rounded-xl bg-paper-raised px-8 flex items-center gap-8">
        <div className="flex-1 text-right border-r border-emerald/30 pr-8">
          <p className="eyebrow text-emerald">Please join us</p>
          <h3 className="mt-2 font-display text-xl text-ink">{eventName}</h3>
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm text-muted">{date}</p>
          <p className="text-sm text-muted">{venueName}</p>
          {guestName ? (
            <p className="mt-3 font-mono text-xs text-emerald">{guestName}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export const templates = [
  { id: "classic-seal", label: "Classic Seal", Component: ClassicSealTemplate },
  { id: "minimal-line", label: "Minimal Line", Component: MinimalLineTemplate },
  {
    id: "emerald-border",
    label: "Emerald Border",
    Component: EmeraldBorderTemplate,
  },
];