import { prisma } from "@/lib/prisma";
import { SendBulkEmailInput } from "../schemas/invite.schema";
import { emailTransporter, GenerateInviteEmailHtml } from "@/lib/mailer";

export async function SendBulkEmails(params: SendBulkEmailInput) {
  const { invitationIds } = params;

  // 1. Fetch invites that actually have an email attached, including the Event name
  const validInvites = await prisma.invitation.findMany({
    where: {
      id: { in: invitationIds },
      email: { not: null, notIn: [""] },
    },
    include: {
      event: {
        select: { name: true },
      },
    },
  });

  if (validInvites.length === 0) {
    return {
      sentCount: 0,
      failedCount: 0,
      message: "No valid email addresses found in selected invites.",
    };
  }

  // 2. Prepare the email promises
  const emailPromises = validInvites.map((invite) => {
    const htmlContent = GenerateInviteEmailHtml(
      invite.inviteeName,
      invite.event.name,
      invite.code,
    );

    return emailTransporter.sendMail({
      from: `"Event Team" <${process.env.SMTP_USER}>`,
      to: invite.email!, // We know it's not null because of our Prisma filter
      subject: `Your Invite for ${invite.event.name}`,
      html: htmlContent,
    });
  });

  // 3. Send them in parallel (using allSettled to prevent one failure from crashing the rest)
  const results = await Promise.allSettled(emailPromises);

  // 4. Tally up the successes and failures (camelCase variables)
  let sentCount = 0;
  let failedCount = 0;

  results.forEach((result) => {
    if (result.status === "fulfilled") {
      sentCount++;
    } else {
      failedCount++;
      console.error("Failed to send email:", result.reason); // Log for backend debugging
    }
  });

  return { sentCount, failedCount };
}
