# Dad - Always-On Claude Agent via Slack

## Quick Reference

- **Deploy**: `~/.fly/bin/flyctl deploy`
- **SSH**: `~/.fly/bin/flyctl ssh console -a dad-agent`
- **Logs**: `~/.fly/bin/flyctl logs -a dad-agent`
- **Dev**: `npm run dev` (needs `.env` with Slack + Anthropic keys)
- **Build**: `npm run build`
- **GitHub**: https://github.com/jeffsuperpower/dad (push with `jeffsuperpower` auth)

## Architecture

TypeScript + `@slack/bolt` (Socket Mode) + `better-sqlite3` + Fly.io.

Each Slack message spawns `claude --print --output-format json` via `child_process.spawn`. Multi-turn threads use `--resume <session_id>` from SQLite. Concurrency: max 3 global, 1 per thread.

**Do NOT use the Agent SDK** (`@anthropic-ai/claude-agent-sdk`). It throws "Claude Code process exited with code 1". The CLI spawn approach works.

## Fly.io

- App: `dad-agent`, Region: `sjc`, VM: `performance-1x` (8GB RAM)
- Volume: `dad_data` (10GB) at `/data` — workspace + SQLite + training data
- Always-on: `auto_stop_machines = 'off'`, `min_machines_running = 1`

## Training System

Only Jeff (`U08QUBV7UNQ`) can train Dad by sending `training: <content>` in DMs. Training persists at `/data/training/TRAINING.md` and is injected into the system prompt.

## Model

Default: `claude-sonnet-4-5-20250929`. Do NOT use `claude-sonnet-4-5-20250514` (doesn't exist).
