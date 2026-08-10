"use server";

import { actionClient } from "@/lib/safe-action";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateTemplateAction = actionClient
  .schema(
    z.object({
      eventId: z.string().cuid(),
      base64Image: z.string(),
      mimeType: z.string(),
    })
  )
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const { eventId, base64Image, mimeType } = parsedInput;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event || event.userId !== session.user.id) {
      return { success: false, error: "Event not found or access denied" };
    }

    try {
      // Clean base64 string if it contains the data URI prefix
      const b64Data = base64Image.includes("base64,")
        ? base64Image.split("base64,")[1]
        : base64Image;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: "You are an expert HTML email template developer. I am providing you with an image of an invitation design. Please convert this design into a fully functional, responsive HTML email template using inline CSS. Make sure it looks premium and matches the design closely. Use the following exact placeholders where data will be injected: {{eventName}}, {{inviteeName}}, {{date}}, {{location}}, {{description}}, {{qrCode}}, {{code}}, {{mapButton}}, {{year}}. Return ONLY the raw HTML code without any markdown formatting or code blocks.",
              },
              {
                inlineData: {
                  data: b64Data,
                  mimeType,
                },
              },
            ],
          },
        ],
      });

      let html = response.text || "";
      // Clean up markdown block if the LLM adds it
      if (html.startsWith("\`\`\`html")) {
        html = html.replace(/^\`\`\`html\n?/, "").replace(/\n?\`\`\`$/, "");
      } else if (html.startsWith("\`\`\`")) {
        html = html.replace(/^\`\`\`\n?/, "").replace(/\n?\`\`\`$/, "");
      }

      // Create a new template and attach it
      const newTemplate = await prisma.template.create({
        data: {
          name: `AI Generated for ${event.name}`,
          html,
          userId: session.user.id,
        },
      });

      await prisma.event.update({
        where: { id: eventId },
        data: { templateId: newTemplate.id },
      });

      return { success: true, templateId: newTemplate.id };
    } catch (error: any) {
      console.error("Gemini AI Error:", error);
      return { success: false, error: "Failed to generate template from image." };
    }
  });
