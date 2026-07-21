import { prisma } from "@/lib/prisma";
import { createInviteInput } from "../schemas/invite.schema";
import { INVITESTATUS } from "@/generated/prisma/enums";
import { GenerateCode } from "@/lib/gen-code";

export async function CreateInvite(invites: createInviteInput[]) {
  const data = invites.map((invite) => ({
    ...invite,
    code: GenerateCode(8),
    status: INVITESTATUS.PENDING,
  }));
  const createInvites = await prisma.invitation.createMany({
    data,
  });
  return createInvites;
}
