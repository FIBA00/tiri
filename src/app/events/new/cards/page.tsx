// src/app/events/new/cards/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useWizard } from "@/lib/wizard-context.tsx";
import { templates } from "@/app/events/new/cards/CardTemplates";

export default function CardsPage() {
  const router = useRouter();
  const { event, guests, setTemplate } = useWizard();
  const [selected, setSelected] = useState(templates[0].id);
  const [mode, setMode] = useState<"unique" | "shared">("unique");

  if (!event) {
    router.replace("/events/new");
    return null;
  }

  function handleContinue() {
    setTemplate(selected, mode);
    router.push("/events/new/preview");
  }

  return (
    <main className="min-h-screen px-6 py-16 max-w-5xl mx-auto flex flex-col gap-8">
      <div>
        <p className="eyebrow mb-1">Step 3 of 4</p>
        <h1 className="font-display text-2xl text-ink">Choose a card</h1>
        <p className="mt-1 text-sm text-muted">
          {guests.length} guests will receive this
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setMode("unique")}
          className={
            mode === "unique"
              ? "btn-seal px-4! py-2!  text-sm"
              : "btn-ghost px-4! py-2! text-sm"
          }
        >
          Unique card per guest
        </button>
        <button
          onClick={() => setMode("shared")}
          className={
            mode === "shared"
              ? "btn-seal px-4! py-2! text-sm"
              : "btn-ghost px-4! py-2! text-sm"
          }
        >
          One shared card
        </button>
      </div>

      <div className="grid gap-8 sm:grid-cols-3">
        {templates.map(function renderTemplate(tpl) {
          const { Component } = tpl;
          return (
            <button
              key={tpl.id}
              onClick={() => setSelected(tpl.id)}
              className={`rounded-2xl p-1 transition-all ${
                selected === tpl.id ? "ring-2 ring-seal" : "ring-0"
              }`}
            >
              <Component
                eventName={event.name}
                date={event.date}
                venueName={event.venueName}
                guestName={mode === "unique" ? guests[0]?.name : undefined}
              />
              <p className="mt-3 text-sm text-ink">{tpl.label}</p>
            </button>
          );
        })}
      </div>

      <button onClick={handleContinue} className="btn-seal self-start">
        Continue to preview
      </button>
    </main>
  );
}
