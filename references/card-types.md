# Card Types — Per-Role Spatial Composition

> Each card role has a distinct spatial composition. Reusing the cover's
> layout for a `detail` slide, or treating `data` like `list`, is the most
> common cause of "all slides look the same" failure. This file pairs the
> ASCII diagram (what the slide should look like) with the CSS pattern
> (how to build it) for each role. Read only the section(s) you need.

**Important:** there are no fixed HTML templates. The patterns below are
starting points — adjust based on content. Every pattern uses the mandated
`absolute + translateY(-50%)` centering pattern from [`canvas.md`](./canvas.md).

## Role Index

- [1. Hook / Cover](#1-cover-hook) — first slide
- [2. Body](#2-body) — explanation, analysis
- [3. List](#3-list) — 3+ items, equal weight
- [4. Stats / Data](#4-stats--data) — number is the message
- [5. Quote](#5-quote) — single powerful sentence
- [6. Comparison](#6-comparison) — Before/After, A vs B
- [7. CTA](#7-cta-call-to-action) — last slide, drives action

---

## 1. Cover (Hook)

**When:** first slide. Must answer "why should I read this?" within 2 seconds.

```
Composition:
  - Adaptive title: 48-80px (64-80px if 8 chars or fewer, 48px if more)
  - Max 8 words (16 chars in Korean)
  - Brand mark: small in a corner
  - High contrast: 7:1+ recommended

Layout:
  ┌──────────────────────┐
  │                      │
  │   [Brand mark]       │
  │                      │
  │   Large title        │
  │   One-line subtitle  │
  │                      │
  │                      │
  └──────────────────────┘
```

```css
.slide {
  width: 1080px;
  height: 1080px;
  overflow: hidden;
  position: relative;
  background: var(--bg);
  color: var(--fg);
}

.content {
  position: absolute;
  top: 50%;
  left: 80px;
  right: 80px;
  transform: translateY(-50%);
}

.brand-mark {
  position: absolute;
  top: 4.5%;
  left: 7%;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--accent);
}

.title {
  font-size: 64px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.2;
  word-break: keep-all;
  max-width: 780px;
  margin-bottom: 28px;
}

.subtitle {
  font-size: 28px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--fg);
  opacity: 0.7;
  word-break: keep-all;
}
```

---

## 2. Body

**When:** delivering core information. Explanations, analysis, context.

```
Composition:
  - Number badge or category label: 20px, weight 600
  - Title: 32-40px, weight 700
  - Divider: 1-2px, accent color, width 40-80px
  - Body: 24-28px, weight 400, line-height 1.618

Layout:
  ┌──────────────────────┐
  │                      │
  │   01                 │
  │   Title text         │
  │   ────                │
  │   Body text goes     │
  │   here. Max 4        │
  │   lines.             │
  │                      │
  └──────────────────────┘
```

```css
.slide {
  width: 1080px; height: 1080px;
  overflow: hidden; position: relative;
  background: var(--bg); color: var(--fg);
}

.content {
  position: absolute;
  top: 50%; left: 80px; right: 80px;
  transform: translateY(-50%);
}

.label {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--accent);
  margin-bottom: 22px;
}

.heading {
  font-size: 36px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.3;
  word-break: keep-all;
  margin-bottom: 32px;
}

.divider {
  width: 48px;
  height: 2px;
  background: var(--accent);
  margin-bottom: 32px;
}

.body-text {
  font-size: 26px;
  font-weight: 400;
  line-height: 1.618;
  word-break: keep-all;
  max-width: 760px;
  color: var(--fg);
  opacity: 0.85;
}
```

---

## 3. List

**When:** 3 or more items presented with equal weight.

```
Composition:
  - Auto-numbering or bullets
  - Consistent spacing between items: 28-36px
  - Each item: label (weight 600) + description (weight 400)
  - Do NOT wrap items in individual boxes (Anti-pattern)

Layout:
  ┌──────────────────────┐
  │   Title              │
  │                      │
  │   1. Item one        │
  │      Description     │
  │                      │
  │   2. Item two        │
  │      Description     │
  │                      │
  │   3. Item three      │
  │      Description     │
  └──────────────────────┘
```

```css
.slide {
  width: 1080px; height: 1080px;
  overflow: hidden; position: relative;
  background: var(--bg); color: var(--fg);
}

.content {
  position: absolute;
  top: 50%; left: 80px; right: 80px;
  transform: translateY(-50%);
}

.list-title {
  font-size: 36px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.3;
  word-break: keep-all;
  margin-bottom: 48px;
}

.list-item {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 32px;
}

.list-number {
  font-size: 20px;
  font-weight: 700;
  color: var(--accent);
  min-width: 32px;
  margin-right: 20px;
}

.list-item-label {
  font-size: 26px;
  font-weight: 600;
  line-height: 1.4;
  word-break: keep-all;
  margin-bottom: 6px;
}

.list-item-desc {
  font-size: 22px;
  font-weight: 400;
  line-height: 1.618;
  word-break: keep-all;
  opacity: 0.7;
}
```

**Anti-example:** wrapping each list item in a card/box with background +
border-radius + shadow turns the slide into a UI component demo. Use
typography and whitespace to separate items, not boxes.

---

## 4. Stats / Data

**When:** numbers are the core message. Growth rates, returns, comparative figures.

```
Composition:
  - Hero number: 80-140px, weight 800-900
  - Unit/label: 1/3 the size of the number, weight 500
  - Context text: 24px, weight 400
  - Recommend English-only font for numbers (Space Grotesk)

Layout:
  ┌──────────────────────┐
  │                      │
  │   Label              │
  │   +127%              │
  │   Context text       │
  │                      │
  └──────────────────────┘
```

```css
.slide {
  width: 1080px; height: 1080px;
  overflow: hidden; position: relative;
  background: var(--bg); color: var(--fg);
}

.content {
  position: absolute;
  top: 50%; left: 80px; right: 80px;
  transform: translateY(-50%);
}

.stat-label {
  font-size: 22px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--accent);
  margin-bottom: 12px;
}

.stat-number {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 120px;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.0;
  color: var(--fg);
  margin-bottom: 12px;
}

.stat-unit {
  font-size: 40px;
  font-weight: 500;
  vertical-align: baseline;
}

.stat-context {
  font-size: 24px;
  font-weight: 400;
  line-height: 1.618;
  word-break: keep-all;
  max-width: 640px;
  opacity: 0.7;
}
```

---

## 5. Quote

**When:** a single powerful sentence is the entire message.

```
Composition:
  - Quote: 32-48px, weight 300-400 italic (or weight 500 for Korean)
  - Source: 20px, weight 500
  - Quotation marks: decorative large quotes (optional, SVG)
  - Center alignment allowed

Layout:
  ┌──────────────────────┐
  │                      │
  │       "Quote         │
  │        text"         │
  │                      │
  │       — Source        │
  │                      │
  └──────────────────────┘
```

```css
.slide {
  width: 1080px; height: 1080px;
  overflow: hidden; position: relative;
  background: var(--bg); color: var(--fg);
}

.content {
  position: absolute;
  top: 50%; left: 80px; right: 80px;
  transform: translateY(-50%);
  text-align: center;
}

.quote-mark {
  font-size: 80px;
  font-weight: 300;
  line-height: 1;
  color: var(--accent);
  opacity: 0.4;
  margin-bottom: 24px;
}

.quote-text {
  font-size: 36px;
  font-weight: 500;
  line-height: 1.5;
  word-break: keep-all;
  max-width: 760px;
  margin: 0 auto 28px;
}

.quote-source {
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 0.04em;
  opacity: 0.6;
}
```

---

## 6. Comparison

**When:** Before/After, pros/cons, A vs B comparison.

```
Composition:
  - 2-column symmetrical layout
  - Column separation: color difference or 1px divider
  - Column headers: 28px, weight 700
  - Column content: 24px, weight 400
  - Maintain full symmetry: equal number of items on both sides

Layout:
  ┌──────────┬───────────┐
  │  Before  │  After    │
  │          │           │
  │  Item 1  │  Item 1   │
  │  Item 2  │  Item 2   │
  │  Item 3  │  Item 3   │
  └──────────┴───────────┘
```

```css
.slide {
  width: 1080px; height: 1080px;
  overflow: hidden; position: relative;
  background: var(--bg); color: var(--fg);
}

/* Comparison uses two absolutely-positioned columns */
.compare-col-left {
  position: absolute;
  top: 50%;
  left: 80px;
  right: 544px;          /* Half of 1080 + 4px gap */
  transform: translateY(-50%);
}

.compare-col-right {
  position: absolute;
  top: 50%;
  left: 544px;
  right: 80px;
  transform: translateY(-50%);
}

.compare-col-header {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.3;
  color: var(--accent);
  margin-bottom: 36px;
}

.compare-item {
  font-size: 24px;
  font-weight: 400;
  line-height: 1.618;
  word-break: keep-all;
  margin-bottom: 24px;
}

/* Optional absolute divider between columns */
.compare-divider {
  position: absolute;
  top: 15%;
  bottom: 15%;
  left: 540px;
  width: 1px;
  background: var(--accent);
  opacity: 0.15;
}
```

---

## 7. CTA (Call to Action)

**When:** always the last slide. Drives the reader to take action.

```
Composition:
  - Action prompt text: 36-48px, weight 700, center-aligned
  - Supporting text: 24px, weight 400
  - Brand mark/logo
  - Optional: link/handle information

Layout:
  ┌──────────────────────┐
  │                      │
  │      Action          │
  │      prompt          │
  │                      │
  │      Supporting text │
  │                      │
  │      @handle         │
  └──────────────────────┘
```

```css
.slide {
  width: 1080px; height: 1080px;
  overflow: hidden; position: relative;
  background: var(--bg); color: var(--fg);
}

.content {
  position: absolute;
  top: 50%; left: 80px; right: 80px;
  transform: translateY(-50%);
  text-align: center;
}

.cta-heading {
  font-size: 44px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.3;
  word-break: keep-all;
  max-width: 720px;
}

.cta-subtext {
  font-size: 24px;
  font-weight: 400;
  line-height: 1.618;
  word-break: keep-all;
  opacity: 0.7;
}

.cta-handle {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--accent);
}

.brand-mark-bottom {
  position: absolute;
  bottom: 4.5%;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.04em;
  opacity: 0.5;
}
```

---

## Anti-Examples Across Roles

**Wrong — `cover` and `detail` use identical composition.** Different text
is not different layout. Cover must be visually stronger (larger type, less
density) than any other slide in the carousel.

**Wrong — `list` items in boxes.** `background + border-radius + shadow` on
each item turns the carousel into a UI demo. Use typography + whitespace.

**Wrong — `data` slide with a 60px hero number.** Hero number must be 3×+
body (so 80–140px for a 24–28px body). If the number is the message, it
must dominate visually.

## See also

- [`canvas.md`](./canvas.md) — the centering pattern every role uses
- [`golden-examples.md`](./golden-examples.md) — full HTML slides demonstrating
  cover, data, list, and CTA spatial compositions side by side
- [`quality-gates.md`](./quality-gates.md) — character caps per role
