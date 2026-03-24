import { config } from '../config.js';

interface SyncResult {
  totalInList: number;
  newlyAdded: number;
}

// Get current profile count in the list
async function getListProfileCount(listId: string, apiKey: string): Promise<number> {
  // Use the relationships endpoint with page cursor to count
  let count = 0;
  let cursor: string | null = null;

  do {
    const url = new URL(`https://a.klaviyo.com/api/lists/${listId}/profiles`);
    url.searchParams.set('page[size]', '100');
    if (cursor) url.searchParams.set('page[cursor]', cursor);

    const res = await fetch(url.toString(), {
      headers: {
        'Authorization': `Klaviyo-API-Key ${apiKey}`,
        'revision': '2024-10-15',
        'Accept': 'application/vnd.api+json',
      },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Klaviyo list profiles ${res.status}: ${body.slice(0, 200)}`);
    }

    const data = await res.json() as any;
    count += (data.data || []).length;
    cursor = data.links?.next ? new URL(data.links.next).searchParams.get('page[cursor]') : null;
  } while (cursor);

  return count;
}

// Subscribe profiles to the list via Klaviyo Subscribe API
async function subscribeProfiles(emails: string[], listId: string, apiKey: string): Promise<void> {
  // Klaviyo subscribe endpoint handles dedup - existing profiles are silently skipped
  // Batch in groups of 100 (Klaviyo limit)
  const batchSize = 100;

  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);
    const profiles = batch.map(email => ({
      type: 'profile' as const,
      attributes: {
        email,
        subscriptions: {
          email: { marketing: { consent: 'SUBSCRIBED' as const } },
        },
      },
    }));

    const res = await fetch('https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs', {
      method: 'POST',
      headers: {
        'Authorization': `Klaviyo-API-Key ${apiKey}`,
        'revision': '2024-10-15',
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
      },
      body: JSON.stringify({
        data: {
          type: 'profile-subscription-bulk-create-job',
          attributes: {
            custom_source: '35+ High Spenders Sync',
            profiles: { data: profiles },
          },
          relationships: {
            list: { data: { type: 'list', id: listId } },
          },
        },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Klaviyo subscribe ${res.status}: ${body.slice(0, 300)}`);
    }

    console.log(`[Spenders] Klaviyo batch ${Math.floor(i / batchSize) + 1}: subscribed ${batch.length} profiles`);
  }
}

export async function syncToKlaviyo(emails: string[]): Promise<SyncResult> {
  const apiKey = config.klaviyo.apiKey;
  if (!apiKey) throw new Error('KLAVIYO_API_KEY not configured');

  const listId = config.spenders.klaviyoListId;

  // Get count before sync
  const beforeCount = await getListProfileCount(listId, apiKey);
  console.log(`[Spenders] Klaviyo list ${listId} has ${beforeCount} profiles before sync`);

  // Subscribe all emails (Klaviyo handles dedup)
  if (emails.length > 0) {
    await subscribeProfiles(emails, listId, apiKey);
  }

  // Brief pause to let Klaviyo process
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Get count after sync
  const afterCount = await getListProfileCount(listId, apiKey);
  const newlyAdded = Math.max(0, afterCount - beforeCount);

  console.log(`[Spenders] Klaviyo list ${listId} now has ${afterCount} profiles (${newlyAdded} new)`);

  return { totalInList: afterCount, newlyAdded };
}
