import nodemailer from "nodemailer";

// Using camelCase for the instance variable
export const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// PascalCase for helper function
export function GenerateInviteEmailHtml(
  inviteeName: string,
  eventName: string,
  code: string,
): string {
  return `
    <div style="font-family: sans-serif; max-w-md; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
      <h2>You are invited!</h2>
      <p>Hi ${inviteeName},</p>
      <p>You have been invited to <strong>${eventName}</strong>.</p>
      <div style="background-color: #f4f4f5; padding: 15px; text-align: center; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px; color: #52525b;">Your unique entry code is:</p>
        <h1 style="margin: 5px 0 0 0; font-size: 32px; letter-spacing: 4px; color: #18181b;">${code}</h1>
      </div>
      <p>Please present this code at the door for entry.</p>
    </div>
  `;
}
