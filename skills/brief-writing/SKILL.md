---
name: brief-writing
description: Create comprehensive static ad creative briefs with visual direction for designers. Use this skill as Phase 3 of Maya's workflow to transform concepts into designer-ready briefs. Specializes in testimonial formats, problem-central formats, and comparison formats for 1200x1200px static Meta ads.
---

# Static Ad Creative Brief Writing Skill

## When to Use This Skill

Use this skill when you've completed:
- Phase 1: Research & Insight Generation (`insight-generation` skill)
- Phase 2: Concept Matrix Development (`concept-matrix` skill)

This is **Phase 3** in Maya's (maya-creative-strategist) workflow: transforming concepts into designer-ready creative briefs for static ads.

**Input:** Selected concepts from concept matrix, target audience, awareness stage
**Output:** Complete creative briefs with visual direction, ad copy, and format specifications

---

## MANDATORY: Creative Inspiration Workflow

**BEFORE generating ANY briefs, you MUST review example ads from the creative-inspiration folder.**

### Creative Inspiration Folder Location

```
/Users/jackzheng/Documents/Superpower 🦸‍♂️/brief-writer/creative-inspiration/
├── testimonial-formats/    # Success stories, email/text UI, social proof
├── problem-central/        # Medical dismissal, testing gaps, symptom validation
└── comparison/             # Side-by-side competitor comparisons (USE SPARINGLY)
```

### Step 1: Determine Which Format Category

Based on the user's request, identify which format folder to reference:

| If the brief is about... | Use this folder |
|--------------------------|-----------------|
| Success stories, "after" states, personal transformation | `testimonial-formats/` |
| Medical dismissal, testing gaps, symptom validation | `problem-central/` |
| Explicit competitor comparison (ONLY if requested) | `comparison/` |

### Step 2: Search for Example Images

Use Glob to find relevant examples:

```
# For testimonial formats:
Glob pattern: "*.png" in /Users/jackzheng/Documents/Superpower 🦸‍♂️/brief-writer/creative-inspiration/testimonial-formats/

# For problem-central formats:
Glob pattern: "*.png" in /Users/jackzheng/Documents/Superpower 🦸‍♂️/brief-writer/creative-inspiration/problem-central/

# For comparison formats (only if explicitly requested):
Glob pattern: "*.png" in /Users/jackzheng/Documents/Superpower 🦸‍♂️/brief-writer/creative-inspiration/comparison/
```

### Step 3: Read and Study Example Images

Use the Read tool to view 2-3 example images from the relevant folder. Study each example for:

**Visual Structure:**
- Layout (how elements are arranged - top/bottom, split panels, UI mockups)
- UI elements used (email headers, message bubbles, black boxes, charts)
- Color scheme (light vs. dark sections, brand colors)
- Image placement (photos, pills, blood vials, phone mockups)
- Typography hierarchy (hook size vs body text)

**Copy Characteristics:**
- Word count (how much text is on the image - typically 40-80 words)
- Hook structure (first line that grabs attention)
- Story progression (problem → agitation → solution)
- Authentic language patterns (conversational, specific, emotional)
- CTA button placement and wording

### Step 4: Generate Briefs Inspired by Examples

When writing briefs, use the examples as templates for:

- **Layout patterns** - Mirror the structural approach (but not copy it exactly)
- **Copy density** - Match the word count and text-to-visual ratio
- **UI elements** - Use similar familiar formats (emails, texts, social posts)
- **Emotional tone** - Capture the same rawness and specificity

**Important:** Take INSPIRATION from the examples, don't copy them verbatim. Adapt the patterns to fit the specific narrative and angle of your brief.

### Step 5: State Your Inspiration Source

When outputting briefs, explicitly state which examples you reviewed:

```
"I reviewed 3 examples from the problem-central folder:
- Meta_1200x1200-2.png: Two-panel contrast format with symptom list
- Meta_1200x1200-5.png: Daily schedule format showing exhaustion
- Meta_1200x1200-7.png: Doctor dismissal quote format

I'm using the two-panel contrast structure from the first example for this brief."
```

