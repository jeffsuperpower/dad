---
name: editor-briefing
description: |
  Generate multiple video editor cuts from existing transcribed scripts. Use when you have shot footage
  and need to create variations by rearranging existing sentences/chunks - NO new content can be added.

  Invoke this skill when the user asks to:
  - "Create editor briefs from this script"
  - "Generate different cuts from my transcripts"
  - "Make multiple versions from this footage"
  - "Rearrange this script into shorter cuts"
  - "Create an editor's brief for this video"
  - "Give me the editor's brief"

  Input: One or more transcribed video scripts (already shot footage)
  Output: Multiple editor briefs with chunk arrangements, timing estimates, and assembly instructions
version: 1.0.0
---

# Editor Briefing: Video Script Rearrangement Skill

## Overview

This skill takes transcribed video scripts from **already shot footage** and generates multiple editor briefs showing different ways to cut, rearrange, and condense the existing material into new variations.

**Critical Constraint:** The footage has already been shot. You can ONLY work with what exists in the transcript. You cannot add new dialogue, narration, or content - only rearrange, trim, and combine existing chunks.

**What This Skill Outputs:**
- Chunked breakdown of input script(s) with line references
- Multiple cut variations (shorter versions, different angles, different hooks)
- Editor assembly instructions for each cut
- Timing estimates
- Notes on which chunks work well together

**When to Use This Skill:**
- User provides transcribed video script(s) from already-shot footage
- User needs multiple ad variations from single shoot
- User wants shorter cuts (30s, 15s) from longer footage (60s+)
- User needs to maximize ROI from existing video assets

---

## The Chunking System

### What is a Chunk?

A **chunk** is a natural grouping of 2-4 sentences that flow together with consistent cadence and voice. Chunks should feel like complete "breaths" of content that an editor can move around without creating jarring cuts.

**Good chunks (2-4 sentences, ~10-20 seconds):**
- Natural paragraph-like groupings that share a single idea
- Content with consistent vocal rhythm and energy
- Sections that have a mini setup → payoff within them
- Groups where the sentences flow into each other naturally

**Bad chunks (too small):**
- Single sentences in isolation (feels choppy when edited)
- Breaking mid-thought or mid-cadence
- Separating setup lines from their payoff lines

**Bad chunks (too large):**
- Entire sections (30+ seconds) that can't be trimmed
- Multiple distinct ideas mashed together
- Content spanning different energy levels or tones

### Chunk Identification Rules

When processing a transcript:

1. **Group by breath/cadence** - Listen for natural pauses. If sentences flow into each other without a beat, keep them together (typically 2-4 sentences)
2. **Preserve mini-arcs** - If there's a setup → payoff within 2-3 sentences, that's ONE chunk
3. **Match energy levels** - Don't chunk high-energy lines with low-energy lines
4. **Target 10-20 seconds per chunk** - This gives editors enough to work with while maintaining flexibility
5. **Err on the side of larger** - If unsure whether to split, keep together. Editors can always trim within a chunk but can't fix bad cadence between chunks

---

## Step 1: Input Processing

### Required Input Format: Timestamped Transcripts

**CRITICAL: Scripts MUST include timestamps.** This enables precise source referencing in editor briefs.

If the user provides scripts WITHOUT timestamps, respond:
> "I need timestamped transcripts to create accurate editor briefs. Please provide scripts in this format:
> ```
> [00:00] First sentence of the script.
> [00:05] Second sentence continues here.
> [00:10] And so on...
> ```
> This allows me to reference exact moments (e.g., 'Script 1 [00:28]') so editors can find the footage quickly."

### Accept Transcript(s)

The user will provide one or more transcribed video scripts WITH TIMESTAMPS. For each transcript:

1. **Assign a Script Number** (Script 1, Script 2, etc.) if multiple scripts provided
2. **Preserve timestamps** exactly as provided — these are used in output references
3. **Identify the speaker** if mentioned (talent name, interviewee, etc.)
4. **Note original duration** from final timestamp

### Required Transcript Format

Scripts MUST include timestamps:
```
[00:00] Opening line of the script here.
[00:05] Second sentence or thought.
[00:10] Continuing the narrative...
```

Or section-based with timestamps:
```
Section,Content
HOOK,"[00:00] Opening hook line. [00:05] Second hook line."
CONFLICT,"[00:10] The conflict begins here..."
```

---

## Step 2: Chunk Extraction

### Process Each Transcript

Break each transcript into chunks with the following attributes:

| Attribute | Description |
|-----------|-------------|
| **Source** | Script number + timestamp range (e.g., Script 1 [00:28], Script 2 [00:12]) |
| **Timestamp** | Start timestamp from original transcript (e.g., [00:28]) |
| **Content** | Verbatim text of the chunk (2-4 sentences, ~10-20 seconds) |
| **Duration** | Estimated seconds (target: 10-20s per chunk) |
| **Function** | Hook, Context, Tension, Discovery, Result, CTA |
| **Standalone?** | YES = works alone, NO = needs preceding chunk for context |

