# Asset Moods — SVG Technique Deep-Dives

Detailed SVG construction patterns per mood. **Lazy-loaded** — see [`asset-language.md`](./asset-language.md) §13 for load triggers.

Each mood entry includes:
- Visual description
- SVG primitives that define it
- Lighting & color rules
- Canonical example snippet (copy-paste-ready)
- When to use / avoid
- 2 real-world brand references

---

## TIER 1 — Fully SVG-Native (default-allowed)

These moods render cleanly with pure SVG. No raster fallback needed.

---

### 1. `toss-flat` — Fintech Geometric

**Look.** Solid-color geometric shapes (circles, rounded rects, pill-cards) with one soft ambient shadow. 2-3 brand colors + white. Object-only, no scenes. Characters reduced to friendly bean-blobs.

**SVG primitives.**
- `<rect rx="N">`, `<circle>`, `<path>` with **flat fills only** (no gradients).
- One ambient drop shadow per object: `<filter><feGaussianBlur stdDeviation="8"/><feOffset dy="6"/></filter>`.
- No strokes. No filters beyond ambient shadow.
- Optional `<clipPath>` for card layering.

**Lighting.** Single ambient soft shadow from top. No directional light. `lightSource: "none"`.

**Color.** Flat. Pick from `taste-profile.color.*`. Primary on object, accent for one detail per illustration, white/cream background.

**Canonical snippet:**
```html
<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6"/>
      <feOffset dy="4"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.25"/></feComponentTransfer>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect x="40" y="60" width="160" height="120" rx="20" fill="#3182F6" filter="url(#soft)"/>
  <rect x="60" y="80" width="80" height="14" rx="7" fill="#FFFFFF" opacity="0.95"/>
  <circle cx="170" cy="140" r="22" fill="#FFD43A"/>
</svg>
```

**Use when.** Fintech, banking, productivity, trust-heavy B2C.
**Avoid when.** Lifestyle, fashion, gaming — reads as cold/corporate.
**Brands.** Toss, Cash App (flat layer), Monzo.

---

### 2. `editorial-line` — Single-Stroke Editorial

**Look.** Single continuous stroke, no fills, organic curves with deliberate hand-drawn imperfection. Single ink color (black/sepia) on cream. Negative space heavy.

**SVG primitives.**
- `<path>` with `fill="none"`, `stroke-width="2"`, `stroke-linecap="round"`, `stroke-linejoin="round"`.
- Optional `stroke-dasharray="4 8"` for tone variation.
- No filters, no gradients.
- For "weight variation": layer two parallel paths at slightly different stroke widths.

**Lighting.** None — line art is unlit.

**Color.** One ink color (charcoal `#1A1410` or sepia `#5C3B1E`) on cream background `#F7F1E8`. That's it.

**Canonical snippet:**
```html
<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#1A1410" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M 60 180 C 60 120, 100 80, 140 80 C 180 80, 200 110, 200 140 C 200 170, 180 190, 150 190 L 80 190"/>
  <circle cx="100" cy="130" r="3" fill="#1A1410"/>
  <path d="M 130 150 Q 140 158, 150 150"/>
</svg>
```

**Use when.** Editorial, longform, premium publishing, B2B thought leadership.
**Avoid when.** You need feed attention — too quiet for Instagram thumbnails.
**Brands.** The New Yorker spots, Pitch, Readwise, The Browser Company.

---

### 3. `sticker-kawaii` — Cute Sticker

**Look.** Mascots and objects with thick uniform black outlines, pastel/saturated fills, rounded everything, white "sticker border" halo, tiny cheek blushes. Always smiling.

