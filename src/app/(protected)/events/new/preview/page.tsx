// src/app/events/new/preview/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { templates } from "@/app/events/new/cards/CardTemplates";
import { useWizard } from "@/lib/wizard-context";
import { finalizeAndSendAction } from "@/features/invite/actions/invite.actions";

export default function PreviewPage() {
  const router = useRouter();
  const { event, guests, templateId, cardMode } = useWizard();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

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

  async function handleSend() {
    if (!event) return;
    setSending(true);
    setError("");

    const result = await finalizeAndSendAction({
      event,
      guests: guests.map(function toGuestInput(guest) {
        return { name: guest.name, email: guest.email, phone: guest.phone};
      }),
      cardMode,
    });
    setSending(false);

    const payload = result?.data;

    if (!payload?.success || !payload.data) {
      setError(
        result?.data?.error ?? result?.serverError ?? "Something went wrong sending invitations.",
      );
      return;
    }

    sessionStorage.removeItem("tiri-wizard-state");
    router.push(`/events/${payload.data.eventId}`);
  }

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
        This is what {guests[0]?.name ?? "each guest"} will see.
      </p>

      {error ? <p className="text-sm text-seal">{error}</p> : null}

      <button
        onClick={handleSend}
        disabled={sending}
        className="btn-seal disabled:opacity-40"
      >
        {sending ? "Sending…" : "Send invitations"}
      </button>
    </main>
  );
}