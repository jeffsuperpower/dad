---
name: product-design
description: Build product/app mockups — dashboards, app screens, multi-screen prototypes using the Superpower design system. Use when asked to "build an app mockup", "design a dashboard", "create a product screen", "prototype an app experience", or any in-product design task.
---

# Product Design Skill

## When to Use

Use this skill when building **product/app mockups** — screens that represent Superpower's actual app experience, dashboards, in-product flows, or multi-screen prototypes.

**Input:** Feature name, screen flow, data to display, interaction model
**Output:** Complete `index.html` file in `superpower-mockups/<slug>/`

**Canonical reference:** Always consult `knowledge/design-system-reference.md` for the full HTML boilerplate, CSS tokens, and component patterns. That file is the single source of truth for all design tokens.

---

## Theme & Visual Language

- **Theme:** Light (app-like, clean white backgrounds)
- **Palette:** Predominantly white with subtle gray sections
- **Feel:** Clean, data-rich, confident — like a premium health dashboard
- **Interaction:** Tab-based or multi-screen with navigation
- **Data viz:** Charts, gauges, progress rings using inline SVG or CSS
- **Fonts:** Loaded via **Adobe Typekit** (kit ID: `xjx4hdo`) — NOT local font files

---

## Product Screen Types

### Type A: Single Dashboard
One viewport showing a complete dashboard view:
- Top nav with user context
- Sidebar or tab navigation
- Main content area with data cards
- Action buttons

### Type B: Multi-Screen Flow
Sequential screens simulating a user journey:
- Screen navigation (dots, tabs, or numbered steps)
- Transitions between screens
- Persistent header/context bar

### Type C: App Experience Prototype
Phone-frame or laptop-frame mockup:
- Device frame wrapper
- Scrollable content within frame
- Touch-like interactions (tap targets, swipe hints)

---

## Common Product Patterns

### Data Card
```css
.data-card {
    background: var(--background-color--background-primary);
    border: 1px solid var(--border-color--border-primary);
    border-radius: var(--radius--radius-xl);
    padding: 24px;
}
.data-card-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-color--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 8px;
}
.data-card-value {
    font-family: 'nbinternationalprocg webfont', Arial, sans-serif;
    font-size: 2rem;
    font-weight: 300;
    font-style: italic;
    color: var(--text-color--text-primary);
}
.data-card-trend {
    font-size: 0.8125rem;
    font-weight: 500;
    margin-top: 4px;
}
.data-card-trend.up { color: var(--_base-color-accents--green-700); }
.data-card-trend.down { color: var(--_base-color-accents--pink-700); }
```

### Progress Ring (SVG)
```html
<svg width="120" height="120" viewBox="0 0 120 120">
    <circle cx="60" cy="60" r="54" fill="none" stroke="var(--_base-color-zinc--zinc-200)" stroke-width="8"/>
    <circle cx="60" cy="60" r="54" fill="none" stroke="var(--_base-color-brand--vermillion-900)" stroke-width="8"
            stroke-dasharray="339.29" stroke-dashoffset="84.82" stroke-linecap="round"
            transform="rotate(-90 60 60)" style="transition: stroke-dashoffset 1s ease;"/>
    <text x="60" y="60" text-anchor="middle" dominant-baseline="central"
          font-family="'nbinternationalprocg webfont', Arial, sans-serif" font-size="28" font-style="italic"
          fill="var(--text-color--text-primary)">75</text>
</svg>
```
Formula: `stroke-dashoffset = circumference * (1 - percentage/100)` where circumference = `2 * π * r`

### Tab Navigation
```css
.product-tabs {
    display: flex;
    gap: 4px;
    background: var(--background-color--background-secondary);
    border-radius: var(--radius--radius-full);
    padding: 4px;
}
.product-tab {
    padding: 8px 20px;
    border-radius: var(--radius--radius-full);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-color--text-tertiary);
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    background: transparent;
    font-family: 'nb international pro webfont', Arial, sans-serif;
}
.product-tab.active {
    background: var(--background-color--background-primary);
    color: var(--text-color--text-primary);
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}
```

