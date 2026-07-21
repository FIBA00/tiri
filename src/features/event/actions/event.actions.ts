"use server";

import { authActionClient } from "@/lib/safe-action";
import { createEventSchema, getEventsSchema } from "../schemas/event.schema";
import { CreateEvent } from "../services/create-event";
import { GetEvents } from "../services/get-events";

export const createEventAction = authActionClient
  .schema(createEventSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { userId } = ctx;

    const newEvent = await CreateEvent(parsedInput, userId);

    return {
      success: true,
      data: newEvent,
    };
  });

export const listEventsAction = authActionClient
  .schema(getEventsSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { userId } = ctx;

    const fetchResult = await GetEvents(parsedInput, userId);

    return {
      success: true,
      data: fetchResult.data,
      meta: fetchResult.meta,
    };
  });
