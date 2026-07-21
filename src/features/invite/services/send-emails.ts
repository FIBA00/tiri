import { prisma } from "@/lib/prisma";
import { SendBulkEmailInput } from "../schemas/invite.schema";
import {
  emailTransporter,
  GenerateInviteEmailHtml,
  GenerateQrCodeDataUri,
} from "@/lib/mailer";

export async function SendBulkEmails(params: SendBulkEmailInput) {
  const { invitationIds, customHtmlTemplate } = params;

  // 1. Fetch invites that actually have an email attached
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
      message: "No valid email addresses found.",
    };
  }

  // 2. Prepare the email promises (Note: This is now an async map)
  const emailPromises = validInvites.map(async (invite) => {
    // Generate the base64 QR Code string for this specific code
    const qrCodeDataUri = await GenerateQrCodeDataUri(invite.code);

    const htmlContent = GenerateInviteEmailHtml(
      invite.inviteeName,
      invite.event.name,
      invite.code,
      qrCodeDataUri,
      customHtmlTemplate,
    );

    return emailTransporter.sendMail({
      from: `"Event Team" <${process.env.SMTP_USER}>`,
      to: invite.email!,
      subject: `Your Invite for ${invite.event.name}`,
      html: htmlContent,
    });
  });

  // 3. Send them all in parallel
  const results = await Promise.allSettled(await Promise.all(emailPromises));

  let sentCount = 0;
  let failedCount = 0;

  results.forEach((result) => {
    if (result.status === "fulfilled") {
      sentCount++;
    } else {
      failedCount++;
      console.error("Failed to send email:", result.reason);
    }
  });

  return { sentCount, failedCount };
}
