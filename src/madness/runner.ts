import { scrapeDashboard } from './scraper.js';
import { fetchKeyProjects } from './projects.js';
import { formatMadnessPost } from './formatter.js';
import { config } from '../config.js';

const MADNESS_CHANNEL = 'C0AJUMEFK0S';

export async function runMadnessPost(client: any): Promise<void> {
  console.log('[Madness] Starting daily post...');

  try {
    // Fetch dashboard data and GPET projects in parallel
    const [dashData, projects] = await Promise.all([
      scrapeDashboard(),
      fetchKeyProjects(),
    ]);

    console.log('[Madness] Dashboard data:', JSON.stringify(dashData));
    console.log('[Madness] Projects:', projects.length);

    // Format the post
    const message = formatMadnessPost(dashData, projects);

    // Post to channel
    await client.chat.postMessage({
      channel: MADNESS_CHANNEL,
      text: message,
      unfurl_links: false,
      unfurl_media: false,
    });

    console.log('[Madness] Posted to channel');
  } catch (err) {
    console.error('[Madness] Error:', err);

    // DM Jeff about the failure
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
