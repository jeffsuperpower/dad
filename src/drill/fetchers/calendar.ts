import { config } from '../../config.js';

export interface CalendarEvent {
  summary: string;
  startTime: string; // HH:MM AM/PM
  endTime: string;
  durationMinutes: number;
  isAllDay: boolean;
}

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface GoogleEvent {
  summary?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
  status?: string;
}

interface GoogleEventsResponse {
  items?: GoogleEvent[];
}

async function refreshAccessToken(): Promise<string> {
  const { clientId, clientSecret, refreshToken } = config.googleCalendar;
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Google Calendar OAuth not configured');
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Google token refresh ${response.status}: ${body}`);
  }

  const data = await response.json() as TokenResponse;
  return data.access_token;
}

function formatTime(isoString: string, tz: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: tz,
    hour12: true,
  });
}

export async function fetchTodayEvents(): Promise<CalendarEvent[]> {
  const accessToken = await refreshAccessToken();
  const tz = config.drill.timezone;
  const { calendarId } = config.googleCalendar;

  // Calculate today's start/end in the configured timezone
  const now = new Date();
  const todayStr = now.toLocaleDateString('en-CA', { timeZone: tz }); // YYYY-MM-DD
  const timeMin = `${todayStr}T00:00:00`;
  const timeMax = `${todayStr}T23:59:59`;

  // Build timezone offset for the API
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    timeZoneName: 'longOffset',
  });
  const parts = formatter.formatToParts(now);
  const offsetPart = parts.find(p => p.type === 'timeZoneName');
  const offset = offsetPart?.value?.replace('GMT', '') || '-07:00';

  const params = new URLSearchParams({
    timeMin: `${timeMin}${offset}`,
    timeMax: `${timeMax}${offset}`,
    singleEvents: 'true',
    orderBy: 'startTime',
    timeZone: tz,
  });

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Google Calendar API ${response.status}: ${body}`);
  }

  const data = await response.json() as GoogleEventsResponse;
  const events = data.items || [];

  return events
    .filter(e => e.status !== 'cancelled')
    .map((event): CalendarEvent => {
      const isAllDay = !event.start?.dateTime;

      if (isAllDay) {
        return {
          summary: event.summary || '(No title)',
          startTime: 'All day',
          endTime: '',
          durationMinutes: 0,
          isAllDay: true,
        };
      }

      const startDt = new Date(event.start!.dateTime!);
      const endDt = new Date(event.end!.dateTime!);
      const durationMinutes = Math.round((endDt.getTime() - startDt.getTime()) / 60000);

      return {
        summary: event.summary || '(No title)',
        startTime: formatTime(event.start!.dateTime!, tz),
        endTime: formatTime(event.end!.dateTime!, tz),
        durationMinutes,
        isAllDay: false,
      };
    });
}
