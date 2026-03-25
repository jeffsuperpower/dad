---
name: testimonial-dashboard
description: Use when asked for "testimonial dashboard", "my numbers", "stream health", "how are my ads doing", "testimonial performance", "creative testing report", or any request for testimonial stream ad performance, CAC tracking, and creative testing insights.
user_invocable: true
---

# Testimonial Stream Dashboard

## Purpose

Pull live Meta Ads data for the testimonial stream, calculate CAC and efficiency metrics, tier every ad, surface patterns by format/member/angle, and generate creative testing recommendations. Zero manual data entry — just run the skill and get your readout.

## Data Collection

### Step 1: Pull Ad Performance

Use `mcp__meta-ads__get-ad-performance` with these parameters:
- **dateRange**: `last_7d` (primary view) AND `last_30d` (trend view)
- **metrics**: `["impressions", "clicks", "spend", "ctr", "cpc", "cpm"]`
- **customActions**: `["subscription_created", "offsite_conversion.custom.797731396203109"]`
- **attributionWindows**: `["7d_click"]`
- **includeActionValues**: `false`

This returns all ads in the account. Filter to testimonial stream only.

### Step 2: Filter to Testimonial Ads

From the results, keep only ads where the ad name contains "testimonial" in the Stream field (case-insensitive). The team naming convention is:

```
ID_Name_Stage_Week_MediaType_Stream_Messenger_ICP_Format_Angle
```

Split ad names by `_` and check if field 6 (Stream) contains "testimonial" or "Testimonial". Also catch ads where any part of the name contains "testimonial" as a fallback for legacy naming.

If very few or zero ads match, ask the user: "I found [X] ads matching 'testimonial'. Does that seem right, or is the stream named differently?"

### Step 3: Parse Ad Names

For ads following the convention `ID_Name_Stage_Week_MediaType_Stream_Messenger_ICP_Format_Angle`, extract:
- **Messenger**: Field 7 — the member name
- **Format**: Field 9 — the video format (e.g., Interview, QandA, VoiceMemo, Compilation, SplitScreenData)
- **Angle**: Field 10 — the messaging angle (e.g., Cancer, DoctorMissed, Transformation, WomensHealth, etc.)

**Do NOT require pre-defined values.** Parse whatever is in the Format and Angle fields. Group by whatever values exist in the data. If the user asks "how are the cancer angle ads performing?" — filter to ads where the Angle field matches "cancer" (case-insensitive).

For ads that don't follow the convention (legacy ads), mark them as:
- Messenger: parse best guess from ad name
- Format: `Legacy`
- Angle: `Unknown`

Note any legacy ads in the output so the user knows which ads to rename.

### Step 4: Calculate Metrics

