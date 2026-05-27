# Card News Design Principles

> This document defines the design rules Claude must follow when generating HTML/CSS card news.
> All rules include specific values. A rule without specific values is not a rule.

---

## 1. Canvas Specifications

- Square: `1080 × 1080px`
- Portrait: `1080 × 1350px` (Instagram recommended 4:5 ratio)
- `box-sizing: border-box` applied globally
- `overflow: hidden` required on root element
- Layout: `position: absolute` + `transform: translateY(-50%)` for vertical centering (Puppeteer rendering compatibility)
- No JavaScript
- Styles: inline `<style>` tag or inline style attributes
- Icons: inline SVG only. Emoji absolutely prohibited (inconsistent rendering across OS)
- Fonts: load via Google Fonts `@import` (render script handles inlining)

---

## 2. Typography

### 2.1 Size Scale

| Role | Min | Default | Max | weight |
|---|---|---|---|---|
| Hero number | 80px | 120px | 140px | 800-900 |
| Slide title (8 chars or fewer) | 48px | 64px | 80px | 700-800 |
| Slide title (more than 8 chars) | 36px | 48px | 64px | 700 |
| Body heading | 28px | 32px | 40px | 600-700 |
| Body text | 24px | 28px | 32px | 400-500 |
| Caption/label | 16px | 20px | 24px | 500-600 |
| Source/watermark | 12px | 14px | 16px | 400 |

**Key ratio**: heading must be at least 1.5x body, max 2.5x. Hero number must be at least 3x body.

**Adaptive sizing**: adjust size based on text length.
- Single line (1-8 chars): can go up to 64-80px
- Two lines (9-20 chars): 48-64px
- Three or more lines: 32-48px
- Long paragraphs (50+ chars): reduce to 24-28px

### 2.2 Korean Typography Rules

```css
/* line-height formula: font-size × 1.618 (golden ratio) */
/* Example: 28px body → line-height: 45px (rounded) */

/* Headings (36px and above) */
.heading {
  line-height: 1.3;        /* Tighter than golden ratio for large text */
  letter-spacing: -0.02em; /* Negative letter-spacing for large text */
  word-break: keep-all;    /* Required for Korean word-unit line breaks */
}

/* Body (24-32px) */
.body {
  line-height: 1.618;      /* Golden ratio applied */
  letter-spacing: 0;       /* Default for mid-size text */
  word-break: keep-all;
}

/* Labels/Captions (20px and below) */
.caption {
  line-height: 1.5;
  letter-spacing: 0.04em;  /* Positive letter-spacing for small text */
  word-break: keep-all;
}
```

### 2.3 Font Weight Diversity

**Prohibited**: using only 400 and 700. This is the most common sign of AI slop.

Weight usage guide:
- **300 (Light)**: supporting text for large hero numbers, quotes
- **400 (Regular)**: body text
- **500 (Medium)**: emphasized body text, list item labels
- **600 (SemiBold)**: subheadings, important labels, button text
- **700 (Bold)**: slide titles
- **800 (ExtraBold)**: cover titles, when strong impact is needed
- **900 (Black)**: hero numbers only

Use a minimum of 2 and maximum of 4 different weights per slide.
Maximum 2 font families across the entire carousel.

### 2.4 Font Selection Guide

**Prohibited fonts** (AI slop signals):
- Inter, Roboto, Arial, Helvetica — these are not "safe" choices, they are "lazy" choices

**Recommended Korean fonts**:
- **Pretendard**: modern, clean default choice. Variable weight support
- **Noto Sans KR**: high versatility, but must be paired with another font
- **SUIT**: Pretendard alternative. Slightly softer feel
- **Wanted Sans**: geometric and modern

**Recommended English/number-only fonts** (for hero numbers, statistics):
- **Space Grotesk**: geometric with impactful numbers
- **DM Sans**: clean yet distinctive choice
- **Plus Jakarta Sans**: soft and modern
- **Outfit**: rounded and friendly feel

Selection by content tone:
- Finance/data: Pretendard + Space Grotesk
- Lifestyle: SUIT + Plus Jakarta Sans
- Tech/startup: Wanted Sans + DM Sans

---

## 3. Layout

### 3.1 Core Principle

**1 slide = 1 message**. If a single slide tells two stories, split it into two slides.

### 3.2 Space Allocation

```
Total canvas: 100%
├── Content area: max 40%
└── Whitespace: min 60%
```

- **Padding**: 54-86px (5-8% of canvas width)
- **Safe zone**: core content placed within the center 80% of the canvas
  - 10% margin on each side (108px at 1080px canvas)
- **Spacing between elements**: follows the rhythm table below

**Spacing rhythm table (margin-bottom values):**

