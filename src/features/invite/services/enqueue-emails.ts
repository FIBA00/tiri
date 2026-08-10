import { Client } from "@upstash/qstash";
import { SendBulkEmailInput } from "../schemas/invite.schema";
import { SendBulkEmails } from "./send-emails";

const qstash = process.env.QSTASH_TOKEN
  ? new Client({ token: process.env.QSTASH_TOKEN })
  : null;

export async function EnqueueBulkEmails(params: SendBulkEmailInput) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");
  const url = `${baseUrl}/api/webhooks/qstash/email`;

  const isLocalhost =
    url.includes("localhost") ||
    url.includes("127.0.0.1") ||
    url.includes("::1");

  // If QStash isn't configured OR we are running locally (QStash can't reach localhost), fall back to synchronous processing.
  if (!qstash || isLocalhost) {
    console.warn(
      "QSTASH_TOKEN not set or running on localhost. Falling back to synchronous bulk email sending.",
    );
    const result = await SendBulkEmails(params);
    return {
      enqueuedCount: result.sentCount,
      failedCount: result.failedCount,
      message: "Processed synchronously",
    };
  }

  const { invitationIds, customHtmlTemplate } = params;

  // We process in small batches of 5 so that each serverless invocation
  // executes quickly within Vercel's limits, even with the 250ms sleep delay per email.
  const BATCH_SIZE = 5;
  let enqueuedCount = 0;

  for (let i = 0; i < invitationIds.length; i += BATCH_SIZE) {
    const batchIds = invitationIds.slice(i, i + BATCH_SIZE);

    await qstash.publishJSON({
      url,
      body: {
        invitationIds: batchIds,
        customHtmlTemplate,
      } as SendBulkEmailInput,
      // You can add delay if needed, e.g. delay: "10s"
    });

    enqueuedCount += batchIds.length;
  }

  return {
    enqueuedCount,
    failedCount: 0,
    message: "Emails queued for background processing",
  };
}
