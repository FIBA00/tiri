"use server";

import { authActionClient } from "@/lib/safe-action";
import { createInviteSchema } from "../schemas/invite.schema";
import { CreateInvite } from "../services/create-invite";

export const createInviteAction = authActionClient
  .schema(createInviteSchema)
  .action(async ({ parsedInput }) => {
    const invites = await CreateInvite([parsedInput]);

    return { success: true, createdCount: invites.count };
  });