### Chunk Function Definitions

- **Hook** - Attention-grabbing opener, creates curiosity
- **Context** - Sets up the situation or background
- **Tension** - Shows the problem, struggle, or conflict
- **Discovery** - The insight, revelation, or turning point
- **Result** - The outcome, transformation, or benefit
- **CTA** - Call to action or closing statement
- **Transition** - Connective tissue between beats ("That's when I realized...")

### Output: Chunk Inventory

Create a chunk inventory with **larger, natural chunks** (2-4 sentences, 10-20 seconds each).

**IMPORTANT: Write out the FULL VERBATIM content of each chunk, not just a preview or first sentence.** Editors need to see the complete text to make cutting decisions.

```markdown
## Chunk Inventory

### Script 1: [Title/Speaker]
Original Duration: ~[X] seconds

---

**Script 1 [00:00]** | HOOK | ~15s | Standalone: YES

"I was tired all the time. Like, not normal tired—exhausted. I went to three doctors. They all said I was fine."

---

**Script 1 [00:15]** | TENSION | ~12s | Standalone: YES

"But I knew something wasn't right. My body was telling me something was off and nobody would listen. I spent months wondering if I was making it up."

---

**Script 1 [00:27]** | DISCOVERY | ~18s | Standalone: YES

"Then I found Superpower. They test over 100 biomarkers—things my doctor never checked. My vitamin D was tanked, my inflammation markers were elevated. Finally, answers."

---
```

**Format Notes:**
- Use Script 1, Script 2, Script 3 (not letters) for clarity
- Include the **exact timestamp** from the source transcript (e.g., Script 1 [00:28])
- Write FULL verbatim text of each chunk
- Each chunk should be 2-4 sentences that flow naturally together
- Avoid single-sentence chunks—they create choppy edits
- In cut assembly, reference by Script + timestamp (e.g., "Script 1 [00:28] + Script 2 [00:55]")

---

## Step 3: Identify Rearrangement Opportunities

### Analyze Chunk Compatibility

For each chunk, determine:

1. **Which chunks can OPEN a cut?** (Strong hooks that work standalone)
2. **Which chunks can CLOSE a cut?** (Strong results or CTAs)
3. **Which chunks MUST stay together?** (Dependent pairs)
4. **Which chunks are INTERCHANGEABLE?** (Multiple tension beats, multiple results)

### Chunk Compatibility Matrix

Create a simple matrix showing which chunks work well together:

```markdown
## Chunk Compatibility Notes

**Strong Openers (can start any cut):**
- Script 1 [00:00]: "I was tired all the time..." (relatable hook)
- Script 1 [00:35]: "My doctor said I was fine..." (dismissal angle)
- Script 2 [00:12]: "I knew something was wrong..." (intuition angle)

**Strong Closers (can end any cut):**
- Script 1 [01:15]: "Now I have answers" (resolution)
- Script 1 [01:40]: "If you feel like something's off, trust yourself" (CTA)
- Script 2 [01:28]: "I finally feel like myself again" (transformation)

**Must Stay Together:**
- Script 1 [00:10] → Script 1 [00:18] (setup/payoff pair)
- Script 2 [00:30] → Script 2 [00:42] (discovery explanation)

**Interchangeable Tension Beats:**
- Script 1 [00:10], Script 1 [00:28], Script 2 [00:15] (all show medical dismissal - can swap)

**Interchangeable Results:**
- Script 1 [01:15], Script 1 [01:25], Script 2 [01:28] (all show transformation - can swap)
```

---

## Step 4: Generate Cut Variations

### Cut Generation Strategy

Generate multiple cuts based on:

1. **Duration variations** (60s → 45s → 30s → 15s)
2. **Angle variations** (same content, different hook/emphasis)
3. **Cross-script mashups** (if multiple scripts provided)

### Cut Types to Generate

**CRITICAL: Every cut must be a COMPLETE NARRATIVE with logical flow.**

A cut is NOT just "best quotes stitched together." It must follow a story arc:
- **HOOK** → Grabs attention, sets up the story
- **CONFLICT/TENSION** → Shows the struggle, builds stakes (DO NOT SKIP THIS)
- **BRIDGE** → How they found/chose the solution
- **DISCOVERY** → What they learned, the revelation
- **RESULT/CTA** → The transformation, call to action

**Minimum duration: 60 seconds.** Shorter cuts lose narrative coherence and feel like random soundbites.

| Cut Type | Description | Target Duration |
|----------|-------------|-----------------|
| **Full Cut** | Complete story arc, all beats present | 60-90s (ideally 75-90s) |
| **Alt Hook Cut** | Same story, different opening chunk | 60-90s (ideally 75-90s) |
| **Alt Angle Cut** | Different emphasis but COMPLETE arc | 60-90s (ideally 75-90s) |
| **Micro Cut** | ONLY for Stories - still needs mini-arc | 15-20s |