**Per-ad CAC:**
```
CAC = spend / (subscription_created + offsite_conversion.custom.797731396203109)
```
If conversions = 0, CAC = "No conversions" (don't divide by zero).

**Stream-level blended CAC:**
```
Blended CAC = total testimonial spend / total testimonial conversions
```

**Efficiency Ratio:**
```
Efficiency Ratio = $400 (CAC target) / Blended CAC
```
- >= 1.0 = beating target (GREEN)
- >= 0.85 = close (AMBER)
- < 0.85 = missing (RED)

**Win Rate:**
```
Win Rate = (ads with CAC < $350) / (ads with spend > $600) * 100
```
Only count ads with enough spend to be evaluated.

### Step 5: Tier Each Ad

| Tier | Criteria |
|------|----------|
| **Proven Winner** | CAC < $350 AND spend > $5,000 |
| **Moderate Winner** | CAC < $350 AND spend $1,000-$5,000 |
| **Early Signal** | CAC < $350 AND spend < $1,000 |
| **Kill** | CAC > $400 AND spend > $600 |
| **Insufficient Data** | Spend < $600 AND CAC > $350 (not enough signal) |
| **No Conversions** | 0 conversions regardless of spend |

---

## Output Format

Present the dashboard in this exact structure:

```markdown
# Testimonial Stream Dashboard — Week of [Date]

## Stream Health
| Metric | 7-Day | 30-Day | Target |
|--------|-------|--------|--------|
| Total Spend | $X | $X | ~$9.5K/wk |
| Conversions (subs) | X | X | — |
| Blended CAC | $X | $X | < $400 |
| Efficiency Ratio | X.XXx | X.XXx | > 1.0x |
| Win Rate | X% | X% | — |
| Ads Live | X | — | — |

**Status:** [GREEN/AMBER/RED] — [one-line summary]

[If AMBER or RED, add escalation warning:]
> Escalation risk: [Tier 1/2/3 assessment]

---

## Ad Tier Breakdown

### Proven Winners (scale these)
| Ad Name | Messenger | Format | Angle | Spend | CAC | Action |
[rows or "None yet"]

### Moderate Winners (increase spend)
[same table format]

### Early Signal (watch closely)
[same table format]

### Kill (pause immediately)
[same table format]

### Insufficient Data
[same table format]

---

## Performance by Variable

### By Format (primary test axis)
| Format | Ads | Total Spend | Blended CAC | Efficiency | Verdict |
[group all ads by whatever Format values exist in the data]

### By Messenger
| Messenger | Ads | Total Spend | Blended CAC | Best Ad | Worst Ad |
[group all ads by messenger]

### By Angle (passive tracking)
| Angle | Ads | Total Spend | Blended CAC | Efficiency | Verdict |
[group all ads by whatever Angle values exist — this is directional insight]

---

## Insights & Recommendations

### What the data says
[Generate 3-5 specific, data-backed observations. Examples:]
- "VoiceMemo format is outperforming Interview by X% on blended CAC across Y ads"
- "Ron's ads are consistently in Early Signal territory — worth producing more cuts in the winning format"
- "Cancer angle ads are averaging $X CAC vs $Y for Transformation — worth casting more members with cancer stories"
- "You have X ads in Kill tier still spending $Y/week — pause these to save budget"

### Creative testing suggestions for next week
[Based on the testing framework in knowledge/creative-testing-framework.md, recommend:]

1. **What to scale:** [Which winning format to double down on, which members to re-cut]
2. **What to kill:** [Specific ads to pause, with $ savings estimate]
3. **What to test next:** [Specific grid recommendation]
   - Recommended grid: [e.g., "Test 3 new members in VoiceMemo + keep QandA with 2 members"]
   - Rationale: [e.g., "VoiceMemo has best blended CAC — need more data to confirm"]
4. **Format rotation:** [Based on the rotation plan — which format to swap in/out]
5. **New member pipeline:** [How many new members to add and in what format]
6. **Angle observations:** [Any messaging angles that are passively trending up or down]

### Naming issues
[List any ads not following the naming convention. Suggest renames.]
```

---

## Handling Edge Cases

**No testimonial ads found:**
Ask: "I couldn't find ads with 'testimonial' in the stream field. What's the stream name for your ads?"

**Very low spend (< $500 total across stream):**
Note that all metrics are directional only. Don't make tier assignments. Focus output on the testing plan.

**All ads have 0 conversions:**
Focus on CTR/CPC as proxy metrics. Suggest format changes.

**Legacy naming (can't parse fields):**
Group legacy ads separately. Recommend renaming. Still calculate CAC and tier them.

**User asks about a specific angle or format:**
Filter to ads matching that value and give a focused breakdown. E.g., "how are the cancer angle ads performing?" → filter Angle field to "cancer" (case-insensitive), show blended CAC, top/bottom performers, and trend.

---

## Reference

This skill uses the Creative Testing Framework documented in `knowledge/creative-testing-framework.md`. Read that file for:
- Full testing methodology (Format x Member grid + pipeline)
- Format rotation plan (which formats to cycle in/out over 6 weeks)
- Phase 1 vs Phase 2 guidance
- Core testing rules (Rule of 2s, 2-week minimum, group don't isolate)
- Winner tier thresholds and escalation awareness

When generating recommendations, reference the framework to determine:
- What phase the user is likely in (based on weeks of data and whether winners exist)
- Which formats have been tested vs untested
- What the rotation plan recommends for this cycle
- How to structure the next week's grid
