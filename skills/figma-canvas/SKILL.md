---
name: figma-canvas
description: Build Figma-ready fixed-canvas designs (charts, paid ads, social cards) using the Superpower production design system. Provides component patterns, chart templates, and ad layouts that match superpower.com pixel-perfectly. Use when Felix or any agent needs to build a visual for Figma capture.
---

# Figma Canvas Skill: Superpower Visual Components

## What This Is

Component library and design patterns for building fixed-canvas visual assets (charts, paid ads, social cards) that match the Superpower production website. Everything here uses the exact same design tokens as Aria's landing pages.

## When to Use

- Felix is building a chart, ad, or social card
- Data-insights skill needs a chart built
- Any agent needs a branded visual pushed to Figma
- User asks for "Figma-ready", "chart design", "ad mockup", "social card"

---

## 1. Foundation: Design Token Quick Reference

All values from `design-system-reference.md`. Use these EXACT hex values.

### Colors

| Purpose | Token | Hex |
|---------|-------|-----|
| Brand orange (CTAs, accents) | `--vermillion-900` | `#fc5f2b` |
| Orange hover | `--vermillion-700` | `#f7861e` |
| Light orange | `--vermillion-500` | `#fdba74` |
| Orange tint bg | `--vermillion-100` | `#ffedd5` |
| Warm wash bg | `--vermillion-50` | `#fff6ea` |
| Primary text | `--zinc-900` | `#18181b` |
| Secondary text | `--zinc-500` | `#71717a` |
| Tertiary text | `--zinc-400` | `#a1a1aa` |
| Primary border | `--zinc-200` | `#e4e4e7` |
| Secondary bg | `--zinc-50` | `#fafafa` |
| Tertiary bg | `--zinc-100` | `#f4f4f5` |
| Success | `--green-500` | `#11c182` |
| Error | `--pink-700` | `#b90090` |

### Typography

| Element | Size | Weight | Spacing | Font |
|---------|------|--------|---------|------|
| Series label | 11-12px | 500 | 0.1em | NB International Pro |
| Card headline | 28-36px | 400-500 | -0.02em | NB International Pro |
| Body text | 15-16px | 400 | 0 | NB International Pro |
| Data labels | 12-14px | 400-500 | 0 | NB International Pro |
| Bar values | 13-15px | 500 | 0 | NB International Pro |
| Big stat number | 48-72px | 300 | -0.03em | NB International Pro CG (italic) |
| Source line | 11px | 400 | 0 | NB International Pro |
| Wordmark | 11px | 500 | 0.15em | NB International Pro |

**Font loading:**
```html
<link rel="stylesheet" href="https://use.typekit.net/xjx4hdo.css">
```

**Font families:**
- Primary: `'nb international pro webfont', Arial, sans-serif`
- Italic numerals: `'nbinternationalprocg webfont', Arial, sans-serif`

---

## 2. Chart Components

### 2a. Horizontal Bar Chart

Best for: ranked lists, distributions, comparisons

```html
<div class="chart-area">
    <!-- Single bar row -->
    <div class="bar-row">
        <div class="bar-label">Label</div>
        <div class="bar-track">
            <div class="bar-fill" style="width: 72%;">
                <span class="bar-value">72%</span>
            </div>
        </div>
    </div>
</div>
```

```css
.chart-area {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.bar-row {
    display: flex;
    align-items: center;
    gap: 16px;
}

.bar-label {
    font-size: 14px;
    font-weight: 500;
    color: var(--zinc-600);
    width: 100px;
    flex-shrink: 0;
    text-align: right;
}

.bar-track {
    flex: 1;
    height: 36px;
    background: var(--zinc-100);
    border-radius: 6px;
    overflow: hidden;
    position: relative;
}

.bar-fill {
    height: 100%;
    border-radius: 6px;
    display: flex;
    align-items: center;
    padding-left: 14px;
}

.bar-fill.primary {
    background: var(--vermillion-900);
}

.bar-fill.secondary {
    background: var(--zinc-300);
}

.bar-fill.highlight {
    background: linear-gradient(90deg, var(--vermillion-900), var(--vermillion-700));
}

.bar-value {
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    white-space: nowrap;
}

/* For narrow bars, value goes outside */
.bar-value.outside {
    color: var(--zinc-600);
    position: absolute;
    right: -48px;
    top: 50%;
    transform: translateY(-50%);
}
```

### 2b. Vertical Bar Chart

Best for: age decade comparisons, time series

```html
<div class="v-chart">
    <div class="v-bar-group">
        <div class="v-bar-value">68%</div>
        <div class="v-bar-track">
            <div class="v-bar-fill primary" style="height: 68%;"></div>
        </div>
        <div class="v-bar-label">20s</div>
    </div>
    <!-- repeat for each group -->
</div>
```

