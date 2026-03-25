---
name: landing-page-copy
description: Apply David Ogilvy's research-driven, benefit-focused, long-form copywriting principles to create educational content, landing pages, and headline test variations. Complements Harry Dry (short-form) and Eugene Schwartz (awareness stages). Use for "long-form copy", "landing page", "Ogilvy-style", or "headline testing methodology".
---

# David Ogilvy Copywriting Framework

**Purpose:** Transform research into benefit-focused long-form copy and high-volume headline variations.

**When to use this skill:**
- User asks for "landing page", "long-form", "Ogilvy-style", "educational content"
- Need 10-20 headline variations for testing (vs 3-5 quick options)
- Complex objection handling requires detailed explanation
- Mechanism needs thorough substantiation

**When NOT to use:**
- Short-form Meta ads (use Harry Dry's meta-ad-copy skill instead)
- Quick concept generation (use concept-matrix skill)
- Strategic audience/awareness mapping (use Eugene Schwartz frameworks directly)

---

## 1. Research-Driven Copy Methodology

**Ogilvy's core principle:** "When I write an ad, I don't want you to tell me that you find it 'creative.' I want you to find it so interesting that you buy the product."

### Research Workflow

**Step 1: Gather User Data**
Use PostHog MCP tools to query actual member behavior:
```
- What pages do converters visit before checkout?
- What biomarkers do members search for most?
- Where do users drop off in the funnel?
- What questions does care team get asked most?
```

**Step 2: Competitive Research**
Use WebSearch to analyze competitor messaging:
```
- Function Health: What objections do they address?
- Concierge medicine: What value props do they lead with?
- Standard lab testing: What pain points do reviewers mention?
```

**Step 3: Clinical Validation**
Reference `${CLAUDE_PLUGIN_ROOT}/superpower-guide.md` for approved claims:
```
- What can we prove? (100+ biomarkers, $199 pricing, 1,000+ conditions)
- What needs hedging? (early detection, optimization language)
- What's prohibited? (prevent, cure, diagnose)
```

### Output: Research Briefing Document

```markdown
## Research Brief: [Topic]

**User Behavior Insights (PostHog):**
- [Quantified finding from member data]
- [Conversion path analysis]
- [Common drop-off points]

**Competitive Gaps:**
- [What Function Health doesn't address]
- [What concierge medicine overcomplicates]
- [What standard labs miss entirely]

**Substantiation:**
- [Approved claims from `${CLAUDE_PLUGIN_ROOT}/superpower-guide.md` with sources]
- [Clinical credentials we can mention]
- [Specific numbers: biomarkers, pricing, locations]

**Recommended Approach:**
- [Headline angle based on research]
- [Objections to address explicitly]
- [Mechanism explanation strategy]
```

---

## 2. Benefit-Focused Headlines

**Ogilvy's principle:** "On average, five times as many people read the headline as read the body copy. When you have written your headline, you have spent eighty cents out of your dollar."

### The 5 Ogilvy Headline Formulas (Adapted for Superpower)

**Formula 1: "How to" + Specific Benefit**
```
Structure: How to [DESIRED OUTCOME] without [COMMON OBSTACLE]

Examples:
✅ "How to find out why you're tired without waiting months for a doctor"
✅ "How to track 100+ health markers without multiple appointments"
✅ "How to optimize your hormones without guesswork"

Harry Dry compatibility check:
- Visualizable? ✅ (can picture the outcome)
- Falsifiable? ✅ (specific, measurable)
- Unique? ✅ (mechanism: 100+ markers, on-demand access)
```

**Formula 2: News + Specificity**
```
Structure: [NEW DEVELOPMENT] makes [OUTCOME] possible for [AUDIENCE]

Examples:
✅ "New $199 blood panel detects early signs of 1,000+ conditions"
✅ "Comprehensive biomarker testing (once $15,000) now $199/year"
✅ "Why 30+ women are switching from annual physicals to preventive testing"

Harry Dry compatibility check:
- Visualizable? ✅ (price comparison, specific number)
- Falsifiable? ✅ (verifiable pricing)
- Unique? ✅ (price positioning)```

**Formula 3: Curiosity + Mechanism**
```
Structure: [SURPRISING FACT] reveals why [PROBLEM EXISTS]

Examples:
✅ "Your 'normal' lab results might be hiding 100+ critical biomarkers"
✅ "Why standard physicals test 20 markers when optimal health requires 100+"
✅ "The biomarkers your annual checkup doesn't measure (and why they matter)"

Harry Dry compatibility check:
- Visualizable? ✅ (gap between 20 and 100+ markers)
- Falsifiable? ✅ (specific numbers)
- Unique? ✅ (mechanism revelation)
```

**Formula 4: Testimonial-Style (Problem → Solution)**
```
Structure: [RELATABLE PROBLEM QUOTE] Here's what they discovered...

Examples:
✅ "I was exhausted for years. My doctor said I was fine. Here's what 100+ biomarkers revealed."
✅ "Annual physicals missed it. Superpower caught it early. Here's my story."
✅ "I spent $5,000 on concierge medicine. Then I found the same testing for $199."

Harry Dry compatibility check:
- Visualizable? ✅ (clear before/after)
- Falsifiable? ✅ (specific price comparison)
- Unique? ✅ (personal proof of mechanism)
```

**Formula 5: Direct Address + Promise**
```
Structure: If you [QUALIFYING CONDITION], you deserve [SPECIFIC OUTCOME]

Examples:
✅ "If you're tired of being told you're fine, track what your doctor doesn't test"
✅ "If you're 30+ and proactive about health, test what matters (not just what's standard)"
✅ "If you value your health enough to optimize it, start with 100+ biomarkers"

Harry Dry compatibility check:
- Visualizable? ✅ (target audience can self-select)
- Falsifiable? ✅ (specific mechanism promise)
- Unique? ✅ (qualification + differentiation)
```

---

## 3. Long-Form Educational Copy Structure

**When to use long-form:**
- Landing pages (homepage, how it works, pricing pages)
- Blog posts explaining mechanism or addressing objections
- Email nurture sequences for problem-aware audience

**When NOT to use:**
- Meta ads (use 10-15 word sentences, Harry Dry style)
- Social posts (use concept-matrix skill for short-form)

### The 8-Part Ogilvy Structure

**1. Headline (3-8 words)**
Use one of the 5 formulas above. Test multiple variations.

**2. Subhead (8-12 words)**
Expand on promise or add specificity:
```
Headline: "How to find out why you're tired without waiting for a doctor"
Subhead: "Track 100+ biomarkers in one blood draw. Get answers in 5-10 days."
```

**3. Credibility Signals (1-2 sentences)**
Establish authority immediately after hook:
```
✅ "Superpower's care team includes Dr. Anant Vinjamoori (Harvard MD & MBA, Chief Longevity Officer)"
✅ "2,000+ lab partner locations nationwide. Available in 39 states."
✅ "Early detection capabilities for 1,000+ conditions in a single blood draw."
```

**4. Problem Elaboration (2-3 paragraphs)**
Describe pain point with specificity (use Reddit research language):
```
You know something's off. You're exhausted by 2pm. Your hormones feel imbalanced. 
Brain fog makes simple tasks harder than they should be.

Your doctor runs labs. Everything comes back "normal." But normal ranges are designed 
to catch disease, not optimize health. The average annual physical tests 20-30 biomarkers. 
That's enough to flag major problems, but not enough to find what's draining your energy.

You're not imagining it. You're just not getting the full picture.
```

**5. Mechanism Explanation (2-4 paragraphs)**
Show HOW your solution works (Schwartz-style enlarged mechanism):
```
Superpower tests 100+ biomarkers in a single blood draw. We're talking hormones 
(thyroid, cortisol, testosterone, estrogen), inflammation markers, metabolic health, 
cardiovascular indicators, nutrient levels, and liver/kidney function.

The testing happens at 2,000+ lab partner locations nationwide—less than 15 minutes, 
no wait times. Results in 5-10 business days.

Then our care team interprets your results and builds your personalized protocol. 
Diet changes. Lifestyle adjustments. Supplement recommendations (up to 20% off through 
our marketplace). Prescription access when needed.

Most companies stop at testing. We go further: Diagnostics → Protocols → Marketplace action.
```

**6. Proof/Social Validation (1-2 paragraphs)**
Use approved statistics and credentials:
```
Early detection capabilities for 1,000+ conditions. Available at $199/year (most states), 
a fraction of what Function Health charges ($400-$499/year) and dramatically less than 
concierge medicine ($10,000-$100,000/year).

On-demand access to Superpower's care team for unlimited messaging. No more waiting 
for your next annual physical to get answers.
```

**7. Objection Handling (1-2 paragraphs per major objection)**
Address top 3 concerns explicitly:
```
**"Isn't this just like my annual physical?"**
Annual physicals test 20-30 biomarkers. Superpower tests 100+ in the same blood draw. 
And we give you a personalized protocol, not just a printout of numbers.

**"Can I afford this?"**
$199/year = $17/month. That's less than two coffee runs. And it's HSA/FSA eligible, 
so you can use pre-tax dollars.

**"Do I need a doctor's order?"**
No. Superpower handles everything. Book online, visit a lab partner location near you, 
get results interpreted by our care team.
```

**8. Strong CTA (1-2 sentences)**
Clear next step with low friction:
```
Start at superpower.com. First blood draw included with membership. 
Results in 5-10 business days. On-demand clinical support from day one.
```

### Length Guidelines by Page Type

**Homepage:** 150-250 words
- Headline + subhead + 2-3 short sections + CTA
- Focus: Mechanism revelation + credibility

**How It Works:** 500-1,000 words
- Full 8-part structure
- Focus: Mechanism explanation + objection handling

**Blog Post (Educational):** 1,200-2,000 words
- Research-driven, expanded mechanism
- Focus: Deep dive on specific biomarker or health topic

---

## 4. Headline Testing Methodology

**Ogilvy's approach:** Write 10-20 headlines minimum. Test the best 5-7.

### Systematic Generation Process

**Step 1: Apply All 5 Formulas**
For a single campaign/page, write 2-4 variations of EACH formula:
```
Formula 1 (How to):
- "How to find out why you're tired without waiting for a doctor"
- "How to track 100+ health markers without multiple appointments"
- "How to optimize your hormones without expensive concierge medicine"

Formula 2 (News):
- "New $199 blood panel detects early signs of 1,000+ conditions"
- "Comprehensive testing (once $15,000) now $199/year"

... (continue for all 5 formulas)
```

**Step 2: Score Each Headline**
Use 4 criteria (1-5 scale each):

| Headline | Clarity | Benefit Specificity | Curiosity | Uniqueness | Total |
|----------|---------|---------------------|-----------|------------|-------|
| Example 1 | 5 | 4 | 3 | 5 | 17 |
| Example 2 | 4 | 5 | 4 | 3 | 16 |

**Criteria definitions:**
- **Clarity (5 = crystal clear, 1 = confusing):** Can target audience understand in 2 seconds?
- **Benefit Specificity (5 = very specific, 1 = vague):** Does it promise concrete outcome?
- **Curiosity (5 = must click, 1 = boring):** Does it create information gap?
- **Uniqueness (5 = only us, 1 = generic):** Could competitor say same thing?

**Step 3: Harry Dry Filter (3-Test Framework)**
Top-scoring headlines must pass:
1. **Visualizable?** Can reader picture the benefit/outcome?
2. **Falsifiable?** Is claim specific enough to verify?
3. **Unique?** Does it differentiate from competitors?

**Step 4: Select for Testing**
- Top 5-7 headlines (score 16+)
- Must represent 3+ different formulas (avoid formula bias)
- Run as A/B tests in Meta Andromeda (high-volume creative rewards variety)

### Integration with Andromeda Creative Strategy

**Why headline volume matters:**
- Andromeda thrives on creative diversity (20-50 ads > 3-5 ads)
- 10-20 headlines × 3-5 body copy variations = 30-100 ad variants
- AI finds winning combinations faster with more inputs

**Workflow:**
1. Generate 10-20 headlines (this skill)
2. Select top 5-7 (this skill)
3. Pair with 3-5 body copy variants (meta-ad-copy skill)
4. Launch as Andromeda campaign (27-35 total ad variants)

---

## 5. Framework Integration Guide

**How Ogilvy, Schwartz, and Harry Dry work together:**

### The 3 Frameworks Explained

**Eugene Schwartz (Strategic Foundation)**
- **What it does:** Maps audience awareness stage + mass desires
- **Output:** Strategic direction - WHO to target, WHAT message to lead with
- **Example:** "Target Solution Aware audience (knows testing exists, hasn't chosen provider), lead with Power desire (control over health)"

**David Ogilvy (Research + Substantiation)**
- **What it does:** Research-driven mechanism explanation, long-form structure, headline testing
- **Output:** Landing pages, educational content, 10-20 headline variations
- **Example:** "How to track 100+ health markers without multiple appointments" + 1,000-word mechanism explanation + proof points

**Harry Dry (Tactical Execution Filter)**
- **What it does:** Mobile-first clarity test for Meta ads
- **Output:** Ruthlessly edited short-form ad copy (2-second comprehension test)
- **Example:** Headline passes 3-test framework → body copy uses 10-15 word sentences → blank lines between sentences

### Combined Workflow Example

**Scenario:** Create landing page + Meta ad campaign for 30-35 women, Solution Aware stage

**Phase 1: Strategy (Schwartz)**
```
- Audience: Solution Aware (knows comprehensive testing exists, comparing providers)
- Primary Desire: Curiosity (wanting to understand body) + Independence (self-reliance)
- Message Angle: Mechanism superiority (100+ vs 20-30 biomarkers) + price advantage ($199 vs $400-$499)
```

**Phase 2: Landing Page (Ogilvy - THIS SKILL)**
```
- Generate 15 headlines using 5 formulas
- Select top 5 for A/B testing
- Write 800-word landing page using 8-part structure:
  * Headline: "How to track 100+ health markers without multiple appointments"
  * Mechanism: Full explanation of blood draw → results → protocols → marketplace
  * Objections: Address "Is this like my annual physical?" and pricing concerns
  * Proof: Credentials, location count, condition detection capabilities
```

**Phase 3: Meta Ads (Harry Dry)**
```
- Take winning headline from landing page tests
- Adapt to mobile-first format:
  * Headline: 3-8 words (same)
  * Hook: 5-10 words ("Track 100+ health markers in one blood draw")
  * Body: 10-15 words per sentence, blank lines between
  * Benefits: 3-4 with ✅, grouped together
- Run through 3-test framework before launch
```

### When to Use Which Framework

| Need | Framework | Output |
|------|-----------|--------|
| Strategic concept development | Schwartz | Awareness stage + desire mapping |
| Long-form landing page | Ogilvy (this skill) | 500-1,000 word educational copy |
| Headline test variations | Ogilvy (this skill) | 10-20 headlines across 5 formulas |
| Research briefing | Ogilvy (this skill) | PostHog data + competitive analysis |
| Meta ad copy | Harry Dry (meta-ad-copy) | Mobile-optimized, ruthlessly edited |

### Quick Decision Tree

```
START: What are you creating?

├─ Landing page / long-form content?
│  └─ YES → Use Ogilvy (this skill)
│      └─ 8-part structure, 500-1,000 words
│
├─ Headline test variations (10-20)?
│  └─ YES → Use Ogilvy (this skill)
│      └─ Apply 5 formulas, score, select top 5-7
│
├─ Meta ad (short-form, mobile)?
│  └─ YES → Use Harry Dry (meta-ad-copy skill)
│      └─ 10-15 word sentences, 3-test framework
│
└─ Strategic audience/desire mapping?
   └─ YES → Use Schwartz frameworks
       └─ Awareness stages + mass desires
```

---

## Quality Checklist

Before finalizing Ogilvy-style copy:

**Research-Driven:**
- [ ] Used PostHog data or WebSearch to inform messaging
- [ ] All claims verified against `${CLAUDE_PLUGIN_ROOT}/superpower-guide.md`
- [ ] Competitive gaps identified and addressed
- [ ] No unverified statistics or prohibited language

**Headlines (if generating variations):**
- [ ] Applied all 5 Ogilvy formulas
- [ ] Generated 10-20 total variations
- [ ] Scored each on 4 criteria (clarity, benefit, curiosity, uniqueness)
- [ ] Selected top 5-7 (score 16+, representing 3+ formulas)
- [ ] Top headlines pass Harry Dry 3-test framework

**Long-Form Structure (if creating landing page/educational content):**
- [ ] Follows 8-part Ogilvy structure
- [ ] Length appropriate for page type (150-250 homepage, 500-1,000 how it works)
- [ ] Mechanism explanation is specific and substantiated
- [ ] Top 3 objections addressed explicitly
- [ ] Credibility signals placed early (after headline/subhead)
- [ ] CTA is clear and low-friction

**Compliance:**
- [ ] Uses approved language only (on-demand access, personalized protocols)
- [ ] No prohibited claims (24/7, Harvard co-creation, prevent/cure/diagnose)
- [ ] All statistics sourced or removed
- [ ] No competitor names in copy

**Framework Integration:**
- [ ] Clear which framework is used for which purpose
- [ ] Ogilvy used for research/long-form (not Meta ads)
- [ ] If generating Meta ads afterward, use Harry Dry skill (not this skill)
