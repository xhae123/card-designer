# Design Reference Sites — Research for Lazy-Load Inspiration

Research for wiring up WebFetch-based design inspiration into the card-designer
skill. Every site below was actually fetched (not guessed) and the verdict
reflects what a plain HTTP GET actually returns.

## TL;DR

For the card-designer's "lazy-load design inspiration" mechanism, the only
sites worth wiring up are ones that (a) render meaningful content server-side,
(b) don't 403 anonymous fetches, and (c) expose a filterable URL grammar we
can parameterize.

That leaves a tight shortlist: **Lapa.ninja**, **Siteinspire**, **Awwwards**,
**Httpster**, and **Behance** (galleries pages, not search). Everything else
either blocks bots, hides content behind JS/login, or is too generic.

---

## 1. Top 5 Recommendations

### #1 — Lapa.ninja
- **URL pattern:** `https://lapa.ninja/category/{category}/` — e.g.
  `/category/finance/`, `/category/portfolio/`, `/category/saas/`,
  `/category/agency/`, `/category/studio/`, `/category/fashion/`,
  `/category/education/`. Also color filters and style filters
  (`/category/minimal/`, `/category/gradient/`, `/category/bento-grid/`).
- **What we get:** Server-rendered grid. Per-card: thumbnail URL, site name,
  one-line tagline, sub-category tags, year. 24 entries per page, paginated.
  Confirmed by fetch of `/category/finance/` returning Polar, Autonomous,
  Moneda, Column, Coda with full taglines.
- **Best query for our use case:** Map taste-profile.json `industry` →
  category slug. For aesthetic shotgun, pull `/category/minimal/`,
  `/category/gradient/`, `/category/bento-grid/` in parallel.
- **Korean coverage:** Low. Western/English-skewed. Use it for layout +
  typography vocabulary, not Korean tone.
- **Fetchability:** Excellent. No login, server-rendered, no bot wall hit
  during testing. Some specific slugs (`/category/instagram/`) don't exist —
  fall back to homepage or a real category if 404.
- **Invocation moment:** Onboarding "industry + aesthetic" shotgun. After
  user picks a vibe (e.g. "modern fintech"), fetch the matching category to
  ground color/typography/layout choices in real 2025-era references.

### #2 — Siteinspire
- **URL pattern:** `https://www.siteinspire.com/websites?categories={id}` or
  by style: `?styles=typographic`, `?styles=grid-layout`,
  `?styles=minimal`, `?styles=unusual-layout`. Type filters include
  `agencies-consultancies`, `design-art-direction`, `portfolio`,
  `fashion`, `art`.
- **What we get:** Site thumbnail, name, submission date, submitter
  attribution, outbound link. Style counts confirmed live (Typographic
  2,076 / Grid Layout 646 / Unusual Layout 639 / Minimal 722).
- **Best query:** Style-driven. Best for "typographic," "grid," "unusual
  layout," "minimal" aesthetic searches.
- **Korean coverage:** Low. Western curation.
- **Fetchability:** Good. Anonymous fetch works. Editorial-specific slug
  doesn't exist — closest is `design-art-direction`. Use style filters as
  primary axis, not category.
- **Invocation moment:** When the user requests a specific *style word*
  ("typographic," "editorial," "minimal grid"). One fetch, summarize 5-10
  references into a taste vocabulary the designer prompt can lean on.

### #3 — Awwwards
- **URL pattern:** `https://www.awwwards.com/websites/{tag}/` — e.g.
  `/websites/typography/`, `/websites/portfolio/`, `/websites/animation/`,
  `/websites/minimal/`, `/websites/3d/`. Also color and typeface filters.
- **What we get:** Confirmed visible without login: site name, designer,
  awards status, URL, industry tag, tech stack, country, typography used,
  color palette. Richest metadata of any site tested.
- **Best query:** Typography filter is the killer feature — fetch
  `/websites/typography/` to seed font-pairing decisions. Color filter
  similar.
- **Korean coverage:** Low (geo filter exists, but few KR entries).
- **Fetchability:** Good for category pages. `/inspiration/` returned 404 —
  use `/websites/` as the canonical entry.
- **Invocation moment:** "Quality bar" moment — after the user approves a
  draft, fetch an Awwwards typography or color category as a calibration
  reference. Also useful in design-shotgun mode for "premium" aesthetic
  variants.

### #4 — Httpster
- **URL pattern:** `https://httpster.net/` (homepage rotates 24 featured),
  plus `/styles/{slug}/` and `/types/{slug}/`. Style slugs include
  `typographic`, `minimal`, `brutalist`, `colourful`, `photographic`. Type
  slugs include `design-illustration`, `fashion`, `ecommerce`,
  `food-drink`.
- **What we get:** 24 thumbnails per page with site name and outbound link.
  Counts confirmed live (Typographic 1,193 / Minimal 847 / Photographic
  1,412).
- **Best query:** Aesthetic axes. Excellent for "brutalist," "colourful,"
  "photographic" — vibes the other sites under-index on.
