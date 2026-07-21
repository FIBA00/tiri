import { INVITESTATUS } from "@/generated/prisma/enums";
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

export const getInviteSchema = z.object({
  page: z.coerce.number().int().min(1).positive().default(1),
  limit: z.coerce.number().int().min(10).max(20).positive().default(10),
  status: z.enum(INVITESTATUS).default("PENDING"),
  sort: z.enum(["createdAt", "inviteeName", "quantity"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().min(2).optional(),
  eventId: z.cuid(),
});

export type getInviteInput = z.infer<typeof getInviteSchema>;

export const updateInviteSchema = z.object({
  invitationId: z.string().cuid(),
  inviteeName: z.string().min(3).optional(),
  quantity: z.coerce.number().int().positive().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phoneNumber: z
    .string()
    .regex(/^\+2519\d{8}$/)
    .optional()
    .or(z.literal("")),
  telegramUserName: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["PENDING", "ENTERED", "EXITED", "CANCELED"]).optional(),
});

export type UpdateInviteInput = z.infer<typeof updateInviteSchema>;

export const sendBulkEmailSchema = z.object({
  invitationIds: z
    .array(z.string().cuid())
    .min(1, "Please select at least one invite"),
  customHtmlTemplate: z.string().optional(),
});

export type SendBulkEmailInput = z.infer<typeof sendBulkEmailSchema>;