### Biomarker Row
```css
.biomarker-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0;
    border-bottom: 1px solid var(--_base-color-zinc--zinc-100);
}
.biomarker-name { font-weight: 500; font-size: 0.9375rem; }
.biomarker-value {
    font-family: 'nb international pro webfont', Arial, sans-serif;
    font-size: 0.875rem;
    letter-spacing: -0.025rem;
}
.biomarker-status {
    width: 8px; height: 8px; border-radius: 50%;
}
.biomarker-status.optimal { background: var(--_base-color-accents--green-500); }
.biomarker-status.warning { background: var(--_base-color-accents--yellow-500); }
.biomarker-status.critical { background: var(--_base-color-accents--pink-700); }
```

### Phone Frame Wrapper
```css
.phone-frame {
    width: 375px;
    height: 812px;
    border-radius: 40px;
    border: 8px solid var(--_base-color-zinc--zinc-900);
    overflow: hidden;
    background: var(--background-color--background-primary);
    box-shadow: 0 24px 80px rgba(0,0,0,0.15);
    position: relative;
}
.phone-frame::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 150px;
    height: 28px;
    background: var(--_base-color-zinc--zinc-900);
    border-radius: 0 0 20px 20px;
    z-index: 10;
}
.phone-content {
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}
```

---

## Multi-Screen Navigation

```js
let currentScreen = 0;
const screens = document.querySelectorAll('.screen');
const dots = document.querySelectorAll('.nav-dot');

function goToScreen(index) {
    screens.forEach((s, i) => {
        s.classList.toggle('active', i === index);
    });
    dots.forEach((d, i) => {
        d.classList.toggle('active', i === index);
    });
    currentScreen = index;
}
```

---

## Design Token Reference

Use production semantic tokens — **never** use old shorthand names or non-existent CSS variables:

| Old (wrong) | Production (correct) |
|---|---|
| `var(--background)` | `var(--background-color--background-primary)` |
| `var(--secondary)` | `var(--background-color--background-secondary)` |
| `var(--foreground)` | `var(--text-color--text-primary)` |
| `var(--tertiary-foreground)` | `var(--text-color--text-tertiary)` |
| `var(--border)` | `var(--border-color--border-primary)` |
| `var(--zinc-100)` | `var(--_base-color-zinc--zinc-100)` |
| `var(--zinc-200)` | `var(--_base-color-zinc--zinc-200)` |
| `var(--zinc-900)` | `var(--_base-color-zinc--zinc-900)` |
| `var(--vermillon-900)` | `var(--_base-color-brand--vermillion-900)` |
| `var(--radius-xl)` | `var(--radius--radius-xl)` |
| `var(--success-foreground)` | `var(--_base-color-accents--green-700)` |
| `var(--destructive-foreground)` | `var(--_base-color-accents--pink-700)` |
| `var(--accent-yellow-500)` | `var(--_base-color-accents--yellow-500)` |
| `var(--font-serif)` | `'nbinternationalprocg webfont', Arial, sans-serif` |
| `var(--font-sans)` | `'nb international pro webfont', Arial, sans-serif` |
| `var(--font-mono)` | Use `.text-style-mono` class instead |

Full token list in `knowledge/design-system-reference.md` §2.

---

## Responsive Breakpoints

| Breakpoint | Width |
|-----------|-------|
| Desktop | > 991px |
| Tablet | ≤ 991px |
| Mobile Landscape | ≤ 767px |
| Mobile Portrait | ≤ 479px |

**NOT** 1024/768/480 — use 991/767/479 to match Webflow production.

---

## Build Checklist

- [ ] Start from HTML boilerplate in design-system-reference.md §2
- [ ] Typekit font loading (NOT local @font-face)
- [ ] Production semantic tokens (NOT old shorthand names)
- [ ] Light theme with clean white backgrounds
- [ ] App-like feel (not marketing-page feel)
- [ ] Data visualizations use SVG or CSS (no external libraries)
- [ ] Interactive elements (tabs, toggles, screen nav) all functional
- [ ] Superpower branding present but subtle (logo, brand color accents)
- [ ] Realistic-looking data (not lorem ipsum numbers)
- [ ] Responsive at 991px / 767px / 479px (or phone-frame if app prototype)
- [ ] Smooth transitions between screens/states
- [ ] Italic numerals use `'nbinternationalprocg webfont'` font (via Typekit)

## After Building

1. Add entry to `superpower-mockups/index.html` with `cat: "Product"` and feature badge
2. Offer review routing: Mira (UX/product psychology)
