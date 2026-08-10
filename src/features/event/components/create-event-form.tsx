"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EventFormState } from "@/types/props.types";
import { useWizard } from "@/lib/wizard-context";
import { WizardSteps } from "./wizard-steps";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DynamicLocationPicker } from "@/components/ui/dynamic-location-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { MapPin, Navigation, Calendar, Clock, ArrowRight, Bookmark } from "lucide-react";

export function CreateEventForm() {
  const router = useRouter();
  const { event: storedEvent, setEvent } = useWizard();

  const [formState, setFormState] = useState<EventFormState>({
    name: storedEvent?.name || "",
    description: storedEvent?.description || "",
    date: storedEvent?.date ? storedEvent.date.split("T")[0] : "",
    time: storedEvent?.time || "18:00",
    venueName: storedEvent?.venueName || "",
    locationDescription: storedEvent?.locationDescription || "",
    address: storedEvent?.address || "",
    venueNotes: storedEvent?.venueNotes || "",
    latitude: storedEvent?.latitude ?? 9.0107,
    longitude: storedEvent?.longitude ?? 38.7612,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  function HandleFieldChange(field: keyof EventFormState, value: any) {
    setFormState(function UpdateState(prev) {
      return { ...prev, [field]: value };
    });
  }

  function HandleGetCurrentLocation() {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          HandleFieldChange("latitude", Number(position.coords.latitude.toFixed(6)));
          HandleFieldChange("longitude", Number(position.coords.longitude.toFixed(6)));
        },
        (error) => {
          console.error("Geolocation error", error);
        }
      );
    }
  }

  function ValidateForm() {
    const errors: Record<string, string> = {};
    if (!formState.name.trim()) errors.name = "Event name is required";
    if (!formState.date) errors.date = "Event date is required";
    return errors;
  }

  function SaveEventData() {
    const combinedDate = formState.date
      ? `${formState.date}T${formState.time || "12:00"}:00`
      : new Date().toISOString();

    setEvent({
      ...formState,
      date: combinedDate,
    });
  }

  function HandleContinue(e: React.FormEvent) {
    e.preventDefault();
    const errors = ValidateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    SaveEventData();
    router.push("/events/new/guests");
  }

  function HandleSaveDraft() {
    SaveEventData();
    router.push("/dashboard");
  }

  return (
    <form onSubmit={HandleContinue} className="card-surface max-w-3xl mx-auto p-6 md:p-10 flex flex-col gap-8">
      <WizardSteps currentStep={1} />

      <div className="flex items-center justify-between border-b border-hairline pb-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">Event Details</h2>
          <p className="text-sm text-muted">Tell your guests what they are celebrating.</p>
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

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-ink">
            Event Name <span className="text-seal">*</span>
          </label>
          <Input
            id="name"
            value={formState.name}
            onChange={(e) => HandleFieldChange("name", e.target.value)}
            placeholder="e.g. Bethlehem & Yonas's Wedding Reception"
          />
          {formErrors.name ? <p className="font-mono text-xs text-seal">{formErrors.name}</p> : null}
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="date" className="text-sm font-medium text-ink flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-seal" />
              Event Date <span className="text-seal">*</span>
            </label>
            <Input
              id="date"
              type="date"
              value={formState.date}
              onChange={(e) => HandleFieldChange("date", e.target.value)}
            />
            {formErrors.date ? <p className="font-mono text-xs text-seal">{formErrors.date}</p> : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="time" className="text-sm font-medium text-ink flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-seal" />
              Start Time
            </label>
            <TimePicker
              value={formState.time}
              onChange={(newTime) => HandleFieldChange("time", newTime)}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="text-sm font-medium text-ink">
            Description / Overview
          </label>
          <Textarea
            id="description"
            rows={3}
            value={formState.description}
            onChange={(e) => HandleFieldChange("description", e.target.value)}
            placeholder="Share details about dress code, itinerary, or welcome messages..."
          />
        </div>
      </div>

      <div className="border-t border-hairline pt-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-ink flex items-center gap-2">
              <MapPin className="h-5 w-5 text-seal" />
              Geospatial Location
            </h3>
            <p className="text-xs text-muted">Specify venue details and exact map coordinates.</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={HandleGetCurrentLocation}
            className="inline-flex items-center gap-1.5 text-xs rounded-xl border-hairline"
          >
            <Navigation className="h-3.5 w-3.5 text-emerald" />
            Use My Location
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="venueName" className="text-sm font-medium text-ink">
              Venue Name
            </label>
            <Input
              id="venueName"
              value={formState.venueName}
              onChange={(e) => HandleFieldChange("venueName", e.target.value)}
              placeholder="e.g. Skylight Hotel Rooftop"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="address" className="text-sm font-medium text-ink">
              Full Address
            </label>
            <Input
              id="address"
              value={formState.address}
              onChange={(e) => HandleFieldChange("address", e.target.value)}
              placeholder="e.g. Bole Road, Addis Ababa"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="latitude" className="text-sm font-medium text-ink">
              Latitude Coordinates
            </label>
            <Input
              id="latitude"
              type="number"
              step="any"
              value={formState.latitude ?? ""}
              onChange={(e) => HandleFieldChange("latitude", e.target.value ? parseFloat(e.target.value) : null)}
              placeholder="e.g. 9.0107"
              className="font-mono"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="longitude" className="text-sm font-medium text-ink">
              Longitude Coordinates
            </label>
            <Input
              id="longitude"
              type="number"
              step="any"
              value={formState.longitude ?? ""}
              onChange={(e) => HandleFieldChange("longitude", e.target.value ? parseFloat(e.target.value) : null)}
              placeholder="e.g. 38.7612"
              className="font-mono"
            />
          </div>
        </div>

        {formState.latitude && formState.longitude ? (
          <div className="rounded-2xl overflow-hidden shadow-sm aspect-[16/9] w-full bg-paper relative z-0">
            <DynamicLocationPicker
              latitude={formState.latitude}
              longitude={formState.longitude}
              onChange={(lat, lng) => {
                HandleFieldChange("latitude", Number(lat.toFixed(6)));
                HandleFieldChange("longitude", Number(lng.toFixed(6)));
              }}
            />
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between border-t border-hairline pt-6">
        <Button type="button" variant="ghost" onClick={HandleSaveDraft} className="text-muted">
          Save & Exit
        </Button>
        <Button type="submit" className="btn-seal inline-flex items-center gap-2 px-8">
          Continue to Guest List
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
