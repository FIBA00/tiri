"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWizard } from "@/lib/wizard-context";
import { finalizeAndSendAction } from "@/features/invite/actions/invite.actions";
import { WizardSteps } from "@/features/event/components/wizard-steps";
import { TemplatePreview } from "@/features/event/components/template-preview";
import { Button } from "@/components/ui/button";
import { Send, Bookmark, ArrowLeft, Mail } from "lucide-react";

export default function PreviewPage() {
  const router = useRouter();
  const { event, guests, templateId, templateHtml, resetWizard } = useWizard();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!event) router.replace("/events/new");
  }, [event, router]);

  if (!event) return null;

  async function HandleFinalize(isDraft: boolean) {
    if (!event) return;
    setIsSubmitting(true);
    setErrorMsg("");

    const result = await finalizeAndSendAction({
      event: {
        ...event,
        templateId,
      },
      guests: guests.map(function ToGuestInput(guest) {
        return { name: guest.name, email: guest.email, phone: guest.phone };
      }),
      isDraft,
    });

    setIsSubmitting(false);

    const resData: any = result?.data;

    if (!resData?.success || !resData?.data) {
      setErrorMsg(
        resData?.error ?? result?.serverError ?? "Failed to save or send invitations."
      );
      return;
    }

    resetWizard();
    if (isDraft) {
      router.push("/dashboard");
    } else {
      router.push(`/events/${resData.data.eventId}`);
    }
  }

  return (
    <main className="min-h-screen px-4 py-8 md:py-12 md:px-8">
      <div className="flex flex-col gap-12 max-w-6xl w-full mx-auto pb-20">
        <div className="flex flex-col gap-4 items-center mb-4">
          <WizardSteps currentStep={4} />
          <h1 className="font-display text-4xl font-bold text-ink tracking-tight mt-6">Ready to Send</h1>
          <p className="text-muted text-center max-w-xl">
            Review your invitation and finalize the event. You can save it as a draft or send it right away.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 pb-12">
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">Summary</h2>
              <p className="text-sm text-muted mt-2">
                Verify the event details before sending out the invitations.
              </p>
            </div>
            
            <div className="card-surface p-6 rounded-2xl border border-hairline bg-paper flex flex-col gap-4">
              <div className="flex flex-col gap-1 pb-4 border-b border-hairline">
                <span className="text-xs text-muted font-medium uppercase tracking-wider">Event Name</span>
                <span className="font-semibold text-ink">{event.name}</span>
              </div>
              <div className="flex flex-col gap-1 pb-4 border-b border-hairline">
                <span className="text-xs text-muted font-medium uppercase tracking-wider">Date & Time</span>
                <span className="font-medium text-ink">{new Date(event.date).toLocaleString()}</span>
              </div>
              <div className="flex flex-col gap-1 pb-4 border-b border-hairline">
                <span className="text-xs text-muted font-medium uppercase tracking-wider">Location</span>
                <span className="font-medium text-ink">{event.venueName || event.address || "TBA"}</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-medium text-ink">Total Guests</span>
                <span className="px-3 py-1 bg-seal/10 text-seal rounded-full font-bold text-sm">
                  {guests.length}
                </span>
              </div>
            </div>

            {errorMsg ? <p className="font-mono text-xs text-seal">{errorMsg}</p> : null}
          </div>

          <div className="card-surface p-6 md:p-8 flex flex-col gap-6 rounded-2xl border border-hairline bg-paper">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Mail className="h-5 w-5 text-seal" />
              Invitation Email Preview
            </div>
            <div className="w-full h-full min-h-[500px]">
              <TemplatePreview
                html={templateHtml}
                eventName={event.name}
                date={new Date(event.date).toLocaleString()}
                location={event.venueName || event.address}
                description={event.description}
                guestName={guests[0]?.name || "Sample Guest"}
              />
            </div>
          </div>
        </div>

        {/* Floating Action Bar */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-paper-raised border border-hairline p-3 md:p-4 rounded-2xl shadow-2xl flex items-center justify-between z-50">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/events/new/templates")}
            disabled={isSubmitting}
            className="text-muted hover:text-ink hover:bg-seal/5 rounded-xl px-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => HandleFinalize(true)}
              disabled={isSubmitting}
              className="text-muted hover:text-ink rounded-xl border-hairline px-4"
            >
              Save as Draft
            </Button>
            <Button
              type="button"
              onClick={() => HandleFinalize(false)}
              disabled={isSubmitting}
              className="btn-seal rounded-xl px-8 shadow-md"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Sending..." : "Send Invitations"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
