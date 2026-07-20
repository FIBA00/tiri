import { z } from "zod";

export const createEventSchema = z.object({
  name: z.string().min(3, "Event name must be at least 3 characters"),
  location: z.string().optional(),
  description: z.string().optional(),
  date: z.coerce.date({ error: "Event date is required" }),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

export const getEventsSchema = z.object({
  page: z.coerce.number().int().min(1).positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).positive().default(10),
  sort: z.enum(["createdAt", "date", "name"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().min(2).optional(),
});

export type GetEventsInput = z.infer<typeof getEventsSchema>;
