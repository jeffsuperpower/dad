import type { GpetExperiment } from './fetchers/notion.js';
import type { CalendarEvent } from './fetchers/calendar.js';

const STATUS_EMOJI: Record<string, string> = {
  'Live': ':green-dot:',
  'Ready to Launch': ':yellow-dot:',
  'Building': ':construction:',
  'Not started': ':white_circle:',
};

const PRIORITY_LABEL: Record<string, string> = {
  'P0': '*P0 - Do These First*',
  'P1': '*P1 - High Priority*',
  'P2': '*P2 - Standard*',
  'P3': '*P3 - Low Priority*',
};

function formatDate(): string {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    timeZone: 'America/Los_Angeles',
  });
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
}

function formatUpside(low: number | null, high: number | null): string {
  if ((low === null || low === 0) && (high === null || high === 0)) return '';
  const fmt = (n: number) => n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${n}`;
  if (low !== null && low > 0 && high !== null && high > 0) return `${fmt(low)}-${fmt(high)}/mo`;
  if (high !== null && high > 0) return `${fmt(high)}/mo`;
  if (low !== null && low > 0) return `${fmt(low)}+/mo`;
  return '';
}

function formatCalendarSection(events: CalendarEvent[]): string {
  if (events.length === 0) {
    return ':calendar: *Today\'s calendar:*\n_No meetings. Full day of deep work._';
  }

  const lines: string[] = [':calendar: *Today\'s calendar:*'];

  const allDay = events.filter(e => e.isAllDay);
  for (const e of allDay) {
    lines.push(`> :round_pushpin: ${e.summary} _(all day)_`);
  }

  const timed = events.filter(e => !e.isAllDay);
  for (const e of timed) {
    lines.push(`> ${e.startTime} - ${e.endTime} *${e.summary}* _(${formatDuration(e.durationMinutes)})_`);
  }

  const totalMeetings = timed.length;
  const totalMinutes = timed.reduce((sum, e) => sum + e.durationMinutes, 0);
  const deepWorkHours = Math.max(0, 8 - totalMinutes / 60);

  lines.push(`_${totalMeetings} meeting${totalMeetings !== 1 ? 's' : ''}, ${formatDuration(totalMinutes)} total. ~${deepWorkHours.toFixed(1)}h deep work._`);

  return lines.join('\n');
}

function formatExperimentsSection(experiments: GpetExperiment[]): string {
  if (experiments.length === 0) {
    return '_No active experiments._';
  }

  const lines: string[] = [];

  // Group by priority
  const groups = new Map<string, GpetExperiment[]>();
  for (const exp of experiments) {
    const p = exp.priority || 'Unset';
    if (!groups.has(p)) groups.set(p, []);
    groups.get(p)!.push(exp);
  }

  const priorityOrder = ['P0', 'P1', 'P2', 'P3', 'Unset'];
  for (const priority of priorityOrder) {
    const group = groups.get(priority);
    if (!group || group.length === 0) continue;

    const header = PRIORITY_LABEL[priority] || `*${priority}*`;
    lines.push('');
    lines.push(header);

    for (const exp of group) {
      const dot = STATUS_EMOJI[exp.status] || ':white_circle:';
      const upside = formatUpside(exp.upsideLow, exp.upsideHigh);
      const dri = exp.dri ? ` _${exp.dri}_` : '';

      let line = `${dot} ${exp.name} (${exp.status})`;
      if (exp.nextStep) {
        line += `\n     :point_right: _${exp.nextStep}_`;
      }
      lines.push(line);
    }
  }

  // Quick stats
  const statusCounts = new Map<string, number>();
  for (const exp of experiments) {
    const s = exp.status || 'Unknown';
    statusCounts.set(s, (statusCounts.get(s) || 0) + 1);
  }

  const statParts: string[] = [];
  for (const status of ['Live', 'Ready to Launch', 'Building', 'Not started']) {
    const count = statusCounts.get(status);
    if (count) statParts.push(`${count} ${status.toLowerCase()}`);
  }

  lines.push('');
  if (statParts.length > 0) {
    lines.push(`_${experiments.length} active: ${statParts.join(', ')}_`);
  }

  return lines.join('\n');
}

export function formatDrillMessage(
  experiments: GpetExperiment[] | null,
  events: CalendarEvent[] | null,
  errors: string[],
): string {
  const lines: string[] = [];

  lines.push(`:sunrise: *GPET Daily Drill* - ${formatDate()}`);

  if (events !== null) {
    lines.push('');
    lines.push(formatCalendarSection(events));
  }

  if (experiments !== null) {
    lines.push('');
    lines.push('---');
    lines.push(formatExperimentsSection(experiments));
  }

  if (errors.length > 0) {
    lines.push('');
    for (const err of errors) {
      lines.push(`_:warning: ${err}_`);
    }
  }

  return lines.join('\n');
}