| After this element | margin-bottom | Why |
|---|---|---|
| Label / eyebrow (small category text) | 20-24px | Tight — belongs to the heading below |
| Heading / title | 28-36px | Breathing room after heavy visual element |
| Divider line | 32-40px | Dividers need space on BOTH sides to feel balanced |
| Body paragraph | 24-28px | Comfortable reading rhythm |
| Last body paragraph (before next section) | 40-48px | Section break — needs visible gap |
| List item | 28-36px | Enough to separate items without boxes |
| Quote text | 36-44px | Quotes need generous surrounding space |
| CTA heading | 24-28px | Keep action close to supporting text |

**Key principle: spacing should NOT be uniform.** If every margin-bottom is 24px, the slide looks mechanical. Vary spacing to create visual rhythm — tight after labels, generous after headings, extra generous between sections.

### 3.3 Element Density

Maximum 5 visual elements per slide. "Element" means:
- 1 text block = 1 element
- 1 icon = 1 element
- 1 decorative line/divider = 1 element
- 1 brand mark = 1 element
- 1 data visualization = 1 element

If exceeding 5, always reduce. Removing is better than adding.

### 3.4 Alignment Rules

```
Default: left-aligned (text-align: left)

Center alignment allowed when:
  - All text lines are similar in length (within ±20%)
  - Hero number displayed alone
  - CTA slide
  - Quotation
  - Single-line title

Right alignment: used only for number/stat labels and source attribution
```

Korean body text of 3 or more lines must always be left-aligned. No exceptions.

### 3.5 Vertical Placement

Center content on the canvas, but the visual center is slightly above the mathematical center.

**Key: `.slide` is `position: relative`. `.content` is `position: absolute; top: 50%; transform: translateY(-50%)` for bulletproof vertical centering.**

Flexbox `justify-content: center` is prohibited — it drifts when padding or content volume changes. The absolute+transform method centers correctly regardless of content amount.

```css
/* ✅ Correct: absolute+transform centering */
.slide {
  width: 1080px;
  height: 1080px;
  position: relative;
  /* NO display:flex, NO justify-content:center */
}
.content {
  position: absolute;
  top: 50%;
  left: 80px;
  right: 80px;
  transform: translateY(-50%);
  /* For center-aligned slides (CTA, quote): add text-align: center; */
}

/* ✅ Internal spacing via margin-bottom on each element */
.heading { margin-bottom: 28px; }
.body-text { margin-bottom: 24px; }

/* ❌ Prohibited: flexbox centering */
body { display: flex; justify-content: center; }  /* NEVER */

/* ❌ Prohibited: flexbox gap for content spacing */
.content-group { display: flex; gap: 24px; }  /* NEVER */
```

**Rules:**
- `.slide`: `position: relative` — no flexbox, no justify-content
- `.content`: `position: absolute; top: 50%; left: 80px; right: 80px; transform: translateY(-50%)`
- Internal spacing: `margin-bottom` on each element inside `.content` (not flexbox gap)
- Absolute-positioned decorations (brand marks, page numbers): go inside `.slide` but outside `.content`
- Content width: left: 80px + right: 80px = 920px content area

**Prohibited**: content clustered at the top with the bottom third left empty.

---

## 4. Color

### 4.1 Base Rules

- **Max 3 colors per slide**: background + text + accent
- **Contrast**: text-background contrast 4.5:1 or higher (WCAG AA). This is required, not recommended
- **Dominant color + sharp accent**: do not distribute colors timidly. One color dominates at 70%+, accent is intense at 10% or less

### 4.2 Background Treatment

```
Allowed:
  - Solid color background
  - Brand color-based gradient (max 2 colors)
  - Very subtle radial gradient (background variation)

Prohibited:
  - Noise textures
  - Repeating patterns
  - Image backgrounds (unless explicitly specified)
  - Gradients with 3+ colors
```

### 4.3 Text on Gradients

When placing text on gradient backgrounds, always apply one of the following:

```css
/* Method 1: Semi-transparent background box */
.text-on-gradient {
  background: rgba(0, 0, 0, 0.15);
  padding: 16px 24px;
  border-radius: 8px;
}

/* Method 2: Text shadow */
.text-on-gradient {
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}
```

### 4.4 Korean Finance Convention

In Korean stock/finance content:
- **Red = up/gain** (opposite of international standard)
- **Blue = down/loss** (opposite of international standard)

Reversing this causes confusion for Korean readers. Never follow the international standard.

---

## 5. Layout Guide by Card Type

Claude does not use fixed templates. It analyzes the content and selects the most appropriate pattern below.

### 5.1 Hook/Cover

**When**: first slide of a carousel. Must answer "why should I read this?" within 2 seconds.

