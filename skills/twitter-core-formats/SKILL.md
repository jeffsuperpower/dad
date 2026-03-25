---
name: twitter-core-formats
description: Use when creating Twitter/X content for Superpower. Defines copywriting style, format structure, and tone for each core content type. Reference during both ideation and production.
---

# Twitter/X Core Formats

## Accounts

- **@superpower** — Brand account (company voice, bolder claims)
- **@maxmarchione** — Max's personal account (founder voice, personal, authentic)

## Writing Style

- **Bold opening claims** — First line stops the scroll
- **Short, punchy sentences** — Spaced with line breaks for readability
- **No emojis** — Ever
- **No hashtags** — Ever
- **No threads** — Single tweets only (one follow-up reply OK for announcements)
- **No fluff** — Every word earns its place
- **Originate new thought** — If it's been said 1,000 times, don't say it
- **X Premium available** — Long-form option exists but use sparingly

---

## Format 1: Testimonials

**With video:** Short copy (1-3 sentences) + video does the heavy lifting.
**With image:** Longer form — draw out the story arc: before state → turning point → after state.
**Tone:** Real, grounded, human. Never salesy.

---

## Format 2: New Research (Strongest Format)

Novel science translated into cultural relevance.

**Structure:**
- Bold opening translation of the finding (NOT the academic title)
- 1-2 supporting sentences with the key insight
- Media: Branded SP image/chart + screenshot of paper title/charts

**Key:** The opening line is the cultural translation, not the study title. "Let your kids kiss the dog" not "Canine microbiome transfer in adolescent gut health."

**Ideation requirement:** Every New Research idea must include the source URL to the paper or study during ideation so the team can click through and verify.

**Production requirement:** Invoke the `research-caption-writing` skill for detailed hook, tone, formatting, and accuracy rules. Route all claims through `marcus-medical-reviewer` before finalizing.

---

## Format 3: Health Education

Informational, not advice. Originate novel insight from data.

**Structure:**
- Lead with the surprising data point or insight
- Support with context or chart
- Media: Custom charts, data visualizations, image series

**Ideation requirement:** When a Health Education idea references a specific study or data source, include the source URL during ideation.

**Examples:** Peptide regulation progression, biomarker adoption rates, sleep research trends. Draw in new insight — don't repeat what's already everywhere.

---

## Format 4: Protocols (Rare)

Only when culturally relevant, niche, or top-of-mind.

- Never generic ("5 tips for better sleep" = never)
- Must be tied to a cultural moment or surprising research angle
- Single tweet format, not a step-by-step thread

---

## Format 5: Announcements

Product launches, campaigns, partnerships, hiring.

- Bold punchy announcement tweet
- One follow-up reply with link/context (only format where this is acceptable)

---

## Format 6: Superpower Data (Primary Source)

Original data posts using Superpower's own member biomarker data via Zuko. This is NOT external research — Superpower IS the source. These posts position us as a primary data authority.

**Voice:** "We looked at our members..." / "We tested..." / "Our data shows..." — first-person plural, authoritative, owning the insight. Never "A study found..." or "Research suggests..." — that's Format 2 (New Research).

**Structure:**
- Bold opening stat that stops the scroll (the single most surprising number)
- 1-2 supporting sentences with context or breakdown
- Media: Felix-built 1080x1080 branded chart (always attached)
- Source line in tweet: "Source: Superpower member data"

**Hard rules:**
- NEVER disclose total member count or sample size (no "n=", no "19,000 members")
- All stats use percentages only
- No implied causation — correlation only for observational data
- No treatment or diagnosis claims
- Use "abnormal" or "out of range", not "dangerous" or "unhealthy"

**What makes this different from other formats:**
- New Research (Format 2) = commenting on external papers. Superpower Data = WE are the paper.
- Health Education (Format 3) = explaining concepts. Superpower Data = revealing original findings.
- The chart IS the content — the caption frames the insight, the visual proves it.

