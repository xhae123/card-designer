# Asset Language — Why, When, How

The single source of truth for illustration in card news. Always loaded.

> **Companion file (lazy-loaded):** [`asset-moods.md`](./asset-moods.md) — full SVG technique deep-dives per mood. Load only when actively generating in a specific mood (see "Lazy-Load Triggers" below).

---

## 1. Why Assets Matter (the value)

Type-only card news is a deck. Card news with assets is a **brand**. The illustration carries three jobs simultaneously:

1. **Recognition** — a swiper sees the thumbnail in feed and knows it's *this* brand before reading a word. Signature assets (the lion mascot, the paperclip motif, the orange disc) do this work.
2. **Compression** — one illustration replaces 30 words of explanation. A chart icon next to "85%" lands instantly; "eighty-five percent of users" needs a clause.
3. **Emotion** — type sets meaning, illustration sets feeling. The same data slide reads cold in pure type, warm with a kawaii sticker, premium with iso-3D, urgent with brutalist.

A card-designer that only places type leaves all three on the table. **Assets are not decoration — they are the second voice of the brand.**

---

## 2. The SVG-First Rule (NON-NEGOTIABLE)

**Every asset ends up as an SVG file in this skill, but the path differs by origin.** There are TWO distinct protocols. Conflating them produces bad results — we learned this the hard way.

### Protocol A — Asset Intake (user-provided rasters)

When the user provides a PNG/JPG (logo, mascot, screenshot, photo):

**Method: PNG-embed inside SVG wrapper.** The PNG is base64-encoded and dropped into an `<image>` tag inside a clean SVG container. Pixel-perfect. Zero detail loss. Industry-standard for how Figma/Canva export non-vector layers as SVG.

```
User: "우리 로고 이거야" + 파일/이미지 제공
AI:   1. Save original → brands/{name}/assets/raw/{filename}
      2. Run scripts/png-to-svg.py (auto-compresses with pngquant, embeds as base64):
           python3 scripts/png-to-svg.py raw/logo.png logo.svg
      3. Render standalone via scripts/render.js to verify
      4. Show user: "픽셀 완벽 SVG화 완료. 카드에 그대로 들어갈 거예요."
      5. On approval, register in manifest.json with kind: "embed", rasterSource: "raw/..."
```

**Why this and not eye-tracing or auto-tracers:**
- Hand-tracing a cute mascot by eye loses scallop detail, gradient softness, eye/nose proportions
- Open-source auto-tracers (vtracer, potrace, autotrace) posterize gradients into hard color zones — kawaii illustrations look "cut up"
- ML tracers either run GPU minutes-long or only handle icons
- The only paid tool that reliably preserves gradients is Vectorizer.AI ($0.20/image API), which is overkill when the goal is just to embed the asset in card layouts

**The embed approach guarantees:** pixel-perfect fidelity, the SVG drops inline anywhere SVG works, the file remains self-contained.

**Optional escape hatch — true editable vector:** if the user explicitly needs a path-editable vector (e.g., to recolor the logo through CSS variables), call Vectorizer.AI API. Manual `--vectorize` step; do not auto-call.

### Protocol B — Asset Generation (AI draws fresh in brand mood)

When you create an asset from scratch to match the brand's `assetLanguage.mood` — paperclip motif, calendar icon, decorative wave, abstract iso objects, anything described in words rather than uploaded as a raster:

**Method: hand-crafted pure SVG.** `<path>`, `<circle>`, `<linearGradient>`, `<radialGradient>` — proper editable vector built from the mood techniques in [`asset-moods.md`](./asset-moods.md).

```
User: "차트 아이콘 하나 그려서 데이터 슬라이드에 넣어줘"
AI:   1. Look up brand assetLanguage.mood (e.g., "iso-3d-gradient")
      2. Lazy-load asset-moods.md if not yet loaded this session
      3. Compose SVG from mood-appropriate primitives + brand palette
      4. Render, visually verify
      5. If reusable across series, save to library/icon-chart.svg with manifest entry
      6. Single-use → live inline in the slide HTML only
```

**Why pure SVG here:** AI-generated motifs SHOULD be editable, recolorable, composable. They're the brand's living vocabulary — they may evolve session by session. PNG-embed would kill that evolution.

### The two-protocol mental model

