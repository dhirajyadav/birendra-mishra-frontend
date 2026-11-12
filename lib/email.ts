import nodemailer from 'nodemailer';

export interface EnquiryEmailData {
  name: string;
  email: string;
  topic: string;
  message: string;
  submittedAt?: string;
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function getSmtpTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const user = process.env.SMTP_USER || process.env.GMAIL_USER || '';
  const pass =
    process.env.SMTP_PASS ||
    process.env.GMAIL_PASS ||
    process.env.GMAIL_APP_PASSWORD ||
    '';
  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === 'true'
    : port === 465;

  if (!user || !pass) {
    return null;
  }

  // Remove spaces if user copied Google App Password with spaces (e.g. "abcd efgh ijkl mnop")
  const cleanPass = pass.replace(/\s+/g, '');

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass: cleanPass,
    },
  });
}

export async function sendEnquiryViaSmtp(data: EnquiryEmailData): Promise<boolean> {
  const transporter = getSmtpTransporter();
  if (!transporter) {
    console.warn('[SMTP] Missing SMTP_USER or SMTP_PASS environment variables. Skipping SMTP delivery.');
    return false;
  }

  const recipient =
    process.env.SMTP_TO ||
    process.env.CONTACT_NOTIFICATION_EMAIL ||
    'birendra.b.mishra@gmail.com';

  const user = process.env.SMTP_USER || process.env.GMAIL_USER || 'birendra.b.mishra@gmail.com';
  const fromName = process.env.SMTP_FROM_NAME || 'Birendra Mishra Website';
  const timestamp = data.submittedAt || new Date().toUTCString();

  const executiveNotificationHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Website Enquiry</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #F6F8FA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1A202C;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px; margin: 0 auto; background: #FFFFFF; border-radius: 8px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <tr>
      <td style="background-color: #041D56; padding: 28px 32px; border-bottom: 3px solid #C29B38;">
        <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #FFFFFF; letter-spacing: 0.5px;">Birendra Mishra</h1>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #C29B38; text-transform: uppercase; letter-spacing: 1px;">Strategic Financial Leadership · New Executive Enquiry</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px;">
        <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.5; color: #2D3748;">
          You have received a new confidential enquiry through the website contact form:
        </p>

        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 24px;">
          <tr style="border-bottom: 1px solid #EDF2F7;">
            <td style="padding: 12px 0; font-size: 13px; font-weight: 600; color: #718096; width: 140px;">Name</td>
            <td style="padding: 12px 0; font-size: 15px; color: #1A202C; font-weight: 600;">${escapeHtml(data.name)}</td>
          </tr>
          <tr style="border-bottom: 1px solid #EDF2F7;">
            <td style="padding: 12px 0; font-size: 13px; font-weight: 600; color: #718096;">Email</td>
            <td style="padding: 12px 0; font-size: 15px; color: #041D56;">
              <a href="mailto:${escapeHtml(data.email)}" style="color: #041D56; text-decoration: underline;">${escapeHtml(data.email)}</a>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #EDF2F7;">
            <td style="padding: 12px 0; font-size: 13px; font-weight: 600; color: #718096;">Enquiry Type</td>
            <td style="padding: 12px 0; font-size: 15px; color: #C29B38; font-weight: 600;">${escapeHtml(data.topic)}</td>
          </tr>
          <tr style="border-bottom: 1px solid #EDF2F7;">
            <td style="padding: 12px 0; font-size: 13px; font-weight: 600; color: #718096;">Date &amp; Time</td>
            <td style="padding: 12px 0; font-size: 13px; color: #4A5568;">${escapeHtml(timestamp)}</td>
          </tr>
        </table>

        <div style="background-color: #F8FAFC; border-left: 4px solid #C29B38; padding: 18px; border-radius: 4px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #718096; letter-spacing: 0.5px;">Message Content</p>
          <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #1A202C; white-space: pre-wrap;">${escapeHtml(data.message)}</p>
        </div>

        <p style="margin: 0; font-size: 13px; color: #718096;">
          💡 You can directly reply to this email to respond to <strong>${escapeHtml(data.name)}</strong> at <code>${escapeHtml(data.email)}</code>.
        </p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #F8FAFC; padding: 16px 32px; border-top: 1px solid #E2E8F0; text-align: center;">
        <p style="margin: 0; font-size: 12px; color: #A0AEC0;">
          Transmitted securely from birendramishra.com · Confidential
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const visitorAcknowledgementHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Enquiry Received — Birendra Mishra</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #F6F8FA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1A202C;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px; margin: 0 auto; background: #FFFFFF; border-radius: 8px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <tr>
      <td style="background-color: #041D56; padding: 28px 32px; border-bottom: 3px solid #C29B38;">
        <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #FFFFFF;">Birendra Mishra</h1>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #C29B38; text-transform: uppercase; letter-spacing: 1px;">Strategic Financial Leadership</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px;">
        <p style="margin: 0 0 16px 0; font-size: 16px; color: #1A202C;">Dear ${escapeHtml(data.name)},</p>
        <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #2D3748;">
          Thank you for reaching out regarding <strong>${escapeHtml(data.topic)}</strong>.
        </p>
        <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #2D3748;">
          Your confidential enquiry has been received. You will receive a response within 24–48 hours.
        </p>

        <div style="background-color: #F8FAFC; border-left: 3px solid #C29B38; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
          <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 600; color: #718096; text-transform: uppercase;">A copy of your message for reference:</p>
          <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #4A5568; white-space: pre-wrap;">${escapeHtml(data.message)}</p>
        </div>

        <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #2D3748;">
          Warm regards,<br>
          <strong>Birendra Mishra</strong><br>
          <span style="font-size: 13px; color: #718096;">Senior Executive | Global Financial Strategy, M&amp;A and Capital Governance</span><br>
          <a href="https://birendramishra.com" style="color: #041D56; font-size: 13px; text-decoration: none;">birendramishra.com</a>
        </p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #F8FAFC; padding: 16px 32px; border-top: 1px solid #E2E8F0; text-align: center;">
        <p style="margin: 0; font-size: 12px; color: #A0AEC0;">
          All enquiries are handled in strict executive confidence.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    // 1. Send notification to Birendra Mishra
    await transporter.sendMail({
      from: `"${fromName}" <${user}>`,
      to: recipient,
      replyTo: `"${data.name}" <${data.email}>`,
      subject: `New Confidential Enquiry: ${data.topic} — ${data.name}`,
      text: `New Website Enquiry\n\nName: ${data.name}\nEmail: ${data.email}\nTopic: ${data.topic}\nSubmitted At: ${timestamp}\n\nMessage:\n${data.message}`,
      html: executiveNotificationHtml,
    });
    console.log(`[SMTP] Executive notification successfully delivered to ${recipient}`);

    // 2. Send automated confirmation to visitor (non-blocking)
    try {
      await transporter.sendMail({
        from: `"${fromName}" <${user}>`,
        to: data.email,
        replyTo: recipient,
        subject: `Enquiry Received — Birendra Mishra`,
        text: `Dear ${data.name},\n\nThank you for contacting Birendra Mishra regarding "${data.topic}". Your enquiry has been received and you will receive a response within 24-48 hours.\n\nYour message:\n${data.message}\n\nWarm regards,\nBirendra Mishra\nhttps://birendramishra.com`,
        html: visitorAcknowledgementHtml,
      });
      console.log(`[SMTP] Visitor acknowledgement delivered to ${data.email}`);
    } catch (visitorErr) {
      console.warn('[SMTP] Failed to send visitor acknowledgement email:', visitorErr);
    }

    return true;
  } catch (err) {
    console.error('[SMTP] Failed to send email via SMTP:', err);
    return false;
  }
}
