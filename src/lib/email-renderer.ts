export const DEFAULT_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invitation to {{eventName}}</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f4f8; color: #1a1625; margin: 0; padding: 0; }
      .container { max-width: 580px; margin: 30px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e7e5e4; }
      .header { background: linear-gradient(135deg, #6d28d9 0%, #a855f7 100%); padding: 40px 24px; text-align: center; color: #ffffff; }
      .header h1 { margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }
      .header p { margin: 8px 0 0 0; opacity: 0.9; font-size: 15px; }
      .content { padding: 36px 28px; line-height: 1.6; }
      .event-card { background: #faf9f7; border: 1px solid #e7e5e4; border-left: 4px solid #6d28d9; padding: 20px; border-radius: 12px; margin: 24px 0; }
      .detail-row { margin: 8px 0; font-size: 15px; color: #444; }
      .code-container { background: #faf9f7; border: 2px dashed #6d28d9; border-radius: 16px; padding: 20px; text-align: center; margin: 28px 0; }
      .code-label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #6d28d9; margin-bottom: 6px; }
      .code-value { font-family: 'Courier New', Courier, monospace; font-size: 28px; font-weight: 800; letter-spacing: 6px; color: #1a1625; margin: 4px 0; }
      .footer { background: #faf9f7; border-t: 1px solid #e7e5e4; padding: 24px; text-align: center; font-size: 13px; color: #78716c; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>You're Invited!</h1>
        <p>An exclusive invitation for {{inviteeName}}</p>
      </div>
      <div class="content">
        <p>Hello <strong>{{inviteeName}}</strong>,</p>
        <p>You are warmly invited to attend <strong>{{eventName}}</strong>.</p>
        
        <div class="event-card">
          <div class="detail-row">📅 <strong>Date & Time:</strong> {{date}}</div>
          <div class="detail-row">📍 <strong>Location:</strong> {{location}}</div>
          <div class="detail-row">📝 <strong>Details:</strong> {{description}}</div>
        </div>

        <div class="code-container">
          <div class="code-label">Your Personal Entry Passcode</div>
          <div class="code-value">{{code}}</div>
          <p style="font-size: 12px; color: #78716c; margin-top: 8px; margin-bottom: 0;">Show this 8-character code at the door for entry verification.</p>
        </div>

        <p style="text-align: center; color: #78716c; font-size: 14px;">We look forward to seeing you there!</p>
      </div>
      <div class="footer">
        <p>© {{year}} Tiri Digital Invitations. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>`;

export function GenerateInviteEmailHtml(
  inviteeName: string,
  eventName: string,
  code: string,
  qrCodeDataUri: string,
  customTemplate?: string,
  date?: string,
  location?: string,
  description?: string,
): string {
  const templateToUse = customTemplate || DEFAULT_EMAIL_TEMPLATE;
  const currentYear = new Date().getFullYear().toString();

  const qrImageHtml = qrCodeDataUri
    ? `<img src="${qrCodeDataUri}" alt="QR Code for ${code}" style="display: inline-block; width: 180px; height: 180px; border-radius: 8px;" />`
    : "";

  return templateToUse
    .replace(/{{inviteeName}}/g, inviteeName || "Valued Guest")
    .replace(/{{eventName}}/g, eventName || "Special Event")
    .replace(/{{code}}/g, code || "")
    .replace(/{{qrCode}}/g, qrImageHtml)
    .replace(/{{date}}/g, date || "Date & Time TBA")
    .replace(/{{location}}/g, location || "Location TBA")
    .replace(/{{description}}/g, description || "No additional description provided.")
    .replace(/{{year}}/g, currentYear);
}
