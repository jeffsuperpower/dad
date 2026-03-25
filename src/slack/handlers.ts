import type { App } from '@slack/bolt';
import { isUserAuthorized, isChannelAuthorized, config } from '../config.js';
import { runAgent, isThreadBusy, stopAll, stopAgent, type ProgressEvent } from '../agent/runner.js';
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
import { runDailyDrill } from '../drill/runner.js';
import { handleDrillUpdate } from '../drill/updater.js';
import { forwardContactOutEmail } from '../contactout/forwarder.js';
import { runMadnessPost, handleMadnessFeedback } from '../madness/runner.js';
import { getState as getMadnessState } from '../madness/feedback.js';
import { runSpendersSync } from '../spenders/runner.js';
import { isStopped as isBmvsStopped, stopChecking as stopBmvs, resumeChecking as resumeBmvs, checkBmvsAppointments } from '../bmvs/runner.js';

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

    // Stop command in thread — kill the active task for this thread
    const textLower = text.toLowerCase();
    if ((textLower === 'stop' || textLower === 'cancel') && event.thread_ts) {
      const threadKey = `${channelId}:${event.thread_ts}`;
      const stopped = stopAgent(threadKey);
      await say({
        text: stopped ? 'stopped' : 'nothing running in this thread',
        thread_ts: threadTs,
      });
      return;
    }

    // Check if this is a thread reply to a Madness post
    if (event.thread_ts) {
      const madnessState = getMadnessState();
      if (madnessState && event.thread_ts === madnessState.lastPostTs && channelId === madnessState.lastPostChannel) {
        try {
          await client.reactions.add({
            channel: channelId,
            name: 'eyes',
            timestamp: event.ts,
          }).catch(() => {});
          await handleMadnessFeedback(client, text, event.ts, channelId);
        } catch (err) {
          console.error('[Madness] Feedback handler error:', err);
        }
        return;
      }
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

    // Manual madness trigger — only Jeff, only in DMs
    if (userId === TRAINER_USER_ID && text.toLowerCase() === 'madness') {
      try {
        await client.reactions.add({
          channel: msg.channel,
          name: 'skull',
          timestamp: msg.ts,
        }).catch(() => {});
        await runMadnessPost(client);
      } catch (err) {
        console.error('[Madness] Manual trigger error:', err);
        await client.chat.postMessage({
          channel: msg.channel,
          text: `_Madness error: ${err instanceof Error ? err.message : String(err)}_`,
        });
      }
      return;
    }

    // Stop all active queries — only Jeff, only in DMs
    if (userId === TRAINER_USER_ID && (text.toLowerCase() === 'stop' || text.toLowerCase() === 'cancel')) {
      const count = stopAll();
      await client.chat.postMessage({
        channel: msg.channel,
        text: count > 0 ? `stopped ${count} active task${count > 1 ? 's' : ''}` : 'nothing running right now',
        thread_ts: threadTs,
      });
      return;
    }

    // Manual spenders sync trigger — only Jeff, only in DMs
    if (userId === TRAINER_USER_ID && text.toLowerCase() === 'spenders') {
      try {
        await client.reactions.add({
          channel: msg.channel,
          name: 'moneybag',
          timestamp: msg.ts,
        }).catch(() => {});
        await runSpendersSync(client);
        await client.reactions.add({
          channel: msg.channel,
          name: 'white_check_mark',
          timestamp: msg.ts,
        }).catch(() => {});
      } catch (err) {
        console.error('[Spenders] Manual trigger error:', err);
        await client.chat.postMessage({
          channel: msg.channel,
          text: `_Spenders sync error: ${err instanceof Error ? err.message : String(err)}_`,
        });
      }
      return;
    }

    // BMVS STOP command — anyone in DMs (but really just Jeff/Tash)
    if (text === 'STOP') {
      if (!isBmvsStopped()) {
        stopBmvs();
        await client.chat.postMessage({
          channel: msg.channel,
          text: ':octagonal_sign: *BMVS appointment checking stopped.* I won\'t check for appointments anymore.\n\nSend `bmvs` to start checking again.',
          thread_ts: threadTs,
        });
      } else {
        await client.chat.postMessage({
          channel: msg.channel,
          text: 'BMVS checking is already stopped. Send `bmvs` to start checking again.',
          thread_ts: threadTs,
        });
      }
      return;
    }

    // Manual BMVS trigger — only Jeff, only in DMs
    if (userId === TRAINER_USER_ID && text.toLowerCase() === 'bmvs') {
      try {
        // Resume if stopped
        if (isBmvsStopped()) {
          resumeBmvs();
          await client.chat.postMessage({
            channel: msg.channel,
            text: ':white_check_mark: BMVS checking resumed! Running a check now...',
            thread_ts: threadTs,
          });
        }
        await client.reactions.add({
          channel: msg.channel,
          name: 'hospital',
          timestamp: msg.ts,
        }).catch(() => {});
        await checkBmvsAppointments(client);
      } catch (err) {
        console.error('[BMVS] Manual trigger error:', err);
        await client.chat.postMessage({
          channel: msg.channel,
          text: `_BMVS error: ${err instanceof Error ? err.message : String(err)}_`,
          thread_ts: threadTs,
        });
      }
      return;
    }

    // Manual drill trigger — only Jeff, only in DMs
    if (userId === TRAINER_USER_ID && text.toLowerCase() === 'drill') {
      try {
        await client.reactions.add({
          channel: msg.channel,
          name: 'coffee',
          timestamp: msg.ts,
        }).catch(() => {});
        await runDailyDrill(client);
      } catch (err) {
        console.error('[Drill] Manual trigger error:', err);
        await client.chat.postMessage({
          channel: msg.channel,
          text: `_Drill error: ${err instanceof Error ? err.message : String(err)}_`,
        });
      }
      return;
    }

    // Drill update commands — only Jeff, only in DMs
    const lower = text.toLowerCase();
    if (userId === TRAINER_USER_ID) {
      if (lower.startsWith('move ') || lower.startsWith('mark ') || lower.startsWith('set ') || lower.startsWith('change ') || lower.startsWith('clear ') || lower.includes('next step')) {
        try {
          const result = await handleDrillUpdate(text);
          if (result) {
            const emoji = result.success ? 'white_check_mark' : 'x';
            await client.reactions.add({
              channel: msg.channel,
              name: emoji,
              timestamp: msg.ts,
            }).catch(() => {});
            await client.chat.postMessage({
              channel: msg.channel,
              text: result.success ? `:green-dot: ${result.message}` : `:red-dot: ${result.message}`,
              thread_ts: threadTs,
            });
            return;
          }
        } catch (err) {
          console.error('[Drill] Update error:', err);
        }
        // If handleDrillUpdate returned null, fall through to normal message handling
      }
    }

    // ContactOut forward command - anyone in DMs
    if (lower.startsWith('contactout ')) {
      // Slack auto-links emails as <mailto:x@y.com|x@y.com> - extract the raw address
      let targetEmail = text.slice('contactout '.length).trim();
      const mailtoMatch = targetEmail.match(/<mailto:([^|>]+)/);
      if (mailtoMatch) {
        targetEmail = mailtoMatch[1];
      }
      // Also strip any remaining angle brackets
      targetEmail = targetEmail.replace(/[<>]/g, '');
      if (!targetEmail || !targetEmail.includes('@')) {
        await client.chat.postMessage({
          channel: msg.channel,
          text: 'Usage: `contactout email@domain.com`',
          thread_ts: threadTs,
        });
        return;
      }
      try {
        await client.reactions.add({
          channel: msg.channel,
          name: 'email',
          timestamp: msg.ts,
        }).catch(() => {});
        const result = await forwardContactOutEmail(targetEmail);
        const emoji = result.success ? 'white_check_mark' : 'x';
        await client.reactions.add({
          channel: msg.channel,
          name: emoji,
          timestamp: msg.ts,
        }).catch(() => {});
        await client.chat.postMessage({
          channel: msg.channel,
          text: result.success ? `:envelope: ${result.message}` : `:x: ${result.message}`,
          thread_ts: threadTs,
        });
      } catch (err) {
        console.error('[ContactOut] Forward error:', err);
        await client.chat.postMessage({
          channel: msg.channel,
          text: `_ContactOut error: ${err instanceof Error ? err.message : String(err)}_`,
          thread_ts: threadTs,
        });
      }
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

  // Stop command in thread context
  const lowerText = text.toLowerCase();
  if (lowerText === 'stop' || lowerText === 'cancel') {
    const stopped = stopAgent(threadKey);
    await client.chat.postMessage({
      channel: channelId,
      text: stopped ? 'stopped' : 'nothing running in this thread',
      thread_ts: threadTs,
    });
    return;
  }

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

  // Track progress updates for streaming
  const progressLines: string[] = [];
  let lastUpdateTime = 0;
  const UPDATE_INTERVAL_MS = 5000;
  let lastActivityTime = Date.now();
  let heartbeatInterval: ReturnType<typeof setInterval> | null = null;

  try {
    // Heartbeat: update placeholder every 10s even if no new events
    heartbeatInterval = setInterval(async () => {
      if (progressLines.length === 0) return;
      const elapsed = Math.round((Date.now() - lastActivityTime) / 1000);
      const recentLines = progressLines.slice(-12).join('\n');
      const heartbeat = elapsed > 15 ? `\n:hourglass: _${elapsed}s since last activity - still running..._` : '';
      try {
        await client.chat.update({
          channel: channelId,
          ts: placeholder.ts!,
          text: `_Working..._\n${recentLines}${heartbeat}`,
        });
      } catch {
        // Ignore
      }
    }, 10000);

    const onProgress = async (event: ProgressEvent) => {
      let line = '';
      if (event.type === 'tool_use' && event.tool) {
        const toolLabel = event.tool.replace(/^mcp__\w+__/, '');
        line = event.input
          ? `:wrench: \`${toolLabel}\` ${event.input.slice(0, 100)}`
          : `:wrench: \`${toolLabel}\``;
      } else if (event.type === 'text' && event.text) {
        const trimmed = event.text.trim();
        if (trimmed.length > 20) {
          line = trimmed.slice(0, 300);
        }
      }

      if (!line) return;

      // Add timestamp to each line
      const now = new Date();
      const ts = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'America/Los_Angeles' });
      progressLines.push(`\`${ts}\` ${line}`);
      lastActivityTime = Date.now();

      // Throttle Slack updates
      const nowMs = Date.now();
      if (nowMs - lastUpdateTime < UPDATE_INTERVAL_MS) return;
      lastUpdateTime = nowMs;

      // Show recent progress lines
      const recentLines = progressLines.slice(-12).join('\n');
      try {
        await client.chat.update({
          channel: channelId,
          ts: placeholder.ts!,
          text: `_Working..._\n${recentLines}`,
        });
      } catch {
        // Ignore update failures (rate limits, etc.)
      }
    };

    const result = await runAgent(text, channelId, threadTs, userId, onProgress);
    if (heartbeatInterval) clearInterval(heartbeatInterval);

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
    if (heartbeatInterval) clearInterval(heartbeatInterval);
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
