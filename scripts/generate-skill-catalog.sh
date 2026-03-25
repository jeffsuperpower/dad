#!/bin/sh
# Generate a JSON catalog from all SKILL.md files in /app/skills/
# Extracts name, description, and argument-hint from YAML frontmatter
# Output: /app/skills/catalog.json

SKILLS_DIR="${1:-/app/skills}"
OUTPUT="${2:-/app/skills/catalog.json}"

echo "["
first=true

for skill_dir in "$SKILLS_DIR"/*/; do
  skill_file="$skill_dir/SKILL.md"
  [ -f "$skill_file" ] || continue

  # Extract frontmatter (between first and second ---)
  name=""
  description=""
  hint=""
  in_frontmatter=false
  line_num=0

  while IFS= read -r line; do
    line_num=$((line_num + 1))
    if [ "$line" = "---" ]; then
      if [ "$in_frontmatter" = true ]; then
        break
      else
        in_frontmatter=true
        continue
      fi
    fi
    if [ "$in_frontmatter" = true ]; then
      case "$line" in
        name:*)
          name=$(echo "$line" | sed 's/^name:[[:space:]]*//')
          ;;
        description:*)
          description=$(echo "$line" | sed 's/^description:[[:space:]]*//')
          ;;
        argument-hint:*)
          hint=$(echo "$line" | sed 's/^argument-hint:[[:space:]]*//')
          ;;
      esac
    fi
  done < "$skill_file"

  # Fall back to directory name if no name: in frontmatter
  if [ -z "$name" ]; then
    name=$(basename "$skill_dir")
  fi

  # If no description from frontmatter, grab the first paragraph after the heading
  if [ -z "$description" ]; then
    description=$(sed -n '/^#/,/^$/{ /^#/d; /^$/d; p; }' "$skill_file" | head -1)
  fi

  [ -z "$name" ] && continue

  # Escape JSON strings
  description=$(printf '%s' "$description" | sed 's/\\/\\\\/g; s/"/\\"/g; s/	/\\t/g')
  hint=$(printf '%s' "$hint" | sed 's/\\/\\\\/g; s/"/\\"/g; s/	/\\t/g')

  if [ "$first" = true ]; then
    first=false
  else
    echo ","
  fi

  if [ -n "$hint" ]; then
    printf '  {"name":"%s","description":"%s","trigger":"/%s %s","path":"%sSKILL.md"}' \
      "$name" "$description" "$name" "$hint" "$skill_dir"
  else
    printf '  {"name":"%s","description":"%s","trigger":"/%s","path":"%sSKILL.md"}' \
      "$name" "$description" "$name" "$skill_dir"
  fi
done

echo ""
echo "]"
