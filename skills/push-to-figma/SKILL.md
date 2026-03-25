---
name: push-to-figma
description: Use when asked to "push to figma", "sync to figma", "load instagram copy into figma", "send copy to figma", "prep figma content", or "sync content calendar to figma". Fetches upcoming Instagram carousel posts from the Notion content calendar, parses slide copy and captions, and writes a structured JSON file that the Figma bridge server reads to populate carousel templates.
---

# Push to Figma

Pull Instagram carousel copy from the Notion content calendar and write it to `/Users/miminguyen/social/figma-sync-content.json` so the Figma bridge can populate carousel slide templates.

---

## When to Use

- User says "push to figma", "sync to figma", "load instagram copy into figma", "send copy to figma"
- User wants to populate Figma carousel templates with approved content from Notion
- User is preparing the weekly design pass and needs copy loaded into frames

---

## Step 1: Query the Content Calendar

Use `notion-query-database-view` with this exact view URL:

```
https://www.notion.so/be6acfca0d35459a9a00ee3c263736d6?v=8b53f2c3-e549-4a27-83a2-8862e1d745c6
```

This queries the **4-Week Content Calendar (Feb 23 - Mar 22)** database (ID: `be6acfca0d35459a9a00ee3c263736d6`).

**Filter criteria (apply both):**
- `Channel` = `"Instagram"` — exact match, excludes "Instagram Story"
- `Content Type` in `["Protocol", "New Research", "Testimonial", "Health Education"]` — excludes "Product Marketing"

**Date filtering:** There is no Status field in this database. Include posts whose `Date` is today or in the future (date >= today). Skip posts with a past date.

For each result, note:
- Page ID
- `Post` property — the post title
- `date:Date:start` property — the scheduled date
- `Week` property — the week label (e.g., "Week 1")
- `Content Type` property — the format type

---

## Step 2: Fetch Each Post's Page Body

For each matching post, call `notion-fetch` with the page ID to retrieve the full page content.

The page body follows this structure:

```
**Format:** Carousel (9 slides)
## Slide Copy
**Slide 1 (Hook):** [full text of slide 1]
**Slide 2:** [full text of slide 2]
**Slide 3:** [full text of slide 3]
...
**Slide N (Summary):** [summary slide text]
**Slide N+1 (References):** [references text]
## Caption
[multi-paragraph caption text]
```

---

## Step 3: Parse the Page Content

### Extract the Format

Find the line starting with `**Format:**` and capture the value (e.g., `"Carousel (9 slides)"`).

### Extract Slide Copy

1. Locate the `## Slide Copy` heading in the page body.
2. Find every line matching the pattern `**Slide N...:**` followed by slide text.
3. For each slide line:
   - Extract the label: everything between `**Slide ` and `:**` — e.g., `"Slide 1 (Hook)"`, `"Slide 2"`, `"Slide 8 (Summary)"`
   - Extract the body: all text after `:**` on that line (and any continuation text on subsequent lines before the next `**Slide` marker)
4. **Skip any slide whose label contains `(References)`** — do not include reference slides in the output JSON.
5. The `hook` field is the body text of `Slide 1` (or whichever slide is labeled with `(Hook)`).

### Extract the Caption

1. Locate the `## Caption` heading.
2. Capture all text from that heading to the end of the page.
3. Preserve paragraph breaks.

---

## Step 4: Build the JSON Structure

Assemble all parsed posts into this exact structure:

```json
{
  "week": "Week of [YYYY-MM-DD]",
  "generatedAt": "[ISO timestamp]",
  "posts": [
    {
      "id": "[notion page id]",
      "title": "[Post property value]",
      "date": "[date:Date:start value]",
      "week": "[Week property value]",
      "contentType": "[Content Type property value]",
      "format": "[value from **Format:** line, e.g. 'Carousel (9 slides)']",
      "hook": "[full text of Slide 1 / Hook slide]",
      "slides": [
        {
          "headline": "Slide 1 (Hook)",
          "body": "[full text of slide 1]"
        },
        {
          "headline": "Slide 2",
          "body": "[full text of slide 2]"
        }
      ],
      "caption": "[full caption text]"
    }
  ]
}
```

**Rules:**
- `week` at the top level: use `"Week of [earliest post date in YYYY-MM-DD format]"` as a label
- `generatedAt`: ISO 8601 timestamp of when the sync was run
- `slides` array: one entry per slide, in order, excluding any `(References)` slide
- `headline`: the full slide label as it appears in the source — e.g., `"Slide 1 (Hook)"`, `"Slide 3"`, `"Slide 8 (Summary)"`
- `body`: the complete slide text, preserving all content
- `hook`: the body text of the first slide (same content as `slides[0].body`)
- `caption`: full multi-paragraph caption text

---

## Step 5: Write the JSON File

Use the `Write` tool to write the assembled JSON to:

```
/Users/miminguyen/social/figma-sync-content.json
```

Overwrite any existing file at that path.

---

## Step 6: Report Back

After writing the file, report:

```
Figma sync complete.

Posts prepped: [N]
[List each post: "• [title] ([date]) — [slideCount] slides"]

Skipped: [any posts skipped and why — e.g., past date, missing slide copy, References-only]

Output written to: /Users/miminguyen/social/figma-sync-content.json

Next steps:
- Open the Figma plugin and click "Load Content" to pull this JSON into the carousel templates
- Or: the bridge server at localhost:3333 is watching this file and will auto-push if running
```

---

## Error Handling

| Situation | Action |
|-----------|--------|
| Post has no `## Slide Copy` section | Skip the post, note it in "Skipped" |
| Post has `## Slide Copy` but only a References slide | Skip the post, note it in "Skipped" |
| Post has no `## Caption` section | Include the post with `"caption": ""`, flag it in the report |
| Post date is missing or unparseable | Skip the post, note it in "Skipped" |
| `notion-query-database-view` returns zero results | Report: "No matching Instagram posts found in the content calendar for the current period. Check that posts exist with Channel = Instagram and a future date." |
| `notion-fetch` fails for a page | Skip that page, note the failure in "Skipped" |

---

## Notes

- **No hashtags.** Never add hashtags to any slide body or caption text.
- **Preserve copy exactly.** Do not rephrase, shorten, or clean up slide text. Output must match what is in Notion verbatim.
- **References slides are excluded.** The Figma carousel templates do not have a references frame — always omit slides labeled `(References)`.
- **Product Marketing posts are excluded.** These are handled via a separate paid media workflow.
- **Instagram Story posts are excluded.** Filter is strictly `Channel = "Instagram"` (not "Instagram Story").
- The Figma bridge server reads `/Users/miminguyen/social/figma-sync-content.json` — this is the handoff point between Sandy and the Figma plugin.
