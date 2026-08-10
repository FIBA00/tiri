import { prisma } from "@/lib/prisma";
import { SendBulkEmailInput } from "../schemas/invite.schema";
import {
  emailTransporter,
  GenerateInviteEmailHtml,
  GenerateQrCodeDataUri,
} from "@/lib/mailer";

export async function SendBulkEmails(params: SendBulkEmailInput) {
  const { invitationIds, customHtmlTemplate } = params;

  const validInvites = await prisma.invitation.findMany({
    where: {
      id: { in: invitationIds },
      email: { not: null, notIn: [""] },
    },
    include: {
      event: {
        include: {
          template: true,
        },
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

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  
  let sentCount = 0;
  let failedCount = 0;

  for (const invite of validInvites) {
    try {
      const qrCodeDataUri = await GenerateQrCodeDataUri(invite.code);
      const templateHtml = customHtmlTemplate || invite.event.template?.html;

      const htmlContent = GenerateInviteEmailHtml(
        invite.inviteeName,
        invite.event.name,
        invite.code,
        qrCodeDataUri,
        templateHtml,
        new Date(invite.event.date).toLocaleString(),
        invite.event.location || undefined,
        invite.event.description || undefined,
        invite.event.latitude,
        invite.event.longitude
      );

      const attachments = qrCodeDataUri
        ? [
            {
              filename: `qrcode-${invite.code}.png`,
              path: qrCodeDataUri,
              cid: `qrcode-${invite.code}`,
            },
          ]
        : [];

      await emailTransporter.sendMail({
        from: `"Event Team" <${process.env.SMTP_USER || "invitations@tiri.app"}>`,
        to: invite.email!,
        subject: `Your Invitation for ${invite.event.name}`,
        html: htmlContent,
        attachments,
      });

      sentCount++;
      // Sleep for 250ms between emails to prevent rate limiting (Max ~4 emails/sec)
      await sleep(250);
    } catch (error) {
      failedCount++;
      console.error(`Failed to send email to ${invite.email}:`, error);
    }
  }

  return { sentCount, failedCount };
}