**IMPORTANT: Target 1-1.5 minutes (60-90 seconds) for all standard cuts.** Cuts under 60 seconds feel rushed and don't allow the emotional arc to land. The conflict/tension beat especially needs room to breathe—this is where relatability is built.

**Do NOT create cuts that:**
- Skip the conflict/tension (makes discovery feel unearned)
- Jump from hook straight to result (no story)
- Stitch random "good quotes" without narrative logic
- Are under 60 seconds (except micro cuts for Stories)

**If multiple scripts provided, also generate:**

| Cut Type | Description |
|----------|-------------|
| **Best-Of Mashup** | Strongest chunks from all scripts combined |
| **Hook Swap** | Script A body with Script B hook (if compatible) |
| **Parallel Stories** | Interweaving chunks from multiple speakers |

---

## Step 5: Create Editor Briefs

### Brief Format

For each cut variation, provide a detailed editor brief using the **4-column table format** with Source timestamps:

```markdown
---

## Cut [Number]: "[Descriptive Name]" (~[X]s)

**Source:** Script [1/2/Combined]
**Angle:** [What makes this cut distinct]

| Source | Function | Content | Duration |
| --- | --- | --- | --- |
| Script 1 [00:00] | HOOK | "I was tired all the time. Like, not normal tired—exhausted." | ~8s |
| Script 1 [00:18] | CONFLICT | "My doctor said everything was normal. But I knew something was off." | ~10s |
| Script 1 [00:35] | BRIDGE | "A friend told me about Superpower. I was skeptical at first." | ~6s |
| Script 1 [00:48] | DISCOVERY | "They test over 100 biomarkers—way more than my doctor ever did. Turns out my vitamin D was tanked." | ~12s |
| Script 1 [01:15] | RESULT | "Six weeks later, I actually have energy again." | ~6s |
| Script 1 [01:28] | CTA | "If you're exhausted and no one can tell you why—get the full picture." | ~5s |

### Editor Notes

- **Transition between [00:00]→[00:18]:** Natural cut, no transition needed
- **Transition between [00:18]→[00:35]:** Consider brief pause or text overlay
- **Potential B-roll moments:** During [00:48] (product shot opportunity)
- **Pacing note:** [00:18] delivery is slow - can speed up 10% if needed

### What This Cut Emphasizes

This cut focuses on the **medical dismissal angle** - "doctor said I'm fine but I knew something was wrong." It skips the detailed symptom list and goes straight to the transformation.

**Best for:** Problem-aware audiences who've experienced medical gaslighting

---
```

**CRITICAL: Always use the 4-column table format:**
- **Source** — Script number + timestamp (e.g., "Script 1 [00:28]" or "Script 1 [00:28] + Script 2 [00:55]" for combined)
- **Function** — HOOK, CONFLICT, BRIDGE, DISCOVERY, RESULT, CTA
- **Content** — Full verbatim text with *[B-roll suggestions]* if included
- **Duration** — Estimated duration for that section

---

## Step 6: Cross-Script Opportunities (If Multiple Scripts)

When the user provides multiple transcripts:

### Identify Cross-Script Synergies

1. **Common themes** - Do both scripts mention the same pain points?
2. **Complementary elements** - Does Script A have a better hook but Script B has better results?
3. **Contrast opportunities** - Can you create a "two people, same problem" cut?

### Cross-Script Cut Examples

**Hook Swap:**
- Use Script B's opening (stronger hook)
- Transition to Script A's story (more detailed)
- Close with Script A's result

**Best-Of Compilation:**
- A1 (hook) → B3 (tension) → A5 (discovery) → B7 (result)
- Combine strongest moments from each

**Parallel Stories:**
- Interweave A and B to show "multiple people, same experience"
- A1 → B1 → A3 → B3 → shared conclusion

---

## Step 7: Timing Estimation

### Duration Calculation

Use these rough estimates for timing:

- **Natural speech:** ~150 words/minute (~2.5 words/second)
- **Slow/emotional delivery:** ~120 words/minute (~2 words/second)
- **Fast/energetic delivery:** ~180 words/minute (~3 words/second)

### Formula

```
Chunk duration (seconds) = Word count / 2.5
```

Adjust based on:
- Noted pauses in transcript
- Emotional beats (people slow down for emphasis)
- Technical content (often delivered more slowly)

---

## Output Template

### Full Output Structure

