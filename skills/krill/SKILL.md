---
name: krill
description: This skill should be used when the user says "/krill", "competitive analysis", "SEM competitive report", "ad intelligence report", or asks to analyze a health/rx/telehealth keyword's competitive landscape. Pulls SpyFu ad history, DataForSEO search volume, and optionally Google Ads data to produce a NYT-style intelligence article with Plotly.js visualizations, published to Vercel.
argument-hint: <topic> | audit
metadata:
  author: superpower
  version: 1.0.0
---

# Krill - Competitive Intelligence for Health/Rx/Telehealth SEM

You are a **20-year health/rx/telehealth SEM strategist**. You make sharp, confident calls based on market conditions. No hedging, no "it depends" - you read the data and tell it straight. Your reports are the kind a VP of Growth reads over coffee and immediately forwards to their CEO.

## Two Modes

- **`/krill <topic>`** - Outside-in competitive analysis of a keyword/topic (e.g., `/krill tirzepatide`, `/krill enclomiphene`)
- **`/krill audit`** - Inside-out audit of our Google Ads account compared against market conditions

## Prerequisites

- `curl` (pre-installed on macOS)
- `git` and `gh` CLI (authenticated as `jeffsuperpower`)
- `npx` (Node.js) for Vercel deploy
- `python3` for data processing scripts
- Google Ads config at `/Users/jeffy/.config/google-ads-mcp/google-ads.yaml`

## Data Source Credentials

### SpyFu Ad History API
- **Auth**: Basic auth header
- **Key**: `NTE5MjlkMDktMTJmMS00MDM0LTg1ZDYtYjEwNTNiNGY2MTU2OkU5QUlYVUQy`
- **Endpoints**:
  - Term ad history: `https://api.spyfu.com/apis/cloud_ad_history_api/v2/term/getTermAdHistoryWithStats?term={keyword}`
  - Domain ad history: `https://api.spyfu.com/apis/cloud_ad_history_api/v2/domain/getDomainAdHistory?domain={domain}&term={filter}`
  - Domain stats: `https://api.spyfu.com/apis/domain_stats_api/v2/getAllDomainStats?domain={domain}`
- **Rate**: 1-second delay between calls

### DataForSEO
- **Auth**: Basic auth, `superpower@superpower.com` / `b39a3aa99dc58d3f`
- **Endpoints**:
  - Search volume (batch): `https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live`
  - Related keywords: `https://api.dataforseo.com/v3/dataforseo_labs/google/related_keywords/live`
- **Batch limit**: Up to 1,000 keywords per search_volume request
- **Cost**: ~$0.05 per request

### Google Ads API
- **Config file**: `/Users/jeffy/.config/google-ads-mcp/google-ads.yaml`
- **Customer ID**: `8618096874`
- **Login Customer ID**: `8461075268`
- **Run pattern**: `uvx --with 'google-ads>=25.1.0' --with pyyaml python3 <script>`

## Workflow

### Step 1: Parse Input and Create Project

Extract the topic from user input. If the argument is `audit`, run Mode 2 (see Step 1-Audit below).

```bash
# Create project directory
TOPIC="tirzepatide"  # from user input
DATE=$(date +%Y%m%d)
PROJECT_DIR="$HOME/krill-${TOPIC}-${DATE}"
mkdir -p "$PROJECT_DIR/data/raw"
cd "$PROJECT_DIR"
```

### Step 2: Keyword Expansion

Build 4 keyword batches from the seed topic. Use your SEM strategist knowledge to expand intelligently.

**Batch structure**:
1. **Specific** (10-15 kw): Direct product/molecule terms - `{topic}`, `{topic} online`, `buy {topic}`, `{topic} prescription`, `{topic} cost`, `{topic} side effects`
2. **Brand** (10-15 kw): Known advertisers/brands in this space - `hims {topic}`, `ro {topic}`, `henry meds {topic}`, `superpower {topic}`
3. **Category** (10-15 kw): Category-level terms - the drug class, condition, treatment type
4. **Generic** (10-15 kw): Broader intent terms - symptoms, conditions, alternatives, comparisons

Then call DataForSEO Related Keywords to discover additional terms:

```bash
curl -s -X POST "https://api.dataforseo.com/v3/dataforseo_labs/google/related_keywords/live" \
  -H "Authorization: Basic $(echo -n 'superpower@superpower.com:b39a3aa99dc58d3f' | base64)" \
  -H "Content-Type: application/json" \
  -d '[{"keyword":"'"$TOPIC"'","location_code":2840,"language_code":"en","depth":1,"limit":200}]'
```

Filter related keywords: keep those with search_volume > 50 and keyword_difficulty < 60. Add relevant ones to the keyword list.

Save the final keyword list to `data/keywords.json`:
```json
{
  "seed": "tirzepatide",
  "generated_at": "2026-02-28",
  "batches": {
    "specific": ["tirzepatide", "tirzepatide online", ...],
    "brand": ["hims tirzepatide", ...],
    "category": ["glp-1 medication", ...],
    "generic": ["weight loss medication", ...]
  },
  "all_keywords": ["tirzepatide", "tirzepatide online", ...]
}
```

### Step 3: Pull SpyFu Ad History

For each keyword, pull term ad history:

```bash
# For each keyword
curl -s "https://api.spyfu.com/apis/cloud_ad_history_api/v2/term/getTermAdHistoryWithStats?term=${KEYWORD}" \
  -H "Authorization: Basic NTE5MjlkMDktMTJmMS00MDM0LTg1ZDYtYjEwNTNiNGY2MTU2OkU5QUlYVUQy" \
  -o "data/raw/term_${KEYWORD_SLUG}.json"
sleep 1
```

**IMPORTANT**: Write a Python script to batch these calls. Do NOT run 50+ individual curl commands. The script should:
1. Read `data/keywords.json`
2. Loop through all keywords with 1s delay
3. Save each response to `data/raw/term_{slug}.json`
4. Track which keywords returned data
5. Collect all unique domains found across all keyword results

After term pulls, identify the top 20-30 domains by frequency. For each top domain, pull domain-level ad history with 3 topic filters:

