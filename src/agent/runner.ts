import { query } from '@anthropic-ai/claude-code';
import { config } from '../config.js';
import { SYSTEM_PROMPT } from './system-prompt.js';
import {
  findConversation,
  createConversation,
  updateSessionId,
  addCost,
  logMessage,
} from '../db/conversations.js';

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

  // Build SDK options
  const options: Record<string, unknown> = {
    model: config.agent.model,
    maxTurns: config.agent.maxTurns,
    maxBudgetUsd: config.agent.maxBudgetUsd,
    cwd: config.agent.cwd,
    permissionMode: 'bypassPermissions',
    allowDangerouslySkipPermissions: true,
    systemPrompt: SYSTEM_PROMPT,
  };

  // Resume session if continuing a thread
  if (conversation.session_id) {
    options.resume = conversation.session_id;
  }

  const startTime = Date.now();
  let sessionId = conversation.session_id || '';
  let resultText = '';
  let costUsd = 0;
  let turns = 0;

  const stream = query({
    prompt,
    options: options as any,
  });

  for await (const message of stream) {
    if (message.type === 'system' && message.subtype === 'init') {
      sessionId = (message as any).session_id;
      if (sessionId && sessionId !== conversation.session_id) {
        updateSessionId(conversation.id, sessionId);
      }
    }

    if (message.type === 'assistant') {
      // Extract text from content blocks for progress updates
      const content = (message as any).message?.content;
      if (content && Array.isArray(content)) {
        for (const block of content) {
          if (block.type === 'text' && block.text) {
            onProgress?.(block.text);
          }
        }
      }
    }

    if (message.type === 'result') {
      const result = message as any;
      if (result.subtype === 'success') {
        resultText = result.result || '';
        costUsd = result.total_cost_usd || 0;
        turns = result.num_turns || 0;
      } else {
        // Error result
        resultText =
          `Error: ${result.subtype}\n${(result.errors || []).join('\n')}` ||
          'Agent encountered an error.';
        costUsd = result.total_cost_usd || 0;
      }
    }
  }

  const durationMs = Date.now() - startTime;

  // Log the assistant response
  logMessage(conversation.id, 'assistant', resultText, costUsd, durationMs);
  addCost(conversation.id, costUsd, turns);

  return {
    text: resultText,
    costUsd,
    durationMs,
    turns,
    sessionId,
  };
}
