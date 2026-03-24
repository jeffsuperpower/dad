import { config } from '../config.js';

export interface SpenderRecord {
  email: string;
}

const HOGQL_QUERY = `
SELECT p.properties.email AS email
FROM events e
JOIN persons p ON e.person_id = p.id
WHERE e.event IN ('onboarding_credits_purchased', 'marketplace_credits_purchased')
  AND e.timestamp >= '2025-08-01'
  AND toInt(p.properties.birthday_year) <= 1991
  AND toInt(p.properties.birthday_year) > 1900
GROUP BY email
HAVING sum(toFloat(e.properties.value)) / 100 >= 350
ORDER BY email
LIMIT 10000
`.trim();

export async function fetchHighSpenders(): Promise<SpenderRecord[]> {
  const apiKey = config.posthog.apiKey;
  if (!apiKey) throw new Error('POSTHOG_API_KEY not configured');

  const projectId = config.spenders.posthogProjectId;
  const url = `https://us.posthog.com/api/projects/${projectId}/query/`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: {
        kind: 'HogQLQuery',
        query: HOGQL_QUERY,
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`PostHog API ${res.status}: ${body.slice(0, 200)}`);
  }

  const data = await res.json() as { results: string[][] };
  const records: SpenderRecord[] = [];

  for (const row of data.results || []) {
    const email = row[0];
    if (email && typeof email === 'string' && email.includes('@')) {
      records.push({ email });
    }
  }

  console.log(`[Spenders] PostHog returned ${records.length} high spenders`);
  return records;
}