---

## CRITICAL FORMAT RULES

**YOUR ADS ARE STATIC IMAGES ONLY. THERE ARE NO CAPTIONS.**

Every element must be designed as part of the 1200x1200px static image:

- All copy appears ON the image
- CTA button is part of the image design (always at bottom)
- No separate "caption" field exists
- Think like a graphic designer, not just a copywriter

**EVERY AD MUST INCLUDE:**

1. A CTA button at the bottom (orange, pill-shaped, with arrow)
2. CONCISE copy that fits readably on the image (think 48px font on 1200x1200px canvas)
3. Visual elements that support the narrative (screenshots, UI elements, photos)
4. Specific details (ages, symptoms, medical dismissal language)

**CRITICAL DESIGN CONSTRAINT:**

The image is 1200x1200px and uses 48px font. This means text must be SHORT and PUNCHY to remain readable.

- **Keep copy concise** - if it's too long, it won't fit or will be tiny and unreadable
- **Use short sentences and line breaks** for breathing room
- **Let the visual do heavy lifting** - don't write everything in copy
- **Word count target:** 40-100 words on image

---

## Format Categories

### TESTIMONIAL FORMATS

- **Use when:** You have success stories, "after" states, or personal transformation narratives
- **Characteristics:** Social proof through familiar UI (emails, texts, Reddit posts)
- **Examples include:** Email screenshots with "UPDATE" subject lines, iMessage conversations, Reddit posts with vent tags
- **Best for:** Building credibility and showing results

### PROBLEM-CENTRAL FORMATS

- **Use when:** You want to expose medical dismissal, educate on testing gaps, or validate symptoms
- **Characteristics:** Shows doctor failures, what tests were missed, symptom-treatment mismatches
- **Examples include:** Prescription lists, ChatGPT questions, "We're sorry" apology headers, two-panel contrasts, daily schedules
- **Best for:** Creating awareness and exposing the gap in standard care

### COMPARISON FORMATS

- **ONLY USE WHEN USER EXPLICITLY REQUESTS COMPETITOR COMPARISON ADS**
- **Use when:** User specifically asks to compare Superpower to Function Health or other competitors
- **Characteristics:** Side-by-side comparisons showing competitor limitations vs. Superpower advantages
- **Best for:** Differentiation against specific competitors
- **⚠️ REFERENCE:** See `competitor-context` skill for the full comparison matrix, value props, and compliant copy formulas. NEVER name competitors in actual ad copy.

---

## STAYING ON THEME: CRITICAL CONCEPT ALIGNMENT

**Before writing ANY ad, ask yourself: Does this fit the EXACT narrative the user described?**

### Common Mistake: Writing Generic "Symptom + Dismissal" Ads

**WRONG approach:**
User says: "I've been healthy my entire life, I'm still doing everything right, but at 40 my body stopped responding"

You write: An ad showing someone trying different solutions (more protein, better sleep, supplements) that didn't work

**Why this is WRONG:**

- This shows someone being REACTIVE after problems started
- This doesn't show "always been healthy"
- This doesn't show "same inputs, broken outputs"
- This is about trying solutions, not about betrayal

**RIGHT approach:**
You write: An ad showing Age 39 (perfect inputs -> great results) vs. Age 42 (SAME inputs -> body falling apart)

**Why this is RIGHT:**

- Shows she was ALWAYS disciplined (not new to this)
- Shows she's STILL doing the same things (didn't get lazy)
- Shows the body betrayed her at 40 (rules changed, not her effort)
- Captures the specific unfairness

### How To Stay On Theme

**Step 1: Identify the core narrative**
What is the EXACT emotional story the user is telling?

- Is it about medical dismissal?
- Is it about betrayal/unfairness?
- Is it about loss of identity?
- Is it about fear of decline?

