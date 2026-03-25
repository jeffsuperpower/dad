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
    maxTurns: parseInt(optional('AGENT_MAX_TURNS', '50'), 10),
    maxBudgetUsd: parseFloat(optional('AGENT_MAX_BUDGET_USD', '2.00')),
    cwd: optional('AGENT_CWD', '/data/workspace'),
  },
  auth: {
    authorizedUserIds: csvSet('AUTHORIZED_USER_IDS'),
    authorizedChannelIds: csvSet('AUTHORIZED_CHANNEL_IDS'),
  },
  db: {
    path: optional('DB_PATH', '/data/dad.db'),
  },
  github: {
    pat: process.env.GITHUB_PAT || '',
  },
  googleCalendar: {
    clientId: process.env.GOOGLE_CALENDAR_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CALENDAR_CLIENT_SECRET || '',
    refreshToken: process.env.GOOGLE_CALENDAR_REFRESH_TOKEN || '',
    calendarId: optional('GOOGLE_CALENDAR_ID', 'jeff@superpower.com'),
  },
  gmail: {
    clientId: process.env.GMAIL_CLIENT_ID || '',
    clientSecret: process.env.GMAIL_CLIENT_SECRET || '',
    refreshToken: process.env.GMAIL_REFRESH_TOKEN || '',
    fromAddress: optional('GMAIL_FROM_ADDRESS', 'jeff@superpower.com'),
  },
  madness: {
    enabled: process.env.MADNESS_ENABLED !== 'false', // on by default
    cronExpression: optional('MADNESS_CRON', '0 9 * * *'),
    timezone: optional('MADNESS_TIMEZONE', 'America/Los_Angeles'),
    channelId: optional('MADNESS_CHANNEL_ID', 'C0AJUMEFK0S'),
  },
  drill: {
    enabled: process.env.DRILL_ENABLED === 'true',
    userId: optional('DRILL_USER_ID', 'U08QUBV7UNQ'), // Jeff
    cronExpression: optional('DRILL_CRON', '0 7 * * *'),
    timezone: optional('DRILL_TIMEZONE', 'America/Los_Angeles'),
  },
  spenders: {
    enabled: process.env.SPENDERS_ENABLED !== 'false', // on by default
    cronExpression: optional('SPENDERS_CRON', '0 */6 * * *'), // every 6 hours
    timezone: optional('SPENDERS_TIMEZONE', 'America/Los_Angeles'),
    channelId: optional('SPENDERS_CHANNEL_ID', 'C0ANJ0CQ41J'),
    klaviyoListId: optional('SPENDERS_KLAVIYO_LIST_ID', 'VHqtXE'),
    posthogProjectId: optional('SPENDERS_POSTHOG_PROJECT_ID', '195693'),
  },
  posthog: {
    apiKey: process.env.POSTHOG_API_KEY || '',
  },
  klaviyo: {
    apiKey: process.env.KLAVIYO_API_KEY || '',
  },
  bmvs: {
    enabled: process.env.BMVS_ENABLED !== 'false', // on by default
    // 7 AM and 9 PM AEST (Sydney time) = twice daily
    cronExpression: optional('BMVS_CRON', '0 7,21 * * *'),
    timezone: optional('BMVS_TIMEZONE', 'Australia/Sydney'),
    userId: optional('BMVS_USER_ID', 'U08QUBV7UNQ'), // Jeff's Slack user ID for DMs
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
