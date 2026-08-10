import { INVITESTATUS } from "@/generated/prisma/enums";
import { z } from "zod";

export const createInviteSchema = z.object({
  inviteeName: z.string().min(3),
  quantity: z.coerce.number().int().positive().default(1),
  eventId: z.string(),
  email: z.string().email().optional(),
  phoneNumber: z
    .string()
    .regex(/^\+2519\d{8}$/)
    .optional(),
  telegramUserName: z.string().optional(),
  description: z.string().optional(),
});

export const getInviteSchema = z.object({
  page: z.coerce.number().int().min(1).positive().default(1),
  limit: z.coerce.number().int().min(5).max(50).positive().default(20),
  status: z.enum(["PENDING", "ENTERED", "EXITED", "CANCELED"]).optional(),
  sort: z.enum(["createdAt", "inviteeName", "quantity"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().min(2).optional(),
  eventId: z.string(),
});

export const updateInviteSchema = z.object({
  invitationId: z.string(),
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

export const sendBulkEmailSchema = z.object({
  invitationIds: z
    .array(z.string())
    .min(1, "Please select at least one invite"),
  customHtmlTemplate: z.string().optional(),
});

export const wizardGuestInput = z.object({
  name: z.string().min(1),
  email: z.string().optional(),
  phone: z.string().optional(),
});

export const finalizeAndSendSchema = z.object({
  event: z.object({
    name: z.string().min(3),
    description: z.string().optional(),
    date: z.coerce.date(),
    venueName: z.string().optional(),
    locationDescription: z.string().optional(),
    address: z.string().optional(),
    venueNotes: z.string().optional(),
    latitude: z.number().optional().nullable(),
    longitude: z.number().optional().nullable(),
    templateId: z.string().optional().nullable(),
  }),
  guests: z.array(wizardGuestInput).min(1),
  isDraft: z.boolean().optional().default(false),
});

export type SendBulkEmailInput = z.infer<typeof sendBulkEmailSchema>;
export type FinalizeAndSendInput = z.infer<typeof finalizeAndSendSchema>;
export type UpdateInviteInput = z.infer<typeof updateInviteSchema>;
export type getInviteInput = z.infer<typeof getInviteSchema>;
export type createInviteInput = z.infer<typeof createInviteSchema>;
