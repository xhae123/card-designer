# Asset Handling — Logos, Images, Illustrations

How to handle visual assets in card news slides. **Companion to [`asset-language.md`](./asset-language.md) (philosophy + heuristics) and [`asset-moods.md`](./asset-moods.md) (technique deep-dives).**

---

## 1. The SVG-First Rule — Two Protocols

**Every asset is an SVG file, but the conversion method depends on origin.** See [`asset-language.md`](./asset-language.md) §2 for the full philosophy. Quick summary:

### Protocol A — User-Provided Raster → PNG-embed SVG (PIXEL-PERFECT)

Operational protocol when the user provides a PNG/JPG (logo, mascot, photo, screenshot):

```
1. Save original → brands/{name}/assets/raw/{descriptive-name}.{ext}
   (never deleted, never edited — forensic reference)

2. Run scripts/png-to-svg.py to wrap the PNG inside an SVG container:
     python3 scripts/png-to-svg.py \
       brands/{name}/assets/raw/logo.png \
       brands/{name}/assets/logo.svg
   This auto-compresses with pngquant (~60% size reduction) and base64-embeds
   into an inline-safe <image> tag.

3. Render standalone via scripts/render.js to verify pixel match.

4. Show user: "픽셀 완벽 SVG화 완료. 카드에 그대로 들어가요."

5. Register in manifest.json with:
     "kind": "embed",
     "rasterSource": "raw/{filename}",
     "tier": "signature" (or "library")
```

**Method:** the SVG file is `<svg><image href="data:image/png;base64,..."/></svg>`. The PNG bytes ARE the source. Zero loss. Industry-standard (Figma/Canva use this for non-vector layers).

**Why not eye-trace or vtracer:** detail loss, posterized gradients, jagged edges on cute illustrations. We tried both — both fail for gradient mascots. The embed approach is the only free, pixel-perfect option in 2026.

**Optional editable-vector escape hatch:** Vectorizer.AI API ($0.20/image) — call only when user explicitly needs path-editable output. Not the default.

### Protocol B — AI-Generated Brand Asset → Hand-Crafted Pure SVG

When you draw a fresh asset in the brand's `assetLanguage.mood` (paperclip motif, calendar icon, abstract decoration, anything described in words):

```
1. Look up brand assetLanguage.mood + light source + palette
2. Lazy-load references/asset-moods.md if not loaded this session
3. Compose SVG using <path>, <circle>, <linearGradient>, <radialGradient>
   directly. Apply mood-appropriate technique snippets verbatim where useful.
4. Render, visually verify
5. If reusable → save to library/{name}.svg with manifest entry tier: library
   If one-off → live inline in slide HTML only
6. Register in manifest.json with kind: "vector"
```

**Method:** pure SVG primitives. No embedded raster. Recolorable, composable, sub-5KB.

**Never confuse the protocols:**
- Don't eye-trace a user-uploaded mascot — use Protocol A (embed)
- Don't generate a PNG then embed it — draw pure SVG via Protocol B

---

## 2. Directory Layout

```
brands/{brand-name}/
  taste-profile.json
  brand-master.md
  idioms.json
  evolution.md
  learnings.jsonl
  timeline.jsonl
  manifest.json
  assets/
    logo.svg                              # primary brand mark (SVG)
    signature/                            # tier 1: brand-identifying, reuse liberally
      mascot.svg
      paperclip.svg
      folder-card.svg
      iso-objects.svg
    library/                              # tier 2: reusable spots, earned through use
      icon-calendar.svg
      icon-chart.svg
      decoration-wave-01.svg
    raw/                                  # original user uploads (preserved)
      logo-original.png
      reference-cover.png
      ...
  output/{YYYYMMDD_HHmm}/
    slide_01.html
    slide_01.png
    ...
```

**Tier semantics** (from Atlassian-pattern; see [`asset-language.md`](./asset-language.md) §9):

- **`logo.svg`** at root — single primary mark.
- **`signature/`** — brand-identifying SVGs. Recognizable at thumbnail size. Reuse byte-identical across many slides. Locked once approved.
- **`library/`** — reusable spot illustrations earned through use. Generated for a specific slide, kept when reuse-able.
- **`raw/`** — every original user upload, preserved as forensic reference.

There is no `generated/` tier in v1. Single-use SVGs live inline in slide HTML, not on disk.

---

## 3. Embedding Strategy — INLINE SVG ONLY

The renderer uses `puppeteer.setContent(html)`, which means **no document base URL**. Relative paths in `<img src="../assets/logo.svg">` fail silently — the image just doesn't render. This has bitten us; do not repeat.

### ✅ Correct (inline SVG)

Paste the SVG body directly into the slide HTML:

```html
<div class="brand-mark">
  <svg width="36" height="29" viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
    <g fill="#F05A2A">
      <polygon points="20,20 55,80 10,75"/>
      ...
    </g>
  </svg>
  <span>KHU · LIKELION</span>
</div>
```

### ✅ Correct (base64 inside src — only for raster escape hatch)

For Tier 2/3 moods that genuinely need a PNG texture overlay (paper grain, noise):

```html
<image href="data:image/png;base64,iVBORw0KG..." width="1080" height="1080" opacity="0.15"/>
```

### ❌ Wrong (relative paths)

```html
<img src="../assets/logo.svg">              <!-- silently fails -->
<img src="brands/foo/assets/logo.svg">      <!-- silently fails -->
```

### Practical workflow

