import { spawn } from 'child_process';
import { config } from '../config.js';
import { getSystemPrompt } from './system-prompt.js';
import {
  findConversation,
  createConversation,
  updateSessionId,
  addCost,
  logMessage,
} from '../db/conversations.js';
import {
  getRelationship,
  createRelationship,
  updateRespectScore,
  updateInteractionSummary,
} from '../db/relationships.js';

export interface AgentResult {
  text: string;
  costUsd: number;
  durationMs: number;
  turns: number;
  sessionId: string;
}

// Concurrency control
const activeQueries = new Map<string, Promise<AgentResult>>();
const MAX_CONCURRENT = 3;

function activeCount(): number {
  return activeQueries.size;
}

export function isThreadBusy(threadKey: string): boolean {
  return activeQueries.has(threadKey);
}

export async function runAgent(
  prompt: string,
  channelId: string,
  threadId: string,
  userId: string,
  onProgress?: (text: string) => void,
): Promise<AgentResult> {
  const threadKey = `${channelId}:${threadId}`;

  if (activeQueries.has(threadKey)) {
    throw new Error('THREAD_BUSY');
  }
  if (activeCount() >= MAX_CONCURRENT) {
    throw new Error('TOO_BUSY');
  }

  const promise = executeAgent(prompt, channelId, threadId, userId, onProgress);
  activeQueries.set(threadKey, promise);

  try {
    return await promise;
  } finally {
    activeQueries.delete(threadKey);
  }
}

async function executeAgent(
  prompt: string,
  channelId: string,
  threadId: string,
  userId: string,
  onProgress?: (text: string) => void,
): Promise<AgentResult> {
  // Find or create conversation
  let conversation = findConversation(channelId, threadId);
  if (!conversation) {
    conversation = createConversation(channelId, threadId, userId);
  }

  // Log the user message
  logMessage(conversation.id, 'user', prompt);

  // Get or create relationship for this user
  let rel = getRelationship(userId);
  if (!rel) {
    rel = createRelationship(userId, '');
  }

  // Build user context for the system prompt
  const interactions = JSON.parse(rel.interaction_summary || '[]') as Array<{ts: string; topic: string; sentiment: string}>;
  const recentInteractions = interactions.slice(-10);
  const userContext = `You are talking to Slack user <@${userId}>${rel.display_name ? ` (${rel.display_name})` : ''}.
Their current respect score with you: ${rel.respect_score}/100
Total past interactions: ${rel.total_interactions}
Last interaction: ${rel.last_interaction || 'never'}
${recentInteractions.length > 0 ? `\nRecent interaction history:\n${recentInteractions.map(i => `- [${i.ts}] ${i.topic} (${i.sentiment})`).join('\n')}` : '\nThis is your first interaction with them.'}`;

  const startTime = Date.now();

  // Build CLI args
  const baseArgs = [
    '--print',
    '--output-format', 'json',
    '--model', config.agent.model,
    '--max-turns', String(config.agent.maxTurns),
    '--system-prompt', getSystemPrompt(userContext),
  ];

  let result: AgentResult;

  // Try to resume session if continuing a thread
  if (conversation.session_id) {
    const resumeArgs = [...baseArgs, '--resume', conversation.session_id, prompt];
    try {
      result = await spawnClaude(resumeArgs, config.agent.cwd);
    } catch (err: unknown) {
      // Session not found (stale after redeploy) — retry without resume
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('No conversation found') || msg.includes('session')) {
        console.log('[Agent] Stale session, retrying without --resume');
        updateSessionId(conversation.id, '');
        const freshArgs = [...baseArgs, prompt];
        result = await spawnClaude(freshArgs, config.agent.cwd);
      } else {
        throw err;
      }
    }
  } else {
    const freshArgs = [...baseArgs, prompt];
    result = await spawnClaude(freshArgs, config.agent.cwd);
  }

  const durationMs = Date.now() - startTime;

  // Update session ID if we got one
  if (result.sessionId && result.sessionId !== conversation.session_id) {
    updateSessionId(conversation.id, result.sessionId);
  }

  // Parse respect change from response
  const respectMatch = result.text.match(/\[RESPECT:([+-]?\d+)\]/);
  if (respectMatch) {
    const delta = parseInt(respectMatch[1], 10);
    const newScore = Math.max(0, Math.min(100, rel.respect_score + delta));
    updateRespectScore(userId, newScore);
    console.log(`[Agent] Respect for ${userId}: ${rel.respect_score} -> ${newScore} (${delta >= 0 ? '+' : ''}${delta})`);

    // Strip the respect tag from the visible response
    result.text = result.text.replace(/\s*\[RESPECT:[+-]?\d+\]\s*/g, '').trim();
  }

  // Compact and update interaction summary
  const history = JSON.parse(rel.interaction_summary || '[]') as Array<{ts: string; topic: string; sentiment: string}>;
  const topicSnippet = prompt.length > 100 ? prompt.slice(0, 100) + '...' : prompt;
  const sentiment = respectMatch
    ? (parseInt(respectMatch[1], 10) > 0 ? 'positive' : parseInt(respectMatch[1], 10) < 0 ? 'negative' : 'neutral')
    : 'neutral';
  history.push({
    ts: new Date().toISOString(),
    topic: topicSnippet,
    sentiment,
  });
  // Keep only last 50 interactions
  const trimmed = history.slice(-50);
  updateInteractionSummary(userId, JSON.stringify(trimmed));

  // Log the assistant response
  logMessage(conversation.id, 'assistant', result.text, result.costUsd, durationMs);
  addCost(conversation.id, result.costUsd, result.turns);

  return { ...result, durationMs };
}

function spawnClaude(
  args: string[],
  cwd: string,
): Promise<AgentResult> {
  return new Promise((resolve, reject) => {
    console.log('[Agent] Spawning claude with args:', args.slice(0, 6).join(' '), '...');

    const proc = spawn('claude', args, {
      cwd,
      env: { ...process.env, CLAUDE_CODE_ENTRYPOINT: 'cli' },
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString();
    });

    proc.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    proc.on('close', (code) => {
      console.log('[Agent] claude exited with code:', code);
      if (stderr) {
        console.log('[Agent] stderr:', stderr.slice(0, 500));
      }

      if (code !== 0) {
        reject(new Error(`Claude exited with code ${code}: ${stderr.slice(0, 200)}`));
        return;
      }

      try {
        const parsed = JSON.parse(stdout);
        resolve({
          text: parsed.result || 'Done.',
          costUsd: parsed.total_cost_usd || 0,
          turns: parsed.num_turns || 0,
          sessionId: parsed.session_id || '',
          durationMs: parsed.duration_ms || 0,
        });
      } catch {
        // If not JSON, just return the raw output
        resolve({
          text: stdout || 'Done (no output).',
          costUsd: 0,
          turns: 0,
          sessionId: '',
          durationMs: 0,
        });
      }
    });

    proc.on('error', (err) => {
      reject(new Error(`Failed to spawn claude: ${err.message}`));
    });

    // Close stdin
    proc.stdin.end();
  });
}
