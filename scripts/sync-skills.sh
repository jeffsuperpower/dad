#!/bin/sh
# Sync skills from growth-ai-agents into dad/skills/ before deploy
# Usage: ./scripts/sync-skills.sh

GROWTH_AGENTS_DIR="${GROWTH_AGENTS_DIR:-/Users/jeffy/growth-ai-agents}"
SKILLS_SRC="$GROWTH_AGENTS_DIR/plugins/growth-ai-agents/skills"
SKILLS_DST="$(dirname "$0")/../skills"

if [ ! -d "$SKILLS_SRC" ]; then
  echo "ERROR: Skills source not found at $SKILLS_SRC"
  echo "Set GROWTH_AGENTS_DIR to the growth-ai-agents repo path"
  exit 1
fi

# Clean and copy
rm -rf "$SKILLS_DST"
mkdir -p "$SKILLS_DST"

# Copy only SKILL.md files (skip any large assets)
for skill_dir in "$SKILLS_SRC"/*/; do
  skill_name=$(basename "$skill_dir")
  if [ -f "$skill_dir/SKILL.md" ]; then
    mkdir -p "$SKILLS_DST/$skill_name"
    cp "$skill_dir/SKILL.md" "$SKILLS_DST/$skill_name/SKILL.md"
  fi
done

count=$(ls -d "$SKILLS_DST"/*/ 2>/dev/null | wc -l | tr -d ' ')
echo "Synced $count skills to $SKILLS_DST"
