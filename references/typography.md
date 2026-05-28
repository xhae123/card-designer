# Typography

> Typography is the design system. Wrong size scale, lazy font choice, or a
> 400/700-only weight rotation marks the slide as AI slop instantly. The rules
> below produce visual hierarchy that survives the Instagram thumbnail and
> reads cleanly at full size.

## 1. Size Scale

| Role | Min | Default | Max | Weight |
|---|---|---|---|---|
| Hero number | 80px | 120px | 140px | 800–900 |
| Slide title (≤ 8 chars) | 48px | 64px | 80px | 700–800 |
| Slide title (> 8 chars) | 36px | 48px | 64px | 700 |
| Body heading | 28px | 32px | 40px | 600–700 |
| Body text | 24px | 28px | 32px | 400–500 |
| Caption / label | 16px | 20px | 24px | 500–600 |
| Source / watermark | 12px | 14px | 16px | 400 |

**Key ratios:** heading must be at least 1.5× body (max 2.5×). Hero number
must be at least 3× body.

**Adaptive sizing — size by length:**

- 1 line (1–8 chars): can go up to 64–80px
- 2 lines (9–20 chars): 48–64px
- 3+ lines: 32–48px
- Long paragraphs (50+ chars): 24–28px

## 2. Korean Typography Rules

```css
/* Headings (≥ 36px) — tighter than golden ratio for large text */
.heading {
  line-height: 1.3;
  letter-spacing: -0.02em;   /* Negative for large text */
  word-break: keep-all;      /* Required for Korean word-unit breaks */
}

/* Body (24–32px) — golden ratio applied */
.body {
  line-height: 1.618;        /* font-size × 1.618 */
  letter-spacing: 0;
  word-break: keep-all;
}

/* Labels / captions (≤ 20px) */
.caption {
  line-height: 1.5;
  letter-spacing: 0.04em;    /* Positive for small text */
  word-break: keep-all;
}
```

`word-break: keep-all` is mandatory on every Korean text element. Without it,
Korean breaks at the character level and the slide looks broken. The rule
remains correct guidance even when the rendered content is English — the
property does nothing harmful to Latin text and stays drop-in compatible.

## 3. Font Weight Diversity

**Prohibited:** using only 400 and 700. This is the single most common sign
of AI slop.

| Weight | Use for |
|---|---|
| 300 Light | Supporting text under large hero numbers, quotes |
| 400 Regular | Body text |
| 500 Medium | Emphasized body text, list item labels |
| 600 SemiBold | Subheadings, important labels, button text |
| 700 Bold | Slide titles |
| 800 ExtraBold | Cover titles, strong-impact moments |
| 900 Black | Hero numbers only |

Use **minimum 2, maximum 4** different weights per slide. Maximum **2 font
families** across the entire carousel.

## 4. Font Selection

**Prohibited fonts (AI slop signals):**
- Inter, Roboto, Arial, Helvetica — not "safe" choices, **lazy** choices.

**Recommended Korean fonts:**

- **Pretendard** — modern, clean default. Variable weight support.
- **Noto Sans KR** — versatile but always pair it with a second font.
- **SUIT** — Pretendard alternative, slightly softer.
- **Wanted Sans** — geometric and modern.

**Recommended English / numeric fonts** (hero numbers, statistics):

- **Space Grotesk** — geometric, impactful numbers.
- **DM Sans** — clean and distinctive.
- **Plus Jakarta Sans** — soft and modern.
- **Outfit** — rounded, friendly.

**Pairings by tone:**

| Content tone | Korean primary | Numeric/Latin pair |
|---|---|---|
| Finance / data | Pretendard | Space Grotesk |
| Lifestyle | SUIT | Plus Jakarta Sans |
| Tech / startup | Wanted Sans | DM Sans |

See [`font-presets.md`](./font-presets.md) for full `@import` URLs.

## 5. Anti-Slop Guidelines

Common failure patterns in AI-generated typography:

1. **The "safe choice" trap.** Inter / Roboto / Arial / Helvetica are not
   safe; they are thoughtless. Replace with Pretendard, SUIT, Wanted Sans.
2. **Two-weight rotation.** 400 + 700 only is the giveaway. Always include
   at least one of 500 / 600 / 800.
3. **Uniform letter-spacing.** Headings need negative tracking (−0.02em),
   captions need positive (+0.04em). Identical spacing across sizes flattens
   hierarchy.
4. **Hero number too small.** If the number is the message, it must be 3×+
   body. 60px hero numbers on 28px body is a presentation slide, not a card.
5. **Decoration over hierarchy.** Glow, gradient text, outlined letters —
   if the message is not legible in 3 seconds, the decoration lost.

**Signs of good typography:**

- Empty space around large type feels intentional, not anxious.
- The hierarchy is readable in the Instagram thumbnail (320px wide).
- 3–4 weights create rhythm without feeling busy.
- Font choice fits the content; nothing screams "free Google Fonts default."

**Anti-example — do not do this:**

```css
/* WRONG — only 400 and 700, lazy Inter, uniform letter-spacing */
body { font-family: 'Inter', sans-serif; }
.title { font-size: 48px; font-weight: 700; letter-spacing: 0; }
.body  { font-size: 28px; font-weight: 400; letter-spacing: 0; }
```

```css
/* RIGHT — Pretendard, 4 weights, differentiated tracking */
body { font-family: 'Pretendard', sans-serif; }
.eyebrow { font-size: 20px; font-weight: 500; letter-spacing: 0.04em; }
.title   { font-size: 56px; font-weight: 800; letter-spacing: -0.02em; }
.body    { font-size: 28px; font-weight: 400; letter-spacing: 0; line-height: 1.618; }
.label   { font-size: 18px; font-weight: 600; letter-spacing: 0.06em; }
```

## See also

- [`canvas.md`](./canvas.md) for Google Fonts loading and `@import` placement
- [`color.md`](./color.md) for text-on-gradient contrast rules
- [`font-presets.md`](./font-presets.md) for full preset URLs
