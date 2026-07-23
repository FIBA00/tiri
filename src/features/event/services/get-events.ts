// features/services/get-events.ts
import { prisma } from "@/lib/prisma";
import { GetEventsInput } from "../schemas/event.schema";
import { Prisma } from "@/generated/prisma/client";

export async function GetEvents(params: GetEventsInput, userId: string) {
  const { page, limit, order, search, sort } = params;
  const skipOffset = (page - 1) * limit;

  const whereClause: Prisma.EventWhereInput = {
    userId,
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [eventsData, totalCount] = await Promise.all([
    prisma.event.findMany({
      where: whereClause,
      skip: skipOffset,
      take: limit,
      orderBy: {
        [sort]: order,
      },
      include: {
        _count: {
          select: { invitations: true },
        },
      },
    }),
    prisma.event.count({
      where: whereClause,
    }),
  ]);

  return {
    data: eventsData,
    meta: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
}
