import { config } from '../config.js';
import { fetchHighSpenders } from './posthog.js';
import { syncToKlaviyo } from './klaviyo.js';

export async function runSpendersSync(client: any): Promise<void> {
  console.log(`[Spenders] Starting sync at ${new Date().toISOString()}`);

  try {
    // 1. Query PostHog for high spenders
    const spenders = await fetchHighSpenders();
    const emails = spenders.map(s => s.email);

    // 2. Push to Klaviyo
    const result = await syncToKlaviyo(emails);

    // 3. Post summary to Slack (no PHI)
    const channelId = config.spenders.channelId;

    const message = [
      `*35+ High Spenders Sync* | ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'America/Los_Angeles' })}`,
      '',
      `:busts_in_silhouette: *${result.totalInList.toLocaleString()}* total in list`,
      result.newlyAdded > 0
        ? `:new: *${result.newlyAdded.toLocaleString()}* newly added this sync`
        : `:white_check_mark: No new additions this sync`,
      '',
      `_Source: PostHog segment (35+, $350+ since Aug 2025) | Target: Klaviyo list \`${config.spenders.klaviyoListId}\`_`,
    ].join('\n');

    await client.chat.postMessage({
      channel: channelId,
      text: message,
    });

    console.log(`[Spenders] Sync complete. Total: ${result.totalInList}, New: ${result.newlyAdded}`);
  } catch (err) {
    console.error('[Spenders] Sync error:', err);

    // Try to post error to Slack
    try {
      const channelId = config.spenders.channelId;
      await client.chat.postMessage({
        channel: channelId,
        text: `:x: *35+ High Spenders Sync Failed*\n\n\`${err instanceof Error ? err.message : String(err)}\``,
      });
    } catch (slackErr) {
      console.error('[Spenders] Could not post error to Slack:', slackErr);
    }
  }
}
