# New Testimonial Package

Full content extraction workflow that transforms a customer interview transcript into a complete multi-channel content package using a 4-phase process.

**When to use:** When you have a new testimonial transcript and need to generate the full suite of content (paid video scripts, static ads, blog, email, Instagram, quotes) and add everything to Notion.

**Invocation:** `/new-testimonial-package` or ask Thalia to "process this transcript for all channels"

---

## Workflow Overview

This skill executes a **5-phase workflow**:

| Phase | Name | What Happens | Checkpoint |
|-------|------|--------------|------------|
| **1** | Transcript Upload | Index transcript, confirm member details | "Ready for creative alignment?" |
| **2** | Creative Alignment | Propose hero story + 3-8 ad angles | "Do these angles look right?" |
| **3** | Paid Script Workshop | Generate paid video + static scripts → Workshop in conversation | "Ready for organic extraction?" |
| **4** | Organic Extraction | Run organic extraction (blog, email, social, quotes) | "Ready to ship to Notion?" |
| **5** | Media Triage | Ship all content to Notion + Hand off to Mario | Complete |

**CRITICAL:** Phases 2 and 3 are iterative. Stay in each phase until the user explicitly approves. Never proceed without clear approval.

---

## Phase 1: Transcript Upload

### Step 1.1: Receive Transcript

Accept the transcript from the user. They may also provide:
- Optional key points to emphasize (if fresh off interview)
- Notes about angles that stood out to them

Before processing:
1. **Strip blank lines** for accurate line numbering
2. **Assign line numbers** to each line of content
3. **Preserve original wording** exactly as provided
4. **Review user notes** - If notes are included, use them to guide (not limit) extraction

### Step 1.2: Extract Member Info

Read the transcript and extract:
- **Name** (full name as spoken)
- **Age** (if mentioned)
- **Biological Age** (if mentioned)
- **Location** (city, state)
- **Occupation** (job/role)
- **Health Focus** (primary conditions, biomarkers, symptoms discussed)
- **Key Themes** (3-5 theme tags based on their story)

### Step 1.3: Confirm Permissions

**ASK THE USER:**
- "Is [Name] approved for **paid ads**? (yes/no)"
- "Any name usage restrictions? (Full Name / First Name + Last Initial / Anonymous)"

Default assumptions if user doesn't specify:
- Web, Email, Organic Social = ✓ (approved)
- Paid Ads = **MUST be explicitly confirmed**
- Name Usage = Full Name (unless told otherwise)

### Step 1.4: Create Transcript File

Get next ID by scanning `${CLAUDE_PLUGIN_ROOT}/testimonials/transcripts/` for highest SP-XXX number and increment.

Create file at: `${CLAUDE_PLUGIN_ROOT}/testimonials/transcripts/SP-[XXX]-[firstname]-[lastname]-[age]-[healthfocus].md`

**File format:**
```markdown
# SP-[XXX]: [Full Name]

## Member Info
- **Name:** [Full Name]
- **Age:** [Age]
- **Biological Age:** [Bio Age if known]
- **Location:** [City, State]
- **Occupation:** [Job/Role]
- **Health Focus:** [Primary health topics]
- **Interview Date:** [Month Year]

## Usage Rights
- **Paid Ads:** [✓ or ✗]
- **Web:** ✓
- **Email:** ✓
- **Organic Social:** ✓
- **Name Usage:** [Full Name / First + Last Initial / Anonymous]

## Notes
- [Key details about this member]
- [Notable quotes or story angles]

## Key Themes
- [theme-tag-1], [theme-tag-2], [theme-tag-3]

---

## Transcript

Source file: [original file path provided by user]

[Full verbatim transcript with line numbers]
```

### Step 1.5: Confirm and Proceed

Tell the user:
> "Added [Name] to the testimonial library as **SP-[XXX]**.
> - Paid ads: [✓/✗]
> - Transcript saved to: `transcripts/SP-XXX-filename.md`
>
> Ready to proceed with creative alignment?"

---

## Phase 2: Creative Alignment

**Purpose:** Establish the narrative spine before extraction to ensure cohesive content across all channels.

### Step 2.1: Identify the Baseline Story

Reference `${CLAUDE_PLUGIN_ROOT}/knowledge/testimonial-baseline-story.md` for guidance.

