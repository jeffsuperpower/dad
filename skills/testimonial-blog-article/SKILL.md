# Testimonial Blog Article

End-to-end Superpower Stories blog article production. Generates blog visuals (header, inline images, quote cards) and creates a Webflow CMS draft.

**When to use:** When you need to produce a complete Superpower Stories blog article from a Notion draft and member photos.

**Invocation:** `/testimonial-blog-article` or "create blog article for [name]", "blog visuals for [name]", "new Superpower Story", "publish [name]'s story"

---

## Workflow Overview

This skill executes a **3-phase workflow**:

| Phase | Name | What Happens | Checkpoint |
|-------|------|--------------|------------|
| **1** | Collect Inputs | Gather member info, Notion URL, image assignments | "Ready to generate visuals?" |
| **2** | Generate Visuals | Create config, run generator, output PNGs to Desktop | "Visuals look good?" |
| **3** | Create Webflow CMS Draft | Fetch article from Notion, format HTML, create CMS item | Complete |

**CRITICAL:** Each phase has a checkpoint. Never proceed without explicit user approval.

---

## Phase 1: Collect Inputs

### Step 1.1: Gather Member Details

Ask the user for:

| Input | Required | Example |
|-------|----------|---------|
| **First name** | Yes | "Ron" |
| **Last initial** | Yes | "K." |
| **Notion article URL** | Yes | `https://www.notion.so/...` |
| **Hero photo path** | Yes | `/Users/katlabarbera/Downloads/IMG_1916.JPG` |

### Step 1.2: Gather Image Assignments

Ask which visuals to generate. Available templates:

| Template | Purpose | Required Photos |
|----------|---------|-----------------|
| `blog-header` | Hero header image (999x524) | Uses hero photo |
| `image-single-tall` | Single portrait photo (999x999) | 1 photo |
| `image-single-long` | Single landscape photo (999x785) | 1 photo |
| `image-duo` | Two photos side by side (999x557) | 2 photos |
| `image-triple` | Three photos in a row (999x557) | 3 photos |
| `image-full-bleed` | Full-width single photo (999x660) | 1 photo |
| `notable-quote` | Quote with photo background (999x721) | 1 photo + quote text |
| `quote-callout` | Text-only quote block (600xAuto) | Quote text only |

For each visual the user wants, collect:
- Template name
- Photo path(s) — absolute paths to images on disk
- Quote text (for `notable-quote` or `quote-callout`)
- Output filename (suggest: `{slug}-{template}-{n}.png`)

### Step 1.3: Confirm Before Generating

Present a summary table of all visuals to be generated. Example:

```
Slug: ron-kodl
Member: Ron K.

Visuals:
1. blog-header → ron-kodl-header.png (hero photo)
2. image-full-bleed → ron-kodl-inline-family.png
3. notable-quote → ron-kodl-notable-quote.png
   Quote: "It's not how many years you live. It's the life in those years."
```

**Checkpoint:** "Ready to generate visuals?"

---

## Phase 2: Generate Visuals

### Step 2.1: Create Config JSON

Write a config file to `scripts/blog-visuals/{slug}-config.json`.

**Config format:**

```json
{
  "slug": "{slug}",
  "member": {
    "first_name": "{First}",
    "last_initial": "{X.}"
  },
  "hero_photo": "/absolute/path/to/hero.jpg",
  "visuals": [
    {
      "template": "blog-header",
      "output": "{slug}-header.png"
    },
    {
      "template": "image-full-bleed",
      "photo": "/absolute/path/to/photo.jpg",
      "output": "{slug}-inline-1.png"
    },
    {
      "template": "notable-quote",
      "text": "\u201cQuote text here.\u201d",
      "photo": "/absolute/path/to/photo.jpg",
      "output": "{slug}-notable-quote.png"
    },
    {
      "template": "image-triple",
      "photo_1": "/path/to/photo1.jpg",
      "photo_2": "/path/to/photo2.jpg",
      "photo_3": "/path/to/photo3.jpg",
      "output": "{slug}-triple.png"
    }
  ]
}
```

**Photo key mapping by template:**

