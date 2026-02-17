import 'dotenv/config';

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function optional(name: string, fallback: string): string {
  return process.env[name] || fallback;
}

function csvSet(name: string): Set<string> {
  const value = process.env[name] || '';
  return new Set(value.split(',').map(s => s.trim()).filter(Boolean));
}

export const config = {
  slack: {
    botToken: required('SLACK_BOT_TOKEN'),
    appToken: required('SLACK_APP_TOKEN'),
    signingSecret: required('SLACK_SIGNING_SECRET'),
  },
  anthropic: {
    apiKey: required('ANTHROPIC_API_KEY'),
  },
  agent: {
    model: optional('AGENT_MODEL', 'claude-sonnet-4-5-20250929'),
    maxTurns: parseInt(optional('AGENT_MAX_TURNS', '25'), 10),
    maxBudgetUsd: parseFloat(optional('AGENT_MAX_BUDGET_USD', '1.00')),
    cwd: optional('AGENT_CWD', '/data/workspace'),
  },
  auth: {
    authorizedUserIds: csvSet('AUTHORIZED_USER_IDS'),
    authorizedChannelIds: csvSet('AUTHORIZED_CHANNEL_IDS'),
  },
  db: {
    path: optional('DB_PATH', '/data/dad.db'),
  },
} as const;

export function isUserAuthorized(userId: string): boolean {
  // If no whitelist configured, allow everyone
  if (config.auth.authorizedUserIds.size === 0) return true;
  return config.auth.authorizedUserIds.has(userId);
}

export function isChannelAuthorized(channelId: string): boolean {
  // If no whitelist configured, allow all channels
  if (config.auth.authorizedChannelIds.size === 0) return true;
  return config.auth.authorizedChannelIds.has(channelId);
}
