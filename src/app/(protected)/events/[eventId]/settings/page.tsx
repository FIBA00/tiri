import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EventSettingsForm } from "@/features/event/components/event-settings-form";

export default async function EventSettingsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    redirect("/auth/sign-in");
  }

  const eventDetails = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!eventDetails || eventDetails.userId !== session.user.id) {
    notFound();
  }

  return <EventSettingsForm event={eventDetails} />;
}
