---
name: b2b-proposal
description: Component toolkit for generating adaptive B2B proposals. Not a fixed template — provides building blocks that Poppy selects from based on meeting context, client tone, and relationship stage. Use when asked to "write a proposal", "generate proposal", "create B2B proposal", or "proposal for [client]".
---

# B2B Proposal Component Toolkit

## Philosophy

There is no single proposal template. This skill provides **building blocks** that Poppy assembles based on what the client actually needs. Some proposals use 3 components. Some use 8. The meeting notes and the user's guidance determine which.

## Available Components

### Meeting Recap
**Use when:** You want the client to know you listened. Almost always included.
**Format:** 3-5 bullet points reflecting what they said, using their language. Not a transcript summary — a curated mirror of what mattered.

### Superpower Overview
**Use when:** They don't fully understand the product yet.
**Keep it to:** 5 key points max. 100+ biomarkers, personalized protocols, on-demand care team, marketplace, annual retesting. Match depth to their familiarity. Skip entirely if they already know us well.
**Compliance:** Use exact language from `superpower-guide.md`. Never say "diagnose", "treat", "cure", "prevent disease", "24/7 access".

### Condition Cost Data
**Use when:** You need to quantify the problem before pitching the solution.
**Available conditions:**

**Diabetes (HbA1c):**
- 33% of working-age adults have prediabetes; >80% unaware (CDC)
- $12,022/yr diabetes excess cost (Parker et al. 2024)
- 24x cost jump: prediabetes ($500/yr) to diabetes ($12,022/yr) (Dall et al. 2019)
- Costs accelerate at 14.3% CAGR for 5 years before diagnosis (Zhuo et al. 2021)
- $736/yr savings per 1% HbA1c reduction (Lage & Boye 2020)
- Upper prediabetes (6.0-6.4%) progresses at 3x the rate of lower (Zhu et al. 2022)

**Cardiovascular (ApoB + Lp(a)):**
- $52,485 first-year cost per MI; $44,007 per stroke; $79,253 per CABG (Bonafede et al. 2015)
- Elevated Lp(a): +$1,976/yr excess costs (Zhao et al. 2016)
- 21% fewer major vascular events per mmol/L LDL-C reduction (CTT 2012)
- $696/yr medical cost reduction per high-risk patient on statin therapy (Fitch et al. 2009)
- ApoB is superior to LDL-C for predicting events (Khan et al. 2019)

**Kidney Disease (eGFR):**
- ~15% prevalence, mostly unaware (NIDDK/CDC)
- 10.2x cost multiplier: no CKD ($7,537) to Stage 4-5 ($76,969) in commercial populations (Golestaneh et al. 2017)
- Dialysis: $90,000-$121,948/yr (CMS / Golestaneh)
- Stage 3 to Stage 4 progression cost: +$9,200/yr (Honeycutt et al. 2013)
- CKD screening ICER: $9,184/QALY — among most cost-effective screenings studied (Yeo et al. 2023)

**Vitamin D (25(OH)D):**
- 42% of US adults deficient; higher in indoor/office workers (NHANES)
- +$3,262/yr excess cost when deficient (Peiris et al. 2008)
- $580,000/1,000 employees/yr autoimmune burden (IBI/WellTheory 2025)
- VITAL trial RCT: 22% autoimmune reduction (39% after 2+ years) (Hahn et al. 2022)
- Vitamin D correction NNT=4 in deficient vs flu vaccine NNT=71 (Martineau et al. 2017)

**Rule: Only include conditions the client mentioned or that directly relate to their stated concerns.** Don't pad with extra conditions to look thorough.

### Superpower Impact Data
**Use when:** You need to show that testing leads to actual improvement.
**Data points (from Superpower members with 2+ blood draws):**

| Biomarker | All Members | Elevated/At-Risk |
|-----------|------------|-----------------|
| HbA1c | 58.8% lowered | 83.8% of >5.7% improved |
| ApoB | 50.6% reduced | 64.9% of >90 mg/dL lowered |
| Vitamin D | 66.7% increased | 88.4% of <30 ng/mL increased |

Additional stats (use selectively):
- 60% found something missed by their doctor
- 82% implemented Action Plan recommendations
- 93% rated Action Plan as more useful than yearly checkup
- 34.3% overall health score improvement between draws

### ROI Calculation
**Use when:** The client asked for numbers, shared employee count, or is in active evaluation.
**Do NOT use when:** Early-stage relationship, introductory call, or they haven't asked about costs yet.

**Calculation formulas by condition:**

Diabetes: N × 33% × 7.5% progression × 50% reduction × $12,022 = savings
Cardiovascular: N × [verified detection rate] × 3% event rate × 15% reduction × $48,000 = savings
Kidney: N × 15% × 3.5% progression × intervention × $9,200 = savings
Vitamin D: N × 42% × 88.4% corrected × 2.5 episodes × 19% reduction × $1,324 = savings

PMPY ranges: Diabetes $156-$221, CV $96-$295, Kidney $46-$122, Vitamin D $142-$375
Total conservative: $440 PMPY (2.3x ROI vs $189), Moderate: ~$700 (3.7x), Optimistic: $1,013 (5.4x)

**Presentation:** Can be a full table, a simple bottom-line paragraph, or a one-liner depending on the proposal flavor. Not every ROI section needs a 4-condition breakdown.

