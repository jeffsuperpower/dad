---
name: webflow-to-vercel
description: This skill should be used when the user asks to "deploy a Webflow page to Vercel", "create a standalone landing page", "clone a Webflow page", or mentions deploying a superpower.com page as a static site. Fetches a live Webflow page and deploys it as a standalone static HTML site on Vercel with zero build step.
argument-hint: <slug> [project-name]
metadata:
  author: superpower
  version: 1.0.0
---

# Webflow to Vercel

Deploy any Webflow page from superpower.com as a standalone static site on Vercel. One-shot workflow: curl the page, commit, push, deploy. All Webflow CDN assets stay remote. No build step, no framework, no asset downloading.

## Prerequisites

- `curl` (pre-installed on macOS)
- `git` and `gh` CLI (GitHub CLI, authenticated)
- `npx` (Node.js)
- Vercel CLI access via `npx vercel`
- GitHub account: `jgdeutsch`

## Workflow

### Step 1: Parse Input

Extract from user input:
- **slug** (required): The Webflow page slug (e.g., `tirzepatide`, `biomarkers/testosterone`)
- **project-name** (optional): Vercel project name. Default: `{slug}-lp` (replace `/` with `-`)

### Step 2: Create Project Directory

```bash
mkdir ~/[project-name] && cd ~/[project-name]
```

### Step 3: Fetch the Webflow Page

```bash
curl -sL "https://superpower.com/[slug]" -o index.html
```

### Step 4: Verify the Fetch

Run these checks before proceeding:

1. **File size**: Must be >10KB. If smaller, the slug is likely wrong or the page doesn't exist.
2. **Webflow signature**: Check for `data-wf-site` attribute in the HTML. Its presence confirms this is a real Webflow page.
3. **No redirect**: Confirm the HTML contains actual page content, not a redirect or error page.

If any check fails, report the issue to the user and stop.

### Step 5: Handle Canonical URL

Find the `<link rel="canonical"` tag. Decision depends on purpose:
- **Preview/staging copy**: Leave the canonical pointing to `superpower.com` (correct — credits the original)
- **Permanent standalone LP**: Replace its `href` with the new Vercel domain, or remove it entirely to avoid SEO conflicts

Ask the user if unsure which scenario applies.

### Step 6: Create .gitignore

Write a `.gitignore` with:
```
node_modules/
.vercel/
```

### Step 7: Git Init and Commit

```bash
git init && git add . && git commit -m "[slug] landing page"
```

### Step 8: Create GitHub Repo and Push

```bash
gh repo create jgdeutsch/[project-name] --private --source=. --push
```

### Step 9: Deploy to Vercel

```bash
npx vercel link --yes --scope superpowerdotcom
npx vercel deploy --yes --prod
```

**CRITICAL**: Deploy under the `superpowerdotcom` Vercel team scope. Jeff's personal scope will fail with "Git author must have access" errors. If the deploy fails with scope issues:
```bash
rm -rf .vercel
npx vercel link --yes --scope superpowerdotcom
npx vercel deploy --yes --prod
```

### Step 10: Report Back

Return the live Vercel URL to the user. Format:
```
Deployed: https://[project-name].vercel.app
GitHub:   https://github.com/jgdeutsch/[project-name]
```

## Quick Reference

| Input | Example |
|-------|---------|
| Simple slug | `tirzepatide` |
| Nested slug | `biomarkers/testosterone` |
| Default project name | `tirzepatide-lp` |
| Custom project name | `tirz-lp` |
| Source URL | `https://superpower.com/{slug}` |
| Deploy command | `npx vercel --prod --yes` |

## Key Rules

1. **All Webflow CDN assets stay remote** — do NOT download CSS, JS, images, or fonts. They load from Webflow's CDN (`assets-global.website-files.com`, `uploads-ssl.webflow.com`, etc.).
2. **Preserve all analytics scripts** — GTM, GA, FB Pixel, Segment, Klaviyo, Intellimize, and any other tracking must remain in the HTML.
3. **Preserve Webflow attributes** — all `data-wf-*` attributes stay as-is. They are needed for Webflow interactions and animations.
4. **No build step** — no `package.json`, no framework, no bundler. Pure static HTML served directly by Vercel.
5. **The `.vercel/` directory is gitignored** — it is created locally by the Vercel CLI and should never be committed.
6. **GitHub repo is private** — all LP repos go under `jgdeutsch` as private repos.

## Editing the HTML After Deploy

The HTML is minified — single lines can be 10,000+ characters. This causes specific tooling problems:

- **Do NOT use the Edit tool** for find/replace on minified HTML. It cannot find unique strings in mega-lines. Use Python instead:
  ```python
  python3 -c "
  with open('index.html', 'r') as f: content = f.read()
  content = content.replace('old text', 'new text')
  with open('index.html', 'w') as f: f.write(content)
  "
  ```
- **Unicode `\u2028` (LINE SEPARATOR)**: Webflow injects invisible `\u2028` characters between words. These look like spaces but aren't. Python handles them; the Edit tool cannot match them. When a find/replace fails on text that visibly exists, this is likely why.
- **Redeploy after edits**: `npx vercel deploy --yes --prod` — the URL stays the same.

## Common Gotchas

- **Vercel team scope**: Must deploy under `superpowerdotcom`. If deploy fails, `rm -rf .vercel && npx vercel link --yes --scope superpowerdotcom`.
- **Slug with path separators**: `biomarkers/testosterone` becomes project name `biomarkers-testosterone-lp`
- **Vercel project linking**: On first deploy, Vercel may ask to link to an existing project. The `--yes` flag auto-creates a new one.
- **Canonical tag**: For a preview/staging copy, the canonical can stay pointing to `superpower.com`. For a permanent standalone LP, update or remove it.
- **Empty or tiny HTML file**: If `index.html` is <10KB, the slug is wrong. Check the actual URL in a browser first.
- **Webflow password protection**: Some pages may be behind Webflow's password protection. These cannot be fetched with curl.
- **Analytics noise**: GTM, PostHog, FB Pixel, Intellimize all fire on the Vercel preview too. Fine for testing but be aware of analytics contamination.

## Prohibited Patterns

- Do NOT download or inline any remote assets (CSS, JS, images, fonts)
- Do NOT add a `package.json` or any build configuration
- Do NOT modify Webflow's JavaScript or CSS references
- Do NOT remove analytics or tracking scripts
- Do NOT create a public GitHub repo (always `--private`)
- Do NOT use `vercel dev` or any local development server — deploy directly to production