```
Composition:
  - Adaptive title: 48-80px (64-80px if 8 chars or fewer, 48px if more)
  - Max 8 words (16 chars in Korean)
  - Brand mark: small in a corner
  - High contrast: 7:1+ recommended for background-text contrast

Layout:
  ┌──────────────────────┐
  │                      │
  │   [Brand mark]       │
  │                      │
  │                      │
  │   Large title        │
  │   One-line subtitle  │
  │                      │
  │                      │
  │                      │
  └──────────────────────┘
```

### 5.2 Body

**When**: delivering core information. Explanations, analysis, context.

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
  │                      │
  └──────────────────────┘
```

### 5.3 List

**When**: 3 or more items presented with equal weight.

```
Composition:
  - Auto-numbering or bullets
  - Consistent spacing between items: 28-36px
  - Each item: label (weight 600) + description (weight 400)
  - Do NOT wrap items in individual boxes (Anti-pattern)

Layout:
  ┌──────────────────────┐
  │                      │
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
  │                      │
  └──────────────────────┘
```

### 5.4 Stats/Data

**When**: numbers are the core message. Growth rates, returns, comparative figures.

```
Composition:
  - Hero number: 80-140px, weight 800-900
  - Unit/label: 1/3 the size of the number, weight 500
  - Context text: 24px, weight 400
  - Recommend using English-only font for numbers (e.g., Space Grotesk)

Layout:
  ┌──────────────────────┐
  │                      │
  │                      │
  │   Label              │
  │   +127%              │
  │   Context text       │
  │                      │
  │                      │
  └──────────────────────┘
```

### 5.5 Quote

**When**: a single powerful sentence is the entire message.

```
Composition:
  - Quote: 32-48px, weight 300-400 italic (or weight 500 for Korean)
  - Source: 20px, weight 500
  - Quotation marks: decorative large quotes (optional, SVG)
  - Center alignment allowed

Layout:
  ┌──────────────────────┐
  │                      │
  │                      │
  │       "Quote         │
  │        text"         │
  │                      │
  │       — Source        │
  │                      │
  │                      │
  └──────────────────────┘
```

### 5.6 Comparison

**When**: Before/After, pros/cons, A vs B comparison.

```
Composition:
  - 2-column symmetrical layout
  - Column separation: color difference or 1px divider
  - Column headers: 28px, weight 700
  - Column content: 24px, weight 400
  - Maintain full symmetry: equal number of items on both sides

Layout:
  ┌──────────┬───────────┐
  │          │           │
  │  Before  │  After    │
  │          │           │
  │  Item 1  │  Item 1   │
  │  Item 2  │  Item 2   │
  │  Item 3  │  Item 3   │
  │          │           │
  └──────────┴───────────┘
```

### 5.7 CTA (Call to Action)

**When**: always the last slide. Drives reader to take action.

```
Composition:
  - Action prompt text: 36-48px, weight 700, center-aligned
  - Supporting text: 24px, weight 400
  - Brand mark/logo
  - Optional: link/handle information

Layout:
  ┌──────────────────────┐
  │                      │
  │                      │
  │      Action          │
  │      prompt          │
  │                      │
  │      Supporting text │
  │                      │
  │      @handle         │
  │                      │
  └──────────────────────┘
```

---

## 6. Slide Sequence

### 6.1 Narrative Structure

```
Hook → Context → Value Delivery → Summary → CTA

Example (5-slide carousel):
  Slide 1: Hook — "연봉 5천인데 1억 모으는 법"
  Slide 2: Context — "평균 저축률은 왜 낮은가"
  Slide 3: Value — "핵심 전략 3가지"
  Slide 4: Value — "실제 사례와 수치"
  Slide 5: CTA — "지금 시작하는 첫 단계"
```

### 6.2 Visual Consistency

Maintain across the entire carousel:
- **Same**: font family, color palette, padding values, brand mark position
- **Vary**: layout pattern (never the same layout on every slide), subtle background brightness/tone shifts

**Exception:** If the brand's established surface mode is a single light color (e.g., `#FAFAFA`), uniform backgrounds are acceptable. The variation rule applies primarily to dark themes where subtle gradient shifts add depth. For light themes, variation comes from layout and typography changes, not background color.

### 6.3 Independence + Connectivity

Each slide must be:
- **Independent**: makes sense when viewed in isolation
- **Connected**: shares the same visual language (color, font, spacing)
- **Sequential**: implies order through numbering, progress indicators, or narrative flow

---

## 7. SVG Illustration Guide

Use inline SVG actively to add visual interest to card news.
Emoji is absolutely prohibited. SVG is the only means for visual elements.

### 7.1 Style Rules

```
Style: flat minimal (Lucide/Feather family)
Stroke: stroke-width 1.5~2, stroke-linecap="round", stroke-linejoin="round"
Fill: fill="none" by default. For filled areas, accent + opacity only
Color: within brand palette only (accent, fg, muted)
Size: icons 20-28px / decorative 80-200px / hero 200-400px
```

