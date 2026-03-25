---
name: project-status
description: Use when asked to "project status", "project update", "weekly project tracker", "what's the status of projects", or when the user wants to generate a weekly owned media project status report. Pulls from the Notion Owned Media Project Tracker and formats into a three-bucket summary.
user_invocable: true
---

# Weekly Project Status — Owned Media

## Purpose

Generate a weekly project status snapshot from the Notion Owned Media Project Tracker. Designed to take <10 minutes: pull the data, format it, user confirms/adds flags, done.

## Data Source

**Notion Database:** Owned Media Project Tracker
- **Page URL:** https://www.notion.so/superpowerhealth/Owned-Media-Project-Tracker-30d8444481d081d08572c86e828ba167
- **Database URL:** https://www.notion.so/62e9ee01ab54424fa8681310fa9260d0
- **Data Source ID:** `collection://2c640093-9d96-467a-b087-aa3a4830b471`

**Database Fields:**
- Project (title)
- Status: Not Started | BAU | In Progress | Blocked | Done
- Priority: Urgent | High | Medium | Low | Back Burner
- Owner (text)
- Surface (text)
- Start Date, Due Date

## Workflow

### Step 1: Pull Data
Fetch all projects from the Notion database using the MCP Notion tools. Group them by status.

### Step 2: Map to Three Buckets

| Notion Status | Report Bucket | Emoji |
|---------------|--------------|-------|
| Done | Shipped | n/a (listed without emoji) |
| In Progress | In Progress | Based on priority — see below |
| BAU | In Progress | Based on priority — see below |
| Blocked | In Progress | (flag as blocked) |
| Not Started | On Hold / Not Started | (flag as not started) |
| Back Burner (priority) | On Hold / Not Started | (flag as back burner) |

**Emoji logic for In Progress items:**
- Priority = Urgent or High, no blockers → green circle
- Priority = Medium or status is normal In Progress → yellow circle
- Status = Blocked or overdue → red circle
- Not Started or Back Burner → white circle

### Step 3: Format Output

```markdown
# Owned Media Project Status — Week of [DD MMM YYYY]

## What's Changed This Week
[2-4 bullet points summarizing key movements: what shipped, what started, what got blocked, any priority changes. This is the TLDR.]

---

## Shipped (Done)
| Project | Owner | Notes |
|---------|-------|-------|
| [Project name] | [Owner] | [When it shipped / any final notes] |

## In Progress
| Status | Project | Owner | Flag |
|--------|---------|-------|------|
| [emoji] | [Project name] | [Owner] | [Any callout — deadline, blocker, dependency] |
| [emoji] | [Project name] | [Owner] | — |

## On Hold / Not Started
| Status | Project | Owner | Flag |
|--------|---------|-------|------|
| [emoji] | [Project name] | [Owner] | [Why it's on hold / when it's expected to start] |
```

### Step 4: User Review
After generating the report, ask the user:
1. "Anything to add to What's Changed?"
2. "Any flags or callouts I'm missing on specific projects?"
3. "Any projects to add or remove?"

Then output the final version.

## Emoji Key

| Emoji | Meaning |
|-------|---------|
| green circle | On track / looking good |
| yellow circle | In progress, no issues |
| red circle | Blocked or at risk |
| white circle | Not started / on hold |

## Tips for Speed

- The user should keep the Notion board updated as their source of truth throughout the week (even quick status changes count).
- This skill just reads + formats. The less stale Notion is, the less manual input needed here.
- If a project status in Notion looks wrong, flag it to the user rather than guessing.
- For the "What's Changed" section, compare against last week's report if available, otherwise ask the user.
