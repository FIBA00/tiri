import { prisma } from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";
import { DEFAULT_EMAIL_TEMPLATE } from "@/lib/email-renderer";

export { DEFAULT_EMAIL_TEMPLATE };

export async function GetTemplates(userId?: string) {
  const templates = await prisma.template.findMany({
    where: {
      OR: [
        { userId: userId || undefined },
        { userId: null },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  return templates;
}

export async function CreateTemplate(name: string, html: string, imageUrl?: string, userId?: string) {
  return await prisma.template.create({
    data: {
      name,
      html,
      imageUrl,
      userId,
    },
  });
}

export async function GenerateHtmlFromImage(imageBase64: string, mimeType: string = "image/png"): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are a world-class HTML email developer. Analyze this invitation card design image and convert it into a clean, modern, fully responsive HTML email template using inline CSS styling.

Requirements:
1. Make sure it uses modern fonts and clean layout matching the visual style of the image.
2. Include these exact placeholders in the HTML where appropriate:
   - {{inviteeName}} - Name of the invited guest
   - {{eventName}} - Title of the event
   - {{date}} - Event date and time
   - {{location}} - Event location or venue
   - {{code}} - 8-character entry passcode
   - {{qrCode}} - QR Code image for the entry passcode
   - {{description}} - Event notes or description
3. Return ONLY valid HTML code wrapped in <html>...</html>. Do not include markdown code block syntax or extra commentary.`;

  const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: cleanBase64,
              mimeType,
            },
          },
        ],
      },
    ],
  });

  let text = response.text || "";
  text = text.replace(/^```html\s*/i, "").replace(/\s*```$/i, "").trim();

  if (!text.includes("<html") && !text.includes("<div")) {
    text = DEFAULT_EMAIL_TEMPLATE;
  }

  return text;
}
