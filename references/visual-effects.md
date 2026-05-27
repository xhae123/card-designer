# Visual Effects — CSS & SVG Patterns for Card News

> Pure CSS/SVG techniques for visual richness. No external images needed.
> Every pattern is tested for Puppeteer headless Chrome rendering at 1080x1080px.
> Copy-paste ready. Each pattern is self-contained.

---

## 1. Halftone Dot Patterns

Halftone dots are a signature element of Korean card news design (멋쟁이사자처럼 style). They add texture and visual energy without competing with text.

### 1.1 Radial Halftone (dots growing from center outward)

```css
.halftone-radial {
  background:
    radial-gradient(circle, #000 1px, transparent 1px);
  background-size: 12px 12px;
  /* Layer with a radial mask so dots fade toward center */
  -webkit-mask-image: radial-gradient(
    ellipse at center,
    transparent 20%,
    black 70%
  );
  mask-image: radial-gradient(
    ellipse at center,
    transparent 20%,
    black 70%
  );
  opacity: 0.08;
}
```

```html
<!-- Usage: absolute-positioned overlay inside a container -->
<div style="position: relative; width: 1080px; height: 1080px; background: #FAFAFA;">
  <div class="halftone-radial" style="position: absolute; inset: 0;"></div>
  <!-- Content goes here, above the halftone layer -->
</div>
```

**Best for:** Cover slides, statement slides — adds subtle energy to large whitespace areas.

**Puppeteer note:** `mask-image` works in headless Chrome. Fully supported.

### 1.2 Linear Halftone (uniform dot grid)

```css
.halftone-linear {
  background:
    radial-gradient(circle, #000 1.2px, transparent 1.2px);
  background-size: 16px 16px;
  opacity: 0.06;
}
```

For a denser pattern (magazine print feel):

```css
.halftone-dense {
  background:
    radial-gradient(circle, #000 0.8px, transparent 0.8px);
  background-size: 8px 8px;
  opacity: 0.05;
}
```

**Best for:** Detail and list slides — subtle texture that doesn't distract from body text.

### 1.3 Corner Halftone (concentrated in corners)

```css
.halftone-corner-br {
  background:
    radial-gradient(circle, #000 1px, transparent 1px);
  background-size: 14px 14px;
  -webkit-mask-image: radial-gradient(
    ellipse at 100% 100%,
    black 0%,
    transparent 50%
  );
  mask-image: radial-gradient(
    ellipse at 100% 100%,
    black 0%,
    transparent 50%
  );
  opacity: 0.1;
}
```

Change the `at` position for different corners:
- Top-left: `at 0% 0%`
- Top-right: `at 100% 0%`
- Bottom-left: `at 0% 100%`
- Bottom-right: `at 100% 100%`

For multi-corner halftone (two opposite corners):

```css
.halftone-diagonal {
  background:
    radial-gradient(circle, #000 1px, transparent 1px);
  background-size: 14px 14px;
  -webkit-mask-image:
    radial-gradient(ellipse at 0% 0%, black 0%, transparent 40%),
    radial-gradient(ellipse at 100% 100%, black 0%, transparent 40%);
  -webkit-mask-composite: source-over;
  mask-image:
    radial-gradient(ellipse at 0% 0%, black 0%, transparent 40%),
    radial-gradient(ellipse at 100% 100%, black 0%, transparent 40%);
  mask-composite: add;
  opacity: 0.1;
}
```

**Best for:** CTA slides, cover slides — draws eye inward by framing corners.

### 1.4 Colored Halftone

Replace `#000` with any brand color for tinted dots:

```css
.halftone-accent {
  background:
    radial-gradient(circle, #FF6B35 1px, transparent 1px);
  background-size: 14px 14px;
  opacity: 0.12;
}
```

**Best for:** Accent areas, section dividers, behind accent-colored elements.

---

## 2. Pseudo-3D Objects with CSS/SVG

These create depth and visual interest — the "object on a surface" look common in premium Korean card news.

### 2.1 Glossy Pill / Capsule Shape

```css
.pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 40px;
  border-radius: 100px;
  background: linear-gradient(
    180deg,
    #FF8A5C 0%,
    #FF6B35 40%,
    #E55A2B 100%
  );
  box-shadow:
    0 4px 12px rgba(255, 107, 53, 0.4),
    0 1px 3px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    inset 0 -2px 4px rgba(0, 0, 0, 0.1);
  color: #fff;
  font-weight: 700;
  font-size: 24px;
  letter-spacing: -0.01em;
}
```

```html
<span class="pill">핵심 포인트</span>
```

