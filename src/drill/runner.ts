import type { WebClient } from '@slack/web-api';
import { config } from '../config.js';
import { fetchActiveExperiments } from './fetchers/notion.js';
import { fetchTodayEvents } from './fetchers/calendar.js';
import { formatDrillMessage } from './formatter.js';
import { sendDrillDM } from './sender.js';
import type { GpetExperiment } from './fetchers/notion.js';
import type { CalendarEvent } from './fetchers/calendar.js';

export async function runDailyDrill(client: WebClient): Promise<void> {
  console.log('[Drill] Running daily drill...');

  let experiments: GpetExperiment[] | null = null;
  let events: CalendarEvent[] | null = null;
  const errors: string[] = [];

  // Fetch both data sources in parallel, gracefully handling failures
  const [notionResult, calendarResult] = await Promise.allSettled([
    fetchActiveExperiments(),
    fetchTodayEvents(),
  ]);

  if (notionResult.status === 'fulfilled') {
    experiments = notionResult.value;
    console.log(`[Drill] Fetched ${experiments.length} active experiments`);
  } else {
    const msg = notionResult.reason instanceof Error
      ? notionResult.reason.message
      : String(notionResult.reason);
    console.error('[Drill] Notion fetch failed:', msg);
    errors.push(`Could not load experiments: ${msg}`);
  }

  if (calendarResult.status === 'fulfilled') {
    events = calendarResult.value;
    console.log(`[Drill] Fetched ${events.length} calendar events`);
  } else {
    const msg = calendarResult.reason instanceof Error
      ? calendarResult.reason.message
      : String(calendarResult.reason);
    console.error('[Drill] Calendar fetch failed:', msg);
    errors.push(`Could not load calendar: ${msg}`);
  }

  // If both failed, still send a message noting the errors
  const message = formatDrillMessage(experiments, events, errors);

  try {
    await sendDrillDM(client, config.drill.userId, message);
    console.log('[Drill] Daily drill sent successfully');
  } catch (err) {
    console.error('[Drill] Failed to send DM:', err);
  }
}
