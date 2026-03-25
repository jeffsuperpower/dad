---
name: compliance-check
description: This skill should be used when the user asks to "check compliance", "review for FDA/FTC", "compliance review", "check health claims", "is this copy compliant", or needs to review ad copy for regulatory compliance in health-tech marketing. Provides RED/YELLOW/GREEN flagging and aggressive-but-defensible rewrites.
---

# Compliance Review for Health-Tech Ads

Review ad copy for FDA/FTC compliance with aggressive-but-defensible rewrites.

## Core Philosophy

**Never delete. Always rewrite.**

The goal is persuasive copy that doesn't cross legal lines—not neutered copy that doesn't convert.

## Risk Assessment Framework

### GREEN - No Change Needed
Copy is defensible, no regulatory concern.
**Action:** Approve as-is

### YELLOW - Minor Adjustment
Grey area language that could be strengthened or clarified.
**Action:** Provide slight adjustment, explain rationale

### RED - Requires Rewrite
Language that could trigger FDA/FTC action.
**Action:** Provide compliant alternative that preserves persuasive intent

## Compliance Categories

### 1. Disease Claims (Highest Risk)

**RED - Never Use:**
- "Prevents [disease]"
- "Cures [condition]"
- "Treats [illness]"
- "Diagnoses [disease]"
- "Fixes [health problem]"

**GREEN - Safe Alternatives:**
- "Detects early signs of..."
- "Tracks biomarkers related to..."
- "Monitors indicators that may be associated with..."
- "Helps identify potential imbalances"

**Example Rewrite:**
```
RED: "Prevent diabetes before it starts"
GREEN: "Detect early signs of metabolic imbalance—before symptoms appear"
```

### 2. Outcome Guarantees (High Risk)

**RED - Never Use:**
- "Guaranteed results"
- "You WILL feel better"
- "100% effective"
- "Cures fatigue"

**YELLOW - Use Carefully:**
- "May help support..."
- "Designed to help..."
- "Members report..."

**GREEN - Safe:**
- "Track your progress"
- "See your numbers improve over time"
- "Data to inform your decisions"

**Example Rewrite:**
```
RED: "Get your energy back guaranteed"
GREEN: "See exactly what's draining your energy—and what to do about it"
```

### 3. Care Team Claims

**RED - Wrong Attribution:**
- "24/7 access to Harvard doctors"
- "UCLA physicians available anytime"
- "Stanford clinicians on call"

**GREEN - Correct Attribution:**
- "On-demand access to Superpower's care team" (NOT "24/7 access")
- "Personalized protocols" (NOT "co-created with Harvard, UCLA & Stanford MDs" - removed 2026-01-07)
- "Care team available on-demand"

**Note:** We can mention individual credentials (e.g., "Dr. Lufkin, UCLA Medical Professor") but CANNOT claim protocols were co-created with these institutions.

### 4. Comparison Claims

**YELLOW - Verify Before Using:**
- Competitor pricing comparisons (verify current prices)
- Feature comparisons (must be factually accurate)
- "Better than" claims (need substantiation)

**GREEN - Safe Comparisons:**
- "Annual physicals test 20-30 biomarkers. We test 100+"
- "$199/year vs. $5,000+ concierge medicine" (if accurate)
- "More comprehensive than standard lab work"

### 5. Testimonial/Results Claims

**RED - Avoid:**
- "I lost 30 pounds!" (implies treatment outcome)
- "My diabetes reversed!" (disease cure claim)
- "Completely healed" (treatment claim)

**GREEN - Safe:**
- "I finally understood why I was tired"
- "The data helped me have better conversations with my doctor"
- "I feel more informed about my health"

## Review Process

### Step 1: Flag All Claims

Read through copy and flag every:
- Health outcome statement
- Disease/condition reference
- Comparison claim
- Care team mention
- Guarantee or promise

### Step 2: Assess Each Flag

For each flagged element:
1. Assign risk level (RED/YELLOW/GREEN)
2. Identify specific concern
3. Draft compliant alternative

### Step 3: Rewrite Preserving Intent

The rewrite must:
- Remove legal risk
- Preserve persuasive power
- Sound natural (not legalistic)
- Maintain the emotional hook

## Output Format

```markdown
# Compliance Review: [Ad/Concept Name]

**Overall Risk:** [GREEN / YELLOW / RED]
**Review Date:** [Date]

---

## Original Copy

[Paste full original copy here]

---

## Flagged Elements

### Flag 1: [Quote from copy]
**Risk Level:** [RED/YELLOW/GREEN]
**Issue:** [Specific compliance concern]
**Rewrite:** [Compliant alternative]
**Rationale:** [Why this is safer while preserving intent]

### Flag 2: [Quote from copy]
**Risk Level:** [RED/YELLOW/GREEN]
**Issue:** [Specific compliance concern]
**Rewrite:** [Compliant alternative]
**Rationale:** [Why this is safer while preserving intent]

---

## Revised Copy

[Full copy with all rewrites integrated]

---

## Summary

**Changes Made:** [Number]
- [X] RED flags resolved
- [Y] YELLOW flags adjusted
- [Z] GREEN (no change needed)

**Key Watch Areas:**
- [Any ongoing concerns for this concept]
- [Recommendations for future versions]
```

## Common Rewrites Reference

| Original (Risky) | Rewrite (Compliant) |
|------------------|---------------------|
| Prevents disease | Detects early signs |
| Cures fatigue | Reveals what's causing fatigue |
| Fixes hormones | Tracks hormone levels |
| Diagnoses conditions | Identifies potential imbalances |
| 24/7 access | On-demand access to Superpower's care team |
| Guarantees results | Provides data for informed decisions |
| Harvard doctors 24/7 | Personalized protocols from Superpower's care team |
| Protocols co-created with Harvard | Personalized protocols (claim removed 2026-01-07) |
| Reverses aging | Tracks biomarkers associated with aging |
| Heals your gut | Monitors gut health indicators |
| Stops inflammation | Measures inflammation markers |

## Grey Area Guidance

### "Early Detection" - Generally Safe
✅ "Early detection of potential issues"
✅ "Catch imbalances before symptoms appear"
⚠️ "Early detection of cancer" (too specific, implies diagnosis)

### "Optimize" - Use Carefully
✅ "Optimize based on your data"
✅ "Optimization protocols"
⚠️ "Optimize your health" (vague but generally acceptable)
❌ "Optimize to prevent disease" (links optimization to disease prevention)

### "Personalized" - Generally Safe
✅ "Personalized protocols"
✅ "Personalized recommendations"
⚠️ "Personalized treatment" (implies medical treatment)

## Quality Gates

Before approving copy:

**Mandatory Checks:**
- [ ] No disease prevention/cure/treatment claims
- [ ] No guaranteed health outcomes
- [ ] Care team attribution is correct
- [ ] Comparison claims are verifiable
- [ ] No "diagnose" language

**Recommended Checks:**
- [ ] Pricing matches current brand guide
- [ ] Statistics are current and sourced
- [ ] Testimonial-style copy focuses on experience, not outcomes
- [ ] Urgency doesn't imply health emergency

## Escalation

If unsure about a claim:
1. Default to more conservative language
2. Flag for legal review
3. Provide multiple rewrite options
4. Document reasoning for either direction
