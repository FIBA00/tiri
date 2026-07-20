import { z } from "zod";

export const createInviteSchema = z.object({
  inviteeName: z.string().min(3),
  quantity: z.coerce.number().int().positive().default(1),
  eventId: z.string().cuid(),
  email: z.email().optional(),
  phoneNumber: z
    .string()
    .regex(/^\+2519\d{8}$/)
    .optional(),
  telegramUserName: z.string().optional(),
  description: z.string().optional(),
});

export type createInviteInput = z.infer<typeof createInviteSchema>;