```bash
curl -s "https://api.spyfu.com/apis/cloud_ad_history_api/v2/domain/getDomainAdHistory?domain=${DOMAIN}&term=${TOPIC}" \
  -H "Authorization: Basic NTE5MjlkMDktMTJmMS00MDM0LTg1ZDYtYjEwNTNiNGY2MTU2OkU5QUlYVUQy" \
  -o "data/raw/domain_${DOMAIN_SLUG}_${FILTER_SLUG}.json"
sleep 1
```

### Step 4: Pull DataForSEO Search Volume

Batch all keywords into one search_volume request (up to 1,000):

```bash
curl -s -X POST "https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live" \
  -H "Authorization: Basic $(echo -n 'superpower@superpower.com:b39a3aa99dc58d3f' | base64)" \
  -H "Content-Type: application/json" \
  -d '[{"keywords":["tirzepatide","buy tirzepatide",...],"location_code":2840,"language_code":"en"}]' \
  -o "data/search_volume.json"
```

Parse response to extract per-keyword:
- `search_volume` (monthly average)
- `cpc` (cost per click)
- `competition` (low/medium/high)
- `monthly_searches` array (for trend charts) - each entry has `{year, month, search_volume}`

### Step 5: Pull Google Ads Data (if relevant campaigns exist)

Write a temporary Python script to `/tmp/krill_gads_pull.py`:

```python
#!/usr/bin/env python3
"""Pull Google Ads data for Krill competitive analysis."""
import yaml, json, sys
from google.ads.googleads.client import GoogleAdsClient

CONFIG_PATH = "/Users/jeffy/.config/google-ads-mcp/google-ads.yaml"
CUSTOMER_ID = "8618096874"

client = GoogleAdsClient.load_from_storage(CONFIG_PATH, version="v18")
service = client.get_service("GoogleAdsService")

def query(gaql):
    return service.search_stream(customer_id=CUSTOMER_ID, query=gaql)

# Query 1: RSA ad copy
RSA_QUERY = """
SELECT
  campaign.name,
  ad_group.name,
  ad_group_ad.ad.responsive_search_ad.headlines,
  ad_group_ad.ad.responsive_search_ad.descriptions,
  ad_group_ad.ad.final_urls,
  ad_group_ad.status
FROM ad_group_ad
WHERE ad_group_ad.ad.type = RESPONSIVE_SEARCH_AD
  AND campaign.status = ENABLED
  AND ad_group.status = ENABLED
"""

# Query 2: Keywords
KW_QUERY = """
SELECT
  campaign.name,
  ad_group.name,
  ad_group_criterion.keyword.text,
  ad_group_criterion.keyword.match_type,
  ad_group_criterion.status
FROM keyword_view
WHERE campaign.status = ENABLED
  AND ad_group.status = ENABLED
  AND ad_group_criterion.status = ENABLED
"""

# Query 3: Performance (last 90 days)
PERF_QUERY = """
SELECT
  campaign.name,
  ad_group.name,
  metrics.impressions,
  metrics.clicks,
  metrics.cost_micros,
  metrics.conversions
FROM ad_group
WHERE campaign.status = ENABLED
  AND segments.date DURING LAST_90_DAYS
"""

# Query 4: Search terms (last 30 days)
ST_QUERY = """
SELECT
  campaign.name,
  ad_group.name,
  search_term_view.search_term,
  metrics.impressions,
  metrics.clicks,
  metrics.cost_micros
FROM search_term_view
WHERE segments.date DURING LAST_30_DAYS
"""

topic_filter = sys.argv[1] if len(sys.argv) > 1 else ""

results = {"rsa_ads": [], "keywords": [], "performance": [], "search_terms": []}

for stream in query(RSA_QUERY):
    for row in stream.results:
        headlines = [h.text for h in row.ad_group_ad.ad.responsive_search_ad.headlines]
        descriptions = [d.text for d in row.ad_group_ad.ad.responsive_search_ad.descriptions]
        results["rsa_ads"].append({
            "campaign": row.campaign.name,
            "ad_group": row.ad_group.name,
            "headlines": headlines,
            "descriptions": descriptions,
            "final_urls": list(row.ad_group_ad.ad.final_urls),
            "status": row.ad_group_ad.status.name,
        })

for stream in query(KW_QUERY):
    for row in stream.results:
        results["keywords"].append({
            "campaign": row.campaign.name,
            "ad_group": row.ad_group.name,
            "keyword": row.ad_group_criterion.keyword.text,
            "match_type": row.ad_group_criterion.keyword.match_type.name,
        })

for stream in query(PERF_QUERY):
    for row in stream.results:
        results["performance"].append({
            "campaign": row.campaign.name,
            "ad_group": row.ad_group.name,
            "impressions": row.metrics.impressions,
            "clicks": row.metrics.clicks,
            "cost": row.metrics.cost_micros / 1_000_000,
            "conversions": row.metrics.conversions,
        })

for stream in query(ST_QUERY):
    for row in stream.results:
        results["search_terms"].append({
            "campaign": row.campaign.name,
            "ad_group": row.ad_group.name,
            "search_term": row.search_term_view.search_term,
            "impressions": row.metrics.impressions,
            "clicks": row.metrics.clicks,
            "cost": row.metrics.cost_micros / 1_000_000,
        })

# Filter by topic if provided
if topic_filter:
    tf = topic_filter.lower()
    results["rsa_ads"] = [a for a in results["rsa_ads"]
        if tf in a["campaign"].lower() or tf in a["ad_group"].lower()
        or any(tf in h.lower() for h in a["headlines"])]
    results["keywords"] = [k for k in results["keywords"]
        if tf in k["campaign"].lower() or tf in k["keyword"].lower()]
    results["performance"] = [p for p in results["performance"]
        if tf in p["campaign"].lower() or tf in p["ad_group"].lower()]
    results["search_terms"] = [s for s in results["search_terms"]
        if tf in s["campaign"].lower() or tf in s["search_term"].lower()]

print(json.dumps(results, indent=2))
```

Run it:
```bash
uvx --with 'google-ads>=25.1.0' --with pyyaml python3 /tmp/krill_gads_pull.py "$TOPIC" > data/our_ads.json
```

**Gotcha**: If the `conversions` field causes errors, remove it from PERF_QUERY. `conversion_action_name` CANNOT be in the same query as `cost_micros` - but plain `conversions` usually works. If it fails, split into two queries.

### Step 5B: Paid Keyword Expansion via Unfiltered Domain Ad History

