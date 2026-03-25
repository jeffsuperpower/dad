---
name: ghost
description: Launch the Superpower Ghost overlay — a translucent floating screen coach powered by Claude. Use when the user says "launch ghost", "start ghost", "open ghost", "run ghost", or "/ghost".
argument-hint: [--model model-id]
metadata:
  author: superpower
  version: 1.0.0
---

# Superpower Ghost

Launch Ghost immediately using the Bash tool. Do NOT just describe how to launch it — actually run it.

## Step 1: Check dependencies

Run this check (fast, non-blocking):

```bash
python3 -c "import pyautogui, PIL, objc, AppKit, CoreText" 2>&1
```

If it fails, install dependencies first:

```bash
pip install pyautogui Pillow pyobjc-framework-Cocoa pyobjc-framework-CoreText pyobjc-framework-Quartz
```

## Step 2: Launch Ghost

Run the script in the background using the Bash tool with `run_in_background: true`:

```bash
python3 scripts/superpower-ghost.py
```

The working directory must be the repo root (where `scripts/` lives) so Ghost can find fonts and assets. Claude Code's working directory is already set to the repo root.

If the user passed `--model` as an argument, append it:

```bash
python3 scripts/superpower-ghost.py --model claude-opus-4-6
```

## Step 3: Confirm

Tell the user: "Ghost is running. You should see the floating overlay in the bottom-right corner of your screen."

## Notes

- Ghost is a floating macOS panel — it runs as its own window alongside Claude Code
- Toggle the switch to capture screenshots, then ask Ghost questions about what's on screen
- Mention any agent by name (e.g. "Marcus, review this") and Ghost channels their expertise
- Commands inside Ghost: `/new` (new session), `/clear` (clear chat), `/captures` (show count)
- Default model: `claude-sonnet-4-6`
- Ghost can push HTML mockups into Figma via `generate_figma_design` MCP tool and recreate captured screens in Superpower brand format using built-in design system knowledge
