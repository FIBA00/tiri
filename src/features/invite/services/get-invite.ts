import { prisma } from "@/lib/prisma";
import { getInviteInput } from "../schemas/invite.schema";
import { Prisma } from "@/generated/prisma/client";

export async function GetInvites(params: getInviteInput) {
  const { page, limit, order, search, sort, eventId, status } = params;
  const offset = (page - 1) * limit;

  const whereClause: Prisma.InvitationWhereInput = {
    eventId,
    ...(status && { status }),
    ...(search && {
      OR: [
        { code: { contains: search, mode: "insensitive" } },
        { inviteeName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    }),
  };
  const [invitesData, totalCount] = await Promise.all([
    prisma.invitation.findMany({
      where: whereClause,
      skip: offset,
      take: limit,
      orderBy: {
        [sort]: order,
      },
    }),
    prisma.invitation.count({
      where: whereClause,
    }),
  ]);

  return {
    data: invitesData,
    meta: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
}