Read the transcript and identify the member's natural telling of their health journey. Look for the response to prompts like:
> "Walk me through your health journey..."

### Step 2.2: Propose Hero Story Framework

Present to the user:

```markdown
## Hero Story Framework: [Member Name]

**Who they are:**
[Age, occupation, life context - 1-2 sentences]

**Before state:**
[Their health/life before Superpower - what was happening, what they were experiencing]

**Turning point:**
[Why they tried Superpower - the catalyst, the decision moment]

**After state:**
[What changed - specific discoveries, how they feel now, what's different]

**Core theme:**
[The one-sentence emotional takeaway of this story]
```

### Step 2.3: Propose Ad Angles (3-8)

Based on the transcript strength, propose 3-8 distinct ad angles:

```markdown
## Ad Angles for [Member Name]

Based on this transcript, here are [X] strong angles we can develop:

### Angle 1: [Angle Name]
**Story slice:** [2-3 sentence description]
**Target emotion:** [What desire this targets]
**Key quote:** "[Supporting quote from transcript]" *(Line X)*

### Angle 2: [Angle Name]
[Same structure...]

[Continue for 3-8 angles based on transcript strength]

---

**Note:** I've identified [X] angles. [If fewer than 5: "This transcript has [X] strong angles - I didn't force weak ones." / If 6+: "This transcript is rich with material."]
```

### Step 2.4: Get User Approval

Ask:
> "Does this hero story framework and these ad angles look right? Any adjustments?"

**This is an iterative step.** If the user requests changes:
1. Incorporate their feedback
2. Re-present the updated angles
3. Ask again: "How do these look now?"

Continue iterating until the user explicitly approves. Only then proceed to Phase 3.

**Wait for explicit user approval before proceeding to Phase 3.**

---

## Phase 3: Paid Script Workshop

**Purpose:** Generate paid ad scripts and workshop them in conversation until they're ready.

### Step 3.1: Generate Paid Video Scripts

Invoke `testimonial-extraction-paid-video`:
- Generate 3-8 video ad versions based on approved angles
- Story beats (Hook/Conflict/Bridge/Discovery/Result)
- Verbatim quotes with line numbers

Present all video scripts to the user.

### Step 3.2: Generate Paid Static Concepts

Invoke `testimonial-extraction-paid-static`:
- Generate 5-8 static ad concepts
- Verbatim quote + optional Superpower line + CTA
- No visual direction (we have templates)

Present all static concepts to the user.

### Step 3.3: Workshop in Conversation

**This is an iterative step.** Present paid content and ask:
> "Here are the paid video scripts and static concepts. What feedback do you have?"

If the user requests changes:
1. Revise the specific scripts/concepts they called out
2. Re-present the updated versions
3. Ask: "How do these look now?"

Continue iterating until the user explicitly approves all paid content.

### Step 3.4: Prompt for Organic Extraction

Once paid content is approved:
> "Paid scripts are locked. Ready for me to generate organic content (blog, email, social video, quotes)?"

**Wait for explicit user approval before proceeding to Phase 4.**

---

## Phase 4: Organic Extraction

**Purpose:** Generate organic content now that paid angles are finalized.

### Step 4.1: Run Organic Extraction

Invoke `testimonial-extraction-organic`:
- 1 blog article (600-900 words)
- 1 organic video script (60-90 seconds)
- 1 hero video story script (45-90 seconds)
- 1 email draft
- 3-5 hero quotes

### Step 4.2: Present Organic Content

Present organic content to the user. Organic content typically requires less iteration than paid, but allow for feedback if needed.

### Step 4.3: Prompt for Shipping

> "All content is ready. Ready to ship everything to Notion?"

**Wait for user confirmation before proceeding to Phase 5.**

---

## Phase 5: Media Triage

### Step 5.1: Ship Organic Content to Notion

**Auto-ship immediately** (no additional approval needed):

**Testimonial Organic Content Database:**

| Content | Row Name | Channel |
|---------|----------|---------|
| Blog | `[Member Name] Blog` | Blog |
| Email | `[Member Name] Email` | Email |
| Social Organic Video | `[Member Name] Social Organic Video` | Social Organic Video |
| Hero Video Story | `[Member Name] Hero Video Story` | Hero Video Story |

