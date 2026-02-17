import { getDb } from './database.js';

export interface Relationship {
  id: number;
  user_id: string;
  display_name: string;
  respect_score: number;
  interaction_summary: string; // JSON
  last_interaction: string;
  total_interactions: number;
}

export function ensureRelationshipsTable(): void {
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS relationships (
      id INTEGER PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE,
      display_name TEXT DEFAULT '',
      respect_score INTEGER DEFAULT 70,
      interaction_summary TEXT DEFAULT '[]',
      last_interaction TEXT DEFAULT (datetime('now')),
      total_interactions INTEGER DEFAULT 0
    );
  `);
}

export function getRelationship(userId: string): Relationship | undefined {
  const db = getDb();
  return db.prepare('SELECT * FROM relationships WHERE user_id = ?').get(userId) as Relationship | undefined;
}

export function createRelationship(userId: string, displayName: string): Relationship {
  const db = getDb();
  db.prepare(
    'INSERT OR IGNORE INTO relationships (user_id, display_name) VALUES (?, ?)',
  ).run(userId, displayName);
  return getRelationship(userId)!;
}

export function updateRespectScore(userId: string, newScore: number): void {
  const db = getDb();
  const clamped = Math.max(0, Math.min(100, newScore));
  db.prepare(
    "UPDATE relationships SET respect_score = ?, last_interaction = datetime('now') WHERE user_id = ?",
  ).run(clamped, userId);
}

export function updateInteractionSummary(userId: string, summary: string): void {
  const db = getDb();
  db.prepare(
    "UPDATE relationships SET interaction_summary = ?, total_interactions = total_interactions + 1, last_interaction = datetime('now') WHERE user_id = ?",
  ).run(summary, userId);
}

export function updateDisplayName(userId: string, name: string): void {
  const db = getDb();
  db.prepare('UPDATE relationships SET display_name = ? WHERE user_id = ?').run(name, userId);
}
