"use server";

import { authActionClient } from "@/lib/safe-action";
import { verifyCodeSchema } from "../schemas/check-in.schema";
import { VerifyCode } from "../services/verify-code";

export const verifyCodeAction = authActionClient
  .schema(verifyCodeSchema)
  .action(async ({ parsedInput }) => {
    const { code, eventId } = parsedInput;

    try {
      const inviteData = await VerifyCode(code, eventId);
      return { success: true, data: inviteData };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });
