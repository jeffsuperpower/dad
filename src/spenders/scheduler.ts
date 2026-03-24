import cron from 'node-cron';
import type { App } from '@slack/bolt';
import { config } from '../config.js';
import { runSpendersSync } from './runner.js';

export function startSpendersScheduler(app: App): void {
  const { cronExpression, timezone } = config.spenders;

  cron.schedule(cronExpression, async () => {
    console.log(`[Spenders] Cron triggered at ${new Date().toISOString()}`);
    try {
      await runSpendersSync(app.client);
    } catch (err) {
      console.error('[Spenders] Scheduler error:', err);
    }
  }, { timezone });

  console.log(`[Spenders] Scheduler started: "${cronExpression}" (${timezone})`);
}