| Template | Keys |
|----------|------|
| `blog-header` | Uses top-level `hero_photo` |
| `image-single-tall`, `image-single-long`, `image-full-bleed` | `photo` |
| `image-duo` | `photo_1`, `photo_2` |
| `image-triple` | `photo_1`, `photo_2`, `photo_3` |
| `notable-quote` | `photo` + `text` |
| `quote-callout` | `text` only |

### Step 2.2: Run the Generator

```bash
python scripts/blog-visuals/generate.py "scripts/blog-visuals/{slug}-config.json" --output-dir ~/Desktop/{slug}-blog-visuals
```

**Prerequisites** (remind user if Playwright isn't installed):
```bash
pip install playwright && playwright install chromium
```

### Step 2.3: Show Results

After generation, show the user the generated images using the Read tool on each PNG file so they can review visuals.

**Checkpoint:** "Visuals look good? Ready to create the Webflow draft?"

---

## Phase 3: Create Webflow CMS Draft

### Step 3.1: Fetch Article from Notion

Use `mcp__notion__notion-fetch` with the Notion article URL provided in Phase 1.

**Priority for article content:**
1. Use the **MN DRAFT** section if available (manually written/edited)
2. Fall back to **AI DRAFT** section
3. If neither is labeled, use the full article body

### Step 3.2: Format Article HTML

Structure the article in Superpower Stories format. Use this exact HTML structure:

```html
<p><em>Superpower Stories is a series spotlighting real members and their experiences with proactive health testing. Each story is unique — and Christ, are they worth telling.</em></p>

<h2>SUPERPOWER STORIES: {FIRST} {INITIAL}</h2>

<p><strong>Age:</strong> {age}<br>
<strong>Profession:</strong> {profession}<br>
<strong>Describe your health in one word:</strong> {one_word}<br>
<strong>Your personal superpower:</strong> {superpower}</p>

<h3>{Section Title 1}</h3>
<p>{Section body text...}</p>

<h3>{Section Title 2}</h3>
<p>{Section body text...}</p>

<!-- Continue with remaining sections -->

<p><em>Ready to uncover what your body is trying to tell you? <a href="https://superpower.com/welcome">Start your Superpower journey today</a> — because the best time to take control of your health is now.</em></p>
```

**Formatting rules:**
- Section headers use `<h3>` tags
- Paragraphs wrapped in `<p>` tags
- Bold text for emphasis uses `<strong>`
- Block quotes use `<blockquote>` tags
- CTA at the bottom links to `https://superpower.com/welcome`
- **Do NOT embed images in HTML** — images must be uploaded manually in Webflow Designer (MCP limitation)
- Add a comment `<!-- INSERT IMAGE: {filename} -->` where each visual should go, so the user knows placement

### Step 3.3: Create CMS Item in Webflow

Use `mcp__webflow__data_cms_tool` to create the CMS item.

**Required parameters:**

| Field | Value |
|-------|-------|
| `name` | `Superpower Stories: {First} {Initial}` |
| `slug` | `superpower-stories-{first}-{initial-letter}` (lowercase) |
| `post-body` | The formatted HTML from Step 3.2 |
| `short-description` | Best pull quote from the article (1-2 sentences) |
| `author` | `68a37875ac348552081b412d` (Superpower Team) |
| `category-2` | `688b7631bdc1dbb6fc1ebee5` (Lifestyle) |
| `length-minutes` | Word count / 250 (rounded to nearest integer) |
| `featured` | `false` |

**CMS constants:**
- **Collection ID:** `688b76d056faa32228f07c48`
- **Locale ID:** `65ef8f5d1b9b668897b8424d`
- **isDraft:** `true` (always create as draft)

### Step 3.4: Final Output

Present to the user:
1. Webflow CMS draft URL (from response)
2. Reminder: "Upload images manually in Webflow Designer — the MCP can't handle image uploads"
3. List of generated visuals and their intended placement in the article
4. Reading time estimate

---

## Reference

- **Visual generator script:** `scripts/blog-visuals/generate.py`
- **HTML templates:** `scripts/blog-visuals/templates/`
- **Example configs:** `scripts/blog-visuals/ron-kodl-config.json`, `scripts/blog-visuals/daniel-o-config.json`
- **Series format reference:** Published Rachel D. post (slug: `superpower-stories-rachel-d`)
