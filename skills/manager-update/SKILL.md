---
name: manager-update
description: Use when asked to "write manager update", "format my update for Hannah", "weekly update", "manager weekly", or when the user provides a brain dump of what they've been working on and wants it formatted for their manager. Transforms raw notes into the standard Hannah <> Kat Weekly format.
user_invocable: true
---

# Manager Update — Hannah <> Kat Weekly

## Purpose

Transform a quick brain dump (bullet points, voice transcript, or rough notes) into a polished weekly update for Kat's manager Hannah. The user provides raw context each week; this skill formats it into the standard template at the right level of depth.

## How to Use

The user will provide a synopsis of their week — could be bullet points, a voice note transcript, or just a quick stream-of-consciousness dump. Format it into the template below.

**Rules:**
- Match the tone of the example: direct, confident, specific. Not corporate fluff.
- Use real names, real numbers, real details. No placeholders or vague language.
- Each section should be punchy — short paragraphs, not walls of text.
- "What is my focus" should read like a narrative, not a bullet list. Show the strategic thinking behind what you're spending time on.
- "Growth Round-Up" uses short bullet-style updates with bold project names. One line per item where possible, two max.
- If the user doesn't mention something for a section, ask — don't leave it blank or make it up.
- Keep the whole thing scannable in under 2 minutes.

## Template

```markdown
# Hannah <> Kat Weekly | [DD MMM YYYY]

## What is my focus
[1-2 paragraphs. What you've been spending your time on this week and WHY it matters. Show the strategic logic — not just "I did X" but "I did X because Y, which unlocks Z." Include who you're working with and any shifts in how you're operating.]

## Growth Round-Up / Updates
[Bullet-style updates. Bold the project/initiative name. Include numbers where available. One update per line. Format:]

**[Project/Initiative]:** [Status update with specifics — numbers, names, what changed, what's next]
**[Project/Initiative]:** [Status update]
...

## How can we go faster / more impact
[What's working, what you'd change, any structural shifts that are helping or hurting velocity. Keep it honest and forward-looking.]

## Blockers / Challenges
[What's slowing you down. Be specific — people, processes, dependencies. If nothing major, say so briefly.]

## Additional FYI
[Anything Hannah should know that doesn't fit above. Optional — skip if nothing.]

## Feedback
[Anything you need from Hannah — decisions, air cover, context. Optional — skip if nothing.]
```

## Example (for tone and depth reference)

```markdown
# Hannah <> Kat Weekly | 22 FEB 2026

## What is my focus
I've been spending a lot more time giving detailed feedback across the board. Went through all the quiz funnels, RX bundles etc. with really specific notes for changes. It takes time but I think it's one of the highest leverage things I can do right now. I also rewrote the B2B enrolment email today for Smart Health+. Told Prab to just loop me in so I can do it. Doesn't take much time. We're going to work together to activate the 1,700 people on Smart Health. First email wasn't great but I don't think it's on him either.

Beyond that, I've been refocusing people:
DQ fully owning media allocation now, treating me as a sparring partner
Jeff: I've planned out most CVR experiments for him but want him doing net new stuff and coming to me for feedback more frequently
Jack working more closely with Jeff through the CVR process which is working well. Jack is cooking pretty hard on funnels
Dylan / Design unlocking vibe coding to prod website which I think is a big unlock

As of today - this frees me up finally. I'm going hardcode feedback mode across all channels and will IC on ARPU myself. Still pushing Autopilot personally (just changed the LP, ads etc.). Going to figure out with Danny & Manoj the best way for me to go support on ARPU / unit economics / business model this week. Also really want to see how the protocol goes this week with Kingsley's changes. Just gave feedback on that too.

## Growth Round-Up / Updates
**MTD:** $1.44M (53% to target).
**Autopilot:** 9 orders so far. Found ads were serving to exclusion states (wasting spend), fixed. Also fixing widget confusion + mobile layout bug based on session recordings. All changes done — let's see how it performs.
**Media Allocation System:** Looking good. Aligned the team Friday around new ownership of the P&L.
**CVR Experiments Board:** Live. Handed to Jeff & Jack. I'll be cracking the whip on member growth for D Jeff etc.
**MapMyRun:** Doing well from emails. Will/Hannah/Alice activating this, 60k emails sent so far. Will needs to get $500k from this channel (we paid $150k over 12 months).
**Founding Partners (Amada):** Really cranking. Also chatting to some folks to hire. She jumped in to get the Giannis deal done. Closing more MDs and Dr Amy Shah which will add medical credibility.
**Niel:** Should be signing anytime soon.
**Checkout UI 2.0:** Live — investigating CVR changes now.

## How can we go faster / more impact
The new structure has been good. I get roped into some of Adam's stuff which is fine, relatively low lift and should be off my plate soon. The shift is: managing the numbers rather than managing the projects. I'm spending far more time critiquing, giving feedback, pushing back on quality. That's the right use of my time.

## Blockers / Challenges
[Redacted]

## Additional FYI
[Redacted]

## Feedback
[Redacted]
```

## Workflow

1. User provides raw notes / brain dump
2. Format into the template above
3. If a section is missing context, ask the user: "Anything for [section]?"
4. Output the full formatted update, ready to copy-paste