| Property | Protocol A (intake) | Protocol B (generation) |
|---|---|---|
| Source | User-uploaded raster | AI text-to-SVG in brand mood |
| Fidelity goal | 100% match to upload | 100% match to brand grammar |
| Method | base64 PNG in SVG wrapper | hand-crafted `<path>` + gradients |
| Editable colors | ❌ (baked into raster) | ✅ (CSS-recolorable) |
| File size | ~1.3× compressed PNG | typically <5 KB |
| Use case | Logos, mascots, photos, screenshots, brand illustrations user owns | Spot icons, decorative motifs, signature shapes the AI draws fresh |

**Never apply Protocol A to a generation case** (don't generate a PNG then embed it — that's a hack).
**Never apply Protocol B to an intake case** (don't try to eye-trace a complex mascot — you'll lose detail).

### Inline rule (applies to both protocols)

The renderer uses `puppeteer.setContent()` — **no document base URL.** Relative paths in `<img src="../assets/logo.svg">` fail silently. Always inline the SVG body (`<svg>...</svg>`) directly into slide HTML. The disk files in `assets/` are a snippet library: copy-paste their inner SVG markup into slide HTML, do not `src=` them.

---

## 3. Asset Sense — WHEN to place (slide-role matrix)

Every slide answers two questions before HTML is written: *Is this type-leading or image-leading?* and *What goes in the asset slot, if anything?*

| Role | Asset slot | Type/Image dominance | Asset budget (canvas %) | Default placement |
|---|---|---|---|---|
| **cover** | **Hero illustration** | Image-leading (title 48-72px, illustration 30-55% canvas) | ≤55% | Bottom-right third (rule of thirds); title top-left/upper-third |
| **statement** | None, or quote-mark glyph only | Type-leading (statement = the asset) | ≤8% | Single decorative mark, off-axis |
| **detail** | Small corner accent, OR split-layout illustration | Either; declare per slide | ≤25% accent / ≤40% split | Opposite third from text block |
| **list** | Bullet icons (uniform set) OR one anchor illustration on side | Type-leading | Icons each ≤6%; anchor ≤30% | Left of each bullet OR right edge anchor |
| **comparison** | Twin illustrations, mirrored | Image-leading (equal weight L/R) | 25% each side | Left third + right third, identical scale |
| **quote** | Oversized quotation-mark glyph | Type-leading | ≤15% (the mark) | Behind/above quote, low opacity |
| **data** | Supporting icon next to the number, OR chart-as-illustration | Image-leading if chart, type-leading if number+icon | Icon ≤10%; chart ≤50% | Icon adjacent to number; chart center-stage |
| **cta** | Directional asset (arrow/hand/character) + QR frame | Type-leading | ≤20% | Asset *points toward* CTA element; never away |

**Hard rule (anti-pattern G22):** Two consecutive image-leading slides — reader fatigue. Force alternation: cover (image) → detail (type) → data (image) → statement (type) → list (type) → cta (mixed).

---

## 4. Rhythm & Density Rules

Real designers earn engagement through *contrast*, not constant stimulation.

- **Alternation pattern**: across a 7-10 slide carousel, no more than 2 image-leading slides back-to-back. Pattern: `image → type → split → type → image → type → cta`.
- **Negative space floor**: every slide ≥40% empty canvas. Statement/quote slides ≥50%. Korean editorial rule: 여백 부족 = 갑갑함, 정보 전달 실패.
- **Asset canvas budget caps**: hero ≤55%, supporting ≤25%, accent ≤8%, bullet icons each ≤6%.
- **Three-pattern ceiling**: across the whole carousel, no more than 3 distinct visual treatments. One mood, locked.
- **Spanning device** (optional but powerful): a single shape, line, or character that visually continues from one slide to the next pulls swipes. Example: the lion's tail off-canvas on slide 3 reappears entering canvas on slide 4.

---

## 5. Composition Heuristics

- **Rule of thirds**: on 1080×1080, the four power points sit at (360, 360), (720, 360), (360, 720), (720, 720). Place the focal element of an illustration on one of these intersections, not dead center, unless the slide is a statement/quote where stillness is the point.
- **Eye entry**: Korean and English readers enter top-left. Cover slide: title top-left or upper third; illustration anchors bottom-right as counterweight.
- **Z-pattern** for detail slides: title (top-left) → supporting text (mid) → illustration or CTA (bottom-right).
- **Type weight vs asset weight**: when both compete, title weight ≥ asset weight × 1.2 (image-leading inverts this). Never tie.
- **80px safe margin** on all sides (already enforced by mandatory boilerplate). Illustration bounding box never crosses this except for intentional spanning devices.

---

## 6. Cohesion Rules (across the whole carousel)