After scoring advertisers (Step 6), pull **unfiltered** domain ad history for the top 15-20 domains. Unlike Step 3 which filters by seed keywords, this call returns ALL ads a domain has ever run. Each ad includes a `keywords` array showing every paid search keyword that ad was shown for. This reveals what OTHER paid keyword clusters competitors bid on using the same landing pages.

**IMPORTANT: This is PAID SEARCH ONLY.** Do NOT use `getMostValuableKeywords` (that's organic/SEO). Use `getDomainAdHistory` WITHOUT a `term` parameter to get all paid ads and their keyword arrays.

**Why this matters**: If Hims buys ads for "tirzepatide" and "semaglutide" and "GLP-1 medication" and "BMI calculator" all pointing to `hims.com/weight-loss`, those are proven adjacent paid keyword clusters. The advertiser has already validated the connection by paying for clicks on all those keywords.

**Implementation**:

1. **Pull unfiltered domain ad history for top domains**:
   ```bash
   # No term= parameter = returns ALL ads for the domain
   curl -s "https://api.spyfu.com/apis/cloud_ad_history_api/v2/domain/getDomainAdHistory?domain=${DOMAIN}" \
     -H "Authorization: Basic NTE5MjlkMDktMTJmMS00MDM0LTg1ZDYtYjEwNTNiNGY2MTU2OkU5QUlYVUQy" \
     -o "data/raw/domain_unfiltered_${SLUG}.json"
   sleep 1
   ```

   Exclude generic domains: doubleclick.net, google.com, forbes.com, webmd.com

2. **Parse the `keywords` array from each ad**:
   - SpyFu response: `{results: [{keywords: ["kw1", "kw2", ...], url: "...", title: "..."}]}`
   - Each ad has a `keywords` array listing ALL paid search keywords that ad was shown for
   - Map: landing page URL -> set of paid keywords
   - Map: domain -> set of all paid keywords

3. **Identify NEW keywords not in seed list**:
   - Load `data/keywords.json` seed keywords
   - Subtract seed keywords from discovered keywords
   - The remainder are paid keyword expansion opportunities

4. **Cluster discovered keywords by theme**:
   Use regex patterns to group into clusters:
   ```python
   CLUSTER_PATTERNS = {
       "pharmacy_general": [r'pharmacy', r'rx\b', r'prescription', r'drug\s*store'],
       "semaglutide": [r'semaglutide', r'ozempic', r'wegovy', r'rybelsus'],
       "glp1_general": [r'glp[\s-]?1', r'incretin', r'zepbound'],
       "weight_loss_broader": [r'weight\s*loss', r'lose\s*weight', r'diet', r'obesity', r'bmi'],
       "cost_savings": [r'cheap', r'affordable', r'cost', r'price', r'coupon', r'discount'],
       "online_access": [r'online', r'near\s*me', r'buy\b', r'order\b', r'mail\s*order'],
       "specific_conditions": [r'diabetes', r'blood\s*sugar', r'a1c', r'cholesterol'],
       "competitor_brands": [r'hims', r'\bro\b', r'noom', r'calibrate', r'nutrisystem'],
       "body_composition": [r'muscle', r'protein', r'exercise', r'workout', r'fitness'],
   }
   ```

5. **Save output**:
   ```json
   // data/lp_paid_clusters.json
   {
     "landing_pages": {
       "hims.com/weight-loss": {
         "total_keywords": 62,
         "new_keywords": ["alli diet pills", "best supplements for perimenopause", ...],
         "seed_keywords": ["tirzepatide", "mounjaro"],
         "domains": ["forhers.com"],
         "ad_count": 145
       }
     },
     "new_keyword_clusters": {
       "semaglutide": {
         "keywords": ["buy ozempic", "semaglutide cost", "wegovy", ...],
         "domains": ["bestweightloss.io", "forbeshealth.com", "orderlymeds.com"],
         "count": 383
       }
     },
     "domain_keyword_counts": {
       "hims.com": { "total": 89, "new": 67, "seed": 22, "new_keywords": [...] }
     }
   }
   ```

**Rate limiting**: 1 call per domain, 1s delay. Top 17 domains = ~17 seconds.

**What this adds to the article**:
- Section: "**The Hidden Clusters**" - paid keyword clusters discovered from unfiltered competitor ad history
- Bar chart: cluster name, keyword count, domains bidding, sample keywords
- Strategic call: which paid clusters to enter first based on keyword count + domain validation
- Key insight: competitors treat multiple keyword clusters as one unified funnel

### Step 5C: Landing Page Screenshots & Conversion Analysis

Screenshot the top competitor landing pages and analyze conversion patterns. Ad copy tells you what competitors say. Landing pages tell you what they believe works.

**Implementation**:

1. **Create `data/screenshot_lps.js`** (Playwright):
   - Reads `data/lp_paid_clusters.json` (landing pages by keyword diversity) and `data/advertiser_scores.json` (top domains by investment score)
   - Selects top ~8-10 LPs, deduplicating by domain, weighted by keyword diversity (0.3) + investment score (0.7)
   - Skips non-competitor domains (doubleclick.net, google.com, forbes.com, webmd.com, etc.)
   - For each URL: launches headless Chromium via Playwright, sets viewport 1280x900, realistic user-agent, dismisses cookie/popup overlays (best-effort)
   - Captures hero screenshot (viewport only, above-the-fold) and full-page screenshot (PNG)
   - Saves to `screenshots/{domain_slug}.png` and `screenshots/{domain_slug}_hero.png`
   - Outputs `data/screenshot_manifest.json` with `{url, domain, slug, file, hero_file, captured_at, status}`
   - Gracefully handles timeouts/failures; retries with `domcontentloaded` + longer timeout if `networkidle` fails

2. **Run**:
   ```bash
   npm install playwright && npx playwright install chromium && node data/screenshot_lps.js
   ```

3. **Analyze each screenshot using Claude's vision capability** (Read tool on PNG files):
   For each LP, assess:
   - **Hero section**: Headline, subhead, primary CTA
   - **Trust signals**: Accreditation seals, media logos, patient counts, doctor photos, money-back guarantees
   - **Price framing**: Per-month, crossed-out prices, promo banners, no pricing shown
   - **Form design**: How many fields, what info upfront, free visit vs. paid intake
   - **Urgency/scarcity**: Countdown timers, seasonal promos, limited supply messaging
   - **Social proof**: Star ratings, review counts, patient photos, media mentions
   - **Above-the-fold density**: How much content before the first CTA
   - **Page archetype**: Price-first product page, objection-killer, brand lifestyle, trust-first legitimacy, affiliate comparison, pharma informational

4. **Save analysis to `data/lp_analysis.json`** with structured data per LP plus a `conversion_patterns` matrix and `strategic_summary`.

5. **Save screenshots to `screenshots/` directory** (committed to git, served as static assets by Vercel).

**What this adds to the article**:
- Section: "**The Landing Pages**" - inserted between Deep Dives and Whitespace
- 4-5 featured LP screenshots with hero images, conversion analysis grids, and strategic insights
- Conversion Pattern Matrix table comparing elements across archetypes
- CSS: `.screenshot-card`, `.conversion-grid`, `.archetype-badge`, `.lp-insight`
- Strategic call: match LP archetype to keyword intent (price-first for high-intent, brand for category, affiliate for informational)

### Step 6: Build Scoring Database

Write `data/build_scores.py` in the project directory:

```python
#!/usr/bin/env python3
"""Score advertisers, classify angles, build chart data."""
import json, os, re, glob
from collections import defaultdict

RAW_DIR = "data/raw"

# --- Accumulate advertiser data ---
advertisers = defaultdict(lambda: {
    "ads": [],
    "dates": set(),
    "keywords_seen_on": set(),
    "titles": set(),
    "urls": set(),
    "prices_mentioned": [],
    "total_ad_count": 0,
})

# Parse all term_*.json files
for fp in sorted(glob.glob(f"{RAW_DIR}/term_*.json")):
    keyword = os.path.basename(fp).replace("term_", "").replace(".json", "").replace("_", " ")
    try:
        data = json.load(open(fp))
    except:
        continue

    results = data if isinstance(data, list) else data.get("results", data.get("data", []))
    if not isinstance(results, list):
        continue

    for ad in results:
        domain = (ad.get("domain") or ad.get("domainName") or "").lower().strip()
        if not domain:
            continue

        a = advertisers[domain]
        a["total_ad_count"] += 1
        a["keywords_seen_on"].add(keyword)

        title = ad.get("title") or ad.get("adTitle") or ""
        body = ad.get("body") or ad.get("adBody") or ad.get("description") or ""
        a["titles"].add(title)

        url = ad.get("url") or ad.get("displayUrl") or ad.get("destinationUrl") or ""
        if url:
            a["urls"].add(url)

        # Date handling - SpyFu searchDateId encoding
        date_id = ad.get("searchDateId") or ad.get("dateId") or ad.get("searchDate") or 0
        if date_id:
            a["dates"].add(date_id)

        # Price extraction
        text = f"{title} {body}".lower()
        for p in re.findall(r'\$(\d+(?:\.\d{2})?)', text):
            val = float(p)
            if 10 < val < 1000:
                a["prices_mentioned"].append(val)

        a["ads"].append({"title": title, "body": body, "date_id": date_id, "keyword": keyword, "url": url})

# --- Score each advertiser ---
scored = []
for domain, a in advertisers.items():
    dates = sorted(a["dates"])
    if not dates:
        continue

    # Month extraction from SpyFu date IDs
    months_set = set()
    for d in dates:
        if d > 100000000:  # searchDateId format (YYYYMMDD * 100)
            ym = d // 100
        elif d > 1000000:  # YYYYMMDD format
            ym = d // 100
        else:
            ym = d
        months_set.add(ym)

    months_present = len(months_set)
    if months_present < 2:
        # Calculate span differently for single-month
        months_span = 1
    else:
        sorted_months = sorted(months_set)
        first_y, first_m = sorted_months[0] // 100, sorted_months[0] % 100
        last_y, last_m = sorted_months[-1] // 100, sorted_months[-1] % 100
        months_span = (last_y - first_y) * 12 + (last_m - first_m) + 1

    consistency = months_present / max(months_span, 1)
    kw_breadth = len(a["keywords_seen_on"])
    unique_titles = len(a["titles"])

    investment_score = (consistency * 40) + (min(kw_breadth, 30) * 1.5) + (min(unique_titles, 50) * 0.5) + (months_present * 2)

    scored.append({
        "domain": domain,
        "investment_score": round(investment_score, 1),
        "consistency": round(consistency, 3),
        "keyword_breadth": kw_breadth,
        "unique_titles": unique_titles,
        "months_present": months_present,
        "months_span": months_span,
        "total_ads": a["total_ad_count"],
        "prices": sorted(set(a["prices_mentioned"])),
        "avg_price": round(sum(a["prices_mentioned"]) / len(a["prices_mentioned"]), 2) if a["prices_mentioned"] else None,
        "urls": list(a["urls"])[:5],
    })

scored.sort(key=lambda x: -x["investment_score"])

# --- Classify messaging angles ---
ANGLE_PATTERNS = {
    "price_first": [r'\$\d+', r'(?:starts?|from|only|just)\s*\$', r'affordable', r'save \$', r'discount'],
    "insurance_access": [r'insurance', r'covered', r'copay', r'no insurance', r'FSA', r'HSA'],
    "legitimacy": [r'FDA', r'clinically?\s*proven', r'board.cert', r'licensed', r'medical\s*doctor', r'physician'],
    "convenience": [r'online', r'telehealth', r'home\s*deliver', r'ship.*door', r'no.*visit', r'virtual'],
    "urgency_scarcity": [r'limited', r'hurry', r'act\s*now', r'don.t\s*wait', r'running\s*out', r'last\s*chance'],
    "results_outcomes": [r'lost?\s*\d+\s*(?:lb|pound|kg)', r'results', r'transformation', r'before.*after', r'success'],
    "safety_trust": [r'safe', r'trusted', r'side\s*effect', r'no.*risk', r'guarantee', r'money.*back'],
    "comparison": [r'vs\.?', r'better\s*than', r'compared?\s*to', r'alternative', r'switch'],
    "brand_authority": [r'#1', r'leading', r'most\s*trusted', r'america.s', r'top\s*rated'],
    "free_offer": [r'free', r'no.*cost', r'trial', r'sample', r'\$0'],
}

angle_by_quarter = defaultdict(lambda: defaultdict(int))
angle_totals = defaultdict(int)

for domain, a in advertisers.items():
    for ad in a["ads"]:
        text = f"{ad['title']} {ad['body']}".lower()
        date_id = ad.get("date_id", 0)

        # Extract quarter
        if date_id > 100000000:
            ym = date_id // 100
        elif date_id > 1000000:
            ym = date_id // 100
        else:
            ym = date_id
        year = ym // 100
        month = ym % 100
        if year < 2018 or year > 2030:
            continue
        quarter = f"{year}Q{(month - 1) // 3 + 1}"

        for angle, patterns in ANGLE_PATTERNS.items():
            for pat in patterns:
                if re.search(pat, text, re.IGNORECASE):
                    angle_by_quarter[quarter][angle] += 1
                    angle_totals[angle] += 1
                    break

# --- Build monthly presence matrix for heatmap ---
monthly_presence = defaultdict(lambda: defaultdict(int))
for domain, a in advertisers.items():
    if domain not in [s["domain"] for s in scored[:25]]:
        continue
    for d in a["dates"]:
        if d > 100000000:
            ym = d // 100
        elif d > 1000000:
            ym = d // 100
        else:
            ym = d
        year = ym // 100
        month = ym % 100
        if 2018 <= year <= 2030:
            month_key = f"{year}-{month:02d}"
            monthly_presence[domain][month_key] += 1

# --- Build price trends ---
price_by_domain_quarter = defaultdict(lambda: defaultdict(list))
for domain, a in advertisers.items():
    if domain not in [s["domain"] for s in scored[:15]]:
        continue
    for ad in a["ads"]:
        text = f"{ad['title']} {ad['body']}".lower()
        date_id = ad.get("date_id", 0)
        if date_id > 100000000:
            ym = date_id // 100
        elif date_id > 1000000:
            ym = date_id // 100
        else:
            ym = date_id
        year = ym // 100
        month = ym % 100
        if year < 2018 or year > 2030:
            continue
        quarter = f"{year}Q{(month - 1) // 3 + 1}"
        for p in re.findall(r'\$(\d+(?:\.\d{2})?)', text):
            val = float(p)
            if 10 < val < 1000:
                price_by_domain_quarter[domain][quarter].append(val)

price_trends = {}
for domain, quarters in price_by_domain_quarter.items():
    price_trends[domain] = {q: round(sum(prices) / len(prices), 2) for q, prices in sorted(quarters.items())}

# --- Save outputs ---
json.dump(scored, open("data/advertiser_scores.json", "w"), indent=2)
json.dump(dict(angle_by_quarter), open("data/angle_matrix.json", "w"), indent=2)
json.dump(dict(angle_totals), open("data/angle_totals.json", "w"), indent=2)
json.dump({d: dict(m) for d, m in monthly_presence.items()}, open("data/monthly_presence.json", "w"), indent=2)
json.dump(price_trends, open("data/price_trends.json", "w"), indent=2)

print(f"Scored {len(scored)} advertisers")
print(f"Top 5: {', '.join(s['domain'] + ' (' + str(s['investment_score']) + ')' for s in scored[:5])}")
print(f"Angles tracked: {len(angle_totals)}")
print(f"Quarters covered: {len(angle_by_quarter)}")
```

Run it:
```bash
cd "$PROJECT_DIR" && python3 data/build_scores.py
```

### Step 7: Generate the Article HTML

Build a single-file `index.html` with the NYT-style editorial layout and Plotly.js charts. The article embeds all chart data in a single `const DATA = {...}` script block.

**HTML structure**:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{Title} | Superpower Growth Intelligence</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:wght@300;400;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <script src="https://cdn.plot.ly/plotly-2.27.0.min.js"></script>
    <!-- CSS from design system below -->
</head>
```

**CSS Design System** (embed in `<style>` tag):

```css
:root {
    --serif: 'Playfair Display', Georgia, serif;
    --sans: 'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif;
    --mono: 'JetBrains Mono', 'SF Mono', 'Consolas', monospace;
    --black: #1a1a1a;
    --dark: #2d2d2d;
    --gray: #6b6b6b;
    --light-gray: #e8e8e8;
    --bg: #fafaf8;
    --accent: #c41200;
    --link: #1a5276;
    --max-width: 720px;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: var(--sans); background: var(--bg); color: var(--dark); line-height: 1.7; }

.header-bar {
    border-bottom: 3px double var(--black);
    padding: 12px 24px;
    display: flex; justify-content: space-between; align-items: center;
    font-family: var(--mono); font-size: 11px; text-transform: uppercase;
    letter-spacing: 2px; color: var(--gray);
}

.hero { text-align: center; padding: 60px 24px 40px; max-width: 900px; margin: 0 auto; }
.hero h1 { font-family: var(--serif); font-size: clamp(36px, 6vw, 56px); line-height: 1.1; margin-bottom: 16px; color: var(--black); }
.hero .subtitle { font-size: 20px; color: var(--gray); font-style: italic; margin-bottom: 12px; }
.hero .byline { font-size: 13px; color: var(--gray); letter-spacing: 1px; text-transform: uppercase; font-family: var(--mono); }
.hero .data-line { font-family: var(--mono); font-size: 12px; color: var(--accent); margin-top: 8px; }

article { max-width: var(--max-width); margin: 0 auto; padding: 0 24px 80px; }
article p { margin-bottom: 20px; font-size: 18px; }
article h2 { font-family: var(--serif); font-size: 28px; margin: 48px 0 20px; padding-top: 32px; border-top: 1px solid var(--light-gray); color: var(--black); }
article h3 { font-family: var(--sans); font-size: 20px; font-weight: 600; margin: 32px 0 12px; }

.stat-boxes { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; margin: 32px 0; }
.stat-box { text-align: center; padding: 20px 12px; border: 1px solid var(--light-gray); }
.stat-box .number { font-family: var(--serif); font-size: 36px; font-weight: 700; color: var(--black); }
.stat-box .label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: var(--gray); margin-top: 4px; font-family: var(--mono); }

