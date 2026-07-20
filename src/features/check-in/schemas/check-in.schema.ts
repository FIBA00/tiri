import { z } from "zod";

export const verifyCodeSchema = z.object({
  code: z.string().length(8, "Invite code must be exactly 8 characters"),
  eventId: z.string().cuid(),
});

export type VerifyCodeInput = z.infer<typeof verifyCodeSchema>;