These lock visual consistency. Violations are the #1 reason a card series "feels AI-generated."

| Rule | What it means | How to enforce |
|---|---|---|
| **Single mood, locked** | One illustration style across all slides | Brand `assetLanguage.mood` field; never mix Tier 1 styles |
| **Single light source** | If shadows fall bottom-right on slide 1, they do on every slide | Brand `assetLanguage.lightSource` field (e.g., "top-left 30°") |
| **Palette lock** | 1 primary + 1 accent + 2 neutrals max | Pulled from `taste-profile.json color.*` |
| **Stroke stance** | Outlined, solid fill, or filled-with-detail-lines — pick one | Brand `assetLanguage.strokeStance` field |
| **Geometric grammar** | Circles vs sharp angles vs rounded rects — brand picks, sticks | Brand `assetLanguage.geometry` field |
| **Template constants** | Same margin, title position, font scale across slides | Already enforced via mandatory boilerplate |

If any signature asset (logo, mascot, recurring motif) appears on more than one slide, it must be *byte-identical* in markup — copy-paste verbatim, no per-slide variants.

---

## 6.5. Discipline vs Flexibility — The Variety Imperative ★

> **The risk this section prevents:** a system that mindlessly applies signature assets, locked idioms, and anti-pattern rules on every slide produces "wallpaper" — repetitive, context-blind output. A real brand designer has discipline AND knows when to deviate. This section codifies both.

### Rule 1 — Enforcement levels (not all rules are equal)

Every rule, idiom, anti-pattern, and signature asset carries one of three enforcement levels. Mark them explicitly in `learnings.jsonl`, `idioms.json`, and `manifest.json`:

| Level | Meaning | Examples |
|---|---|---|
| `hard` | NEVER violate. Brand-identity violation. | "라이트 배경 금지", "사자 로고 변형 금지" |
| `default` | Use unless the slide context contradicts it. | "폴더 카드는 detail 시그니처" — applies when content is categorical, not for "오늘의 한 줄" type slides |
| `suggestion` | First option, override freely if better option exists. | "강조는 검정 박스" — could be오렌지 underline on a slide where black would crowd |

When loading rules at Step [4], internalize the level. **Hard rules are walls. Default rules are gravity. Suggestions are starting points.**

### Rule 2 — Asset usage budgets per series

Each signature asset has a maximum per series. Wallpapering destroys the asset's signature value.

| Asset class | Per-series cap | Reason |
|---|---|---|
| Logo / mascot | Max 2 slides (cover + 1 other, usually CTA) | Mascot overuse = childish, scarcity = memorable |
| Signature container (e.g., folder-card) | Max 3 slides, and only when content is categorical | Container on a quote slide = absurd |
| Signature decorative motif (e.g., paperclip, iso-objects) | Max 2 slides, prefer cover + reuse | Same decoration on 5 slides reads as template |
| Emphasis idiom (black box, etc.) | Max 1× per slide, max 3× per series | More than 1 emphasis per slide = nothing is emphasized |
| Same idiom repeated | Max 4× per series (excluding always-on like background-texture) | Beyond 4 = formulaic |

Track usage during generation. If a budget would be exceeded, **the AI MUST choose**:
(a) drop the asset on this slide, or
(b) generate a fresh variant (different motif from library, or new SVG) to break monotony.

Default to (b) when possible — series grows the library, library grows the brand.

### Rule 3 — Context-fit check (before applying any signature)

Before placing a signature asset on a slide, answer in one sentence: *"Does this slide's content actually call for this motif?"*

- Folder-card metaphor → only when content is **categorical / sectioned** (parts of a recruitment plan, multiple teams, multiple features). Not for a single quote, a single data point, a single CTA.
- Lion mascot → only on slides where **friendliness/community** is the message. Not on a serious announcement (e.g., "지원 마감 D-1"), not on a data slide.
- Paperclip → only when the folder-card is also present. They are visually paired; one without the other looks broken.
- Iso 3D objects → cover or hero-data slides only. Not on text-heavy detail slides where they'd compete.

If context-fit fails: **drop the asset.** A signature is recognizable by *absence* on the wrong slides, not by ubiquity.

### Rule 4 — The Fresh-Element Imperative

Every series MUST add at least one new element to the brand's library, OR refine an existing one. Stagnant libraries make stagnant brands.

