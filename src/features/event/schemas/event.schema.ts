import { z } from "zod";

export const createEventSchema = z.object({
  name: z.string().min(3, "Event name must be at least 3 characters"),
  location: z.string().optional(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  description: z.string().optional(),
  date: z.coerce.date({ error: "Event date is required" }),
  isDraft: z.boolean().optional().default(false),
  templateId: z.string().optional().nullable(),
  checkInPin: z.string().length(6, "PIN must be exactly 6 characters").optional().nullable(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

export const updateEventSchema = z.object({
  eventId: z.string().min(1),
  name: z.string().min(3, "Event name must be at least 3 characters").optional(),
  location: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  description: z.string().optional().nullable(),
  date: z.coerce.date().optional(),
  isDraft: z.boolean().optional(),
  templateId: z.string().optional().nullable(),
  checkInPin: z.string().optional().nullable(),
});

export type UpdateEventInput = z.infer<typeof updateEventSchema>;

export const deleteEventSchema = z.object({
  eventId: z.string().min(1),
});

export type DeleteEventInput = z.infer<typeof deleteEventSchema>;

export const getEventsSchema = z.object({
  page: z.coerce.number().int().min(1).positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).positive().default(10),
  sort: z.enum(["createdAt", "date", "name"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().min(2).optional(),
});

export type GetEventsInput = z.infer<typeof getEventsSchema>;
