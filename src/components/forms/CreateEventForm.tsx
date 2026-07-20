"use client";

import { useState } from "react";
import { EventFormState } from "@/types/props.types.ts";
import { Field } from "@/components/ui/Field.tsx";
import { Input } from "@/components/ui/Input.tsx";
import { TextArea } from "@/components/ui/Textarea.tsx";


const initialState: EventFormState = {
  name: "",
  description: "",
  date: "",
  venueName: "",
  locationDescription: "",
  address: "",
  venueNotes: "",
};

export default function CreateEventForm() {
  const [form, setForm] = useState<EventFormState>(initialState);
  const [errors, setErrors] = useState<
    Partial<Record<keyof EventFormState, string>>
  >({});

  // design choice: factory — it's a function that returns a function, which is the one place I lean on that pattern deliberately (avoids six near-identical onChange handlers), while still keeping the returned handler a named function rather than an inline arrow.
  function handleChange(field: keyof EventFormState) {
    return function onFieldChange(
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) {
      setForm(function updateForm(prev) {
        return { ...prev, [field]: e.target.value };
      });
    };
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    // TODO: implement POST /api/events request handling
    console.log("submitting event", form);
  }
  function validate(values: EventFormState) {
    const nextErrors: Partial<Record<keyof EventFormState, string>> = {};
    if (!values.name.trim()) nextErrors.name = "Event name is required";

    return nextErrors;
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="card-surface flex flex-col gap-6 p-8 max-w-xl"
    >
      <div>
        <p className="eyebrow mb-1">Step 1 of 4</p>
        <h2 className="font-display text-2xl text-ink">Event Details</h2>
      </div>

      {/* event name */}

      <Field label="Event name" htmlFor="name" error={errors.name}>
        <Input
          id="name"
          value={form.name}
          onChange={handleChange("name")}
          placeholder="Bethlem & Yonas's wedding"
        />
      </Field>

      {/* event time and date */}

      <Field label="Date & time" htmlFor="date" error={errors.date}>
        <Input
          id="date"
          type="datetime-local"
          value={form.date}
          onChange={handleChange("date")}
        />
      </Field>

      {/* event location  */}
      <div className="border-t border-hairline pt-6">
        <p className="eyebrow mb-4">Location</p>

        {/* TODO: on google map selection system needs to implemented */}
        <div className="flex flex-col gap-6">
          {/* location of venue */}
          <Field
            label="Venue name"
            htmlFor="venueName"
            error={errors.venueName}
          >
            <Input
              id="venueName"
              value={form.venueName}
              onChange={handleChange("venueName")}
              placeholder="Skylight hotel"
            />
          </Field>

          {/* location description */}
          <Field label="Location description" htmlFor="locationDescription">
            <Input
              id="locationDescription"
              value={form.locationDescription}
              onChange={handleChange("locationDescription")}
              placeholder="RoofTop hall, 5th floor"
            />
          </Field>

          {/* full address */}
          <Field label="Full address" htmlFor="address" error={errors.address}>
            <Input
              id="address"
              value={form.address}
              onChange={handleChange("address")}
              placeholder="Bole Road, Addis Ababa"
            />
          </Field>

          {/* additional info related to the venue */}
          <Field label="Additional venue info" htmlFor="venueNotes">
            <TextArea
              id="venueNotes"
              rows={2}
              value={form.venueNotes}
              onChange={handleChange("venueNotes")}
              placeholder="Parking available, dress code, etc"
            />
          </Field>
        </div>
      </div>

      <button type="submit" className="btn-seal self-start">
        Continue to guest list
      </button>
    </form>
  );
}
