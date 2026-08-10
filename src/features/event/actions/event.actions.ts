"use server";

import { authActionClient } from "@/lib/safe-action";
import {
  createEventSchema,
  getEventsSchema,
  updateEventSchema,
  deleteEventSchema,
} from "../schemas/event.schema";
import { CreateEvent } from "../services/create-event";
import { GetEvents } from "../services/get-events";
import { UpdateEvent } from "../services/update-event";
import { DeleteEvent } from "../services/delete-event";

export const createEventAction = authActionClient
  .schema(createEventSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { userId } = ctx;
    const newEvent = await CreateEvent(parsedInput, userId);
    return { success: true, data: newEvent };
  });

export const listEventsAction = authActionClient
  .schema(getEventsSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { userId } = ctx;
    const fetchResult = await GetEvents(parsedInput, userId);
    return { success: true, data: fetchResult.data, meta: fetchResult.meta };
  });

export const updateEventAction = authActionClient
  .schema(updateEventSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { userId } = ctx;
    const updatedEvent = await UpdateEvent(parsedInput, userId);
    return { success: true, data: updatedEvent };
  });

export const deleteEventAction = authActionClient
  .schema(deleteEventSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { userId } = ctx;
    await DeleteEvent(parsedInput.eventId, userId);
    return { success: true };
  });
