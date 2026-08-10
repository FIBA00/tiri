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
    <div className="flex flex-col gap-12 max-w-6xl w-full mx-auto pb-20">
      <div className="flex flex-col gap-4 items-center mb-4">
        <WizardSteps currentStep={1} />
        <h1 className="font-display text-4xl font-bold text-ink tracking-tight mt-6">Create New Event</h1>
        <p className="text-muted text-center max-w-xl">
          Set up the essential details of your event. You can always change these later in the event settings.
        </p>
      </div>

      <form onSubmit={HandleContinue} className="flex flex-col gap-12">
        {/* General Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 border-b border-hairline pb-12">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">General Info</h2>
            <p className="text-sm text-muted mt-2">
              Tell your guests what they are celebrating and when it's happening.
            </p>
          </div>
          
          <div className="card-surface p-6 md:p-8 flex flex-col gap-8 rounded-2xl border border-hairline bg-paper">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-medium text-ink">
                Event Name <span className="text-seal">*</span>
              </label>
              <Input
                id="name"
                value={formState.name}
                onChange={(e) => HandleFieldChange("name", e.target.value)}
                placeholder="e.g. Bethlehem & Yonas's Wedding Reception"
                className="h-12 text-base"
              />
              {formErrors.name ? <p className="font-mono text-xs text-seal mt-1">{formErrors.name}</p> : null}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  className="h-12 text-base"
                />
                {formErrors.date ? <p className="font-mono text-xs text-seal mt-1">{formErrors.date}</p> : null}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="time" className="text-sm font-medium text-ink flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-seal" />
                  Start Time
                </label>
                <TimePicker
                  value={formState.time}
                  onChange={(newTime) => HandleFieldChange("time", newTime)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="description" className="text-sm font-medium text-ink">
                Description / Overview
              </label>
              <Textarea
                id="description"
                rows={4}
                value={formState.description}
                onChange={(e) => HandleFieldChange("description", e.target.value)}
                placeholder="Share details about dress code, itinerary, or welcome messages..."
                className="resize-none text-base p-4"
              />
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 pb-12">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">Location</h2>
            <p className="text-sm text-muted mt-2">
              Specify the venue details and exact map coordinates so guests can find their way easily.
            </p>
          </div>

          <div className="card-surface p-6 md:p-8 flex flex-col gap-8 rounded-2xl border border-hairline bg-paper">
            <div className="flex items-center justify-between border-b border-hairline pb-6">
              <h3 className="font-medium text-ink flex items-center gap-2">
                <MapPin className="h-5 w-5 text-seal" />
                Venue Details
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={HandleGetCurrentLocation}
                className="inline-flex items-center gap-2 rounded-xl border-hairline hover:bg-emerald/10 hover:text-emerald hover:border-emerald/30 transition-colors"
              >
                <Navigation className="h-4 w-4 text-emerald" />
                Use My Location
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="venueName" className="text-sm font-medium text-ink">
                  Venue Name
                </label>
                <Input
                  id="venueName"
                  value={formState.venueName}
                  onChange={(e) => HandleFieldChange("venueName", e.target.value)}
                  placeholder="e.g. Skylight Hotel Rooftop"
                  className="h-12"
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
                  className="h-12"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="latitude" className="text-sm font-medium text-ink">
                  Latitude
                </label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formState.latitude ?? ""}
                  onChange={(e) => HandleFieldChange("latitude", e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="e.g. 9.0107"
                  className="font-mono h-12"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="longitude" className="text-sm font-medium text-ink">
                  Longitude
                </label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formState.longitude ?? ""}
                  onChange={(e) => HandleFieldChange("longitude", e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="e.g. 38.7612"
                  className="font-mono h-12"
                />
              </div>
            </div>

            {formState.latitude && formState.longitude ? (
              <div className="rounded-2xl overflow-hidden shadow-sm aspect-[16/9] w-full bg-paper-raised relative border border-hairline mt-2">
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
        </div>

        {/* Floating Action Bar */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-paper-raised border border-hairline p-3 md:p-4 rounded-2xl shadow-2xl flex items-center justify-between z-50">
          <Button type="button" variant="ghost" onClick={HandleSaveDraft} className="text-muted hover:text-ink hover:bg-seal/5 rounded-xl px-6">
            <Bookmark className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button type="submit" className="btn-seal rounded-xl px-8 shadow-md">
            Continue to Guest List
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </form>
    </div>
  );
}
