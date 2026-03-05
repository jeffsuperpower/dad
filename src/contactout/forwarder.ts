import { google } from 'googleapis';
import { config } from '../config.js';

function getGmailClient() {
  const oauth2 = new google.auth.OAuth2(
    config.gmail.clientId,
    config.gmail.clientSecret,
  );
  oauth2.setCredentials({ refresh_token: config.gmail.refreshToken });
  return google.gmail({ version: 'v1', auth: oauth2 });
}

/**
 * Find the most recent email from contactout.net in jeff@superpower.com
 * and forward it to the specified recipient.
 */
export async function forwardContactOutEmail(
  toEmail: string,
): Promise<{ success: boolean; message: string }> {
  const gmail = getGmailClient();

  // Search for the latest email from contactout.net
  const res = await gmail.users.messages.list({
    userId: 'me',
    q: 'from:contactout.net',
    maxResults: 1,
  });

  const messages = res.data.messages;
  if (!messages || messages.length === 0) {
    return { success: false, message: 'No emails from contactout.net found.' };
  }

  // Get the full message
  const msg = await gmail.users.messages.get({
    userId: 'me',
    id: messages[0].id!,
    format: 'raw',
  });

  const rawMessage = msg.data.raw;
  if (!rawMessage) {
    return { success: false, message: 'Could not read the email content.' };
  }

  // Decode the raw message to extract subject and build a forwarded message
  const decoded = Buffer.from(rawMessage, 'base64url').toString('utf-8');

  // Extract subject from headers
  const subjectMatch = decoded.match(/^Subject:\s*(.+)$/mi);
  const originalSubject = subjectMatch ? subjectMatch[1].trim() : 'ContactOut Email';

  // Extract the original From header
  const fromMatch = decoded.match(/^From:\s*(.+)$/mi);
  const originalFrom = fromMatch ? fromMatch[1].trim() : 'contactout.net';

  // Extract Date
  const dateMatch = decoded.match(/^Date:\s*(.+)$/mi);
  const originalDate = dateMatch ? dateMatch[1].trim() : '';

  // Extract body - get everything after the blank line separating headers from body
  // For multipart messages, we'll forward the raw content
  const headerEndIdx = decoded.indexOf('\r\n\r\n');
  const body = headerEndIdx !== -1 ? decoded.slice(headerEndIdx + 4) : decoded;

  // Check if original message is multipart
  const contentTypeMatch = decoded.match(/^Content-Type:\s*(.+)$/mi);
  const originalContentType = contentTypeMatch ? contentTypeMatch[1].trim() : 'text/plain';
  const isMultipart = originalContentType.toLowerCase().startsWith('multipart/');

  // Build the forwarded email
  let forwardedEmail: string;

  if (isMultipart) {
    // For multipart messages, preserve the original structure
    // Re-use the original Content-Type (with boundary)
    const headers = [
      `From: ${config.gmail.fromAddress}`,
      `To: ${toEmail}`,
      `Subject: Fwd: ${originalSubject}`,
      `Content-Type: ${originalContentType}`,
      `MIME-Version: 1.0`,
    ].join('\r\n');
    forwardedEmail = headers + '\r\n\r\n' + body;
  } else {
    // Simple text/html message
    const headers = [
      `From: ${config.gmail.fromAddress}`,
      `To: ${toEmail}`,
      `Subject: Fwd: ${originalSubject}`,
      `Content-Type: ${originalContentType}`,
      `MIME-Version: 1.0`,
    ].join('\r\n');

    const forwardHeader = [
      '',
      '---------- Forwarded message ----------',
      `From: ${originalFrom}`,
      `Date: ${originalDate}`,
      `Subject: ${originalSubject}`,
      '',
    ].join('\r\n');

    forwardedEmail = headers + '\r\n\r\n' + forwardHeader + '\r\n' + body;
  }

  // Encode and send
  const encodedMessage = Buffer.from(forwardedEmail)
    .toString('base64url');

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage,
    },
  });

  return {
    success: true,
    message: `Forwarded "${originalSubject}" from ${originalFrom} to ${toEmail}`,
  };
}
