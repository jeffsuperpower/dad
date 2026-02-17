import type { App } from '@slack/bolt';
import { isUserAuthorized, isChannelAuthorized, config } from '../config.js';
import { runAgent, isThreadBusy } from '../agent/runner.js';
import { markdownToSlack, chunkMessage } from './formatters.js';
import {
  TRAINER_USER_ID,
  isTrainingMessage,
  extractTrainingContent,
  appendTraining,
  downloadFile,
} from '../agent/training.js';
import {
  getRelationship,
  updateDisplayName,
} from '../db/relationships.js';

// Map respect score to emoji
function scoreToEmoji(score: number): string {
  if (score >= 95) return 'heart_eyes';
  if (score >= 85) return 'star-struck';
  if (score >= 75) return 'blush';
  if (score >= 65) return 'slightly_smiling_face';
  if (score >= 55) return 'neutral_face';
  if (score >= 45) return 'confused';
  if (score >= 35) return 'disappointed';
  if (score >= 20) return 'angry';
  return 'face_with_rolling_eyes';
}

// Resolve Slack user display name
async function resolveUserName(client: any, userId: string): Promise<string> {
  try {
    const info = await client.users.info({ user: userId });
    const profile = info.user?.profile;
    return profile?.display_name || profile?.real_name || info.user?.name || '';
  } catch {
    return '';
  }
}

export function registerHandlers(app: App): void {
  // Handle @Dad mentions in channels
  app.event('app_mention', async ({ event, client, say }) => {
    const userId = event.user!;
    const channelId = event.channel;
    const threadTs = event.thread_ts || event.ts;

    // Auth checks
    if (!isUserAuthorized(userId)) {
      await say({
        text: "Sorry, you're not authorized to use Dad.",
        thread_ts: threadTs,
      });
      return;
    }

    if (!isChannelAuthorized(channelId)) {
      return; // Silently ignore unauthorized channels
    }

    // Strip bot mention from text
    const text = event.text.replace(/<@[A-Z0-9]+>/g, '').trim();
    if (!text) {
      await say({
        text: 'What do you need?',
        thread_ts: threadTs,
      });
      return;
    }

    // Training messages only work in DMs, not channels
    await handleMessage(client, channelId, threadTs, userId, text);
  });

  // Handle DMs
  app.event('message', async ({ event, client }) => {
    const msg = event as any;

    // Only handle regular messages in DMs (im type), skip bot messages
    if (msg.channel_type !== 'im' || msg.subtype || msg.bot_id) return;

    const userId = msg.user as string | undefined;
    if (!userId) return;

    if (!isUserAuthorized(userId)) {
      await client.chat.postMessage({
        channel: msg.channel,
        text: "Sorry, you're not authorized to use Dad.",
        thread_ts: msg.thread_ts || msg.ts,
      });
      return;
    }

    const text = (msg.text as string | undefined)?.trim();
    if (!text) return;

    const threadTs = (msg.thread_ts || msg.ts) as string;

    // Check for training message — only Jeff, only in DMs
    if (userId === TRAINER_USER_ID && isTrainingMessage(text)) {
      await handleTraining(client, msg, text);
      return;
    }

    await handleMessage(client, msg.channel, threadTs, userId, text);
  });
}

