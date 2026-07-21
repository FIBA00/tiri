"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { templates } from "@/app/events/new/cards/CardTemplates";
import { useWizard } from "@/lib/wizard-context";

export default function PreviewPage() {
  const router = useRouter();
  const { event, guests, templateId, cardMode } = useWizard();

  useEffect(
    function redirectIfNoEvent() {
      if (!event) router.replace("/events/new");
    },
    [event, router],
  );

  if (!event) return null;

  const tpl = templates.find(function match(t) {
    return t.id === templateId;
  });
  if (!tpl) return null;
  const { Component } = tpl;

  return (
    <main className="min-h-screen px-6 py-16 max-w-3xl mx-auto flex flex-col gap-8 items-center text-center">
      <div>
        <p className="eyebrow mb-1">Step 4 of 4</p>
        <h1 className="font-display text-2xl text-ink">Ready to send</h1>
        <p className="mt-1 text-sm text-muted">
          {cardMode === "shared"
            ? `One shared card for all ${guests.length} guests`
            : `${guests.length} unique cards, one per guest`}
        </p>
      </div>

      <Component
        eventName={event.name}
        date={event.date}
        venueName={event.venueName}
        guestName={cardMode === "unique" ? guests[0]?.name : undefined}
      />

      <p className="max-w-md text-sm text-muted">
        This is what {guests[0]?.name ?? "each guest"} will see. Sending, QR
        check-in codes, and live tracking connect once the backend routes exist.
      </p>

      <button className="btn-seal" disabled>
        Send invitations — coming soon
      </button>
    </main>
  );
}
