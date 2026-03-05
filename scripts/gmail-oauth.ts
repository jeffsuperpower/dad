/**
 * One-time script to generate a Gmail OAuth refresh token for jeff@superpower.com.
 *
 * Usage:
 *   npx tsx scripts/gmail-oauth.ts
 *
 * You'll need to set these env vars (or they'll use the Google Calendar ones from Fly):
 *   GMAIL_CLIENT_ID
 *   GMAIL_CLIENT_SECRET
 *
 * The script will open a browser for OAuth consent, then print the refresh token.
 */
import { google } from 'googleapis';
import { createServer } from 'http';
import { URL } from 'url';

const CLIENT_ID = process.env.GMAIL_CLIENT_ID || process.env.GOOGLE_CALENDAR_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET || process.env.GOOGLE_CALENDAR_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Set GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET env vars');
  process.exit(1);
}

// Desktop/Installed apps allow http://localhost on any port
const REDIRECT_URI = 'http://localhost:3847';
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
];

const oauth2 = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authUrl = oauth2.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent',
});

console.log('\nOpen this URL in your browser (logged in as jeff@superpower.com):\n');
console.log(authUrl);
console.log('\nWaiting for callback on localhost:3847...\n');

const server = createServer(async (req, res) => {
  const url = new URL(req.url!, `http://localhost:3847`);
  const code = url.searchParams.get('code');
  if (!code) {
    res.writeHead(400);
    res.end('No code in callback');
    return;
  }

  try {
    const { tokens } = await oauth2.getToken(code);
    console.log('\n=== SUCCESS ===');
    console.log('Refresh Token:', tokens.refresh_token);
    console.log('\nSet this on Fly.io:');
    console.log(`~/.fly/bin/flyctl secrets set GMAIL_REFRESH_TOKEN="${tokens.refresh_token}" -a dad-agent`);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Done! You can close this tab.</h1><p>Check your terminal for the refresh token.</p>');
  } catch (err) {
    console.error('Token exchange failed:', err);
    res.writeHead(500);
    res.end('Token exchange failed');
  }

  server.close();
});

server.listen(3847);