```markdown
# Editor Briefing: [Project/Campaign Name]

**Input:** [X] script(s) provided
**Generated:** [Date]
**Total source duration:** ~[X] minutes

---

## Chunk Inventory

### Script 1: [Title/Speaker]
Original Duration: ~[X] seconds

| Source | Function | Content | Duration | Standalone |
|--------|----------|---------|----------|------------|
| Script 1 [00:00] | Hook | "Full verbatim text..." | ~Xs | YES/NO |
| Script 1 [00:15] | Tension | "Full verbatim text..." | ~Xs | YES/NO |
| ... | ... | ... | ... | ... |

### Script 2: [Title/Speaker] (if applicable)
[Same format with Script 2 timestamps]

---

## Chunk Compatibility Notes

**Strong Openers:** [List with Script + timestamp]
**Strong Closers:** [List with Script + timestamp]
**Must Stay Together:** [List pairs with timestamps]
**Interchangeable:** [List groups with timestamps]

---

## Generated Cuts

### Cut 1: "[Name]" (~Xs)
[4-column table format with Source timestamps]

### Cut 2: "[Name]" (~Xs)
[4-column table format]

### Cut 3: "[Name]" (~Xs)
[4-column table format]

[Continue for all cuts...]

---

## Cross-Script Opportunities (if multiple scripts)

[Mashup cuts using timestamps from multiple scripts]

---

## Summary

**Total cuts generated:** [X]

| Cut | Duration | Angle | Best For |
|-----|----------|-------|----------|
| Cut 1: [Name] | ~75s | Medical dismissal | Problem-aware |
| Cut 2: [Name] | ~70s | Full story | Brand awareness |
| ... | ... | ... | ... |

**Recommended priority cuts:**
1. **[Cut Name]** - [Why this is the strongest]
2. **[Cut Name]** - [Why this is worth testing]

**Unused chunks worth noting:**
- Script 1 [00:45]: "[Content]" - [Why it didn't fit but might be useful for statics/other]
```

---

## Important Rules

### The Cardinal Rule: No New Content

**You CANNOT:**
- Add dialogue that wasn't in the original transcript
- Write new transitions or voiceover
- Create content that doesn't exist in the source footage
- Suggest the editor "record additional footage"

**You CAN:**
- Suggest text overlays (these are graphics, not dialogue)
- Recommend music/pacing changes
- Note where B-roll could cover transitions
- Suggest speeding up or slowing down existing footage

### Preserving Authenticity

When rearranging chunks:
- Don't create false narratives by juxtaposing unrelated statements
- Don't make someone appear to say something they didn't mean
- Preserve the speaker's intent even when condensing
- Flag if a rearrangement might misrepresent the speaker

### Verbatim Accuracy

All chunk content must be **verbatim** from the transcript:
- Keep filler words ("like", "you know", "um")
- Preserve grammar (even if imperfect)
- Note any unclear audio with [inaudible] or [?]
- Use [...] only where audio was genuinely cut/missing

---

## Edge Cases

### Very Short Transcripts (<30 seconds)

