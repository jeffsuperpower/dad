import cron from 'node-cron';
import type { App } from '@slack/bolt';
import { config } from '../config.js';
import { runDailyDrill } from './runner.js';

export function startDrillScheduler(app: App): void {
  const { cronExpression, timezone } = config.drill;

  cron.schedule(cronExpression, async () => {
    console.log(`[Drill] Cron triggered at ${new Date().toISOString()}`);
    try {
      await runDailyDrill(app.client);
    } catch (err) {
      console.error('[Drill] Scheduler error:', err);
    }
  }, { timezone });

  console.log(`[Drill] Scheduler started: "${cronExpression}" (${timezone})`);
}
