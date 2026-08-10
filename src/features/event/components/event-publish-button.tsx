"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sparkles, Globe } from "lucide-react";
import { updateEventAction } from "@/features/event/actions/event.actions";

interface EventPublishButtonProps {
  eventId: string;
}

export function EventPublishButton({ eventId }: EventPublishButtonProps) {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);

  async function handlePublish() {
    setIsPublishing(true);
    try {
      await updateEventAction({
        eventId,
        isDraft: false,
      });
      router.refresh();
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <Button
      onClick={handlePublish}
      disabled={isPublishing}
      className="btn-seal inline-flex items-center gap-2"
    >
      <Globe className="h-4 w-4" />
      {isPublishing ? "Publishing..." : "Publish Event"}
    </Button>
  );
}