.chart-container { margin: 32px -60px; padding: 24px; background: white; border: 1px solid var(--light-gray); border-radius: 4px; }
.chart-container .chart-title { font-family: var(--serif); font-size: 20px; margin-bottom: 4px; }
.chart-container .chart-subtitle { font-size: 13px; color: var(--gray); margin-bottom: 16px; }
.chart-div { width: 100%; height: 450px; }

.pullquote {
    font-family: var(--serif); font-size: 24px; font-style: italic;
    color: var(--accent); text-align: center; padding: 32px 40px;
    border-top: 2px solid var(--accent); border-bottom: 2px solid var(--accent);
    margin: 40px 0; line-height: 1.4;
}

table { width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 14px; }
th { text-align: left; font-family: var(--mono); font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding: 8px 12px; border-bottom: 2px solid var(--black); }
td { padding: 8px 12px; border-bottom: 1px solid var(--light-gray); }
tr:hover td { background: #f5f5f0; }

.tier-badge { display: inline-block; padding: 2px 8px; border-radius: 3px; font-family: var(--mono); font-size: 11px; font-weight: 500; }
.tier-1 { background: var(--accent); color: white; }
.tier-2 { background: #e8a849; color: white; }
.tier-3 { background: #6b6b6b; color: white; }

.appendix { background: white; border: 1px solid var(--light-gray); padding: 32px; margin-top: 48px; font-size: 14px; }
.appendix h3 { font-size: 16px; margin: 24px 0 8px; }
.appendix p, .appendix li { font-size: 14px; color: var(--gray); }

.footer { border-top: 3px double var(--black); padding: 24px; text-align: center; font-family: var(--mono); font-size: 11px; color: var(--gray); letter-spacing: 2px; text-transform: uppercase; }

@media (max-width: 600px) {
    .chart-container { margin: 24px -12px; padding: 16px; }
    .hero h1 { font-size: 32px; }
    article p { font-size: 16px; }
}
```

**Plotly.js Chart Setup** (embed in `<script>` tag after the DATA block):

```javascript
// Shared Plotly config
const plotlyConfig = {
    displayModeBar: true,
    modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d'],
    displaylogo: false,
    responsive: true,
};

const plotlyLayout = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { family: 'Source Sans 3, sans-serif', size: 12, color: '#555' },
    margin: { t: 10, r: 20, b: 60, l: 60 },
    hoverlabel: { font: { family: 'Source Sans 3, sans-serif', size: 12 } },
    xaxis: { gridcolor: '#eee', zerolinecolor: '#ddd' },
    yaxis: { gridcolor: '#eee', zerolinecolor: '#ddd' },
};

// Color scale for heatmaps
const HEATMAP_COLORSCALE = [
    [0, '#faf9f6'],
    [0.25, '#f8e8c8'],
    [0.5, '#e8a849'],
    [0.75, '#d4553a'],
    [1, '#7b2d8b'],
];
```

**Required charts** (render each into its `<div class="chart-div" id="chart-{name}">` container):

1. **Advertiser Timeline Heatmap** (`chart-timeline`):
   - `type: 'heatmap'`, rows = top 20 advertisers, columns = months
   - z = ad count per month, colorscale = HEATMAP_COLORSCALE
   - Shows who entered when, who's consistent, who dropped out

2. **Messaging Angle Heatmap** (`chart-angles`):
   - `type: 'heatmap'`, rows = angle names, columns = quarters
   - z = percentage of ads using each angle per quarter
   - Text overlay: `texttemplate: '%{text}'`

3. **Price Trend Lines** (`chart-prices`):
   - `type: 'scatter'`, `mode: 'lines+markers'`, one trace per top advertiser
   - Y-axis: $/month, X-axis: quarters
   - Legend: `orientation: 'h'`, below chart

4. **Search Volume Trend** (`chart-volume`):
   - `type: 'scatter'`, `fill: 'tozeroy'` (area chart)
   - Monthly search volume for top 5-10 keywords
   - From DataForSEO monthly_searches data

5. **Keyword Category Bar Chart** (`chart-categories`):
   - `type: 'bar'`, `orientation: 'h'`
   - Horizontal bars showing volume by keyword category
   - Sorted descending by volume

6. **Our Position vs Market** (`chart-position`) - only if Google Ads data available:
   - Scatter plot: X = keyword volume, Y = our impression share or CPC
   - Bubble size = our spend, color = competitive density
   - Shows where we compete vs where we don't

**Data injection pattern**:
All chart data is pre-computed in Step 6 and embedded as:
```html
<script>
const DATA = {
    advertiser_scores: [...],    // from advertiser_scores.json
    monthly_presence: {...},      // from monthly_presence.json
    angle_matrix: {...},          // from angle_matrix.json
    price_trends: {...},          // from price_trends.json
    search_volume: {...},         // from search_volume.json
    our_ads: {...},               // from our_ads.json (if exists)
    keywords: {...},              // from keywords.json
    meta: {
        topic: "tirzepatide",
        generated: "2026-02-28",
        total_ads: 4763,
        total_advertisers: 54,
        total_keywords: 47,
    }
};
</script>
```

**Article Narrative Sections** (write these with the SEM strategist voice):

1. **The Market Shape** - How many advertisers, how fast it grew, what triggered growth
2. **Who's In The Room** - Tier classification table (institutional telehealth, compounders, affiliates, pharma)
3. **The Price War** - Entry prices vs ongoing, pricing frames, who's winning
4. **The Messaging Arms Race** - Angle prevalence heatmap + deep dive on dominant angles
5. **The Deep Dives** - Top 3-5 advertisers analyzed individually (timeline, copy evolution, strategy calls)
6. **The Landing Pages** - Screenshots of top competitor LPs with conversion analysis. Features 4-5 LPs across archetypes (price-first, objection-killer, brand lifestyle, trust-first, affiliate comparison). Includes conversion pattern matrix table.
7. **The Whitespace** - Keywords with search volume but zero/low advertiser competition
8. **The Hidden Clusters** - Paid keyword clusters discovered by pulling unfiltered competitor ad history. Shows what OTHER paid search keywords competitors bid on using the same landing pages. Ranked by keyword count and domain breadth. This is the paid keyword expansion roadmap.
9. **Where We Stand** - (if Google Ads data available) Our positioning, what we're doing right, what we're missing
10. **Strategic Recommendations** - 5-7 specific, actionable calls from the strategist persona
11. **The Nuclear Scenario** - Regulatory/market risks that could reshape everything

**Voice guidelines for writing**:
- First person plural when referring to Superpower ("we", "our")
- Confident, direct assertions - not "it appears that" but "the data shows"
- Numbers first, always - lead with the data point, then interpret
- Specific dollar amounts, percentages, dates - never vague
- Name names - don't say "a major telehealth provider", say "Hims"
- Use pullquotes for the sharpest strategic insights
- Sections flow like a magazine feature, not a PowerPoint deck

### Step 7B: Compliance Review (Vera + Marcus)

Before publishing, run the Strategic Recommendations section (Section 10) and any LP wireframes through Superpower's compliance reviewers. The article's competitive analysis sections (Sections 1-9, 11) are internal intelligence and do NOT need compliance review. Only the content we propose putting in front of customers needs review.

**What gets reviewed:**
- All 4 recommended Google Ad copy blocks (headlines + descriptions)
- All LP wireframe modals (hero copy, CTAs, trust bar claims, comparison tables, value stacks, FAQ answers, testimonials, guarantee language, pricing disclaimers)
- Any recommended ad sitelinks

**Run two parallel reviews:**

#### Vera (Claims Reviewer)
Reference: `plugins/growth-ai-agents/agents/vera-claims-reviewer.md`
Knowledge docs: `compliance-guide.md`, `rx-compliance.md`, `advertising-best-practices.md`, `superpower-guide.md`

Vera runs 9 passes on the customer-facing copy:
1. **Terminology scan** - "lab test" -> "biomarker", "clinical team" -> "care team", etc.
2. **Banned phrases** - "prevent disease", "cure", "treat", "diagnose", "24/7 access"
3. **Care team claims** - overreach about doctor/NP availability and scope
4. **Factual claims check** - every claim must be on the approved list
5. **Puffery check** - distinguish measurable claims from subjective opinions
6. **Competitor check** - NO competitor names in paid ad copy (ok in internal analysis sections)
7. **Channel check** - paid ads have stricter rules than organic/email
8. **Testimonials** - must be verbatim, real experience, incentivization disclosed
9. **Rx/compounded product check** - the big one for Krill reports:
   - Approved disclaimer present: "Compounded [product] is not FDA-approved and has not been evaluated by the FDA for safety, effectiveness, or quality. A patient-specific prescription is required."
   - No equivalence claims to branded drugs (e.g., "same as Zepbound/Mounjaro")
   - No "natural" language for enclomiphene
   - CTAs route through clinical evaluation ("Check eligibility", "Take the quiz"), NOT direct purchase ("Buy now", "Order now")
   - State availability disclosed (tirzepatide NOT available in NY, NJ, CA, SC, AL, AR, LA)
   - HSA/FSA eligibility correctly stated (Rx NOT eligible)
   - No "safe", "effective", "clinically proven" - use "studied for", "investigated for", "shows potential"

**Vera output format**: Flags table with exact text, rule violated, severity (RED/YELLOW), and minimum fix.

#### Marcus (Medical Reviewer)
Reference: `plugins/growth-ai-agents/agents/marcus-medical-reviewer.md`
Knowledge docs: `medical-review-guide.md`, `biomarkers.md`, `compliance-guide.md`, `rx-compliance.md`

Marcus verifies scientific accuracy of health claims in ad copy and LP wireframes:
1. Extract every health-related claim from the copy
2. Search for evidence (Consensus API > PubMed > WebSearch)
3. Classify evidence strength: Strong / Moderate / Weak / Insufficient
4. Cross-reference claims against what Superpower's service actually measures/provides

**Key flags for Krill Rx reports:**
- Tirzepatide: no equivalence to Mounjaro/Zepbound, no "guaranteed weight loss", no using branded trial data for compounded product claims
- Enclomiphene: no "double your T" without peer-reviewed mean increase data, no "natural testosterone booster"
- Any biomarker count claims must match actual panel (currently 100+)
- Weight loss percentage claims need citations

**Marcus output format**: Research brief with bottom line, evidence summary with inline citations, what we CAN/SHOULD/SHOULD AVOID saying.

#### Applying the Review

After both reviews complete:
1. Fix all RED flags immediately - these are compliance blockers
2. Fix YELLOW flags where the fix is straightforward
3. For YELLOW flags that would significantly weaken the copy, note them as accepted risks with justification
4. Add the approved Rx disclaimer to each LP wireframe (footer, above final CTA)
5. Add state availability disclosure to LP wireframes
6. Save the review output to `data/compliance_review.json` with:
   - `vera_flags`: array of {text, rule, severity, fix}
   - `marcus_flags`: array of {claim, evidence_strength, recommendation}
   - `fixes_applied`: array of changes made
   - `accepted_risks`: array of YELLOW flags kept with justification

**IMPORTANT**: The competitive analysis sections of the article (who's spending what, competitor LP analysis, market shape, etc.) are INTERNAL intelligence and do NOT go through Vera/Marcus. Only content we recommend putting in front of customers (ad copy, LP wireframes, recommended messaging) needs compliance review.

### Step 8: Publish to GitHub + Vercel

```bash
cd "$PROJECT_DIR"

# Switch to jeffsuperpower for Superpower repos
gh auth switch --user jeffsuperpower

# Git init and commit
git init
echo -e "node_modules/\n.vercel/\n__pycache__/\n*.pyc" > .gitignore
git add -A
git commit -m "Krill: ${TOPIC} competitive intelligence report"

# Create private repo and push
gh repo create jeffsuperpower/krill-${TOPIC}-${DATE} --private --source=. --push

# Deploy to Vercel under Jeff's personal scope
npx vercel --yes --prod

# Report URLs
echo "Article: $(npx vercel ls 2>/dev/null | grep Production | awk '{print $NF}')"
echo "GitHub: https://github.com/jeffsuperpower/krill-${TOPIC}-${DATE}"
```

**IMPORTANT**: Deploy to Jeff's personal Vercel scope (`jeffs-projects-f3875fa3`), NOT the `superpowerdotcom` team scope. These are internal intelligence reports, not customer-facing pages.

### Step 9: Report Back

Display to the user:
```
Krill Report: {Topic}
======================
Live:   https://krill-{topic}-{date}.vercel.app
GitHub: https://github.com/jeffsuperpower/krill-{topic}-{date}

Data summary:
- {N} advertisers scored across {M} keywords
- {Q} quarters of ad history analyzed
- {V} total monthly search volume tracked
- Top advertiser: {domain} (score: {score})
- Biggest whitespace: {keyword} ({volume}/mo, {N} advertisers)
```

---

## Mode 2: `/krill audit` - Inside-Out Account Audit

### Step 1-Audit: Pull All Google Ads Data

Same Python script from Step 5, but without a topic filter - pull everything:

```bash
uvx --with 'google-ads>=25.1.0' --with pyyaml python3 /tmp/krill_gads_pull.py > data/our_ads.json
```

### Step 2-Audit: Group by Topic

Analyze the campaigns, ad groups, and keywords. Group them into topics:
- Look at campaign names, ad group names, and keyword themes
- Create topic clusters (e.g., "tirzepatide", "semaglutide", "testosterone", "labs", "supplements")

### Step 3-Audit: Pull SpyFu for Each Topic

For each topic cluster, pull SpyFu competitive data for the top 10-15 keywords in that cluster. Follow Steps 3-4 from Mode 1 but scoped to each topic.

### Step 4-Audit: Compare and Score

For each topic:
- Our ad copy vs market ad copy (angles used, angles missing)
- Our pricing vs market pricing
- Keywords we bid on vs keywords with volume we don't bid on
- Our search terms vs what competitors target
- Performance metrics where available

### Step 5-Audit: Generate Audit Article

Same HTML template as Mode 1, but narrative structure changes:

1. **Account Overview** - What we spend, where, how many campaigns/ad groups
2. **Topic Breakdown** - Each topic cluster gets a section
3. **For Each Topic**: Market comparison table, copy analysis, gap identification
4. **The Good** - Where we outperform or differentiate vs market
5. **The Bad** - Where we're behind or making mistakes
6. **The Missing** - Keywords/angles/topics we should be in but aren't
7. **Priority Actions** - Ranked list of what to fix first, with expected impact

---

## Quick Reference

| Input | Example | Output |
|-------|---------|--------|
| Topic analysis | `/krill tirzepatide` | Competitive landscape report with Plotly charts |
| Different topic | `/krill enclomiphene` | Same format, different keyword universe |
| Broad category | `/krill testosterone replacement` | Multi-keyword category analysis |
| Account audit | `/krill audit` | Inside-out comparison of our Google Ads vs market |

## Key Rules

1. **Always save raw API responses** to `data/raw/` - these are the source of truth and enable re-analysis without re-pulling
2. **1-second delay between SpyFu calls** - no rate limit documented but be respectful
3. **DataForSEO batch up to 1,000 keywords** per search_volume call - don't split unnecessarily
4. **Google Ads queries**: Never put `conversion_action_name` in the same GAQL query as `cost_micros`. Split into separate queries if needed
5. **Publish under `jeffsuperpower`** GitHub account, not `jgdeutsch` - these are Superpower work products
6. **Deploy to Jeff's personal Vercel scope** - these are internal reports, not customer pages
7. **All chart data embedded in HTML** - single-file deployment, no external data files needed at runtime
8. **Write as the strategist, not the analyst** - make calls, take positions, recommend actions. Don't just describe what the data shows
9. **Price extraction**: Only count prices between $10-$1000 as likely product prices. Ignore percentages and other numbers
10. **SpyFu date handling**: `searchDateId` is encoded as `YYYYMMDD * 100`. Extract month as `date_id // 100`, then year = `ym // 100`, month = `ym % 100`

## Common Gotchas

- **SpyFu returns different response shapes** depending on the endpoint. Always check for `results`, `data`, or top-level array
- **DataForSEO related keywords** response is deeply nested: `items[].keyword_data.keyword_info.search_volume` with multiple fallback paths
- **Google Ads `search_stream`** returns a stream of `SearchGoogleAdsStreamResponse` objects - iterate `stream.results` for rows
- **Plotly heatmap text overlay**: Use `texttemplate: '%{text}'` and provide a separate `text` 2D array (not the same as `z`)
- **Empty SpyFu results**: Some keywords return empty arrays - this IS data (it means no one is advertising on that term). Track these as whitespace opportunities
- **Vercel deploy**: First deploy may prompt for project setup. `--yes` flag handles this. If it fails, `rm -rf .vercel && npx vercel link --yes`
- **Google Ads RSA headlines**: Returned as repeated `AdTextAsset` objects, each with `.text` and `.pinned_field`. Extract just `.text` for copy analysis
- **Large HTML files**: The single-file HTML with embedded data can be 500KB+. This is fine - Vercel serves it with gzip compression
- **DataForSEO 402 errors**: The account may run out of credits. If DataForSEO returns 402, fall back to SpyFu keyword data for volume information. SpyFu's `getRelatedKeywords` endpoint provides `searchVolume` per keyword
- **Google Ads API version**: Use `v23` (not `v18`). Check available versions with `import os, google.ads.googleads; [d for d in os.listdir(os.path.dirname(google.ads.googleads.__file__)) if d.startswith('v')]`
- **Google Ads LAST_90_DAYS**: May fail with `INVALID_VALUE_WITH_DURING_OPERATOR`. Use `LAST_30_DAYS` instead, or specific date ranges
- **SpyFu term ad history format**: Response is `{resultCount, domains: [{domainName, ads: [...], budget, totalAdsPurchased}], topAds: [...]}` - NOT a flat list. Parse `domains[].ads[]`
- **SpyFu unfiltered getDomainAdHistory**: Call WITHOUT a `term` parameter to get ALL ads for a domain. Each ad includes a `keywords` array listing every paid search keyword. This is the correct way to discover paid keyword expansion opportunities. Do NOT use `getMostValuableKeywords` (that returns organic/SEO data, not paid).
- **SpyFu PPC endpoints**: `getMostSuccessfulKeywords` and similar PPC-specific endpoints return 404 on the current API plan. The unfiltered `getDomainAdHistory` approach works better anyway since it gives you the actual keyword arrays per ad.

## Prohibited Patterns

- Do NOT hardcode keyword lists - always start from the seed topic and expand programmatically
- Do NOT make strategic recommendations without data backing them - every call needs a number
- Do NOT skip the Google Ads comparison in Mode 1 - always check if we have relevant campaigns
- Do NOT use external CSS/JS files - everything embeds in the single HTML file (except Plotly.js CDN and Google Fonts CDN)
- Do NOT publish to public GitHub repos - always `--private`
- Do NOT deploy to `superpowerdotcom` Vercel scope - use Jeff's personal scope
- Do NOT round investment scores to integers - keep one decimal place for ranking precision
- Do NOT include raw API keys in the published HTML - the DATA block should only contain processed results
