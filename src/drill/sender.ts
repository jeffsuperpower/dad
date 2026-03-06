import type { WebClient } from '@slack/web-api';
import { chunkMessage } from '../slack/formatters.js';

export async function sendDrillDM(
  client: WebClient,
  userId: string,
  message: string,
): Promise<void> {
  // Open DM channel
  const dm = await client.conversations.open({ users: userId });
  const channelId = dm.channel?.id;
  if (!channelId) throw new Error('Could not open DM channel');

  // Chunk and send
  const chunks = chunkMessage(message);
  for (const chunk of chunks) {
    await client.chat.postMessage({
      channel: channelId,
      text: chunk,
      unfurl_links: false,
      unfurl_media: false,
    });
  }
}
