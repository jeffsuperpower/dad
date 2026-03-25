---
name: testimonial-extraction-paid-video
description: Extract 3-8 unique video ad versions from customer testimonials (based on transcript strength), with verbatim quotes, line number references, and story structure mapping (Hook/Conflict/Bridge/Discovery/Result). Use when processing testimonial transcripts for paid video ad concepts.
version: 3.0.0
---

# Testimonial Extraction for Paid Social Ads

## Overview

Transform raw testimonial transcripts into high-performing paid video ad scripts optimized for 30-45 second testimonial ads.

**What This Skill Outputs:**
- 3-8 unique video ad versions (based on transcript strength)
- Scripts that are **80% production-ready** (minimal editing needed)
- Verbatim quotes mapped to story beats (Hook/Conflict/Bridge/Discovery/Result)
- Line number references for every quote
- Archetype classification for each version

**Core Principle:** Testimonials are about **transformation**. Every script must show a clear "before" state, a clear "after" state, emotional contrast, and stakes that feel real.

If a member says "This changed my life," "I was scared," "My doctor missed this," "I caught this early" — that language stays. Shock, relief, urgency, fear — these are shaped, not avoided.

**Note:** Static ad quotes are handled by the separate `testimonial-extraction-paid-static` skill.

---

## Extraction Process

### Step 1: Parse Transcript

Accept the testimonial transcript from the user. Before processing:

1. **Strip blank lines** for accurate line numbering
2. **Assign line numbers** to each line of content
3. **Preserve original wording** exactly as provided

**Critical:** Line numbers must be accurate. Editors use them to find and verify quotes.

#### Optional: User Notes

The user may provide notes alongside the transcript. These are **soft guidance**, not strict rules — use them to influence angle priority and version ordering. If notes conflict with what's in the transcript, go with the transcript.

---

### Step 2: Identify the Narrative Foundation

**Every extraction must be anchored to the member's own telling of their health journey.**

Reference `${CLAUDE_PLUGIN_ROOT}/knowledge/testimonial-baseline-story.md` for full guidance on identifying and using the baseline story.

**Identify the Transformation Arc:**

| Phase | What to Look For |
|-------|------------------|
| **BEFORE** | Symptoms, assumptions, frustration, false reassurance, "Everything looked normal" |
| **DISCOVERY** | Surprising lab result, missed biomarker, deeper insight, moment of realization |
| **AFTER** | Action taken, symptoms improved, risk addressed, peace of mind |

**Also identify:**
- **Stakes** — What was at risk? (disease progression, fertility, quality of life, cognitive performance, cardiovascular risk, cancer risk, years of misdiagnosis, etc.)
- **Primary pain point** — What drove them to seek a solution?
- **Emotional journey** — Map the arc: Frustration → Discovery → Relief/Empowerment
- **Memorable quotes** — Lines that create emotional impact, with line numbers

---

### Step 3: Map to Steven Reiss Desires

Reference `${CLAUDE_PLUGIN_ROOT}/steven-reiss-16-desires.md` to identify which fundamental human desires are revealed in the testimonial.

**Common desires in health testimonials:**
- **Tranquility** — avoiding uncertainty, peace of mind
- **Acceptance** — validation, being believed by medical authority
- **Power** — control over health, empowerment through data
- **Curiosity** — understanding body, solving mystery
- **Independence** — self-advocacy, not relying solely on doctors
- **Family** — protecting loved ones, avoiding inherited conditions

Each version should target a different primary desire to ensure versions feel meaningfully different.

---

### Step 4: Select Story Archetype

**Choose the archetype that best fits each version.** Not every testimonial should follow the same emotional intensity.

#### Archetype A: The Shock Reveal
**Best for:** Major biomarker discoveries, autoimmune detection, pre-diabetes, severe inflammation, hormone crashes
**Flow:** Calm beginning → Unexpected result → Emotional reaction → What it meant → What changed → Where they are now

#### Archetype B: The System Missed It
**Best for:** Repeated dismissals, "You're fine" narratives, long-term symptoms, frustration with traditional care
**Flow:** Ongoing issue → Doctor dismissal → Continued decline → Deeper testing → Validation → Action taken

#### Archetype C: The High Performer Wake-Up Call
**Best for:** Founders, athletes, optimizers, bio-curious individuals
**Flow:** "I thought I was healthy" → Baseline testing → Surprising insight → Reframed understanding → Specific changes → Elevated performance

