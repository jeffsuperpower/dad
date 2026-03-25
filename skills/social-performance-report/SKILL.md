---
name: social-performance-report
description: Use when asked for a "social report", "weekly performance report", "how did content perform", "channel metrics", or any request for social media analytics across Instagram, Twitter/X, and Newsletter.
---

# Social Performance Report

## Purpose

Generate a weekly performance summary across all three social channels. Core metrics, top performers, and actionable takeaways for the next content cycle.

## Data Sources

| Channel | Source | Access Method |
|---------|--------|---------------|
| **Instagram** | Sprout Social | MCP tools: `get_post_analytics` (post-level), `get_profile_analytics` (account-level) |
| **Twitter/X** | Sprout Social | MCP tools: `get_post_analytics` (post-level), `get_profile_analytics` (account-level) |
| **Newsletter (conversions)** | PostHog | Query email click-through and conversion events via PostHog MCP |
| **Newsletter (open/click rates)** | Beehive | **Ask the user manually** — not available via API |

### How to pull data

**Sprout Social (Instagram + Twitter):**
1. Use `get_profiles` to list connected social profiles and get their profile IDs
2. Use `get_profile_analytics` with a date range for account-level metrics (followers, impressions, engagements, follower gains/losses)
3. Use `get_post_analytics` with a date range for post-level metrics (impressions, engagements, reactions, comments, shares, video_views, clicks)

**PostHog (Email conversions):**
- Spawn a sub-agent with PostHog tools to query email-related events and click-through/conversion data

**Beehive (Newsletter open rates):**
- Ask the user: "What were this week's newsletter open rates and click-through rates from Beehive?"
- This is the one data source that requires manual input

## Metrics by Channel

### Instagram
| Metric | Why It Matters |
|--------|---------------|
| **Reach** | Unique accounts that saw content |
| **Impressions** | Total views including repeats |
| **Engagement Rate** | (Likes + Comments + Saves + Shares) / Reach |
| **Saves** | Strongest signal of content value |
| **Shares** | Strongest signal of reach expansion |
| **Follower Growth** | Net new followers this week |

### Twitter/X
| Metric | Why It Matters |
|--------|---------------|
| **Impressions** | Total tweet views |
| **Engagement Rate** | (Likes + Replies + Retweets + Clicks) / Impressions |
| **Retweets** | Amplification signal |
| **Link Clicks** | Traffic driven |
| **Follower Growth** | Net new followers this week |

### Newsletter
| Metric | Why It Matters |
|--------|---------------|
| **Open Rate** | Subject line effectiveness |
| **Click Rate** | Content engagement depth |
| **Unsubscribe Rate** | Content-audience fit signal |
| **List Growth** | Net new subscribers this week |

## Output Format

```markdown
# Weekly Social Report — Week of [Date]

## Summary
| Channel | Key Metric | This Week | Prev Week | Change |
|---------|-----------|-----------|-----------|--------|
| Instagram | Engagement Rate | X% | X% | +/-X% |
| Twitter/X | Impressions | X | X | +/-X% |
| Newsletter | Open Rate | X% | X% | +/-X% |

## Instagram
**Reach:** X | **Engagement Rate:** X% | **Follower Growth:** +X
**Top Post:** [Title] — [Metric] — [Why it worked]
**Underperformer:** [Title] — [Metric] — [What to learn]

## Twitter/X
**Impressions:** X | **Engagement Rate:** X% | **Follower Growth:** +X
**Top Post:** [Title] — [Metric] — [Why it worked]

## Newsletter
**Open Rate:** X% | **Click Rate:** X% | **List Growth:** +X
**Top Link:** [Title] — [Clicks]

## Takeaways
1. [What worked and why — apply to next week]
2. [What didn't work — adjust approach]
3. [Emerging pattern or opportunity]
```
