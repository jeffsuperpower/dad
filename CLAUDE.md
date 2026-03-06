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

## DM Commands (Jeff only)

- `training: <content>` - Add training context
- `drill` - Trigger GPET daily drill manually
- `madness` - Trigger March Madness post manually
- `contactout email@domain.com` - Forward latest ContactOut email from jeff@superpower.com
- `move/mark/set/change/clear` - GPET experiment updates

## ContactOut Email Forwarding

Uses Gmail API (googleapis) with OAuth2 to search jeff@superpower.com for the latest contactout.net email and forward it. Slack auto-links emails as `<mailto:x|x>` so the handler strips that formatting.

## March Madness Daily Post

Posts daily at 9 AM PST to `C0AJUMEFK0S`. Scrapes the Death Clock dashboard (`dashboard-five-sepia-57.vercel.app/?month=YYYY-MM-01`) for subs/reg pace, fetches P0/P1 projects from GPET `drill-data.json`. Dashboard data is embedded in SSR React serialization (double-escaped JSON in `self.__next_f.push()` calls) - regexes are fragile and may break if dashboard is rebuilt.

### Feedback Loop

@Dad in a Madness post thread triggers feedback processing. Claude reads the current post + feedback, edits the original post via `chat.update`, and saves feedback to `/data/madness/feedback.md`. Accumulated feedback is applied to future posts automatically. State (last post ts/channel) saved to `/data/madness/state.json`.

### Known Data Issue

Dashboard raw actuals (810 subs, 3,748 regs) differ from the projected/pace numbers Jeff uses in his manual report (5,639 subs, 5,191 regs). The feedback loop is designed to correct this over time as Jeff provides corrections in thread replies.

## Model

Default: `claude-sonnet-4-5-20250929`. Do NOT use `claude-sonnet-4-5-20250514` (doesn't exist).