### 7.2 Commonly Used SVG Paths

```html
<!-- Checkmark -->
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
<!-- Arrow -->
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
<!-- Lightbulb -->
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0018 8 6 6 0 006 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 018.91 14"/></svg>
<!-- Trending Up -->
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
<!-- Calendar -->
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
<!-- Code -->
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
<!-- Rocket -->
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/></svg>
```

### 7.3 External SVG Resources

When built-in paths are insufficient, search below, inline the SVG, and replace colors with brand palette:

| Site | URL | Features |
|---|---|---|
| **Lucide** | lucide.dev | 1400+ line icons, MIT, most recommended |
| **Tabler Icons** | tabler.io/icons | 5000+, stroke-based |
| **SVG Repo** | svgrepo.com | 500K+, many free for commercial use |
| **unDraw** | undraw.co/illustrations | Flat illustrations, color customizable |

### 7.4 Hero Illustration Rules

When creating large SVGs: combine basic shapes, max 10 paths, abstract representation, accent + opacity variations.

### 7.5 Prohibited

- Emoji absolutely prohibited
- No realistic depiction (faces, hands)
- No more than 15 paths
- No external SVG file references (inline only)
- No SVG without viewBox

---

## 8. Anti-Slop Guidelines

### Common failure patterns in AI-generated design:

1. **Addition addiction**: AI tries to fill empty space. Professional designers remove. Every time you want to add an element, remove one instead.

2. **The "safe choice" trap**: Inter, Roboto, Arial are not "safe" but "thoughtless." Purple gradient on white background is the default of 2023 AI demos.

3. **Timid color distribution**: distributing all colors equally at 33% each destroys visual hierarchy. One color dominates (70%+), accent is sharp (10% or less).

4. **Predictable layouts**: making every slide center-aligned + rounded cards + shadows turns card news into a UI component demo.

5. **Uniform values**: padding all 24px, border-radius all 12px, gap all 16px. This is not a system, it is laziness. Apply intentional variation.

6. **Excessive decoration**: corner ornaments, dot indicators, glow effects, gradient borders. If decoration interferes with the message, remove it.

### Signs of good design:

- Empty space feels intentional, not anxious
- Message is readable within 3 seconds
- Font weight variation creates visual rhythm
- Few colors but memorable
- A unique mood that fits the content

---

## 9. CSS Technical Rules

### 9.1 Required Reset

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.slide {
  width: 1080px;
  height: 1080px;      /* or 1350px for portrait */
  overflow: hidden;
  position: relative;
}
```

### 9.2 Layout Patterns

```css
/* Basic content centering — absolute+transform method */
.slide {
  width: 1080px;
  height: 1080px;
  position: relative;
  overflow: hidden;
}

.content {
  position: absolute;
  top: 50%;
  left: 80px;
  right: 80px;
  transform: translateY(-50%);
}

/* Internal spacing: margin-bottom on each element */
.content > * + * {
  margin-top: 24px;  /* Or use margin-bottom on each element individually */
}

/* 2-column comparison layout — inside .content */
.comparison {
  display: flex;
  flex-direction: row;
  gap: 2px;                  /* Acts as column divider */
}

.comparison-col {
  flex: 1;
  padding: 0 48px;
}
```

### 9.3 Responsive Text (Within Canvas)

Text size adjustment based on length is determined at HTML generation time, not via CSS.
Claude analyzes text length and applies the appropriate font-size class.

```css
.title-short { font-size: 72px; }   /* 8 chars or fewer */
.title-medium { font-size: 52px; }  /* 9-16 chars */
.title-long { font-size: 40px; }    /* 17+ chars */
```

### 9.4 Google Fonts Loading

```css
@import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
```

The first `@import` must be placed at the very top of the `<style>` tag.
Limit font loading to a maximum of 2 families.

---

## 10. Brand Application Rules

When brand information is provided for card news generation:

1. **Declare brand colors as CSS variables**
```css
:root {
  --brand-primary: #...;
  --brand-secondary: #...;
  --brand-accent: #...;
}
```

2. **Brand mark placement**: place on first slide (cover) and last slide (CTA). On middle slides, omit or keep small and unobtrusive.

3. **Reflect brand tone**: if the brand is conservative, consider mixing serif. If the brand is active, maximize weight contrast.

4. **When no brand info is provided**: Claude selects colors and tone optimized for the content topic. Do not fall back to defaults — make content-optimized choices.

---

## 11. Color Palette Reference

> All combinations meet WCAG AA 4.5:1 contrast ratio or higher.
> bg = background, fg = foreground (text), accent = accent color.

### 11.1 Dark Tones

| Tone | bg | fg | accent | Use case |
|---|---|---|---|---|
| Tech/Dark | `#0F172A` | `#F8FAFC` | `#3B82F6` | IT, SaaS, developer content |
| Premium Dark | `#18181B` | `#FAFAFA` | `#A78BFA` | Luxury, premium services |
| Deep Navy | `#0C1222` | `#E2E8F0` | `#22D3EE` | Data, analytics, reports |
| Dark Forest | `#0A1F1A` | `#F0FDF4` | `#4ADE80` | ESG, eco-friendly, sustainability |

