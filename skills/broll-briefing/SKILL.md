---
name: broll-briefing
description: |
  Generate B-roll placement recommendations for video scripts. Use when you have a video script
  and need to identify where to insert supporting footage to enhance visual storytelling.

  Invoke this skill when the user asks to:
  - "Add B-roll to this script"
  - "Create a B-roll brief"
  - "Where should I add B-roll?"
  - "B-roll recommendations for this video"
  - "Visual overlay suggestions"
  - "What footage do I need for this script?"

  Input: Video script (transcribed or written)
  Output: Timestamped B-roll placement brief with specific footage recommendations
version: 1.0.0
---

# B-Roll Briefing: Visual Enhancement Skill

## Overview

This skill analyzes video scripts and generates detailed B-roll placement recommendations. B-roll is supplementary footage that enhances the primary talking-head content, making videos more engaging and visually dynamic.

**Critical Principle:** B-roll should appear frequently—**2-3 insertions every 10 seconds** on average. This creates a visually dynamic video that holds attention. Don't be conservative with B-roll; viewers expect constant visual stimulation in modern video content.

**What This Skill Outputs:**

- Line-by-line B-roll placement recommendations
- Specific footage descriptions for each insertion
- Timing estimates for each B-roll clip
- Greenscreen/compositing notes where applicable
- Priority ranking for B-roll shots

**Output Formats:**

1. **Table Format** — Full B-roll brief with timestamps, durations, priorities (detailed)
2. **Inline Format** — B-roll in square brackets next to matching text, e.g., `"I was exhausted" [tired person on couch B-roll]` (compact, for editor briefs)

---

## Required Input Format: Timestamped Transcripts

**CRITICAL: Scripts MUST include timestamps.** This enables precise source referencing in B-roll briefs.

**Expected Input Format:**
```
Script 1:
[00:00] First sentence of the script.
[00:05] Second sentence continues here.
[00:10] And so on...

Script 2:
[00:00] Different script starts here.
[00:08] More content follows.
```

**If the user provides scripts WITHOUT timestamps, respond:**

> "I need timestamped transcripts to create accurate B-roll briefs. Please provide scripts in this format:
> ```
> [00:00] First sentence of the script.
> [00:05] Second sentence continues here.
> [00:10] And so on...
> ```
> This allows me to reference exact moments (e.g., 'Script 1 [00:28]') so editors can find the footage quickly."

---

## B-Roll Trigger Categories

### Priority 1: Superpower Product Shots (Always Include)

These MUST have B-roll when mentioned in the script:

| Trigger Words/Phrases                                                    | B-Roll Required                           |
| ------------------------------------------------------------------------ | ----------------------------------------- |
| "action plan", "personalized plan", "protocol"                           | Superpower Action Plan screen             |
| "supplements", "marketplace", "prescriptions", "Rx"                      | Superpower Marketplace/supplements B-roll |
| "care team", "concierge", "clinician", "doctor" (Superpower context) | Care team/concierge B-roll            |
| "100+ biomarkers", "comprehensive test"                                  | Biomarkers list screen in Superpower app  |
| "biomarker" + specific name (e.g., "vitamin D", "ferritin")              | That specific biomarker result screen     |
| "results", "my results", "test results"                                  | Superpower results dashboard              |
| "app", "Superpower app"                                                  | App interface shots                       |

**Greenscreen Rule:** When showing any Superpower app screens, composite/greenscreen mask the speaker onto the screen when possible. This creates continuity and keeps the viewer connected to the speaker.

### Priority 2: Health & Medical Visuals

