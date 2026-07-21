import nodemailer from "nodemailer";
import QRCode from "qrcode";

export const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// PascalCase for functions
export async function GenerateQrCodeDataUri(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, { width: 200, margin: 2 });
  } catch (error) {
    console.error("Failed to generate QR code", error);
    return "";
  }
}

export function GenerateInviteEmailHtml(
  inviteeName: string,
  eventName: string,
  code: string,
  qrCodeDataUri: string,
  customTemplate?: string,
): string {
  if (customTemplate) {
    return customTemplate
      .replace(/{{inviteeName}}/g, inviteeName)
      .replace(/{{eventName}}/g, eventName)
      .replace(/{{code}}/g, code)
      .replace(
        /{{qrCode}}/g,
        `<img src="${qrCodeDataUri}" alt="QR Code" width="200" height="200" />`,
      );
  }

  // Fallback to the default styled template
  return `
    <div style="font-family: sans-serif; max-w-md; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
      <h2>You are invited!</h2>
      <p>Hi ${inviteeName},</p>
      <p>You have been invited to <strong>${eventName}</strong>.</p>
      
      <div style="background-color: #f4f4f5; padding: 20px; text-align: center; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px; color: #52525b;">Your unique entry code is:</p>
        <h1 style="margin: 5px 0 15px 0; font-size: 32px; letter-spacing: 4px; color: #18181b;">${code}</h1>
        
        <div style="background-color: white; display: inline-block; padding: 10px; border-radius: 8px;">
          <img src="${qrCodeDataUri}" alt="QR Code for ${code}" style="display: block; width: 150px; height: 150px;" />
        </div>
      </div>
      
      <p style="color: #52525b; font-size: 14px;">Please present this code or scan the QR code at the door for entry.</p>
    </div>
  `;
}
