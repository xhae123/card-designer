# External Design References — Lazy-Load

> Single source of truth for which sites the skill MAY fetch, when, and how
> to handle results. Fetching is opt-in, never blocking. If a fetch fails,
> generation continues from internal references alone.

## 0. Operating Principles

- **Lazy-load only.** No prefetch. Fetch only at the three triggers below.
- **Hard cap: 4 `WebFetch` calls per session**, across all triggers. Once
  exhausted, proceed from internal references only.
- **In-memory only.** Results live in a transient `inspiration_seeds` object
  for the trigger (or session). No disk cache, no `taste-profile.json` field,
  no JSONL log.
- **Vocabulary, not templates.** Seeds inform prompt vocabulary (tone words,
  palette adjectives, layout descriptors). Never copied as literal HTML,
  copy, or imagery.
- **Established brand values win.** A seed cannot override any taste-profile
  field with confidence ≥ 0.8. It informs unestablished dimensions only.
- **Serialize fetches.** No parallel `WebFetch` within one trigger. ≥500ms
  delay between sequential calls in the same trigger.
- **Fail silent.** On 403, blank body, timeout, or vague summary: drop that
  seed and continue. Surface one line to the user only if every fetch in
  the trigger fails.

---

## 1. Fetchable Sites (Top 5)

### #1 — Lapa.ninja
- **URL:** `https://lapa.ninja/category/{slug}/`
- **Slugs:** `finance`, `portfolio`, `saas`, `agency`, `studio`, `fashion`,
  `education`, `minimal`, `gradient`, `bento-grid`
- **Visible:** thumbnail URL, site name, one-line tagline, sub-category
  tags, year (24/page, server-rendered)
- **Best query:** Map taste-profile `meta.industry` → closest slug. For
  aesthetic-driven fetches, use style slugs.
