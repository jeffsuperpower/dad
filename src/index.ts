import { config } from './config.js';
import { createSlackApp } from './slack/app.js';
import { registerHandlers } from './slack/handlers.js';
import { startHealthServer } from './health/server.js';
import { getDb } from './db/database.js';
import { initTraining } from './agent/training.js';
import { startDrillScheduler } from './drill/scheduler.js';
import { startMadnessScheduler } from './madness/scheduler.js';
import { initMadness } from './madness/feedback.js';
import { startSpendersScheduler } from './spenders/scheduler.js';
import { startBmvsScheduler } from './bmvs/scheduler.js';
import { mkdirSync } from 'fs';

async function main(): Promise<void> {
  console.log('Starting Dad agent...');

  // Ensure workspace directory exists
  mkdirSync(config.agent.cwd, { recursive: true });

  // Initialize database
  getDb();
  console.log('Database initialized');

  // Initialize training directory
  initTraining();
  console.log('Training directory initialized');

  // Initialize madness feedback directory
  initMadness();
  console.log('Madness feedback initialized');

  // Start health check server
  startHealthServer(8080);

  // Create and start Slack app
  const app = createSlackApp();
  registerHandlers(app);

  // Start daily drill scheduler if configured
  if (config.drill.enabled && config.github.pat) {
    startDrillScheduler(app);
  }

  // Start March Madness scheduler
  if (config.madness.enabled) {
    startMadnessScheduler(app);
  }

  // Start 35+ high spenders sync scheduler
  if (config.spenders.enabled && config.posthog.apiKey && config.klaviyo.apiKey) {
    startSpendersScheduler(app);
  }

  // Start BMVS appointment checker scheduler
  if (config.bmvs.enabled) {
    startBmvsScheduler(app);
  }

  await app.start();
  console.log('Dad is online and listening for Slack messages');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