**When Felix delegates a chart caption to Tom:** Load the `data-insights` skill for channel-specific caption rules, then write the caption following this format.

---

---

## Ideation Output Format

When generating Twitter/X ideas (for Sandy's weekly ideation), present each idea with full detail:

**New Research:**
```
1. **[Title]**
   Hook: [Bold opening claim — the actual tweet opening, written as it would be posted]
   The finding: [2-3 sentences on exactly what the study found — include sample size, methodology, and key metric/result]
   Why it matters: [1-2 sentences on the cultural translation — how this connects to what the audience already cares about on X]
   Superpower tie-in: [Which specific biomarkers or panels relate to this finding]
   Source: [Full URL to paper/study — REQUIRED. Use WebSearch to find the actual paper. Plain text, never markdown links.]
   Media: [Branded image type — stat card, chart, or paper screenshot. Describe what it specifically shows.]
   Why now: [Specific reason this is timely — cultural moment, trending conversation, seasonal relevance]
```

**Health Education:**
```
1. **[Title]**
   Hook: [The full opening tweet text — lead with the surprising data point or insight]
   The insight: [2-3 sentences explaining the core educational concept and why it changes how people think about this topic]
   Key data: [Specific numbers, stats, or findings that back this up — include sample size, journal, year where applicable]
   What we'd write: [2-3 sentences describing the tweet's narrative arc — what claim opens it, what supporting evidence follows, what the reader walks away thinking]
   Source: [Full URL to supporting research — REQUIRED when citing data. Use WebSearch to find the actual paper. Plain text, never markdown links.]
   Media: [Chart, visualization, or branded image — describe specifically what the visual shows]
   Why now: [Specific reason this is timely THIS week — not just "always relevant"]
```

**Testimonials:**
```
1. **[Title]**
   Member: [SP-XXX] [Full Name], [age], [health focus]
   Hook: [Opening line — real, grounded, human]
   Story: [Before state → turning point → after state, with specific biomarker/outcome details]
   Media: [Quote card or video clip]
```

**Protocols:**
```
1. **[Title]**
   Hook: [The full opening tweet text — cultural moment tie-in or surprising angle]
   What makes this different: [1-2 sentences — why this isn't just another generic protocol, what's the novel insight or counterintuitive element]
   What it covers: [3-5 specific steps/recommendations in the protocol — not just a category name]
   Research backing: [Key study supporting these recommendations — journal, year, key finding with sample size or effect size]
   Source: [Full URL to supporting research — REQUIRED. Use WebSearch to find the actual paper. Plain text, never markdown links.]
   Media: [Branded stat card or image — describe specifically what the visual shows]
   Why now: [Specific reason this is culturally relevant THIS week — tied to a moment, season, or news event]
```

**Superpower Data (Primary Source):**
```
1. **[Title]**
   Hook: [Bold opening stat — "We looked at our members..." or "X% of the people we tested..." — first-person primary source voice]
   The data: [What the query revealed — key breakdown, most surprising finding, what pattern it shows]
   Why it stops the scroll: [What makes this counterintuitive or personally relevant — why someone would retweet this]
   Chart description: [What the Felix-built chart shows — bar chart of X by Y, distribution of Z, etc.]
   Zuko query: [The question to ask Zuko, or reference to existing dataset if reusing]
   Superpower tie-in: [Which biomarkers or panels this data comes from]
```

**RULES:**
- **Never summarize ideas as counts** (e.g., "5 New Research, 4 Health Education"). Every idea must be presented individually with full detail.
- **All URLs must be plain text**, never markdown links.
- **Testimonial ideas must use real member names and SP-XXX IDs** from @Thalia's transcript scan.

---

## Tone Reference

Match the tone of recent Superpower X posts:
- Declarative statements, no qualifiers
- Spaced line breaks between sentences
- Scientific but accessible
- No hedging, no filler
- Reads like someone who just discovered something fascinating