- **Korean coverage:** Low (Western curation; layout/type vocabulary only).
- **Best context:** Onboarding Shotgun (Trigger #1).

### #2 — Siteinspire
- **URL:** `https://www.siteinspire.com/websites?styles={slug}` or
  `?categories={slug}`
- **Style slugs:** `typographic`, `grid-layout`, `minimal`, `unusual-layout`
- **Category slugs:** `agencies-consultancies`, `design-art-direction`,
  `portfolio`, `fashion`, `art`
- **Visible:** thumbnail, name, submission date, submitter attribution,
  outbound link
- **Best query:** Style-axis searches when the user names a specific style
  word ("typographic", "editorial", "minimal grid").
- **Korean coverage:** Low.
- **Best context:** Mid-session aesthetic pivot (Trigger #2).

### #3 — Awwwards
- **URL:** `https://www.awwwards.com/websites/{tag}/`
- **Tags:** `typography`, `portfolio`, `animation`, `minimal`, `3d`
- **Visible:** site name, designer, awards status, URL, industry tag, tech
  stack, country, typography used, color palette (richest metadata tested).
- **Best query:** Typography or color tag pages — best for type-pairing and
  palette calibration.
- **Korean coverage:** Low (geo filter exists, few KR entries).
- **Best context:** Premium quality calibration (Trigger #3).

### #4 — Httpster
- **URL:** `https://httpster.net/styles/{slug}/` or `/types/{slug}/`
- **Style slugs:** `typographic`, `minimal`, `brutalist`, `colourful`,
  `photographic`
- **Type slugs:** `design-illustration`, `fashion`, `ecommerce`, `food-drink`
- **Visible:** 24 thumbnails/page with site name and outbound link.
- **Best query:** Non-mainstream aesthetics (brutalist / colourful /
  photographic) Lapa+Siteinspire under-represent.
- **Korean coverage:** Low.
- **Best context:** Mid-session aesthetic pivot (Trigger #2).

### #5 — Behance (galleries, not search)
- **URL:** `https://www.behance.net/galleries/{slug}/`
- **Gallery slugs:** `graphic-design`, `branding`, `packaging`,
  `typography`, `illustration`
- **Visible:** curated gallery thumbnails with project title, designer,
  view/appreciation counts, software icons, project tag.
- **Best query:** `graphic-design` and `branding` — closest fetchable proxy
  to Instagram carousel inspiration.
- **Korean coverage:** Medium (many KR designers; search needs login —
  galleries only).
- **Best context:** Onboarding Shotgun (Trigger #1) for carousel/social
  prompts. Rate-limit aware: 1 fetch per session per gallery.

> Sites NOT to fetch: Dribbble, Pinterest, Land-book, Designspiration,
> Godly, Mobbin, Notefolio, designers.kr — all either client-rendered,
> 403, or auth-walled. Documented in `docs/design-references-research.md`.

---

## 2. Trigger Moments

The skill MAY (not MUST) call `WebFetch` at three moments. Each trigger has
its own budget within the 4-call session cap.

### Trigger #1 — Onboarding Shotgun (max 2 fetches)

**When:** Brand Onboarding Phase 2, *before* generating the 3 visual
directions, when the user has supplied an industry + tone.

**What to fetch:** Up to 2 sites in sequence (≥500ms apart):
1. One Lapa.ninja category matching `meta.industry`
2. One Siteinspire style or Httpster style matching `meta.voice` /
   stated tone

**Skip when:** Industry and tone are both vague ("just something nice"),
or the user has explicitly said "no inspiration fetching".

**Parse into:** One `inspiration_seeds` entry per successful fetch.
Discard at the end of Phase 2.

### Trigger #2 — Mid-Session Aesthetic Pivot (max 1 fetch)

**When:** During Generation Mode, between Step [7] (Visual Composition
Design) and Step [8] (HTML Generation), when the user has just requested
a clear tonal shift ("make it more editorial", "more brutalist",
"more fintech", "less corporate").

**What to fetch:** ONE site that best exemplifies the requested word:
- `editorial`, `typographic`, `minimal grid` → Siteinspire styles
- `brutalist`, `colourful`, `photographic` → Httpster styles
- `fintech`, `saas`, `portfolio` → Lapa.ninja categories

**Skip when:** The user has not used an aesthetic word, or the request
contradicts an established (≥0.8 confidence) brand value (defer to D<N>
brief first).

**Parse into:** A single `inspiration_seeds` entry. Discard after the
current generation cycle.

### Trigger #3 — Premium Quality Calibration (max 2 fetches, opt-in)

**When:** During the Feedback Loop (Step [12]) when the user explicitly
asks for "extra polish", "premium feel", "quality bar", or similar.
**Opt-in only** — never fire automatically.

**What to fetch:** Up to 2 Awwwards tag pages:
1. `awwwards.com/websites/typography/` for type calibration
2. `awwwards.com/websites/{primary-accent-color}/` or
   `awwwards.com/websites/minimal/` for palette/layout calibration

**Skip when:** The brand's typography and color confidence are both ≥0.8
(already established — calibration adds noise).

**Parse into:** Up to 2 `inspiration_seeds` entries. Use them to inform
the next regeneration only, then discard.

---

## 3. WebFetch Prompt Template

Use the same prompt shape per site so the parsed output is uniform:

> "From this {site} {filter} page, extract up to 8 design references.
> For each, return: (1) name/title, (2) one-line aesthetic summary
> (color palette, typography style, layout pattern, mood — 6-10 words),
> (3) thumbnail or outbound URL if visible. Skip ads, nav, footer."

The WebFetch tool already summarizes — we want a structured aesthetic
vocabulary, not raw HTML. If the summary returns vague phrasing
("modern, clean", "professional, sleek") with no concrete palette or
layout descriptors, discard the seed.

---

## 4. The `inspiration_seeds` Transient Object

In-memory schema, scoped to the current trigger (or session at most):

```json
{
  "source": "lapa.ninja",
  "url": "https://lapa.ninja/category/portfolio/",
  "fetchedAt": "2026-05-28T10:14:00Z",
  "extractedTone": ["minimal", "editorial", "warm"],
  "extractedColors": ["#0F172A", "#F8FAFC"],
  "vocabulary": ["serif accents", "generous whitespace", "type-led hierarchy"]
}
```

Multiple seeds form an array. Fields:

- `source` — short site identifier (lapa.ninja / siteinspire / awwwards
  / httpster / behance)
- `url` — exact URL fetched (for in-session de-duplication only)
- `fetchedAt` — ISO 8601 UTC timestamp
- `extractedTone` — 2-5 short tone adjectives parsed from the summary
- `extractedColors` — up to 5 hex codes if the summary mentioned a palette
- `vocabulary` — 3-6 short descriptive phrases the designer prompt can
  paraphrase

---

## 5. Synthesis Rules

- Seeds feed a one-paragraph "current reference vibe" synthesis at the top
  of the designer's working context. The designer paraphrases — never copies.
- A seed CANNOT override a taste-profile field with confidence ≥ 0.8.
  Example: if `color.background.confidence = 0.85` and a seed suggests a
  different background, the seed is ignored for background. It may still
  inform `spacing` or `layoutTendency` if those are unestablished.
- Seeds inform unestablished dimensions only (confidence < 0.8).
- Seeds NEVER persist. They are dropped at trigger end (or session end at
  the latest) and are not written to `taste-profile.json`,
  `learnings.jsonl`, or `timeline.jsonl`. The user-facing brand stays clean.
- The user's **chosen direction** (aesthetic adjectives, palette hints
  they approved) MAY be persisted via the normal taste-profile update
  pathway — but the raw references that inspired the choice are not
  persisted.

---

## 6. Failure Mode

Per-fetch:

| Failure | Action |
|---|---|
| 403 / Cloudflare wall | Drop seed, continue. Do not retry the same URL this session. |
| Blank body / login wall | Drop seed, continue. |
| Timeout | Drop seed, continue. |
| Summary too vague | Drop seed, continue. |

Per-trigger: if every fetch in a trigger fails, surface ONE line to the
user (e.g. "외부 레퍼런스 로드 실패 — 내부 기준으로 진행할게요"). Never block
generation. Never escalate to a D<N> brief solely because a fetch failed.

---

## 7. TOS & Risk Acknowledgment

- Low-volume, read-only use (≤4 fetches per session, no bursts). We are
  consuming curation pages the way a human designer would.
- No persistence of source material — only paraphrased vocabulary.
- No image redistribution. WebFetch returns text/markdown; we do not
  download or rehost thumbnails.
- The skill MUST degrade gracefully if any listed site adds bot protection.
  Sites blocked tomorrow simply drop out of the rotation; the rest of the
  rotation continues.
- **Korean coverage gap is real.** None of the Top 5 has strong Korean
  curation. For Korean-tone work (토스 / 배민 / 당근 / 카카오 aesthetics)
  we rely on internal knowledge, not WebFetch. Closing this gap is a
  future-version concern — see `docs/design-references-research.md`.