**Dark tone gradient variations:**
- `linear-gradient(135deg, #0F172A 0%, #1E293B 100%)` — subtle depth
- `linear-gradient(180deg, #18181B 0%, #27272A 100%)` — brightening toward bottom

### 11.2 Light Tones

| Tone | bg | fg | accent | Use case |
|---|---|---|---|---|
| Tech/Light | `#F8FAFC` | `#0F172A` | `#2563EB` | Tech blogs, startups |
| Minimal/Modern | `#FAFAFA` | `#171717` | `#A855F7` | Design, lifestyle |
| Warm White | `#FFFBF5` | `#292524` | `#D97706` | Food, cafe, lifestyle |
| Cool Gray | `#F1F5F9` | `#1E293B` | `#0EA5E9` | News, information, education |

### 11.3 Brand Tone Specialized

| Tone | bg | fg | accent | Use case |
|---|---|---|---|---|
| Finance/Trust | `#FFFFFF` | `#1E293B` | `#0D9488` | Finance, investment, wealth |
| Emotional/Warm | `#FFF7ED` | `#431407` | `#EA580C` | Essays, emotional content |
| Health/Energy | `#ECFDF5` | `#064E3B` | `#10B981` | Health, fitness, wellness |
| Creative | `#FDF4FF` | `#3B0764` | `#D946EF` | Art, design, creative |

### 11.4 Dangerous Color Combinations (Absolutely Prohibited)

| Combination | Problem | Contrast ratio |
|---|---|---|
| `#FFFFFF` bg + `#94A3B8` fg | Insufficient contrast — text unreadable | 2.8:1 |
| `#FBBF24` bg + `#FFFFFF` fg | Light bg + light text | 1.3:1 |
| `#EF4444` bg + `#3B82F6` fg | Complementary clash — eye strain | 2.1:1 |
| `#8B5CF6` bg + `#EC4899` fg | Saturation overload — visual fatigue | 2.4:1 |
| `#F3F4F6` bg + `#D1D5DB` fg | Gray on gray — ghost text | 1.5:1 |

**General rules:**
- When using gray text on light backgrounds, only allow values darker than `#64748B` (contrast 4.6:1)
- Do not use two highly saturated colors simultaneously as foreground/background
- For finance content, red/blue must follow the Korean finance convention in section 4.4

---

## 12. CSS Implementation Patterns

> These are **actual CSS code** patterns that complement the ASCII diagrams in Section 5.
> Claude uses these as starting points and adjusts based on content.
>
> **Key rule: padding, margin, and gap must all use `%` units.**
> Absolute values (px) are only used for font-size, border, and width/height (the 1080px canvas itself).
> Reason: cumulative absolute margins break centering depending on content volume.

### 12.1 Cover (Hook)

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

### 12.2 Body

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

### 12.3 List

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

