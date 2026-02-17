import { mkdirSync, readFileSync, appendFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { config } from '../config.js';
import https from 'https';
import http from 'http';

const TRAINING_DIR = join(config.agent.cwd, '..', 'training');
const TRAINING_FILE = join(TRAINING_DIR, 'TRAINING.md');
const TRAINING_FILES_DIR = join(TRAINING_DIR, 'files');

// Jeff's Slack user ID — only he can train Dad
export const TRAINER_USER_ID = 'U08QUBV7UNQ';

export function initTraining(): void {
  mkdirSync(TRAINING_DIR, { recursive: true });
  mkdirSync(TRAINING_FILES_DIR, { recursive: true });
  if (!existsSync(TRAINING_FILE)) {
    writeFileSync(TRAINING_FILE, '# Dad Training Context\n\n');
  }
}

export function getTrainingContext(): string {
  try {
    return readFileSync(TRAINING_FILE, 'utf-8');
  } catch {
    return '';
  }
}

export function appendTraining(content: string): void {
  const timestamp = new Date().toISOString();
  const entry = `\n---\n_Added: ${timestamp}_\n\n${content}\n`;
  appendFileSync(TRAINING_FILE, entry);
}

export function isTrainingMessage(text: string): boolean {
  return /^training:/i.test(text.trim());
}

export function extractTrainingContent(text: string): string {
  return text.replace(/^training:\s*/i, '').trim();
}

export async function downloadFile(
  url: string,
  token: string,
  filename: string,
): Promise<string> {
  const filePath = join(TRAINING_FILES_DIR, filename);
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    }, (res) => {
      // Follow redirects
      if (res.statusCode === 302 || res.statusCode === 301) {
        const redirectUrl = res.headers.location;
        if (redirectUrl) {
          downloadFile(redirectUrl, token, filename).then(resolve).catch(reject);
          return;
        }
      }

      const chunks: Buffer[] = [];
      res.on('data', (chunk: Buffer) => chunks.push(chunk));
      res.on('end', () => {
        const data = Buffer.concat(chunks);
        writeFileSync(filePath, data);
        resolve(filePath);
      });
      res.on('error', reject);
    });
    req.on('error', reject);
  });
}
