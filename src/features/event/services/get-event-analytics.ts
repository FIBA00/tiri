import { prisma } from "@/lib/prisma";
import { GetEventAnalyticsInput } from "../schemas/event-analytics.schema";

export async function GetEventAnalytics(
  params: GetEventAnalyticsInput,
  userId: string,
) {
  const { eventId } = params;

  const eventRecord = await prisma.event.findFirst({
    where: {
      id: eventId,
      userId,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!eventRecord) {
    throw new Error("Event not found or unauthorized.");
  }

  const [totalStats, statusGroupStats] = await Promise.all([
    prisma.invitation.aggregate({
      where: { eventId },
      _count: { _all: true },
      _sum: { quantity: true },
    }),
    prisma.invitation.groupBy({
      by: ["status"],
      where: { eventId },
      _count: { _all: true },
      _sum: { quantity: true },
    }),
  ]);

  function GetStatsForStatus(
    statusName: "PENDING" | "ENTERED" | "EXITED" | "CANCELED",
  ) {
    const statusData = statusGroupStats.find(
      (item) => item.status === statusName,
    );
    return {
      invitationsCount: statusData?._count._all ?? 0,
      guestsCount: statusData?._sum.quantity ?? 0,
    };
  }

  const pendingStats = GetStatsForStatus("PENDING");
  const enteredStats = GetStatsForStatus("ENTERED");
  const exitedStats = GetStatsForStatus("EXITED");
  const canceledStats = GetStatsForStatus("CANCELED");

  const totalInvitesCount = totalStats._count._all ?? 0;
  const totalAllowedGuests = totalStats._sum.quantity ?? 0;

  // Calculate live attendance percentage
  const attendancePercentage =
    totalAllowedGuests > 0
      ? Math.round((enteredStats.guestsCount / totalAllowedGuests) * 100)
      : 0;

  return {
    eventName: eventRecord.name,
    totalInvitesCount,
    totalAllowedGuests,
    attendancePercentage,
    breakdown: {
      pending: pendingStats,
      entered: enteredStats,
      exited: exitedStats,
      canceled: canceledStats,
    },
  };
}