#### Archetype D: The Before-and-After Transformation
**Best for:** Symptom resolution, energy shifts, weight changes, mental clarity, hormone restoration
**Flow:** Concrete before state → Specific lab finding → Intervention → Measurable change → Emotional shift

#### Archetype E: The Early Catch
**Best for:** Hashimoto's, cardiovascular risk, elevated A1C, cancer screening adjacent
**Flow:** "I had no symptoms" → Something showed up → What it could have become → Why catching it early matters → Relief

---

### Step 5: Generate Unique Versions (3-8)

Extract versions based on what the transcript actually supports:

- **Target range:** 3-8 versions
- **Stop when:** Angles feel forced, quality drops, or you're reusing the same quotes
- **Quality over quantity:** Every version must have a distinct angle and pass the review gate

**Each version needs:**
- Distinct angle (different entry point into the story)
- Different primary desire target
- Unique narrative arc

**High-Performing Angles to Look For:**

1. **Doctor Dismissal / "You're Fine" Moments** — Frustration with healthcare system → Finding answers
2. **Unexpected Discoveries** — "I had no idea this was happening inside my body"
3. **Family History / Fear of Inherited Conditions** — Fear of genetic destiny → Data empowerment
4. **Specific Health Conditions** — Named condition creates relatability
5. **"I Knew Something Was Wrong" Validation** — Body's signals were real, not imagined
6. **Cost/Value Comparison** — "I spent $X on specialists. This showed me more."
7. **Before/After Transformation** — Specific life change (energy, weight, mood, performance)
8. **Healthcare System Critique** — "They wait until you're sick. I'm not waiting."
9. **Proactive Health / Taking Control** — "I'm not guessing anymore. I'm knowing."
10. **Life Stage Motivation** — Wedding, kids, career — external motivator creates urgency

---

### Step 6: Extract Story Beat Quotes

For each version, extract verbatim quotes mapped to story beats using this structure:

#### Version Name
Short, memorable title (e.g., "The Leukemia Scare", "The Doctors Dismissed Me")

#### Title Hook (2 Options)
6-7 word open-loop statements that create curiosity. These are **editorial captions** (not quotes) for text overlays.

**Good** (create tension): "I thought I was healthy." / "My labs were 'normal.' I wasn't." / "My doctor never tested this."
**Bad** (too closed): "I found out I had thyroid issues." / "Superpower helped me get healthy."

#### Hook Quote
Opening quote that grabs attention (verbatim, with line number).

**🚨 Standalone Hook Test:** Read the hook as if you've NEVER heard of Superpower.
1. Does this make sense without any context?
2. Would a random person scrolling understand this?

**Bad** (require context): "My biological age was 32" / "I got my results back and saw 47 biomarkers flagged"
**Good** (standalone): "I was tired all the time and no one could tell me why" / "My doctor said I was fine. I knew I wasn't."

#### Conflict Quote
Quote showing the problem, frustration, or pain point. Look for specific struggle, emotional intensity, and clear stakes.

#### Bridge Quote *(MANDATORY)*
How they found or chose Superpower. Without a bridge, the narrative jumps incoherently from Conflict → Discovery.

If the transcript doesn't have explicit discovery language, look for "so I decided...", "that's when I...", "I was looking for..." — any quote about taking action.

#### Discovery Quote
What Superpower revealed or how it helped.

**🚨 Discovery Context Test:** The quote must make sense on its own.

**Bad** (no context): "7% optimal rate and just 25 to 35" / "And then vitamin D was also low"
**Good** (self-contained): "My iron was at 7% optimal. Critically low." / "They found my iron stores were basically depleted."

If the transcript only has context-dependent quotes, stitch with setup language and flag: "Lines X, Y, stitched for context"

#### Result Quote
The transformation, outcome, or feeling. Must show **specific change**, not vague emotion.

**Bad** (vague): "I feel confident now" / "I feel reassured" / "I have peace of mind"
**Good** (specific): "I don't feel like I got hit by a bus in the morning" / "My energy is back. The fog lifted."

If only vague results exist, use them but flag: "Note: Stronger result quote needed"

**Quote format:**
```
> "[Exact quote from transcript]"
*(Line X)*
```

---

### Step 7: Verify and Deliver

Before delivering, complete ALL of these checks:

#### A. Quote Accuracy
- ✅ Every quote exists verbatim — no paraphrasing, no "fixing" grammar
- ✅ Line numbers are correct
- ✅ Stitched quotes are flagged: "Lines X, Y, stitched"
- ✅ Filler words preserved — editors cut in post-production
- ✅ Superpower is properly mentioned where the member said it

