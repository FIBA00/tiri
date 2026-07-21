"use server";

import { authActionClient } from "@/lib/safe-action";
import { getEventAnalyticsSchema } from "../schemas/event-analytics.schema";
import { GetEventAnalytics } from "../services/get-event-analytics";

export const getEventAnalyticsAction = authActionClient
  .schema(getEventAnalyticsSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { userId } = ctx;

    try {
      const analyticsData = await GetEventAnalytics(parsedInput, userId);

      return {
        success: true,
        data: analyticsData,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  });