- **Korean coverage:** Low. Editorially curated, mostly Western.
- **Fetchability:** Good, server-rendered.
- **Invocation moment:** When the user asks for a non-mainstream aesthetic
  ("brutalist," "raw editorial," "very colorful") that Lapa/Siteinspire's
  cleaner curation under-represents.

### #5 — Behance (galleries, not search)
- **URL pattern:** `https://www.behance.net/galleries/graphic-design/` and
  sibling gallery slugs (`branding`, `packaging`, `typography`,
  `illustration`). Avoid `/search/projects` — confirmed search results work
  but cut off at "Log in or sign up to view more."
- **What we get:** Curated gallery thumbnails with project title, designer
  name, view/appreciation counts, software icons, project tag. Public
  without login.
- **Best query:** Carousel-adjacent work lives in `graphic-design` and
  `branding` galleries. Use it as the closest thing to actual Instagram
  carousel inspiration on a fetchable site.
- **Korean coverage:** Medium. Many Korean designers post here; searching by
  designer name is possible but the user-facing search needs login. Stick
  to galleries.
- **Fetchability:** OK for gallery pages, weak for search. Adobe's bot
  protection is real — expect occasional 429s. Cache the response for the
  session.
- **Invocation moment:** When the user explicitly asks for "Instagram
  carousel reference" or "social media graphic reference." Closest thing to
  on-format inspiration we can actually fetch.

---

## 2. Honorable Mentions (great, but tricky to fetch)

| Site | What it offers | Why it's hard |
|---|---|---|
| **Dribbble** (`dribbble.com/tags/instagram-carousel`) | Best carousel/social-graphic curation on the web | Anonymous fetch returns blank body. Heavy JS render + bot wall. Would need a headless browser, not WebFetch. |
| **Land-book** | Beautiful landing-page curation, well-tagged | Returns 403 to anonymous WebFetch. Cloudflare wall. Skip unless we add a real browser. |
| **Pinterest** | Best raw breadth for "Instagram carousel design" boards | Anonymous fetch returns near-empty HTML. Everything is client-rendered. Pin URLs aren't usable from WebFetch. |
| **Mobbin** | Best-in-class mobile UI patterns | Auth-walled. Not useful for carousels anyway (focuses on app UI screens). |
| **Notefolio** (`notefolio.net`) | Korean designers, 카드뉴스 work present | Body returns only header. Login wall on `/explore`. Would be the #1 Korean source if we could get past the wall. |
| **Designspiration** | Image-board style curation | 403 to anonymous fetch. |
| **Godly.website** | Modern aesthetic curation | 403. |
| **UI Garage / Saver** | Both ECONNREFUSED during testing | Either dead or geo-blocked. |
| **Toss design.toss.im / toss.tech blog** | Excellent Korean fintech aesthetic source | Toss.tech *does* fetch (confirmed), but it's articles, not design exemplars. Useful as a Korean *writing voice* reference, not a visual one. |
| **designers.kr** | Redirected to an Adobe Portfolio agency page, not the community we wanted | The actual `designers.kr` community appears defunct/redirected. |

**To unlock Dribbble / Pinterest / Notefolio / Land-book** we would need
the gstack `/browse` skill (real Chromium) instead of WebFetch. Out of scope
for the lazy-load mechanism, but worth noting as a v2 upgrade.

---

## 3. Sites to Skip

- **Dribbble (search URL)** — fetches blank. Use Behance galleries instead.
- **Pinterest** — client-rendered, useless to WebFetch.
- **Land-book / Designspiration / Godly / Mobbin** — all 403 or auth-walled.
- **UI Garage / Saver.so / Saver.design** — connection refused or dead.
- **designers.kr** — not the site we expected; appears redirected to a
  single agency.
- **Pretendard showcase** — not a curation site, just a font sample page.
  Worth a one-time read for the team, not for runtime fetching.

---

## 4. Lazy-Load Design

### When to fetch

Three trigger moments — not on every card generation. Fetching is *opt-in*
based on the workflow phase:

1. **Onboarding design shotgun.** When the user is choosing an aesthetic
   direction during brand onboarding, fetch one matching Lapa.ninja category
   and one Httpster or Siteinspire style. Two fetches max, parallel. Output
   becomes part of the proposed taste-profile's "inspiration_seeds" field.

2. **Aesthetic-specific request.** When the user says "make this more
   editorial," "more fintech," "more brutalist," etc. during a session,
   fetch the single closest match (Siteinspire styles, Lapa.ninja
   categories, or Httpster styles). One fetch.

3. **Quality calibration.** Before final render of a carousel series, if
   the brand's quality bar is "premium," fetch one Awwwards typography or
   color category page to ground typography decisions. One fetch.

Do **not** fetch:
- On every card render (too slow, no value).
- During copy/content edits (irrelevant).
- Without a clear aesthetic axis (would just add noise).

### What to ask WebFetch

A consistent prompt template per site so the parsed output is uniform:

