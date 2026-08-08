"use server";

import { authActionClient } from "@/lib/safe-action";
import { z } from "zod";
import { CreateTemplate, GetTemplates, GenerateHtmlFromImage } from "../services/template.service";

const generateFromImageSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  imageBase64: z.string().min(1, "Image data is required"),
  mimeType: z.string().optional().default("image/png"),
});

export const generateTemplateFromImageAction = authActionClient
  .schema(generateFromImageSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { userId } = ctx;
    const { name, imageBase64, mimeType } = parsedInput;

    try {
      const generatedHtml = await GenerateHtmlFromImage(imageBase64, mimeType);
      const newTemplate = await CreateTemplate(name, generatedHtml, undefined, userId);

      return {
        success: true,
        data: newTemplate,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to generate template from image.",
      };
    }
  });

export const listTemplatesAction = authActionClient
  .schema(z.object({}))
  .action(async ({ ctx }) => {
    const { userId } = ctx;
    const templates = await GetTemplates(userId);

    return {
      success: true,
      data: templates,
    };
  });
