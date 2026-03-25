---
name: member-monthly-plan
description: Plan Luna's monthly 4-email member BAU batch. Collects the user's brief (product focus, protocol topic), checks sent history, selects a community spotlight member, and proposes themes, angles, and subject line directions for all 4 emails. Use when asked to "plan member emails", "Luna plan", "monthly email plan", or at the start of Luna's workflow.
---

# Member Monthly Plan Skill

## When to Use This Skill

Use this skill at the start of each monthly email cycle to plan all 4 member emails before writing.

**This is Phase 1 of Luna's workflow.** Do NOT write any email copy during this phase — only plan.

---

## Step 1: Check Sent History

Read `${CLAUDE_PLUGIN_ROOT}/member-comms/sent-log.md` and note:
- Topics covered in the last 3 months (avoid repeats)
- Members featured in the last 6 months (avoid repeat spotlights)
- Subject line angles used recently (vary the approach)

If the sent-log is empty (first month), skip this step.

---

## Step 2: Collect the Brief

Ask the user for the following inputs using `AskUserQuestion`:

### Required Inputs

| Input | Description | Example |
|-------|-------------|---------|
| **Product focus** | What product feature to highlight this month? New launch or existing feature for tips/how-to? | "New AI doctor feature" or "Supplement marketplace tips" |
| **Timely protocol topic** | What seasonal/relevant health topic for the actionable tips email? | "Spring allergies", "Post-holiday detox", "Summer hydration" |

### Optional Inputs

| Input | Description | Default |
|-------|-------------|---------|
| **Newsletter angle** | Any specific topic for the members-only newsletter? | Luna proposes based on brand context |
| **Special notes** | Anything else to factor in (promotions, events, company news)? | None |

---

## Step 3: Select Spotlight Member

Browse `${CLAUDE_PLUGIN_ROOT}/testimonials/profiles/` and select a member who:

1. **Has signed consent** — check the Usage Rights table in their profile for `Consent Form: Yes`
2. **Has not been featured recently** — check sent-log (no repeat within 6 months)
3. **Has a compelling story** — look for strong Key Discovery and Standout Quotes sections
4. **Is relatable to the broad member base** — diverse health journeys, ages, backgrounds

Present the selected member with:
- Name and brief bio
- Their key discovery (1-2 sentences)
- 1 standout quote
- Why this member is a good fit for this month

---

## Step 4: Propose the Monthly Plan

Present a structured plan for all 4 emails:

### Output Format

```markdown
# Luna's Monthly Plan — [Month Year]

## Email 1: Members-Only Newsletter (Week 1)
- **Topic:** [Proposed topic]
- **Angle:** [How we're approaching it — what makes this interesting for members]
- **Subject line direction:** [2-3 angle options, not final copy]
- **Length:** 500-700 words

## Email 2: Product Feature (Week 2)
- **Feature:** [What we're highlighting]
- **Angle:** [New launch announcement OR tips/how-to for existing feature]
- **Subject line direction:** [2-3 angle options]
- **Length:** 200-400 words

## Email 3: Community Spotlight (Week 3)
- **Member:** [Name] — [Brief descriptor]
- **Story angle:** [What aspect of their journey we're featuring]
- **Key quote:** "[Verbatim quote from profile]"
- **Subject line direction:** [2-3 angle options]
- **Length:** 200-400 words

## Email 4: Timely Protocol (Week 4)
- **Topic:** [Seasonal/relevant health topic]
- **Tips included:** [3-5 tip preview — what actionable advice we'll give]
- **Biomarker tie-in:** [Which Superpower biomarkers connect to this topic]
- **Subject line direction:** [2-3 angle options]
- **Length:** 300-500 words

---

## Sent-Log Check
- Last 3 months topics: [list]
- Last spotlight: [name, month]
- No conflicts detected: [yes/no + explanation if conflict]
```

---

## Step 5: Wait for Approval

**CRITICAL:** After presenting the plan, PAUSE and explicitly ask:

> "Does this plan look good? Any changes before I start writing?"

Do NOT proceed to production until the user explicitly approves. They may want to:
- Swap a topic
- Choose a different spotlight member
- Adjust an angle
- Add a special note

Once approved, invoke `member-email-production` skill to write all 4 emails.

---

## Edge Cases

**If the user provides all inputs upfront** (product focus + protocol topic in their initial message):
- Skip Step 2 (brief collection)
- Go straight to Steps 3-5

**If this is the first month** (empty sent-log):
- Note "First month — no history to check" in the plan
- All topics and members are available

**If the user only wants to plan one email** (not the full batch):
- Plan just that email type
- Still check sent-log for that category
