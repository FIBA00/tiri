"use server";

import { authActionClient } from "@/lib/safe-action";
import {
  createInviteSchema,
  getInviteSchema,
  updateInviteSchema,
  sendBulkEmailSchema,
} from "../schemas/invite.schema";
import { CreateInvite } from "../services/create-invite";
import { GetInvites } from "../services/get-invite";
import { UpdateInvite } from "../services/update-invite";
import { SendBulkEmails } from "../services/send-emails";

export const createInviteAction = authActionClient
  .schema(createInviteSchema)
  .action(async ({ parsedInput }) => {
    const invites = await CreateInvite([parsedInput]);

    return { success: true, createdCount: invites.count };
  });

export const listInvitesAction = authActionClient
  .schema(getInviteSchema)
  .action(async ({ parsedInput }) => {
    const fetchResult = await GetInvites(parsedInput);

    return {
      success: true,
      data: fetchResult.data,
      meta: fetchResult.meta,
    };
  });

export const updateInviteAction = authActionClient
  .schema(updateInviteSchema)
  .action(async ({ parsedInput }) => {
    const updatedInvite = await UpdateInvite(parsedInput);

    return {
      success: true,
      data: updatedInvite,
    };
  });

export const sendBulkEmailsAction = authActionClient
  .schema(sendBulkEmailSchema)
  .action(async ({ parsedInput }) => {
    const mailResult = await SendBulkEmails(parsedInput);

    return {
      success: true,
      data: mailResult,
    };
  });
