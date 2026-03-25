---
name: email-sequence-builder
description: Design multi-touch email sequences (welcome, nurture, win-back) for Superpower. Outputs sequence strategy, timing recommendations, and email briefs for each touch. Use when asked to "create email sequence", "welcome series", "nurture campaign", "email automation".
---

# Email Sequence Builder Skill

## When to Use This Skill

Use this skill when you need to design multi-touch email sequences (3-7 emails) that build on each other over time.

**Prerequisites:**
- ✅ Sequence goal determined (welcome, nurture, or win-back)
- ✅ Target persona defined (from marketing-personas.md)
- ✅ Starting funnel stage identified (where they are now)
- ✅ Ending funnel stage identified (where you want them to be)

**Input Requirements:**
- Sequence goal (welcome, nurture, win-back)
- Target persona (Early Signal Women 30-35, Transition Warriors 35-42, etc.)
- Starting funnel stage (awareness level when sequence starts)
- Ending funnel stage (desired awareness level after sequence)

**Output Delivered:**
- Sequence map (3-7 emails with timing recommendations)
- Brief for each email (framework, key message, CTA)
- Progression logic (how emails build on each other)
- Behavioral triggers (what happens if they open, click, or don't engage)
- Success metrics recommendations (what to track)

**When NOT to use:**
- Single email (use `email-copy-generation` skill instead)
- Transactional email series (use simple templates)
- Broadcast campaigns (one-off sends, not automated sequences)

---

# Sequence Types

## Sequence Type 1: Welcome Series (New Members)

### Goal
Onboard new members, drive first blood draw booking, introduce marketplace, activate engagement

### Duration
7-10 days (3-5 emails)

### Starting Stage
Product Aware (they just joined/purchased)

### Ending Stage
Engaged Member (blood draw booked, marketplace explored, familiar with platform)

### Email Structure

**Email 1 (Day 0): Welcome + Next Steps**
- **Timing:** Immediately after signup (triggered by `USER_CREATED` event)
- **Framework:** APP (Agree → Promise → Preview)
- **Key Message:** "You joined. Here's what happens next."
- **CTA:** Book blood draw → [Link to scheduling]
- **Tone:** Welcoming, instructional, clear

**Email 2 (Day 3): Educational Value (No Hard Ask)**
- **Timing:** 3 days after signup
- **Framework:** Quest (Question → Understand → Educate → Stimulate → Transition)
- **Key Message:** "What your 100+ biomarkers reveal (and why they matter)"
- **CTA:** Explore biomarker list → [Link to /biomarkers]
- **Tone:** Educational, empowering, value-first

**Email 3 (Day 7): Marketplace Introduction**
- **Timing:** 7 days after signup
- **Framework:** PPPP (Picture → Promise → Proof → Proposition)
- **Key Message:** "Take action: Supplements up to 20% off, Rx at discounted prices"
- **CTA:** Shop marketplace → [Link to /marketplace]
- **Tone:** Enabling, actionable, benefit-driven

**Email 4 (Day 10): Care Team Introduction (OPTIONAL)**
- **Timing:** 10 days after signup
- **Framework:** APP (Agree → Promise → Preview)
- **Key Message:** "Meet your care team (on-demand support when you need it)"
- **CTA:** Ask a question → [Link to chat or FAQ]
- **Tone:** Personal, accessible, supportive

### Progression Logic

**Email 1 → Email 2:**
- IF clicked "Book blood draw" → Send Email 2 on Day 3
- IF NOT clicked → Send reminder + Email 2 on Day 3 (combined)

**Email 2 → Email 3:**
- IF opened Email 2 → Send Email 3 on Day 7
- IF NOT opened → Re-send Email 2 with new subject line, delay Email 3 to Day 10

**Email 3 → Email 4:**
- IF purchased from marketplace → Skip Email 4
- IF clicked marketplace link → Send Email 4 on Day 10
- IF NOT engaged → Send Email 4 with stronger hook

### Exit Conditions
- IF booked blood draw → Skip Email 1 reminder
- IF purchased from marketplace → Skip Email 3 (marketplace intro)
- IF unsubscribed → Remove from sequence

### Success Metrics
- **Email 1:** 60%+ open rate, 30%+ click rate (booking link)
- **Email 2:** 50%+ open rate, 20%+ click rate (biomarker page)
- **Email 3:** 40%+ open rate, 10%+ marketplace visit rate
- **Sequence overall:** 50%+ blood draw booking rate within 14 days

---

## Sequence Type 2: Nurture Sequence (Educational, Relationship-Building)

### Goal
Build trust, deliver value, educate prospects, move them from problem-aware to product-aware

### Duration
21-35 days (5-7 emails)

### Starting Stage
Problem Aware or Solution Aware (on email list but not members yet)

### Ending Stage
Product Aware (ready to join, understand value, trust established)

### Email Structure

**Email 1 (Day 0): Validate Pain Point**
- **Timing:** When user opts into nurture sequence
- **Framework:** APP (Agree → Promise → Preview)
- **Key Message:** "You're not crazy. The system is broken."
- **CTA:** Read guide → [Link to educational content]
- **Tone:** Empathetic, validating, relatable

**Email 2 (Day 5): Educate (Mechanism)**
- **Timing:** 5 days after Email 1
- **Framework:** Quest (Question → Understand → Educate → Stimulate → Transition)
- **Key Message:** "Why your doctor only tests 20 biomarkers (and what you're missing)"
- **CTA:** Explore biomarker list → [Link to /biomarkers]
- **Tone:** Educational, data-driven, empowering

**Email 3 (Day 10): Social Proof (Case Study)**
- **Timing:** 10 days after Email 1
- **Framework:** SAP (Star → Story → Solution)
- **Key Message:** "How Jenna went from 'normal labs' to answers in 10 days"
- **CTA:** Read Jenna's story → [Link to case study or testimonial page]
- **Tone:** Inspiring, relatable, outcome-focused

**Email 4 (Day 15): Differentiation (Superpower vs. Others)**
- **Timing:** 15 days after Email 1
- **Framework:** PPPP (Picture → Promise → Proof → Proposition)
- **Key Message:** "$199/year for what costs $498 elsewhere"
- **CTA:** See what's included → [Link to /join or pricing page]
- **Tone:** Clear, value-driven, comparative (without naming competitors)

**Email 5 (Day 21): Overcome Objections**
- **Timing:** 21 days after Email 1
- **Framework:** APP (Agree → Promise → Preview)
- **Key Message:** "FAQ: Your top 5 questions about Superpower answered"
- **CTA:** Get answers → [Link to FAQ or blog post]
- **Tone:** Transparent, helpful, objection-handling

**Email 6 (Day 28): Soft Ask (First Direct Offer)**
- **Timing:** 28 days after Email 1
- **Framework:** BAB (Before → After → Bridge)
- **Key Message:** "From 'your labs are normal' to 'I finally have answers'"
- **CTA:** Join Superpower → [Link to /join]
- **Tone:** Invitational, benefit-focused, clear ask

**Email 7 (Day 35): Final Push (OPTIONAL - if no conversion)**
- **Timing:** 35 days after Email 1
- **Framework:** 4 Ps (Picture → Promise → Prove → Push)
- **Key Message:** "Last chance: Lock in $199/year pricing"
- **CTA:** Join now → [Link to /join]
- **Tone:** Urgent (if true), benefit-focused, final invitation

### Progression Logic

**Email 1 → Email 2:**
- IF opened Email 1 → Send Email 2 on Day 5
- IF NOT opened → Re-send Email 1 with new subject line on Day 3, then Email 2 on Day 7

**Email 2 → Email 3:**
- IF clicked biomarker link → Send Email 3 on Day 10
- IF NOT clicked → Send Email 3 with stronger hook on Day 10

**Email 3 → Email 4:**
- IF opened Email 3 → Send Email 4 on Day 15
- IF NOT opened → Skip to Email 5 (FAQ) on Day 21

**Email 4 → Email 5:**
- IF clicked pricing link → Send Email 5 on Day 21 (objection handling)
- IF NOT clicked → Send Email 5 on Day 21 anyway (continue nurture)

**Email 5 → Email 6:**
- IF engaged with FAQ → Send Email 6 on Day 28 (first direct ask)
- IF NOT engaged → Send Email 6 anyway (soft ask, low pressure)

**Email 6 → Email 7:**
- IF joined → Remove from sequence
- IF NOT joined → Send Email 7 on Day 35 (final push, only if time-limited offer is true)

### Exit Conditions
- IF joined Superpower → Remove from nurture, move to welcome sequence
- IF unsubscribed → Remove from sequence
- IF opened Email 6 but didn't join → Tag as "hot lead" for sales follow-up

### Success Metrics
- **Email 1:** 50%+ open rate, 25%+ click rate
- **Email 2:** 45%+ open rate, 20%+ click rate
- **Email 3:** 40%+ open rate, 15%+ click rate
- **Email 4:** 40%+ open rate, 20%+ click rate (pricing page)
- **Email 5:** 35%+ open rate, 15%+ click rate
- **Email 6:** 35%+ open rate, 10%+ conversion rate
- **Sequence overall:** 15-25% conversion rate within 35 days

---

## Sequence Type 3: Win-Back Sequence (Re-Engagement)

### Goal
Re-engage inactive members or prospects, remind them of value, drive action (book blood draw, shop marketplace, or renew membership)

### Duration
14-21 days (3-4 emails)

### Starting Stage
Product Aware or Most Aware (they joined but haven't engaged, or subscription expired)

### Ending Stage
Re-Engaged Member (blood draw booked, marketplace purchase, or subscription renewed)

### Email Structure

**Email 1 (Day 0): "We Miss You" (Soft Re-Engagement)**
- **Timing:** 30-60 days after last engagement (or membership expiration)
- **Framework:** APP (Agree → Promise → Preview)
- **Key Message:** "We noticed you haven't [booked blood draw / shopped marketplace / renewed]. Here's what you're missing."
- **CTA:** Come back → [Link to dashboard, marketplace, or renewal page]
- **Tone:** Friendly, non-judgmental, invitational

**Email 2 (Day 7): Value Reminder (What They're Missing)**
- **Timing:** 7 days after Email 1
- **Framework:** BAB (Before → After → Bridge)
- **Key Message:** "From 'I'll do it later' to 'I finally have answers' (it takes 10 minutes)"
- **CTA:** Book now → [Link to scheduling or action page]
- **Tone:** Gentle nudge, benefit-focused, low friction

**Email 3 (Day 14): Incentive Offer (If Applicable)**
- **Timing:** 14 days after Email 1
- **Framework:** PPPP (Picture → Promise → Proof → Proposition)
- **Key Message:** "Special offer: $50 credit toward marketplace purchase (or renewal discount)"
- **CTA:** Claim offer → [Link to offer page]
- **Tone:** Valuable, time-limited (if true), appreciation

**Email 4 (Day 21): Final Reminder (OPTIONAL - Last Chance)**
- **Timing:** 21 days after Email 1
- **Framework:** PAS (Problem → Agitate → Solution)
- **Key Message:** "Last chance: We're closing inactive accounts [date]" (only if true)
- **CTA:** Reactivate now → [Link to action page]
- **Tone:** Urgent (if true), clear, final invitation

### Progression Logic

**Email 1 → Email 2:**
- IF clicked CTA → Send Email 2 on Day 7 (gentle reminder)
- IF NOT opened → Re-send Email 1 with new subject line on Day 3, then Email 2 on Day 10

**Email 2 → Email 3:**
- IF clicked booking link → Skip Email 3 (they're re-engaged)
- IF NOT clicked → Send Email 3 on Day 14 (incentive offer)

**Email 3 → Email 4:**
- IF claimed offer → Remove from sequence (re-engaged)
- IF NOT engaged → Send Email 4 on Day 21 (final reminder, only if there's a true deadline)

### Exit Conditions
- IF booked blood draw or made marketplace purchase → Remove from sequence (re-engaged)
- IF renewed membership → Remove from sequence (re-engaged)
- IF unsubscribed → Remove from sequence
- IF still inactive after Email 4 → Tag as "churned" or "lost"

### Success Metrics
- **Email 1:** 40%+ open rate, 15%+ click rate
- **Email 2:** 35%+ open rate, 12%+ click rate
- **Email 3:** 30%+ open rate, 10%+ conversion rate (offer claimed)
- **Sequence overall:** 20-30% re-engagement rate within 21 days

---

# Sequence Architecture Principles

## Progression Logic: How Emails Build on Each Other

**Rule 1: Each email should advance the journey**
- Don't repeat the same message
- Build on previous emails (reference what they learned)
- Move from awareness → understanding → desire → action

**Example:**
```
Email 1: "You're not crazy. The system is broken." (validates pain)
Email 2: "Here's why your doctor only tests 20 biomarkers." (educates)
Email 3: "How Jenna found answers her doctor missed." (social proof)
Email 4: "Ready to get your answers? Here's how." (ask)
```

---

**Rule 2: Vary frameworks to avoid monotony**
- Don't use the same framework for every email
- Mix educational (Quest, APP) with persuasive (PAS, BAB, AIDA)
- Match framework to email's goal (educate, validate, inspire, ask)

**Example:**
```
Email 1: APP (relationship-building)
Email 2: Quest (educational)
Email 3: SAP (social proof)
Email 4: BAB (persuasive)
```

---

**Rule 3: Increase ask intensity gradually**
- Start with low-friction asks (read article, explore page)
- Build to medium asks (reply, take quiz, watch video)
- End with high asks (join, purchase, book)

**Example:**
```
Email 1: "Read this guide →" (low friction)
Email 2: "Explore our biomarker list →" (low-medium friction)
Email 3: "Reply: Which biomarker are you most curious about?" (medium friction)
Email 4: "Join Superpower →" (high friction)
```

---

## Behavioral Triggers: What Happens Based on Engagement

### Trigger 1: Open (They Opened Email)
**Signal:** Interested but didn't click
**Action:**
- Continue sequence as planned
- Consider stronger subject line or hook for next email

---

### Trigger 2: Click (They Clicked CTA)
**Signal:** High intent, engaged with content
**Action:**
- Accelerate sequence (send next email sooner)
- Tag as "hot lead" for sales follow-up
- Personalize next email based on what they clicked

**Example:**
```
IF clicked "Book blood draw" → Send reminder email in 2 days
IF clicked "Biomarker list" → Send educational email about biomarkers
IF clicked "Pricing page" → Send objection-handling email
```

---

### Trigger 3: No Open (They Didn't Open)
**Signal:** Subject line failed, or email went to spam/promotions
**Action:**
- Re-send with new subject line (test different formula)
- Check deliverability (spam score, sender reputation)
- Consider different send time

**Example:**
```
IF no open after 3 days → Re-send with curiosity gap subject line
IF no open after 2nd attempt → Tag as "low engagement" and slow sequence
```

---

### Trigger 4: Unsubscribe (They Opted Out)
**Signal:** Not interested, content not relevant, or frequency too high
**Action:**
- Remove from sequence immediately (legal requirement)
- Offer "update preferences" option before unsubscribe (last chance to save)
- Track unsubscribe rate to identify problematic emails

---

### Trigger 5: Conversion (They Joined/Purchased)
**Signal:** Goal achieved
**Action:**
- Remove from current sequence
- Move to new sequence (welcome series for new members)
- Tag as "converted" for segmentation

---

## Timing Optimization

### Best Practices for Send Times

**Day of week:**
- **Best:** Tuesday, Wednesday, Thursday (highest open rates for health/wellness)
- **Good:** Monday (catch-up day, inbox clean)
- **Okay:** Friday (lower engagement but less competition)
- **Avoid:** Saturday, Sunday (unless B2C promotional, test first)

**Time of day:**
- **Best:** 9-11am (morning email check)
- **Good:** 2-4pm (afternoon lull, looking for distraction)
- **Okay:** 7-9pm (evening wind-down)
- **Avoid:** 12-1pm (lunch), 5-6pm (commute), late night (low engagement)

**Sequence spacing:**
- **Welcome series:** Day 0, Day 3, Day 7 (frontloaded, faster cadence)
- **Nurture series:** Every 5-7 days (slower cadence, respect inbox)
- **Win-back series:** Day 0, Day 7, Day 14, Day 21 (give time to re-engage)

---

# Email Brief Template (For Each Email in Sequence)

Use this template for each email in the sequence:

```markdown
## Email [#]: [Email Name]

**Sequence Position:** [# of #] (e.g., Email 2 of 5)
**Timing:** [Day # after sequence start]
**Framework:** [PAS / BAB / AIDA / Quest / APP / SAP / 4 Ps / PPPP]
**Funnel Stage:** [Problem / Solution / Product Aware]
**Goal:** [What this email should achieve]

### Key Message
[1-2 sentence summary of what this email communicates]

### Subject Line Strategy
[Which formula to use: Curiosity / Benefit / Personalization / Pattern Interrupt / Social Proof / Urgency]

### Framework Structure
[Outline of how framework applies to this specific email]

### CTA
**Primary:** [Button text] → [Link/Action]
**Secondary (optional):** [Link text] → [Link/Action]

### Progression to Next Email
- IF [action taken] → [What happens next]
- IF NOT [action taken] → [What happens next]

### Success Metrics
- Open rate target: [%]
- Click rate target: [%]
- Conversion/action target: [%]
```

---

# Complete Sequence Examples

## Example 1: Welcome Series (New Members, 3 Emails)

### Sequence Overview

**Goal:** Onboard new members, drive blood draw booking, introduce marketplace
**Duration:** 10 days
**Starting Stage:** Product Aware (just joined)
**Ending Stage:** Engaged Member (blood draw booked, marketplace explored)

---

### Email 1: Welcome + Next Steps (Day 0)

**Sequence Position:** Email 1 of 3
**Timing:** Immediately after signup (triggered by `USER_CREATED`)
**Framework:** APP (Agree → Promise → Preview)
**Funnel Stage:** Product Aware
**Goal:** Welcome member, clarify next steps, drive blood draw booking

**Key Message:**
"Welcome to Superpower. Here's exactly what happens next (and how to get started)."

**Subject Line Strategy:**
Benefit-driven: "Welcome to Superpower: Your next 3 steps"

**Framework Structure:**
- **Agree:** "You joined because you're tired of being told you're 'fine' when you know something is off."
- **Promise:** "We're going to help you get answers. Here's how."
- **Preview:** "Step 1: Book your blood draw. Step 2: Get results in 5-10 days. Step 3: Personalized protocols from our care team."

**CTA:**
**Primary:** [Button: Book Your Blood Draw →] → Link to scheduling page
**Secondary:** [Link: Learn more about the process →] → Link to /how-it-works

**Progression to Next Email:**
- IF clicked "Book blood draw" → Send Email 2 on Day 3
- IF NOT clicked → Send reminder + Email 2 on Day 3

**Success Metrics:**
- Open rate target: 60%+
- Click rate target: 30%+
- Booking rate target: 20%+

**Full Copy Example:**

```
Subject: Welcome to Superpower: Your next 3 steps

Hi {First_Name},

Welcome to Superpower.

You joined because you're tired of being told you're "fine" when you know something is off.

We're going to help you get answers. Here's exactly what happens next:

**Step 1: Book your blood draw**
Takes 2 minutes. Choose at-home draw (most states) or visit a Quest lab near you.

[Button: Book Your Blood Draw →]

**Step 2: Get your results**
100+ biomarkers tested. Results in 5-10 days. Easy-to-understand dashboard with clear explanations.

**Step 3: Get your personalized protocol**
Our care team reviews your results and creates a personalized protocol. You'll have on-demand access to ask questions.

**Step 4: Take action**
Shop our marketplace for supplements (up to 20% off) and prescriptions at discounted prices.

That's it. Four steps to answers.

Questions? We're here: [Link to FAQ or chat]

Welcome aboard,
The Superpower Team

---

You're receiving this email because you joined Superpower.

Superpower Health, Inc.
[Physical Address]
[Privacy Policy] | [Unsubscribe]
```

---

### Email 2: Educational Value (Day 3)

**Sequence Position:** Email 2 of 3
**Timing:** 3 days after signup
**Framework:** Quest (Question → Understand → Educate → Stimulate → Transition)
**Funnel Stage:** Product Aware
**Goal:** Educate about biomarkers, deliver value, drive biomarker page visit

**Key Message:**
"What your 100+ biomarkers reveal (and why they matter for your health)."

**Subject Line Strategy:**
Curiosity gap: "What 100+ biomarkers reveal about your health"

**Framework Structure:**
- **Question:** "Ever wonder why your doctor only tests 20 biomarkers in your annual physical?"
- **Understand:** "Here's the problem: insurance limits testing unless you're 'sick enough.'"
- **Educate:** "Superpower tests 100+ biomarkers in one draw. Here's what each category reveals..."
- **Stimulate:** "Imagine knowing your vitamin D, thyroid function, inflammation markers, metabolic health—all in one dashboard."
- **Transition:** "Explore the full biomarker list →"

**CTA:**
**Primary:** [Link: Explore Our Biomarker List →] → Link to /biomarkers
**Secondary:** [Link: How to read your results →] → Link to blog post or help doc

**Progression to Next Email:**
- IF clicked biomarker link → Send Email 3 on Day 7
- IF NOT clicked → Send Email 3 on Day 7 anyway

**Success Metrics:**
- Open rate target: 50%+
- Click rate target: 20%+
- Page visit rate: 15%+

**Full Copy Example:**

```
Subject: What 100+ biomarkers reveal about your health

Hi {First_Name},

Ever wonder why your doctor only tests 20 biomarkers in your annual physical?

Here's the problem: insurance limits testing unless you're "sick enough."

So they test the basics (cholesterol, glucose, maybe TSH if you're lucky).

But what about:
- Vitamin D (deficiency mimics depression)
- Ferritin (low iron stores cause fatigue)
- Free T3 (active thyroid hormone your doctor doesn't test)
- CRP (inflammation marker that predicts chronic disease risk)
- HbA1c (shows your 3-month blood sugar average, not just a snapshot)

All of these can be "off" while your basic panel looks "normal."

Superpower tests 100+ biomarkers in one draw.

Here's what each category reveals:

**Metabolic Health**
Glucose, insulin, HbA1c (how your body processes energy)

**Thyroid Function**
TSH, Free T3, Free T4, Reverse T3, antibodies (all 5 markers, not just TSH)

**Vitamins & Minerals**
Vitamin D, B12, folate, magnesium, iron (the nutrients your body needs)

**Inflammation & Immunity**
CRP, white blood cells, immune markers (early signs of chronic disease risk)

**Hormones**
Testosterone, estrogen, cortisol, DHEA (how your hormones are balanced)

[Link: See the Full Biomarker List →]

You don't need to understand all of this now.

When you get your results, we'll explain what each one means—and what to do about it.

Questions? Our team is here: [Link to FAQ]

See you soon,
The Superpower Team

---

You're receiving this email because you joined Superpower.

Superpower Health, Inc.
[Physical Address]
[Privacy Policy] | [Unsubscribe]
```

---

### Email 3: Marketplace Introduction (Day 7)

**Sequence Position:** Email 3 of 3
**Timing:** 7 days after signup
**Framework:** PPPP (Picture → Promise → Proof → Proposition)
**Funnel Stage:** Product Aware → Engaged Member
**Goal:** Introduce marketplace, drive first purchase, show action path

**Key Message:**
"You'll get personalized protocols. Here's where to take action: supplements up to 20% off, Rx at discounted prices."

**Subject Line Strategy:**
Benefit-driven: "Take action: Supplements up to 20% off + Rx access"

**Framework Structure:**
- **Picture:** "Most testing companies stop at results. You're on your own to figure out what to do."
- **Promise:** "We go further. Personalized protocols + marketplace to take action."
- **Proof:** "50,000+ members have used our marketplace to optimize health based on their results."
- **Proposition:** "Here's what's included: Supplements up to 20% off, Rx at discounted prices, curated by our care team."

**CTA:**
**Primary:** [Button: Explore Marketplace →] → Link to /marketplace
**Secondary:** [Link: How the marketplace works →] → Link to help doc

**Progression to Next Email:**
- IF purchased → Welcome series complete (no more emails)
- IF NOT purchased → Tag as "marketplace-interested" for future campaigns

**Success Metrics:**
- Open rate target: 40%+
- Click rate target: 10%+
- Marketplace visit rate: 8%+

**Full Copy Example:**

```
Subject: Take action: Supplements up to 20% off + Rx access

Hi {First_Name},

Most testing companies stop at results.

You get a PDF. Maybe a generic "eat better and exercise" recommendation.

Then you're on your own to figure out what to do.

We go further.

After you get your results, our care team creates a personalized protocol based on your biomarkers.

Then we give you a marketplace to take action.

**Here's what's included:**

✅ Supplements up to 20% off
Vitamin D, magnesium, omega-3s, adaptogens—curated by our care team

✅ Prescriptions at discounted prices
GLP-1s, thyroid medication, hormone optimization—prescribed when clinically appropriate

✅ Functional medicine products
Gut health, inflammation support, metabolic optimization

Everything is vetted by our care team. No gimmicks. No unproven supplements.

Just evidence-based interventions you can act on.

[Button: Explore Marketplace →]

You don't need to buy anything today.

But when you get your results and see "low vitamin D" or "suboptimal thyroid function," you'll know exactly where to go.

Questions? We're here: [Link to FAQ]

See you soon,
The Superpower Team

---

You're receiving this email because you joined Superpower.

Superpower Health, Inc.
[Physical Address]
[Privacy Policy] | [Unsubscribe]
```

---

## Example 2: Nurture Sequence (Educational, 5 Emails)

### Sequence Overview

**Goal:** Build trust, educate prospects, move from problem-aware to product-aware
**Duration:** 28 days
**Starting Stage:** Problem Aware or Solution Aware
**Ending Stage:** Product Aware (ready to join)

---

### Email 1: Validate Pain Point (Day 0)

**Subject:** "Your doctor isn't lazy. The system is broken."

**Framework:** APP (Agree → Promise → Preview)

**Key Message:**
"Your doctor isn't dismissing you because they don't care. Here's why the system limits comprehensive testing."

**CTA:** Read guide → [Link to educational content]

*[See full copy in email-copy-generation skill, APP Framework example]*

---

### Email 2: Educate (Mechanism) (Day 5)

**Subject:** "Why does my doctor only test TSH for thyroid function?"

**Framework:** Quest (Question → Understand → Educate → Stimulate → Transition)

**Key Message:**
"TSH is just one marker. A comprehensive thyroid panel includes 5 markers. Here's what you're missing."

**CTA:** Learn more → [Link to biomarker page or blog post]

*[See full copy in email-copy-generation skill, Quest Framework example]*

---

### Email 3: Social Proof (Case Study) (Day 10)

**Subject:** "I finally know why I've been exhausted for 3 years"

**Framework:** SAP (Star → Story → Solution)

**Key Message:**
"Meet Jenna. She spent 3 years being told she was 'fine.' Her Superpower panel revealed low vitamin D, low ferritin, and suboptimal thyroid. 8 weeks later, her energy came back."

**CTA:** Read Jenna's story → [Link to case study]

*[See full copy in email-copy-generation skill, SAP Framework example]*

---

### Email 4: Differentiation (Day 15)

**Subject:** "$199/year for what costs $498 elsewhere"

**Framework:** PPPP (Picture → Promise → Proof → Proposition)

**Key Message:**
"Comprehensive testing used to cost $10k-$100k/year (concierge medicine) or $498 (other providers). We built Superpower to make it accessible: $199/year."

**CTA:** See what's included → [Link to /join or pricing page]

*[See full copy in email-copy-generation skill, PPPP Framework example]*

---

### Email 5: Soft Ask (Day 28)

**Subject:** "From 'your labs are normal' to 'I finally have answers'"

**Framework:** BAB (Before → After → Bridge)

**Key Message:**
"Before: Frustrated, dismissed, no answers. After: 100+ biomarkers, personalized protocol, on-demand care team. Bridge: Here's how we get you there."

**CTA:** Join Superpower → [Link to /join]

*[See full copy in email-copy-generation skill, BAB Framework example]*

---

## Example 3: Win-Back Series (Re-Engagement, 3 Emails)

### Sequence Overview

**Goal:** Re-engage inactive members, drive blood draw booking or marketplace purchase
**Duration:** 14 days
**Starting Stage:** Product Aware (joined but inactive)
**Ending Stage:** Re-Engaged Member

---

### Email 1: "We Miss You" (Day 0)

**Subject:** "We noticed you haven't booked your blood draw yet"

**Framework:** APP

**Key Message:**
"Life gets busy. We get it. But your answers are waiting. It takes 10 minutes to book."

**CTA:** Book now → [Link to scheduling]

---

### Email 2: Value Reminder (Day 7)

**Subject:** "From 'I'll do it later' to 'I finally have answers' (it takes 10 minutes)"

**Framework:** BAB

**Key Message:**
"Before: Busy, procrastinating, no clarity. After: Answers in 5-10 days. Bridge: Book your draw in 10 minutes."

**CTA:** Book now → [Link to scheduling]

---

### Email 3: Incentive Offer (Day 14)

**Subject:** "Special offer: $50 credit toward marketplace purchase"

**Framework:** PPPP

**Key Message:**
"As a thank you for joining, here's $50 toward your first marketplace order. Claim by [date]."

**CTA:** Claim offer → [Link to offer page]

---

# Invocation Notes

**When to invoke this skill:**
- User asks to "create email sequence", "welcome series", "nurture campaign", "email automation"
- Multi-email journey needed (3+ emails)
- Clear sequence goal defined (welcome, nurture, win-back)

**When NOT to invoke:**
- Single email (use `email-copy-generation` skill)
- Broadcast campaign (one-off send, not automated sequence)
- Transactional sequence (use simple templates)

**Output format:**
Always include:
- Sequence map (emails, timing, frameworks)
- Brief for each email (goal, key message, CTA)
- Progression logic (behavioral triggers)
- Success metrics

**Quality checklist:**
- [ ] Clear sequence goal (what should happen by the end?)
- [ ] 3-7 emails (not too short, not too long)
- [ ] Varied frameworks (don't repeat same structure)
- [ ] Progressive asks (low → medium → high friction)
- [ ] Behavioral triggers defined (what happens if they click, open, ignore)
- [ ] Exit conditions specified (when to remove from sequence)
- [ ] Success metrics included (open rate, click rate, conversion rate targets)

---

# Reference Materials

**Always consult before creating email sequences:**

- **`${CLAUDE_PLUGIN_ROOT}/superpower-guide.md`** - Value props, pricing, approved claims, competitive positioning
- **`${CLAUDE_PLUGIN_ROOT}/tone-of-voice-guide.md`** - Email-specific tone (3 types: Coaching, General, Promotional), grammar rules, formatting guidelines
- **`${CLAUDE_PLUGIN_ROOT}/compliance-guide.md`** - Health claims + CAN-SPAM compliance rules
- **`${CLAUDE_PLUGIN_ROOT}/marketing-personas.md`** - ICP definitions for targeting