### Program Comparison
**Use when:** They're comparing Superpower to existing programs or alternatives.
**Rule:** NEVER name competitors. Use generic categories.
**Adapt the anchor to the archetype:**

**Enterprise (vs. traditional wellness):**

| | Traditional Wellness | Superpower Health Intelligence |
|---|---|---|
| Data source | Self-reported | Objective biomarker testing |
| Monitoring | Annual health screening | Continuous health monitoring |
| Tracking | Point-in-time snapshot | Longitudinal trend tracking |
| Clinical support | No follow-through | Care team + AI support |
| Engagement model | Incentives required | Engagement through relevance and value |
| Personalization | Generic content | Personalized based on actual biology |

**Executive (vs. traditional executive physicals):**

| | Traditional Executive Physical | Superpower |
|---|---|---|
| Frequency | 1× per year snapshot | Continuous monitoring |
| Biomarkers | Single comprehensive panel | 100+ biomarkers with advanced add-ons |
| Clinical access | Annual physician visit | On-demand concierge clinical chat |
| Recommendations | Generic | Personalized protocols with ongoing support |
| Approach | Reactive (find problems) | Proactive (optimize performance) |
| Results delivery | PDF | AI companion + care team + concierge |

Adapt columns based on what they're actually comparing to. Don't include categories that aren't relevant.

### Pilot Structure
**Use when:** They want to start small or you're recommending a pilot approach.

Standard framework (adapt timeline to their deadlines):
1. Enrollment (month 1-2): voluntary, target size
2. Baseline (month 1): first blood draw
3. Intervention (months 1-6): protocols, marketplace, care team
4. Retest (month 6): second draw, measure improvement
5. ROI report (month 7): before/after analysis
6. Scale decision: based on results

Success metrics: enrollment rate, biomarker improvement rates, Action Plan implementation, member satisfaction, claims trajectory

### Objection Responses
**Use when:** The meeting raised specific concerns. Only address objections that were actually raised.

See agent file for pre-built responses. Always:
1. Restate the objection honestly
2. Respond with evidence
3. Propose a forward path

### Assumptions & Methodology
**Use when:** The proposal includes ROI numbers. Transparency builds trust.
**Format:** Brief table of what you assumed and why. Flag where Accorded/claims data validation would strengthen the numbers.

### Next Step
**Use in:** Every proposal, regardless of flavor.
**Rule:** ONE specific, time-bound action. Not three. Not a list. The single most important thing that should happen next.

---

## Citation Guidelines

**Evidence Brief / ROI Proposal:** Full citations with paper name, journal, sample size, and URL.
**Pilot Pitch / Warm Follow-Up:** Parenthetical references only ("published research across 77,000+ patients shows...").
**Objection Response:** Cite only where it directly supports the counter-argument.

Full citation library with URLs lives in `${CLAUDE_PLUGIN_ROOT}/b2b-ent/research/research-journey-and-results.md`. Key papers:

[1] Parker et al. 2024, Diabetes Care — https://diabetesjournals.org/care/article/47/1/26/153797/
[2] Dall et al. 2019, Diabetes Care — https://pmc.ncbi.nlm.nih.gov/articles/PMC6702607/
[3] Zhuo et al. 2021, Diabetes Care — https://pmc.ncbi.nlm.nih.gov/articles/PMC7875131/
[4] Bonafede et al. 2015, CEOR — https://pmc.ncbi.nlm.nih.gov/articles/PMC4467662/
[5] Zhao et al. 2016, Clinical Cardiology — https://pmc.ncbi.nlm.nih.gov/articles/PMC5845436/
[6] Golestaneh et al. 2017, AJMC — https://www.ajmc.com/view/all-cause-costs-increase-exponentially-with-increased-chronic-kidney-disease-stage-article
[7] Yeo et al. 2023, Clinical Kidney J — https://pubmed.ncbi.nlm.nih.gov/38186904/
[8] Peiris et al. 2008, Military Medicine — https://pubmed.ncbi.nlm.nih.gov/19149342/
[9] IBI/WellTheory 2025 — https://www.ibiweb.org/resources/autoimmune-conditions
[10] Martineau et al. 2017, BMJ — https://pubmed.ncbi.nlm.nih.gov/28202713/
[11] Lage & Boye 2020, CMRO — https://pubmed.ncbi.nlm.nih.gov/32643451/
[12] Boye et al. 2022, Diabetes Therapy — https://pmc.ncbi.nlm.nih.gov/articles/PMC8873294/
[13] CTT 2012, Lancet — https://pubmed.ncbi.nlm.nih.gov/22607822/
[14] Honeycutt et al. 2013, JASN — https://pmc.ncbi.nlm.nih.gov/articles/PMC3752941/
[15] Hahn et al. 2022, BMJ (VITAL) — https://pubmed.ncbi.nlm.nih.gov/35082139/
[16] Khan et al. 2019, Eur J Prev Cardiol — https://pmc.ncbi.nlm.nih.gov/articles/PMC7489462/
[17] Fitch et al. 2009, Am Health Drug Benefits — https://pmc.ncbi.nlm.nih.gov/articles/PMC4106489/
[18] Zhu et al. 2022, JAMA Network Open — https://pmc.ncbi.nlm.nih.gov/articles/PMC9021905/
