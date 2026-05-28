# Layout & Slide Sequence

> Layout decides whether the message lands or drowns. The rules below prevent
> the two failure modes that destroy card news: cramped slides (no whitespace,
> 5+ elements competing) and top-heavy slides (content clustered up top, dead
> space below). One slide = one message. Whitespace is intentional, not leftover.

## 1. Core Principle

**1 slide = 1 message.** If a single slide tells two stories, split it.

## 2. Space Allocation

```
Total canvas: 100%
├── Content area: max 40%
└── Whitespace: min 60%
```

- **Padding**: 54–86px (5–8% of canvas width)
- **Safe zone**: core content within the center 80% (10% margin per side
  = 108px at 1080px canvas)
- **Element spacing**: follow the rhythm table below

### Spacing Rhythm Table (margin-bottom values)

| After this element | margin-bottom | Why |
|---|---|---|
| Label / eyebrow | 20–24px | Tight — belongs to the heading below |
| Heading / title | 28–36px | Breathing room after heavy visual element |
| Divider line | 32–40px | Dividers need space on BOTH sides |
| Body paragraph | 24–28px | Comfortable reading rhythm |
| Last body before section break | 40–48px | Section break needs a visible gap |
| List item | 28–36px | Enough to separate without boxes |
| Quote text | 36–44px | Quotes need generous surrounding space |
| CTA heading | 24–28px | Keep action close to supporting text |

**Key rule: spacing must NOT be uniform.** If every margin-bottom is 24px,
the slide looks mechanical. Vary spacing for visual rhythm — tight after
labels, generous after headings, extra generous between sections.

## 3. Element Density

Maximum **5 visual elements** per slide. One "element" =
- 1 text block, 1 icon, 1 divider, 1 brand mark, 1 data viz, ...

If you exceed 5, remove. Removing always beats adding.

## 4. Alignment Rules

Default: **left-aligned** (`text-align: left`).

Center alignment is allowed when:
- All text lines are similar in length (within ±20%)
- Hero number displayed alone
- CTA slide
- Quotation
- Single-line title

Right alignment is allowed only for number/stat labels and source attribution.

**Korean body text of 3+ lines must always be left-aligned. No exceptions.**

## 5. Vertical Placement

Center content on the canvas. The visual center sits slightly above the
mathematical center — but the bottom must not be completely empty.

**The mandated centering pattern** (see [`canvas.md`](./canvas.md) for full
detail): `.slide` is `position: relative`, `.content` is
`position: absolute; top: 50%; transform: translateY(-50%)`.

Flexbox `justify-content: center` is forbidden — it drifts whenever padding
or content volume changes.

**Rules:**
- `.slide`: `position: relative` (no flexbox, no justify-content)
- `.content`: absolute + `top: 50%` + `left: 80px` + `right: 80px` + `translateY(-50%)`
- Internal spacing: `margin-bottom` on each element (not flexbox gap)
- Decorations (brand marks, page numbers): inside `.slide`, outside `.content`
- Content width: 920px

**Prohibited:** content clustered at the top with the bottom third empty.

## 6. Slide Sequence

### 6.1 Narrative Structure

```
Hook → Context → Value Delivery → Summary → CTA
```

Example (5-slide carousel):

1. **Hook** — "How AI is reshaping the way we work"
2. **Context** — "Why average adoption is still low"
3. **Value** — "Three concrete strategies"
4. **Value** — "Real-world numbers"
5. **CTA** — "Where to start this week"

See [`content-principles.md`](./content-principles.md) for hook patterns,
narrative frameworks (Hook→Value→CTA, PAS, BAB), and copywriting voice.

### 6.2 Visual Consistency

Maintain across the entire carousel:

- **Same**: font family, color palette, padding values, brand mark position
- **Vary**: layout pattern (never the same layout on every slide), subtle
  background brightness/tone shifts

**Exception:** if the brand's established surface mode is a single light
color (e.g., `#FAFAFA`), uniform backgrounds are acceptable. The variation
rule applies primarily to dark themes where subtle gradient shifts add depth.
For light themes, variation comes from layout and typography, not background.

### 6.3 Independence + Connectivity

Each slide must be:

- **Independent** — makes sense viewed in isolation
- **Connected** — shares the same visual language (color, font, spacing)
- **Sequential** — implies order via numbering, progress indicators, or
  narrative flow

## 7. Anti-Examples

**Top-heavy layout — wrong:**

```css
/* WRONG — content piled at top, bottom half empty */
.content { position: absolute; top: 80px; left: 80px; right: 80px; }
```

**Uniform spacing — wrong:**

```css
/* WRONG — every element gets the same margin, no rhythm */
.eyebrow,
.heading,
.divider,
.body { margin-bottom: 24px; }
```

**Right — varied rhythm:**

```css
.eyebrow { margin-bottom: 22px; }   /* tight: belongs to heading */
.heading { margin-bottom: 32px; }   /* breathing room */
.divider { margin-bottom: 36px; }   /* space on both sides */
.body    { margin-bottom: 24px; }   /* reading rhythm */
```

## See also

- [`canvas.md`](./canvas.md) for the centering CSS pattern
- [`card-types.md`](./card-types.md) for per-role layout patterns
- [`quality-gates.md`](./quality-gates.md) for structural carousel limits
  (slide count, alignment runs, consecutive role caps)