If transcript is already very short:
- Focus on identifying the strongest 15s and hook moments
- Suggest alt hook variations (different opening line)
- Note what additional footage would be needed for longer cuts (but don't write it)

### Very Long Transcripts (>3 minutes)

If transcript is very long:
- Focus on the 3-5 strongest cuts rather than exhaustive variations
- Identify the "golden nuggets" - the 5-10 most quotable chunks
- Create a "best moments" compilation cut

### Multiple Speakers in One Transcript

If transcript has multiple speakers:
- Assign chunk IDs by speaker (Speaker1-A1, Speaker2-B1)
- Note which speaker each chunk belongs to
- Create both single-speaker and multi-speaker cuts

### Poor Quality Transcript

If transcript has issues:
- Flag unclear sections
- Note where meaning is ambiguous
- Recommend clarification before editing if meaning could be misinterpreted

---

## Integration with Other Skills

This skill works well after:
- **`testimonial-extraction`** → Extract versions first, then create editor briefs for chosen version
- **`video-script-writing`** → Write script, shoot it, then use this skill for cut variations

This skill is typically followed by:
- **`compliance-check`** → Review final cuts for health claims compliance
- Handoff to video editor for actual assembly

---

## Example Input/Output (Single Script)

### Example Input

**IMPORTANT: Scripts must include timestamps.**

```
User: Here's a transcript from our testimonial shoot. Can you create an editor's brief with different cut options?

Script 1:
[00:00] I'm Maria, I'm 44, and I've been dealing with fatigue for years.
[00:06] Like, bone-deep exhaustion. Not just tired - exhausted.
[00:11] I went to my doctor multiple times. She ran the basic panel.
[00:16] Everything came back "normal." That was always the answer.
[00:21] But I knew something wasn't right. My body was telling me.
[00:26] A friend told me about Superpower. I was skeptical at first.
[00:31] But they test over 100 biomarkers. Way more than my doctor ever did.
[00:38] Turns out my ferritin was at 12. Technically "in range" but way too low.
[00:45] My vitamin D was also tanked. No wonder I had no energy.
[00:50] They gave me a personalized protocol. Exactly what to take and when.
[00:56] Six weeks later, I actually have energy again. I feel like myself.
[01:02] If you're exhausted and no one can tell you why - this is what I'd do.
```

### Example Output

```markdown
# Editor Briefing: Maria Testimonial

**Input:** 1 script provided
**Generated:** January 2026
**Total source duration:** ~72 seconds

---

## Chunk Inventory

### Script 1: Maria (44, fatigue testimonial)

| Source | Function | Content | Duration |
|--------|----------|---------|----------|
| Script 1 [00:00] | CONTEXT | "I'm Maria, I'm 44, and I've been dealing with fatigue for years." | ~6s |
| Script 1 [00:06] | HOOK | "Like, bone-deep exhaustion. Not just tired - exhausted." | ~5s |
| Script 1 [00:11] | CONFLICT | "I went to my doctor multiple times. She ran the basic panel. Everything came back 'normal.' That was always the answer. But I knew something wasn't right. My body was telling me." | ~15s |
| Script 1 [00:26] | BRIDGE | "A friend told me about Superpower. I was skeptical at first." | ~5s |
| Script 1 [00:31] | DISCOVERY | "But they test over 100 biomarkers. Way more than my doctor ever did. Turns out my ferritin was at 12. Technically 'in range' but way too low. My vitamin D was also tanked. No wonder I had no energy." | ~19s |
| Script 1 [00:50] | RESULT | "They gave me a personalized protocol. Exactly what to take and when. Six weeks later, I actually have energy again. I feel like myself." | ~12s |
| Script 1 [01:02] | CTA | "If you're exhausted and no one can tell you why - this is what I'd do." | ~6s |

---

## Generated Cuts

### Cut 1: "Full Narrative" (~64s)

**Angle:** Complete transformation story
**Source:** Script 1 only

| Source | Function | Content | Duration |
| --- | --- | --- | --- |
| Script 1 [00:06] | HOOK | "Like, bone-deep exhaustion. Not just tired - exhausted." | ~5s |
| Script 1 [00:11] | CONFLICT | "I went to my doctor multiple times. She ran the basic panel. Everything came back 'normal.' That was always the answer. But I knew something wasn't right. My body was telling me." | ~15s |
| Script 1 [00:26] | BRIDGE | "A friend told me about Superpower. I was skeptical at first." | ~5s |
| Script 1 [00:31] | DISCOVERY | "But they test over 100 biomarkers. Way more than my doctor ever did. Turns out my ferritin was at 12. Technically 'in range' but way too low. My vitamin D was also tanked. No wonder I had no energy." | ~19s |
| Script 1 [00:50] | RESULT | "They gave me a personalized protocol. Exactly what to take and when. Six weeks later, I actually have energy again. I feel like myself." | ~12s |
| Script 1 [01:02] | CTA | "If you're exhausted and no one can tell you why - this is what I'd do." | ~6s |

**Editor Notes:**
- Dropped [00:00] (name/age intro) - [00:06] is stronger visceral opening
- Natural flow, all beats present
- B-roll opportunities: during [00:31] show biomarker screens, during [00:50] show action plan

---

### Cut 2: "Intuition Angle" (~68s)

**Angle:** Lead with "I knew something was wrong" instead of symptoms
**Source:** Script 1 only (reordered)

| Source | Function | Content | Duration |
| --- | --- | --- | --- |
| Script 1 [00:21] | HOOK | "But I knew something wasn't right. My body was telling me." | ~5s |
| Script 1 [00:11] + Script 1 [00:06] | CONFLICT | "I went to my doctor multiple times. She ran the basic panel. Everything came back 'normal.' That was always the answer. Like, bone-deep exhaustion. Not just tired - exhausted." | ~15s |
| Script 1 [00:26] | BRIDGE | "A friend told me about Superpower. I was skeptical at first." | ~5s |
| Script 1 [00:31] | DISCOVERY | "But they test over 100 biomarkers. Way more than my doctor ever did. Turns out my ferritin was at 12. Technically 'in range' but way too low. My vitamin D was also tanked. No wonder I had no energy." | ~19s |
| Script 1 [00:50] | RESULT | "They gave me a personalized protocol. Exactly what to take and when. Six weeks later, I actually have energy again. I feel like myself." | ~12s |
| Script 1 [01:02] | CTA | "If you're exhausted and no one can tell you why - this is what I'd do." | ~6s |

**Why This Works:** Opens with self-trust/intuition angle instead of symptoms. Tests whether "trust your body" resonates more than "bone-deep exhaustion."

---

### Cut 3: "Micro Cut" (~18s) — Stories Only

**Angle:** Scroll-stopping hook for Stories/Reels
**Source:** Script 1 (condensed)

| Source | Function | Content | Duration |
| --- | --- | --- | --- |
| Script 1 [00:06] | HOOK | "Like, bone-deep exhaustion. Not just tired - exhausted." | ~5s |
| Script 1 [00:11] | CONFLICT | "I went to my doctor. Everything came back 'normal.'" | ~6s |
| Script 1 [00:56] | RESULT | "Six weeks later, I actually have energy again." | ~5s |

**Editor Notes:**
- ONLY for Stories placement - not a standard cut
- Add text overlay CTA at end
- This is a teaser, not a complete story

---

## Summary

| Cut | Duration | Angle | Best For |
|-----|----------|-------|----------|
| Cut 1: Full Narrative | ~64s | Complete narrative | Baseline, warm traffic |
| Cut 2: Intuition Angle | ~68s | Intuition/self-trust | A/B test vs Cut 1 |
| Cut 3: Micro Cut | ~18s | Micro teaser | Stories ONLY |

**Recommended Priority:**
1. **Cut 1** — Baseline complete narrative, strongest emotional arc
2. **Cut 2** — Test different hook angle
```

---

## Multi-Script Example: Cross-Script Mashups (Preferred Output Format)

When multiple scripts are provided, generate **cross-script mashup cuts** that combine chunks from different scripts to create meaningfully different narratives. This is the preferred output format.

**Key Principle:** Cuts that simply trim a single script are NOT acceptable as new cuts. True variations must either:
1. Be complete single-script narratives used as baseline versions
2. Combine chunks from DIFFERENT scripts (mashups)
3. Present a meaningfully different angle or narrative structure

### Output Format: 4-Column Table with Timestamps

Use this table format for all cuts:

| Source | Function | Content | Duration |
| --- | --- | --- | --- |
| Script 1 [00:00] | HOOK | "Full verbatim text of the chunk goes here. Include 2-4 sentences exactly as spoken." | ~Xs |
| Script 1 [00:15] | CONFLICT | "The struggle, tension, or problem being faced..." | ~Xs |
| Script 2 [00:28] | BRIDGE | "How they found the solution..." | ~Xs |
| Script 1 [00:45] | DISCOVERY | "What they learned, the revelation..." | ~Xs |
| Script 2 [01:15] | RESULT | "The transformation or outcome..." | ~Xs |
| Script 1 [01:40] | CTA | "Call to action..." | ~Xs |

**For combined sources:** Use `Script 1 [00:28] + Script 2 [00:55]` format when a section pulls from multiple timestamps.

### Example Multi-Script Output

Given 3 scripts from different testimonials, here's how to structure the output:

---

### Cuts 1-3: Complete Single-Script Baselines

First, create baseline cuts that use each script's complete narrative. These serve as the foundation.

#### Cut 1: "Script 1 Full Narrative" (~75s)

**Angle:** Medical dismissal → comprehensive testing → answers
**Source:** Script 1 only

| Source | Function | Content | Duration |
| --- | --- | --- | --- |
| Script 1 [00:00] | HOOK | "I was tired all the time. Like, not normal tired—exhausted. I felt like I was dragging myself through every day." | ~12s |
| Script 1 [00:12] | CONFLICT | "I went to three different doctors. They ran basic tests—CBC, thyroid. Everything came back 'normal.' They told me I was just stressed, maybe depressed. But I knew something was wrong." | ~18s |
| Script 1 [00:30] | BRIDGE | "My sister told me about Superpower. At first I thought it was one of those wellness fads, but she showed me her results and I was curious." | ~12s |
| Script 1 [00:42] | DISCOVERY | "They test over 100 biomarkers—way more than my doctor ever did. Turns out my vitamin D was at 18, my ferritin was borderline low, and my inflammation markers were elevated. No wonder I was exhausted." | ~18s |
| Script 1 [01:00] | RESULT | "They created a personalized protocol for me. Within six weeks, I started feeling like myself again. I actually have energy to play with my kids after work." | ~12s |
| Script 1 [01:12] | CTA | "If you're tired and no one can tell you why, get your biomarkers tested. Don't just accept 'you're fine.'" | ~8s |

---

### Cuts 4-7: Cross-Script Mashups (Required for Variation)

These cuts combine chunks from different scripts to create genuinely new narratives.

#### Cut 4: "Fatigue Journey Remix" (~68s)

**Angle:** Multiple doctors + discovery revelation from different speaker
**Source:** Scripts 1 + 2 combined

| Source | Function | Content | Duration |
| --- | --- | --- | --- |
| Script 1 [00:00] | HOOK | "I was tired all the time. Like, not normal tired—exhausted. I felt like I was dragging myself through every day." | ~12s |
| Script 2 [00:15] | CONFLICT | "Blood tests, thyroid panels, sleep studies—I did everything. Five years of doctors telling me 'your labs look fine, maybe try getting more rest.' I was so frustrated." | ~15s |
| Script 1 [00:30] | BRIDGE | "My sister told me about Superpower. At first I thought it was one of those wellness fads, but she showed me her results and I was curious." | ~12s |
| Script 2 [00:48] | DISCOVERY | "The level of detail was incredible. They found my B12 was tanked, my cortisol was all over the place, and I had markers showing chronic inflammation. Five years of 'you're fine' and this one test found three things wrong." | ~18s |
| Script 1 [01:00] | RESULT | "They created a personalized protocol for me. Within six weeks, I started feeling like myself again. I actually have energy to play with my kids after work." | ~12s |
| Script 2 [01:20] | CTA | "Don't waste years like I did. Get the full picture." | ~6s |

**Why This Works:** Combines Script 1's relatable hook with Script 2's more dramatic conflict, then returns to Script 1 for resolution. Creates a different emotional journey than either standalone script.

---

#### Cut 5: "Doctor Frustration Angle" (~72s)

**Angle:** Medical gaslighting from multiple perspectives
**Source:** Scripts 1 + 3 combined

| Source | Function | Content | Duration |
| --- | --- | --- | --- |
| Script 3 [00:00] | HOOK | "My doctor told me my fatigue was 'just part of getting older.' I was 34." | ~8s |
| Script 1 [00:12] | CONFLICT | "I went to three different doctors. They ran basic tests—CBC, thyroid. Everything came back 'normal.' They told me I was just stressed, maybe depressed. But I knew something was wrong." | ~18s |
| Script 3 [00:22] | BRIDGE | "A friend kept telling me about this company that does comprehensive blood testing. I figured at this point, what did I have to lose?" | ~10s |
| Script 1 [00:42] | DISCOVERY | "They test over 100 biomarkers—way more than my doctor ever did. Turns out my vitamin D was at 18, my ferritin was borderline low, and my inflammation markers were elevated. No wonder I was exhausted." | ~18s |
| Script 3 [01:05] | RESULT | "Three months later, I ran my first 5K. I went from barely making it through the day to training for a race. That's what happens when you actually know what's wrong." | ~15s |
| Script 1 [01:12] | CTA | "If you're tired and no one can tell you why, get your biomarkers tested. Don't just accept 'you're fine.'" | ~8s |

**Why This Works:** Uses Script 3's more impactful hook (age dismissal at 34) with Script 1's detailed conflict, then closes with Script 3's dramatic transformation (running 5K).

---

#### Cut 6: "Best Moments Compilation" (~70s)

**Angle:** Strongest hook + strongest conflict + strongest result
**Source:** Scripts 1 + 2 + 3 combined

| Source | Function | Content | Duration |
| --- | --- | --- | --- |
| Script 3 [00:00] | HOOK | "My doctor told me my fatigue was 'just part of getting older.' I was 34." | ~8s |
| Script 2 [00:15] | CONFLICT | "Blood tests, thyroid panels, sleep studies—I did everything. Five years of doctors telling me 'your labs look fine, maybe try getting more rest.' I was so frustrated." | ~15s |
| Script 1 [00:30] | BRIDGE | "My sister told me about Superpower. At first I thought it was one of those wellness fads, but she showed me her results and I was curious." | ~12s |
| Script 2 [00:48] | DISCOVERY | "The level of detail was incredible. They found my B12 was tanked, my cortisol was all over the place, and I had markers showing chronic inflammation. Five years of 'you're fine' and this one test found three things wrong." | ~18s |
| Script 3 [01:05] | RESULT | "Three months later, I ran my first 5K. I went from barely making it through the day to training for a race. That's what happens when you actually know what's wrong." | ~15s |
| Script 2 [01:20] | CTA | "Don't waste years like I did. Get the full picture." | ~6s |

**Why This Works:** Cherry-picks the most impactful moment from each script. Hook from Script 3 (age dismissal), conflict from Script 2 (five years), discovery from Script 2 (three issues found), result from Script 3 (5K transformation).

---

#### Cut 7: "Energy Parent Angle" (~65s)

**Angle:** Parenting energy focus
**Source:** Scripts 1 + 2 combined

| Source | Function | Content | Duration |
| --- | --- | --- | --- |
| Script 2 [00:00] | HOOK | "I used to crash on the couch the moment I got home from work. My kids would ask me to play and I just... couldn't." | ~10s |
| Script 1 [00:12] | CONFLICT | "I went to three different doctors. They ran basic tests—CBC, thyroid. Everything came back 'normal.' They told me I was just stressed, maybe depressed. But I knew something was wrong." | ~18s |
| Script 2 [00:30] | BRIDGE | "A coworker told me she'd done this comprehensive biomarker test and it changed everything for her. I decided to try it." | ~10s |
| Script 1 [00:42] | DISCOVERY | "They test over 100 biomarkers—way more than my doctor ever did. Turns out my vitamin D was at 18, my ferritin was borderline low, and my inflammation markers were elevated. No wonder I was exhausted." | ~18s |
| Script 1 [01:00] | RESULT | "They created a personalized protocol for me. Within six weeks, I started feeling like myself again. I actually have energy to play with my kids after work." | ~12s |
| Script 2 [01:25] | CTA | "Your kids deserve a parent with energy. Get tested." | ~5s |

**Why This Works:** Opens with Script 2's parenting-focused hook, uses Script 1's thorough conflict and discovery, returns to Script 1's parenting result ("play with kids"), closes with parenting-specific CTA.

---

### Summary Table

| Cut | Duration | Angle | Source Scripts | Best For |
|-----|----------|-------|----------------|----------|
| Cut 1 | ~75s | Medical dismissal → answers | Script 1 only | Baseline, warm traffic |
| Cut 2 | ~70s | Five-year journey | Script 2 only | Baseline, retargeting |
| Cut 3 | ~65s | Age dismissal → 5K | Script 3 only | Baseline, fitness audience |
| Cut 4 | ~68s | Fatigue journey remix | Scripts 1+2 | A/B test vs Cut 1 |
| Cut 5 | ~72s | Doctor frustration multi-voice | Scripts 1+3 | Problem-aware audience |
| Cut 6 | ~70s | Best moments compilation | Scripts 1+2+3 | Top performer candidate |
| Cut 7 | ~65s | Parenting energy | Scripts 1+2 | Parent demographic |

**Recommended Priority:**
1. **Cut 6** — Best-of compilation has highest potential impact
2. **Cut 5** — Strong age-dismissal hook tests well with 30-40 demo
3. **Cut 7** — Parent angle for family-focused targeting

---

## When to Use This Skill

**Invoke this skill when:**
- User provides transcribed video script(s) asking for "editor's brief"
- User wants to create multiple cuts from existing footage
- User asks to "rearrange" or "condense" a video script
- User has shot footage and needs variations for different placements

**Don't use this skill when:**
- User wants to write NEW video scripts (use `video-script-writing` instead)
- User wants to extract angles from testimonials BEFORE briefing (use `testimonial-extraction` first)
- User needs compliance review of existing cuts (use `compliance-check` instead)
- User hasn't shot the footage yet (this skill only works with existing content)

---

## Quality Checklist

Before delivering editor briefs, verify:

**Chunk Inventory:**
- [ ] All lines from transcript assigned to chunks
- [ ] Line numbers accurate and verifiable
- [ ] Functions correctly identified (Hook, Tension, etc.)
- [ ] Standalone status accurately assessed
- [ ] Duration estimates reasonable

**Cut Variations:**
- [ ] Multiple durations offered (60s, 30s, 15s)
- [ ] At least one alt hook/angle variation
- [ ] Each cut has clear differentiation
- [ ] Assembly sequences are complete
- [ ] No new content invented

**Editor Usability:**
- [ ] Clear assembly order
- [ ] Transition notes provided
- [ ] B-roll opportunities noted
- [ ] Pacing suggestions included
- [ ] Summary table for quick reference

**Compliance:**
- [ ] All content verbatim from source
- [ ] No misrepresentation through rearrangement
- [ ] Speaker intent preserved
- [ ] Flagged any concerning juxtapositions

---

## Post-Delivery: B-Roll Prompt

**After delivering editor briefs, ALWAYS ask the user:**

> "Would you like me to add B-roll suggestions to these cuts? I can insert inline B-roll recommendations in *[italics and brackets]* throughout each script."

If user says yes:
1. Use the `broll-briefing` skill to add B-roll inline
2. Insert B-roll in format: `*[description B-roll]*` immediately after matching text
3. Use `*[STAY ON SPEAKER]*` for emotional beats
4. Re-output the cuts with B-roll included

---

## Auto-Save to Notion

**After completing editor briefs (with or without B-roll), ALWAYS save to Notion automatically.**

### Save Format

Create a new Notion page with:
- **Title:** `[Project/Topic] Editor Briefs - [X] Cuts`
- **Content:** All cuts in 4-column table format with Source timestamps

### Table Structure (REQUIRED FORMAT)

Each cut MUST use this 4-column table format with timestamps:

```markdown
# Cut 1: "The 30-Pound Secret" (~75s)

**Source:** Script 2 (Hook, Conflict, CTA) + Script 1 (Bridge, Discovery)

| Source | Function | Content | Duration |
| --- | --- | --- | --- |
| Script 2 [00:00] | HOOK | "I lost 30 pounds *[before/after transformation B-roll]* and I'm going to tell you—it wasn't about eating less." | ~10s |
| Script 2 [00:12] | CONFLICT | "I was doing everything right. Salads *[healthy meal prep B-roll]*, workouts *[woman at gym B-roll]*, cutting carbs." | ~15s |
| Script 1 [00:28] + Script 1 [00:43] | BRIDGE | "Here's what I wish I knew sooner: your hormones are so crucial to weight loss *[hormone visualization B-roll]*." | ~18s |
| Script 1 [01:19] + Script 2 [01:28] | DISCOVERY | "That's why I tell everyone about Superpower *[Superpower logo B-roll]*. They test over 100 biomarkers." | ~18s |
| Script 2 [01:24] + Script 1 [01:40] | CTA | "It wasn't a willpower issue—it was an information issue. *[STAY ON SPEAKER]*" | ~7s |
```

**Column Requirements:**
- **Source** — Script number + timestamp (e.g., `Script 1 [00:28]` or `Script 1 [00:28] + Script 2 [00:55]` for combined)
- **Function** — HOOK, CONFLICT, BRIDGE, DISCOVERY, RESULT, CTA
- **Content** — Full verbatim text with `*[B-roll suggestions]*` if included
- **Duration** — Estimated duration for that section

### After Saving

Provide the Notion URL to the user:
> "Saved to Notion: [URL]"

---

Remember: Your job is to maximize the value of existing footage by identifying the best ways to cut and arrange it. You are a strategic advisor to the video editor, not a scriptwriter. Work only with what exists.