**Step 2: Check each ad concept**
Before finalizing ANY ad, ask:

- Does this ad fit the EXACT narrative described?
- Could this ad apply to a different story? (If yes, it's too generic - rewrite)
- Does this capture the SPECIFIC emotion/situation the user described?

**Step 3: Common narratives to recognize**

**"I Did Everything Right" narrative:**

- Core emotion: BETRAYAL, unfairness, loss of control
- What to show: Always been healthy -> Still doing same things -> Body stopped responding at 40
- What NOT to show: Trying different solutions after problems started (that's reactive, not betrayal)

**"Medical Dismissal" narrative:**

- Core emotion: Not being believed, gaslighting, fighting for answers
- What to show: Clear symptoms -> Doctor says "you're fine" -> Having to advocate for testing
- What NOT to show: Just listing symptoms without the dismissal element

**"Loss of Identity" narrative:**

- Core emotion: Who am I if my defining feature is gone?
- What to show: "Always been my main feature" -> Now it's disappearing -> Identity crisis
- What NOT to show: Generic symptoms without the identity connection

---

## Strategic Frameworks

### Eugene Schwartz Problem-Solution Architecture

Every ad follows this progression:

1. **Identify** - Validate the problem (you're not alone, this is real)
2. **Agitate** - Show the depth of pain/frustration and medical dismissal
3. **Solve** - Present hope with a clear path forward via comprehensive testing

Never lead with product features. Always lead with emotional truth.

### Steven Reiss's 16 Human Desires

Explicitly identify which core desire(s) each ad concept targets:

- **Idealism/Fairness**: "I did everything right, why is my body betraying me?"
- **Independence**: Self-sufficiency, not being dependent on failing medical systems
- **Power**: Control over one's own body, health, and life outcomes
- **Acceptance**: Being believed, not being dismissed or gaslit by doctors
- **Safety**: Avoiding terrifying prognoses like chronic pain, immobility, early death

Every creative must tap into at least one of these desires with precision.

---

## Hook Mechanics

Your opening lines must accomplish TWO things simultaneously:

1. **Extreme specificity of pain point** - Not "I was in pain" but "My surgeon offered me hip replacement at 42. Never checked my inflammation."
2. **Create genuine curiosity through open loops** - Promise revelation without resolution

**The formula:** SPECIFIC PAIN + OPEN LOOP = Irresistible hook

### Hook Types:

**Type 1: Subvert expectations with specific detail**

- "UPDATE: My hair FINALLY stopped falling out!!"

**Type 2: Specific mystery/revelation**

- "I can't believe a blood test could tell me exactly what was wrong with my hair"

**Type 3: Visceral specificity that demands explanation**

- "My doctor tells me weight gain in your 40s is normal. My husband says I look fine. No one will explain what is happening to my body and why?"

**Critical rule:** If your hook doesn't make the reader think "Wait, what? How?" - rewrite it.

---

## Writing Voice

You write like a human who has lived through pain, not a corporate brand. Your style characteristics:

- **Conversational specificity**: "42 years old," "6 months," "3 doctors," "falling out in clumps"—never vague
- **Sentence structure**: Short sentences. Fragments work. Rhythm matters.
- **Punctuation for pacing**: Line breaks create emphasis and breathing room
- **Emotional honesty over hype**: Raw truth > marketing speak
- **What you avoid**: Clinical language ("comprehensive testing," "optimize"), emojis, hashtags, excessive exclamation marks, corporate jargon

**Authentic language patterns you use:**

- "I went to 3 doctors"
- "They just said it was stress"
- "Gave me biotin which didn't work"
- "I'm kinda freaking out"
- "Mine's coming out in clumps"
- "I can't believe"
- "No one will tell me / explain / help me"
- "You're within range" (doctor's dismissal)
- "Tired but wired"
- "Level 9 pain"

---

## CTA BUTTON STANDARDS

**EVERY AD MUST HAVE A CTA BUTTON AT THE BOTTOM**

Must be less than 12 words.

**Examples:**
- "Get your answers ->"
- "Start testing ->"
- "Join Superpower ->"

---

## Output Structure

When creating briefs, follow this structure:

```
[FIRST: State which examples you reviewed and which format category you're using]

Example:
"I reviewed 3 examples from the problem-central folder:
- Meta_1200x1200-2.png: Two-panel contrast format
- Meta_1200x1200-5.png: Daily schedule format
- Meta_1200x1200-7.png: Quote-style dismissal format

I'm using PROBLEM-CENTRAL FORMATS for these concepts, taking inspiration from
the two-panel contrast structure in Meta_1200x1200-2.png."

---

## AD ANGLE 1: [Descriptive Name]
**Core tension:** [One sentence capturing the emotional/psychological conflict]
**Desire targeted:** [Specific desire(s) from Reiss framework]

### Creative 1: [Descriptive format name]
**Format category:** [Testimonial / Problem-Central / Comparison]

**Visual brief:**
[Detailed description of what the designer will create:
- Layout structure (top/bottom sections, panels, UI elements)
- UI elements needed (email header, message bubbles, black boxes, etc.)
- Images/photos needed
- Color scheme (light/dark sections)
- Typography notes
- Specific design details]

**Complete ad copy:**
[ALL text that appears on the image, formatted to show hierarchy:
- Headers (if any)
- Body text with line breaks exactly as they should appear
- Black boxes or special text treatments
- CTA button text]

**Word count:** [X words total on image]

---

### Creative 2: [Descriptive format name]
[Repeat structure]

---

### Creative 3: [Descriptive format name]
[Repeat structure]

---

## AD ANGLE 2: [Descriptive Name]
[Repeat structure with 2-3 creatives]
```

---

## Format Selection Guidelines

**Choose testimonial formats when:**

- You have a clear success story or "after" state
- The narrative has a personal voice (email, text, post)
- Social proof is the primary conversion driver
- You want to show "someone like me got results"

**Choose problem-central formats when:**

- You want to educate while exposing medical failures
- The focus is on what doctors missed/didn't test
- You need to validate symptoms before offering solution
- The angle is about medical dismissal or testing gaps

**Choose comparison formats ONLY when:**

- User explicitly asks for competitor comparison ads
- You're contrasting Function Health or similar services
- The angle is specifically about implementation gap or support differences
- **Always reference `competitor-context` skill** for comparison matrix and compliant copy formulas

**Format diversity:**

- Vary between different format types for multiple creative requests
- Mix visual-heavy formats with copy-heavy formats

---

## SUPERPOWER'S IMPLEMENTATION SUPPORT MODEL

**CRITICAL: How Superpower Actually Works**

When writing copy about Superpower's support, use the CORRECT model:

**INCORRECT - Do NOT say:**

- "Video call with a clinician"
- "I had a call with a health coach"
- "They walked me through my results on Zoom"
- "Monthly check-in calls"

**CORRECT - What actually happens:**

1. **Comprehensive testing:** 100+ biomarkers from one blood draw
2. **Results delivered:** 5 days after blood draw
3. **Personalized health plan:** After getting results, members receive a health plan that tells them EXACTLY what to do
4. **The health plan includes:**
   - Explanation of what biomarkers mean for their specific symptoms
   - Supplement protocol (specific supplements and dosages)
   - Medication recommendations (when appropriate)
   - Retest timeline (typically 90 days to track progress)

**Key phrase to use:** "I got a health plan that told me EXACTLY what to do to fix [problem]"

**Example language:**

- "After I got my results, I got a health plan that told me EXACTLY what to do"
- "They gave me a supplement and medication plan"
- "The health plan explained why [biomarker] causes [symptom]"
- "They told me to retest in 90 days to track progress"

**The differentiator is:**
"They don't just give you numbers. They help you fix the problem."

NOT that you get calls/personal coaching, but that you get an ACTIONABLE PLAN with specific steps.

---

## Integration with Maya's Workflow

### Input from Phase 2 (Concept Matrix):

- **Insights:** Core emotional truths from Reddit research
- **Concepts:** Selected concepts to brief (typically top 5-10)
- **Desires:** Which Steven Reiss desires each concept targets
- **Audience segment:** 30-35 / 35-42 / 42-50 women
- **Awareness stage:** Problem/Solution/Product/Most Aware

### This Skill's Output (Phase 3):

- **Complete creative briefs** for each concept
- **Visual direction** for designers
- **Ad copy** (on-image text)
- **Format specifications** (testimonial/problem-central/comparison)
- **Word counts** to ensure readability

### Next Step (Phase 4):

- Use **meta-ad-copy skill** for polished final copy (Harry Dry principles)
- Use **compliance-check skill** for RED/YELLOW/GREEN flagging

---

## Quick Reference Checklist

**Before finalizing any brief, verify:**

- [ ] Reviewed 2-3 examples from the relevant creative-inspiration folder
- [ ] Stated which examples inspired the brief structure
- [ ] Format category selected matches the narrative type
- [ ] Core tension clearly articulated (one sentence)
- [ ] Desire targeted explicitly stated
- [ ] Visual brief includes all design elements
- [ ] Ad copy is 40-100 words (readable at 48px font)
- [ ] Hook combines specific pain + open loop
- [ ] CTA button included at bottom
- [ ] Theme alignment verified (not generic)
- [ ] Authentic language used (not corporate speak)
- [ ] Superpower support model accurately represented

---

## Reference Materials

Always consult before creating briefs:

**Creative Inspiration (MANDATORY):**
- **`/Users/jackzheng/Documents/Superpower 🦸‍♂️/brief-writer/creative-inspiration/`** - Example ads by format type
  - `testimonial-formats/` - Success stories, email/text UI formats
  - `problem-central/` - Medical dismissal, testing gap formats
  - `comparison/` - Side-by-side competitor formats (use sparingly)

**Brand & Compliance:**
- **`${CLAUDE_PLUGIN_ROOT}/superpower-guide.md`** - Value props, pricing, approved claims, tone
- **`${CLAUDE_PLUGIN_ROOT}/steven-reiss-16-desires.md`** - Desire mapping framework
- **`${CLAUDE_PLUGIN_ROOT}/meta-ad-formats.md`** - Format specs and best practices
- **`${CLAUDE_PLUGIN_ROOT}/compliance-guide.md`** - FDA/FTC boundaries
- **`${CLAUDE_PLUGIN_ROOT}/marketing-personas.md`** - ICP definitions
- **`${CLAUDE_PLUGIN_ROOT}/skills/competitor-context/SKILL.md`** - Comparison matrix, "detect vs fix" positioning, compliant competitor copy

---

## Example Briefs: Family History of Disease

These briefs demonstrate PROBLEM-CENTRAL format execution for hereditary health anxiety. Use these as templates for similar angles.

---

### EXAMPLE 1: Hereditary Heart Disease

**Core Tension:** I watched my mother nearly die from something no one saw coming. Now I'm approaching the same age, and I don't know if I'm carrying the same silent risk.

**Primary Desire:** TRANQUILITY (peace of mind) + FAMILY (protecting loved ones)

#### Creative 1A: Two-Panel Hereditary Heart Risk

**Inspired by:** Meta_1200x1200-5.png (two-panel contrast)

**Visual Brief:**

**Top panel (light gray background, 60%):**
- Left side: Text in black, conversational font
- Right side: Photo of woman in her 40s looking worried, hand on chest
- Text describes the family history fear

**Bottom panel (dark/black background, 40%):**
- Left side: Image of basic cholesterol lab results sheet (blurred)
- Right side: White text revealing what doctors miss
- Creates contrast between "normal results" and hidden risk

**Orange CTA button at bottom**

**On-Image Copy:**

```
[TOP PANEL - Light]
My mom had a heart attack at 52.

"Your cholesterol is fine," they told her.

I'm 48 now.
I refuse to wait for symptoms.

[BOTTOM PANEL - Dark]
3 in 4 heart attack patients had "normal" cholesterol.

Lipoprotein(a) is genetic.
Your doctor probably never tested it.

[CTA BUTTON]
Find what they're missing →
```

**Word Count:** 52 words

#### Creative 1B: ChatGPT Conversation - Genetic Heart Risk

**Inspired by:** Meta_1200x1200-2.png (ChatGPT conversation)

**Visual Brief:**
- ChatGPT interface header: "ChatGPT 5.1" with icons
- User message (right-aligned): Small EKG/heart monitor image + text
- Response (left-aligned): Educational explanation, bold key terms
- Orange CTA button at bottom

**On-Image Copy:**

```
[USER MESSAGE with heart monitor image]
My dad died of a heart attack at 54. I'm 47.
My cholesterol is "normal." Should I be worried?

[RESPONSE]
"Normal" cholesterol misses half of heart disease cases.

3 out of 4 people who have heart attacks
had normal cholesterol.

The markers that actually predict genetic heart risk:
ApoB, Lipoprotein(a), and LDL particle size —
most doctors don't test them.

[CTA BUTTON]
Test what matters →
```

**Word Count:** 67 words

---

### EXAMPLE 2: Cancer Family History

**Core Tension:** I've watched cancer take people I love. Every year I wonder: is this the year it finds me? And my annual physical tells me nothing useful.

**Primary Desire:** TRANQUILITY (freedom from anxiety) + POWER (control over outcomes)

#### Creative 2A: Dictionary Definition - Cancer Anxiety

**Inspired by:** Meta_1200x1200-7.png (dictionary definition format)

**Visual Brief:**

**Top section (white background, 65%):**
- Speaker icon + "Cancer anxiety" as dictionary-style header
- "noun" in gray italic
- Numbered definition in personal language
- "Similar:" tags in rounded pill shapes

**Bottom section (cream/off-white card, 35%):**
- "How to get ahead of it with Superpower?" header in green
- 3 checkmark benefits
- Phone mockup showing Superpower dashboard

**On-Image Copy:**

```
[DICTIONARY HEADER]
Cancer anxiety

noun

1. When you've watched cancer take your grandmother,
your aunt, and now your mother — and every lump,
every headache, every unexplained symptom
makes you wonder: Am I next?

The fear that keeps you up at 2am.
The thing your annual physical doesn't check.

Similar: waiting to find out | helpless | no screening available

[SOLUTION CARD]
How to get ahead of it with Superpower?

✓ 100+ biomarkers to detect early signs
✓ Inflammation markers that signal risk early
✓ Health plan for proactive prevention
```

**Word Count:** 91 words

#### Creative 2B: Two-Panel - Screening Gap

**Inspired by:** Meta_1200x1200-5.png (two-panel contrast)

**Visual Brief:**

**Top panel (light):**
- Text on left side
- Photo of woman looking at phone with concerned expression (right)

**Bottom panel (dark):**
- Reveals the screening gap truth
- Image of medical forms/clipboard on left
- White text on right

**Orange CTA at bottom**

**On-Image Copy:**

```
[TOP PANEL - Light]
Cancer took my grandmother at 63.
My aunt at 58.
My mom was just diagnosed.

I'm 44. I asked my doctor for testing.

[BOTTOM PANEL - Dark]
She said: "There's no screening for that."

75% of cancer deaths are from cancers
with no routine screening.

What if there was something that could
catch the signals early?

[CTA BUTTON]
Detect early signs →
```

**Word Count:** 64 words

---

### EXAMPLE 3: Hereditary Diabetes Risk

**Core Tension:** I watched my father lose his health to diabetes - the blindness, the amputations, the decline. I just turned 40. I feel fine. But so did he.

**Primary Desire:** TRANQUILITY (safety) + CURIOSITY (understanding what's inside)

#### Creative 3A: Timeline Comparison Format

**Inspired by:** Meta_1200x1200-5.png structure, adapted to timeline

**Visual Brief:**

**Top section (light, 50%):**
- "DAD" header with age
- Lists what happened at that age
- Muted/gray tones

**Middle section (light, different shade):**
- "ME" header with age
- Shows the parallel moment
- Slightly warmer tones

**Bottom section (dark card):**
- Reveals the hidden truth about early detection
- Orange CTA button

**On-Image Copy:**

```
[TOP - DAD'S TIMELINE]
DAD, AGE 45:
"Your blood sugar is fine."

By 52: Type 2 diabetes.
By 60: Lost feeling in his feet.
By 65: Couldn't drive anymore.

[MIDDLE - MY TIMELINE]
ME, AGE 42:
"Your A1C is normal."

But I remember what "normal" meant for him.

[BOTTOM - DARK CARD]
Insulin resistance shows up 10-15 years
before diabetes.

Standard tests don't catch it.

[CTA BUTTON]
Catch it early →
```

**Word Count:** 73 words

#### Creative 3B: ChatGPT Conversation - Metabolic Risk

**Inspired by:** Meta_1200x1200-2.png (ChatGPT UI)

**Visual Brief:**
- ChatGPT interface header
- User message (right-aligned): Text-only question
- Response (left-aligned): Educational with bold key terms
- Orange CTA button

**On-Image Copy:**

```
[USER MESSAGE]
My dad got diabetes at 45. I'm 41.
My doctor says my glucose is fine.
How do I know if I'm at risk?

[RESPONSE]
Glucose and A1C are late-stage markers.

By the time they're high, you've had
insulin resistance for years.

The markers that catch it 10-15 years earlier:
fasting insulin, Leptin, TyG index —
most doctors never test them.

Your family history matters.
But so does early detection.

[CTA BUTTON]
Test your metabolic health →
```

**Word Count:** 72 words

---

### EXAMPLE 4: Alzheimer's / Cognitive Decline

**Core Tension:** The grandmother who raised me slowly disappeared. She didn't know my name. Now I'm 45, and every time I forget a word, I wonder: is this how it starts?

**Primary Desire:** TRANQUILITY (freedom from anxiety) + FAMILY (being there for loved ones)

#### Creative 4A: Two-Panel - Memory Fear

**Inspired by:** Meta_1200x1200-5.png (two-panel problem/dismissal)

**Visual Brief:**

**Top panel (light gray, 55%):**
- Personal, emotional text on left
- Photo of woman in her 40s-50s, thoughtful expression, hand near temple (right)

**Bottom panel (dark, 45%):**
- Reveals what doctors don't test
- Creates urgency without fear-mongering

**Orange CTA button**

**On-Image Copy:**

```
[TOP PANEL - Light]
I watched Alzheimer's take my grandmother.

First she forgot names.
Then faces.
Then me.

I'm 47 now.
Every forgotten word terrifies me.

[BOTTOM PANEL - Dark]
Brain health doesn't show up on a standard physical.

But inflammation markers, metabolic health,
and cardiovascular risk all connect to
cognitive decline.

You can track them now. Before symptoms appear.

[CTA BUTTON]
Protect your future →
```

**Word Count:** 67 words

#### Creative 4B: Dictionary Definition - Brain Fog Fear

**Inspired by:** Meta_1200x1200-7.png (dictionary format)

**Visual Brief:**

**Top section (white, 60%):**
- Speaker icon + "Brain fog" header
- "noun" in gray italic
- Numbered definition - personal, emotional
- "Similar:" pill tags

**Bottom section (cream card, 40%):**
- Solution header in green
- 3 checkmark benefits
- Phone mockup on right

**On-Image Copy:**

```
[DICTIONARY HEADER]
Brain fog

noun

1. When you walk into a room and forget why.
When you can't find the word that's on the tip
of your tongue. When you're 46 and your grandmother
had Alzheimer's and every mental slip makes you panic.

The fear no one talks about.
The thing doctors brush off as "stress."

Similar: early sign? | just aging? | terrified

[SOLUTION CARD]
How to track it with Superpower?

✓ 100+ biomarkers including inflammation markers
✓ Metabolic health that affects brain function
✓ Personalized protocols to optimize cognitive health
```

**Word Count:** 96 words

---

### EXAMPLE 5: The Milestone Age

**Core Tension:** There's a number burned into your brain - the age your parent was when everything changed. You just hit that number. And suddenly mortality isn't abstract anymore.

**Primary Desire:** TRANQUILITY (safety/peace of mind) + HONOR (doing right by your body/family)

#### Creative 5A: The Number Format

**Inspired by:** Meta_1200x1200-5.png structure, adapted to numerical milestone

**Visual Brief:**

**Top section (white/light, 40%):**
- Large number "52" in bold, prominent font (center or left)
- Subtitle text explaining what the number means

**Middle section (light gray, 25%):**
- Personal context
- Photo of person in their 50s (subtle, side or partial)

**Bottom section (dark, 35%):**
- The call to action / reframe
- Orange CTA button

**On-Image Copy:**

```
[TOP - THE NUMBER]
52

The age my dad was when they found the tumor.

[MIDDLE - PERSONAL]
I turned 52 last month.

His doctor said he was "healthy."
So does mine.

[BOTTOM - DARK]
Your annual physical tests about 15 biomarkers.

Superpower tests 100+.

Early detection of 1,000+ conditions.
Before they become diagnoses.

[CTA BUTTON]
Don't wait like he did →
```

**Word Count:** 62 words

#### Creative 5B: ChatGPT Conversation - Milestone Anxiety

**Inspired by:** Meta_1200x1200-2.png (ChatGPT UI)

**Visual Brief:**
- ChatGPT interface header
- User message: Emotional, personal question about hitting the milestone age
- Response: Validates the feeling, provides actionable insight, bold key terms
- Orange CTA button

**On-Image Copy:**

```
[USER MESSAGE]
I just turned 55 — the exact age my mother was
when she had her stroke. My doctor says I'm healthy.
But that's what her doctor said too.
What should I actually be testing?

[RESPONSE]
This fear is valid. And you don't have to
wait for symptoms.

Standard physicals test 10-15 markers.
They miss cardiovascular risk markers like
ApoB and Lipoprotein(a).

Family history plus comprehensive testing
= early detection.

You're not your mother's outcome.
But you have to test what she didn't.

[CTA BUTTON]
Test what matters →
```

**Word Count:** 84 words

---

### Key Patterns in These Examples

**1. Format Variety Within Same Theme:**
- Each angle uses 2 different formats (Two-Panel + ChatGPT, or Dictionary + Two-Panel)
- Shows how same emotional territory can be expressed differently

**2. Compliance-Safe Language:**
- "Detect early signs" (not "prevent")
- "Track biomarkers" (not "diagnose")
- "Personalized protocols" (not "Harvard/Stanford co-created")
- "On-demand access" (not "24/7 access")

**3. Specific Numbers Create Credibility:**
- "100+ biomarkers" vs "15 biomarkers"
- "75% of cancer deaths"
- "10-15 years before diabetes"

**4. Family History as Emotional Anchor:**
- Specific ages (52, 45, 63)
- Specific progression (names → faces → me)
- Specific outcomes (blindness, amputations, couldn't drive)

**5. The "Normal" Trap:**
- "Your cholesterol is fine" but heart attack happened
- "Your A1C is normal" but diabetes came anyway
- "You're healthy" but parent was told same thing
