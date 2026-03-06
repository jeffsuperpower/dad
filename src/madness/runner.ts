import { scrapeDashboard } from './scraper.js';
import { fetchKeyProjects } from './projects.js';
import { formatMadnessPost } from './formatter.js';
import { saveState, getFeedback, appendFeedback, getState } from './feedback.js';
import { config } from '../config.js';
import { spawn } from 'child_process';

const MADNESS_CHANNEL = 'C0AJUMEFK0S';

export async function runMadnessPost(client: any): Promise<void> {
  console.log('[Madness] Starting daily post...');

  try {
    const [dashData, projects] = await Promise.all([
      scrapeDashboard(),
      fetchKeyProjects(),
    ]);

    console.log('[Madness] Dashboard data:', JSON.stringify(dashData));
    console.log('[Madness] Projects:', projects.length);

    // Read past feedback to inform formatting
    const feedback = getFeedback();

    // Format the post
    const message = formatMadnessPost(dashData, projects);

    // If we have feedback, use Claude to apply it to the draft
    let finalMessage = message;
    if (feedback.trim().length > 100) {
      try {
        finalMessage = await applyFeedback(message, feedback, dashData);
      } catch (err) {
        console.error('[Madness] Feedback application failed, using raw format:', err);
      }
    }

    // Post to channel
    const result = await client.chat.postMessage({
      channel: MADNESS_CHANNEL,
      text: finalMessage,
      unfurl_links: false,
      unfurl_media: false,
    });

    // Save state so we can edit this post later
    const today = new Date().toISOString().slice(0, 10);
    saveState({
      lastPostTs: result.ts!,
      lastPostChannel: MADNESS_CHANNEL,
      lastPostDate: today,
    });

    console.log('[Madness] Posted to channel, ts:', result.ts);
  } catch (err) {
    console.error('[Madness] Error:', err);

    try {
      const dm = await client.conversations.open({
        users: config.drill.userId,
      });
      await client.chat.postMessage({
        channel: dm.channel.id,
        text: `_March Madness post failed: ${err instanceof Error ? err.message : String(err)}_`,
      });
    } catch (dmErr) {
      console.error('[Madness] Failed to notify Jeff:', dmErr);
    }
  }
}

/**
 * Handle a thread reply to the Madness post as feedback.
 * Uses Claude to interpret the feedback, edit the original post,
 * and save the feedback for future runs.
 */
export async function handleMadnessFeedback(
  client: any,
  feedbackText: string,
  threadTs: string,
  channelId: string,
): Promise<void> {
  console.log('[Madness] Processing feedback:', feedbackText.slice(0, 100));

  const state = getState();
  if (!state) {
    console.error('[Madness] No state found, cannot edit post');
    return;
  }

  // Get the current post text
  let currentText = '';
  try {
    // Needs groups:history scope for private channels
    const history = await client.conversations.history({
      channel: channelId,
      latest: state.lastPostTs,
      inclusive: true,
      limit: 1,
    });
    if (history.messages?.length > 0) {
      currentText = history.messages[0].text || '';
    }
  } catch (err) {
    console.error('[Madness] Could not fetch current post (may need groups:history scope):', err);
    // Reconstruct from saved data if we can't read the channel
    try {
      const [dashData, projects] = await Promise.all([
        scrapeDashboard(),
        fetchKeyProjects(),
      ]);
      currentText = formatMadnessPost(dashData, projects);
    } catch (rebuildErr) {
      console.error('[Madness] Could not rebuild post either:', rebuildErr);
    }
  }

  // Load all past feedback for context
  const pastFeedback = getFeedback();

  // Use Claude to apply the feedback to the current post
  const prompt = `You are editing a Slack message based on user feedback.

CURRENT POST:
${currentText}

USER FEEDBACK (apply this now):
${feedbackText}

PAST FEEDBACK (also consider for consistency):
${pastFeedback}

Apply the feedback to produce an updated version of the post. Only change what the feedback asks for. Keep the same overall structure and Slack formatting. Output ONLY the updated post text, nothing else. No explanation, no preamble. Use <!here> for @here mentions.`;

  try {
    const updatedText = await runClaude(prompt);

    if (updatedText && updatedText.trim()) {
      // Edit the original post
      await client.chat.update({
        channel: channelId,
        ts: state.lastPostTs,
        text: updatedText.trim(),
      });

      // React to the feedback message
      await client.reactions.add({
        channel: channelId,
        name: 'white_check_mark',
        timestamp: threadTs,
      }).catch(() => {});

      console.log('[Madness] Post updated based on feedback');
    }
  } catch (err) {
    console.error('[Madness] Failed to apply feedback:', err);
    await client.reactions.add({
      channel: channelId,
      name: 'x',
      timestamp: threadTs,
    }).catch(() => {});
  }

  // Always save the feedback for future runs regardless of edit success
  appendFeedback(feedbackText);
  console.log('[Madness] Feedback saved');
}

/**
 * Use Claude to apply accumulated feedback to a draft post.
 */
async function applyFeedback(
  draft: string,
  feedback: string,
  dashData: any,
): Promise<string> {
  const prompt = `You are generating a daily Slack channel post called "March Madness" for a growth team.

RAW DATA FROM DASHBOARD:
${JSON.stringify(dashData, null, 2)}

DRAFT POST (auto-generated from dashboard scraping):
${draft}

ACCUMULATED FEEDBACK FROM PAST DAYS (apply all of this):
${feedback}

Generate the final post. Apply all the feedback to fix numbers, formatting, structure, and project list. If feedback says to use projected numbers instead of raw, calculate them. Output ONLY the Slack message text.`;

  return runClaude(prompt);
}

function runClaude(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const args = [
      '--print',
      '--output-format', 'text',
      '--model', config.agent.model,
      '--max-turns', '1',
      '-p', prompt,
    ];

    const proc = spawn('claude', args, {
      env: { ...process.env, ANTHROPIC_API_KEY: config.anthropic.apiKey },
      cwd: config.agent.cwd,
    });

    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (d) => stdout += d);
    proc.stderr.on('data', (d) => stderr += d);
    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Claude exited ${code}: ${stderr}`));
      } else {
        resolve(stdout.trim());
      }
    });
    proc.on('error', reject);
  });
}