The SVG files in `signature/` and `library/` are **source-of-truth artifacts** — but they are loaded into slide HTML via copy-paste of the inner `<svg>` markup, not via `src=`. Treat the disk SVGs as a snippet library, not as runtime dependencies.

To load:
1. Read the SVG file with the Read tool.
2. Copy the `<svg>...</svg>` markup.
3. Paste into the slide HTML.
4. Adjust `width`/`height` attributes for placement.

For very large SVGs (>100 lines), consider extracting the `<defs>` block once and reusing — but byte-identical instances of the same signature SVG should remain visually identical across slides.

---

## 4. Logo Style Rules

| Property | Rule |
|---|---|
| Format | **SVG only.** PNG/JPG logos go through Protocol A (PNG-embed SVG). |
| Max display height | 80px (logical px; 160px rendered at 2× scale) |
| Aspect ratio | Always preserved. Set only `width` or `height`, never both. |
| Stretching | Forbidden. Use `<svg viewBox>` for fluid scaling. |
| Color treatment | Use the contrast-appropriate logo. If only one logo exists, ensure it works on both light and dark backgrounds (or maintain two variants `logo-dark.svg` / `logo-light.svg`). |
| Filters | No `filter:` CSS on brand logos without explicit user permission. Logos are sacrosanct. |

### Standard logo placement

Two canonical positions, both inside `.slide` but outside `.content`:

```html
<!-- Top-left (default for body slides) -->
<div class="brand-mark">
  <svg width="36" height="auto" viewBox="0 0 200 160">...</svg>
  <span>BRAND · NAME</span>
</div>

<!-- Bottom-right (CTA slides) -->
<div class="brand-mark cta">
  <svg width="48" height="auto" viewBox="0 0 200 160">...</svg>
</div>
```

```css
.brand-mark {
  position: absolute;
  top: 48px;
  left: 80px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 3;
}
.brand-mark.cta {
  top: auto; left: auto;
  bottom: 48px; right: 80px;
}
.brand-mark svg { display: block; }
```

If a text-only brand-mark already exists in the Recurring Elements block (SKILL.md), the logo SVG **replaces** the text — do not stack image + text in the same corner.

---

## 5. Photographic Backgrounds (escape hatch)

When the brand explicitly uses photo backgrounds (rare for card news, common for editorial):

```css
.cover {
  position: relative;
  background: url('data:image/jpeg;base64,...') center/cover no-repeat;
}
.cover::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.65) 100%);
  z-index: 1;
}
.cover .content { position: relative; z-index: 2; }
```

- Minimum overlay opacity: **0.4** for white text. Increase if the image is bright or busy.
- For dark text on a light photo: invert (white overlay at 0.5+).
- Always base64-encode the image (file:// paths fail under setContent).

This is an escape hatch, not a default. Most brands should reach for SVG illustrations first.

---

## 6. Asset Intake & SVG-ization Flow

When the user first provides a raster asset:

```
User: 우리 로고 이거야 (이미지 첨부)
AI:   1. raw/로 저장 (원본 보존):
         cp [원본] brands/{name}/assets/raw/logo-original.png
      2. PNG-embed SVG 변환:
         python3 scripts/png-to-svg.py \
           brands/{name}/assets/raw/logo-original.png \
           brands/{name}/assets/logo.svg
      3. 단독 렌더로 검증 (scripts/render.js)
      4. 사용자에게 "픽셀 완벽 SVG화 완료" 알림
      5. manifest.json에 등록 (kind: embed, rasterSource: raw/...)
```

After conversion, subsequent sessions: no question — the SVG is loaded from `assets/logo.svg` automatically when the brand is selected. The raster never gets re-touched.

**For new brand assets the AI generates (Protocol B):** no intake flow — those are drawn fresh as pure SVG during Step [6.5] Asset Planning.

---

## 7. Manifest Maintenance

Every asset addition or change requires updating `brands/{name}/manifest.json`. See [`asset-language.md`](./asset-language.md) §10 for the full schema.

Triggers for manifest update:
- New SVG saved to `signature/` or `library/` → add entry
- Asset used on a slide → increment `usageCount`
- Asset promoted between tiers → update `tier` field, log event to `timeline.jsonl`
- User edits an asset → bump `version`, update `lastUpdated`

---

## 8. What NOT To Do

- ❌ Use `<img src>` with a file path or URL — `setContent` ignores relative paths and external URLs may fail.
- ❌ Eye-trace a user-provided mascot/logo by hand — detail will be lost. Use Protocol A (PNG-embed) for all user-provided rasters.
- ❌ Use vtracer/potrace/autotrace on cute illustrations with gradients — they posterize. Stick to Protocol A.
- ❌ Generate SVG logos from scratch when the user has provided one — always Protocol A their original, never invent.
- ❌ Apply filters (`drop-shadow`, `hue-rotate`, etc.) to brand logos without explicit permission. Logos are sacrosanct.
- ❌ Use Protocol A (PNG-embed) for fresh AI-generated motifs — those should be pure editable SVG via Protocol B.
- ❌ Use Protocol B (hand-craft) for user-provided rasters — that's the trap that loses fidelity.
- ❌ Modify the original in `raw/`. It is forensic evidence and must never change.
- ❌ Skip the manifest update. The manifest is what makes assets discoverable in future sessions.
- ❌ Use different SVG markup for the "same" signature asset across slides. Byte-identical copy-paste, no per-slide variation.
