"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DynamicLocationPicker } from "@/components/ui/dynamic-location-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { updateEventAction, deleteEventAction } from "@/features/event/actions/event.actions";
import { generateTemplateAction } from "@/features/template/actions/template.actions";
import { MapPin, Navigation, Calendar, Clock, ShieldAlert, ImagePlus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface EventSettingsFormProps {
  event: any;
}

export function EventSettingsForm({ event }: EventSettingsFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const rawDateStr = new Date(event.date).toISOString();
  const initialDate = rawDateStr.split("T")[0];
  const initialTime = rawDateStr.split("T")[1]?.substring(0, 5) || "12:00";

  const [formState, setFormState] = useState({
    name: event.name || "",
    description: event.description || "",
    date: initialDate,
    time: initialTime,
    venueName: event.location?.split("—")[0]?.trim() || "",
    address: event.location?.split("—").slice(1).join("—").trim() || "",
    latitude: event.latitude ?? 9.0107,
    longitude: event.longitude ?? 38.7612,
    checkInPin: event.checkInPin || "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  function HandleFieldChange(field: string, value: any) {
    setFormState((prev) => ({ ...prev, [field]: value }));
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

  async function HandleTemplateUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsGenerating(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        const res = await generateTemplateAction({
          eventId: event.id,
          base64Image,
          mimeType: file.type,
        });

        if (res?.data?.success) {
          alert("Template successfully generated from your design!");
          router.refresh();
        } else {
          alert(res?.data?.error || "Failed to generate template");
        }
        setIsGenerating(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setIsGenerating(false);
      console.error(error);
    }
  }

  async function HandleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!formState.name.trim()) {
      setFormErrors({ name: "Event name is required" });
      return;
    }
    
    setIsSubmitting(true);
    const combinedDate = formState.date
      ? `${formState.date}T${formState.time || "12:00"}:00`
      : new Date().toISOString();

    const locationParts = [formState.venueName, formState.address].filter(Boolean);

    await updateEventAction({
      eventId: event.id,
      name: formState.name,
      date: new Date(combinedDate),
      description: formState.description || null,
      location: locationParts.length ? locationParts.join(" — ") : null,
      latitude: formState.latitude,
      longitude: formState.longitude,
      checkInPin: formState.checkInPin || null,
    });

    setIsSubmitting(false);
    router.refresh();
  }

  async function HandleDelete() {
    setIsSubmitting(true);
    await deleteEventAction({ eventId: event.id });
    setIsSubmitting(false);
    setDeleteOpen(false);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-12 max-w-6xl pb-20">
      <form onSubmit={HandleUpdate} className="flex flex-col gap-12">
        {/* General Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 border-b border-hairline pb-12">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">General Info</h2>
            <p className="text-sm text-muted mt-2">
              Update the core details of your event that will be visible to all guests on their invitations.
            </p>
          </div>
          
          <div className="card-surface p-6 md:p-8 flex flex-col gap-8 rounded-2xl border border-hairline bg-paper">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-medium text-ink">Event Name <span className="text-seal">*</span></label>
              <Input
                id="name"
                value={formState.name}
                onChange={(e) => HandleFieldChange("name", e.target.value)}
                className="max-w-xl"
              />
              {formErrors.name && <p className="font-mono text-xs text-seal">{formErrors.name}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl">
              <div className="flex flex-col gap-2">
                <label htmlFor="date" className="text-sm font-medium text-ink flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-seal" />
                  Event Date
                </label>
                <Input
                  id="date"
                  type="date"
                  value={formState.date}
                  onChange={(e) => HandleFieldChange("date", e.target.value)}
                />
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
              <label htmlFor="description" className="text-sm font-medium text-ink">Description / Overview</label>
              <Textarea
                id="description"
                rows={4}
                value={formState.description}
                onChange={(e) => HandleFieldChange("description", e.target.value)}
                className="max-w-xl"
              />
            </div>
          </div>
        </div>

        {/* Location Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 border-b border-hairline pb-12">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">Venue Details</h2>
            <p className="text-sm text-muted mt-2">
              Specify where your event is taking place. Adding map coordinates helps guests find it easily.
            </p>
          </div>
          
          <div className="card-surface p-6 md:p-8 flex flex-col gap-8 rounded-2xl border border-hairline bg-paper">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-ink flex items-center gap-2">
                <MapPin className="h-5 w-5 text-seal" />
                Location
              </h3>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="venueName" className="text-sm font-medium text-ink">Venue Name</label>
                <Input
                  id="venueName"
                  value={formState.venueName}
                  onChange={(e) => HandleFieldChange("venueName", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="address" className="text-sm font-medium text-ink">Address</label>
                <Input
                  id="address"
                  value={formState.address}
                  onChange={(e) => HandleFieldChange("address", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="latitude" className="text-sm font-medium text-ink">Latitude</label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formState.latitude ?? ""}
                  onChange={(e) => HandleFieldChange("latitude", e.target.value ? parseFloat(e.target.value) : null)}
                  className="font-mono"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="longitude" className="text-sm font-medium text-ink">Longitude</label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formState.longitude ?? ""}
                  onChange={(e) => HandleFieldChange("longitude", e.target.value ? parseFloat(e.target.value) : null)}
                  className="font-mono"
                />
              </div>
            </div>

            {formState.latitude && formState.longitude ? (
              <div className="rounded-2xl overflow-hidden shadow-sm aspect-[21/9] w-full bg-paper border border-hairline relative z-0">
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

        {/* Templates & Security */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">Advanced</h2>
            <p className="text-sm text-muted mt-2">
              AI design integration and security configurations.
            </p>
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="card-surface p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-2xl border border-hairline bg-paper">
              <div>
                <h3 className="font-semibold text-ink flex items-center gap-2">
                  <ImagePlus className="h-5 w-5 text-seal" />
                  AI Template Generator
                </h3>
                <p className="text-sm text-muted mt-1 max-w-md">
                  Upload an image of your invitation design, and our AI will instantly convert it into a beautiful, functional HTML email template.
                </p>
              </div>
              <div className="relative shrink-0">
                <input
                  type="file"
                  accept="image/*"
                  onChange={HandleTemplateUpload}
                  disabled={isGenerating}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <Button type="button" variant="outline" className="btn-seal w-full" disabled={isGenerating}>
                  {isGenerating ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
                  ) : (
                    "Upload Design"
                  )}
                </Button>
              </div>
            </div>

            <div className="card-surface p-6 md:p-8 flex flex-col gap-4 rounded-2xl border border-hairline bg-paper">
              <div>
                <h3 className="font-semibold text-ink">Security & Door Check-in</h3>
                <p className="text-sm text-muted mt-1">Configure access controls for the door check-in scanner.</p>
              </div>
              
              <div className="flex flex-col gap-2 max-w-xs mt-2">
                <label htmlFor="checkInPin" className="text-sm font-medium text-ink">Scanner PIN Code</label>
                <Input
                  id="checkInPin"
                  type="password"
                  placeholder="e.g. 123456"
                  maxLength={6}
                  value={formState.checkInPin}
                  onChange={(e) => HandleFieldChange("checkInPin", e.target.value)}
                  className="font-mono tracking-widest text-lg h-12"
                />
                <p className="text-xs text-muted">A 6-digit PIN that door staff use to unlock the terminal.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end pt-4 sticky bottom-6 z-10">
          <div className="bg-paper/80 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-hairline flex items-center gap-4">
            <p className="text-sm font-medium text-muted mr-4">You have unsaved changes</p>
            <Button type="submit" className="btn-seal px-8 h-12 text-base rounded-2xl" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save All Settings"}
            </Button>
          </div>
        </div>
      </form>

      <div className="h-px bg-hairline my-6"></div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
        <div>
          <h2 className="font-display text-2xl font-bold text-red-600 dark:text-red-400">Danger Zone</h2>
          <p className="text-sm text-muted mt-2">
            Destructive actions that cannot be undone.
          </p>
        </div>
        
        <div className="card-surface p-6 md:p-8 border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-2xl bg-red-500/5">
          <div>
            <p className="font-semibold text-ink flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-500" />
              Delete this event
            </p>
            <p className="text-sm text-muted mt-1">All invitations and guest data will be permanently removed.</p>
          </div>
          <Button 
            variant="destructive" 
            onClick={() => setDeleteOpen(true)}
            className="shrink-0"
          >
            Delete Event
          </Button>
        </div>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-red-600 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" />
              Delete Event
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{event.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setDeleteOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={HandleDelete}
              disabled={isSubmitting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isSubmitting ? "Deleting..." : "I understand, delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
