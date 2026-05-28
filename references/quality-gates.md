# Quality Gates — Hard Limits (NON-NEGOTIABLE)

These are not advisory caps. They are enforced ceilings. If the user's topic does not fit within them, **split it, drop content, or reject the topic as too dense for a single carousel** — do not exceed.

Hard limits exist because real text rendering at 1080×1080 fails predictably above them: lines wrap, overflow happens silently, and the PNG ships broken.

---

## 1. Per Card Role — Character Caps

Korean characters count as 2 (CJK width). Counts below are total visible characters including spaces, excluding punctuation if borderline.

| Role | Hero / Body cap | Notes |
|---|---|---|
| `cover` | 60 chars total (≈ 8 English words / 16 Korean chars) | One headline only. No subhead unless ≤ 20 chars. |
| `statement` | 40 chars | One sentence. No supporting body. |
| `detail` | title 30 chars + body 80 chars | Total stays under 110. Split into two slides if longer. |
| `list` | 5 items max, each 30 chars | 6+ items → split into two list slides. |
| `quote` | quote 60 chars + attribution 20 chars | Long quotes get truncated with ellipsis or rejected. |
| `data` | 1 number + context 30 chars | Number can be large (e.g., "97%"); supporting text stays tight. |
| `comparison` | 2 blocks × 30 chars each | Symmetric — both sides same cap. |
| `cta` | action line 40 chars + handle/brand | One action only. No simultaneous follow + save + share. |

### What "doesn't fit" means

When the user provides content that exceeds a cap:

1. **Split** — break one slide into two of the same role (e.g., 8-item list → two 4-item slides).
2. **Drop** — pick the most important fragment; explicitly note what was dropped in your response.
3. **Reject** — if the topic genuinely needs 1500 words, tell the user "this is a blog post, not a carousel" and ask them to narrow the angle.

Never silently truncate to satisfy a cap. The user must know.

---

## 2. Series Structural Limits

| Limit | Value | Rationale |
|---|---|---|
| Default slide count | 5–7 | Instagram carousel sweet spot. |
| Maximum slide count | 10 | Past 10, swipe fatigue kills retention. |
| Cover position | Slide 1 only | Cover is always first. No exceptions. |
| CTA position | Last slide only | CTA never appears mid-carousel. |
| Consecutive `detail` slides | Max 3 in a row | 4+ → insert `statement`, `data`, or `quote` to break rhythm. |
| Same role repetition | A role cannot appear 3 times consecutively | E.g., `list → list → list` is forbidden. |
| Alignment runs | Max 3 consecutive slides with the same alignment | Break with a center-aligned slide between left runs. |

---

## 3. Visual / CSS Hard Limits

| Limit | Value |
|---|---|
| Distinct colors per slide | Max 3 (background + foreground + accent) |
| Font families per series | 1 family (display + body can be the same family at different weights) |
| Font weights used per series | Minimum 2 distinct weights; avoid using only 400 and 700 |
| Line-height (body) | ≥ 1.4 |
| Line-height (headings) | ≥ 1.2 |
| Minimum body font-size | 28px |
| Maximum hero number size | 320px (anything bigger overflows .content) |

---

## 4. Enforcement Order

When generating a series, apply gates in this order:

1. **Before copywriting**: count slides, assign roles, verify structural limits (#2).
2. **During copywriting**: enforce character caps per role (#1). If exceeded, split/drop/reject before writing HTML.
3. **During HTML generation**: enforce visual limits (#3). Define the color palette and font weights once for the series; reuse.
4. **At self-verification**: cross-check the full carousel against every gate. Any violation → fix before rendering.
5. **At render time**: `scripts/render.js` auto-detects bounding-box overflow and retries with a 10% scale-down (max 2 retries). This is a safety net, not a license to overshoot caps.

---

## 5. When in Doubt

The bias is **always toward less content**, not more. A card news that says one thing clearly beats one that says five things partially. If you cannot decide whether to include a slide, drop it.

---

## See also

- [`content-principles.md`](./content-principles.md) — voice, hook patterns,
  narrative frameworks, Korean copywriting style. Quality gates enforce limits;
  content-principles shapes the voice within them.
