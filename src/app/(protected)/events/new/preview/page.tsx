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
    <main className="min-h-[85vh] max-w-4xl mx-auto px-4 py-8 md:py-12">
      <div className="card-surface p-6 md:p-10 flex flex-col gap-8">
        <WizardSteps currentStep={4} />

        <div className="flex items-center justify-between border-b border-hairline pb-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">Ready to Send</h1>
            <p className="text-sm text-muted">
              {guests.length} guest{guests.length === 1 ? "" : "s"} will receive this email invitation.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => HandleFinalize(true)}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 rounded-xl border-hairline text-xs font-medium text-muted hover:text-ink"
          >
            <Bookmark className="h-4 w-4 text-seal" />
            Save Draft & Exit
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Mail className="h-4 w-4 text-seal" />
            Invitation Email Preview
          </div>
          <TemplatePreview
            html={templateHtml}
            eventName={event.name}
            date={new Date(event.date).toLocaleString()}
            location={event.venueName || event.address}
            description={event.description}
            guestName={guests[0]?.name || "Sample Guest"}
          />
        </div>

        {errorMsg ? <p className="font-mono text-xs text-seal text-center">{errorMsg}</p> : null}

        <div className="flex items-center justify-between border-t border-hairline pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/events/new/templates")}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 text-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Email Template
          </Button>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => HandleFinalize(true)}
              disabled={isSubmitting}
              className="rounded-xl border-hairline"
            >
              Save as Draft
            </Button>
            <Button
              type="button"
              onClick={() => HandleFinalize(false)}
              disabled={isSubmitting}
              className="btn-seal inline-flex items-center gap-2 px-8"
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? "Sending..." : "Send Invitations Now"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