Concretely: at Step [6.5] Asset Planning, check if the topic introduces a new concept the library can't express. Examples:
- Topic mentions "스터디 일정" → if no calendar SVG exists, generate one in brand mood, save to `library/icon-calendar.svg`, register in manifest.
- Topic mentions "축하/완료" → if `success-feel` idiom is still `null` in `idioms.json`, this is the series to define it.
- Topic mentions a season → seasonal element (snowflake, cherry blossom) generated in brand mood for this series, kept in library if reusable.

Track in `evolution.md` when version bumps (v1.1, v1.2) happen via library growth.

### Rule 5 — Deliberate Deviation (with logging)

The AI CAN break a `default` or `suggestion` rule when context demands it. Two conditions:
1. **Better alternative exists** — name the alternative in plain text before deviating.
2. **Log to `learnings.jsonl`** as `type: override` with rationale.

Example: a memorial-style slide in a normally-kawaii brand. Use `editorial-line` mood for that single slide. Log:
```jsonl
{"ts":"...","type":"override","insight":"브랜드 무드는 sticker-kawaii지만 추모 슬라이드에 한해 editorial-line 사용","confidence":9,"reason":"맥락 불일치 시 무드 깨는 게 톤 유지보다 중요","applies_to":["this slide only"]}
```

**Automatic rule demotion:** If a `hard` rule receives 2+ overrides → AI must surface this to the user at session end ("이 룰이 자주 위반돼요. hard에서 default로 내릴까요?"). User decides; AI doesn't unilaterally demote `hard` rules.

### Rule 6 — Topic-Mood alignment pre-check (Step [5] addition)

Before content analysis, the AI silently checks: *"Does this topic align with the brand's locked mood?"*

- Aligned → proceed normally
- Mismatch (e.g., kawaii brand asked to make a memorial post) → surface to user:
  ```
  잠깐 — 이 주제는 브랜드의 기본 무드(sticker-kawaii)와 결이 다른데, 두 가지 선택지가 있어요:
  (A) 이 시리즈만 editorial-line으로 (브랜드 일관성 일시 양보, 톤 맞추기)
  (B) 기본 무드로 강행 (브랜드 일관성, 톤 약간 어색할 수 있음)

  어느 쪽?
  ```
  User chooses; log to `learnings.jsonl`.

---



- ❌ Asset competing with text (illustration behind title at >20% opacity, or saturated art adjacent to body copy) — demote to corner, reduce opacity, or move to opposite third.
- ❌ Every-slide illustration fatigue — alternation rule violated.
- ❌ Scale mismatch in comparison slides — twin assets at different sizes implies bias.
- ❌ Style drift mid-carousel — flat icon on slide 3, 3D render on slide 5. Hard rule: one mood.
- ❌ Decorative clutter (sparkles, dots, squiggles "for energy" that serve no hierarchy).
- ❌ Centered title + centered art = no focal point. Pick one third.
- ❌ CTA-slide character or arrow pointing *away* from the action element.
- ❌ Overlapping text and illustration without a contrast layer between them.
- ❌ Generating logo from scratch when the user has provided one — **always SVG-ize the user's logo, never invent**.

---

## 8. Brand Asset Language — Onboarding Capture

During Brand Onboarding (SKILL.md Phase 5), capture these fields and write to `taste-profile.json`:

```json
"assetLanguage": {
  "mood": { "value": "sticker-kawaii", "confidence": 0.7 },
  "lightSource": { "value": "top-left-30", "confidence": 0.6 },
  "strokeStance": { "value": "outlined-bold", "confidence": 0.6 },
  "geometry": { "value": "rounded", "confidence": 0.6 },
  "useRasterTexture": { "value": false, "confidence": 0.8 },
  "signatureMotifs": [
    { "id": "logo", "tier": "signature", "description": "scalloped-mane lion mascot" },
    { "id": "paperclip", "tier": "signature", "description": "orange paperclip wrapped on folder tab" },
    { "id": "folder-tab", "tier": "signature", "description": "white tab + orange body folder card" }
  ]
}
```

**`mood` values** (one of the Tier 1 default-allowed styles from [`asset-moods.md`](./asset-moods.md)):
`toss-flat` | `iso-3d-gradient` | `memphis-revival` | `editorial-line` | `sticker-kawaii` | `architectural-blueprint` | `paper-cutout` | `notion-doodle` | `neo-brutalist` | `claymorphism` | `pixel-art`

**`lightSource` values**: `top-left-30` | `top-center` | `top-right-30` | `none` (for flat moods with no shading).