**Quote Bank Database:**
- `[Member Name] Quote 1`
- `[Member Name] Quote 2`
- `[Member Name] Quote 3`
- (etc.)

### Step 5.2: Ship Paid Content to Notion

After user confirms "ready to push":

**Static Ads Database:**
- One row per static ad concept (5-8 rows)
- Properties: Concept Name, Member relation, Usage Rights, Health Focus, Status
- Full content (Quote + Superpower Line + CTA) in page body

**Note:** Paid video scripts do NOT go to a separate database — they live in the Video Editor Brief (next step).

### Step 5.3: Hand Off to Mario (Editor Brief IN Media Deliverables)

**CRITICAL:** Editor briefs now go DIRECTLY into the Media Deliverables page body — no separate Notion page. This keeps everything in one place for editors.

**Compile the full editor brief content:**

```markdown
# Editor Brief — [Member Name]

## Member Info
- **Member:** [Name]
- **File:** [transcript filename]
- **Bio:** [age, occupation, health context from transcript]
- **Discoveries:** [key health findings from testing]

---

## Hero Cut

**Formats:** 9:16 + 4:5
**Caption Style:** White NB International
**Grade:** Neutral, warm side
**Speed:** 1.05-1.15x after edit
**Total Cuts:** 1

**Context + notes:**
- Clean, story-led cut for homepage/landing pages
- Simple white closed captions
- Opening frame with name, bio age, SP age design
- Add light music

| Section | Quote | Line |
|---------|-------|------|
| OPENING | "[Quote from hero story script]" | X |
| FRICTION | "[Quote]" | X |
| BRIDGE | "[Quote]" | X |
| DISCOVERY | "[Quote]" | X |
| AFTER | "[Quote]" | X |

---

## Testimonial Ads

> ⚠️ **COMPLIANCE REQUIREMENT:** Include "Member received complimentary testing" as on-screen text within the first 10 seconds of ALL paid ad videos.

**Formats:** 9:16 + 4:5
**Caption Style:** White NB International (reduced kerning) on orange rectangle, rounded corners, opacity reveal
**Grade:** Neutral, warm side
**Speed:** 1.05-1.15x after edit
**Total Cuts:** [X - number of paid video scripts]

---

## Cut 1: [Version Name]

**Title Hook:** "[Hook option]"

| Section | Quote | Line |
|---------|-------|------|
| HOOK | "[Quote]" | X |
| CONFLICT | "[Quote]" | X |
| BRIDGE | "[Quote]" | X |
| DISCOVERY | "[Quote]" | X |
| RESULT | "[Quote]" | X |

---

[Continue for all paid video script versions...]
```

**Pass the full brief to Mario:**

```
@mario create testimonial deliverable for [Member Name]:
- Deliverable: Customer Testimonials: [Member Name]
- Quantity: [1 hero + X paid ad cuts]
- Content type: Testimonial video
- Editor Brief Content:

[PASTE FULL EDITOR BRIEF CONTENT HERE]
```

**Mario will:**
1. Prompt for Launch Date and Owner
2. Create Media Deliverables row with testimonial defaults
3. Write the FULL editor brief directly into the page body
4. Trigger Google Drive folder creation

**Result:** Editor opens ONE page and has everything they need — no clicking through to separate pages.

---

## Notion Database Reference (5 Total)

| # | Database | Content | Row Naming |
|---|----------|---------|------------|
| 1 | **Superpower Stories SSOT** | Member records only | — |
| 2 | **Static Ads** | Static ad concepts (5-8 per member) | — |
| 3 | **Testimonial Organic Content** | Blog, Email, Social Organic Video, Hero Video Story | `[Member Name] [Channel]` |
| 4 | **Quote Bank** | Hero quotes (3-5 per member) | `[Member Name] Quote [#]` |
| 5 | **Media Deliverables** | Triage/assignment + **Editor Brief in page body** | `Customer Testimonials: [Member Name]` |

**Note:** Editor briefs no longer have a separate database — they go directly into the Media Deliverables page body.

---

## Output Summary

When this workflow completes, you will have delivered:

