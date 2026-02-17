import type { App } from '@slack/bolt';
import { isUserAuthorized, isChannelAuthorized } from '../config.js';
import { runAgent, isThreadBusy } from '../agent/runner.js';
import { markdownToSlack, chunkMessage } from './formatters.js';

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
    await handleMessage(client, msg.channel, threadTs, userId, text);
  });
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

    // Swap reaction
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
        name: 'white_check_mark',
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
