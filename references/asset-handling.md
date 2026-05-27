# Asset Handling — Logos, Images, Illustrations

How to inject brand-supplied visual assets into card news slides.

---

## 1. Directory Layout

Brand assets live alongside the taste profile:

```
brands/{brand-name}/
  taste-profile.json
  learnings.jsonl
  timeline.jsonl
  assets/
    logo.svg              # primary brand mark
    logo-dark.svg         # variant for light backgrounds (optional)
    logo-light.svg        # variant for dark backgrounds (optional)
    cover-bg-01.jpg       # cover background images
    illustration-01.svg
    ...
  output/{YYYYMMDD_HHmm}/
    ...
```

The AI's job: when the user mentions a logo or image, **ask once** where the file is. Copy it into `brands/{name}/assets/` and reference it from there. Do not ask again on subsequent generations — assume the same assets unless the user says otherwise.

---

## 2. Embedding Strategies

Two options. Pick per asset:

### A) Inline as base64 (preferred for small assets)

```html
<img class="brand-logo" src="data:image/svg+xml;base64,PHN2ZyB...">
```

- Pros: zero file dependencies, slide HTML is self-contained, no path issues during render.
- Use for: logos (SVG/PNG ≤ 20 KB), small icons, decorative marks.

### B) Reference as relative path (for large assets)

Copy the file into the output directory next to the slide HTMLs and reference it:

```html
<img class="cover-bg" src="cover-bg-01.jpg">
```

- Pros: slide HTML stays readable; Puppeteer resolves the relative path correctly because the output dir is the document base.
- Use for: large background images (> 50 KB), photos, complex illustrations.

---

## 3. Logo Style Rules

**Hard limits — do not violate.**

| Property | Rule |
|---|---|
| Max height | 80px (logical px; 160px rendered at 2× scale) |
| Aspect ratio | Always preserved. Set only `height` or `max-width`, never both fixed. |
| Stretching | Forbidden. `object-fit: contain` if a fixed box is unavoidable. |
| Color treatment | Use the contrast-appropriate variant (`logo-dark.svg` on light bg, `logo-light.svg` on dark bg). |
| Format priority | SVG > PNG > JPG. SVG scales cleanly and is smallest for vector marks. |

### Standard logo placement

Place the logo in the brand-mark slot defined by the recurring-elements block (SKILL.md). Two canonical positions:

```css
/* Top-left (default for body slides) */
.brand-mark {
  position: absolute;
  top: 48px;
  left: 80px;
  height: 32px; /* logo image height */
  width: auto;
}

/* Bottom-right (CTA slides) */
.brand-mark {
  position: absolute;
  bottom: 48px;
  right: 80px;
  height: 48px;
  width: auto;
}
```

If a text brand-mark already exists in the recurring-elements block, the logo **replaces** it — do not stack image + text mark in the same corner.

---

## 4. Image Backgrounds for Cover Slides

Photo-style cover backgrounds need contrast protection:

```css
.cover {
  position: relative;
  background: url('cover-bg-01.jpg') center/cover no-repeat;
}
.cover::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.65) 100%);
  z-index: 1;
}
.cover .content {
  position: relative;
  z-index: 2;
}
```

- Minimum overlay opacity: **0.4** (40% dark) for white text. Increase if the image is bright or busy.
- For dark text on a light photo: invert (white overlay at 0.5+).
- Always wrap content in a higher `z-index` so it sits above the overlay.

---

## 5. Asset Intake Flow

When the user mentions an asset on their first reference to it:

```
User: 우리 로고 좀 넣어줘
AI:   로고 파일 어디 있어요? 경로 알려주시면 brands/{name}/assets/ 로 복사해둘게요.
User: ~/Downloads/devlog-logo.svg
AI:   [copies file, regenerates slides with logo in brand-mark slot]
      복사했어요. 다음부터는 자동으로 적용돼요.
```

Subsequent sessions: no question — the asset is loaded from `brands/{name}/assets/` automatically when the brand is selected.

---

## 6. What NOT To Do

- Do not generate SVG logos from scratch unless the user explicitly asks. Logos belong to the brand owner.
- Do not apply filters (`drop-shadow`, `hue-rotate`, etc.) to brand logos without permission. Logos are sacrosanct.
- Do not inline large JPG/PNG (> 100 KB) as base64 — the HTML balloons and Puppeteer becomes slow.
- Do not reference external URLs (`https://...`) for assets at render time — they may fail to load and produce broken images. Always copy assets locally first.