For a blue variant:

```css
.pill-blue {
  background: linear-gradient(180deg, #5B9CF6 0%, #2F6FEB 40%, #1E5FD9 100%);
  box-shadow:
    0 4px 12px rgba(47, 111, 235, 0.4),
    0 1px 3px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.25),
    inset 0 -2px 4px rgba(0, 0, 0, 0.1);
}
```

**Best for:** Labels, tags, category badges on any slide type.

### 2.2 Floating Card / Folder

```css
.floating-card {
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 16px;
  transform: perspective(800px) rotateX(2deg) rotateY(-3deg);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.12),
    0 8px 20px rgba(0, 0, 0, 0.08),
    0 2px 6px rgba(0, 0, 0, 0.06);
  transition: none; /* no transitions needed for static render */
}
```

Stacked cards (depth illusion):

```css
.card-stack {
  position: relative;
  width: 400px;
  height: 500px;
}

.card-stack .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #E8E8E8;
  border-radius: 16px;
  transform: rotate(-4deg) translateY(8px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.card-stack .card-front {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 16px;
  transform: rotate(1deg);
  box-shadow:
    0 16px 48px rgba(0, 0, 0, 0.12),
    0 4px 12px rgba(0, 0, 0, 0.08);
}
```

```html
<div class="card-stack">
  <div class="card-back"></div>
  <div class="card-front">
    <!-- content -->
  </div>
</div>
```

**Best for:** Comparison slides, detail slides — shows information "on paper."

### 2.3 Paper Clip (SVG)

```html
<svg width="60" height="120" viewBox="0 0 60 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="clip-grad" x1="0" y1="0" x2="60" y2="120" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#C0C0C0"/>
      <stop offset="40%" stop-color="#E8E8E8"/>
      <stop offset="60%" stop-color="#A0A0A0"/>
      <stop offset="100%" stop-color="#D0D0D0"/>
    </linearGradient>
  </defs>
  <path d="M38 10 C38 5, 22 5, 22 10 L22 90 C22 102, 38 102, 38 90 L38 30 C38 22, 26 22, 26 30 L26 80"
        stroke="url(#clip-grad)"
        stroke-width="4"
        stroke-linecap="round"
        fill="none"/>
</svg>
```

**Best for:** Folder/document compositions, detail slides with a stationery metaphor.

### 2.4 Glossy Button / Badge

```css
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 35% 35%,
    #FFD93D 0%,
    #FFB800 50%,
    #E5A400 100%
  );
  box-shadow:
    0 6px 20px rgba(255, 184, 0, 0.4),
    0 2px 6px rgba(0, 0, 0, 0.1),
    inset 0 2px 4px rgba(255, 255, 255, 0.5),
    inset 0 -3px 6px rgba(0, 0, 0, 0.15);
  font-size: 32px;
  font-weight: 800;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}
```

```html
<div class="badge">1</div>
```

For a numbered list of badges, shift the hue per item:

```css
.badge-1 { background: radial-gradient(circle at 35% 35%, #FFD93D, #FFB800, #E5A400); }
.badge-2 { background: radial-gradient(circle at 35% 35%, #5BD4FF, #00B4E6, #0098C4); }
.badge-3 { background: radial-gradient(circle at 35% 35%, #FF7EB3, #FF4D8D, #E03A75); }
```

**Best for:** List slides with numbered items, data slides for ranking, step indicators.

### 2.5 Embossed / Debossed Surface

```css
/* Raised (embossed) element on a light surface */
.embossed {
  background: #F0F0F0;
  border-radius: 12px;
  box-shadow:
    4px 4px 10px rgba(0, 0, 0, 0.1),
    -4px -4px 10px rgba(255, 255, 255, 0.9);
}

/* Pressed in (debossed) — neumorphic inset */
.debossed {
  background: #F0F0F0;
  border-radius: 12px;
  box-shadow:
    inset 4px 4px 10px rgba(0, 0, 0, 0.1),
    inset -4px -4px 10px rgba(255, 255, 255, 0.9);
}
```

**Best for:** Light-themed detail/list slides. Use sparingly — full neumorphism looks dated, but selective use (e.g., a single stat card) adds depth.

**Puppeteer note:** All box-shadow and gradient rendering is fully supported.

---

## 3. Folder / Document Metaphor

A complete composition of folder + paper + paper clip — a common visual metaphor in Korean card news for "organized information."

### 3.1 Complete Folder Composition

