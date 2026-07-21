import { z } from "zod";

export const getEventAnalyticsSchema = z.object({
  eventId: z.string().cuid(),
});

export type GetEventAnalyticsInput = z.infer<typeof getEventAnalyticsSchema>;