| Trigger Words/Phrases                      | B-Roll Suggested                              |
| ------------------------------------------ | --------------------------------------------- |
| "heart", "heart disease", "cardiovascular" | Heart organ/heartbeat visualization           |
| "blood", "blood test", "blood draw"        | Blood vial, lab processing                    |
| "tired", "exhausted", "fatigue"            | Person looking tired, low energy              |
| "energy", "energized"                      | Person active, working out, playing with kids |
| "inflammation", "inflammatory"             | Inflammation visualization/graphic            |
| "thyroid"                                  | Thyroid gland illustration                    |
| "cortisol", "stress hormones"              | Stress visualization, cortisol molecule       |
| "vitamin D", "sunshine vitamin"            | Sun, outdoor activity                         |
| "iron", "ferritin"                         | Iron-rich foods, blood cells                  |
| "cholesterol", "lipids"                    | Artery visualization, heart                   |
| "hormones", "hormone levels"               | Hormone molecule graphics                     |
| "gut health", "microbiome"                 | Gut/digestive system visualization            |
| "sleep", "insomnia"                        | Person sleeping, bedroom                      |
| "brain fog", "cognitive"                   | Brain visualization, thinking                 |

### Priority 3: Emotional & Situational

| Trigger Words/Phrases                     | B-Roll Suggested                       |
| ----------------------------------------- | -------------------------------------- |
| "doctor", "physician", "GP" (traditional) | Doctor's office, white coat            |
| "normal", "labs came back normal"         | Medical chart showing "normal"         |
| "frustrated", "frustrating"               | Frustrated expression, hands on head   |
| "finally", "answers"                      | Relief expression, breakthrough moment |
| "kids", "children", "family"              | Family footage, playing with kids      |
| "work", "job", "career"                   | Office/workplace footage               |
| "morning", "wake up"                      | Morning routine, alarm clock           |
| "exercise", "workout", "gym"              | Fitness footage                        |
| "food", "diet", "eating"                  | Healthy food, meal prep                |
| "aging", "getting older"                  | Age-related imagery (tasteful)         |

### Priority 4: Objects & Actions

| Trigger Words/Phrases        | B-Roll Suggested         |
| ---------------------------- | ------------------------ |
| "phone", "called"            | Phone/calling footage    |
| "computer", "online"         | Laptop/screen footage    |
| "years", "months", "weeks"   | Calendar, time passing   |
| "money", "cost", "expensive" | Money/cost visualization |
| "home", "house"              | Home interior            |
| "couch", "sofa"              | Living room, couch       |
| "bed"                        | Bedroom footage          |

---

## Cadence Guidelines

### Target: 2-3 B-Roll Insertions Per 10 Seconds

**Why this cadence?**

- Modern viewers expect visual variety
- B-roll maintains attention during talking-head content
- It prevents "talking head fatigue"
- Social platforms reward visually dynamic content

**Timing per B-roll clip:**

- **Quick cuts:** 1-2 seconds (for rapid sequences)
- **Standard cuts:** 2-4 seconds (most common)
- **Lingering shots:** 4-6 seconds (for emotional moments or complex visuals)

### When to Hold Back

Even with frequent B-roll, there are moments to let the speaker breathe:

- **Emotional peaks:** When the speaker is delivering a powerful line, stay on their face
- **Key testimonials:** "I feel like myself again" — let them say it on camera
- **CTA moments:** Final call-to-action should often be speaker-direct
- **Pauses for emphasis:** If the speaker pauses meaningfully, stay with them

---

## Output Format

### Format 1: Table-Based B-Roll Brief (Detailed)

Use this format for standalone B-roll briefs:

### Format 2: Inline B-Roll with Timestamps (Compact)

Use this format when embedding B-roll into editor briefs or script tables. Insert B-roll suggestions in square brackets immediately after the text they should overlay:

```markdown
| Source | Function | Content | Duration |
| --- | --- | --- | --- |
| Script 2 [00:00] | HOOK | "I lost 30 pounds *[before/after weight loss B-roll]* and it wasn't about eating less. Actually, I was barely eating when I was at my heaviest *[woman eating small salad B-roll]*." | ~10s |
| Script 2 [00:12] | CONFLICT | "I'd go to my doctor *[doctor's office B-roll]*, she'd run my blood work *[blood draw B-roll]* and say 'everything looks normal.' *[medical chart showing "normal" B-roll]*" | ~15s |
| Script 1 [01:19] | DISCOVERY | "Superpower tests over 100 biomarkers *[Superpower biomarkers list screen - greenscreen composite]*—fasting insulin, cortisol, inflammation *[inflammation visualization B-roll]*, all of it." | ~18s |
```

**Inline Format Rules:**

- Use the **4-column table format** with Source timestamps (Script X [MM:SS])
- Place B-roll in `*[italics and square brackets]*` immediately after the text it covers
- Be specific: `*[tired person rubbing eyes on couch B-roll]*` not `*[tired B-roll]*`
- For Superpower screens, add greenscreen note: `*[Action Plan screen - greenscreen composite]*`
- For emotional beats, use: `*[STAY ON SPEAKER]*`
- Target 2-3 B-roll insertions per sentence for adequate coverage

---

### Table-Based B-Roll Brief (Detailed Format)

Use this format for standalone B-roll briefs:

```markdown
## B-Roll Brief: [Script/Project Name]

**Total Script Duration:** ~[X] seconds
**Estimated B-Roll Insertions:** [X] clips
**B-Roll Coverage:** ~[X]% of total runtime

---

### B-Roll Placement Table

| Timestamp | Line/Dialogue              | B-Roll Description                     | Duration | Priority | Notes                                  |
| --------- | -------------------------- | -------------------------------------- | -------- | -------- | -------------------------------------- |
| 0:00-0:03 | "I was tired all the time" | Person looking exhausted, rubbing eyes | 2s       | P2       | Cut back to speaker for "all the time" |
| 0:05-0:08 | "went to three doctors"    | Doctor's office, white coat, clipboard | 3s       | P3       |                                        |
| ...       | ...                        | ...                                    | ...      | ...      | ...                                    |

---

### Superpower Screen Shots (Greenscreen Composites)

| Timestamp | Trigger                 | Screen to Show         | Composite Notes                 |
| --------- | ----------------------- | ---------------------- | ------------------------------- |
| 0:22      | "100+ biomarkers"       | Biomarkers list screen | Greenscreen speaker into corner |
| 0:35      | "personalized protocol" | Action Plan screen     | Full-screen with speaker PIP    |
| ...       | ...                     | ...                    | ...                             |

---

### B-Roll Asset Checklist

**Superpower Product Shots Needed:**

- [ ] Biomarkers list screen (app)
- [ ] Action Plan screen (app)
- [ ] Marketplace/supplements (app)
- [ ] Results dashboard (app)

**Stock/Generic Footage Needed:**

- [ ] Tired person (morning, couch)
- [ ] Doctor's office
- [ ] Family/kids playing
- [ ] Workout/energy footage

**Custom/Specific Shots Needed:**

- [ ] [Any script-specific requirements]
```

---

## Step-by-Step Process

### Step 1: Script Analysis

Read through the script and identify:

1. **Every Superpower product mention** (Priority 1 — mandatory B-roll)
2. **Health/medical terms** (Priority 2 — strong B-roll candidates)
3. **Emotional moments** (Priority 3 — situational B-roll)
4. **Objects/actions described** (Priority 4 — optional B-roll)

### Step 2: Timestamp Mapping

Estimate timestamps for each line based on:

- **Natural speech:** ~2.5 words/second
- **Emotional delivery:** ~2 words/second
- **Energetic delivery:** ~3 words/second

Create rough timestamps for the entire script.

### Step 3: B-Roll Density Check

After initial placement, verify:

- Are there 2-3 B-roll moments every 10 seconds?
- If not, look for additional opportunities (objects, emotions, situations)
- If too dense, prioritize P1 > P2 > P3 > P4

### Step 4: Greenscreen Planning

For every Superpower app screen:

- Note which screens need speaker composite
- Specify composite style (corner PIP, side-by-side, full overlay)
- Flag any screens that work better without composite

### Step 5: Generate Asset Checklist

Create a checklist of all B-roll assets needed:

- Superpower product shots (usually have these)
- Stock footage requirements
- Custom shots that may need filming

---

## Example Input/Output

### Example Input

```
User: Add B-roll recommendations to this script:

1: I was tired all the time. Like, not normal tired—exhausted.
2: I felt like I was dragging myself through every single day.
3: I went to three different doctors. They ran basic tests.
4: Everything came back normal. They said I was fine.
5: But I knew something wasn't right. My body was telling me.
6: Then I found Superpower. They test over 100 biomarkers.
7: Way more than my doctor ever checked.
8: Turns out my vitamin D was at 18, my ferritin was borderline.
9: My inflammation markers were elevated. No wonder I was exhausted.
10: They gave me a personalized action plan.
11: Exactly what supplements to take and when.
12: Six weeks later, I actually have energy again.
13: I can play with my kids after work.
14: If you're exhausted and no one can tell you why, try Superpower.
```

### Example Output

```markdown
## B-Roll Brief: Fatigue Testimonial

**Total Script Duration:** ~62 seconds
**Estimated B-Roll Insertions:** 18 clips
**B-Roll Coverage:** ~65% of total runtime

---

### B-Roll Placement Table

| Timestamp | Line/Dialogue                              | B-Roll Description                                           | Duration | Priority | Notes                                           |
| --------- | ------------------------------------------ | ------------------------------------------------------------ | -------- | -------- | ----------------------------------------------- |
| 0:00-0:02 | "I was tired all the time"                 | Person rubbing eyes, looking exhausted on couch              | 2s       | P2       |                                                 |
| 0:03-0:05 | "not normal tired—exhausted"               | Same person slumped, head in hands                           | 2s       | P2       | Cut back to speaker on "exhausted" for emphasis |
| 0:06-0:09 | "dragging myself through every single day" | Slow-motion morning routine, struggling to get up            | 3s       | P3       |                                                 |
| 0:10-0:12 | "three different doctors"                  | Doctor's office exterior, then interior                      | 2s       | P3       |                                                 |
| 0:13-0:15 | "They ran basic tests"                     | Blood draw, lab vials                                        | 2s       | P3       |                                                 |
| 0:16-0:18 | "Everything came back normal"              | Medical chart/results showing "normal" ranges                | 2s       | P3       |                                                 |
| 0:19-0:21 | "They said I was fine"                     | Doctor shrugging or dismissive gesture                       | 2s       | P3       |                                                 |
| 0:22-0:25 | "something wasn't right"                   | **STAY ON SPEAKER**                                          | —        | —        | Emotional beat—let speaker deliver              |
| 0:26-0:29 | "Then I found Superpower"                  | Superpower logo/app opening                                  | 3s       | P1       | Transition moment                               |
| 0:30-0:34 | "They test over 100 biomarkers"            | **Biomarkers list screen (app)**                             | 4s       | P1       | **GREENSCREEN: Speaker composite in corner**    |
| 0:35-0:38 | "Way more than my doctor"                  | Split: biomarker list vs. basic panel comparison             | 3s       | P2       |                                                 |
| 0:39-0:42 | "vitamin D was at 18"                      | **Vitamin D biomarker result screen**                        | 3s       | P1       | **GREENSCREEN: Speaker composite**              |
| 0:43-0:45 | "ferritin was borderline"                  | **Ferritin biomarker result screen**                         | 2s       | P1       | **GREENSCREEN: Speaker composite**              |
| 0:46-0:49 | "inflammation markers were elevated"       | **Inflammation markers screen** + inflammation visualization | 3s       | P1       |                                                 |
| 0:50-0:53 | "personalized action plan"                 | **Superpower Action Plan screen**                            | 3s       | P1       | **GREENSCREEN: Speaker composite, full screen** |
| 0:54-0:56 | "supplements to take and when"             | **Marketplace/supplements screen**                           | 2s       | P1       |                                                 |
| 0:57-0:59 | "I actually have energy again"             | Person energetic—working out, stretching, smiling            | 2s       | P2       |                                                 |
| 1:00-1:04 | "play with my kids after work"             | Parent playing with children, high energy                    | 4s       | P2       | Emotional payoff—linger on this                 |
| 1:05-1:08 | "If you're exhausted... try Superpower"    | **STAY ON SPEAKER**                                          | —        | —        | CTA—direct to camera                            |

---

### Superpower Screen Shots (Greenscreen Composites)

| Timestamp | Trigger                   | Screen to Show              | Composite Notes                          |
| --------- | ------------------------- | --------------------------- | ---------------------------------------- |
| 0:30-0:34 | "100 biomarkers"          | Biomarkers list (scrolling) | Speaker in bottom-right corner, 20% size |
| 0:39-0:42 | "vitamin D was at 18"     | Vitamin D result detail     | Speaker in bottom-right corner           |
| 0:43-0:45 | "ferritin was borderline" | Ferritin result detail      | Speaker in bottom-right corner           |
| 0:46-0:49 | "inflammation markers"    | hs-CRP / inflammation panel | Speaker in bottom-right corner           |
| 0:50-0:53 | "action plan"             | Action Plan full screen     | Speaker in bottom-left corner, 25% size  |
| 0:54-0:56 | "supplements"             | Marketplace supplements tab | Full screen, no speaker (quick cut)      |

---

### B-Roll Asset Checklist

**Superpower Product Shots Needed:**

- [x] Biomarkers list screen (scrolling animation)
- [x] Vitamin D result screen
- [x] Ferritin result screen
- [x] Inflammation markers screen
- [x] Action Plan screen
- [x] Marketplace/supplements screen
- [x] App logo/opening animation

**Stock/Generic Footage Needed:**

- [ ] Exhausted person on couch (morning)
- [ ] Struggling morning routine
- [ ] Doctor's office (exterior + interior)
- [ ] Blood draw / lab vials
- [ ] Medical chart showing "normal"
- [ ] Person working out / energetic
- [ ] Parent playing with kids

**Custom/Specific Shots Needed:**

- [ ] Comparison graphic: basic panel vs. 100+ biomarkers

---

### Cadence Summary

| Time Block | B-Roll Count | Density                     |
| ---------- | ------------ | --------------------------- |
| 0:00-0:10  | 3 clips      | Good                        |
| 0:10-0:20  | 3 clips      | Good                        |
| 0:20-0:30  | 2 clips      | Acceptable (emotional beat) |
| 0:30-0:40  | 3 clips      | Good                        |
| 0:40-0:50  | 3 clips      | Good                        |
| 0:50-1:00  | 3 clips      | Good                        |
| 1:00-1:08  | 1 clip       | Acceptable (CTA moment)     |

**Overall Density:** 18 B-roll insertions in 68 seconds = **2.6 per 10 seconds** ✓

---

### Editor Notes

1. **Greenscreen priority:** The biomarker screens (0:30-0:49) are the visual centerpiece. Ensure clean composites here.

2. **Energy transition:** The shift at 0:57 ("energy again") should feel like a visual lift. Use brighter, more saturated footage here.

3. **CTA delivery:** Final line (1:05-1:08) should be speaker-direct. No B-roll—let them make eye contact with viewer.

4. **Pacing note:** Lines 8-9 have rapid biomarker mentions. Keep cuts tight (2-3s each) to maintain energy.

5. **Audio continuity:** Speaker's voice should continue under all B-roll. Never cut audio for B-roll—only video.
```