```html
<div class="folder-comp" style="
  position: relative;
  width: 560px;
  height: 480px;
">
  <!-- Paper peeking from behind -->
  <div style="
    position: absolute;
    top: 20px;
    left: 30px;
    width: 480px;
    height: 400px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    transform: rotate(-1deg);
  ">
    <!-- Paper lines (ruled paper effect) -->
    <div style="
      position: absolute;
      top: 60px;
      left: 40px;
      right: 40px;
      bottom: 40px;
      background: repeating-linear-gradient(
        to bottom,
        transparent,
        transparent 31px,
        #E5E7EB 31px,
        #E5E7EB 32px
      );
    "></div>
  </div>

  <!-- Folder body -->
  <div style="
    position: absolute;
    bottom: 0;
    left: 0;
    width: 540px;
    height: 360px;
    background: linear-gradient(160deg, #FF8A5C 0%, #FF6B35 100%);
    border-radius: 0 20px 20px 20px;
    box-shadow:
      0 12px 40px rgba(255, 107, 53, 0.25),
      0 4px 12px rgba(0, 0, 0, 0.1);
  ">
    <!-- Folder tab -->
    <div style="
      position: absolute;
      top: -40px;
      left: 0;
      width: 180px;
      height: 40px;
      background: linear-gradient(160deg, #FF9A6C 0%, #FF7A45 100%);
      border-radius: 12px 12px 0 0;
    "></div>

    <!-- Content on the folder -->
    <div style="
      padding: 48px 40px;
      color: #fff;
    ">
      <!-- Your text content here -->
    </div>
  </div>

  <!-- Paper clip -->
  <svg style="position: absolute; top: -10px; right: 40px; transform: rotate(15deg);"
       width="48" height="100" viewBox="0 0 60 120" fill="none">
    <path d="M38 10 C38 5, 22 5, 22 10 L22 90 C22 102, 38 102, 38 90 L38 30 C38 22, 26 22, 26 30 L26 80"
          stroke="#C0C0C0"
          stroke-width="4.5"
          stroke-linecap="round"
          fill="none"/>
  </svg>

  <!-- Rotated label tag -->
  <div style="
    position: absolute;
    top: 60px;
    right: -20px;
    background: #FFD93D;
    color: #333;
    font-size: 18px;
    font-weight: 700;
    padding: 8px 24px;
    border-radius: 4px;
    transform: rotate(8deg);
    box-shadow: 0 3px 10px rgba(0,0,0,0.12);
  ">STEP 01</div>
</div>
```

### 3.2 Minimal Document Stack (lighter variant)

```css
.doc-stack {
  position: relative;
  width: 480px;
  height: 560px;
}

.doc-stack .doc-shadow {
  position: absolute;
  bottom: -4px;
  left: 12px;
  right: -4px;
  height: 100%;
  background: #E0E0E0;
  border-radius: 8px;
  transform: rotate(2deg);
}

.doc-stack .doc-main {
  position: absolute;
  inset: 0;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #E5E7EB;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  padding: 48px;
}
```

```html
<div class="doc-stack">
  <div class="doc-shadow"></div>
  <div class="doc-main">
    <!-- content -->
  </div>
</div>
```

**Best for:** Detail and list slides where you want to frame content as a "document."

### 3.3 Color Variants

Replace the orange gradient with brand-appropriate colors:

| Style | Gradient | Shadow color |
|---|---|---|
| Orange (default) | `#FF8A5C → #FF6B35` | `rgba(255, 107, 53, 0.25)` |
| Blue professional | `#5B9CF6 → #2F6FEB` | `rgba(47, 111, 235, 0.25)` |
| Green fresh | `#6DD5A0 → #34C77B` | `rgba(52, 199, 123, 0.25)` |
| Navy serious | `#374B6D → #1E293B` | `rgba(30, 41, 59, 0.25)` |
| Purple creative | `#A78BFA → #7C3AED` | `rgba(124, 58, 237, 0.25)` |

---

## 4. Decorative Backgrounds

### 4.1 Noise Texture (SVG Filter)

Adds film grain / paper texture to any background. Essential for avoiding the flat digital look.

```html
<svg style="position: absolute; width: 0; height: 0;">
  <filter id="noise">
    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
</svg>

<div style="
  position: absolute;
  inset: 0;
  filter: url(#noise);
  opacity: 0.04;
  pointer-events: none;
">
</div>
```

For coarser grain (more visible texture):

```html
<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/>
<!-- and increase opacity to 0.06-0.08 -->
```

For fine paper grain:

```html
<feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" stitchTiles="stitch"/>
<!-- opacity: 0.03 -->
```

**Best for:** Every slide. Subtle noise (opacity 0.03-0.05) makes any flat background feel premium. Use on both light and dark backgrounds.

