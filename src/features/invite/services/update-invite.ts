import { prisma } from "@/lib/prisma";
import { UpdateInviteInput } from "../schemas/invite.schema";

export async function UpdateInvite(params: UpdateInviteInput) {
  const { invitationId, ...updateData } = params;

  const updatedInvite = await prisma.invitation.update({
    where: { id: invitationId },
    data: updateData,
  });

  return updatedInvite;
}
