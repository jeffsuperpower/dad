import https from 'https';
import { config } from '../config.js';

interface GpetExperiment {
  name: string;
  status: string;
  priority: string;
  rank: number;
  dri: string;
  notes: string;
  nextStep: string;
}

export interface KeyProject {
  name: string;
  dri: string;
  status: string;
}

export async function fetchKeyProjects(): Promise<KeyProject[]> {
  const pat = config.github.pat;
  if (!pat) throw new Error('GITHUB_PAT not configured');

  const data = await new Promise<string>((resolve, reject) => {
    https.get('https://api.github.com/repos/jgdeutsch/gpet/contents/drill-data.json', {
      headers: {
        'Authorization': `token ${pat}`,
        'User-Agent': 'dad-agent',
        'Accept': 'application/vnd.github.v3+json',
      },
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve(body));
      res.on('error', reject);
    }).on('error', reject);
  });

  const parsed = JSON.parse(data);
  const content = Buffer.from(parsed.content, 'base64').toString('utf-8');
  const experiments: GpetExperiment[] = JSON.parse(content);

  // Filter to active P0/P1 experiments that aren't archived/done
  const excludeStatuses = new Set(['Archive', 'Done', 'Success', 'Failure']);
  return experiments
    .filter(e => !excludeStatuses.has(e.status) && (e.priority === 'P0' || e.priority === 'P1'))
    .sort((a, b) => a.rank - b.rank)
    .map(e => ({
      name: e.name,
      dri: e.dri,
      status: e.status,
    }));
}
