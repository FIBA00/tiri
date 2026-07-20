import { CardTemplateProps } from "@/types/props.types.ts";

export function ClassicSealTemplate({
  eventName,
  date,
  venueName,
  guestName,
}: CardTemplateProps) {
  return (
    <div className="card-surface aspect-3/4 w-full max-w-xs p-8 flex flex-col items-center text-center border-2 border-gold">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-seal text-paper-raised font-display text-xl mb-6">
        T
      </span>
      <p className="eyebrow">You are invited</p>
      <h3 className="mt-3 font-display text-2xl text-ink">{eventName}</h3>
      <p className="mt-2 text-sm text-muted">{date}</p>
      <p className="text-sm text-muted">{venueName}</p>
      {guestName ? (
        <p className="mt-6 font-mono text-xs text-gold">for {guestName}</p>
      ) : null}
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
    <div className="card-surface aspect-3/4 w-full max-w-xs p-8 flex flex-col justify-between">
      <p className="eyebrow">Invitation</p>
      <div>
        <h3 className="font-display text-3xl text-ink leading-tight">
          {eventName}
        </h3>
        <div className="mt-4 h-px w-12 bg-seal" />
        <p className="mt-4 text-sm text-muted">{date}</p>
        <p className="text-sm text-muted">{venueName}</p>
      </div>
      {guestName ? (
        <p className="font-mono text-xs text-muted">{guestName}</p>
      ) : (
        <span />
      )}
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
    <div className="aspect-3/4 w-full max-w-xs p-2 bg-emerald rounded-2xl">
      <div className="h-full w-full rounded-xl bg-paper-raised p-6 flex flex-col items-center text-center justify-center">
        <p className="eyebrow text-emerald">Please join us</p>
        <h3 className="mt-3 font-display text-xl text-ink">{eventName}</h3>
        <p className="mt-2 text-sm text-muted">{date}</p>
        <p className="text-sm text-muted">{venueName}</p>
        {guestName ? (
          <p className="mt-4 font-mono text-xs text-emerald">{guestName}</p>
        ) : null}
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