async function handleTraining(
  client: any,
  msg: any,
  text: string,
): Promise<void> {
  const threadTs = msg.thread_ts || msg.ts;

  try {
    // Add brain reaction
    await client.reactions.add({
      channel: msg.channel,
      name: 'brain',
      timestamp: threadTs,
    }).catch(() => {});

    // Extract text content
    const content = extractTrainingContent(text);
    const parts: string[] = [];

    if (content) {
      parts.push(content);
    }

    // Handle file attachments
    const files = msg.files as any[] | undefined;
    if (files && files.length > 0) {
      for (const file of files) {
        const filename = file.name || file.title || `file_${Date.now()}`;

        if (file.mimetype?.startsWith('text/') || file.mimetype === 'application/json' ||
            filename.endsWith('.md') || filename.endsWith('.txt') || filename.endsWith('.json') ||
            filename.endsWith('.csv') || filename.endsWith('.yaml') || filename.endsWith('.yml')) {
          // Text file — download and inline the content
          const filePath = await downloadFile(
            file.url_private,
            config.slack.botToken,
            filename,
          );
          const { readFileSync } = await import('fs');
          const fileContent = readFileSync(filePath, 'utf-8');
          parts.push(`### File: ${filename}\n\`\`\`\n${fileContent}\n\`\`\``);
        } else if (file.mimetype?.startsWith('image/')) {
          // Image — download and note the path
          const filePath = await downloadFile(
            file.url_private,
            config.slack.botToken,
            filename,
          );
          parts.push(`### Image: ${filename}\nSaved to: \`${filePath}\``);
        } else {
          // Other file — download and note
          const filePath = await downloadFile(
            file.url_private,
            config.slack.botToken,
            filename,
          );
          parts.push(`### File: ${filename}\nSaved to: \`${filePath}\` (${file.mimetype})`);
        }
      }
    }

    if (parts.length === 0) {
      await client.chat.postMessage({
        channel: msg.channel,
        text: "No training content found. Use `training: <your content here>` or attach files.",
        thread_ts: threadTs,
      });
      return;
    }

    // Append to training file
    const fullContent = parts.join('\n\n');
    appendTraining(fullContent);

    // Confirm
    const summary = fullContent.length > 200
      ? fullContent.slice(0, 200) + '...'
      : fullContent;

    await client.chat.postMessage({
      channel: msg.channel,
      text: `Got it. Training context updated.\n\n> ${summary.replace(/\n/g, '\n> ')}`,
      thread_ts: threadTs,
    });

    // Swap to checkmark
    await client.reactions.add({
      channel: msg.channel,
      name: 'white_check_mark',
      timestamp: threadTs,
    }).catch(() => {});

  } catch (err: unknown) {
    console.error('[Training] Error:', err);
    await client.chat.postMessage({
      channel: msg.channel,
      text: `_Training error: ${err instanceof Error ? err.message : String(err)}_`,
      thread_ts: threadTs,
    });
  }
}

async function handleMessage(
  client: any,
  channelId: string,
  threadTs: string,
  userId: string,
  text: string,
): Promise<void> {
  const threadKey = `${channelId}:${threadTs}`;

  // Check if this thread already has an active query
  if (isThreadBusy(threadKey)) {
    await client.chat.postMessage({
      channel: channelId,
      text: "_I'm still working on your previous request in this thread. Hang on._",
      thread_ts: threadTs,
    });
    return;
  }

  // Resolve and cache user display name
  const rel = getRelationship(userId);
  if (!rel || !rel.display_name) {
    const name = await resolveUserName(client, userId);
    if (name) {
      updateDisplayName(userId, name);
    }
  }

  // Add thinking reaction
  try {
    await client.reactions.add({
      channel: channelId,
      name: 'eyes',
      timestamp: threadTs,
    });
  } catch {
    // Reaction may already exist
  }

  // Post placeholder
  const placeholder = await client.chat.postMessage({
    channel: channelId,
    text: '_Thinking..._',
    thread_ts: threadTs,
  });

  try {
    const result = await runAgent(text, channelId, threadTs, userId);

    // Format and send response
    const formatted = markdownToSlack(result.text || 'Done (no text output).');
    const chunks = chunkMessage(formatted);

    // Update placeholder with first chunk
    await client.chat.update({
      channel: channelId,
      ts: placeholder.ts!,
      text: chunks[0],
    });

    // Send remaining chunks as replies
    for (let i = 1; i < chunks.length; i++) {
      await client.chat.postMessage({
        channel: channelId,
        text: chunks[i],
        thread_ts: threadTs,
      });
    }

    // Swap reaction - use respect-based emoji
    try {
      await client.reactions.remove({
        channel: channelId,
        name: 'eyes',
        timestamp: threadTs,
      });
    } catch {
      // Ignore
    }
    try {
      const updatedRel = getRelationship(userId);
      const emoji = updatedRel ? scoreToEmoji(updatedRel.respect_score) : 'white_check_mark';
      await client.reactions.add({
        channel: channelId,
        name: emoji,
        timestamp: threadTs,
      });
    } catch {
      // Ignore
    }
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error && err.message === 'THREAD_BUSY'
        ? "_I'm still working on your previous request._"
        : err instanceof Error && err.message === 'TOO_BUSY'
          ? "_I'm handling too many requests right now. Try again in a moment._"
          : `_Error: ${err instanceof Error ? err.message : String(err)}_`;

    await client.chat.update({
      channel: channelId,
      ts: placeholder.ts!,
      text: errorMsg,
    });

    // Swap reaction to X
    try {
      await client.reactions.remove({
        channel: channelId,
        name: 'eyes',
        timestamp: threadTs,
      });
    } catch {
      // Ignore
    }
    try {
      await client.reactions.add({
        channel: channelId,
        name: 'x',
        timestamp: threadTs,
      });
    } catch {
      // Ignore
    }
  }
}
