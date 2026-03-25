---
name: funnel-builder
description: Build interactive funnel pages (quizzes, calculators, multi-step flows) using the Superpower design system. Dark theme, 4-screen flow, interactive logic, psychology badges. Use when asked to "build a funnel", "create a quiz", "make a calculator", "design an interactive tool", or any conversion funnel mockup.
---

# Funnel Builder Skill

## When to Use

Use this skill when building an **interactive funnel** — a multi-screen experience that engages users through a quiz, calculator, assessment, or interactive tool designed to convert through engagement.

**Input:** Funnel concept, psychology angle, target audience, conversion goal
**Output:** Complete `index.html` file in `superpower-mockups/<slug>/`

**Canonical reference:** Always consult `knowledge/design-system-reference.md` for the full HTML boilerplate, CSS tokens, and component patterns. That file is the single source of truth for all design tokens.

---

## Theme & Visual Language

- **Theme:** Dark (deep navy/charcoal backgrounds)
- **Palette:** Override semantic tokens with dark values in `:root` (see design-system-reference.md §14):
  ```css
  :root {
      --background-color--background-primary: #0B0E14;
      --background-color--background-secondary: #12161F;
      --background-color--background-tertiary: #1A1F2B;
      --text-color--text-primary: #F0F0F2;
      --text-color--text-secondary: #9BA1B0;
      --text-color--text-tertiary: #5E6578;
      --border-color--border-primary: rgba(255,255,255,0.06);
      --border-color--border-secondary: rgba(255,255,255,0.14);
      /* Brand + radius tokens remain the same as light theme */
  }
  ```
- **Accents:** Brand orange (`var(--_base-color-brand--vermillion-900)`) for CTAs, highlights, progress indicators
- **Borders:** `rgba(255,255,255,0.06)` and `rgba(255,255,255,0.14)`
- **Fonts:** Loaded via **Adobe Typekit** (kit ID: `xjx4hdo`) — NOT local font files
- **Feel:** Premium, immersive, slightly gaming-inspired

---

## Client-First Section Nesting

Even in dark-themed funnels, use the Client-First nesting pattern for layout consistency:

```html
<section class="section_{{section-name}}">
    <div class="padding-global">
        <div class="padding-section-large">
            <div class="container-medium">
                <!-- Section content -->
            </div>
        </div>
    </div>
</section>
```

---

## 4-Screen Flow Structure

Most funnels follow this 4-screen progression:

### Screen 1: Hook / Entry
- Full-viewport dark hero
- Compelling headline using psychology principle
- Brief description of what user will learn/discover
- Single CTA button to begin
- Optional: blurred preview of results to create curiosity

### Screen 2: Interactive Input
- The main engagement screen
- Card selections, sliders, checkboxes, or quiz questions
- Real-time visual feedback (counters, progress bars, animations)
- Progress indicator (step dots or progress bar)

### Screen 3: Processing / Reveal
- Brief "calculating" animation (builds anticipation)
- Results reveal with animated transitions
- Charts, scores, gauges, or comparison data
- Key insight highlighted with brand orange

### Screen 4: Conversion
- Personalized results summary
- Clear value proposition tied to their answers
- Superpower CTA with urgency
- Optional email gate before full results

---

## Interactive Patterns

### Quiz Questions
```html
<div class="quiz-options">
    <button class="quiz-option" onclick="selectOption(this, value)">
        <span class="option-icon"><!-- emoji or icon --></span>
        <span class="option-label">Option text</span>
    </button>
</div>
```

```css
.quiz-option {
    background: var(--background-color--background-secondary);
    border: 1px solid var(--border-color--border-primary);
    border-radius: var(--radius--radius-lrg);
    padding: 16px 20px;
    color: var(--text-color--text-primary);
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
    width: 100%;
}
.quiz-option:hover {
    border-color: rgba(252, 95, 43, 0.3);
    background: rgba(252, 95, 43, 0.06);
}
.quiz-option.selected {
    border-color: var(--_base-color-brand--vermillion-900);
    background: rgba(252, 95, 43, 0.1);
}
```

**Note:** Use hex `rgba()` values for orange translucency — NOT OKLCH (`oklch(from var(...) ...)` is not supported in all browsers).

### Progress Bar
```css
.progress-bar {
    width: 100%;
    height: 4px;
    background: rgba(255,255,255,0.06);
    border-radius: 2px;
    overflow: hidden;
}
.progress-fill {
    height: 100%;
    background: var(--_base-color-brand--vermillion-900);
    border-radius: 2px;
    transition: width 0.4s ease;
}
```

### Animated Counter
```js
function animateCounter(el, target, duration = 1500) {
    const start = performance.now();
    const initial = 0;
    function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(initial + (target - initial) * eased);
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}
```

### Screen Transitions
```css
.screen { display: none; opacity: 0; transform: translateY(20px); }
.screen.active {
    display: block;
    animation: screenIn 0.4s ease forwards;
}
@keyframes screenIn {
    to { opacity: 1; transform: translateY(0); }
}
```

---

## Psychology Badge

Every funnel is themed around a cognitive bias or psychology principle. Display it as a badge:

```html
<span class="psych-badge">
    <svg><!-- brain icon --></svg>
    Loss Aversion
</span>
```

This badge appears in the index.html card for the funnel.

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
| `--radius-lg` | `var(--radius--radius-lrg)` |

Full token list in `knowledge/design-system-reference.md` §2.

**Important:** Never use OKLCH color functions (`oklch(from var(...) l c h / alpha)`). Use standard `rgba()` with hex values instead.

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
- [ ] Dark theme token overrides applied (design-system-reference.md §14)
- [ ] Production semantic tokens (NOT old shorthand names)
- [ ] NO OKLCH colors — use `rgba()` with hex values
- [ ] Client-First section nesting for layout
- [ ] 4-screen flow with smooth transitions
- [ ] All interactive elements have hover + selected states
- [ ] Progress indicator visible throughout
- [ ] Results screen has animated reveals
- [ ] Final CTA ties results to Superpower value prop
- [ ] Responsive at 991px / 767px / 479px breakpoints
- [ ] JavaScript is clean, no console errors
- [ ] Psychology principle clearly integrated into UX

## After Building

1. Add entry to `superpower-mockups/index.html` mockups array with psychology `badge`
2. Offer review routing: Mira (UX psychology), Marcus (medical claims), Vera (compliance)
