import { config } from './config.js';
import { createSlackApp } from './slack/app.js';
import { registerHandlers } from './slack/handlers.js';
import { startHealthServer } from './health/server.js';
import { getDb } from './db/database.js';
import { mkdirSync } from 'fs';

async function main(): Promise<void> {
  console.log('Starting Dad agent...');

  // Ensure workspace directory exists
  mkdirSync(config.agent.cwd, { recursive: true });

  // Initialize database
  getDb();
  console.log('Database initialized');

  // Start health check server
  startHealthServer(8080);

  // Create and start Slack app
  const app = createSlackApp();
  registerHandlers(app);

  await app.start();
  console.log('Dad is online and listening for Slack messages');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
