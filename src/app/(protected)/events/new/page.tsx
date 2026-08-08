import { CreateEventForm } from "@/features/event/components/create-event-form";

export default function NewEventPage() {
  return (
    <main className="min-h-[80vh] flex items-start justify-center px-4 py-8 md:py-16">
      <CreateEventForm />
    </main>
  );
}