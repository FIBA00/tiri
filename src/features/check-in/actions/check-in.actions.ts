"use server";

import { verifyCodeSchema } from "../schemas/check-in.schema";
import { VerifyCode } from "../services/verify-code";

import { actionClient } from "@/lib/safe-action";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const verifyCodeAction = actionClient
  .schema(verifyCodeSchema)
  .action(async ({ parsedInput }) => {
    const { code, eventId, pin } = parsedInput;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { userId: true, checkInPin: true },
    });

    if (!event) {
      return { success: false, error: "Event not found" };
    }

    // Auth check: either valid PIN, or logged-in owner
    let authorized = false;
    
    if (event.checkInPin && pin && await bcrypt.compare(pin, event.checkInPin)) {
      authorized = true;
    } else {
      const session = await auth.api.getSession({ headers: await headers() });
      if (session?.user?.id === event.userId) {
        authorized = true;
      }
    }

    if (!authorized) {
      return { success: false, error: "Unauthorized access to check-in terminal." };
    }

    try {
      const inviteData = await VerifyCode(code, eventId);
      return { success: true, data: inviteData };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

import { z } from "zod";
export const verifyPinAction = actionClient
  .schema(z.object({ eventId: z.string().cuid(), pin: z.string() }))
  .action(async ({ parsedInput }) => {
    const { eventId, pin } = parsedInput;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { checkInPin: true },
    });

    if (!event) return { success: false, error: "Event not found" };
    if (!event.checkInPin || !(await bcrypt.compare(pin, event.checkInPin))) {
      return { success: false, error: "Invalid PIN" };
    }

    return { success: true };
  });

export const updateCheckInStatusAction = actionClient
  .schema(
    z.object({
      invitationId: z.string().cuid(),
      eventId: z.string().cuid(),
      pin: z.string().optional(),
      status: z.enum(["PENDING", "ENTERED", "EXITED", "CANCELED"]),
    })
  )
  .action(async ({ parsedInput }) => {
    const { invitationId, eventId, pin, status } = parsedInput;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { userId: true, checkInPin: true },
    });

    if (!event) return { success: false, error: "Event not found" };

    let authorized = false;
    if (event.checkInPin && pin && await bcrypt.compare(pin, event.checkInPin)) {
      authorized = true;
    } else {
      const session = await auth.api.getSession({ headers: await headers() });
      if (session?.user?.id === event.userId) {
        authorized = true;
      }
    }

    if (!authorized) {
      return { success: false, error: "Unauthorized access to check-in terminal." };
    }

    try {
      const updated = await prisma.invitation.update({
        where: { id: invitationId },
        data: { status },
      });
      return { success: true, data: updated };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });
