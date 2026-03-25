---
name: testimonial-extraction-paid-static
description: Extract 5-8 static ad concepts from customer testimonials, each with verbatim quote, optional Superpower line, and CTA. Copy only - no visual direction needed (we have templates). Includes line references for compliance. Use when processing testimonial transcripts for paid static image ads (quote cards, carousels, Stories).
version: 2.0.0
---

# Testimonial Extraction for Paid Static Ads

## Overview

Transform raw testimonial transcripts into 5-8 complete static ad concepts optimized for Meta static image ads. Unlike video ads that tell a story over time, static ads must capture attention and communicate value in a single frame. Each concept includes a standalone verbatim quote, optional Superpower line, and call-to-action.

**What This Skill Outputs:**
- 5-8 static ad concepts (based on transcript strength)
- Each concept includes: Verbatim Quote + Superpower Line (optional) + CTA
- Line number references for every quote (enables compliance verification)
- Concepts mapped to Steven Reiss desires for targeting diversity
- **Copy only** — no visual direction needed (we have design templates)

**Static Ad Structure:**
```
[Verbatim Quote]
— Member attribution

[Superpower LINE] ← Optional: only when it adds value
[CTA] ← Always: tied explicitly to the quote
```

**Note:** Content goes in page body, not as database column properties. All concepts shared equally - no "recommended" designation.

**Why 5-8 Concepts:** This range balances variety with quality:
1. Enough options for A/B testing different emotional angles
2. Stops before quality drops or angles feel forced
3. Each concept must pass the Substance Check and Why Care tests

**When to Use This Skill:**
- User provides testimonial transcript for static image ads
- Creating quote cards, carousels, or social proof assets
- Need multiple ad variations from a single testimonial
- Require verbatim attribution for legal/compliance review

**What This Skill Does NOT Do:**
- Video ad scripts (use `testimonial-extraction-paid-video`)
- Blog articles, emails, Instagram scripts (use `testimonial-extraction-organic`)
- Story beats with narrative arc (that's for video)

---

## Key Difference: Static vs. Video

| Aspect | Static Ads | Video Ads |
|--------|-----------|-----------|
| **Structure** | Single powerful quote | 5-part story arc (Hook→Conflict→Bridge→Discovery→Result) |
| **Quote length** | Short, punchy (5-20 words) | Can be longer, stitched together |
| **Context** | Quote must work 100% standalone | Story provides context |
| **Visual** | Quote IS the ad | Quote supports visuals |
| **Goal** | Stop scroll, spark curiosity | Tell transformation story |

**The Static Ad Test:** If you have to explain the quote, it's not right for static.

---

## Extraction Process

### Step 1: Parse Transcript

Accept the testimonial transcript. Before processing:

1. **Strip blank lines** for accurate line numbering
2. **Assign line numbers** to each line of content
3. **Preserve original wording** exactly as provided

**Critical:** Line numbers must be accurate for compliance verification.

---

### 🎯 Narrative Foundation: The Baseline Story

**Even static ads benefit from understanding the member's complete story.**

Reference `${CLAUDE_PLUGIN_ROOT}/knowledge/testimonial-baseline-story.md` for full guidance on identifying and using the baseline story.

**Key points for static ads:**
- Read the baseline story first — understand the member's journey before extracting quotes
- Prioritize quotes from pivotal moments in THEIR story
- Context informs selection — "I finally had answers" hits harder when you know the 5-year search behind it
- Static quotes should feel like capturing the perfect moment from a real story

#### Optional: User Notes

The user may provide notes alongside the transcript. These are **soft guidance**, not strict rules.

**Examples of notes:**
- "Focus on sleep-related quotes if possible"
- "We're targeting women 35-50 for this campaign"
- "Avoid mentions of specific conditions"
- "This will be used for Instagram Stories, so punchy is key"
- "Member has approved full name usage"

**How to use notes:**
- Let them influence which quotes you prioritize
- Use them to inform visual direction
- Don't force quotes that aren't supported by the transcript
- If notes conflict with what's in the transcript, go with the transcript

---

### Step 2: Identify Standalone Quote-Worthy Moments

**The Standalone Test (CRITICAL):**

For EACH potential quote, ask yourself:
1. Would someone scrolling Instagram understand this without any context?
2. Does it create an emotional response on its own?
3. Does it require knowing anything about Superpower?
4. Would it work as a bumper sticker or tattoo?

**If a quote needs explanation, it's NOT for static ads.**

---

### 🚨 The Substance Check (MANDATORY)

**Before including ANY quote, verify it has enough substance to work as an ad.**

**The Substance Test:**
1. **Does this clearly relate to health?** — A random scroller should immediately understand this is about health/wellness
2. **Does it have emotional weight?** — Not just a statement, but something that resonates
3. **Is it specific enough to be interesting?** — Vague feelings without context fall flat
4. **Would this stop YOUR scroll?** — Be honest

**Common Substance Failures:**

| Quote | Problem | Fix |
|-------|---------|-----|
| "I felt aimless." | Too short, no health context — scroller won't know what this relates to | Add context: "I felt aimless with my health. I didn't know what to actually measure." |
| "It was like a football game." | Abstract metaphor that requires mental unpacking | Skip this — metaphors don't work for static |
| "I feel confident." | Vague emotion, could be about anything | Find quotes with specific changes: "I can walk through the grocery store and actually make educated decisions." |
| "It's finally the thing." | Requires prior context — "the thing" means nothing | Skip or find complete thought |

**What HAS Substance:**
- Specific feelings + specific context: "I thought I was healthy. My life insurance company disagreed."
- Concrete changes: "Any question I have can be answered and I can actually take action on it immediately."
- Relatable frustrations: "I would go to the doctor and they'd be like, you look fine. But I knew there was more to be had."
- Before/after with specifics: "I don't crave sugar as much as I used to."

**Rule of Thumb:** If a quote is under 10 words, it probably needs more context OR you need to stitch it with another quote to give it substance.

---

### 🚨 The "Why Would Anyone Care?" Test (CRITICAL)

**Every static ad must clearly answer: Why would a stranger care about this quote?**

Strong static ads fall into ONE of these three categories:

#### 1. Specific Health Transformations
Concrete changes with numbers, symptoms resolved, or conditions improved.

| ✅ Works | Why It Works |
|----------|--------------|
| "My blood pressure dropped 20 points. 135/81 to 115/73." | Specific numbers, clear transformation |
| "I went from that point until like now I'm down 8%." | Quantifiable result |
| "Since implementing the protocol, I finally sleep through the night." | Symptom resolved |

| ❌ Doesn't Work | Why It Fails |
|-----------------|--------------|
| "My biological age is 38." | So what? No context about real age or why this matters |
| "My numbers improved." | Too vague—which numbers? By how much? |
| "I feel better." | Generic, no specifics |

#### 2. Product/Feature Love
Something specific about Superpower the person genuinely loved.

| ✅ Works | Why It Works |
|----------|--------------|
| "It's better than an Apple Watch, better than like anything." | Direct comparison, strong endorsement |
| "I think Superpower actually saved me money, just supplement-wise." | Unexpected benefit, ROI angle |
| "The protocols showed me exactly what to do—not just what was wrong." | Specific feature value |

| ❌ Doesn't Work | Why It Fails |
|-----------------|--------------|
| "Superpower is great!" | Generic praise, says nothing specific |
| "I really like the platform." | No reason why |
| "It's comprehensive." | Vague, could be any product |

#### 3. Relatable Frustration with Clear Resolution
A frustration the viewer shares + evidence that Superpower solved it.

| ✅ Works | Why It Works |
|----------|--------------|
| "Three doctors. Three years. Zero answers. Until Superpower showed me my thyroid was borderline." | Frustration + specific resolution |
| "My doctor said I was fine. Turns out my iron was too high and I needed to donate blood." | Dismissed → specific discovery |
| "I was tired all the time. Superpower found my vitamin D was critically low." | Symptom → cause identified |

| ❌ Doesn't Work | Why It Fails |
|-----------------|--------------|
| "The doctor doesn't really go into too much depth." | Just a complaint, no resolution or Superpower payoff |
| "I felt unclear and overwhelmed." | Vague emotion, no health context |
| "I knew something was wrong." | No specifics about what or what changed |

**The Litmus Test:**
For EVERY quote, ask: "If I showed this to a stranger on the street, would they immediately understand:
1. What health problem existed OR what product benefit mattered?
2. Why they should care about this person's experience?
3. What changed or what Superpower revealed?"

If you can't answer all three, the quote is too vague for static.

---

### 🚨 Avoid Abstract Metaphors

**Static ads need IMMEDIATE emotional resonance, not mental unpacking.**

**Why metaphors fail in static:**
- Scrollers give you 1-2 seconds
- Metaphors require the viewer to translate meaning
- By the time they "get it," they've scrolled past

**Examples to AVOID:**
- ❌ "It's like taking one photo of a football game" — requires understanding the analogy
- ❌ "I finally found the scoreboard" — requires knowing what scoreboard means in context
- ❌ "It's like having a GPS for my health" — cliché and requires translation

**Examples that WORK:**
- ✅ "My life insurance company knew something I didn't" — immediately intriguing
- ✅ "I feel more empowered than I've ever felt before" — direct emotional statement
- ✅ "Classic 38-year-old guy stuff. My cholesterol was really high." — specific and relatable

**Focus on:** Feelings, benefits, concrete changes, specific discoveries, relatable frustrations

#### High-Impact Quote Types for Static Ads

Scan for these specific quote patterns:

**1. Gut-Punch Moments** (Highest impact)
Emotional statements that hit hard and create instant empathy.
- "I thought everyone spends a solid hour falling asleep."
- "I was told I was crazy. Superpower proved I wasn't."
- "My doctor said I was fine. I knew I wasn't."

**Why they work:** Universal relatability. Reader thinks "I've felt that too."

**2. Before/After Contrasts**
Clear transformation in a single statement.
- "I went from exhausted to energized in 6 weeks."
- "Before: 3 cups of coffee to function. After: Natural energy all day."
- "I used to dread mornings. Now I wake up before my alarm."

**Why they work:** Tangible change creates belief in possibility.

**3. Healthcare System Critiques**
Frustrations with traditional medicine that many share.
- "If you're not on fire, they won't pay attention to you."
- "I was told to just eat healthy and exercise. That's what I do for a living."
- "Three doctors, three years, zero answers."
- "My annual physical missed everything that mattered."

**Why they work:** Validates frustration, positions Superpower as alternative.

**4. Validation Statements**
Feeling heard, believed, or vindicated.
- "For the first time, I felt like someone actually listened."
- "I finally had answers after 5 years of searching."
- "I wasn't imagining it. The data proved me right."

**Why they work:** Addresses the emotional need to be believed.

**5. Specific Discovery Revelations**
Concrete findings that surprise.
- "Turns out my thyroid was failing and no one caught it."
- "I had no idea my vitamin D was critically low."
- "My cortisol was all over the place. Finally, an explanation."

**Why they work:** Specific = credible. Creates "what might I be missing?" curiosity.

**6. Family/Legacy Statements**
Protecting loved ones, breaking cycles.
- "I refuse to repeat my mother's story."
- "I'm not waiting until it's too late like my dad did."
- "I want to be around for my kids. That starts with knowing."

**Why they work:** Taps into deep motivation beyond self.

**7. Empowerment/Control Statements**
Taking charge, no longer guessing.
- "Now I'm not guessing. I'm knowing."
- "I stopped waiting for permission to understand my own body."
- "My health is finally in my hands."

**Why they work:** Agency is aspirational. Reader wants that feeling.

---

### Step 3: Map to Steven Reiss Desires

Reference `${CLAUDE_PLUGIN_ROOT}/steven-reiss-16-desires.md` to identify which fundamental human desires each quote targets.

**Common Desires in Static Testimonial Ads:**

| Desire | What It Means | Quote Pattern |
|--------|---------------|---------------|
| **Tranquility** | Peace of mind, avoiding anxiety | "I finally stopped worrying about..." |
| **Acceptance** | Being believed, validated | "Someone finally listened..." |
| **Power** | Control, empowerment | "I'm in control of my health now..." |
| **Curiosity** | Understanding, solving mystery | "I discovered what was really happening..." |
| **Independence** | Self-reliance, not depending on gatekeepers | "I didn't need to wait for my doctor..." |
| **Family** | Protecting loved ones | "I'm doing this for my kids..." |
| **Status** | Being proactive, optimized | "I'm not guessing anymore..." |

**Why This Matters for Static:**
Each concept should target a different primary desire. This ensures you're not creating 8 versions of the same emotional appeal. Diversity = broader audience resonance.

---

### Step 4: Create Static Ad Concepts

For each qualifying quote, develop a complete static ad concept.

**Target:** 5-8 concepts (based on transcript strength)
**Minimum:** 5 concepts
**Maximum:** 8 concepts
**Quality bar:** Each quote must pass BOTH the Standalone Test AND the Substance Check

#### Static Ad Concept Structure

Each static ad follows this structure:

```
[VERBATIM QUOTE]
— Member attribution

[SUPERPOWER LINE] ← Optional: include only when it adds value
[CTA] ← Required: tied explicitly to the quote, never generic
```

**Template:**

```
## Concept [#]: [Concept Name]

**Primary Desire:** [Which Steven Reiss desire this targets]

**Quote:**
> "[Exact verbatim quote - no edits, no paraphrasing]"
> — [Member Name or "Superpower Member"], [Age if available]
> *(Line [X])*

**Superpower Line:** [Optional - only if it adds value. Otherwise write "None - quote stands alone."]

**CTA:** [Clear, powerful, action-oriented - tied explicitly to this quote]
```

**Note:** No visual direction needed — we have design templates. The copy (quote + optional Superpower line + CTA) is what gets transferred to the Static Ads Database.

---

### Step 5: Superpower Line Guidelines

The Superpower Line is the brand's voice responding to the member's quote. It bridges the emotional truth of the quote to the action we want the viewer to take.

**The Decision Framework: Include or Skip?**

| Quote Type | Superpower Line? | Reasoning |
|------------|------------------|-----------|
| Short, punchy gut-punch | Often YES | Quote hits hard but may need a bridge to action |
| Complete transformation statement | Often NO | Quote tells the full story, go straight to CTA |
| Question or open statement | YES | Needs Superpower to provide the answer/resolution |
| Healthcare critique | Sometimes | Depends if quote implies the solution or not |
| Empowerment/resolution quote | NO | Quote already provides the payoff |

**When to INCLUDE a Superpower Line:**

1. **The quote is short and needs a bridge**
   - Quote: "My doctor said I was fine. I knew I wasn't."
   - Superpower Line: "Your instincts were right. Now get the proof."
   - CTA: "Test what they missed."

2. **The quote ends on frustration, not resolution**
   - Quote: "Three doctors. Three years. Zero answers."
   - Superpower Line: "You deserve better than 'normal.'"
   - CTA: "Get real answers."

3. **The quote raises a question that Superpower answers**
   - Quote: "I kept asking why I was so tired. No one could tell me."
   - Superpower Line: "We can."
   - CTA: "Find out why."

**When to SKIP the Superpower Line (go straight to CTA):**

1. **The quote is already a complete thought with resolution**
   - Quote: "I finally have answers after 5 years of searching."
   - CTA: "Your answers are waiting."

2. **The quote is powerful enough that adding more dilutes it**
   - Quote: "The fog lifted. I feel like myself again."
   - CTA: "Feel like yourself again."

3. **The quote implies the solution**
   - Quote: "Now I'm not guessing. I have data."
   - CTA: "Stop guessing. Start knowing."

**Superpower Line Guidelines:**

- **Keep it short:** 5-10 words max
- **Match the tone:** If quote is frustrated, acknowledge it. If hopeful, build on it.
- **Don't repeat the quote:** Add new information or perspective
- **Speak as Superpower:** Confident, empathetic, not salesy
- **Create a bridge:** It should feel like a natural response to what the member said

**Good Superpower Lines:**
- "Your instincts were right."
- "There's usually a reason."
- "You deserve to know."
- "We can."
- "That's not normal. Let's find out why."
- "The answer might be in your blood."

**Bad Superpower Lines:**
- ❌ "Superpower tests 100+ biomarkers!" (feature dump)
- ❌ "Try Superpower today!" (generic sales pitch)
- ❌ "We're the best blood testing company!" (braggy)
- ❌ Anything that sounds like it could be from any health company

---

### Step 6: CTA Guidelines

**The CTA must be tied explicitly to the quote.** Generic CTAs like "Learn more" or "Get started" are lazy and waste the emotional setup the quote created.

**CTA Principles:**

1. **Echo the quote's language or theme**
   - Quote about being dismissed → CTA about being heard/proven right
   - Quote about not knowing → CTA about finding out
   - Quote about transformation → CTA about experiencing that transformation

2. **Be specific and action-oriented**
   - Not "Learn more" → "See what your annual physical missed"
   - Not "Get started" → "Find out what's really going on"
   - Not "Sign up" → "Get your answers"

3. **Match the emotional intensity**
   - Frustrated quote → Direct, empowering CTA
   - Hopeful quote → Aspirational CTA
   - Curious quote → Mystery-solving CTA

**CTA Examples Tied to Quote Types:**

| Quote Theme | Bad CTA | Good CTA |
|-------------|---------|----------|
| Doctor dismissed me | "Learn more" | "See what they missed" |
| I was tired for years | "Get tested" | "Find out why" |
| I finally have answers | "Sign up" | "Your answers are waiting" |
| I stopped guessing | "Try it" | "Stop guessing. Start knowing." |
| My annual physical missed it | "Get started" | "Test what matters" |
| I feel like myself again | "Learn more" | "Feel like yourself again" |
| I knew something was wrong | "Sign up today" | "Trust your gut. Get proof." |

**CTA Length:** 2-6 words. Punchy. No filler.

**CTA DON'Ts:**
- ❌ "Learn more" (lazy, generic)
- ❌ "Get started today" (could be any company)
- ❌ "Sign up now" (too transactional)
- ❌ "Click here" (obviously)
- ❌ Exclamation points (desperate energy)
- ❌ "Free" or discount language (cheapens the brand)

---

### Step 7: Pre-Delivery Review Gate (MANDATORY)

**You MUST complete this review and include it in your output before delivering.**

For EACH concept, verify:

| Concept | Quote Verbatim? | Quote Standalone? | Has Substance? | Why Care? | CTA Quote-Tied? | Line # Accurate? |
|---------|-----------------|-------------------|----------------|-----------|-----------------|------------------|
| 1 | YES/NO | YES/NO | YES/NO | YES/NO | YES/NO | YES/NO |
| 2 | YES/NO | YES/NO | YES/NO | YES/NO | YES/NO | YES/NO |
| ... | ... | ... | ... | ... | ... | ... |

**Column Definitions:**
- **Quote Verbatim?** — Is the quote exactly as spoken in the transcript? No edits, no paraphrasing?
- **Quote Standalone?** — Would someone with zero context understand and feel something?
- **Has Substance?** — Does this quote clearly relate to health AND have enough weight to stop a scroll? (See Substance Check)
- **Why Care?** — Does this quote fall into one of the three categories: (1) Specific health transformation with numbers/symptoms, (2) Product/feature they loved, (3) Relatable frustration with clear resolution? If it's just a vague feeling or complaint without payoff, answer NO.
- **CTA Quote-Tied?** — Is the CTA specifically tied to this quote (not generic like "Learn more")?
- **Line # Accurate?** — Can an editor find this exact quote in the transcript?

**Rules:**
1. You CANNOT deliver without completing this table
2. All answers must be YES before delivery
3. If any NO, revise that concept first
4. This table must appear in your output

---

### Step 8: Viewer Perspective Check (MANDATORY)

Before delivering, read EACH quote as if you are:
- A random person scrolling Instagram
- Someone who has NEVER heard of Superpower
- Someone who knows NOTHING about biomarkers or preventive testing

**For each quote, ask:**

1. **Does this make sense without context?**
   - ❌ "My biological age was 32" (requires knowing what bio age is)
   - ✅ "I was tired all the time and no one could tell me why"

2. **Does it create an emotional response?**
   - ❌ "I got my results back" (so what?)
   - ✅ "My doctor said I was fine. I knew I wasn't."

3. **Would I stop scrolling?**
   - ❌ "The test was comprehensive" (boring)
   - ✅ "Three doctors, three years, zero answers."

**If ANY quote fails this check:**
- Either revise to add context in ad copy
- Or replace with a different quote from transcript
- Do NOT include quotes that require insider knowledge

---

## Output Template

Use this **exact format** for all extractions:

```markdown
# Static Ad Concepts: [Member Name]

**Source:** [Transcript reference]
**Date:** [Date]
**Total Concepts:** [5-8]

---

## Concept 1: [Concept Name]

**Primary Desire:** [Desire]

**Quote:**
> "[Exact verbatim quote]"
> — [Attribution]
> *(Line X)*

**Superpower Line:** *(Optional — only if it adds value)*
[Bridge statement if quote needs context to reach CTA. Write "None - quote stands alone." if skipping.]

**CTA:** [Quote-tied CTA — 2-6 words, echoes the quote's theme]

---

## Concept 2: [Concept Name]

[Same structure...]

---

[Continue for all 8-12 concepts...]

---

## Pre-Delivery Review

| Concept | Quote Verbatim? | Quote Standalone? | Has Substance? | Why Care? | CTA Quote-Tied? | Line # Accurate? |
|---------|-----------------|-------------------|----------------|-----------|-----------------|------------------|
| 1: [name] | YES | YES | YES | YES | YES | YES |
| 2: [name] | YES | YES | YES | YES | YES | YES |
| ... | ... | ... | ... | ... | ... | ... |

**If any NO above, what was revised:**
- [Concept X]: [What was wrong] → [How it was fixed]

---

## Quote Bank Summary

Quick reference table of all extracted quotes:

| # | Quote | Line | Desire |
|---|-------|------|--------|
| 1 | "[Short version]" | X | Tranquility |
| 2 | "[Short version]" | Y | Acceptance |
| ... | ... | ... | ... |

---

## Notes

**Quotes that didn't make the cut:**
- "[Quote]" *(Line X)* — [Why it didn't work: too short without context, abstract metaphor, requires insider knowledge, etc.]

**Compliance flags:**
[Any concerns about claims, name usage, or accuracy. If none, write "None."]

**Suggested pairings for carousel:**
[Which concepts work well together in a multi-card format]
```

---

## Compliance Requirements

Reference `${CLAUDE_PLUGIN_ROOT}/compliance-guide.md` for full compliance guidance.

**Key rules for static ads:**

| Rule | Why |
|------|-----|
| Quote verbatim with line numbers | Enables verification and compliance |
| Use [...] or [edited for clarity] if editing | FTC requires authentic attribution |
| Mark stitched quotes | "Lines X, Y, stitched" |
| Default to anonymous | Unless written consent confirmed |
| Flag customer names | "Verify written consent before using in ads" |

**Attribution Formats:**
- "— Superpower Member" (most anonymous)
- "— Sarah M., 38" (first name + initial + age)
- "— Sarah Mitchell, 38, Boston" (full details - requires consent)

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Quotes That Need Story Context

**What went wrong:** Quote made sense in the video cut but doesn't work standalone.

**Example:**
- Video: Hook → Conflict → "So I finally got answers" → Result
- Static: Just "So I finally got answers" = Confusing. Answers to what?

**How to avoid:** Every static quote must work as if it's the ONLY thing someone sees.

---

### ❌ Mistake 2: Insider Jargon

**What went wrong:** Quote uses terms only health-aware audience understands.

**Examples:**
- "My cortisol pattern explained everything" — What's cortisol pattern?
- "I finally understood my biomarkers" — What are biomarkers?
- "My biological age was 32" — Requires context about real age

**How to avoid:** If your mom wouldn't understand it, it's too jargon-y for static.

---

### ❌ Mistake 3: Generic Praise

**What went wrong:** Quote is positive but says nothing specific.

**Examples:**
- "Superpower is amazing!"
- "I love this service!"
- "Everyone should do this!"

**How to avoid:** These are worthless for ads. Find SPECIFIC transformation statements.

---

### ❌ Mistake 4: Too Long for Static

**What went wrong:** Quote is great but requires a paragraph to communicate.

**Example:** "I went to three different doctors over five years and none of them could tell me why I was tired all the time, and they just kept saying my labs were normal, but I knew something was wrong, and finally Superpower showed me that my thyroid was borderline and my vitamin D was critically low and now I have answers."

**How to avoid:** Extract the punchy part: "Three doctors. Five years. Zero answers. Until Superpower."
But note: You can't create that—you must find an actual short quote, or use [...] to ethically shorten.

---

### ❌ Mistake 5: Abstract Metaphors

**What went wrong:** Quote uses a metaphor that requires mental translation: "It's like getting one picture of a football game."

**Why it fails:** Static ads give you 1-2 seconds. Metaphors require the viewer to:
1. Understand the reference
2. Translate it to health context
3. Feel something

By step 2, they've scrolled past.

**How to avoid:** Focus on direct emotional statements, specific feelings, concrete changes. Save metaphors for video where you have time to build context.

---

### ❌ Mistake 6: Quotes Without Health Context

**What went wrong:** Quote is emotionally resonant but doesn't clearly relate to health: "I felt aimless."

**Why it fails:** Scrollers won't know what this relates to. Aimless about what? Career? Relationships? Health?

**How to avoid:** Either:
1. Choose quotes that inherently relate to health ("My cholesterol was really high")
2. Stitch with context: "I felt aimless with my health. I didn't know what to actually measure."

---

## Edge Cases

### Transcript Has No Good Standalone Quotes

- Flag in output: "This transcript lacks punchy standalone quotes suitable for static ads."
- Suggest: "Recommend using video format instead, or requesting a follow-up interview with directed questions."
- Provide the closest options with caveats about what's missing.

### All Quotes Are Too Long

- Look for quotable PHRASES within longer statements
- Use [...] to ethically shorten (must note in output)
- Example: "I spent three years going to different doctors and none of them..." → "Three years. Different doctors. None of them could tell me why."
- BUT: You must preserve meaning and not misrepresent

### Transcript Is Very Short

- Extract as many concepts as quality allows (may be only 3-4)
- Flag: "Transcript was short, limiting available concepts."
- Don't pad with weak quotes just to hit 5

### Multiple Strong Quotes Are Similar

- Pick the punchiest version
- Note in "Quotes that didn't make the cut" why you chose one over another
- Can suggest both for A/B testing in notes

---

## Integration with Thalia Agent

This skill is invoked by the Thalia testimonial content engine agent as part of the full content extraction workflow.

**Note:** Static ads are part of the "Paid" content category and require review/editing before being shipped to Notion. Thalia will prompt "Ready to push paid content?" before adding to the database.

Outputs are added as individual rows to the **Static Ads** Notion database:
- Title (Concept Name)
- Member relation
- Usage Rights (from SSOT)
- Health Focus (from SSOT)
- Status (defaults to "Not Started")
- Full content in page body: **Quote + Superpower Line (if applicable) + CTA**

**What goes in the page body (copy only):**
```
**Quote:**
> "[Verbatim quote]"
> — [Attribution]
> *(Line X)*

**Superpower Line:** [If applicable, or "None"]

**CTA:** [Quote-tied CTA]
```

**Database:** `collection://052eb123-269d-41ed-a78e-5d9c70d25c5b`

---

## Examples

### Example Input (Testimonial Transcript)

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

### Example Output

```markdown
# Static Ad Concepts: Anonymous Tech Executive

**Source:** Interview transcript, January 2026
**Date:** 2026-01-30
**Total Concepts:** 8 (example showing upper range)

---

## Concept 1: The Doctor Dismissal

**Primary Desire:** Acceptance (validation)

**Quote:**
> "One literally told me, 'Welcome to your 40s. This is just how it is now.'"
> — Superpower Member, 42
> *(Line 4)*

**Superpower Line:** She was right. Her doctor was wrong.

**CTA:** Prove them wrong.

---

## Concept 2: The Body Knows

**Primary Desire:** Power (trusting intuition)

**Quote:**
> "I knew something was wrong. My body was screaming at me."
> — Superpower Member, 42
> *(Lines 5, stitched)*

**Superpower Line:** Your body is talking. Are you listening?

**CTA:** Stop guessing. Start knowing.

---

## Concept 3: The Annual Physical Gap

**Primary Desire:** Curiosity (solving mystery)

**Quote:**
> "My vitamin D was critically low. My cortisol was all over the place. My thyroid was borderline. None of that showed up on my annual physical."
> — Superpower Member, 42
> *(Lines 7-9, stitched)*

**Superpower Line:** None - quote stands alone.

**CTA:** See what's missing.

---

## Concept 4: Three Doctors, Zero Answers

**Primary Desire:** Independence (self-advocacy)

**Quote:**
> "I went to three different doctors. All of them said my labs were 'normal.' But I knew something was wrong."
> — Superpower Member, 42
> *(Lines 3, 5, stitched)*

**Superpower Line:** Normal labs. Abnormal exhaustion. Something didn't add up.

**CTA:** Get the full picture.

---

## Concept 5: From Guessing to Knowing

**Primary Desire:** Status (being optimized)

**Quote:**
> "Now I'm not just guessing. I have data. I'm optimizing."
> — Superpower Member, 42
> *(Line 10)*

**Superpower Line:** None - quote stands alone.

**CTA:** Get your data.

---

## Concept 6: The Fog Lifted

**Primary Desire:** Tranquility (relief)

**Quote:**
> "My energy is back. The fog lifted. I feel like myself again."
> — Superpower Member, 42
> *(Line 11)*

**Superpower Line:** None - quote stands alone.

**CTA:** Feel like yourself again.

---

## Concept 7: The Exhaustion Mystery

**Primary Desire:** Curiosity (understanding)

**Quote:**
> "I've been tired for years. Like, not normal tired. Exhausted. Brain fog. Mood swings."
> — Superpower Member, 42
> *(Lines 1-2, stitched)*

**Superpower Line:** There's usually a reason.

**CTA:** Find out why.

---

## Concept 8: The Full Picture CTA

**Primary Desire:** Power (taking control)

**Quote:**
> "If your doctor says you're fine but you know you're not—get the full picture."
> — Superpower Member, 42
> *(Line 12)*

**Superpower Line:** None - quote stands alone.

**CTA:** Get the full picture.

---

## Pre-Delivery Review

| Concept | Quote Verbatim? | Quote Standalone? | Has Substance? | Why Care? | CTA Quote-Tied? | Line # Accurate? |
|---------|-----------------|-------------------|----------------|-----------|-----------------|------------------|
| 1: Doctor Dismissal | YES | YES | YES | YES (frustration + resolution) | YES | YES |
| 2: Body Knows | YES | YES | YES | YES (frustration + validation) | YES | YES |
| 3: Annual Physical Gap | YES | YES | YES | YES (specific discoveries) | YES | YES |
| 4: Three Doctors | YES | YES | YES | YES (frustration + resolution) | YES | YES |
| 5: Guessing to Knowing | YES | YES | YES | YES (transformation) | YES | YES |
| 6: Fog Lifted | YES | YES | YES | YES (symptom resolved) | YES | YES |
| 7: Exhaustion Mystery | YES | YES | YES | YES (specific symptoms) | YES | YES |
| 8: Full Picture CTA | YES | YES | YES | YES (advice with implied resolution) | YES | YES |

**If any NO above, what was revised:**
- None required. All concepts passed initial review.

---

## Quote Bank Summary

| # | Quote | Line | Desire |
|---|-------|------|--------|
| 1 | "Welcome to your 40s. This is just how it is now." | 4 | Acceptance |
| 2 | "My body was screaming at me." | 5 | Power |
| 3 | "None of that showed up on my annual physical." | 9 | Curiosity |
| 4 | "Three different doctors. All said my labs were 'normal.'" | 3 | Independence |
| 5 | "Now I'm not just guessing. I have data." | 10 | Status |
| 6 | "The fog lifted. I feel like myself again." | 11 | Tranquility |
| 7 | "Exhausted. Brain fog. Mood swings." | 2 | Curiosity |
| 8 | "If your doctor says you're fine but you know you're not" | 12 | Power |

---

## Notes

**Quotes that didn't make the cut:**
- "They tested over 100 biomarkers" *(Line 7)* — Feature-focused, not emotional
- "My cortisol was all over the place" *(Line 8)* — Too short alone, requires context about what cortisol is (used in stitched version instead)
- "I found Superpower through a podcast ad" *(Line 6)* — Discovery moment, not compelling standalone

**Compliance flags:**
None. All quotes are verbatim with accurate line numbers. No customer name used (defaulted to anonymous).

**Suggested pairings for carousel:**
- Concepts 4 → 1 → 5 (Frustration → Dismissal → Transformation arc)
- Concepts 7 → 3 → 6 (Symptoms → What was missed → Relief)
```

---

## Quality Checklist

Before delivering extraction, verify:

**Quote Quality:**
- [ ] Each quote passes the Standalone Test (works with zero context)
- [ ] Each quote passes the Substance Check (clearly relates to health, has emotional weight)
- [ ] Each quote passes the "Why Would Anyone Care?" Test — falls into one of: (1) Specific health transformation, (2) Product/feature love, (3) Relatable frustration with clear resolution
- [ ] No insider jargon or Superpower-specific terms
- [ ] No abstract metaphors that require mental translation
- [ ] No vague complaints without payoff (e.g., "doctors don't go into depth" without showing what Superpower revealed)
- [ ] Quotes are punchy but have enough context (beware quotes under 10 words)
- [ ] Each quote targets a different primary desire
- [ ] All quotes are verbatim with accurate line numbers
- [ ] Extracted 5-8 concepts (based on transcript strength)

**Superpower Line & CTA Quality:**
- [ ] Superpower Line only included when it adds value (not on every concept)
- [ ] CTAs are quote-tied, not generic ("Learn more", "Get started")
- [ ] CTAs echo the quote's language or theme
- [ ] CTAs are 2-6 words, punchy, no filler

**Compliance:**
- [ ] Customer name usage verified (default to anonymous)
- [ ] No quotes edited without [brackets] notation
- [ ] Stitched quotes clearly noted with line numbers
- [ ] Pre-Delivery Review table completed with all YES

---

**Remember:** Static ads live or die on the quote. If the quote doesn't stop the scroll on its own, no amount of beautiful design will save it. Find the gut-punch moments. Preserve them exactly. Let them do the work.

Focus on: **Feelings, benefits, concrete changes, specific discoveries, relatable frustrations.**

Avoid: **Abstract metaphors, vague emotions without context, insider jargon, quotes too short to convey meaning.**
