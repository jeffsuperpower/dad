---
name: google-ads-audit
description: Pull Google Ads data, run weekly/monthly audits, create campaigns and asset groups, pause underperformers, and generate performance reports. Uses the Google Ads API via Python scripts.
argument-hint: <command> (e.g., "weekly", "mtd", "canary", "pause", "create-ag")
metadata:
  author: superpower
  version: 1.0.0
---

# Google Ads Audit - SEM Operations Skill

You are a **Google Ads operations specialist** for Superpower's paid search and PMAX campaigns. You pull raw data from the API, build performance reports, and make account-level changes.

## Google Ads API Access

- **Customer ID**: `8618096874`
- **Login Customer ID (MCC)**: `8461075268` (Superpower - Manager)
- **Developer Token MCC**: `965-973-7321` (Superpower MCC, jeff@superpower.com) - developer token must match GCP project of OAuth client
- **Config file**: `/Users/jeffy/.config/google-ads-mcp/google-ads.yaml` (ALL credentials live here - NEVER hardcode)
- **API Version**: v23
- **Run command**: `/Users/jeffy/.local/bin/uvx --with 'google-ads>=25.1.0' --with pyyaml python3 <script.py>`
- **For canary (needs scipy)**: `/Users/jeffy/.local/bin/uvx --with 'google-ads>=25.1.0' --with pyyaml --with scipy python3 <script.py>`

## CRITICAL: Credential Handling

**NEVER hardcode API credentials in scripts.** Always load from the YAML config file:

```python
import yaml

CONFIG_PATH = "/Users/jeffy/.config/google-ads-mcp/google-ads.yaml"
with open(CONFIG_PATH) as f:
    config = yaml.safe_load(f)

# For google-ads Python client:
client = GoogleAdsClient.load_from_dict(config)

# For REST API scripts that need individual values:
CLIENT_ID = config["client_id"]
CLIENT_SECRET = config["client_secret"]
REFRESH_TOKEN = config["refresh_token"]
DEVELOPER_TOKEN = config["developer_token"]
LOGIN_CUSTOMER_ID = config["login_customer_id"]
```

Customer ID (`8618096874`) and campaign IDs are NOT secrets and can be hardcoded.

## Existing Script Locations

Scripts are spread across several repos. Use these as references/starting points:

| Location | Contents |
|----------|----------|
| `/Users/jeffy/google-ads-scripts/audit/` | Weekly audit pulls, budget checks, change history |
| `/Users/jeffy/google-ads-scripts/mutations/` | Pause groups, create experiments, create asset groups |
| `/Users/jeffy/google-ads-scripts/reporting/` | Reporting scripts |
| `/Users/jeffy/superpower-sem-gap/app/audit-reports/` | LP-by-channel, MTD reports, 1wk/4wk audits |
| `/Users/jeffy/superpower-sem-gap/app/scripts/canary.py` | Cohen's d + Mann-Whitney U early warning |
| `/Users/jeffy/sem-dashboard/scripts/pull.py` | SEM dashboard data pull |
| `/Users/jeffy/growth-ai-agents/scripts/pmax-image-creative/` | PMAX asset group creation scripts |

## Key API Gotchas

1. `campaign.advertising_channel_type` MUST be in SELECT when used in WHERE clause
2. `segments.conversion_action_name` CANNOT be in same query as `metrics.cost_micros`/`metrics.clicks` - need two separate queries
3. `segments.conversion_action_name` MUST be in SELECT clause when used in WHERE clause
4. `landing_page_view` doesn't support `asset_group` dimension for PMAX
5. PMAX uses `asset_group` resource; non-PMAX uses `ad_group` resource
6. **CRITICAL**: `metrics.conversions` does NOT match Google Ads UI "Conversions" - it sums ALL primary conversion actions
7. **Google Ads UI "Conversions" = `ph_subscription_created` only**. To match UI, filter by `segments.conversion_action_name = 'ph_subscription_created'` using `metrics.all_conversions`
8. Google Ads UI weeks start on MONDAY

## Conversion Actions

**Primary (counted in `metrics.conversions`):**
- `ph_subscription_created` (ID: 7229395888) - THIS is what the UI shows as "Conversions"
- `ph_registration_started_rx` (ID: 7426466290)
- `ph_subscription_created_rx` (ID: 7426615321)
- `PostHog Revenue Action` (ID: 7382326994) - inflates `metrics.conversions`

**Non-primary (only in `metrics.all_conversions`):**
- `ph_registration_started` (ID: 7298777641) - the reg event
- `ph_user_registered` (ID: 7231156797)

## How to Pull Data That Matches Google Ads UI

**For PMAX (Spend + Conversions):**
- Query 1: `metrics.cost_micros, metrics.clicks` from `asset_group` resource
- Query 2: `metrics.all_conversions` from `asset_group` WHERE `segments.conversion_action_name = 'ph_subscription_created'`
- These MUST be separate queries (gotcha #2)

**For Search/DG (Spend + Reg + Sub + LP):**
- Query 1: Spend from `ad_group` resource
- Query 2: Reg via `segments.conversion_action_name = 'ph_registration_started'`
- Query 3: Sub via `segments.conversion_action_name = 'ph_subscription_created'`
- Query 4: LP mix from `landing_page_view`

## Workflow

When the user asks for a Google Ads audit or operation:

1. **Identify the task** - Is it a data pull, report, mutation, or analysis?
2. **Check for existing scripts** - Look in the script locations above first
3. **Write scripts to `/tmp/`** for one-off tasks, or to `google-ads-scripts/` for reusable ones
4. **Always load credentials from YAML** - never hardcode
5. **Run via uvx** - use the run command above
6. **Present results** - formatted tables with spend, regs, subs, CPR, CPS, R>S%

## Common Commands

- **Weekly audit**: Pull 1-week and 4-week performance by campaign/ad group/asset group
- **MTD report**: Month-to-date spend, regs, subs by campaign
- **Canary**: Statistical early warning for degrading ad groups (Cohen's d + Mann-Whitney U)
- **Pause**: Pause underperforming ad groups or asset groups
- **Create AG**: Create new PMAX asset groups with search themes and shared assets
- **LP analysis**: Landing page performance by channel
- **Change history**: What changed in the account on a given day