---

## Integration with Other Skills

This skill works well after:

- **`editor-briefing`** → Once cuts are defined, add B-roll to each cut
- **`video-script-writing`** → Write script, then plan B-roll before shooting
- **`testimonial-extraction`** → Extract testimonial, then brief B-roll for chosen version

This skill pairs with:

- **`editor-briefing`** → Combine B-roll brief with cut variations for complete editor package

---

## Important Rules

### Never Skip Product Shots

When a Superpower product/feature is mentioned, **always** include the corresponding B-roll:

- Action Plan → Show Action Plan
- Biomarkers → Show biomarkers screen
- Marketplace → Show marketplace
- Care team → Show clinical imagery

These are non-negotiable. They reinforce product understanding.

### Greenscreen is Default for App Screens

When showing any Superpower app screen:

- **Default:** Composite/greenscreen the speaker onto the screen
- **Exception:** Very quick cuts (<2s) can be full-screen without speaker
- **Style:** Speaker usually in corner (20-25% of frame)

### Maintain Audio Continuity

B-roll is VIDEO only. The speaker's audio should continue underneath:

- Never cut the speaker's voice for B-roll
- B-roll is supplementary, not replacement
- The voice carries the story; visuals support it

### Respect Emotional Beats

Even with high B-roll density, some moments need the speaker's face:

