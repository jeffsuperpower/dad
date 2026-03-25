---
name: insight-generation
description: This skill should be used when the user asks to "generate insights", "research pain points", "find audience insights", "analyze Reddit for insights", "discover customer truths", or needs to extract actionable insights from qualitative research for ad creative. Provides methodology for turning Reddit research into strategic insights mapped to desires.
---

# Insight Generation for Creative Strategy

Transform raw qualitative research into actionable creative insights that fuel high-converting ad concepts.

## What Is an Insight?

An **insight** is a non-obvious truth about your audience that, when leveraged, creates an emotional connection. It bridges what they say, what they feel, and what they actually want.

**Components of a Strong Insight:**
```
Observation + Tension + Implication = Insight
```

**Example:**
- **Observation:** 30+ women Google "why am I so tired" repeatedly
- **Tension:** Their doctors say labs are "normal"
- **Implication:** They need validation, not just answers
- **Insight:** "The frustration isn't the fatigue—it's being dismissed"

## Insight Generation Process

### Step 1: Reddit Research

Search Reddit for authentic discussions using patterns:

```
site:reddit.com "[problem] tired of"
site:reddit.com "[problem] doctor won't"
site:reddit.com "[problem] finally found"
site:reddit.com "r/Perimenopause [symptom]"
site:reddit.com "r/30PlusSkinCare [concern]"
```

**Key Subreddits for 30+ Women:**
- r/Perimenopause, r/Menopause
- r/30PlusSkinCare, r/SkincareAddiction
- r/TwoXChromosomes, r/AskWomenOver30
- r/HealthAnxiety, r/AskDocs
- r/Biohackers, r/longevity

### Step 2: Quote Extraction

Capture exact quotes that reveal:
- **Emotional language** - frustrated, scared, finally, exhausted
- **Unmet needs** - "I wish...", "If only...", "Why can't..."
- **Failed attempts** - "I tried X but..."
- **Breakthrough moments** - "Finally discovered...", "Turns out..."
- **Validation seeking** - "Anyone else?", "Am I crazy?"

**Format Each Quote:**
```
> "[Exact quote with original language/typos]"
> — r/subreddit

Emotional tone: [frustrated/hopeful/desperate/relieved]
Implied desire: [Steven Reiss desire]
Potential angle: [How Superpower addresses this]
```

### Step 3: Pattern Recognition

Group quotes into thematic clusters:

1. **Healthcare System Frustration** - "My doctor dismissed me"
2. **Early Symptoms Confusion** - "Too young for this"
3. **Information Overwhelm** - "So much conflicting advice"
4. **Control Seeking** - "I want to know what's happening"
5. **Validation Hunger** - "Finally someone believes me"

### Step 4: Desire Mapping

Map each cluster to Steven Reiss desires (reference `${CLAUDE_PLUGIN_ROOT}/steven-reiss-16-desires.md`):

| Cluster | Primary Desire | Secondary Desire |
|---------|---------------|------------------|
| Healthcare frustration | Independence | Power |
| Early symptoms | Acceptance | Tranquility |
| Information overwhelm | Order | Curiosity |
| Control seeking | Power | Independence |
| Validation hunger | Acceptance | Social Contact |

### Step 5: Insight Formulation

For each cluster, write a complete insight:

**Template:**
```
INSIGHT: [One sentence truth]

Observation: [What we saw in the research]
Tension: [The underlying conflict/frustration]
Implication: [What this means for messaging]
Desire: [Which Steven Reiss desire this maps to]
Evidence: [2-3 supporting quotes]
```

**Example:**
```
INSIGHT: Women don't just want answers—they want someone to believe them.

Observation: Repeated mentions of doctors dismissing symptoms
Tension: They KNOW something is wrong but can't prove it
Implication: Lead with validation before information
Desire: Acceptance + Curiosity
Evidence:
> "My doctor literally rolled his eyes when I mentioned brain fog"
> "Finally someone who doesn't say 'it's just stress'"
> "I'm not crazy. These symptoms are real."
```

## Output Format

```markdown
# Insight Report: [Persona/Segment]

## Research Summary
- **Sources searched:** [List of subreddits]
- **Quotes collected:** [Number]
- **Date:** [Date]

---

## Top 5 Insights

### Insight 1: [Insight Statement]

**The Truth:** [Expanded explanation]

**Evidence:**
> "[Quote 1]" — r/subreddit
> "[Quote 2]" — r/subreddit

**Desire Mapping:** [Primary desire] + [Secondary desire]

**Creative Implications:**
- [How to use in headlines]
- [How to use in body copy]
- [Visual direction suggestion]

---

### Insight 2: [Insight Statement]
[Same structure]

---

## Golden Quotes (Ready for Copy)

1. > "[Quote]"
   **Why it's gold:** [Explanation]
   **Use for:** [Headline/Hook/Body]

2. > "[Quote]"
   **Why it's gold:** [Explanation]
   **Use for:** [Headline/Hook/Body]

---

## Recommended Concept Directions

Based on these insights, prioritize concepts that:
1. [Direction 1]
2. [Direction 2]
3. [Direction 3]
```

## Quality Gates

Before finalizing insights:

- [ ] Each insight has 2+ supporting quotes
- [ ] Insights reveal tension, not just observation
- [ ] Desires are mapped with rationale
- [ ] Insights are non-obvious (not "women want to feel healthy")
- [ ] Creative implications are specific and actionable

## Anti-Patterns to Avoid

**Weak insight (observation only):**
❌ "Women search for fatigue solutions online"

**Strong insight (observation + tension + implication):**
✅ "Women don't trust 'normal' lab results—because their bodies tell a different story"

**Generic insight:**
❌ "Women want to feel better"

**Specific insight:**
✅ "The fear isn't the symptom—it's the uncertainty of not knowing if it will get worse"
