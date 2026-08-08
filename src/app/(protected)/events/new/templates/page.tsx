"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWizard } from "@/lib/wizard-context";
import { TemplateSelector } from "@/features/event/components/template-selector";

export default function TemplatesPage() {
  const router = useRouter();
  const { event } = useWizard();

  useEffect(() => {
    if (!event) router.replace("/events/new");
  }, [event, router]);

  if (!event) return null;

  return (
    <main className="min-h-[85vh] px-4 py-8 md:py-12">
      <TemplateSelector />
    </main>
  );
}
