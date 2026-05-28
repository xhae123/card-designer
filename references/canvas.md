# Canvas & CSS Foundation

> The canvas is fixed: 1080×1080 (or 1080×1350 portrait). Every slide is a
> self-contained HTML document with inline CSS, no JavaScript, and bulletproof
> vertical centering via `position: absolute + transform: translateY(-50%)`.
> Get this foundation wrong and nothing else matters — text overflows, fonts
> fall back to serif, and the PNG ships broken.

## 1. Canvas Specifications

- **Square**: `1080 × 1080px` (Instagram default)
- **Portrait**: `1080 × 1350px` (Instagram 4:5 ratio)
- `box-sizing: border-box` globally
- `overflow: hidden` required on the root element
- **No JavaScript.** Styles via inline `<style>` tag or inline `style` attributes.
- **Icons**: inline SVG only. Emoji is absolutely prohibited — rendering varies
  across OS and breaks under Puppeteer.
- **Fonts**: loaded via Google Fonts `@import`. The render script inlines them.

## 2. Required CSS Reset

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body { width: 1080px; height: 1080px; overflow: hidden; }

.slide {
  width: 1080px;
  height: 1080px;       /* or 1350px for portrait */
  overflow: hidden;
  position: relative;
}
```

## 3. Mandated Centering Pattern

Vertical centering uses `position: absolute + top: 50% + translateY(-50%)`.
This is the **only** correct method. Flexbox centering drifts whenever
content volume or padding changes; the absolute+transform method does not.

```css
/* Correct */
.slide {
  width: 1080px;
  height: 1080px;
  position: relative;     /* NO display:flex, NO justify-content:center */
}

.content {
  position: absolute;
  top: 50%;
  left: 80px;
  right: 80px;
  transform: translateY(-50%);
  /* For CTA / quote: add text-align: center; */
}

/* Internal spacing — margin-bottom on each element */
.heading   { margin-bottom: 28px; }
.body-text { margin-bottom: 24px; }
```

**Anti-example — do not do this:**

```css
/* WRONG — flexbox centering drifts with padding/content changes */
body { display: flex; justify-content: center; align-items: center; }

/* WRONG — flexbox gap for content spacing inside .content */
.content-group { display: flex; gap: 24px; }
```

**Rules:**
- `.slide` is `position: relative`. No flexbox on it.
- `.content` is absolutely positioned with the `top: 50% + translateY(-50%)` pair.
- Internal spacing lives in `margin-bottom` on each element.
- Decorations (brand marks, page numbers) are absolute-positioned inside
  `.slide` but outside `.content`.
- Content width = 1080 − 80 (left) − 80 (right) = **920px**.

## 4. Responsive Text Within the Canvas

Text size adjustment is determined at HTML generation time, not via CSS.
Analyze text length and apply the appropriate font-size class.

```css
.title-short  { font-size: 72px; }   /* 8 chars or fewer */
.title-medium { font-size: 52px; }   /* 9-16 chars */
.title-long   { font-size: 40px; }   /* 17+ chars */
```

## 5. Google Fonts Loading

```css
@import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
```

The first `@import` must be the very first line inside `<style>`. Limit to
**maximum 2 font families** per series.

## 6. SVG Illustration Guide

Inline SVG is the only mechanism for visual elements. Emoji is forbidden.

**Style rules:**
- Style: flat minimal (Lucide / Feather family)
- Stroke: `stroke-width="1.5"` to `2`, `stroke-linecap="round"`, `stroke-linejoin="round"`
- Fill: `fill="none"` by default. Filled areas use accent color + opacity only.
- Color: brand palette only (accent, fg, muted)
- Size: icons 20–28px / decorative 80–200px / hero 200–400px

**Common inline SVG paths** (copy-ready):

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

**External SVG sources** (inline, then re-color to brand palette):

| Site | URL | Notes |
|---|---|---|
| **Lucide** | lucide.dev | 1400+ line icons, MIT — most recommended |
| **Tabler Icons** | tabler.io/icons | 5000+, stroke-based |
| **SVG Repo** | svgrepo.com | 500K+, many free for commercial use |
| **unDraw** | undraw.co/illustrations | Flat illustrations, color customizable |

**Hero illustration rules:** combine basic shapes, max 10 paths, abstract
representation, accent + opacity variations.

**Prohibited:**
- Emoji (ever)
- Realistic faces or hands
- More than 15 paths
- External SVG file references (inline only)
- SVG without `viewBox`

## See also

- [`typography.md`](./typography.md) for size scale and font selection
- [`layout.md`](./layout.md) for the centering pattern in context
- [`card-types.md`](./card-types.md) for per-role CSS skeletons
