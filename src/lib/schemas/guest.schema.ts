// src/lib/schemas/guest.schema.ts
import { z } from "zod";

export const guestRowSchema = z.object({
  Name: z.string().trim().min(1, "Name is required"),
  Email: z.string().trim().email("Invalid email").optional().or(z.literal("")),
  Phone: z.string().trim().optional(),
});

export type GuestRow = z.infer<typeof guestRowSchema>;
