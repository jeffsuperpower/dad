import Database from 'better-sqlite3';
import { config } from '../config.js';
import { mkdirSync } from 'fs';
import { dirname } from 'path';

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    mkdirSync(dirname(config.db.path), { recursive: true });
    db = new Database(config.db.path);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    migrate(db);
  }
  return db;
}

function migrate(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY,
      thread_id TEXT NOT NULL,
      channel_id TEXT NOT NULL,
      platform TEXT DEFAULT 'slack',
      session_id TEXT,
      user_id TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      total_cost_usd REAL DEFAULT 0.0,
      total_turns INTEGER DEFAULT 0,
      UNIQUE(platform, channel_id, thread_id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY,
      conversation_id INTEGER REFERENCES conversations(id),
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      cost_usd REAL,
      duration_ms INTEGER,
      created_at TEXT DEFAULT (datetime('now'))
    );

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
