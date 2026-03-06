import { config } from '../config.js';
import type { GpetExperiment } from './fetchers/notion.js';

const VALID_PRIORITIES = ['P0', 'P1', 'P2', 'P3'];
const VALID_STATUSES = ['Live', 'Building', 'Ready to Launch', 'Not started', 'Archive', 'Success', 'Failure'];
const STATUS_ALIASES: Record<string, string> = {
  'done': 'Success',
  'complete': 'Success',
  'completed': 'Success',
  'shipped': 'Live',
  'launched': 'Live',
  'launch': 'Live',
  'paused': 'Archive',
  'killed': 'Failure',
  'failed': 'Failure',
  'started': 'Building',
  'wip': 'Building',
  'ready': 'Ready to Launch',
};

interface UpdateResult {
  success: boolean;
  message: string;
}

async function fetchDrillData(): Promise<{ experiments: GpetExperiment[]; sha: string } | null> {
  const token = config.github.pat;
  if (!token) return null;

  const response = await fetch(
    'https://api.github.com/repos/jgdeutsch/gpet/contents/drill-data.json',
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'dad-agent',
      },
    },
  );

  if (!response.ok) return null;

  const fileData = await response.json() as { content: string; sha: string };
  const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
  return { experiments: JSON.parse(content), sha: fileData.sha };
}

async function pushDrillData(experiments: GpetExperiment[], sha: string, commitMsg: string): Promise<boolean> {
  const token = config.github.pat;
  if (!token) return false;

  // Re-sort by priority then rank
  const priorityOrder: Record<string, number> = { P0: 0, P1: 1, P2: 2, P3: 3 };
  experiments.sort((a, b) => {
    const pa = priorityOrder[a.priority] ?? 99;
    const pb = priorityOrder[b.priority] ?? 99;
    if (pa !== pb) return pa - pb;
    return (a.rank ?? 999) - (b.rank ?? 999);
  });

  const newContent = Buffer.from(JSON.stringify(experiments, null, 2)).toString('base64');
  const response = await fetch(
    'https://api.github.com/repos/jgdeutsch/gpet/contents/drill-data.json',
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'dad-agent',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: commitMsg, content: newContent, sha }),
    },
  );

  return response.ok;
}

function findExperiment(experiments: GpetExperiment[], name: string): GpetExperiment | undefined {
  return experiments.find(exp =>
    exp.name.toLowerCase().includes(name.toLowerCase()) ||
    name.toLowerCase().includes(exp.name.toLowerCase()),
  );
}

export async function handleDrillUpdate(text: string): Promise<UpdateResult | null> {
  const lower = text.toLowerCase();

  // Match: set <name> next step to <value>
  // Match: <name> next step: <value>
  const nextStepMatch = text.match(/(?:set\s+)?(.+?)\s+next\s*step(?:\s+to|:)\s+(.+)/i);
  if (nextStepMatch) {
    const targetName = nextStepMatch[1].trim();
    const nextStep = nextStepMatch[2].trim();

    const data = await fetchDrillData();
    if (!data) return { success: false, message: 'could not fetch drill data' };

    const target = findExperiment(data.experiments, targetName);
    if (!target) return { success: false, message: `couldn't find "${targetName}"` };

    target.nextStep = nextStep;
    const ok = await pushDrillData(data.experiments, data.sha, `${target.name}: next step -> ${nextStep}`);
    if (!ok) return { success: false, message: 'GitHub update failed' };

    return { success: true, message: `${target.name} next step: _${nextStep}_` };
  }

  // Match: clear <name> next step
  const clearMatch = lower.match(/clear\s+(.+?)\s+next\s*step/i);
  if (clearMatch) {
    const targetName = clearMatch[1].trim();

    const data = await fetchDrillData();
    if (!data) return { success: false, message: 'could not fetch drill data' };

    const target = findExperiment(data.experiments, targetName);
    if (!target) return { success: false, message: `couldn't find "${targetName}"` };

    target.nextStep = '';
    const ok = await pushDrillData(data.experiments, data.sha, `${target.name}: cleared next step`);
    if (!ok) return { success: false, message: 'GitHub update failed' };

    return { success: true, message: `cleared next step for ${target.name}` };
  }

  // Match: move/change/set <name> to/as <priority>
  const priorityMatch = lower.match(/(?:move|change|set)\s+(.+?)(?:\s+priority)?\s+(?:to|as)\s+(p[0-3])/i);
  // Match: mark/change/set <name> as/to <status>
  const statusMatch = lower.match(/(?:mark|change|set)\s+(.+?)(?:\s+status)?\s+(?:to|as)\s+(.+)/i);

  let targetName: string | null = null;
  let field: 'priority' | 'status' | null = null;
  let newValue: string | null = null;

  if (priorityMatch) {
    targetName = priorityMatch[1].trim();
    field = 'priority';
    newValue = priorityMatch[2].toUpperCase();
  } else if (statusMatch) {
    targetName = statusMatch[1].trim();
    const val = statusMatch[2].trim();
    if (VALID_PRIORITIES.includes(val.toUpperCase())) {
      field = 'priority';
      newValue = val.toUpperCase();
    } else {
      field = 'status';
      newValue = STATUS_ALIASES[val.toLowerCase()]
        || VALID_STATUSES.find(s => s.toLowerCase() === val.toLowerCase())
        || VALID_STATUSES.find(s => s.toLowerCase().includes(val.toLowerCase()))
        || null;
    }
  }

  if (!targetName || !field || !newValue) return null;

  const data = await fetchDrillData();
  if (!data) return { success: false, message: 'could not fetch drill data' };

  const target = findExperiment(data.experiments, targetName);
  if (!target) return { success: false, message: `couldn't find "${targetName}"` };

  const oldValue = field === 'priority' ? target.priority : target.status;
  if (field === 'priority') {
    target.priority = newValue;
  } else {
    target.status = newValue;
  }

  const ok = await pushDrillData(data.experiments, data.sha, `${target.name}: ${field} ${oldValue} -> ${newValue}`);
  if (!ok) return { success: false, message: 'GitHub update failed' };

  return { success: true, message: `updated *${target.name}* ${field}: ${oldValue} -> ${newValue}` };
}
