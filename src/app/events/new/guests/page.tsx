"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AddGuestForm from "@/components/forms/AddGuestForm.tsx";
import ExcelImportButton from "@/components/forms/ExcelImportButton.tsx";
import { useWizard } from "@/lib/wizard-context";

// add above GuestsPage in the same file
import { useState } from "react";
import type { WizardGuest } from "@/lib/wizard-context";

function GuestRow({
  guest,
  onUpdate,
  onRemove,
}: {
  guest: WizardGuest;
  onUpdate: (id: string, patch: Partial<WizardGuest>) => void;
  onRemove: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    name: guest.name,
    email: guest.email ?? "",
    phone: guest.phone ?? "",
  });

  function handleSave() {
    onUpdate(guest.id, {
      name: draft.name.trim() || guest.name,
      email: draft.email.trim() || undefined,
      phone: draft.phone.trim() || undefined,
    });
    setEditing(false);
  }

  if (editing) {
    return (
      <li className="rounded-lg px-3 py-2 bg-paper flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          className="rounded-lg border border-hairline bg-paper-raised px-2 py-1 text-sm text-ink flex-1"
        />
        <input
          value={draft.email}
          onChange={(e) => setDraft({ ...draft, email: e.target.value })}
          placeholder="email"
          className="rounded-lg border border-hairline bg-paper-raised px-2 py-1 text-sm text-ink flex-1"
        />
        <input
          value={draft.phone}
          onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
          placeholder="phone"
          className="rounded-lg border border-hairline bg-paper-raised px-2 py-1 text-sm text-ink flex-1"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="font-mono text-xs text-emerald hover:underline"
          >
            Save
          </button>
          <button
            onClick={() => setEditing(false)}
            className="font-mono text-xs text-muted hover:underline"
          >
            Cancel
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-paper">
      <div>
        <p className="text-sm text-ink">{guest.name}</p>
        <p className="font-mono text-xs text-muted">
          {guest.email ?? guest.phone ?? "no contact info"} · {guest.source}
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => setEditing(true)}
          className="font-mono text-xs text-emerald hover:underline"
        >
          Edit
        </button>
        <button
          onClick={() => onRemove(guest.id)}
          className="font-mono text-xs text-seal hover:text-seal-hover"
        >
          Remove
        </button>
      </div>
    </li>
  );
}
export default function GuestsPage() {
  const router = useRouter();
  const { event, guests, removeGuest, updateGuest } = useWizard();

  console.log("GuestsPage render - guests: ", guests);
  useEffect(
    function redirectIfNoEvent() {
      if (!event) {
        router.replace("/events/new");
      }
    },
    [event, router],
  );

  if (!event) {
    return null;
  }

  return (
    <main className="min-h-screen px-6 py-16 flex flex-col gap-8 max-w-3xl mx-auto">
      <div>
        <p className="eyebrow mb-1">Step 2 of 4</p>
        <h1 className="font-display text-2xl text-ink">
          Build your guest list
        </h1>
        <p className="mt-1 text-sm text-muted">For {event.name}</p>
      </div>

      <div className="flex items-center justify-between">
        {/* guest form */}
        <AddGuestForm />
      </div>
      {/* guest import */}
      <ExcelImportButton />

      <div className="card-surface p-6">
        <p className="eyebrow mb-4">
          {guests.length} guest{guests.length === 1 ? "" : "s"}
        </p>
        {guests.length === 0 ? (
          <p className="text-sm text-muted">
            No guests yet — add one above or import a file.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {guests.map(function renderGuest(guest) {
              return (
                <GuestRow
                  key={guest.id}
                  guest={guest}
                  onUpdate={updateGuest}
                  onRemove={removeGuest}
                />
              );
            })}
          </ul>
        )}
      </div>
      <button
        onClick={() => router.push("/events/new/cards")}
        disabled={guests.length === 0}
        className="btn-seal self-start disabled:opacity-40"
      >
        Continue to card selection
      </button>
    </main>
  );
}