- Breakthrough moments ("finally, answers")
- Emotional peaks ("I feel like myself")
- Direct CTAs ("try Superpower")
- Meaningful pauses

Mark these as "STAY ON SPEAKER" in the brief.

---

## Quality Checklist

Before delivering B-roll brief, verify:

**Coverage:**

- [ ] 2-3 B-roll insertions per 10 seconds average
- [ ] All Superpower product mentions have corresponding B-roll
- [ ] All specific biomarker mentions have screen shots planned

**Clarity:**

- [ ] Each B-roll has specific description (not just "relevant footage")
- [ ] Duration estimated for each clip
- [ ] Priority level assigned (P1-P4)

**Technical:**

- [ ] Greenscreen composites identified for all app screens
- [ ] Composite style specified (corner, PIP, full overlay)
- [ ] "Stay on speaker" moments clearly marked

**Practical:**

- [ ] Asset checklist complete
- [ ] Stock vs. custom footage distinguished
- [ ] No impossible-to-source B-roll requested

---

## Edge Cases

### Very Short Scripts (<20 seconds)

For micro-content:

- Reduce to 1-2 B-roll per 10 seconds
- Prioritize P1 (product) shots only
- Often better to stay on speaker for authenticity

### Very Long Scripts (>2 minutes)

For longer content:

- Maintain 2-3 per 10 seconds throughout
- Group B-roll into "sequences" (e.g., 3 quick cuts, then speaker, then 3 quick cuts)
- Create rhythm and breathing room

### No Superpower Mentions

If the script doesn't mention Superpower products:

- Focus on P2-P4 B-roll (health, emotional, situational)
- Still maintain cadence
- Note that product shots should be added if there's a natural place

### Interview/Conversation Format

For multi-person content:

- B-roll helps during speaker transitions
- Use B-roll to cover jump cuts
- Maintain similar density but time with natural pauses

---

## Common B-Roll Mistakes to Avoid

1. **Too literal:** Don't show "a doctor" every time the word "doctor" is said. Vary the visuals.

2. **Too sparse:** Talking head for 10+ seconds loses attention. Always look for B-roll opportunities.

3. **Ignoring product shots:** Missing a Superpower screen when it's mentioned is a missed branding opportunity.

4. **Cutting audio:** B-roll should NEVER interrupt the speaker's voice. Video cuts only.

5. **Generic descriptions:** "Relevant footage" is not helpful. Be specific: "Person rubbing temples, looking frustrated at laptop."

6. **Forgetting greenscreen:** App screens without speaker composite feel disconnected.

7. **Overriding emotion:** Some moments need the speaker's face. Don't B-roll over the climax.

---

## Auto-Save to Notion

**After completing B-roll briefs, ALWAYS save to Notion automatically.**

### When to Save

- After delivering a standalone B-roll brief (table format)
- After adding inline B-roll to editor briefs (if not already saved by editor-briefing skill)

### Table Format for Notion

Use this structure when saving B-roll briefs:

**For Detailed Table Format:**

| Timestamp | Line/Dialogue | B-Roll Description | Duration | Priority | Notes        |
| --------- | ------------- | ------------------ | -------- | -------- | ------------ |
| 0:00-0:03 | "Script line" | B-roll description | 2s       | P1       | Editor notes |

**For Inline Format (in editor briefs):**

| Source | Function | Content | Duration |
| --- | --- | --- | --- |
| Script 1 [00:00] + Script 2 [00:12] | HOOK | "Script text *[B-roll description]* more text" | ~15s |

### Asset Checklist Section

Always include a checklist of required assets:

```
**Superpower Product Shots:**
- [ ] Biomarkers list screen
- [ ] Action Plan screen
- [ ] Marketplace/supplements

**Stock Footage:**
- [ ] [Specific footage needed]
```

### Page Naming Convention

- Standalone B-roll brief: `"[Project Name] - B-Roll Brief"`
- With editor cuts: `"[Project Name] - Editor Briefs"` (B-roll included inline)

---

Remember: B-roll transforms a talking-head video into a visually engaging piece of content. Your job is to maximize visual variety while maintaining narrative coherence and highlighting Superpower's product at every opportunity.
