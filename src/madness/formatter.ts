import type { KeyProject } from './projects.js';
import type { DashboardData } from './scraper.js';

// Map DRI names to Slack display names
const DRI_SLACK_NAMES: Record<string, string> = {
  'Jeff': '@Jeff',
  'Jack': '@jack',
  'Danny': '@dan',
  'Dan': '@dan',
  'Dylan': '@dylan',
  'Olly': '@olly',
  'Ajay': '@ajay',
  'Alice': '@alice',
  'Niel': '@niel',
};

function formatDri(dri: string): string {
  return dri.split(',').map(d => {
    const trimmed = d.trim();
    return DRI_SLACK_NAMES[trimmed] || trimmed;
  }).join(' ');
}

function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

export function formatMadnessPost(data: DashboardData, projects: KeyProject[]): string {
  const lines: string[] = [];

  lines.push(`${data.monthName} Madness | ${data.monthName} ${data.dayOfMonth}, ${data.year}`);
  lines.push('');
  lines.push(`<!here> We need to increase acquisition by ${formatNumber(data.gapPerDay)} regs/day`);
  lines.push('');

  lines.push('Pace:');
  lines.push(`Subs: ${data.subsEmoji} ${formatNumber(data.subsActual)} / ${formatNumber(data.subsTarget)}  (${data.subsPct}%)`);
  lines.push('');

  lines.push(`Current pace, Week ${data.weekNumber}:`);
  lines.push(`Reg: ${data.regEmoji} ${formatNumber(data.regActual)} / ${formatNumber(data.regTarget)} (${data.regPct}%)`);
  lines.push(`Gap: ${formatNumber(data.gap)} (need to increase ${formatNumber(data.gapPerDay)}/day)`);
  lines.push('');
  lines.push(':point_right: Death Clock');
  lines.push('');

  lines.push('Key projects to close the gap:');
  lines.push('');
  for (const project of projects) {
    lines.push(`${project.name} - ${formatDri(project.dri)}`);
  }

  lines.push('');
  lines.push('');
  lines.push('p.s. Memento Mori');

  return lines.join('\n');
}