.list-content {
  /* No flexbox needed — use margin-bottom */
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

### 12.4 Stats/Data

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

### 12.5 Quote

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

### 12.6 Comparison

```css
.slide {
  width: 1080px;
  height: 1080px;
  overflow: hidden;
  position: relative;
  background: var(--bg);
  color: var(--fg);
}

/* Comparison uses two absolutely positioned columns */
.compare-col-left {
  position: absolute;
  top: 50%;
  left: 80px;
  right: 544px; /* Half of 1080 + 4px gap */
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
```

**Comparison layout border handling:**
```css
/* Use an absolutely positioned divider between columns */
.compare-divider {
  position: absolute;
  top: 15%;
  bottom: 15%;
  left: 540px; /* Center of 1080px */
  width: 1px;
  background: var(--accent);
  opacity: 0.15;
}
```

### 12.7 CTA (Call to Action)

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

## 13. Golden Example

> Below is a completed HTML for a cover slide.
> This is the baseline and quality bar for "what good card news looks like."
> Claude treats this level as the minimum standard.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1080">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700;800;900&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    html, body { width: 1080px; height: 1080px; overflow: hidden; }

    .slide {
      width: 1080px;
      height: 1080px;
      position: relative;
      background: #0F172A;
      color: #F8FAFC;
      font-family: 'Pretendard', -apple-system, sans-serif;
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
      top: 48px;
      left: 80px;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 0.08em;
      color: #3B82F6;
      text-transform: uppercase;
    }

    .eyebrow {
      font-size: 20px;
      font-weight: 500;
      letter-spacing: 0.04em;
      color: #3B82F6;
      margin-bottom: 24px;
    }

    .title {
      font-size: 64px;
      font-weight: 800;
      letter-spacing: -0.02em;
      line-height: 1.2;
      word-break: keep-all;
      max-width: 780px;
      margin-bottom: 32px;
    }

    .title .accent {
      color: #3B82F6;
    }

    .subtitle {
      font-size: 26px;
      font-weight: 400;
      line-height: 1.5;
      word-break: keep-all;
      color: #94A3B8;
      max-width: 600px;
    }

    .bottom-line {
      position: absolute;
      bottom: 76px;
      left: 80px;
      width: 64px;
      height: 3px;
      background: #3B82F6;
      border-radius: 2px;
    }
  </style>
</head>
<body>
  <div class="slide">
    <div class="brand-mark">INSIGHT LAB</div>
    <div class="content">
      <div class="eyebrow">2026 트렌드 리포트</div>
      <h1 class="title">AI가 바꾸는<br><span class="accent">일하는 방식</span>의 미래</h1>
      <p class="subtitle">당신의 업무 루틴이 근본적으로 달라지기까지, 이제 6개월 남았다</p>
    </div>
    <div class="bottom-line"></div>
  </div>
</body>
</html>
```

**Principles demonstrated by this example:**
- **60%+ whitespace**: content concentrated at left-center, ample empty space on right and top/bottom
- **4 levels of font weight**: 800 (title), 600 (brand), 500 (eyebrow), 400 (subtitle)
- **3 colors**: `#0F172A` (bg dominates 70%+), `#F8FAFC` (fg), `#3B82F6` (accent under 10%)
- **Differentiated letter-spacing**: title `-0.02em`, brand `0.08em`, eyebrow `0.04em`
- **Contrast met**: `#F8FAFC` on `#0F172A` = 17.3:1, `#3B82F6` on `#0F172A` = 5.3:1, `#94A3B8` on `#0F172A` = 5.5:1
- **word-break: keep-all**: applied to all Korean text
- **Visual center correction**: `padding-bottom: 9%` > `padding-top: 7%` — percentage-based centering independent of content volume
- **Minimal decoration**: a single thin bottom line is the only decorative element

### 13.2 Golden Example — Data/Stats Slide

> A slide where numbers are the core message. Shows a completely different spatial composition from the cover.
> Hero number placed at bottom-right shifts the center of gravity, while label and context start from top-left.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1080">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700;800;900&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700;800&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      width: 1080px;
      height: 1080px;
      overflow: hidden;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 7.5% 7.5% 6.5% 7.5%; /* Percentage-based — maintains diagonal composition with space-between */
      background: #0F172A;
      color: #F8FAFC;
      font-family: 'Pretendard', -apple-system, sans-serif;
    }

    .top-block {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 1.5%; /* Internal element spacing as percentage */
      max-width: 520px;
    }

    .category {
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 0.06em;
      color: #3B82F6;
      text-transform: uppercase;
    }

    .context-heading {
      font-size: 32px;
      font-weight: 700;
      letter-spacing: -0.01em;
      line-height: 1.35;
      word-break: keep-all;
    }

    .context-body {
      font-size: 22px;
      font-weight: 400;
      line-height: 1.618;
      word-break: keep-all;
      color: #94A3B8;
      max-width: 460px;
    }

    .bottom-block {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 1%; /* Spacing between label-number-source as percentage */
    }

    .stat-label {
      font-size: 20px;
      font-weight: 500;
      letter-spacing: 0.04em;
      color: #3B82F6;
    }

    .stat-number {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 140px;
      font-weight: 800;
      letter-spacing: -0.04em;
      line-height: 0.9;
    }

    .stat-number .unit {
      font-size: 56px;
      font-weight: 500;
      letter-spacing: -0.02em;
      vertical-align: baseline;
    }

    .stat-footnote {
      font-size: 18px;
      font-weight: 400;
      color: #64748B;
      letter-spacing: 0.02em;
    }

    .accent-line {
      position: absolute;
      top: 7.5%;
      right: 7.5%;
      width: 48px;
      height: 3px;
      background: #3B82F6;
      border-radius: 2px;
    }
  </style>
</head>
<body>
  <div class="accent-line"></div>
  <div class="top-block">
    <div class="category">시장 분석</div>
    <h2 class="context-heading">국내 AI SaaS 시장이<br>전년 대비 폭발적으로 성장했다</h2>
    <p class="context-body">2025년 기준 기업 도입률이 역대 최고치를 기록하며 시장 판도가 바뀌고 있다</p>
  </div>
  <div class="bottom-block">
    <div class="stat-label">YoY Growth</div>
    <div class="stat-number">78<span class="unit">%</span></div>
    <div class="stat-footnote">Source: KDB산업은행 리서치 2025</div>
  </div>