**`strokeStance` values**: `outlined-bold` (thick uniform stroke) | `outlined-thin` (1-2px hair line) | `solid-fill` (no stroke, color only) | `mixed` (deliberate per asset).

**`geometry` values**: `rounded` | `geometric-sharp` | `organic-curve` | `grid-aligned`.

---

## 9. Asset Library Structure (per-brand)

```
brands/{name}/assets/
  logo.svg                              # primary brand mark (always SVG)
  manifest.json                         # asset index — see schema below
  signature/                            # tier 1: brand-identifying, reuse liberally
    mascot.svg
    paperclip.svg
    iso-objects.svg
  library/                              # tier 2: reusable spot illustrations
    icon-calendar.svg
    icon-chart.svg
    decoration-wave-01.svg
  raw/                                  # original user uploads (PNG/JPG preserved)
    logo-original.png
    reference-shots/
```

**Three tiers (Atlassian-pattern):**

- **signature** — identifies the brand at a glance. Lion logo, paperclip motif, the 3D orange disc. Use freely across many slides. Promotion-locked: only changes with brand evolution.
- **library** — reusable spot illustrations earned through use. A calendar icon, a chart icon, a wave divider. Generated for a slide, kept if the next slide could reuse them.
- **(no `generated/` tier in v1)** — every asset is either signature or library. If an asset is used once and never again, it lives only in the slide HTML, not on disk.

**Promotion rule**: when a new asset is reused on 3+ slides within a series (or across 2 series), promote it from inline-only to `library/`. When a library asset is used in 5+ series consistently and matches `signatureMotifs`, propose promoting to `signature/` (ask user).

---

## 10. Manifest Schema (`assets/manifest.json`)

```json
{
  "brand": "khu-likelion",
  "version": "1.0.0",
  "lastUpdated": "2026-05-28T22:30:00Z",
  "assets": [
    {
      "id": "logo",
      "path": "logo.svg",
      "tier": "signature",
      "role": "logo",
      "concept": "mascot",
      "tags": ["lion", "mascot", "cute", "scalloped-mane"],
      "mood": "sticker-kawaii",
      "dimensions": { "w": 400, "h": 400 },
      "rasterSource": "raw/logo-original.png",
      "usageCount": 0,
      "createdAt": "2026-05-28T22:30:00Z"
    },
    {
      "id": "paperclip",
      "path": "signature/paperclip.svg",
      "tier": "signature",
      "role": "decorative",
      "concept": "office-supply",
      "tags": ["clip", "folder-tab", "orange"],
      "mood": "iso-3d-gradient",
      "pairsWith": ["folder-tab"],
      "dimensions": { "w": 120, "h": 200 },
      "usageCount": 0
    }
  ]
}
```

**Maintenance** — the AI updates `manifest.json` whenever:
- A new SVG is added to `signature/` or `library/`
- An asset is used on a slide (increment `usageCount`)
- An asset is promoted between tiers

---

## 11. Asset Planning Workflow (per slide, before HTML)

This is **Step [6.5]** in SKILL.md generation flow. Insert between Copywriting and Visual Composition.

For each slide, answer in order:

1. **Slide role** → look up the asset slot from §3 matrix.
2. **Need an asset?** Look at the matrix: does this role get a hero / accent / icons / none?
3. **If yes — signature reuse first.** Scan `manifest.json` `tier:signature` for a fit. Lion logo on cover? Paperclip on every detail slide as a corner accent? Reuse.
4. **No signature fits — library reuse.** Scan `tier:library` for tag matches. Calendar icon for a "schedule" slide?
5. **No library fits — generate fresh.** Use brand `assetLanguage.mood` to look up technique in [`asset-moods.md`](./asset-moods.md) (lazy-load now). Generate inline SVG. Tentative — don't save to library until used twice.
6. **Apply placement rules** from §3 + §5 (rule of thirds, hierarchy, etc.).
7. **Cohesion check** — does this asset's light source, stroke stance, geometry match the brand `assetLanguage`? If no, regenerate.

---

## 12. Mood Library — INDEX (one-line each)

Full SVG technique snippets live in [`asset-moods.md`](./asset-moods.md) (lazy-load on trigger). Quick selector:

