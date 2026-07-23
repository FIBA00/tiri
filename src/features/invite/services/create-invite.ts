// src/features/invite/services/create-invite.ts
// create-invite.ts used prisma.invitation.createMany(), which Postgres/Prisma cannot return IDs for — ever, by design.
// Since sendBulkEmailsAction needs invitationIds, this was a dead end regardless of how it got wired.
// Switched it to a transaction of individual create() calls, which does return full rows.

import { prisma } from "@/lib/prisma";
import { createInviteInput } from "../schemas/invite.schema";
import { INVITESTATUS } from "@/generated/prisma/enums";
import { GenerateCode } from "@/lib/gen-code";

export async function CreateInvite(invites: createInviteInput[]) {
  return prisma.$transaction(
    invites.map(function toCreateQuery(invite) {
      return prisma.invitation.create({
        data: {
          ...invite,
          code: GenerateCode(8),
          status: INVITESTATUS.PENDING,
        },
      });
    }),
  );
}
