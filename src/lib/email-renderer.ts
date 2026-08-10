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
      .map-btn-container { margin-top: 16px; }
      .map-btn { display: inline-block; background-color: #6d28d9; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; }
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
          {{mapButton}}
          <div class="detail-row" style="margin-top: 16px;">📝 <strong>Details:</strong> {{description}}</div>
        </div>

        <div class="code-container">
          <div class="code-label">Your Personal Entry Passcode</div>
          <div style="margin: 16px 0;">{{qrCode}}</div>
          <div class="code-value">{{code}}</div>
          <p style="font-size: 12px; color: #78716c; margin-top: 8px; margin-bottom: 0;">Show this 8-character code or QR code at the door for entry verification.</p>
        </div>

        <p style="text-align: center; color: #78716c; font-size: 14px;">We look forward to seeing you there!</p>
      </div>
      <div class="footer">
        <p>© {{year}} Tiri Digital Invitations. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>`;
export const FANCY_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invitation to {{eventName}}</title>
    <style>
      body { font-family: 'Georgia', serif; background-color: #1a1a1a; color: #fdfdfd; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 40px auto; background: #262626; border-radius: 8px; border: 1px solid #d4af37; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.4); }
      .header { padding: 50px 30px; text-align: center; border-bottom: 1px solid #d4af37; background: #1a1a1a; }
      .header h1 { margin: 0; font-size: 36px; font-weight: normal; letter-spacing: 2px; color: #d4af37; text-transform: uppercase; }
      .header p { margin: 15px 0 0 0; font-size: 16px; font-style: italic; color: #a3a3a3; }
      .content { padding: 40px 30px; line-height: 1.8; text-align: center; }
      .event-card { margin: 30px 0; padding: 30px; border: 1px solid #404040; background: #1a1a1a; }
      .detail-row { margin: 12px 0; font-size: 16px; color: #e5e5e5; }
      .map-btn { display: inline-block; background-color: transparent; color: #d4af37; text-decoration: none; padding: 12px 24px; border: 1px solid #d4af37; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-top: 20px; transition: all 0.3s ease; }
      .code-container { margin: 40px 0; padding: 30px; border-top: 1px solid #404040; border-bottom: 1px solid #404040; }
      .code-label { font-size: 12px; text-transform: uppercase; letter-spacing: 3px; color: #a3a3a3; }
      .code-value { font-family: monospace; font-size: 32px; letter-spacing: 8px; color: #d4af37; margin: 15px 0; }
      .footer { padding: 30px; text-align: center; font-size: 12px; color: #737373; background: #1a1a1a; border-top: 1px solid #404040; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>{{eventName}}</h1>
        <p>A Night of Elegance</p>
      </div>
      <div class="content">
        <p style="font-size: 18px; color: #d4af37; font-style: italic;">Dear {{inviteeName}},</p>
        <p>You are cordially invited to join us for an unforgettable evening.</p>
        
        <div class="event-card">
          <div class="detail-row"><strong>Date:</strong> {{date}}</div>
          <div class="detail-row"><strong>Venue:</strong> {{location}}</div>
          {{mapButton}}
          <div class="detail-row" style="margin-top: 20px; font-style: italic; color: #a3a3a3;">{{description}}</div>
        </div>

        <div class="code-container">
          <div class="code-label">Your VIP Access</div>
          <div style="margin: 20px 0;">{{qrCode}}</div>
          <div class="code-value">{{code}}</div>
          <p style="font-size: 12px; color: #737373; margin-top: 10px;">Please present this credentials upon arrival.</p>
        </div>

        <p style="font-style: italic; color: #a3a3a3;">With warmest regards.</p>
      </div>
      <div class="footer">
        <p>© {{year}} Tiri Digital Invitations</p>
      </div>
    </div>
  </body>
</html>`;

export const FORMAL_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invitation: {{eventName}}</title>
    <style>
      body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; color: #333333; margin: 0; padding: 0; }
      .container { max-width: 650px; margin: 40px auto; background: #ffffff; border-top: 6px solid #003366; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
      .header { padding: 40px; text-align: left; border-bottom: 1px solid #eeeeee; }
      .header h1 { margin: 0; font-size: 24px; color: #003366; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
      .content { padding: 40px; line-height: 1.6; font-size: 15px; }
      .event-card { background: #f9f9f9; padding: 25px; border-left: 4px solid #003366; margin: 30px 0; }
      .detail-row { margin: 10px 0; }
      .detail-label { font-weight: bold; color: #555555; width: 100px; display: inline-block; }
      .map-btn { display: inline-block; background-color: #003366; color: #ffffff; text-decoration: none; padding: 10px 20px; font-size: 13px; font-weight: bold; margin-top: 15px; }
      .code-container { margin: 30px 0 0 0; padding-top: 30px; border-top: 1px solid #eeeeee; display: flex; align-items: center; justify-content: space-between; }
      .code-details { flex: 1; }
      .code-label { font-size: 12px; font-weight: bold; text-transform: uppercase; color: #888888; }
      .code-value { font-family: 'Courier New', Courier, monospace; font-size: 24px; font-weight: bold; color: #003366; margin: 10px 0; }
      .footer { background: #003366; padding: 20px; text-align: center; font-size: 12px; color: #ffffff; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>{{eventName}}</h1>
      </div>
      <div class="content">
        <p>Dear {{inviteeName}},</p>
        <p>You are formally invited to attend <strong>{{eventName}}</strong>. Please find the details of the event enclosed below.</p>
        
        <div class="event-card">
          <div class="detail-row"><span class="detail-label">Date:</span> {{date}}</div>
          <div class="detail-row"><span class="detail-label">Location:</span> {{location}}</div>
          {{mapButton}}
          <div class="detail-row" style="margin-top: 20px;"><span class="detail-label">Details:</span> {{description}}</div>
        </div>

        <div class="code-container">
          <div class="code-details">
            <div class="code-label">Registration Passcode</div>
            <div class="code-value">{{code}}</div>
            <p style="font-size: 12px; color: #666666; margin: 0;">Required for event check-in.</p>
          </div>
          <div>{{qrCode}}</div>
        </div>
      </div>
      <div class="footer">
        <p>This is an automated formal invitation generated by Tiri.</p>
      </div>
    </div>
  </body>
</html>`;

export const WEDDING_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wedding Invitation: {{eventName}}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Lato:wght@300;400&display=swap');
      body { font-family: 'Lato', sans-serif; background-color: #fcfbf9; color: #4a4a4a; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 40px auto; background: #ffffff; padding: 40px; box-sizing: border-box; box-shadow: 0 10px 30px rgba(0,0,0,0.03); text-align: center; position: relative; overflow: hidden; }
      .container::before { content: ""; position: absolute; top: 15px; left: 15px; right: 15px; bottom: 15px; border: 1px solid #e8e3dc; pointer-events: none; }
      .header { padding: 40px 0 20px; }
      .header h1 { font-family: 'Playfair Display', serif; margin: 0; font-size: 32px; font-weight: 600; color: #2c3e50; }
      .header p { font-family: 'Playfair Display', serif; font-style: italic; font-size: 18px; color: #8e8a83; margin-top: 15px; }
      .content { padding: 20px 40px 40px; line-height: 1.8; }
      .event-card { margin: 30px 0; }
      .detail-row { margin: 15px 0; font-size: 15px; }
      .map-btn { display: inline-block; background-color: #f4efea; color: #2c3e50; text-decoration: none; padding: 10px 25px; border-radius: 30px; font-size: 13px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; margin-top: 10px; }
      .code-container { margin-top: 40px; }
      .code-value { font-family: 'Playfair Display', serif; font-size: 26px; color: #2c3e50; margin: 15px 0; letter-spacing: 4px; }
      .footer { padding-top: 30px; border-top: 1px solid #e8e3dc; font-size: 12px; color: #b5b1aa; text-transform: uppercase; letter-spacing: 2px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <p>Joyfully inviting</p>
        <p style="color: #2c3e50; font-size: 20px;">{{inviteeName}}</p>
        <p>to celebrate the wedding of</p>
        <h1 style="margin-top: 25px;">{{eventName}}</h1>
      </div>
      <div class="content">
        <div class="event-card">
          <div class="detail-row" style="text-transform: uppercase; letter-spacing: 1px; font-weight: bold; color: #2c3e50;">{{date}}</div>
          <div class="detail-row">{{location}}</div>
          {{mapButton}}
          <div class="detail-row" style="font-style: italic; margin-top: 25px;">{{description}}</div>
        </div>

        <div class="code-container">
          <div style="margin: 20px 0;">{{qrCode}}</div>
          <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #8e8a83;">Guest Access Code</div>
          <div class="code-value">{{code}}</div>
        </div>
      </div>
      <div class="footer">
        <p>Tiri Digital Invitations</p>
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
  latitude?: number | null,
  longitude?: number | null,
  isPreview: boolean = false
): string {
  const templateToUse = customTemplate || DEFAULT_EMAIL_TEMPLATE;
  const currentYear = new Date().getFullYear().toString();

  const qrSrc = isPreview ? qrCodeDataUri : `cid:qrcode-${code}`;
  
  const qrImageHtml = qrCodeDataUri
    ? `<img src="${qrSrc}" alt="QR Code for ${code}" style="display: block; width: 100%; max-width: 180px; height: auto; margin: 0 auto; border-radius: 8px;" />`
    : "";

  const mapButtonHtml = latitude && longitude
    ? `<div class="map-btn-container" style="text-align: center; margin-top: 16px;"><a href="https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}" class="map-btn" target="_blank" style="display: inline-block; padding: 10px 20px; text-decoration: none; border-radius: 6px;">View on Google Maps</a></div>`
    : "";

  return templateToUse
    .replace(/{{inviteeName}}/g, inviteeName || "Valued Guest")
    .replace(/{{eventName}}/g, eventName || "Special Event")
    .replace(/{{code}}/g, code || "")
    .replace(/{{qrCode}}/g, qrImageHtml)
    .replace(/{{date}}/g, date || "Date & Time TBA")
    .replace(/{{location}}/g, location || "Location TBA")
    .replace(/{{mapButton}}/g, mapButtonHtml)
    .replace(/{{description}}/g, description || "No additional description provided.")
    .replace(/{{year}}/g, currentYear);
}
