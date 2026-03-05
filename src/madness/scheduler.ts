import type { App } from '@slack/bolt';
import cron from 'node-cron';
import { runMadnessPost } from './runner.js';
import { config } from '../config.js';

export function startMadnessScheduler(app: App): void {
  // 9 AM PST = 9 AM America/Los_Angeles
  const cronExpr = config.madness.cronExpression;
  const tz = config.madness.timezone;

  console.log(`[Madness] Scheduling daily post: ${cronExpr} (${tz})`);

  cron.schedule(cronExpr, async () => {
    console.log('[Madness] Cron triggered');
    try {
      await runMadnessPost(app.client);
    } catch (err) {
      console.error('[Madness] Scheduler error:', err);
    }
  }, { timezone: tz });
}
