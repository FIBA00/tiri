import { prisma } from "@/lib/prisma";
import { CreateEventInput } from "../schemas/event.schema";
import { GenerateCode } from "@/lib/gen-code";
import bcrypt from "bcryptjs";

export async function CreateEvent(params: CreateEventInput, userId: string) {
  const uniqueEventCode = GenerateCode(8);

  const dataToSave = { ...params };
  if (dataToSave.checkInPin) {
    dataToSave.checkInPin = await bcrypt.hash(dataToSave.checkInPin, 10);
  }

  const newEvent = await prisma.event.create({
    data: {
      ...dataToSave,
      userId,
      code: uniqueEventCode,
    },
  });

  return newEvent;
}
