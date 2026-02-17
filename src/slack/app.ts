import { App, LogLevel } from '@slack/bolt';
import { config } from '../config.js';

export function createSlackApp(): App {
  const app = new App({
    token: config.slack.botToken,
    appToken: config.slack.appToken,
    signingSecret: config.slack.signingSecret,
    socketMode: true,
    logLevel: LogLevel.INFO,
  });

  return app;
}
