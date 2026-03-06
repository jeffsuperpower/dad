import { config } from '../../config.js';

export interface GpetExperiment {
  name: string;
  status: string;
  priority: string;
  rank: number | null;
  type: string;
  upsideLow: number | null;
  upsideHigh: number | null;
  dri: string;
  notes: string;
  nextStep: string;
  notionUrl: string;
}

/**
 * Fetches drill-data.json from the jgdeutsch/gpet repo on GitHub.
 * This JSON is exported from the Notion GPET database by a local script.
 */
export async function fetchActiveExperiments(): Promise<GpetExperiment[]> {
  const token = config.github.pat;
  if (!token) throw new Error('GITHUB_PAT not configured');

  const response = await fetch(
    'https://api.github.com/repos/jgdeutsch/gpet/contents/drill-data.json',
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.raw+json',
        'User-Agent': 'dad-agent',
      },
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API ${response.status}: ${body}`);
  }

  const data = await response.json() as GpetExperiment[];

  // Filter out archived/completed/failed experiments for the daily drill
  const ACTIVE_STATUSES = ['Live', 'Building', 'Ready to Launch', 'Not started'];
  return data.filter(exp => ACTIVE_STATUSES.includes(exp.status));
}
