"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWizard, type WizardGuest } from "@/lib/wizard-context";
import { AddGuestForm } from "@/features/invite/components/add-guest-form";
import { ExcelImportButton } from "@/features/invite/components/excel-import-button";
import { DownloadTemplateButton } from "@/features/invite/components/download-template-button";
import { WizardSteps } from "@/features/event/components/wizard-steps";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Trash2, Edit2, Check, X, Bookmark, ArrowRight, ArrowLeft } from "lucide-react";

function GuestRowItem({
  guest,
  onUpdate,
  onRemove,
}: {
  guest: WizardGuest;
  onUpdate: (id: string, patch: Partial<WizardGuest>) => void;
  onRemove: (id: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftState, setDraftState] = useState({
    name: guest.name,
    email: guest.email ?? "",
    phone: guest.phone ?? "",
  });

  function HandleSave() {
    onUpdate(guest.id, {
      name: draftState.name.trim() || guest.name,
      email: draftState.email.trim() || undefined,
      phone: draftState.phone.trim() || undefined,
    });
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <li className="rounded-xl p-3 bg-paper border border-hairline flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          value={draftState.name}
          onChange={(e) => setDraftState({ ...draftState, name: e.target.value })}
          placeholder="Name"
          className="rounded-lg text-xs bg-paper-raised flex-1"
        />
        <Input
          value={draftState.email}
          onChange={(e) => setDraftState({ ...draftState, email: e.target.value })}
          placeholder="Email"
          className="rounded-lg text-xs bg-paper-raised flex-1"
        />
        <Input
          value={draftState.phone}
          onChange={(e) => setDraftState({ ...draftState, phone: e.target.value })}
          placeholder="Phone"
          className="rounded-lg text-xs bg-paper-raised flex-1"
        />
        <div className="flex items-center gap-1">
          <Button type="button" size="sm" variant="ghost" onClick={HandleSave} className="text-emerald text-xs">
            <Check className="h-4 w-4" />
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => setIsEditing(false)} className="text-muted text-xs">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between p-3 rounded-xl border border-hairline bg-paper hover:border-seal/30 transition-all">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-seal/10 text-seal flex items-center justify-center font-bold text-sm">
          {guest.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-ink">{guest.name}</p>
          <p className="font-mono text-xs text-muted">
            {guest.email ?? guest.phone ?? "No contact info"} · {guest.source}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button type="button" size="sm" variant="ghost" onClick={() => setIsEditing(true)} className="text-muted hover:text-ink">
          <Edit2 className="h-3.5 w-3.5" />
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => onRemove(guest.id)} className="text-muted hover:text-seal">
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </li>
  );
}

export default function GuestsPage() {
  const router = useRouter();
  const { event, guests, removeGuest, updateGuest } = useWizard();

  useEffect(() => {
    if (!event) {
      router.replace("/events/new");
    }
  }, [event, router]);

  if (!event) return null;

  function HandleContinue() {
    router.push("/events/new/templates");
  }

  function HandleSaveDraft() {
    router.push("/dashboard");
  }

  return (
    <main className="min-h-[85vh] max-w-4xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-8">
      <div className="card-surface p-6 md:p-10 flex flex-col gap-6">
        <WizardSteps currentStep={2} />

        <div className="flex items-center justify-between border-b border-hairline pb-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">Build Guest List</h1>
            <p className="text-sm text-muted">For {event.name}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={HandleSaveDraft}
            className="inline-flex items-center gap-1.5 rounded-xl border-hairline text-xs font-medium text-muted hover:text-ink"
          >
            <Bookmark className="h-4 w-4 text-seal" />
            Save Draft & Exit
          </Button>
        </div>

        <AddGuestForm />

        <div className="flex flex-wrap items-center justify-between gap-4 bg-paper/60 p-4 rounded-2xl border border-hairline">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-seal" />
            <span className="text-xs font-semibold text-ink">Excel Options</span>
          </div>
          <div className="flex items-center gap-3">
            <DownloadTemplateButton />
            <ExcelImportButton />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-semibold text-ink">
              Guest List ({guests.length})
            </h3>
          </div>

          {guests.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-hairline rounded-2xl bg-paper text-muted text-sm">
              No guests added yet. Add a guest using the form above or import an Excel file.
            </div>
          ) : (
            <ul className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-1">
              {guests.map((g) => (
                <GuestRowItem key={g.id} guest={g} onUpdate={updateGuest} onRemove={removeGuest} />
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-hairline pt-6">
          <Button type="button" variant="ghost" onClick={() => router.push("/events/new")} className="inline-flex items-center gap-2 text-muted">
            <ArrowLeft className="h-4 w-4" />
            Back to Details
          </Button>
          <Button type="button" onClick={HandleContinue} disabled={guests.length === 0} className="btn-seal inline-flex items-center gap-2 px-8">
            Continue to Email Template
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </main>
  );
}
