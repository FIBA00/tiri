import nodemailer from "nodemailer";
import QRCode from "qrcode";
import { DEFAULT_EMAIL_TEMPLATE, GenerateInviteEmailHtml } from "@/lib/email-renderer";

export const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function GenerateQrCodeDataUri(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, { width: 200, margin: 2 });
  } catch (error) {
    console.error("Failed to generate QR code", error);
    return "";
  }
}

export { GenerateInviteEmailHtml, DEFAULT_EMAIL_TEMPLATE };