</body>
</html>
```

**Principles demonstrated by this example:**
- **Diagonal composition**: text at top-left, number at bottom-right — completely different spatial composition from the cover's left-center layout
- **justify-content: space-between**: pushes elements to top and bottom, creating massive central whitespace. 60%+ whitespace maintained
- **Hero number 140px**: 6x+ larger than body (22px). Number visually dominates and message is delivered instantly
- **Space Grotesk + Pretendard pairing**: geometric font for English numbers, Pretendard for Korean — role separation
- **5 levels of font weight**: 800 (number), 700 (heading), 600 (category), 500 (label/unit), 400 (body/source)
- **Right-aligned numbers**: right alignment is allowed for stats/data, creates visual tension with top-left text
- **Accent line position change**: cover has it at bottom, here at top-right — variation by placing the same element differently
- **Source attribution**: 14-18px, low-contrast source text establishes credibility

### 13.3 Golden Example — List Slide

> A slide listing 3 items. Unlike the cover (left-center focus) or data (diagonal contrast),
> this uses an asymmetric 2-column structure with a narrow number column on the left and a wide content area on the right.
> Items are not wrapped in boxes — structure is created through whitespace and typography alone.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1080">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700;800;900&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    html, body { width: 1080px; height: 1080px; overflow: hidden; }

    .slide {
      width: 1080px;
      height: 1080px;
      position: relative;
      background: #0F172A;
      color: #F8FAFC;
      font-family: 'Pretendard', -apple-system, sans-serif;
    }

    .content {
      position: absolute;
      top: 50%;
      left: 80px;
      right: 80px;
      transform: translateY(-50%);
    }

    .slide-label + .list-items { margin-top: 48px; }

    .slide-label {
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 0.06em;
      color: #3B82F6;
      text-transform: uppercase;
    }

    .list-items {
      display: flex;
      flex-direction: column;
      gap: 4%; /* Item spacing as percentage */
      width: 100%;
    }

    .list-item {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: 3%; /* Spacing between number and content as percentage */
    }

    .item-number {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 48px;
      font-weight: 700;
      line-height: 1.0;
      color: #3B82F6;
      min-width: 64px;
      opacity: 0.7;
    }

    .item-content {
      display: flex;
      flex-direction: column;
      gap: 0.7%;
    }

    .item-label {
      font-size: 28px;
      font-weight: 600;
      line-height: 1.35;
      word-break: keep-all;
      letter-spacing: -0.01em;
    }

    .item-desc {
      font-size: 21px;
      font-weight: 400;
      line-height: 1.618;
      word-break: keep-all;
      color: #94A3B8;
      max-width: 680px;
    }

    .divider-thin {
      width: 100%;
      height: 1px;
      background: #F8FAFC;
      opacity: 0.06;
    }

    .bottom-note {
      position: absolute;
      bottom: 5%;
      left: 7.5%;
      font-size: 16px;
      font-weight: 500;
      letter-spacing: 0.04em;
      color: #64748B;
    }
  </style>
</head>
<body>
  <div class="content-group">
    <div class="slide-label">핵심 전략</div>
    <div class="list-items">
    <div class="list-item">
      <div class="item-number">01</div>
      <div class="item-content">
        <div class="item-label">워크플로우 자동화부터 시작한다</div>
        <div class="item-desc">반복 업무를 먼저 AI에게 위임하면 팀 전체의 시간이 확보된다. 가장 빠른 ROI가 여기서 나온다.</div>
      </div>
    </div>
    <div class="list-item">
      <div class="item-number">02</div>
      <div class="item-content">
        <div class="item-label">데이터 파이프라인을 내재화한다</div>
        <div class="item-desc">외부 의존도를 낮추고 자체 데이터 인프라를 구축해야 AI 역량이 지속가능하다.</div>
      </div>
    </div>
    <div class="list-item">
      <div class="item-number">03</div>
      <div class="item-content">
        <div class="item-label">측정 지표를 재정의한다</div>
        <div class="item-desc">생산성이 아닌 산출물의 품질로 성과를 측정한다. 시간 투입량은 더 이상 KPI가 아니다.</div>
      </div>
    </div>
    </div>
    <div class="divider-thin"></div>
  </div>
  <div class="bottom-note">3 / 7</div>
</body>
</html>
```

