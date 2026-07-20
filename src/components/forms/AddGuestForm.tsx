"use client";

import React, { useState } from "react";
import { Field } from "../ui/Field.tsx";
import { Input } from "../ui/Input.tsx";
import { WizardGuest } from "@/types/props.types.ts";
import { useWizard } from "@/lib/wizard-context.tsx";

export default function AddGuestForm() {
  const { addGuest } = useWizard();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Guest name is required");
      return;
    }

    const guest: WizardGuest = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      source: "manual",
    };
    addGuest(guest);
    setName("");
    setEmail("");
    setPhone("");
    setError("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card-surface flex flex-col gap-4 p-6"
    >
      <p className="eyebrow">Add a guest</p>
      <div className="grid gap-4 sm:grid-cols-3">
        {/* guest name input field */}
        <Field label="Name" htmlFor="guestName" error={error}>
          <Input
            id="guestName"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>

        {/* guest contact info: email */}
        <Field label="Email (optional)" htmlFor="guestEmail" error={error}>
          <Input
            id="guestEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        {/* guest contact info : phone */}
        <Field label="Phone (optional)" htmlFor="guestPhone" error={error}>
          <Input
            id="guestPhone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Field>

        <button
        type="submit"
            className="btn-ghost justify-self-start"
        >
            Add guest

        </button>
      </div>
    </form>
  );
}
