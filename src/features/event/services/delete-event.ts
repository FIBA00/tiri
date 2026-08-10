import { prisma } from "@/lib/prisma";

export async function DeleteEvent(eventId: string, userId: string) {
  const existingEvent = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!existingEvent || existingEvent.userId !== userId) {
    throw new Error("Event not found or access denied");
  }

  await prisma.event.delete({
    where: { id: eventId },
  });

  return { deleted: true };
}