**Puppeteer note:** SVG filters render correctly in headless Chrome. The `stitchTiles="stitch"` attribute prevents visible seams.

### 4.2 Gradient Mesh Approximation

True gradient mesh requires canvas, but we can approximate it with layered radial gradients:

```css
.gradient-mesh {
  background: #0F172A;
  position: relative;
}

.gradient-mesh::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(124, 58, 237, 0.4) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
    radial-gradient(ellipse at 60% 80%, rgba(236, 72, 153, 0.25) 0%, transparent 50%),
    radial-gradient(ellipse at 40% 30%, rgba(16, 185, 129, 0.15) 0%, transparent 40%);
}
```

```html
<div class="gradient-mesh" style="width: 1080px; height: 1080px; position: relative;">
  <div style="position: relative; z-index: 1;">
    <!-- Content on top of gradient mesh -->
  </div>
</div>
```

**Best for:** Cover slides on dark themes — creates visual depth behind minimal text. Statement slides.

### 4.3 Radial Glow / Spotlight

```css
/* Centered spotlight */
.spotlight-center {
  background:
    radial-gradient(
      circle at 50% 45%,
      rgba(255, 255, 255, 0.08) 0%,
      transparent 60%
    );
}

/* Top-left accent glow */
.spotlight-tl {
  background:
    radial-gradient(
      ellipse at 15% 15%,
      rgba(255, 107, 53, 0.15) 0%,
      transparent 50%
    );
}

/* Bottom-right warm glow */
.spotlight-br {
  background:
    radial-gradient(
      ellipse at 85% 85%,
      rgba(255, 184, 0, 0.1) 0%,
      transparent 50%
    );
}
```

Layer multiple spotlights for complex lighting:

```css
.multi-glow {
  background:
    radial-gradient(ellipse at 20% 30%, rgba(99, 102, 241, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 70%, rgba(244, 63, 94, 0.08) 0%, transparent 50%),
    #0F172A;
}
```

**Best for:** Dark theme backgrounds — prevents flat monotone. Great for cover and statement slides.

### 4.4 Grid Pattern Background

```css
/* Subtle grid */
.grid-bg {
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px);
  background-size: 40px 40px;
}

/* Grid with accent at intersections */
.grid-dots {
  background-image:
    radial-gradient(circle, rgba(0, 0, 0, 0.08) 1px, transparent 1px);
  background-size: 40px 40px;
}
```

For dark backgrounds, swap `rgba(0,0,0,...)` with `rgba(255,255,255,...)`:

```css
.grid-bg-dark {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 40px 40px;
}
```

**Best for:** Data slides, comparison slides — the graph paper feel suggests precision and structure.

### 4.5 Diagonal Stripe Pattern

```css
/* Thin diagonal stripes */
.stripes {
  background: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 10px,
    rgba(0, 0, 0, 0.03) 10px,
    rgba(0, 0, 0, 0.03) 11px
  );
}

/* Wider stripes (bolder look) */
.stripes-wide {
  background: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 20px,
    rgba(0, 0, 0, 0.04) 20px,
    rgba(0, 0, 0, 0.04) 24px
  );
}

/* Colored accent stripes (for small decorative areas) */
.stripes-accent {
  background: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 6px,
    rgba(255, 107, 53, 0.08) 6px,
    rgba(255, 107, 53, 0.08) 8px
  );
}
```

**Best for:** CTA slides, backgrounds for secondary content areas. Avoid on text-heavy slides.

### 4.6 Concentric Circle Pattern

```css
.concentric {
  background:
    repeating-radial-gradient(
      circle at 50% 50%,
      transparent 0px,
      transparent 38px,
      rgba(0, 0, 0, 0.03) 38px,
      rgba(0, 0, 0, 0.03) 40px
    );
}
```

**Best for:** Statement slides — radiating from center creates visual gravity. Layer behind centered text.

---

## 5. Glass / Frosted Effects

### 5.1 Glassmorphism Card

```css
.glass-card {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  padding: 48px;
}
```

```html
<!-- Glass REQUIRES a colorful/complex background behind it to be visible -->
<div style="
  width: 1080px; height: 1080px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex; align-items: center; justify-content: center;
">
  <div class="glass-card" style="width: 700px;">
    <h2 style="color: #fff; font-size: 48px;">Content here</h2>
  </div>
</div>
```

For dark glass:

```css
.glass-card-dark {
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}
```

**Best for:** Cover slides, statement slides — over gradient mesh or colorful backgrounds.

