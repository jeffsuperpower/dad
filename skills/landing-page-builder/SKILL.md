---
name: landing-page-builder
description: Build production-grade landing pages using the Superpower design system. Light theme, 10-section structure, conversion-focused. Use when asked to "build a landing page", "create an LP", "design a sales page", or any landing page mockup task.
---

# Landing Page Builder Skill

## When to Use

Use this skill when building a **landing page** mockup — a single, scrollable marketing page designed to convert visitors into members/leads.

**Input:** Topic, target audience, key benefits, CTA goal
**Output:** Complete `index.html` file in `superpower-mockups/<slug>/`

**Canonical reference:** Always consult `knowledge/design-system-reference.md` for the full HTML boilerplate, CSS tokens, and component patterns. That file is the single source of truth for all design tokens.

---

## Theme & Visual Language

- **Theme:** Light (white/warm backgrounds)
- **Palette:** Use production semantic tokens from design-system-reference.md §2
- **Hero gradient:** `linear-gradient(180deg, var(--_base-color-brand--vermillion-50) 0%, var(--background-color--background-primary) 100%)`
- **Final CTA gradient:** `linear-gradient(180deg, var(--background-color--background-primary) 0%, var(--_base-color-brand--vermillion-50) 100%)`
- **Header:** Frosted glass sticky nav (pattern in design-system-reference.md §4f)
- **Fonts:** Loaded via **Adobe Typekit** (kit ID: `xjx4hdo`) — NOT local font files

---

## Client-First Section Nesting (Critical)

Every section must follow the Webflow Client-First V2.1 nesting pattern:

```html
<section class="section_{{section-name}}">
    <div class="padding-global">
        <div class="padding-section-large">  <!-- or medium/small -->
            <div class="container-large">     <!-- or medium/small -->
                <!-- Section content -->
            </div>
        </div>
    </div>
</section>
```

---

## 10-Section LP Structure

Every landing page follows this section order. Adapt content but keep the structure:

### 1. Hero
- Two-column: content left, visual right
- Badge pill → H1 → subtitle → bullet list with orange check SVGs → CTA button
- Warm gradient background
- Use `.button.is-icon` for CTA with arrow chevron

### 2. Social Proof Bar
- Logo strip or trust badges
- Warm background (`var(--_base-color-brand--vermillion-50)`)
- "Trusted by..." or Trustpilot stars

### 3. How It Works
- 3-4 step cards in a grid
- Numbered or icon-led
- Simple: step label, title, description

### 4. Benefits / Features Grid
- 3-column card grid (collapses to 1-col on mobile)
- Icon + title + description per card
- Card backgrounds: `var(--background-color--background-secondary)` (zinc-50)

### 5. Comparison Section
- Two-column or table comparing "Without Superpower" vs "With Superpower"
- Or comparison against standard doctor visit (never name competitors in copy)
- Use checkmarks (green `#11c182`) vs X marks (gray `var(--text-color--text-tertiary)`)

### 6. Deep Dive / Mechanism
- Explain HOW it works in more detail
- Split cards: image + text alternating
- This is where you sell the mechanism (100+ biomarkers → protocols → marketplace)

### 7. Testimonials
- Horizontal scroll carousel or 3-column grid
- Quote + name + photo (use placeholder for photos)
- Or video testimonial cards with play button overlay

### 8. Pricing
- Center-aligned pricing card(s)
- Use `.text-style-italic` class for price numerals (NB International Pro italic via Typekit)
- Feature checklist with orange checkmarks (`stroke="#FC5F2B"`)
- CTA button in each card

### 9. FAQ
- **Div-based accordion** (NOT `<details>/<summary>`)
- Max-width 48rem (`container-small`), centered
- 6-8 questions covering objections
- Collapsible with +/− icon using JS toggle
- Pattern from design-system-reference.md §4d

### 10. Final CTA
- Full-width, warm gradient background
- Headline + subtitle + CTA button

---

## Design Token Reference

Use production semantic tokens — **never** use old shorthand names:

| Old (wrong) | Production (correct) |
|---|---|
| `--background` | `var(--background-color--background-primary)` |
| `--secondary` | `var(--background-color--background-secondary)` |
| `--card` | `var(--background-color--background-tertiary)` |
| `--foreground` | `var(--text-color--text-primary)` |
| `--secondary-foreground` | `var(--text-color--text-secondary)` |
| `--tertiary-foreground` | `var(--text-color--text-tertiary)` |
| `--border` | `var(--border-color--border-primary)` |
| `--vermillon-900` | `var(--_base-color-brand--vermillion-900)` |
| `--vermillon-50` | `var(--_base-color-brand--vermillion-50)` |
| `--radius-xl` | `var(--radius--radius-xl)` |
| `--radius-lg` | `var(--radius--radius-lrg)` |

Full token list in `knowledge/design-system-reference.md` §2.

---

## Responsive Breakpoints

| Breakpoint | Width | Key Changes |
|-----------|-------|-------------|
| Desktop | > 991px | Default styles |
| Tablet | ≤ 991px | H1→3rem, section-large→6rem |
| Mobile Landscape | ≤ 767px | H1→2.5rem, section-large→5rem |
| Mobile Portrait | ≤ 479px | H1→2.25rem, section-large→4rem |

**NOT** 1024/768/480 — use 991/767/479 to match Webflow production.

---

## Build Checklist

- [ ] Start from HTML boilerplate in design-system-reference.md §2
- [ ] Typekit font loading (NOT local @font-face)
- [ ] Production semantic tokens (NOT old shorthand names)
- [ ] Client-First section nesting throughout
- [ ] Frosted header with logo from `../shared/assets/sp_logo.svg`
- [ ] Scroll reveal animations on all sections
- [ ] Responsive at 991px / 767px / 479px breakpoints
- [ ] FAQ accordion is div-based with JS toggle (NOT `<details>/<summary>`)
- [ ] All CTAs use `.button` class with hover states
- [ ] Warm gradient bookends (hero + final CTA)
- [ ] Italic numerals use `.text-style-italic` class (NOT a separate "Society" font)
- [ ] Compliance: no banned phrases in copy

## After Building

1. Add entry to `superpower-mockups/index.html` mockups array (see design-system-reference.md §10)
2. Offer review routing: Mira (UX), Marcus (medical claims), Vera (compliance)