**SVG primitives.**
- Stacked path strategy: outermost path = white halo at `stroke-width="14"`, middle = black outline at `stroke-width="6"`, innermost = colored fill.
- `<circle>` for blush at `opacity="0.4"`, soft pink.
- `<feDropShadow dx="0" dy="2" stdDeviation="0">` for hard sticker shadow (no blur — that's the trick).

**Lighting.** Flat top-light implied via slight highlight ellipse. `lightSource: "top-center"`.

**Color.** Brand primary as fill, pastel accent for blush, black outline, white halo. 4-color max.

**Canonical snippet:**
```html
<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="halo">
      <feMorphology operator="dilate" radius="6" in="SourceAlpha"/>
      <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0"/>
      <feComposite in2="SourceGraphic" operator="out"/>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <g filter="url(#halo)">
    <!-- body -->
    <circle cx="120" cy="120" r="80" fill="#FFB489" stroke="#1A1410" stroke-width="6"/>
    <!-- eyes -->
    <ellipse cx="95" cy="115" rx="7" ry="9" fill="#1A1410"/>
    <ellipse cx="145" cy="115" rx="7" ry="9" fill="#1A1410"/>
    <!-- smile -->
    <path d="M 100 145 Q 120 165, 140 145" stroke="#1A1410" stroke-width="5" fill="none" stroke-linecap="round"/>
    <!-- blush -->
    <circle cx="85" cy="138" r="9" fill="#FF7A8A" opacity="0.4"/>
    <circle cx="155" cy="138" r="9" fill="#FF7A8A" opacity="0.4"/>
  </g>
</svg>
```

**Use when.** Education, consumer apps, kids, mobile-first, mascot-driven brands.
**Avoid when.** Enterprise, luxury, finance — reads childish.
**Brands.** Duolingo, Notion (illustrations), Headspace, KHU Likelion (this brand).

---

### 4. `memphis-revival` — Confetti-Scatter Pattern Mix

**Look.** Confetti-scatter of primitive shapes (squiggles, triangles, dots, zigzags) over flat color blocks. Clash palette (primary + hot pink + teal + yellow). Patterns: terrazzo, bauhaus polka, leopard grid.

**SVG primitives.**
- `<pattern>` element with tiled shapes for backgrounds — the heart of this mood.
- `<path>` for squiggles (cubic béziers): `d="M 10 50 Q 20 30, 30 50 T 50 50 T 70 50"`.
- Thick `stroke-width="3"` on open paths.
- No gradients — flat fills only.
- `<g transform="rotate(N)">` to scatter elements at different angles.

**Lighting.** None — flat 2D mood.

**Color.** 4 clashing colors. Common Memphis palette: `#FF3D7F` pink, `#00C2C7` teal, `#FFD43A` yellow, `#1A1410` black, on `#F7F1E8` cream.

**Canonical snippet:**
```html
<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="confetti" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="10" cy="10" r="3" fill="#FF3D7F"/>
      <path d="M 25 25 l 8 8 M 33 25 l -8 8" stroke="#00C2C7" stroke-width="2.5"/>
      <path d="M 5 30 Q 10 25, 15 30 T 25 30" stroke="#FFD43A" stroke-width="2" fill="none"/>
    </pattern>
  </defs>
  <rect width="240" height="240" fill="#F7F1E8"/>
  <rect width="240" height="240" fill="url(#confetti)"/>
  <circle cx="120" cy="120" r="50" fill="#FF3D7F"/>
  <polygon points="120,60 170,140 70,140" fill="#FFD43A" stroke="#1A1410" stroke-width="3"/>
</svg>
```

**Use when.** Beverages, music, dopamine brands, festivals, Gen-Z DTC.
**Avoid when.** Anything serious, medical, fintech.
**Brands.** Spotify Wrapped, Bumble, Liquid Death.

---

### 5. `architectural-blueprint` — Technical Drawing

**Look.** Monochrome cyan-on-navy or black-on-cream. Thin uniform technical lines, measurement annotations, dotted construction lines, isometric or orthographic projections of objects.

**SVG primitives.**
- `<path>` with `stroke-width="0.5-1"`, `vector-effect="non-scaling-stroke"`.
- `stroke-dasharray="2 2"` for construction lines.
- Tiny `<text>` labels in monospace (`font-family: "JetBrains Mono", monospace`, `font-size: 9px`).
- `<pattern>` of fine grid lines for background.
- No fills.

**Lighting.** None — technical view.

**Color.** Two-color rule: cyan `#5EC9D8` on navy `#0F1729`, OR black `#1A1410` on cream `#F7F1E8`. No third color.

**Canonical snippet:**
```html
<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" stroke="#5EC9D8" stroke-width="0.5" fill="none" opacity="0.3"/>
    </pattern>
  </defs>
  <rect width="240" height="240" fill="#0F1729"/>
  <rect width="240" height="240" fill="url(#grid)"/>
  <g stroke="#5EC9D8" stroke-width="1" fill="none" font-family="monospace" font-size="9">
    <rect x="60" y="80" width="120" height="80"/>
    <path d="M 60 80 L 90 50 L 210 50 L 180 80" />
    <path d="M 180 80 L 180 160 L 210 130 L 210 50" />
    <line x1="60" y1="170" x2="180" y2="170" stroke-dasharray="2 2"/>
    <text x="115" y="180" fill="#5EC9D8">120mm</text>
  </g>
</svg>
```

**Use when.** Engineering, architecture, dev-tool docs, manuals.
**Avoid when.** Emotional/consumer brands — too cold.
**Brands.** Arc browser launch, Framer technical pages, Things 3.

---

### 6. `notion-doodle` — Hand-Drawn Wobble

**Look.** Loose ink-pen line with intentional shake, duotone (black + one accent), pen-pressure variation, casual whiteboard energy.

**SVG primitives.**
- The killer technique: `<filter>` with `<feTurbulence baseFrequency="0.02" numOctaves="2" seed="3"/>` + `<feDisplacementMap scale="2">` applied to clean paths. This adds organic wobble to any geometric SVG.
- `<path>` with `stroke-linecap="round"` and `stroke-width="2.5"`.
- For "pen pressure": two parallel paths at slightly different stroke widths overlaid.

**Lighting.** None.

**Color.** Duotone. Black/charcoal `#1A1410` + one accent (often muted blue `#5470C6` or warm orange `#E97451`). No more.

**Canonical snippet:**
```html
<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="wobble">
      <feTurbulence baseFrequency="0.025" numOctaves="2" seed="5" result="turb"/>
      <feDisplacementMap in="SourceGraphic" in2="turb" scale="2.5"/>
    </filter>
  </defs>
  <g filter="url(#wobble)" stroke="#1A1410" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <rect x="50" y="60" width="140" height="120" rx="8"/>
    <line x1="70" y1="100" x2="170" y2="100"/>
    <line x1="70" y1="120" x2="150" y2="120"/>
    <circle cx="120" cy="170" r="6" fill="#E97451" stroke="#E97451"/>
  </g>
</svg>
```

**Use when.** Explainers, internal tools, education, friendly B2B.
**Avoid when.** Luxury or precision branding.
**Brands.** Notion, Excalidraw, tldraw, Loom.

---

### 7. `neo-brutalist` — Hard Edges, Hard Shadows

**Look.** Flat saturated blocks with thick uniform black borders (3-6px) and hard offset shadows (no blur). Clashing colors. Raw, zine-like, anti-polish.

**SVG primitives.**
- `<rect>`/`<path>` with `stroke="black" stroke-width="4"`.
- **Shadow trick:** a duplicate shape filled black, offset by `transform="translate(6,6)"` and placed *behind* the main shape — never `feGaussianBlur`. Hard shadows define this mood.
- Pure flat fills.
- Monospace `<text>` labels.

**Lighting.** Implied bottom-right via the hard shadow. `lightSource: "top-left-30"` (so shadow falls bottom-right).

**Color.** 3 saturated colors + black + cream. Common: hot yellow `#FFD800`, electric blue `#0066FF`, hot pink `#FF1493`, black `#000000`, cream `#FFF8DC`.

**Canonical snippet:**
```html
<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
  <!-- shadow layer (offset, behind) -->
  <rect x="56" y="56" width="140" height="120" fill="#000000"/>
  <!-- main shape -->
  <rect x="50" y="50" width="140" height="120" fill="#FFD800" stroke="#000000" stroke-width="4"/>
  <!-- inner accent (with its own hard shadow) -->
  <rect x="76" y="76" width="50" height="50" fill="#000000"/>
  <rect x="70" y="70" width="50" height="50" fill="#FF1493" stroke="#000000" stroke-width="4"/>
  <text x="80" y="155" font-family="monospace" font-size="14" font-weight="bold" fill="#000000">CLICK ME</text>
</svg>
```

**Use when.** Indie tools, creator platforms, statement brands.
**Avoid when.** Accessibility-critical, trust-heavy verticals (banks).
**Brands.** Gumroad, Figma (marketing era), Hey.com.

---

### 8. `claymorphism` — Soft 3D Blobs

**Look.** Rounded 3D blobs with soft inner shadows, candy palette. Like polymer clay — squishy, glossy, friendly.

**SVG primitives.**
- `<radialGradient>` for blob fills (lighter top-left → mid → darker bottom-right).
- Soft inner shadow via `<feGaussianBlur>` + `<feComposite operator="out">`.
- Outer soft shadow via standard `<feDropShadow stdDeviation="10">`.
- Rounded everything — circles, ellipses, paths with high `rx`.

**Lighting.** Top-left, soft. `lightSource: "top-left-30"`.

**Color.** Candy palette: pastel pink `#FFB7C5`, pastel blue `#B5D8FF`, pastel mint `#B5F0D4`, pastel yellow `#FFF0A5`. 2-3 candy colors per illustration.

**Canonical snippet:**
```html
<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="clayPink" cx="35%" cy="30%">
      <stop offset="0%" stop-color="#FFE4EC"/>
      <stop offset="60%" stop-color="#FFB7C5"/>
      <stop offset="100%" stop-color="#E8889F"/>
    </radialGradient>
    <filter id="innerShadow">
      <feGaussianBlur stdDeviation="3" in="SourceAlpha"/>
      <feOffset dx="2" dy="2"/>
      <feComposite operator="arithmetic" k2="-1" k3="1" in2="SourceGraphic"/>
      <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.3 0"/>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="outerSoft">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-opacity="0.2"/>
    </filter>
  </defs>
  <g filter="url(#outerSoft)">
    <circle cx="120" cy="120" r="80" fill="url(#clayPink)" filter="url(#innerShadow)"/>
  </g>
</svg>
```

**Use when.** Wellness apps, kids' games, lifestyle, candy/snacks.
**Avoid when.** Editorial, brutalist, high-precision tech.
**Brands.** Headspace (later era), various wellness apps.

---

### 9. `pixel-art` — Retro Pixel Grid

**Look.** Tiny squares forming objects/characters. No anti-aliasing. 8-bit or 16-bit feel.

**SVG primitives.**
- `<rect>` grid, every "pixel" is a rect.
- Critical: `shape-rendering="crispEdges"` on the SVG root.
- No filters, no gradients, no curves.

**Lighting.** Implied via lighter top-left pixels and darker bottom-right pixels of the same object.

**Color.** Limited palette. Pick 6-8 colors max. Classic NES-era restraint.

**Canonical snippet:**
```html
<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" style="image-rendering: pixelated;">
  <!-- 16x16 grid, each rect = 1 pixel -->
  <rect x="6" y="2" width="4" height="2" fill="#F05A2A"/>
  <rect x="5" y="4" width="6" height="1" fill="#F05A2A"/>
  <rect x="4" y="5" width="8" height="6" fill="#FFB489"/>
  <rect x="6" y="7" width="1" height="1" fill="#1A1410"/>
  <rect x="9" y="7" width="1" height="1" fill="#1A1410"/>
  <rect x="7" y="9" width="2" height="1" fill="#1A1410"/>
  <rect x="5" y="11" width="6" height="2" fill="#F05A2A"/>
</svg>
```

Render at `width="160" height="160"` for crisp blocky scaling.

**Use when.** Gaming, retro, nostalgia campaigns.
**Avoid when.** Modern minimal, luxury.
**Brands.** Various indie game studios, Stardew Valley marketing.

---

## TIER 2 — SVG Works, Some Character Lost Without Raster

These moods use SVG for shapes but may want a raster texture overlay for full fidelity. Set `assetLanguage.useRasterTexture: true` to enable.

---

### 10. `iso-3d-gradient` — Premium Tech 3D

**Look.** Floating geometric objects in 30°/30°/90° isometric projection, lit from one corner with multi-stop gradients suggesting glass/metal. Cool blues→magenta palette, dark backgrounds. Soft glow halos.

**SVG primitives.**
- `<linearGradient>` with 3-5 stops per face (highlight white → base color → shadow).
- `<radialGradient>` ellipses for glass reflection blobs on top of faces.
- `<feGaussianBlur>` for bloom around objects.
- Each "face" is a `<polygon>` — three polygons per cube.
- Background: stacked conic-style gradients (or use a raster mesh-gradient for true Stripe-grade look).

**Lighting.** Top-left, hard. Shadow side gets very dark. `lightSource: "top-left-30"`.

**Color.** Brand primary as object base + black to deep navy for shadow side + white for highlight ellipses + ambient glow color matching primary.

**Canonical snippet** (already used in this brand's `iso-objects.svg`):
```html
<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="discTop" cx="40%" cy="35%" r="70%">
      <stop offset="0%" stop-color="#FF8A4F"/>
      <stop offset="55%" stop-color="#F05A2A"/>
      <stop offset="100%" stop-color="#B83A12"/>
    </radialGradient>
    <linearGradient id="discSide" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#C73E14"/>
      <stop offset="100%" stop-color="#7A2308"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="55%">
      <stop offset="0%" stop-color="#F05A2A" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#F05A2A" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <ellipse cx="120" cy="170" rx="120" ry="30" fill="url(#glow)"/>
  <path d="M 40 150 Q 40 180 120 180 Q 200 180 200 150 L 200 140 Q 200 170 120 170 Q 40 170 40 140 Z" fill="url(#discSide)"/>
  <ellipse cx="120" cy="140" rx="80" ry="20" fill="url(#discTop)"/>
</svg>
```

**Use when.** Developer tools, SaaS, "premium tech," fintech with a tech edge.
**Avoid when.** Warm/human brands, kids, food.
**Brands.** Stripe, Linear, Vercel.

---

### 11. `paper-cutout` — Snipped-Paper Collage

**Look.** Flat shapes that look snipped from construction paper, with offset soft drop shadows giving physical depth. Slightly irregular edges. Warm matte palette.

**SVG primitives.**
- `<path>` with deliberately wobbled vertices (offset by 1-3px from a clean curve).
- `<feDropShadow dx="2" dy="4" stdDeviation="3" flood-opacity="0.25">` per layer.
- Multiple `<g>` layers stacked at increasing shadow distances (depth).
- Optional `<feTurbulence>` + `<feDisplacementMap>` at low scale for torn-edge texture. For true paper grain: raster overlay (`<image>` base64 of a noise texture at `opacity="0.2"`).

**Lighting.** Top-left, soft. `lightSource: "top-left-30"`.

**Color.** Warm matte palette: terra cotta `#D17B5E`, sage `#8DAB7F`, cream `#F0E5C9`, charcoal `#3A2F2A`. 3-4 colors max.

**Canonical snippet:**
```html
<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="paperShadow">
      <feDropShadow dx="2" dy="5" stdDeviation="3" flood-opacity="0.22"/>
    </filter>
    <filter id="tornEdge">
      <feTurbulence baseFrequency="0.4" numOctaves="2"/>
      <feDisplacementMap in="SourceGraphic" scale="1.5"/>
    </filter>
  </defs>
  <rect width="240" height="240" fill="#F0E5C9"/>
  <g filter="url(#paperShadow)">
    <path d="M 50 80 Q 70 60, 120 70 T 200 90 L 195 170 Q 150 180, 100 175 T 45 165 Z" fill="#D17B5E" filter="url(#tornEdge)"/>
  </g>
  <g filter="url(#paperShadow)">
    <circle cx="140" cy="125" r="35" fill="#8DAB7F" filter="url(#tornEdge)"/>
  </g>
</svg>
```

**Use when.** Storytelling, wellness, eco/sustainability, kids' books.
**Avoid when.** Tech precision needed.
**Brands.** Headspace (Sleepcasts), Calm, Slack onboarding (older era).

---

## TIER 3 — Fights SVG (require raster)

Avoid unless the brand explicitly requires it. Setting `assetLanguage.useRasterTexture: true` is mandatory.

---

### 12. `y2k-vaporwave` — Holographic Chrome

**Look.** Chrome text, perspective grid floors, neon pink/cyan/purple gradients, lens flares, chromatic aberration ghosting, holographic iridescence, Windows-98 references.

**Why Tier 3.** True iridescent holographic shifts need WebGL or pre-rendered PNGs. SVG can approximate chrome + chromatic aberration, but the rainbow shift effect is raster-leaning.

**Partial SVG approach:**
- Chrome text: `<linearGradient>` silver→white→silver→dark, applied to `<text>` fill.
- Perspective grid: `<line>` elements with computed positions converging to a vanishing point.
- Chromatic aberration: three copies of a `<path>` offset by ±2px in red/cyan/blue with `style="mix-blend-mode: screen"`.
- Glow: `<filter>` chain of `feGaussianBlur` + `feColorMatrix`.

**Color.** Neon hot pink `#FF1493`, electric cyan `#00FFFF`, deep purple `#8B00FF`, white. On midnight blue `#0A0A2E` or black.

**Use when.** Music drops, fashion campaigns, nostalgia/web3.
**Avoid when.** Trust matters.
**Brands.** Arizona Iced Tea reissues, 100 gecs, A24 micro-sites.

---

## Universal SVG Technique Cheatsheet

Load-bearing snippets that apply across moods. Copy-paste into any SVG.

```html
<!-- Soft drop shadow (toss-flat, claymorphism) -->
<filter id="softShadow">
  <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.18"/>
</filter>

<!-- Hard drop shadow (neo-brutalist) — use a duplicate shape instead of feDropShadow -->
<!-- (see neo-brutalist snippet above) -->

<!-- Glass highlight (iso-3d-gradient, claymorphism) -->
<radialGradient id="glass" cx="30%" cy="20%">
  <stop offset="0" stop-color="white" stop-opacity="0.6"/>
  <stop offset="0.4" stop-color="white" stop-opacity="0.1"/>
  <stop offset="1" stop-color="white" stop-opacity="0"/>
</radialGradient>

<!-- Hand-drawn wobble (notion-doodle) -->
<filter id="wobble">
  <feTurbulence baseFrequency="0.02" numOctaves="2" seed="3"/>
  <feDisplacementMap in="SourceGraphic" scale="2"/>
</filter>

<!-- Sticker halo (sticker-kawaii) -->
<filter id="halo">
  <feMorphology operator="dilate" radius="6" in="SourceAlpha"/>
  <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0"/>
  <feComposite in2="SourceGraphic" operator="out"/>
  <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>

<!-- Memphis confetti pattern (memphis-revival) -->
<pattern id="confetti" width="40" height="40" patternUnits="userSpaceOnUse">
  <circle cx="10" cy="10" r="3" fill="#FF3D7F"/>
  <path d="M 25 25 l 8 8 M 33 25 l -8 8" stroke="#00C2C7" stroke-width="2"/>
</pattern>

<!-- Blueprint grid (architectural-blueprint) -->
<pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
  <path d="M 20 0 L 0 0 0 20" stroke="#5EC9D8" stroke-width="0.5" fill="none" opacity="0.3"/>
</pattern>

<!-- Glow halo (iso-3d-gradient) -->
<radialGradient id="glow" cx="50%" cy="50%" r="55%">
  <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.5"/>
  <stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/>
</radialGradient>
```

---

## Cross-Mood Rules (apply regardless of mood)

1. **Light source consistency**: pick once per brand, every asset in every slide follows. Mixing top-left lit and bottom-right lit objects within one carousel is the #1 amateur tell.
2. **Color depth ladder**: 3 tones per color (light/mid/dark). Light = base + 30% white. Dark = base + 30% black. Mid = base.
3. **Stroke stance**: outlined / solid-fill / mixed — brand picks. Don't mix per slide.
4. **Object weight**: at 1080×1080 scale, minimum stroke 2px, accent stroke 4-8px, hero outline 6-10px.
5. **Geometric grammar**: brand picks shape vocabulary — only-circles, sharp-angles, rounded-rects — and sticks across all assets.
6. **Negative space**: asset never exceeds 55% of slide canvas (and that's the cover ceiling). Most assets ≤25%.
7. **Style-locked across carousel**: once a mood is chosen for a series, no slide breaks it. If a slide *needs* a different mood, the carousel is wrong, not the slide.

---

## Mood × Brand Industry Quick-Pick

| Industry | First-pick mood | Second-pick | Avoid |
|---|---|---|---|
| Fintech | `toss-flat` | `iso-3d-gradient` | `memphis-revival`, `y2k-vaporwave` |
| Dev tools / SaaS | `iso-3d-gradient` | `architectural-blueprint` | `sticker-kawaii`, `paper-cutout` |
| Education / Kids | `sticker-kawaii` | `claymorphism` | `architectural-blueprint`, `neo-brutalist` |
| Wellness | `paper-cutout` | `claymorphism` | `neo-brutalist`, `y2k-vaporwave` |
| Music / Fashion | `memphis-revival` | `y2k-vaporwave` | `architectural-blueprint` |
| Editorial / Longform | `editorial-line` | `notion-doodle` | `memphis-revival`, `y2k-vaporwave` |
| Indie tools / Creator | `neo-brutalist` | `notion-doodle` | `claymorphism`, `paper-cutout` |
| Gaming / Retro | `pixel-art` | `y2k-vaporwave` | `editorial-line`, `toss-flat` |

This brand (KHU Likelion, education/tech with cute mascot): first-pick `sticker-kawaii` (mascot+brand), with **iso-3d-gradient signature accents** (the orange disc + glass chips on the original cover) — a hybrid the brand has earned.