#### B. Viewer Perspective Check
Read each version (Hook → Conflict → Bridge → Discovery → Result) as a random person scrolling Meta who has **never heard of Superpower** and knows nothing about biomarkers or preventive health testing.

For each version ask:
1. Does the hook work standalone?
2. Does the narrative flow logically without jumps?
3. Is there a bridge explaining why they tried Superpower?
4. Are results specific, not just vague emotions?
5. Are all pronouns ("it", "that", "this") clear without prior context?

**If any version fails, revise before delivering.**

#### C. Pre-Delivery Review Gate *(MANDATORY — include in output)*

| Version | Hook Standalone? | Bridge Present? | Result Specific? | Narrative Flows? |
|---------|------------------|-----------------|------------------|------------------|
| V1: [name] | YES/NO | YES/NO | YES/NO | YES/NO |
| V2: [name] | YES/NO | YES/NO | YES/NO | YES/NO |
| V3: [name] | YES/NO | YES/NO | YES/NO | YES/NO |

All answers must be YES before delivery. If any were revised, document what changed.

---

## Output Template

```markdown
## [PERSON NAME or "Anonymous Member"] — [# of Versions] Versions

**Demographics:** [Age, profession, location, family status if mentioned]

---

### Version 1: [Version Name]

**Archetype:** [A/B/C/D/E]

**Stakes:** [What was at risk? 1-2 sentences]

**Title Hook:**
> [Option 1]
> [Option 2]

**Hook:**
> "[Exact quote]"
*(Line X)*

**Conflict:**
> "[Exact quote]"
*(Line X)*

**Bridge:**
> "[Exact quote]"
*(Line X)*

**Discovery:**
> "[Exact quote]"
*(Line X)*

**Result:**
> "[Exact quote]"
*(Line X)*

---

[Repeat for all versions...]

---

## Pre-Delivery Review

| Version | Hook Standalone? | Bridge Present? | Result Specific? | Narrative Flows? |
|---------|------------------|-----------------|------------------|------------------|
| V1: [name] | YES/NO | YES/NO | YES/NO | YES/NO |

**If any NO above, what was revised:**
- [Version X]: [What was wrong] → [How it was fixed]

---

## Summary

**Notable quotes that didn't fit:**
- "[Quote]" *(Line X)* — [Why it's good but didn't fit]

**Red flags or accuracy concerns:** [Any issues, or "None."]
```

---

## Compliance Requirements

Reference `${CLAUDE_PLUGIN_ROOT}/compliance-guide.md` for full compliance guidance.

| Rule | Why |
|------|-----|
| Quote verbatim with line numbers | Enables verification and editor traceability |
| Use [...] or [edited for clarity] if editing | FTC requires authentic attribution |
| Mark stitched quotes clearly | "Lines X, Y, stitched" |
| Preserve filler words | Editors cut in post; don't pre-edit |
| Default to anonymous | Unless written consent confirmed |
| Flag customer names | "Verify written consent before using in ads" |

---

## Integration with Video Script Writing

After extraction, the selected version gets passed to `video-script-writing` with:
1. Version name and angle
2. Story beat quotes with line numbers
3. Primary desire identified
4. Emotional arc structure
5. Demographic context

**Workflow:**
```
Testimonial Transcript → Extraction Skill (this) → User Selects Version → Video Script Skill → Compliance Check
```

---

## Edge Cases

### Transcript Too Short (<100 words)
Extract as many versions as the content supports (may be only 2-3). Flag: "Transcript was short, limiting distinct angles."

### Weak Testimonial (No Clear Quotes)
Flag: "This testimonial lacks strong quotes. Recommend requesting more detailed interview." Don't force extraction.

### Rich Testimonial (3+ Distinct Pain Points)
Extract up to 8 versions (upper limit). Note the richness.

### Name Appears in Transcript
Flag immediately: "Customer name detected. Verify written consent before using in ads." Default to anonymous.

### Stitching Required
Clearly note: *(Lines 3, 7, stitched)*. Ensure stitching doesn't change meaning.

---

## Example

### Input

