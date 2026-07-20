"use server";

import { authActionClient } from "@/lib/safe-action";
import { createInviteSchema, getInviteSchema } from "../schemas/invite.schema";
import { CreateInvite } from "../services/create-invite";
import { GetInvites } from "../services/get-invite";

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