| Output | Quantity | Location |
|--------|----------|----------|
| Paid Video Scripts | 3-8 | Media Deliverables page body (in editor brief) |
| Static Ad Concepts | 5-8 | Static Ads database |
| Blog Article | 1 | Testimonial Organic Content |
| Email | 1 | Testimonial Organic Content |
| Social Organic Video | 1 | Testimonial Organic Content |
| Hero Video Story | 1 | Testimonial Organic Content |
| Hero Quotes | 3-5 | Quote Bank |
| Media Deliverables Row (with Editor Brief) | 1 | Media Deliverables DB |

**Key change:** Editor brief content lives INSIDE the Media Deliverables page — editor opens one page and has everything.

---

## Compliance Reminders

Reference `${CLAUDE_PLUGIN_ROOT}/compliance-guide.md` for full guidance.

**Key rules:**
- All quotes must be verbatim with line numbers
- Mark edits with [brackets] or [...]
- Flag stitched quotes: "Lines X, Y, stitched"
- Default to anonymous unless written consent confirmed
- Flag customer names: "Verify written consent before using in ads"

---

## Quick Reference: Phase Checkpoints

| Phase | Name | Checkpoint | Wait for User? |
|-------|------|------------|----------------|
| 1 | Transcript Upload | "Ready to proceed with creative alignment?" | Yes |
| 2 | Creative Alignment | "Do these angles look right?" | Yes (iterate until approved) |
| 3 | Paid Script Workshop | "Ready for organic extraction?" | Yes (iterate until approved) |
| 4 | Organic Extraction | "Ready to ship to Notion?" | Yes |
| 5 | Media Triage | Complete | — |

**Never skip a checkpoint.** Phases 2 and 3 are iterative — stay in each phase until the user explicitly approves. Do not interpret partial approval (e.g., "yes, but also add X") as full approval to proceed.

---

## Phase 5 Automation: Shipping Manifest

**CRITICAL:** When user says "ready to ship" or gives Phase 5 approval, execute ALL of the following in sequence. Do NOT prompt between steps. This is a single automated batch.

### Shipping Sequence (Execute All)

**Step 1: Ship Organic Content (4 rows)**
```
Database: Superpower Stories: Blog
- collection://75b8de13-befc-4f7b-8ba3-fb8b35ddf469
- Row: [Member Name] Blog
- Content in page body

Database: Superpower Stories: Email
- collection://e67c5c29-ac97-4d24-8d26-24e81164051e
- Row: [Member Name] Email
- Content in page body

Database: Superpower Stories: Social Organic Videos
- collection://99d88ffa-ab70-4653-bc8d-3e92e146a121
- Row: [Member Name] Social Organic Video
- Content in page body

Database: Superpower Stories: Hero Stories
- collection://c4a9ddd2-b669-4071-b507-7db3d651f1a2
- Row: [Member Name] Hero Video Story
- Content in page body
```

**Step 2: Ship Quotes (3-5 rows)**
```
Database: Member Testimonial Quotes (Quote Bank)
- collection://2cc84444-81d0-8080-b996-000b080cd900
- Rows: [Member Name] Quote 1, Quote 2, etc.
- Properties: Name, Quote, Category, Source, Usage Rights
```

**Step 3: Ship Static Ads (5-8 rows)**
```
Database: Superpower Stories: Static Ads
- collection://052eb123-269d-41ed-a78e-5d9c70d25c5b
- One row per concept
- Full content in page body
```

**Step 4: Hand Off to Mario (Editor Brief in Page Body)**
```
@mario create testimonial deliverable for [Member Name]:
- Deliverable: Customer Testimonials: [Member Name]
- Quantity: [1 hero + X paid ad cuts]
- Content type: Testimonial video
- Editor Brief Content:

[FULL EDITOR BRIEF MARKDOWN - Mario writes this directly into the Media Deliverables page body]
```

Mario will:
1. Prompt for Launch Date and Owner
2. Create the Media Deliverables row
3. Write the editor brief directly into the page body (no separate page)
4. Trigger Google Drive folder creation

### Automation Rules

1. **No prompts between steps** — Execute Steps 1-3 as a single batch
2. **Parallel where possible** — Steps 1 and 2 can run in parallel
3. **Report URLs at end** — After all shipping, list all created pages
4. **Mario handoff is last** — Only invoke Mario after all content is shipped
5. **Never forget static ads** — This was missed before; always include Step 3
6. **Editor brief goes IN the deliverable** — No separate Notion page needed
