---
name: prodbot
description: This skill should be used when the user asks to "push to prod", "deploy my feature", "ship it", "prodbot", "create a PR", "get this reviewed", or needs to follow the production deployment workflow. Guides code from PR creation through QA, code review, feedback resolution, and merge — with clear ownership boundaries.
argument-hint: [pr-url]
metadata:
  author: superpower
  version: 1.0.0
---

# Prodbot - Push to Production Workflow

Step-by-step workflow for shipping code to production. Covers the full lifecycle from PR creation through merge and post-launch monitoring.

**Source**: Dylan's engineering deployment protocol.

## The Golden Rule

**You own your feature end-to-end.** Dylan (codeowner) checks that you don't break anything outside your feature. Everything else — QA, functionality, visual polish, post-launch monitoring — is your responsibility.

## Workflow

### Step 1: Create a Pull Request

Create a PR on GitHub targeting the main branch.

```bash
gh pr create --title "Brief description of feature" --body "## Summary\n- What this does\n\n## Test plan\n- [ ] Visual QA on all breakpoints\n- [ ] Links and interactions tested\n- [ ] Mobile/tablet/desktop checked"
```

If a PR URL was provided as an argument, skip this step and use that PR.

### Step 2: Visual QA on Vercel Preview

Once the PR is created, Vercel generates a preview deployment.

**Check every breakpoint using Chrome DevTools:**
- Desktop (1440px, 1280px, 1024px)
- Tablet (768px)
- Mobile (375px, 390px)

**Check all interactive elements:**
- [ ] All links work and go to correct destinations
- [ ] Buttons, dropdowns, modals function correctly
- [ ] Forms submit and validate properly
- [ ] Animations and transitions render smoothly
- [ ] Images load at correct sizes
- [ ] No layout shifts or overflow issues

**Get the preview URL:**
```bash
gh pr view --json url -q '.url'
```

Then check the Vercel preview link in the PR's deployment status.

Report findings. If issues are found, fix them and push — then re-run this step.

### Step 3: Self-Review Your Code

Read through every file you changed in the PR before requesting review.

```bash
gh pr diff
```

Look for:
- [ ] Dead code or debugging artifacts (console.logs, commented-out code)
- [ ] Hardcoded values that should be variables
- [ ] Missing error handling at system boundaries
- [ ] Accessibility issues (alt text, aria labels, keyboard nav)
- [ ] Anything that doesn't match the design intent

Fix anything you catch. Push fixes. This is YOUR review before Dylan's.

### Step 4: Request Review from Dylan

This is critical — PRs don't show up in Dylan's review queue unless you explicitly request.

```bash
gh pr edit --add-reviewer dylan-superpower
```

If you don't know Dylan's GitHub username, ask the user to confirm it.

### Step 5: Resolve PR Feedback

When Dylan leaves comments:

1. Pull the PR comments:
```bash
gh api repos/{owner}/{repo}/pulls/{number}/comments
```

2. Address every comment — fix the code, push changes.

3. Mark comments as resolved:
```bash
gh api repos/{owner}/{repo}/pulls/{number}/comments/{comment_id}/replies -f body="Fixed in latest push."
```

4. **Go back to Step 2** — re-QA on the updated Vercel preview.

### Step 6: Repeat Until Approved

Loop through Steps 2-5 until the PR is approved.

```bash
gh pr view --json reviews -q '.reviews[] | select(.state == "APPROVED")'
```

When you see an `APPROVED` review, proceed to Step 7.

### Step 7: Merge

Once approved, merge the PR:

```bash
gh pr merge --squash
```

**Do NOT merge unless:**
- The PR has an approved review
- You (or whoever owns the feature) have capacity to monitor the deployment right now

Dylan will deploy. If you're not available to monitor, tell Dylan and wait.

### Step 8: Post-Launch Monitoring

After Dylan deploys, **you own monitoring**:

- Watch for errors in real-time (use PostHog, session recordings, error tracking)
- Check the feature on production across breakpoints
- Monitor for customer-reported issues

**If issues are found post-launch:** You fix them. This does not fall to eng. You own vibe-coded features end to end.

**If Dylan receives alerts about your page:** They come to you. You triage and fix.

## Ownership Matrix

| Responsibility | Owner |
|---------------|-------|
| Feature works as intended | **You** |
| Visual QA (all breakpoints) | **You** |
| Links, interactions, forms | **You** |
| Post-launch monitoring | **You** |
| Fixing post-launch issues | **You** |
| Doesn't break other features | **Dylan** (codeowner) |
| Final deploy to production | **Dylan** |
| Reverting if issues aren't fixed | **Dylan** |

## Optional: Bring In Specialists

Before requesting Dylan's review, consider:

- **Designers** can jump in on the feature branch for final visual touch-ups
- **Product** can approve PRs when sensitive product copy is involved

If either applies, request their review before or alongside Dylan's:
```bash
gh pr edit --add-reviewer designer-username
gh pr edit --add-reviewer product-username
```

## Quick Reference

| Action | Command |
|--------|---------|
| Create PR | `gh pr create --title "..." --body "..."` |
| View PR diff | `gh pr diff` |
| Request review | `gh pr edit --add-reviewer dylan-superpower` |
| Check review status | `gh pr view --json reviews` |
| Get PR comments | `gh api repos/{owner}/{repo}/pulls/{number}/comments` |
| Merge (after approval) | `gh pr merge --squash` |
| View Vercel preview | Check PR deployment status on GitHub |

## Key Rules

- **Never merge without an approved review** — Dylan must approve first
- **Never merge if you can't monitor the deployment** — Dylan will revert your feature entirely if issues pop up and you're not there
- **Self-review before requesting review** — read your own diff, catch the obvious stuff
- **QA on ALL breakpoints** — mobile, tablet, desktop. Use Chrome DevTools device toolbar
- **Test everything interactive** — links, buttons, forms, modals, animations
- **You own it post-launch** — session recordings, error monitoring, customer issues. All you.
- **Loop until approved** — Steps 2-5 repeat as many times as needed

## Local Environment Setup

**Getting your `.env` file:**

1. Copy from the example file in the repo:
```bash
cp .env.example .env
```

2. Add the staging app URL (not in `.env.example` yet):
```
VITE_SUPERPOWER_APP_URL=https://app.superpower-staging.com
```

That's it. Do **not** copy env vars from Vercel manually — `.env.example` has everything you need.

**Need a test account with a membership?** Ask Dylan in Slack.

## Common Gotchas

- **Forgetting to request review**: PR sits in limbo because Dylan never sees it. Always run `--add-reviewer`.
- **Merging then leaving**: Dylan deploys, issue appears, you're offline. Feature gets reverted. Only merge when you can stick around.
- **Skipping mobile QA**: Desktop looks fine, mobile is broken. Check every breakpoint every time.
- **Not re-QAing after fixes**: You fix feedback, push, but don't re-check the preview. New bugs sneak in.
- **Assuming eng will maintain it**: Vibe-coded features are yours forever. If eng built it properly, they'd maintain it. They didn't build it — you did.