| Mood | One-liner | Tier | Industries |
|---|---|---|---|
| **toss-flat** | Solid-color geometric shapes, soft ambient shadow, 2-3 brand colors | 1 (SVG-pure) | Fintech, productivity, trust-heavy B2C |
| **iso-3d-gradient** | Floating geometric objects in iso projection, glass highlights, glow halos | 2 (SVG works, gradient meshes lose some character) | Dev tools, SaaS, "premium tech" |
| **memphis-revival** | Confetti-scatter primitives over flat color blocks, clash palette, patterns | 1 | Beverages, music, Gen-Z DTC, festivals |
| **editorial-line** | Single uniform stroke, no fill, organic curves, single ink color | 1 | Editorial, longform, premium publishing |
| **sticker-kawaii** | Thick outlines, pastel/saturated fills, rounded everything, halo, blushes | 1 | Education, kids, mobile-first, mascots |
| **architectural-blueprint** | Thin technical lines, monochrome (cyan-on-navy or black-on-cream), grid | 1 | Engineering, dev-tool docs, manuals |
| **paper-cutout** | Snipped-paper shapes with offset soft shadows, slightly irregular edges | 2 (paper grain wants raster overlay) | Storytelling, wellness, kids, eco |
| **notion-doodle** | Hand-drawn wobble (feTurbulence + feDisplacementMap), duotone, casual | 1 | Explainers, internal tools, friendly B2B |
| **neo-brutalist** | Thick black borders, hard offset shadows (no blur), clashing flats, mono labels | 1 | Indie tools, creator platforms, statement brands |
| **claymorphism** | Rounded 3D blobs, soft inner shadows, candy palette | 1 | Wellness apps, kids' games, lifestyle |
| **pixel-art** | `<rect>` grid, `shape-rendering="crispEdges"`, no AA | 1 | Gaming, retro, nostalgia |
| **y2k-vaporwave** | Chrome text, perspective grids, neon gradients, chromatic aberration | 3 (raster-leaning) | Music, fashion drops, NFT/web3 |

**Default for new brands without strong direction**: ask the user to pick from Tier 1 only.

---

## 13. Lazy-Load Triggers (for `asset-moods.md`)

`asset-moods.md` is large (~500-700 lines). Load it only when one of these triggers fires:

1. **Brand Onboarding Phase 5** — when presenting the mood selection or generating the 3-direction shotgun. Load once, use for the session.
2. **Fresh SVG generation in Step [11].5** — when the brand's `assetLanguage.mood` will produce a new asset and you haven't loaded the file this session.
3. **User requests a mood pivot** — "let's try the brand in vaporwave instead" — load to compare techniques.

After load, hold for the session; do not reload. Hard cap: **load at most twice per session**. After 2 loads, ask the user to commit to one mood.

---

## 14. Quick Decision Tree (for the skill at slide-design time)

```
START → What is this slide's role?
  ├─ cover → image-leading, hero asset, ≤55% canvas, bottom-right third
  ├─ statement/quote → type-leading, no asset (or single quote-mark glyph ≤15%)
  ├─ detail → check rhythm: previous slide image-leading? then this is type-leading
  ├─ list → bullet icons (uniform) OR side anchor illustration
  ├─ comparison → twin assets, mirrored, equal scale
  ├─ data → icon next to number OR chart-as-illustration
  └─ cta → directional asset pointing TO action element

NEXT → Asset source priority:
  1. signature/ has a fit? → reuse byte-identical
  2. library/ has a fit? → reuse, increment usageCount
  3. generate inline → apply brand assetLanguage mood, save to slide HTML only

NEXT → Placement:
  - Focal element on rule-of-thirds power point
  - Opposite third from text block
  - 80px safe margin (enforced by boilerplate)
  - Type weight × 1.2 vs asset weight (invert if image-leading)

NEXT → Cohesion check:
  - Mood matches brand? Light source consistent? Palette locked? Stroke stance same?
  - If any "no" → regenerate or reject

NEXT → Negative space ≥40%? → if no, cut something
```

---

## 15. Sources & Further Reading

Research sources used to construct these rules (saved here so future maintainers don't have to re-research):

- Social Habit Marketing — Instagram Carousel Guide 2026 (rhythm, template constants)
- Creative Bloq — editorial design rules (hierarchy, body copy first)
- Shutterstock — visual hierarchy fundamentals
- IxDF — Rule of Thirds, Repetition/Pattern/Rhythm
- 툴디, 이랜서, Sang-eun Park (Medium) — Korean card news design conventions
- Hapy Design — Law of Consistency in carousels
- Atlassian Illustrations (Maryanne Nguyen) — tier model (signature/library)
- IBM Carbon Pictograms, Shopify Polaris — library organization
- NN/g — Neobrutalism best practices
- Codrops, Camillo Visini — SVG filter techniques (feTurbulence, feDisplacementMap)
