import { prisma } from "@/lib/prisma";
import { CreateEventInput } from "../schemas/event.schema";
import { GenerateCode } from "@/lib/gen-code";

export async function CreateEvent(params: CreateEventInput, userId: string) {
  const uniqueEventCode = GenerateCode(8);

  const newEvent = await prisma.event.create({
    data: {
      ...params,
      userId,
      code: uniqueEventCode,
    },
  });

  return newEvent;
}
