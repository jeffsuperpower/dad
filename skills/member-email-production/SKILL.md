---
name: member-email-production
description: Write all 4 member BAU emails from Luna's approved monthly plan. Produces full copy with 3-5 subject line variants, preheader text, body copy, CTAs, and CAN-SPAM footer for each email. Creates draft campaigns in Klaviyo and updates the sent-log. Use after member-monthly-plan is approved.
---

# Member Email Production Skill

## When to Use This Skill

Use this skill after the monthly plan (from `member-monthly-plan`) has been approved by the user.

**This is Phase 2 of Luna's workflow.** The plan must be approved before production begins.

---

## Pre-Production Checklist

Before writing any emails, read these resources:

1. **Brand guide:** `${CLAUDE_PLUGIN_ROOT}/superpower-guide.md` — current pricing, biomarker count, approved claims
2. **Tone of voice:** `${CLAUDE_PLUGIN_ROOT}/knowledge/tone-of-voice.md` — brand voice baseline
3. **Product info:** `${CLAUDE_PLUGIN_ROOT}/knowledge/how-to-sell.md` — features, stats
4. **Compliance guide:** `${CLAUDE_PLUGIN_ROOT}/compliance-guide.md` — health claims guardrails
5. **Email formats:** Invoke `member-email-formats` skill for layout standards per email type
6. **Approved plan:** Reference the monthly plan the user approved in Phase 1

---

## Production: Write All 4 Emails

For each email, produce the following:

### Output Format (Per Email)

```markdown
# [Email Type]: "[Working Title]"

**Type:** [Members-Only Newsletter / Product Feature / Community Spotlight / Timely Protocol]
**Target:** All active members
**Send Week:** [Week 1/2/3/4]

---

## Subject Line Variants (A/B Test)

1. [Subject line option 1]
2. [Subject line option 2]
3. [Subject line option 3]
4. [Subject line option 4] (optional)
5. [Subject line option 5] (optional)

**Recommended A/B test:** [Which 2 to test and why]

---

## Preheader Text
"[30-90 characters that complement the subject line]"

---

## Email Body

[Full email copy following the format from member-email-formats skill]

---

## CTA
**Primary:** [Button text] → [URL]
**Secondary:** [Link text] → [URL] (if applicable)

---

## Footer
You're receiving this email because you're a Superpower member.

Superpower Health, Inc.
[Physical Address]
[Privacy Policy] | [Manage Preferences] | [Unsubscribe]

---

## Compliance Check
- [ ] No disease prevention/cure/diagnose/treat claims
- [ ] Approved language used ("detect early signs", "optimize health", "track biomarkers")
- [ ] Current brand guide values (pricing, biomarker count, clinical access language)
- [ ] CAN-SPAM compliant (footer, unsubscribe, truthful subject)
- [ ] Member spotlight: consent verified, approved name format used
```

---

## Email-Specific Production Guidelines

### Email 1: Members-Only Newsletter (500-700 words)

**Structure:**
1. **Greeting** — "Hi [First_Name]," (warm, personal)
2. **Opening hook** — Start with something interesting, surprising, or personally relevant
3. **Main content** — The core insight, update, or perspective (3-4 paragraphs)
4. **Superpower tie-in** — How this connects to their membership (subtle, not salesy)
5. **Sign-off** — Warm close with a personal touch

**Tone:** Like a smart friend sharing something they found interesting over coffee. Not a corporate newsletter — an insider update.

**Guidelines:**
- Different topic than the public newsletter (check what Noah/Max covered)
- Member-exclusive framing: "As a member, you get access to..." or "We're sharing this with members first..."
- Can include behind-the-scenes, early access, or insider perspective
- No hard sell — value first, always

---

### Email 2: Product Feature (200-400 words)

**Structure:**
1. **Greeting** — "Hi [First_Name],"
2. **Hook** — Problem or scenario the feature solves
3. **Feature introduction** — What it is and why it matters
4. **How to use it** — 3-5 clear steps or tips (use bullet points or numbered list)
5. **CTA** — "Try it now" or "Explore [feature]"

**Tone:** Like a teammate showing you a shortcut. Helpful, clear, zero fluff.

