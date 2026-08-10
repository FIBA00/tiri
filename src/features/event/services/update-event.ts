import { prisma } from "@/lib/prisma";
import type { UpdateEventInput } from "../schemas/event.schema";

import bcrypt from "bcryptjs";

export async function UpdateEvent(params: UpdateEventInput, userId: string) {
  const { eventId, ...updateData } = params;

  const existingEvent = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!existingEvent || existingEvent.userId !== userId) {
    throw new Error("Event not found or access denied");
  }

  if (updateData.checkInPin) {
    updateData.checkInPin = await bcrypt.hash(updateData.checkInPin, 10);
  }

  return await prisma.event.update({
    where: { id: eventId },
    data: updateData,
  });
}