**Principles demonstrated by this example:**
- **Asymmetric 2-column**: narrow number area (64px) and wide content area — intentional asymmetry, not equal division
- **Numbers as design elements**: Space Grotesk 48px enlarges numbers into rhythm elements. Not simple bullets
- **Structure without boxes**: items are not wrapped in cards/boxes — separated by gap (4%) and typography alone
- **Number opacity 0.7**: numbers are visible but one step behind content — fine-tuning of visual hierarchy
- **4 levels of font weight**: 700 (numbers), 600 (label/slide label), 500 (bottom note), 400 (description)
- **Bottom divider + page number**: extremely thin line (opacity 0.06) gives a sense of position within the carousel
- **Whitespace creates structure**: 4.5% between top label and first item, 4% between items, bottom margin — all different percentage-based spacings
- **Contrast with cover/data**: cover is left-center focus, data is diagonal contrast, list is vertical rhythm repetition

### 13.4 Golden Example — CTA/Closing Slide

> The last slide of a carousel. After all information has been delivered, drives action with a single message.
> Full center alignment expresses the static energy of "conclusion,"
> a completely different spatial composition from cover (left-aligned), data (diagonal), and list (vertical rhythm).

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1080">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700;800;900&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    html, body { width: 1080px; height: 1080px; overflow: hidden; }

    .slide {
      width: 1080px;
      height: 1080px;
      position: relative;
      background: linear-gradient(180deg, #0F172A 0%, #162032 100%);
      color: #F8FAFC;
      font-family: 'Pretendard', -apple-system, sans-serif;
    }

    .content {
      position: absolute;
      top: 50%;
      left: 80px;
      right: 80px;
      transform: translateY(-50%);
      text-align: center;
    }

    .accent-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #3B82F6;
    }

    .cta-heading {
      font-size: 48px;
      font-weight: 700;
      letter-spacing: -0.02em;
      line-height: 1.3;
      word-break: keep-all;
      max-width: 680px;
    }

    .cta-heading .highlight {
      color: #3B82F6;
    }

    .cta-sub {
      font-size: 24px;
      font-weight: 400;
      line-height: 1.618;
      word-break: keep-all;
      color: #94A3B8;
      max-width: 520px;
    }

    .divider-center {
      width: 40px;
      height: 2px;
      background: #3B82F6;
      border-radius: 1px;
      opacity: 0.6;
    }

    .handle {
      font-size: 20px;
      font-weight: 600;
      letter-spacing: 0.06em;
      color: #3B82F6;
    }

    .brand-bottom {
      position: absolute;
      bottom: 4.5%;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0.08em;
      color: #F8FAFC;
      opacity: 0.3;
      text-transform: uppercase;
    }

    .corner-marks {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    .corner-marks::before,
    .corner-marks::after {
      content: '';
      position: absolute;
      width: 32px;
      height: 32px;
      border: 1px solid #3B82F6;
      opacity: 0.12;
    }

    .corner-marks::before {
      top: 4.5%;
      left: 4.5%;
      border-right: none;
      border-bottom: none;
    }

    .corner-marks::after {
      bottom: 4.5%;
      right: 4.5%;
      border-left: none;
      border-top: none;
    }
  </style>
</head>
<body>
  <div class="corner-marks"></div>
  <div class="content-group">
    <div class="accent-dot"></div>
    <h2 class="cta-heading">지금이 <span class="highlight">전환점</span>이다</h2>
    <p class="cta-sub">AI를 도입한 기업과 그렇지 않은 기업의 격차는 매 분기 벌어지고 있다. 다음 분기에 시작하면 이미 늦다.</p>
    <div class="divider-center"></div>
    <div class="handle">@insight.lab</div>
  </div>
  <div class="brand-bottom">Insight Lab</div>
</body>
</html>
```

**Principles demonstrated by this example:**
- **Full center alignment**: align-items: center + text-align: center — a composition only allowed for CTA/conclusion slides
- **Contrast with cover**: cover is left-aligned for "beginning" energy, CTA is center-aligned for "conclusion" static energy
- **Subtle gradient background**: `#0F172A` to `#162032` vertical gradient adds depth beyond solid color. 2-color limit respected
- **Decorative restraint**: corner marks (opacity 0.12) and accent dot only. Framing effect without excessive decoration
- **Vertical rhythm**: dot, heading, sub, divider, handle, brand — uniform rhythm with content-group gap: 2.5%, brand separated via absolute
- **4 levels of font weight**: 700 (CTA heading), 600 (handle), 500 (brand), 400 (subtext)
- **Color tone separation**: `#F8FAFC` (CTA heading), `#3B82F6` (highlight/handle), `#94A3B8` (supporting), `rgba(#F8FAFC, 0.3)` (brand) — same 3 colors but 4-level hierarchy via opacity
- **Spatial composition comparison across 4 slides**:
  - Cover (13.1): left-center focus, right whitespace — "entrance"
  - Data (13.2): top-left to bottom-right diagonal — "impact"
  - List (13.3): vertical rhythm repetition, left-aligned — "information delivery"
  - CTA (13.4): full center, symmetrical — "conclusion/action"