> "From this {site} {filter} page, extract up to 8 design references. For
> each, return: (1) name/title, (2) one-line description of the aesthetic
> (color palette, typography style, layout pattern, mood in 6-10 words),
> (3) thumbnail or outbound URL if visible. Skip ads, nav, and footer."

The WebFetch response model already summarizes — we don't need raw HTML.
We need a structured aesthetic vocabulary the designer prompt can use.

### How to integrate

Add a transient field to the design context (in-memory only for the
session, NOT persisted to taste-profile.json):

```
inspiration_seeds: [
  {
    source: "lapa.ninja/category/finance",
    fetched_at: <session ts>,
    references: [
      { name, aesthetic_summary, thumbnail_url? },
      ...
    ]
  },
  ...
]
```

The card designer prompt then includes a one-paragraph synthesis of these
seeds as "current reference vibe" — *not* as literal templates to copy. This
respects the existing MEMORY.md learning that fixed templates produce bad
designs; references inform the prompt, they don't constrain output.

Persist *only* the user's chosen direction (aesthetic adjectives, palette
hints), not the raw references. The user-facing taste-profile stays clean.

### Caching strategy

- **Per-session in-memory only.** Same URL within a session: reuse. Skill
  exits: drop everything.
- **No on-disk cache.** Avoids stale references and TOS gray area. Also
  matches the "brand evolves continuously" principle in MEMORY.md — fresh
  fetch each session keeps the vibe current.
- **Hard cap: 4 fetches per session.** Prevents runaway WebFetch loops if
  the user keeps adjusting aesthetic.

---

## 5. Risks & Gotchas

1. **TOS / scraping.** All of these sites prohibit scraping in their TOS to
   some degree. Mitigation: low volume (≤4 fetches per session), no
   persistence, no redistribution of images. We are reading curation pages
   the same way a human designer would — but at scale this becomes a
   problem. Document this in CONTRIBUTING.md if the skill goes public.

2. **Content drift.** Lapa.ninja and Httpster rotate features frequently.
   Same URL today ≠ same content next week. This is *fine* for inspiration
   (we want freshness) but means we can't write deterministic tests against
   specific references.

3. **Rate limits.** Behance + Adobe properties throttle aggressively. One
   fetch per session per gallery is safe; bursts will 429. The hard cap
   above prevents this.

4. **Anti-bot escalation.** Sites that fetch today may add Cloudflare
   tomorrow. The skill should *fail gracefully*: if WebFetch returns 403 or
   empty body, skip the reference seed and proceed with internal taste
   only. Never block card generation on a failed reference fetch.

5. **Korean coverage gap.** None of the top 5 has strong Korean curation.
   For Korean-tone work we are still relying on the AI's internal knowledge
   of 토스 / 배민 / 당근 / 카카오 aesthetics. Wiring up Notefolio (browser
   mode) or scraping selected Korean Instagram accounts directly would
   close this gap — out of scope for v1.

6. **Image vs HTML.** WebFetch returns text/markdown, not images. We get
   aesthetic *descriptions* (color, type, layout vocabulary) — not pixels.
   This is actually fine: the card designer doesn't need to see images, it
   needs design vocabulary to inform its prompt. But it's worth being
   explicit in the skill docs so contributors don't expect image-to-image
   reference matching.

7. **Hallucination from summary.** WebFetch's summary model could
   misrepresent what's on the page. Mitigation: pass the per-site prompt
   template above so the summary stays structured and concrete. If the
   response is vague ("modern, clean"), discard the seed.

---

## Appendix — Sites verified by live fetch

| Site | Status | Notes |
|---|---|---|
| lapa.ninja/ | OK | Full category list extracted |
| lapa.ninja/category/finance/ | OK | 24 refs per page, 376 total in category |
| lapa.ninja/category/instagram/ | 404 | Category does not exist |
| siteinspire.com/websites?categories=14 | OK | Style + type filters work |
| siteinspire.com/websites?categories=editorial | 404 | Use style slugs instead |
| awwwards.com/websites/ | OK | Richest metadata of any site tested |
| awwwards.com/inspiration/ | 404 | Wrong path |
| httpster.net/ | OK | 3,116 total featured |
| behance.net/galleries/graphic-design/ | OK | No login needed for gallery pages |
| behance.net/search/projects?... | Partial | Cuts off after first results, login wall |
| dribbble.com/tags/... | Blank | Client-rendered, unusable |
| dribbble.com/search/... | Blank | Same |
| pinterest.com/search/... | Blank | Client-rendered |
| land-book.com/ | 403 | Cloudflare |
| land-book.com/gallery | 403 | Cloudflare |
| notefolio.net/ | Partial | Header only, body needs JS |
| notefolio.net/explore | Partial | Login wall |
| designspiration.com/... | 403 | Bot wall |
| godly.website/ | 403 | Bot wall |
| saver.so / saver.design | ECONNREFUSED | Dead or geo-blocked |
| uigarage.net/inspirations/ | ECONNREFUSED | Dead or geo-blocked |
| toss.tech/ | OK | Articles, not visual references |
| designers.kr | Redirect | Now an agency portfolio, not a community |
