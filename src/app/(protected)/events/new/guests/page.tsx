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
    <main className="min-h-screen px-4 py-8 md:py-12 md:px-8">
      <div className="flex flex-col gap-12 max-w-6xl w-full mx-auto pb-20">
        <div className="flex flex-col gap-4 items-center mb-4">
          <WizardSteps currentStep={2} />
          <h1 className="font-display text-4xl font-bold text-ink tracking-tight mt-6">Build Guest List</h1>
          <p className="text-muted text-center max-w-xl">
            For {event.name}. Add guests manually or import them from an Excel file.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 pb-12">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">Add Guests</h2>
            <p className="text-sm text-muted mt-2">
              Import a list of guests or add them one by one.
            </p>
            
            <div className="mt-8 flex flex-col gap-4 bg-paper/60 p-5 rounded-2xl border border-hairline">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-seal" />
                <span className="text-sm font-semibold text-ink">Excel Options</span>
              </div>
              <DownloadTemplateButton />
              <ExcelImportButton />
            </div>
          </div>

          <div className="card-surface p-6 md:p-8 flex flex-col gap-8 rounded-2xl border border-hairline bg-paper">
            <AddGuestForm />

            <div className="flex flex-col gap-4 border-t border-hairline pt-8">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-ink">
                  Guest List ({guests.length})
                </h3>
              </div>

              {guests.length === 0 ? (
                <div className="p-10 text-center border border-dashed border-hairline rounded-2xl bg-paper-raised text-muted text-sm">
                  No guests added yet. Add a guest using the form above or import an Excel file.
                </div>
              ) : (
                <ul className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-2">
                  {guests.map((g) => (
                    <GuestRowItem key={g.id} guest={g} onUpdate={updateGuest} onRemove={removeGuest} />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Floating Action Bar */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-paper-raised border border-hairline p-3 md:p-4 rounded-2xl shadow-2xl flex items-center justify-between z-50">
          <Button type="button" variant="ghost" onClick={() => router.push("/events/new")} className="text-muted hover:text-ink hover:bg-seal/5 rounded-xl px-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <Button type="button" variant="ghost" onClick={HandleSaveDraft} className="text-muted hover:text-ink hover:bg-seal/5 rounded-xl px-4">
              <Bookmark className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button type="button" onClick={HandleContinue} disabled={guests.length === 0} className="btn-seal rounded-xl px-8 shadow-md">
              Continue to Templates
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
