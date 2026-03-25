---
description: Sync a member profile to the Testimonial Library app. Use after creating or updating a member profile to push the data to the live web app database.
---

# Sync to Testimonial App

This skill syncs member profile data to the Superpower Testimonial Library web app (https://testimonial-app-zeta.vercel.app).

## When to Use

Call this skill after:
- Creating a new member profile in `/testimonials/profiles/`
- Updating an existing profile with new quotes or information
- Completing Phase 1 of Thalia's workflow (profile creation)

## How to Use

After creating/updating a profile, invoke this skill with the profile data:

```
/sync-to-testimonial-app
```

Then provide the member data in this format:

```json
{
  "member": {
    "spId": "SP-XXX",
    "name": "First Last",
    "age": 45,
    "biologicalAge": 38,
    "location": "City, State",
    "occupation": "Job Title",
    "healthFocus": ["heart", "metabolic", "energy"],
    "themes": ["diagnostics", "ai", "action-plan", "transformation", "dr-dismissal"],
    "demographics": ["male", "40s", "professional"],
    "icp": "hubermanite",
    "motivation": "optimization-driven",
    "keyDiscovery": "What Superpower revealed for them",
    "notes": "Interview notes here",
    "isCompensated": true,
    "compensationDetails": "Free re-test",
    "usageRights": {
      "paidAds": true,
      "web": true,
      "email": true,
      "organicSocial": true,
      "nameUsage": "first_last_initial"
    }
  },
  "transcript": "Full transcript text here...",
  "quotes": [
    {
      "verbatimText": "The exact quote from the transcript",
      "lineReference": "45-47",
      "themes": ["energy", "transformation"],
      "quoteType": "DISCOVERY",
      "bestFor": "Video ads, energy angle"
    }
  ]
}
```

## API Endpoint

The skill calls:
```
POST https://testimonial-app-zeta.vercel.app/api/webhooks/thalia
```

## What Gets Synced

1. **Member Profile** - All biographical and operational data
2. **Transcript** - Full interview transcript (if provided)
3. **Quotes** - Extracted quotes with metadata (deduped by text)

## Critical: Always Include Quotes

**Every sync MUST include the `quotes` array.** Extract all standout quotes from the profile's "Standout Quotes" section and include them in the payload. These quotes feed the Quote Bank — if you skip them, the member shows up in the app but their quotes don't appear in search.

For each quote, include:
- `verbatimText` — the exact quote (required)
- `themes` — tags from the canonical taxonomy relevant to THIS specific quote (see below)
- `quoteType` — story beat: `HOOK`, `CONFLICT`, `BRIDGE`, `DISCOVERY`, or `RESULT`
- `bestFor` — use case like `"Video ads, missed diagnosis angle"`

## Critical: Use Canonical Tag Taxonomy

All tags MUST come from the official taxonomy. Do not invent new tags.

### ICP (pick 1 per member, stored in `icp` field)
| Value | Who |
|-------|-----|
| `hubermanite` | Data-driven optimizer, biohacker, quantified-self |
| `champagne-yogi` | Wellness-oriented, holistic, lifestyle-focused |
| `menopausal-mom` | Women 40s-50s+ dealing with hormonal/perimenopause |
| `former-college-athlete` | Athletic background, fitness identity, performance-focused |

If no ICP is a good fit, set `icp` to `null`.

### Health Focus (stored in member's `healthFocus` array)
Pick all that apply from: `heart`, `hormones`, `metabolic`, `energy`, `sleep`, `inflammation`, `thyroid`, `immune`, `womens-health`, `gut`, `aging`, `weight`, `family-risk`, `cancer`

### Product + Angle tags (stored in member's `themes` array)
**Product:** `diagnostics`, `ai`, `supplements`, `action-plan`
**Angle:** `transformation`, `optimization`, `dr-dismissal`, `access`, `pricing`, `ease`, `mental-clarity`

### Quote-Level Tagging
Each quote's `themes` array should contain the specific tags relevant to THAT quote — a mix of health focus and angle tags. For example:
- A quote about sleep improving → `["sleep", "transformation"]`
- A quote about doctors not listening → `["dr-dismissal"]`
- A quote about the AI feature → `["ai", "ease"]`

This powers the Quote Bank filters — accurate quote-level tags mean users can find the right quote for their content.

## Automation

For Thalia: After completing Phase 1 (profile creation), automatically call this skill to sync the new member to the app. Always include all extracted quotes from the standout quotes section with proper taxonomy tags.