```css
.v-chart {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 24px;
    height: 300px;
    padding-top: 32px;
}

.v-bar-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    flex: 1;
    max-width: 80px;
    height: 100%;
    justify-content: flex-end;
}

.v-bar-value {
    font-size: 14px;
    font-weight: 500;
    color: var(--zinc-700);
}

.v-bar-track {
    width: 100%;
    flex: 1;
    display: flex;
    align-items: flex-end;
    border-radius: 6px 6px 0 0;
    overflow: hidden;
}

.v-bar-fill {
    width: 100%;
    border-radius: 6px 6px 0 0;
    min-height: 4px;
}

.v-bar-fill.primary { background: var(--vermillion-900); }
.v-bar-fill.secondary { background: var(--zinc-200); }
.v-bar-fill.accent { background: var(--vermillion-500); }

.v-bar-label {
    font-size: 13px;
    font-weight: 500;
    color: var(--zinc-500);
}
```

### 2c. Stacked Bar Chart

Best for: composition breakdowns (risk categories by age)

```html
<div class="stacked-row">
    <div class="stacked-label">20s</div>
    <div class="stacked-track">
        <div class="stacked-segment optimal" style="width: 45%;" title="Optimal">
            <span>45%</span>
        </div>
        <div class="stacked-segment borderline" style="width: 35%;" title="Borderline">
            <span>35%</span>
        </div>
        <div class="stacked-segment elevated" style="width: 20%;" title="Elevated">
            <span>20%</span>
        </div>
    </div>
</div>
```

```css
.stacked-track {
    flex: 1;
    height: 40px;
    display: flex;
    border-radius: 6px;
    overflow: hidden;
    gap: 2px;
}

.stacked-segment {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 500;
    color: white;
}

.stacked-segment.optimal { background: var(--green-500); }
.stacked-segment.borderline { background: var(--vermillion-500); }
.stacked-segment.elevated { background: var(--vermillion-900); }
.stacked-segment.high { background: var(--pink-700); }
.stacked-segment.neutral { background: var(--zinc-300); color: var(--zinc-600); }
```

### 2d. Before/After Stat

Best for: improvement data, retest comparisons

```html
<div class="before-after">
    <div class="ba-item">
        <div class="ba-label">Before</div>
        <div class="ba-value italic-num">142</div>
        <div class="ba-unit">mg/dL</div>
    </div>
    <div class="ba-arrow">
        <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
            <path d="M4 12H36M36 12L28 5M36 12L28 19" stroke="#fc5f2b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </div>
    <div class="ba-item highlight">
        <div class="ba-label">After</div>
        <div class="ba-value italic-num">98</div>
        <div class="ba-unit">mg/dL</div>
    </div>
    <div class="ba-delta">
        <span class="delta-badge">↓ 31%</span>
    </div>
</div>
```

```css
.before-after {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 32px;
}

.ba-item {
    text-align: center;
}

.ba-label {
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--zinc-400);
    margin-bottom: 8px;
}

.ba-value {
    font-size: 56px;
    font-weight: 300;
    color: var(--zinc-900);
    line-height: 1;
}

.ba-item.highlight .ba-value {
    color: var(--vermillion-900);
}

.ba-unit {
    font-size: 14px;
    color: var(--zinc-500);
    margin-top: 4px;
}

.delta-badge {
    display: inline-block;
    background: var(--green-50);
    color: var(--green-700);
    padding: 6px 16px;
    border-radius: var(--radius-full);
    font-size: 14px;
    font-weight: 500;
}
```

### 2e. Stat Callout Box

```html
<div class="stat-callout">
    <div class="stat-number italic-num">61%</div>
    <div class="stat-text">of members discover a hidden health risk on their first test</div>
</div>
```

```css
.stat-callout {
    background: var(--vermillion-50);
    border-radius: var(--radius-xl);
    padding: 24px 32px;
    display: flex;
    align-items: center;
    gap: 20px;
}

.stat-number {
    font-size: 42px;
    font-weight: 300;
    color: var(--vermillion-900);
    line-height: 1;
    flex-shrink: 0;
}

.stat-text {
    font-size: 16px;
    color: var(--zinc-700);
    line-height: 1.5;
}
```

---

## 3. Card Frame Components

### 3a. Series Label (top of card)

```html
<div class="series-label">
    <span class="series-dot"></span>
    <span>SUPERPOWER DATA</span>
</div>
```

```css
.series-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--zinc-500);
}

.series-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--vermillion-900);
}
```

### 3b. Card Header (headline + subtitle)

**Always include a subtitle.** The subtitle sits directly below the headline in 16px zinc-500. It explains what the chart is measuring (e.g. "% of members with elevated ApoB by age decade"). Keep it to one line — factual, not editorialized.

```html
<div class="card-header">
    <h1 class="card-headline">The headline finding</h1>
    <div class="card-subtitle">What the chart is measuring, by dimension</div>
</div>
```

```css
.card-headline {
    font-size: 32px;
    font-weight: 400;
    letter-spacing: -0.02em;
    line-height: 1.2;
    color: var(--zinc-900);
    margin-bottom: 8px;
}
.card-subtitle {
    font-size: 16px;
    font-weight: 400;
    color: var(--zinc-500);
    line-height: 1.4;
    margin-bottom: 10px;
}
```

### 3c. Source Footer

