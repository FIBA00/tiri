// src/features/invite/actions/invite.actions.ts — full file
"use server";

import { authActionClient } from "@/lib/safe-action";
import {
  createInviteSchema,
  getInviteSchema,
  updateInviteSchema,
  sendBulkEmailSchema,
  finalizeAndSendSchema,
  type createInviteInput,
} from "../schemas/invite.schema";
import { CreateInvite } from "../services/create-invite";
import { GetInvites } from "../services/get-invite";
import { UpdateInvite } from "../services/update-invite";
import { SendBulkEmails } from "../services/send-emails";
import { CreateEvent } from "@/features/event/services/create-event";

const PHONE_REGEX = /^\+2519\d{8}$/;

function normalizePhone(phone?: string) {
  return phone && PHONE_REGEX.test(phone) ? phone : undefined;
}

function normalizeEmail(email?: string) {
  return email && email.includes("@") ? email : undefined;
}

export const createInviteAction = authActionClient
  .schema(createInviteSchema)
  .action(async ({ parsedInput }) => {
    const invites = await CreateInvite([parsedInput]);

    return { success: true, createdCount: invites.length };
  });

export const listInvitesAction = authActionClient
  .schema(getInviteSchema)
  .action(async ({ parsedInput }) => {
    const fetchResult = await GetInvites(parsedInput);

    return {
      success: true,
      data: fetchResult.data,
      meta: fetchResult.meta,
    };
  });

export const updateInviteAction = authActionClient
  .schema(updateInviteSchema)
  .action(async ({ parsedInput }) => {
    const updatedInvite = await UpdateInvite(parsedInput);

    return {
      success: true,
      data: updatedInvite,
    };
  });

export const sendBulkEmailsAction = authActionClient
  .schema(sendBulkEmailSchema)
  .action(async ({ parsedInput }) => {
    const mailResult = await SendBulkEmails(parsedInput);

    return {
      success: true,
      data: mailResult,
    };
  });

export const finalizeAndSendAction = authActionClient
  .schema(finalizeAndSendSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { userId } = ctx;
    const { event, guests, cardMode } = parsedInput;

    const locationParts = [
      event.venueName,
      event.locationDescription,
      event.address,
      event.venueNotes,
    ].filter(Boolean);

    const createdEvent = await CreateEvent(
      {
        name: event.name,
        description: event.description,
        date: event.date,
        location: locationParts.length ? locationParts.join(" — ") : undefined,
      },
      userId,
    );

    const rawInvites =
      cardMode === "shared"
        ? [
            {
              inviteeName:
                guests.length > 1
                  ? `${guests[0].name} +${guests.length - 1} guest(s)`
                  : guests[0].name,
              quantity: guests.length,
              eventId: createdEvent.id,
              email: normalizeEmail(guests.find((g) => g.email)?.email),
              phoneNumber: normalizePhone(guests[0].phone),
            },
          ]
        : guests.map(function toInviteInput(guest) {
            return {
              inviteeName: guest.name,
              quantity: 1,
              eventId: createdEvent.id,
              email: normalizeEmail(guest.email),
              phoneNumber: normalizePhone(guest.phone),
            };
          });

    const validInvites: createInviteInput[] = [];
    let skippedCount = 0;

    for (const raw of rawInvites) {
      const parsed = createInviteSchema.safeParse(raw);
      if (parsed.success) {
        validInvites.push(parsed.data);
      } else {
        skippedCount++;
      }
    }

    if (validInvites.length === 0) {
      return {
        success: false,
        error: "No valid guests to invite — check names/contact info.",
      };
    }

    const createdInvites = await CreateInvite(validInvites);

    const emailableIds = createdInvites
      .filter((invite) => invite.email)
      .map((invite) => invite.id);

    const mailResult =
      emailableIds.length > 0
        ? await SendBulkEmails({ invitationIds: emailableIds })
        : { sentCount: 0, failedCount: 0 };

    return {
      success: true,
      data: {
        eventId: createdEvent.id,
        createdCount: createdInvites.length,
        skippedCount,
        ...mailResult,
      },
    };
  });
