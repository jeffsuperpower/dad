import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { config } from '../config.js';
import { scrapeBmvsAppointments, type BmvsLocation } from './scraper.js';

const STATE_FILE = '/data/bmvs/state.json';
const STOP_FILE = '/data/bmvs/stopped';

interface BmvsState {
  lastCheck: string;
  lastLocations: BmvsLocation[];
  lastNotified: string;
}

function ensureDir(): void {
  mkdirSync('/data/bmvs', { recursive: true });
}

function saveState(state: BmvsState): void {
  ensureDir();
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

export function isStopped(): boolean {
  return existsSync(STOP_FILE);
}

export function stopChecking(): void {
  ensureDir();
  writeFileSync(STOP_FILE, new Date().toISOString());
}

export function resumeChecking(): void {
  try {
    unlinkSync(STOP_FILE);
  } catch {}
}

/**
 * Format locations into a readable Slack message
 */
function formatLocations(locations: BmvsLocation[]): string {
  if (locations.length === 0) {
    return 'No Sydney/NSW locations found with availability.';
  }

  const lines = locations.map(loc => {
    const avail = loc.firstAvailable || 'No availability shown';
    return `*${loc.name}*\n  ${loc.address}\n  :calendar: First available: *${avail}*`;
  });

  return lines.join('\n\n');
}

/**
 * Check BMVS appointments and return a Slack message if there's anything to report.
 * Returns null if stopped.
 */
export async function checkBmvsAppointments(client: any): Promise<void> {
  if (isStopped()) {
    console.log('[BMVS] Checking is stopped. Skipping.');
    return;
  }

  console.log('[BMVS] Scraping BMVS appointments...');

  let locations: BmvsLocation[];
  try {
    locations = await scrapeBmvsAppointments('Sydney', 'NSW');
  } catch (err) {
    console.error('[BMVS] Scrape error:', err);
    // DM Jeff about the error
    await client.chat.postMessage({
      channel: config.bmvs.userId,
      text: `:warning: *BMVS Appointment Check Failed*\n\nCouldn't scrape the appointment page. Error: ${err instanceof Error ? err.message : String(err)}\n\nI'll try again at the next scheduled check. Tell me to \`STOP\` in all caps to stop checking.`,
    });
    return;
  }

  const now = new Date().toISOString();
  const sydneyLocations = locations.filter(l =>
    l.firstAvailable && !l.firstAvailable.toLowerCase().includes('no available')
  );

  // Save state
  saveState({
    lastCheck: now,
    lastLocations: locations,
    lastNotified: now,
  });

  // Build message
  const header = `:hospital: *BMVS Medical Appointment Check*\n:clock3: _Checked: ${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })} AEST_\n\n`;

  let body: string;
  if (sydneyLocations.length > 0) {
    body = `*${sydneyLocations.length} location(s) with availability in NSW:*\n\n${formatLocations(sydneyLocations)}`;
  } else {
    body = ':x: No locations with availability found in Sydney/NSW right now.';
  }

  const footer = `\n\n:link: <https://bmvs.onlineappointmentscheduling.net.au/oasis/|Book here>\n\n_Tell me \`STOP\` in all caps to stop these checks._`;

  // DM Jeff
  await client.chat.postMessage({
    channel: config.bmvs.userId,
    text: header + body + footer,
  });

  console.log(`[BMVS] Check complete. Found ${sydneyLocations.length} locations with availability.`);
}
