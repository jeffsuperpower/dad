import { mkdirSync, readFileSync, appendFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { config } from '../config.js';

const MADNESS_DIR = join(config.agent.cwd, '..', 'madness');
const FEEDBACK_FILE = join(MADNESS_DIR, 'feedback.md');
const STATE_FILE = join(MADNESS_DIR, 'state.json');

export interface MadnessState {
  lastPostTs: string;
  lastPostChannel: string;
  lastPostDate: string; // YYYY-MM-DD
}

export function initMadness(): void {
  mkdirSync(MADNESS_DIR, { recursive: true });
  if (!existsSync(FEEDBACK_FILE)) {
    writeFileSync(FEEDBACK_FILE, '# March Madness Report Feedback\n\nThis file stores feedback from Jeff on how to format the daily report.\nDad reads this before generating each report.\n\n');
  }
}

export function getFeedback(): string {
  try {
    return readFileSync(FEEDBACK_FILE, 'utf-8');
  } catch {
    return '';
  }
}

export function appendFeedback(content: string): void {
  const timestamp = new Date().toISOString();
  const entry = `\n---\n_Feedback: ${timestamp}_\n\n${content}\n`;
  appendFileSync(FEEDBACK_FILE, entry);
}

export function saveState(state: MadnessState): void {
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

export function getState(): MadnessState | null {
  try {
    const data = readFileSync(STATE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}