**Two modes:**
- **New launch:** Announce the feature, explain what it does, show how to use it
- **Existing feature tips:** "Did you know?" angle — surface value members might be missing

**Guidelines:**
- Keep it scannable — headers, bullets, short paragraphs
- Include a screenshot or visual direction note if relevant
- Link directly to the feature in the Superpower dashboard

---

### Email 3: Community Spotlight (200-400 words)

**Structure:**
1. **Greeting** — "Hi [First_Name],"
2. **Introduction** — Brief intro to the featured member (name, age, 1-line context)
3. **Their story** — What brought them to Superpower, what they discovered (2-3 paragraphs)
4. **Key quote** — Verbatim quote from their testimonial profile (with line number reference internally)
5. **Connection** — How their story relates to the reader ("If you've ever felt..." or "Many of our members share...")
6. **CTA** — Soft: "Have a story to share?" or "Check your own [biomarker]"

**Tone:** Celebratory and personal. Introducing someone at a dinner party with genuine admiration.

**Source:** Pull all content from the member's testimonial profile at `${CLAUDE_PLUGIN_ROOT}/testimonials/profiles/`

**Guidelines:**
- ONLY feature members with signed consent (check Usage Rights table)
- Use their approved name format
- Use verbatim quotes — never paraphrase their words
- Keep it about their journey, not a product pitch
- Comply with all testimonial usage guidelines

---

### Email 4: Timely Protocol (300-500 words)

**Structure:**
1. **Greeting** — "Hi [First_Name],"
2. **Hook** — Timely observation or relatable scenario ("If you've been sneezing more lately...")
3. **Context** — Brief explanation of why this matters right now (1 paragraph)
4. **Tips** — 3-5 actionable things they can do (numbered list with brief explanations)
5. **Biomarker tie-in** — Which Superpower biomarkers relate to this topic ("Your [biomarker] results can tell you...")
6. **CTA** — "Check your results" or "Book your next test"

**Tone:** A health-savvy friend texting you a heads-up. Practical, timely, genuinely useful.

**Guidelines:**
- Tie every protocol to biomarkers Superpower actually tests (reference `${CLAUDE_PLUGIN_ROOT}/knowledge/biomarkers.md`)
- Tips must be evidence-based but written accessibly
- No disease claims — stick to "support", "optimize", "may help"
- Make it seasonal/timely — the value is in the relevance to RIGHT NOW

---

## Post-Production Steps

### 1. Compliance Review

After writing all 4 emails, run a final compliance check:
- Invoke `compliance-check` skill on each email
- Fix any RED or YELLOW flags before proceeding
- Verify all brand guide values are current

### 2. Push to Klaviyo

Use Klaviyo MCP tools to create draft campaigns:

1. **Get the members list:** `klaviyo_get_lists` — find the active members list ID
2. **Create/update templates:** `klaviyo_create_email_template` — one template per email type
3. **Create draft campaigns:** `klaviyo_create_campaign` — 4 campaigns in draft status
   - Use naming convention: `[Month Year] - [Email Type]`
   - Target the members list
   - Set send time to the appropriate week

### 3. Update Sent Log

After production, update `${CLAUDE_PLUGIN_ROOT}/member-comms/sent-log.md` with:

```markdown
## [Month Year]

### Email 1: Members-Only Newsletter
- **Topic:** [Topic]
- **Subject lines:** [List the variants]
- **Sent:** [Date or "Scheduled for Week 1"]

### Email 2: Product Feature
- **Feature:** [What was highlighted]
- **Subject lines:** [List the variants]
- **Sent:** [Date or "Scheduled for Week 2"]

### Email 3: Community Spotlight
- **Member:** [Name]
- **Profile:** [SP-XXX reference]
- **Subject lines:** [List the variants]
- **Sent:** [Date or "Scheduled for Week 3"]

### Email 4: Timely Protocol
- **Topic:** [Topic]
- **Tips covered:** [Brief list]
- **Subject lines:** [List the variants]
- **Sent:** [Date or "Scheduled for Week 4"]
```

### 4. Present to User

After all 4 emails are written:
1. Present each email in the output format above
2. Note which were pushed to Klaviyo as drafts
3. Highlight any compliance flags that were fixed
4. Confirm sent-log was updated
