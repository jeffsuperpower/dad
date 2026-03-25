import cron from 'node-cron';
import type { App } from '@slack/bolt';
import { config } from '../config.js';
import { checkBmvsAppointments } from './runner.js';

export function startBmvsScheduler(app: App): void {
  const { cronExpression, timezone } = config.bmvs;

  cron.schedule(cronExpression, async () => {
    console.log(`[BMVS] Cron triggered at ${new Date().toISOString()}`);
    try {
      await checkBmvsAppointments(app.client);
    } catch (err) {
      console.error('[BMVS] Scheduler error:', err);
    }
  }, { timezone });

  console.log(`[BMVS] Scheduler started: "${cronExpression}" (${timezone})`);
}
