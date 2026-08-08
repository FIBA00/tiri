"use client";

import React, { useState } from "react";
import { useWizard, type WizardGuest } from "@/lib/wizard-context";
import { generateId } from "@/lib/id";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";

export function AddGuestForm() {
  const { addGuest } = useWizard();
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  function HandleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!guestName.trim()) {
      setErrorMsg("Guest name is required");
      return;
    }

    const newGuest: WizardGuest = {
      id: generateId(),
      name: guestName.trim(),
      email: guestEmail.trim() || undefined,
      phone: guestPhone.trim() || undefined,
      source: "manual",
    };

    addGuest(newGuest);
    setGuestName("");
    setGuestEmail("");
    setGuestPhone("");
    setErrorMsg("");
  }

  return (
    <form onSubmit={HandleSubmit} className="card-surface w-full p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-ink">Add Guest</h3>
          <p className="text-xs text-muted">Enter contact details to invite a guest to your event.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 w-full">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="guestName" className="text-xs font-medium text-ink">
            Name <span className="text-seal">*</span>
          </label>
          <Input
            id="guestName"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="e.g. Abebe Bikila"
            className="rounded-xl border-hairline bg-paper"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="guestEmail" className="text-xs font-medium text-ink">
            Email (Optional)
          </label>
          <Input
            id="guestEmail"
            type="email"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            placeholder="e.g. abebe@example.com"
            className="rounded-xl border-hairline bg-paper"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="guestPhone" className="text-xs font-medium text-ink">
            Phone (Optional)
          </label>
          <Input
            id="guestPhone"
            value={guestPhone}
            onChange={(e) => setGuestPhone(e.target.value)}
            placeholder="e.g. +251911223344"
            className="rounded-xl border-hairline bg-paper"
          />
        </div>
      </div>

      {errorMsg ? <p className="font-mono text-xs text-seal">{errorMsg}</p> : null}

      <div className="flex justify-end">
        <Button type="submit" className="btn-seal inline-flex items-center gap-2 px-6">
          <UserPlus className="h-4 w-4" />
          Add to Guest List
        </Button>
      </div>
    </form>
  );
}