**NEVER include sample size (n=), member count, or total numbers. Use percentages only.**
Source line is simply: "Source: Superpower member data"
Logo is the actual Superpower SVG — NOT a text wordmark.

```html
<div class="card-footer">
    <span class="source-line">Source: Superpower member data</span>
    <svg class="logo-mark" height="14" viewBox="0 0 164 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.763044 4.97858C0.763044 -0.685352 12.589 -1.86125 13.3306 4.91978..." fill="var(--zinc-400)"/>
    </svg>
</div>
```

Use the actual full SVG path from `superpower-mockups/shared/assets/sp_logo.svg` with fill `var(--zinc-400)` or `#a1a1aa`.

```css
.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.source-line {
    font-size: 11px;
    color: var(--zinc-400);
}

.logo-mark {
    height: 14px;
    width: auto;
}
```

---

## 4. Paid Ad Components

### 4a. Logo Mark

Always use the actual Superpower SVG logo — never a text approximation.

```html
<svg class="logo-mark" height="16" viewBox="0 0 164 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Full path from superpower-mockups/shared/assets/sp_logo.svg -->
    <path d="..." fill="#a1a1aa"/>
</svg>
```

```css
.logo-mark {
    height: 16px;
    width: auto;
}
```

### 4b. CTA Pill

```html
<div class="cta-pill">Get tested for $199/year</div>
```

```css
.cta-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--vermillion-900);
    color: #ffffff;
    font-size: 15px;
    font-weight: 500;
    padding: 14px 32px;
    border-radius: var(--radius-full);
    letter-spacing: -0.01em;
}
```

### 4c. Benefit Checklist (for ads)

```html
<div class="benefit-list">
    <div class="benefit-item">
        <svg class="check-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M16.667 5L7.5 14.167 3.333 10" stroke="#fc5f2b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>100+ biomarkers in 1 draw</span>
    </div>
</div>
```

```css
.benefit-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.benefit-item {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 16px;
    color: var(--zinc-700);
}

.check-icon {
    flex-shrink: 0;
}
```

### 4d. Split Comparison Layout

```css
.split-layout {
    display: flex;
    flex: 1;
}

.split-left {
    flex: 1;
    padding: 48px;
    background: var(--zinc-50);
}

.split-right {
    flex: 1;
    padding: 48px;
    background: var(--vermillion-50);
}

.split-header {
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0.03em;
    margin-bottom: 32px;
}

.split-left .split-header {
    color: var(--zinc-400);
}

.split-right .split-header {
    color: var(--vermillion-900);
}

.split-item {
    font-size: 15px;
    color: var(--zinc-600);
    padding: 14px 0;
    border-bottom: 1px solid var(--border-primary);
    line-height: 1.4;
}

.split-right .split-item {
    color: var(--zinc-800);
}

.split-right .split-item::before {
    content: "+ ";
    color: var(--vermillion-900);
    font-weight: 500;
}

.split-metric {
    margin-top: 20px;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.split-left .split-metric { color: var(--zinc-400); }
.split-right .split-metric { color: var(--vermillion-900); }
```

---

## 5. Legend Component

```html
<div class="legend">
    <div class="legend-item">
        <span class="legend-dot" style="background: var(--vermillion-900);"></span>
        <span>Primary series</span>
    </div>
    <div class="legend-item">
        <span class="legend-dot" style="background: var(--zinc-300);"></span>
        <span>Comparison</span>
    </div>
</div>
```

```css
.legend {
    display: flex;
    gap: 24px;
    margin-bottom: 24px;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--zinc-500);
}

.legend-dot {
    width: 10px;
    height: 10px;
    border-radius: 3px;
}
```

---

## 6. Canvas Padding Guide

| Canvas Size | Outer Padding | Element Gap | Headline Size |
|-------------|---------------|-------------|---------------|
| 1080×1080 | 48-56px | 24-32px | 32-36px |
| 1200×628 | 48-56px | 20-24px | 28-32px |
| 1080×1350 | 48-56px | 24-32px | 32-36px |
| 1080×1920 | 48-56px | 32-40px | 36-42px |
| 1200×675 | 48-56px | 20-24px | 28-32px |

---

## 7. Hard Rules

- **ALWAYS use white background.** Every canvas uses `#ffffff` or `#fafafa`. Never use dark/black backgrounds.
- **NEVER use em dashes** ( -- ) anywhere in chart text, headlines, subtitles, or source lines. Use hyphens (-) or rewrite the sentence.
- **NEVER disclose total member count.** No "n=19,000", no "19,758 members", no sample sizes. All data references use percentages only. Source line is simply "Source: Superpower member data".
- **NEVER use Inter font.** Always NB International Pro via Typekit.
- **ALWAYS use the actual Superpower logo SVG** from `superpower-mockups/shared/assets/`, not a text approximation.
- **Default to 1080x1080 square** for all social and paid ad channels.
- **Lock both `html` and `body`** to the canvas dimensions with `overflow: hidden` to prevent browser viewport from being wider than the canvas (which causes Figma to capture a landscape frame).
- **Use `figmaselector=body`** in all Figma capture URLs to ensure only the fixed-size body element is captured.