```
1: I'm 42, I work in tech, and I've been tired for years.
2: Like, not normal tired. Exhausted. Brain fog. Mood swings.
3: I went to three different doctors. All of them said my labs were "normal."
4: One literally told me, "Welcome to your 40s. This is just how it is now."
5: But I knew something was wrong. My body was screaming at me.
6: I found Superpower through a podcast ad, honestly.
7: They tested over 100 biomarkers. My vitamin D was critically low.
8: My cortisol was all over the place. My thyroid was borderline.
9: None of that showed up on my annual physical.
10: Now I'm not just guessing. I have data. I'm optimizing.
11: My energy is back. The fog lifted. I feel like myself again.
12: If your doctor says you're fine but you know you're not—get the full picture.
```

### Output

```markdown
## Anonymous Tech Executive — 3 Versions

**Demographics:** 42-year-old woman, tech industry

---

### Version 1: The Doctors Dismissed Me

**Archetype:** B: The System Missed It

**Stakes:** Years of fatigue, brain fog, and hormonal issues going undiagnosed despite multiple doctor visits.

**Title Hook:**
> Three doctors said I was fine.
> My doctor blamed my age.

**Hook:**
> "I went to three different doctors. All of them said my labs were 'normal.'"
*(Line 3)*

**Conflict:**
> "One literally told me, 'Welcome to your 40s. This is just how it is now.'"
*(Line 4)*

**Bridge:**
> "I found Superpower through a podcast ad, honestly."
*(Line 6)*

**Discovery:**
> "They tested over 100 biomarkers. My vitamin D was critically low. My cortisol was all over the place. My thyroid was borderline. None of that showed up on my annual physical."
*(Lines 7-9, stitched)*

**Result:**
> "My energy is back. The fog lifted. I feel like myself again."
*(Line 11)*

---

### Version 2: The Full Picture

**Archetype:** D: Before-and-After Transformation

**Stakes:** Chronic exhaustion and brain fog with no explanation despite seeking help from three doctors.

**Title Hook:**
> My labs were "normal." I wasn't.
> Something my doctor never checked.

**Hook:**
> "I've been tired for years. Like, not normal tired. Exhausted. Brain fog. Mood swings."
*(Lines 1-2, stitched)*

**Conflict:**
> "All of them said my labs were 'normal.' But I knew something was wrong. My body was screaming at me."
*(Lines 3, 5, stitched)*

**Bridge:**
> "I found Superpower through a podcast ad, honestly."
*(Line 6)*

**Discovery:**
> "They tested over 100 biomarkers. My vitamin D was critically low. My cortisol was all over the place. My thyroid was borderline."
*(Lines 7-8, stitched)*

**Result:**
> "If your doctor says you're fine but you know you're not—get the full picture."
*(Line 12)*

---

### Version 3: From Guessing to Knowing

**Archetype:** C: High Performer Wake-Up Call

**Stakes:** Living with unexplained symptoms and no clear path forward despite actively seeking answers.

**Title Hook:**
> I spent years guessing what was wrong.
> The test my annual physical missed.

**Hook:**
> "I knew something was wrong. My body was screaming at me."
*(Line 5)*

**Conflict:**
> "I went to three different doctors. All of them said my labs were 'normal.'"
*(Line 3)*

**Bridge:**
> "I found Superpower through a podcast ad, honestly."
*(Line 6)*

**Discovery:**
> "They tested over 100 biomarkers. None of that showed up on my annual physical."
*(Lines 7, 9, stitched)*

**Result:**
> "Now I'm not just guessing. I have data. My energy is back. The fog lifted."
*(Lines 10-11, stitched)*

---

## Pre-Delivery Review

| Version | Hook Standalone? | Bridge Present? | Result Specific? | Narrative Flows? |
|---------|------------------|-----------------|------------------|------------------|
| V1: The Doctors Dismissed Me | YES | YES | YES | YES |
| V2: The Full Picture | YES | YES | YES | YES |
| V3: From Guessing to Knowing | YES | YES | YES | YES |

**Red flags or accuracy concerns:** None.
```

---

## When to Use This Skill

- User provides testimonial transcript for video ad concepts
- Converting customer stories into structured ad frameworks
- Need multiple angle variations from a single testimonial
- Require verbatim attribution for legal/compliance review

**Don't use for:** Ads from scratch (`concept-matrix`), landing pages (`landing-page-copy`), final video scripts without extraction (`video-script-writing`), or compliance review (`compliance-check`).

---

**Remember:** Accuracy is critical. Editors need real lines to pull. Every quote must be traceable back to the original transcript. When in doubt, preserve the original wording. Authenticity > polish.
