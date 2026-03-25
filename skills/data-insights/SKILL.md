---
name: data-insights
description: Create original data-driven social content using Superpower's member data via Zuko (FHIR data bot). Covers querying, chart design spec, caption frameworks, and compliance. Use when asked to "pull data for social", "create a data post", "Superpower Data series", or when Sandy/Tom/Iris/Noah need original member data insights for content.
---

# Data Insights Skill: Superpower Data Series

## What This Is

Superpower has 19,000+ members with comprehensive biomarker data. This skill turns that population-level data into original, chartable social content — positioning Superpower as a primary source authority on health data.

Nobody else has this data. Every post is original research.

## When to Use

- Tom needs a data-backed Twitter post with a branded chart
- Iris needs an Instagram data carousel or stat card
- Noah needs a newsletter stat or trend to anchor a story
- Sandy is planning the weekly content cycle and wants a data post in the mix
- User asks for "data post", "Superpower Data", "pull from Zuko", "original data content"

**Input:** A topic area or question about member health data
**Output:** Verified data table + branded chart spec + channel-adapted caption + source citation

---

## Step 1: Query Zuko & Build Charts — Use Felix

**Zuko querying, insight selection, and chart building are now handled by Felix (`felix-chart-maker`).**

Spawn Felix for:
- Querying Zuko for new data insights
- Discovering new data hypotheses (proactive insight generation)
- Building branded 1080x1080 chart galleries (single-page HTML with multiple sections)
- Figma capture (section-selector approach — one tab, N sequential captures)
- Notion Claims database logging

Felix has the full Zuko integration context: how to reach Zuko, query format, what Zuko can/can't do, existing datasets, and what makes a strong data post.

**To invoke:** Spawn Felix via Task tool, or the user says "felix chart", "@felix", "build data charts", "zuko chart".

---

## Step 2: Write the Caption

Each channel agent adapts the same data differently.

### Twitter/X (Tom)
- Bold opening line with the key stat — stop the scroll
- Spaced line breaks between sentences
- No emojis, no threads, no fluff
- End with source line: "Source: Superpower member data, n=XX,XXX"
- Tone: Authoritative primary source. "We looked at..." not "A study found..."
- Write as the entity that owns the data, not someone commenting on it

### Instagram (Iris)
- Hook in first line, detail in caption body
- Can use carousel format (multiple chart cards telling a story)
- Warmer, more conversational than Twitter
- "We tested our members. Here's what we found." energy (never disclose total member count)
- End with CTA: "Link in bio to get your biomarkers tested"

### Newsletter (Noah)
- Use data as the anchor for a longer narrative
- Lead with the surprising stat, then explain what it means
- Connect to actionable advice
- Can reference multiple data points in a single piece
- Conversational opener, educational body

### Universal Caption Rules
- **NEVER disclose total member count or sample size** — no "n=", no "19,000 members", no absolute numbers. Use percentages only.
- Always include "Source: Superpower member data"
- Never claim to "prevent", "cure", "treat", or "diagnose"
- Frame as "what members discover" and "how markers change" — not treatment claims
- Use "abnormal" or "out of range", not "dangerous" or "unhealthy"

---

## Step 3: Compliance & Logging

### Before Publishing
- All stats must be **aggregate, population-level** — no individual PII
- Zuko PHI-reviews every query output
- Route through **Vera** (`vera-claims-reviewer`) for final copy compliance check
- For medical framing, route through **Marcus** (`marcus-medical-reviewer`)

### Claims Logging
- Ask Zuko to "save to claims" after each data pull
- Claims are saved to the [Claims & Analyses Notion database](https://www.notion.so/superpowerhealth/30f8444481d080f884b9cf3dede74d02)
- Each claim entry includes: the stat, methodology, SQL query, datasets, date
- If Zuko's Claims Creator tool errors, preserve data in Slack thread and retry later

### Disclaimer Language
Every chart card must include:
- Source line: "Source: Superpower member data" (no sample size, no N)
- No implied causation (correlation only for observational data)
- No treatment or diagnosis claims

---

## Quick Reference: End-to-End Flow

```
1. FELIX    → Spawn Felix for Zuko querying, insight discovery, chart building
2. CAPTION  → Felix auto-delegates to channel agents (Tom/Iris/Noah) for captions
3. REVIEW   → Felix spawns Vera (claims compliance) + Marcus (medical accuracy) — MANDATORY before Figma capture
4. CAPTURE  → Felix pushes approved charts to Figma, logs to Notion
5. PUBLISH  → Post with chart + caption + source line
```

---

## Existing Data (Trial Batch — Feb 2026)

The first batch of 8 queries has been run and verified. Data is preserved in:
- **Slack:** Will's DM thread with Zuko (Feb 24, 2026)
- **Figma:** Q1-2026-Social file, node 1459:2
- **Local:** `mockups/twitter-data-series/index.html`

Datasets available for reuse:
1. Biomarker health by age decade (n=19,264)
2. "I Feel Fine" gap — abnormal distribution (n=19,758)
3. Top abnormal biomarkers on first test (n=19,142)
4. Vitamin D seasonal patterns (n=21,470)
5. Biomarker improvement leaderboard (n=varies, 11-218 per marker)
6. ApoB distribution by age (n=18,939)
7. First test surprises by age group (n=19,264)
8. Retest effect (n=2,377)