**Puppeteer note:** `backdrop-filter` is fully supported in headless Chrome (Chromium 76+). Always include the `-webkit-` prefix for safety.

### 5.2 Frosted Overlay (full-width)

```css
.frosted-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(40px) saturate(1.8);
  -webkit-backdrop-filter: blur(40px) saturate(1.8);
}
```

Use over a complex background (gradient mesh, image, or pattern) to create a subtle depth while keeping text readable.

**Best for:** Text-heavy slides that still need background interest. Layer order: background pattern, frosted overlay, text content.

### 5.3 Glass Pill Label

```css
.glass-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 100px;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}
```

**Best for:** Category tags, labels floating over dark/gradient backgrounds.

---

## 6. Text Effects

### 6.1 Gradient Text

```css
.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

```html
<h1 class="gradient-text" style="font-size: 72px; font-weight: 800;">
  핵심 키워드
</h1>
```

For gold gradient (premium feel):

```css
.text-gold {
  background: linear-gradient(135deg, #F5D17E 0%, #D4A947 50%, #F5D17E 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

**Best for:** Hero text on cover slides, single stat numbers on data slides. Avoid on body text.

**Puppeteer note:** `-webkit-background-clip: text` is fully supported. Always include both prefixed and unprefixed versions.

### 6.2 Outlined Text (Stroke)

```css
/* Method 1: -webkit-text-stroke (clean, simple) */
.text-outline {
  -webkit-text-stroke: 2px #333;
  -webkit-text-fill-color: transparent;
  font-size: 80px;
  font-weight: 800;
}

/* Method 2: Shadow-based outline (thicker, works everywhere) */
.text-outline-shadow {
  color: transparent;
  text-shadow:
    -2px -2px 0 #333,
     2px -2px 0 #333,
    -2px  2px 0 #333,
     2px  2px 0 #333;
  font-size: 80px;
  font-weight: 800;
}
```

For filled + outlined combo (text with visible stroke):

```css
.text-stroked {
  color: #fff;
  -webkit-text-stroke: 1.5px rgba(0, 0, 0, 0.3);
  font-size: 72px;
  font-weight: 800;
}
```

**Best for:** Cover titles, large display text. Outlined text works well layered behind filled text for a shadow/depth effect.

### 6.3 Highlighted / Marked Text

The black highlight box behind white text — signature Korean card news style:

```css
/* Inline highlight — mark-style */
.highlight-mark {
  display: inline;
  background: #111;
  color: #fff;
  padding: 4px 12px;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
  line-height: 2.0;
}
```

```html
<p style="font-size: 32px; font-weight: 700;">
  <span class="highlight-mark">이것이 핵심 메시지입니다</span>
</p>
```

For multi-line highlight with visible gaps between lines:

```css
.highlight-multiline {
  display: inline;
  background: #111;
  color: #fff;
  padding: 6px 16px;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
  line-height: 2.4; /* Wider gap between lines */
}
```

Colored highlight variants:

```css
.highlight-accent {
  background: #FF6B35;
  color: #fff;
  padding: 4px 12px;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}

.highlight-yellow {
  background: #FFD93D;
  color: #333;
  padding: 2px 8px;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}

/* Subtle underline-style highlight */
.highlight-underline {
  background: linear-gradient(to top, #FFD93D 30%, transparent 30%);
  padding: 0 4px;
}
```

**Best for:** Key phrases on any slide type. The black highlight box is a staple of Korean card news — use it for the single most important sentence per slide.

**Puppeteer note:** `box-decoration-break: clone` is essential for multi-line highlights to work correctly.

### 6.4 Underline Decoration Variants

```css
/* Thick accent underline */
.underline-thick {
  display: inline;
  background: linear-gradient(to top, #FF6B35 8px, transparent 8px);
  padding-bottom: 2px;
}

/* Wavy underline (via text-decoration) */
.underline-wavy {
  text-decoration: underline wavy #FF6B35;
  text-decoration-thickness: 3px;
  text-underline-offset: 6px;
}

/* Double underline */
.underline-double {
  text-decoration: underline double #333;
  text-decoration-thickness: 2px;
  text-underline-offset: 8px;
}

/* Gradient underline (using pseudo-element) */
.underline-gradient {
  position: relative;
  display: inline-block;
}
.underline-gradient::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #FF6B35, #FFD93D);
  border-radius: 2px;
}
```

**Best for:** Subheadings, emphasized terms. Use sparingly — max 1-2 per slide.

### 6.5 Text Shadow for Depth

```css
/* Subtle depth shadow */
.text-depth {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Strong shadow for text over busy backgrounds */
.text-shadow-strong {
  text-shadow:
    0 2px 8px rgba(0, 0, 0, 0.3),
    0 4px 16px rgba(0, 0, 0, 0.15);
}

/* Colored glow */
.text-glow {
  text-shadow:
    0 0 20px rgba(99, 102, 241, 0.5),
    0 0 40px rgba(99, 102, 241, 0.3);
}
```

**Best for:** Text over gradient/mesh backgrounds. The glow effect is powerful on dark themes.

---

## 7. Shape Compositions

### 7.1 Circle Cluster Decoration

```html
<div style="position: absolute; top: -40px; right: -40px;">
  <div style="
    position: absolute; top: 0; left: 0;
    width: 120px; height: 120px;
    border-radius: 50%;
    background: rgba(255, 107, 53, 0.1);
  "></div>
  <div style="
    position: absolute; top: 40px; left: 50px;
    width: 80px; height: 80px;
    border-radius: 50%;
    background: rgba(255, 107, 53, 0.06);
  "></div>
  <div style="
    position: absolute; top: -20px; left: 70px;
    width: 60px; height: 60px;
    border-radius: 50%;
    background: rgba(255, 107, 53, 0.15);
  "></div>
</div>
```

For outlined circles (no fill):

```html
<div style="
  position: absolute; top: 60px; right: 80px;
  width: 200px; height: 200px;
  border-radius: 50%;
  border: 2px solid rgba(255, 107, 53, 0.15);
"></div>
<div style="
  position: absolute; top: 120px; right: 40px;
  width: 140px; height: 140px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 107, 53, 0.1);
"></div>
```

**Best for:** Corner decoration on any slide. Position in the corner opposite to the main content. Keeps the slide from looking empty without adding information noise.

### 7.2 Accent Lines and Dividers

```css
/* Thick accent divider */
.divider-accent {
  width: 60px;
  height: 4px;
  background: #FF6B35;
  border-radius: 2px;
}

/* Gradient divider (wider) */
.divider-gradient {
  width: 200px;
  height: 3px;
  background: linear-gradient(90deg, #FF6B35, transparent);
  border-radius: 2px;
}

/* Full-width thin line */
.divider-full {
  width: 100%;
  height: 1px;
  background: rgba(0, 0, 0, 0.08);
}

/* Vertical accent line (for pull quotes) */
.divider-vertical {
  width: 4px;
  height: 60px;
  background: #FF6B35;
  border-radius: 2px;
}

/* Dashed divider */
.divider-dashed {
  width: 200px;
  height: 0;
  border-top: 2px dashed rgba(0, 0, 0, 0.15);
}
```

Usage pattern in a detail slide:

```html
<div style="padding: 60px;">
  <span style="font-size: 18px; font-weight: 600; color: #FF6B35; letter-spacing: 0.1em;">CHAPTER 01</span>
  <div class="divider-accent" style="margin: 16px 0 24px;"></div>
  <h2 style="font-size: 48px; font-weight: 800;">슬라이드 제목</h2>
</div>
```

**Best for:** Between label and title (detail slides), between sections (list slides), beside quotes (quote slides).

### 7.3 Corner Decorations

```css
/* L-shaped corner bracket */
.corner-tl::before {
  content: '';
  position: absolute;
  top: 40px;
  left: 40px;
  width: 40px;
  height: 40px;
  border-top: 3px solid #FF6B35;
  border-left: 3px solid #FF6B35;
}

.corner-br::after {
  content: '';
  position: absolute;
  bottom: 40px;
  right: 40px;
  width: 40px;
  height: 40px;
  border-bottom: 3px solid #FF6B35;
  border-right: 3px solid #FF6B35;
}
```

```html
<div style="position: relative; width: 1080px; height: 1080px;" class="corner-tl corner-br">
  <!-- Content -->
</div>
```

For a full four-corner frame:

```html
<!-- Top-left -->
<div style="position: absolute; top: 40px; left: 40px; width: 40px; height: 40px;
  border-top: 2.5px solid rgba(255,255,255,0.3); border-left: 2.5px solid rgba(255,255,255,0.3);"></div>
<!-- Top-right -->
<div style="position: absolute; top: 40px; right: 40px; width: 40px; height: 40px;
  border-top: 2.5px solid rgba(255,255,255,0.3); border-right: 2.5px solid rgba(255,255,255,0.3);"></div>
<!-- Bottom-left -->
<div style="position: absolute; bottom: 40px; left: 40px; width: 40px; height: 40px;
  border-bottom: 2.5px solid rgba(255,255,255,0.3); border-left: 2.5px solid rgba(255,255,255,0.3);"></div>
<!-- Bottom-right -->
<div style="position: absolute; bottom: 40px; right: 40px; width: 40px; height: 40px;
  border-bottom: 2.5px solid rgba(255,255,255,0.3); border-right: 2.5px solid rgba(255,255,255,0.3);"></div>
```

**Best for:** Statement and quote slides — frames the text without boxing it in. Use semi-transparent colors on dark backgrounds, accent colors on light backgrounds.

### 7.4 Decorative Dots / Dot Grid

```html
<!-- Small dot grid cluster (decorative, not halftone) -->
<div style="
  position: absolute;
  top: 60px;
  right: 60px;
  display: grid;
  grid-template-columns: repeat(5, 10px);
  gap: 12px;
">
  <!-- 15 dots (3 rows x 5 cols) -->
  <div style="width: 6px; height: 6px; border-radius: 50%; background: rgba(255,107,53,0.2);"></div>
  <div style="width: 6px; height: 6px; border-radius: 50%; background: rgba(255,107,53,0.2);"></div>
  <div style="width: 6px; height: 6px; border-radius: 50%; background: rgba(255,107,53,0.2);"></div>
  <div style="width: 6px; height: 6px; border-radius: 50%; background: rgba(255,107,53,0.2);"></div>
  <div style="width: 6px; height: 6px; border-radius: 50%; background: rgba(255,107,53,0.2);"></div>
  <!-- repeat for 2 more rows -->
  <div style="width: 6px; height: 6px; border-radius: 50%; background: rgba(255,107,53,0.15);"></div>
  <div style="width: 6px; height: 6px; border-radius: 50%; background: rgba(255,107,53,0.15);"></div>
  <div style="width: 6px; height: 6px; border-radius: 50%; background: rgba(255,107,53,0.15);"></div>
  <div style="width: 6px; height: 6px; border-radius: 50%; background: rgba(255,107,53,0.15);"></div>
  <div style="width: 6px; height: 6px; border-radius: 50%; background: rgba(255,107,53,0.15);"></div>
  <div style="width: 6px; height: 6px; border-radius: 50%; background: rgba(255,107,53,0.1);"></div>
  <div style="width: 6px; height: 6px; border-radius: 50%; background: rgba(255,107,53,0.1);"></div>
  <div style="width: 6px; height: 6px; border-radius: 50%; background: rgba(255,107,53,0.1);"></div>
  <div style="width: 6px; height: 6px; border-radius: 50%; background: rgba(255,107,53,0.1);"></div>
  <div style="width: 6px; height: 6px; border-radius: 50%; background: rgba(255,107,53,0.1);"></div>
</div>
```

**Tip:** Vary the opacity across rows so the dots fade out — this creates directionality and prevents the grid from looking mechanical.

**Best for:** Corner filler, decoration near labels/captions. Common in the Likelion card news style.

### 7.5 Geometric Accent Shapes

```html
<!-- Rotated square accent -->
<div style="
  position: absolute;
  top: 200px;
  right: -30px;
  width: 60px;
  height: 60px;
  background: rgba(255, 107, 53, 0.08);
  transform: rotate(45deg);
"></div>

<!-- Plus/cross shape -->
<div style="position: absolute; top: 100px; left: 80px;">
  <div style="width: 20px; height: 2px; background: rgba(255,107,53,0.2); position: absolute; top: 9px; left: 0;"></div>
  <div style="width: 2px; height: 20px; background: rgba(255,107,53,0.2); position: absolute; top: 0; left: 9px;"></div>
</div>

<!-- Semicircle decoration -->
<div style="
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 100px;
  border-radius: 200px 200px 0 0;
  background: rgba(255, 107, 53, 0.06);
"></div>
```

**Best for:** Scattered across slides for organic texture. Keep opacity low (0.05-0.15). These should be felt, not stared at.

---

## 8. Combination Recipes

### 8.1 Dark Premium Cover

Layer: gradient mesh + noise + corner brackets + gradient text.

```html
<div style="
  width: 1080px; height: 1080px;
  background: #0F172A;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 80px;
">
  <!-- Gradient mesh layer -->
  <div style="
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse at 20% 50%, rgba(124, 58, 237, 0.3) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 20%, rgba(59, 130, 246, 0.2) 0%, transparent 50%);
  "></div>

  <!-- Noise layer -->
  <svg style="position: absolute; width: 0; height: 0;">
    <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
  </svg>
  <div style="position: absolute; inset: 0; filter: url(#n); opacity: 0.04;"></div>

  <!-- Corner brackets -->
  <div style="position: absolute; top: 48px; left: 48px; width: 36px; height: 36px;
    border-top: 2px solid rgba(255,255,255,0.2); border-left: 2px solid rgba(255,255,255,0.2);"></div>
  <div style="position: absolute; bottom: 48px; right: 48px; width: 36px; height: 36px;
    border-bottom: 2px solid rgba(255,255,255,0.2); border-right: 2px solid rgba(255,255,255,0.2);"></div>

  <!-- Text content -->
  <div style="position: relative; z-index: 1;">
    <span style="
      font-size: 20px; font-weight: 600; color: rgba(255,255,255,0.5);
      letter-spacing: 0.12em;
    ">CHAPTER 01</span>
    <div style="width: 48px; height: 3px; background: #818CF8; border-radius: 2px; margin: 20px 0 32px;"></div>
    <h1 style="
      font-size: 64px; font-weight: 800; line-height: 1.2;
      background: linear-gradient(135deg, #C7D2FE, #818CF8);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    ">제목이 여기에<br>들어갑니다</h1>
  </div>
</div>
```

### 8.2 Light Minimal with Halftone

Layer: light background + corner halftone + accent divider + highlight text.

```html
<div style="
  width: 1080px; height: 1080px;
  background: #FAFAFA;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 80px;
">
  <!-- Corner halftone -->
  <div style="
    position: absolute; inset: 0;
    background: radial-gradient(circle, #000 1px, transparent 1px);
    background-size: 14px 14px;
    -webkit-mask-image: radial-gradient(ellipse at 100% 100%, black 0%, transparent 45%);
    mask-image: radial-gradient(ellipse at 100% 100%, black 0%, transparent 45%);
    opacity: 0.08;
  "></div>

  <!-- Content -->
  <div style="position: relative; z-index: 1;">
    <span style="
      font-size: 16px; font-weight: 700; color: #FF6B35;
      letter-spacing: 0.1em;
    ">POINT 03</span>
    <div style="width: 48px; height: 3px; background: #FF6B35; border-radius: 2px; margin: 16px 0 28px;"></div>
    <h2 style="font-size: 48px; font-weight: 800; color: #111; line-height: 1.3; word-break: keep-all;">
      핵심 메시지를<br>
      <span style="
        display: inline;
        background: #111;
        color: #fff;
        padding: 4px 12px;
        box-decoration-break: clone;
        -webkit-box-decoration-break: clone;
      ">강조합니다</span>
    </h2>
  </div>
</div>
```

### 8.3 Glass Data Card

Layer: gradient background + glass card + huge number.

```html
<div style="
  width: 1080px; height: 1080px;
  background: linear-gradient(135deg, #1E1B4B 0%, #312E81 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
">
  <!-- Accent glow -->
  <div style="
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 40%, rgba(129, 140, 248, 0.2) 0%, transparent 60%);
  "></div>

  <!-- Glass card -->
  <div style="
    position: relative;
    width: 700px;
    padding: 64px;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 24px;
    text-align: center;
  ">
    <span style="
      font-size: 120px; font-weight: 900; line-height: 1;
      background: linear-gradient(135deg, #C7D2FE, #818CF8);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    ">73%</span>
    <p style="
      font-size: 28px; font-weight: 400; color: rgba(255,255,255,0.7);
      margin-top: 20px; line-height: 1.5;
    ">of developers prefer this approach</p>
  </div>
</div>
```

---

## 9. Puppeteer Rendering Notes

| Feature | Support | Notes |
|---|---|---|
| `backdrop-filter` | Supported | Chromium 76+. Always include `-webkit-` prefix. |
| `mask-image` | Supported | Always include `-webkit-` prefix. |
| `-webkit-text-stroke` | Supported | Native WebKit property. |
| `-webkit-background-clip: text` | Supported | Include unprefixed `background-clip: text` too. |
| `box-decoration-break: clone` | Supported | Include `-webkit-` prefix. |
| SVG `<filter>` | Supported | `feTurbulence`, `feColorMatrix`, `feGaussianBlur` all work. |
| `text-decoration: wavy` | Supported | Chromium 88+. |
| CSS `filter: blur()` | Supported | Use for element blur (not backdrop). |
| `mix-blend-mode` | Supported | Use for overlay effects. |
| Google Fonts `@import` | Supported | The render script waits for font loading. |

**General rule:** If it works in Chrome DevTools, it works in Puppeteer headless Chrome. The rendering engine is identical.

**Performance:** Complex SVG filters (noise) on full 1080x1080 can add ~200ms to render time. This is acceptable. Avoid stacking more than 3 SVG filters on a single slide.
