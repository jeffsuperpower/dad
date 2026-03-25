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

export interface ProgressEvent {
  type: 'tool_use' | 'text' | 'result';
  tool?: string;
  input?: string;
  text?: string;
}

// Concurrency control
const activeQueries = new Map<string, Promise<AgentResult>>();
const activeProcesses = new Map<string, import('child_process').ChildProcess>();
const MAX_CONCURRENT = 3;

function activeCount(): number {
  return activeQueries.size;
}

export function isThreadBusy(threadKey: string): boolean {
  return activeQueries.has(threadKey);
}

export function stopAgent(threadKey: string): boolean {
  const proc = activeProcesses.get(threadKey);
  if (proc) {
    proc.kill('SIGTERM');
    activeProcesses.delete(threadKey);
    activeQueries.delete(threadKey);
    console.log(`[Agent] Killed process for ${threadKey}`);
    return true;
  }
  return false;
}

export function stopAll(): number {
  let count = 0;
  for (const [key, proc] of activeProcesses) {
    proc.kill('SIGTERM');
    activeProcesses.delete(key);
    activeQueries.delete(key);
    count++;
  }
  console.log(`[Agent] Killed ${count} active processes`);
  return count;
}

export async function runAgent(
  prompt: string,
  channelId: string,
  threadId: string,
  userId: string,
  onProgress?: (event: ProgressEvent) => void,
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
  onProgress?: (event: ProgressEvent) => void,
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

  // Build CLI args - use stream-json for progress updates
  const baseArgs = [
    '--print',
    '--verbose',
    '--output-format', 'stream-json',
    '--model', config.agent.model,
    '--max-turns', String(config.agent.maxTurns),
    '--system-prompt', getSystemPrompt(userContext),
    '--permission-mode', 'bypassPermissions',
    '--mcp-config', '/app/mcp-config.json',
  ];

  let result: AgentResult;
  const threadKey = `${channelId}:${threadId}`;

  // Try to resume session if continuing a thread
  if (conversation.session_id) {
    const resumeArgs = [...baseArgs, '--resume', conversation.session_id, '--', prompt];
    try {
      result = await spawnClaude(resumeArgs, config.agent.cwd, onProgress, threadKey);
    } catch (err: unknown) {
      // Session not found (stale after redeploy) - retry without resume
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('No conversation found') || msg.includes('session')) {
        console.log('[Agent] Stale session, retrying without --resume');
        updateSessionId(conversation.id, '');
        const freshArgs = [...baseArgs, '--', prompt];
        result = await spawnClaude(freshArgs, config.agent.cwd, onProgress, threadKey);
      } else {
        throw err;
      }
    }
  } else {
    const freshArgs = [...baseArgs, '--', prompt];
    result = await spawnClaude(freshArgs, config.agent.cwd, onProgress, threadKey);
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
  onProgress?: (event: ProgressEvent) => void,
  threadKey?: string,
): Promise<AgentResult> {
  return new Promise((resolve, reject) => {
    console.log('[Agent] Spawning claude with args:', args.slice(0, 6).join(' '), '...');

    const proc = spawn('claude', args, {
      cwd,
      env: { ...process.env, CLAUDE_CODE_ENTRYPOINT: 'cli' },
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    // Track process for cancellation
    if (threadKey) {
      activeProcesses.set(threadKey, proc);
    }

    let stderr = '';
    let finalResult = '';
    let sessionId = '';
    let totalCost = 0;
    let numTurns = 0;
    let lineBuf = '';

    proc.stdout.on('data', (chunk: Buffer) => {
      lineBuf += chunk.toString();

      // Process complete lines
      let newlineIdx: number;
      while ((newlineIdx = lineBuf.indexOf('\n')) !== -1) {
        const line = lineBuf.slice(0, newlineIdx).trim();
        lineBuf = lineBuf.slice(newlineIdx + 1);

        if (!line) continue;

        try {
          const event = JSON.parse(line);
          processStreamEvent(event, onProgress, (r) => { finalResult = r; }, (s) => { sessionId = s; }, (c) => { totalCost = c; }, (t) => { numTurns = t; });
        } catch {
          // Not JSON, skip
        }
      }
    });

    proc.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    proc.on('close', (code) => {
      // Clean up process tracking
      if (threadKey) {
        activeProcesses.delete(threadKey);
      }

      console.log('[Agent] claude exited with code:', code);
      if (stderr) {
        console.log('[Agent] stderr:', stderr.slice(0, 500));
      }

      // Process any remaining buffer
      if (lineBuf.trim()) {
        try {
          const event = JSON.parse(lineBuf.trim());
          processStreamEvent(event, onProgress, (r) => { finalResult = r; }, (s) => { sessionId = s; }, (c) => { totalCost = c; }, (t) => { numTurns = t; });
        } catch {
          // Not JSON
        }
      }

      if (code !== 0) {
        reject(new Error(`Claude exited with code ${code}: ${stderr.slice(0, 200)}`));
        return;
      }

      resolve({
        text: finalResult || 'Done.',
        costUsd: totalCost,
        turns: numTurns,
        sessionId,
        durationMs: 0,
      });
    });

    proc.on('error', (err) => {
      reject(new Error(`Failed to spawn claude: ${err.message}`));
    });

    // Close stdin
    proc.stdin.end();
  });
}

function processStreamEvent(
  event: any,
  onProgress: ((event: ProgressEvent) => void) | undefined,
  setResult: (r: string) => void,
  setSessionId: (s: string) => void,
  setCost: (c: number) => void,
  setTurns: (t: number) => void,
): void {
  // stream-json emits objects like:
  // { type: "assistant", message: { ... }, session_id: "..." }
  // { type: "result", result: "...", session_id: "...", total_cost_usd: 0.05, num_turns: 3 }

  if (event.session_id) {
    setSessionId(event.session_id);
  }

  if (event.type === 'result') {
    setResult(event.result || event.text || '');
    if (event.total_cost_usd) setCost(event.total_cost_usd);
    if (event.num_turns) setTurns(event.num_turns);
    return;
  }

  if (!onProgress) return;

  if (event.type === 'assistant' && event.message) {
    const msg = event.message;
    // Assistant messages contain content blocks
    if (msg.content && Array.isArray(msg.content)) {
      for (const block of msg.content) {
        if (block.type === 'tool_use') {
          const toolName = block.name || 'unknown';
          // Summarize what the tool is doing
          let inputSummary = '';
          if (block.input) {
            if (typeof block.input === 'string') {
              inputSummary = block.input.slice(0, 200);
            } else if (block.input.command) {
              inputSummary = block.input.command.slice(0, 200);
            } else if (block.input.pattern) {
              inputSummary = block.input.pattern;
            } else if (block.input.site_id) {
              inputSummary = `site: ${block.input.site_id}`;
            } else if (block.input.query) {
              inputSummary = block.input.query.slice(0, 200);
            }
          }
          onProgress({ type: 'tool_use', tool: toolName, input: inputSummary });
        } else if (block.type === 'text' && block.text) {
          onProgress({ type: 'text', text: block.text });
        }
      }
    }
  }
}
