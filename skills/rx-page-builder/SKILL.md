---
name: rx-page-builder
description: Build RX treatment landing pages using the Superpower design system. Light theme with glassmorphism, blood-first protocol messaging, pricing toggles. Use when asked to "build an RX page", "create a treatment page", "design a prescription landing page", or any RX/treatment mockup.
---

# RX Page Builder Skill

## When to Use

Use this skill when building an **RX treatment landing page** — a product page for a specific Superpower prescription treatment (GLP-1, Enclomiphene, NAD+, GHK-Cu, etc.).

**Input:** Treatment name, mechanism, pricing tiers, target audience
**Output:** Complete `index.html` file in `superpower-mockups/<slug>/`

**Canonical reference:** Always consult `knowledge/design-system-reference.md` for the full HTML boilerplate, CSS tokens, and component patterns. That file is the single source of truth for all design tokens.

---

## Theme & Visual Language

- **Theme:** Light with glassmorphism accents
- **Palette:** White/warm backgrounds + frosted glass hero visual
- **Hero:** Warm gradient with SVG glow blobs + constellation lines
- **Product visual:** Model photo + product on glassmorphism card
- **Accent colors:** Each RX has a unique accent color alongside brand orange
- **Fonts:** Loaded via **Adobe Typekit** (kit ID: `xjx4hdo`) — NOT local font files

### Accent Colors by Treatment
Define a `--rx-accent` custom property per treatment page:
| Treatment | Accent | `--rx-accent` Value |
|-----------|--------|---------------------|
| Weight Loss (GLP-1) | Teal | `#0EA5E9` |
| Male Hormone | Amber | `#D97706` |
| Longevity (NAD+) | Purple | `#8B5CF6` |
| Skin Health | Pink | `#EC4899` |

---

## Blood-First Protocol Messaging

**Critical:** Superpower RX pages emphasize that treatment starts with blood work, not a prescription. This is the key differentiator.

### Messaging Framework
1. "Test first, treat with data" — blood work reveals what you actually need
2. "Personalized to your biomarkers" — not one-size-fits-all prescriptions
3. "Monitored and adjusted" — ongoing biomarker tracking during treatment
4. Protocol: Baseline blood draw → Clinical review → RX prescribed → Retest → Adjust

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

**Nesting order (must not be skipped):**
1. `section_*` — semantic section wrapper
2. `padding-global` — horizontal padding (5% left/right)
3. `padding-section-large/medium/small` — vertical padding
4. `container-large/medium/small` — max-width constraint

---

## 12-Section Page Structure

RX pages follow this section order (from production):

### 1. Hero (`section_*-hero`)
- Two-column: content left, visual right
- Left: accent badge → H1 → checklist with orange check SVGs → price display → CTA button
- Right: SVG glow blobs + model photo + glassmorphism product card
- Warm gradient: `linear-gradient(180deg, var(--_base-color-brand--vermillion-50) 0%, var(--background-color--background-primary) 100%)`

### 2. Animation/Sticky Section
- Sticky scroll with visual, myths vs science content
- Can be adapted per treatment

### 3. Checkmarks
- 4 benefit items with orange check SVGs (`stroke="#FC5F2B"`)
- Use the checklist pattern from design-system-reference.md §4c

### 4. Evidence
- 3 hover cards with backdrop blur + image backgrounds
- Evidence-card blur pattern from design-system-reference.md §13

### 5. Journey/Timeline
- Sticky left headline + scrolling accordion timeline
- Steps: Test → Treat → Optimize

### 6. How to Start
- 4-step numbered process
- Steps: Order → Blood Draw → Clinical Review → Treatment

### 7. What's Included
- Two-column: checklist left, image right
- Checklist uses orange checkmark SVGs

### 8. Emotional CTA
- Full-width parallax background with text overlay
- Price redisplay + CTA

### 9. FAQ (`section_faqs-shorthand`)
- **Div-based accordion** (NOT `<details>/<summary>`)
- 8-10 questions covering eligibility, side effects, shipping, blood work, monitoring
- Collapsible with +/− icon using JS toggle
- Pattern from design-system-reference.md §4d

### 10. Pre-footer CTA
- Parallax background, price redisplay, checklist, CTA
- Warm gradient background

### 11. Footer (`section_footer`)
- 5-column layout with links, dark background
- Pattern from design-system-reference.md §4g

### 12. Scripts
- GSAP + ScrollTrigger for animations, Lenis for smooth scroll
- FAQ accordion JS, pricing toggle JS

---

## Key CSS Patterns

### Glassmorphism Card
```css
.glass-card {
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.35);
    border-radius: var(--radius--radius-xl);
    box-shadow: 0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.4);
}
```

### Frosted Navbar
```css
nav.navbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border-color--border-primary);
    height: var(--navbar-height);
}
```

### Price Display (Italic Numerals)
```html
<div style="display:flex; align-items:baseline; gap:.25rem;">
    <span class="heading-style-h6 text-color-secondary" style="font-size:1rem;">from</span>
    <span class="heading-style-h2 text-style-italic" style="font-size:2.5rem;">$149</span>
    <span class="heading-style-h6 text-color-secondary" style="font-size:1rem;">/mo</span>
</div>
```

Note: Italic numerals use the `.text-style-italic` class which loads `'nbinternationalprocg webfont'` via Typekit — NOT a separate "Society" font.

### Pricing Toggle
```js
const periods = ['monthly', 'quarterly', '6month'];
function setPricing(period) {
    periods.forEach(p => {
        document.querySelector(`[data-period="${p}"]`).classList.toggle('active', p === period);
    });
    document.querySelector('.price-amount').textContent = prices[period];
}
```

### FAQ Accordion (Div-based)
```js
document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
        const item = q.closest('.faq-item');
        const wasOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
    });
});
```

---

## Design Token Reference

Use production semantic tokens — **never** use old shorthand names:

| Old (wrong) | Production (correct) |
|---|---|
| `--background` | `var(--background-color--background-primary)` |
| `--secondary` | `var(--background-color--background-secondary)` |
| `--foreground` | `var(--text-color--text-primary)` |
| `--secondary-foreground` | `var(--text-color--text-secondary)` |
| `--tertiary-foreground` | `var(--text-color--text-tertiary)` |
| `--border` | `var(--border-color--border-primary)` |
| `--vermillon-900` | `var(--_base-color-brand--vermillion-900)` |
| `--vermillon-50` | `var(--_base-color-brand--vermillion-50)` |
| `--radius-xl` | `var(--radius--radius-xl)` |
| `--radius-lg` | `var(--radius--radius-lrg)` |
| `--zinc-100` | `var(--_base-color-zinc--zinc-100)` |

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
- [ ] Light theme with glassmorphism accents
- [ ] Accent color matches treatment type (`--rx-accent`)
- [ ] Blood-first messaging throughout
- [ ] Pricing toggle works (monthly/quarterly/6-month)
- [ ] Frosted navbar with navigation
- [ ] All 12 sections present (adapt content per treatment)
- [ ] FAQ accordion is div-based with JS toggle (NOT `<details>/<summary>`)
- [ ] Responsive at 991px / 767px / 479px breakpoints
- [ ] Compliance disclaimer included
- [ ] Italic numerals use `.text-style-italic` class (NB International Pro italic via Typekit)

## After Building

1. Add entry to `superpower-mockups/index.html` with `cat: "RX"` and treatment badge
2. Offer review routing: Marcus (medical claims — REQUIRED for RX), Vera (compliance)
