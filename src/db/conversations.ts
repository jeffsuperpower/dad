import { getDb } from './database.js';

export interface Conversation {
  id: number;
  thread_id: string;
  channel_id: string;
  platform: string;
  session_id: string | null;
  user_id: string;
  total_cost_usd: number;
  total_turns: number;
}

export function findConversation(
  channelId: string,
  threadId: string,
  platform = 'slack',
): Conversation | undefined {
  const db = getDb();
  return db
    .prepare(
      'SELECT * FROM conversations WHERE platform = ? AND channel_id = ? AND thread_id = ?',
    )
    .get(platform, channelId, threadId) as Conversation | undefined;
}

export function createConversation(
  channelId: string,
  threadId: string,
  userId: string,
  platform = 'slack',
): Conversation {
  const db = getDb();
  const result = db
    .prepare(
      'INSERT INTO conversations (channel_id, thread_id, user_id, platform) VALUES (?, ?, ?, ?)',
    )
    .run(channelId, threadId, userId, platform);
  return findConversation(channelId, threadId, platform)!;
}

export function updateSessionId(
  conversationId: number,
  sessionId: string,
): void {
  const db = getDb();
  db.prepare(
    "UPDATE conversations SET session_id = ?, updated_at = datetime('now') WHERE id = ?",
  ).run(sessionId, conversationId);
}

export function addCost(
  conversationId: number,
  costUsd: number,
  turns: number,
): void {
  const db = getDb();
  db.prepare(
    "UPDATE conversations SET total_cost_usd = total_cost_usd + ?, total_turns = total_turns + ?, updated_at = datetime('now') WHERE id = ?",
  ).run(costUsd, turns, conversationId);
}

export function logMessage(
  conversationId: number,
  role: string,
  content: string,
  costUsd?: number,
  durationMs?: number,
): void {
  const db = getDb();
  db.prepare(
    'INSERT INTO messages (conversation_id, role, content, cost_usd, duration_ms) VALUES (?, ?, ?, ?, ?)',
  ).run(conversationId, role, content, costUsd ?? null, durationMs ?? null);
}
