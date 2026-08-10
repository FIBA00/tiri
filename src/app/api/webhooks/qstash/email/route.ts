import { NextResponse } from "next/server";
import { SendBulkEmailInput } from "@/features/invite/schemas/invite.schema";
import { SendBulkEmails } from "@/features/invite/services/send-emails";

// In production, you would wrap this with verifySignatureAppRouter from "@upstash/qstash/dist/nextjs"
// to ensure only QStash can call this endpoint.
// import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";

export async function POST(req: Request) {
  try {
    const body: SendBulkEmailInput = await req.json();
    
    // Process the batch synchronously
    // Since we chunk them into size of 5 in the enqueue function, this will take ~1.25s
    // due to the 250ms sleep per email, well within Vercel Serverless timeout limits.
    const result = await SendBulkEmails(body);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("QStash email processing error:", error);
    // Returning 500 will cause QStash to automatically retry the request using exponential backoff
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
