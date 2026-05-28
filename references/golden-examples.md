# Golden Examples — The Quality Bar

> Four complete reference slides representing the minimum quality standard.
> Each one shows a different spatial composition: cover (left-center focus),
> data (diagonal contrast), list (vertical rhythm), CTA (full center
> symmetry). If your generated output does not visibly match this bar,
> revise before showing the user.
>
> **Examples use English content for international accessibility.** The
> `word-break: keep-all` rule remains because the same patterns must work
> for Korean — change content language but never the rule.

## 1. Cover Slide

Left-center focus, ample whitespace on the right, single thin bottom-line
decoration. The "entrance" energy of a carousel.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1080">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700;800;900&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 1080px; height: 1080px; overflow: hidden; }

    .slide {
      width: 1080px;
      height: 1080px;
      position: relative;
      background: #0F172A;
      color: #F8FAFC;
      font-family: 'Pretendard', -apple-system, sans-serif;
    }

    .content {
      position: absolute;
      top: 50%;
      left: 80px;
      right: 80px;
      transform: translateY(-50%);
    }

    .brand-mark {
      position: absolute;
      top: 48px;
      left: 80px;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 0.08em;
      color: #3B82F6;
      text-transform: uppercase;
    }

    .eyebrow {
      font-size: 20px;
      font-weight: 500;
      letter-spacing: 0.04em;
      color: #3B82F6;
      margin-bottom: 24px;
    }

    .title {
      font-size: 64px;
      font-weight: 800;
      letter-spacing: -0.02em;
      line-height: 1.2;
      word-break: keep-all;
      max-width: 780px;
      margin-bottom: 32px;
    }

    .title .accent { color: #3B82F6; }

    .subtitle {
      font-size: 26px;
      font-weight: 400;
      line-height: 1.5;
      word-break: keep-all;
      color: #94A3B8;
      max-width: 600px;
    }

    .bottom-line {
      position: absolute;
      bottom: 76px;
      left: 80px;
      width: 64px;
      height: 3px;
      background: #3B82F6;
      border-radius: 2px;
    }
  </style>
</head>
<body>
  <div class="slide">
    <div class="brand-mark">INSIGHT LAB</div>
    <div class="content">
      <div class="eyebrow">2026 TREND REPORT</div>
      <h1 class="title">How AI Is Reshaping<br><span class="accent">the Way We Work</span></h1>
      <p class="subtitle">Your daily workflow has six months left before it changes for good.</p>
    </div>
    <div class="bottom-line"></div>
  </div>
</body>
</html>
```

**Principles demonstrated:**

- **60%+ whitespace** — content concentrated left-center, ample empty space
  on the right and top/bottom
- **4 font weights** — 800 (title), 600 (brand), 500 (eyebrow), 400 (subtitle)
- **3 colors** — `#0F172A` (bg 70%+), `#F8FAFC` (fg), `#3B82F6` (accent < 10%)
- **Differentiated letter-spacing** — title `-0.02em`, brand `0.08em`, eyebrow `0.04em`
- **Contrast verified** — `#F8FAFC` on `#0F172A` = 17.3:1; `#3B82F6` on `#0F172A` = 5.3:1;
  `#94A3B8` on `#0F172A` = 5.5:1
- **`word-break: keep-all`** — applied to all text (compatible with English, mandatory for Korean)
- **Minimal decoration** — a single thin bottom line is the only decorative element

---

## 2. Data / Stats Slide

Diagonal composition: top-left text, bottom-right hero number. Massive
central whitespace. The "impact" energy.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1080">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700;800;900&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700;800&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      width: 1080px;
      height: 1080px;
      overflow: hidden;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 7.5% 7.5% 6.5% 7.5%;
      background: #0F172A;
      color: #F8FAFC;
      font-family: 'Pretendard', -apple-system, sans-serif;
    }

    .top-block {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 1.5%;
      max-width: 520px;
    }

    .category {
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 0.06em;
      color: #3B82F6;
      text-transform: uppercase;
    }

    .context-heading {
      font-size: 32px;
      font-weight: 700;
      letter-spacing: -0.01em;
      line-height: 1.35;
      word-break: keep-all;
    }

    .context-body {
      font-size: 22px;
      font-weight: 400;
      line-height: 1.618;
      word-break: keep-all;
      color: #94A3B8;
      max-width: 460px;
    }

    .bottom-block {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 1%;
    }

    .stat-label {
      font-size: 20px;
      font-weight: 500;
      letter-spacing: 0.04em;
      color: #3B82F6;
    }

    .stat-number {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 140px;
      font-weight: 800;
      letter-spacing: -0.04em;
      line-height: 0.9;
    }

    .stat-number .unit {
      font-size: 56px;
      font-weight: 500;
      letter-spacing: -0.02em;
      vertical-align: baseline;
    }

    .stat-footnote {
      font-size: 18px;
      font-weight: 400;
      color: #64748B;
      letter-spacing: 0.02em;
    }

    .accent-line {
      position: absolute;
      top: 7.5%;
      right: 7.5%;
      width: 48px;
      height: 3px;
      background: #3B82F6;
      border-radius: 2px;
    }
  </style>
</head>
<body>
  <div class="accent-line"></div>
  <div class="top-block">
    <div class="category">MARKET ANALYSIS</div>
    <h2 class="context-heading">Enterprise AI SaaS grew faster than any sector this year</h2>
    <p class="context-body">2025 set a record for adoption among companies of every size, reshaping the competitive landscape.</p>
  </div>
  <div class="bottom-block">
    <div class="stat-label">YoY Growth</div>
    <div class="stat-number">78<span class="unit">%</span></div>
    <div class="stat-footnote">Source: KDB Industry Research, 2025</div>
  </div>
</body>
</html>
```

> Note: this slide uses `display: flex` on `body` to achieve the diagonal
> top/bottom composition via `space-between`. This is the exception to the
> normal `.slide` pattern — allowed only when the slide is composed of
> exactly two corner-anchored blocks. Default slides still use the
> absolute + translateY pattern.

**Principles demonstrated:**

- **Diagonal composition** — top-left text, bottom-right number; completely
  different spatial layout from the cover's left-center focus
- **`justify-content: space-between`** pushes elements to top and bottom,
  creating massive central whitespace; 60%+ whitespace maintained
- **Hero number 140px** — 6×+ larger than body (22px); the number visually
  dominates and the message lands instantly
- **Space Grotesk + Pretendard pairing** — geometric font for numbers,
  Pretendard for the rest, with clear role separation
- **5 font weights** — 800 (number), 700 (heading), 600 (category), 500
  (label/unit), 400 (body/source)
- **Right-aligned numbers** — right alignment is allowed for stats/data;
  creates visual tension with the top-left text
- **Accent line position varies vs cover** — cover at bottom, here at top-right;
  same element, different placement = visual variety
- **Source attribution** — small (18px), low-contrast, establishes credibility

---

## 3. List Slide

Asymmetric 2-column structure: narrow number column left, wide content
right. Items separated by whitespace and typography alone, no boxes. The
"information delivery" energy.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1080">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700;800;900&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 1080px; height: 1080px; overflow: hidden; }

    .slide {
      width: 1080px;
      height: 1080px;
      position: relative;
      background: #0F172A;
      color: #F8FAFC;
      font-family: 'Pretendard', -apple-system, sans-serif;
    }

    .content {
      position: absolute;
      top: 50%;
      left: 80px;
      right: 80px;
      transform: translateY(-50%);
    }

    .slide-label + .list-items { margin-top: 48px; }

    .slide-label {
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 0.06em;
      color: #3B82F6;
      text-transform: uppercase;
    }

    .list-items {
      display: flex;
      flex-direction: column;
      gap: 4%;
      width: 100%;
    }

    .list-item {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: 3%;
    }

    .item-number {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 48px;
      font-weight: 700;
      line-height: 1.0;
      color: #3B82F6;
      min-width: 64px;
      opacity: 0.7;
    }

    .item-content {
      display: flex;
      flex-direction: column;
      gap: 0.7%;
    }

    .item-label {
      font-size: 28px;
      font-weight: 600;
      line-height: 1.35;
      word-break: keep-all;
      letter-spacing: -0.01em;
    }

    .item-desc {
      font-size: 21px;
      font-weight: 400;
      line-height: 1.618;
      word-break: keep-all;
      color: #94A3B8;
      max-width: 680px;
    }

    .divider-thin {
      width: 100%;
      height: 1px;
      background: #F8FAFC;
      opacity: 0.06;
    }

    .bottom-note {
      position: absolute;
      bottom: 5%;
      left: 7.5%;
      font-size: 16px;
      font-weight: 500;
      letter-spacing: 0.04em;
      color: #64748B;
    }
  </style>
</head>
<body>
  <div class="slide">
    <div class="content">
      <div class="slide-label">CORE STRATEGY</div>
      <div class="list-items">
        <div class="list-item">
          <div class="item-number">01</div>
          <div class="item-content">
            <div class="item-label">Automate repetitive workflows first</div>
            <div class="item-desc">Hand off the routine work to AI and the whole team gains hours back. The fastest ROI lives here.</div>
          </div>
        </div>
        <div class="list-item">
          <div class="item-number">02</div>
          <div class="item-content">
            <div class="item-label">Bring your data pipeline in-house</div>
            <div class="item-desc">Reduce reliance on external vendors and build internal data infrastructure — that's what makes AI capability durable.</div>
          </div>
        </div>
        <div class="list-item">
          <div class="item-number">03</div>
          <div class="item-content">
            <div class="item-label">Redefine the metrics you measure</div>
            <div class="item-desc">Measure outcomes by quality of output, not hours logged. Time spent stopped being a KPI a long time ago.</div>
          </div>
        </div>
      </div>
      <div class="divider-thin"></div>
    </div>
    <div class="bottom-note">3 / 7</div>
  </div>
</body>
</html>
```

**Principles demonstrated:**

- **Asymmetric 2-column** — narrow number area (64px) and wide content area;
  intentional asymmetry, not equal division
- **Numbers as design elements** — Space Grotesk 48px enlarges numbers into
  rhythm anchors, not simple bullets
- **No boxes** — items separated by `gap: 4%` and typography alone
- **Number opacity 0.7** — numbers visible but one step behind the content;
  fine-tuned visual hierarchy
- **4 font weights** — 700 (numbers), 600 (label/slide label), 500 (bottom note),
  400 (description)
- **Bottom divider + page number** — extremely thin line (opacity 0.06) gives
  a sense of position within the carousel
- **Whitespace creates structure** — 4.5% between top label and first item,
  4% between items, bottom margin: all different percentage-based spacings

---

## 4. CTA / Closing Slide

Full center symmetry. After all info has been delivered, drives action with
a single message. The "conclusion" energy.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1080">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700;800;900&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 1080px; height: 1080px; overflow: hidden; }

    .slide {
      width: 1080px;
      height: 1080px;
      position: relative;
      background: linear-gradient(180deg, #0F172A 0%, #162032 100%);
      color: #F8FAFC;
      font-family: 'Pretendard', -apple-system, sans-serif;
    }

    .content {
      position: absolute;
      top: 50%;
      left: 80px;
      right: 80px;
      transform: translateY(-50%);
      text-align: center;
    }

    .accent-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #3B82F6;
      margin: 0 auto 28px;
    }

    .cta-heading {
      font-size: 48px;
      font-weight: 700;
      letter-spacing: -0.02em;
      line-height: 1.3;
      word-break: keep-all;
      max-width: 680px;
      margin: 0 auto 24px;
    }

    .cta-heading .highlight { color: #3B82F6; }

    .cta-sub {
      font-size: 24px;
      font-weight: 400;
      line-height: 1.618;
      word-break: keep-all;
      color: #94A3B8;
      max-width: 520px;
      margin: 0 auto 32px;
    }

    .divider-center {
      width: 40px;
      height: 2px;
      background: #3B82F6;
      border-radius: 1px;
      opacity: 0.6;
      margin: 0 auto 24px;
    }

    .handle {
      font-size: 20px;
      font-weight: 600;
      letter-spacing: 0.06em;
      color: #3B82F6;
    }

    .brand-bottom {
      position: absolute;
      bottom: 4.5%;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0.08em;
      color: #F8FAFC;
      opacity: 0.3;
      text-transform: uppercase;
    }

    .corner-marks {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      pointer-events: none;
    }

    .corner-marks::before,
    .corner-marks::after {
      content: '';
      position: absolute;
      width: 32px;
      height: 32px;
      border: 1px solid #3B82F6;
      opacity: 0.12;
    }

    .corner-marks::before {
      top: 4.5%;
      left: 4.5%;
      border-right: none;
      border-bottom: none;
    }

    .corner-marks::after {
      bottom: 4.5%;
      right: 4.5%;
      border-left: none;
      border-top: none;
    }
  </style>
</head>
<body>
  <div class="slide">
    <div class="corner-marks"></div>
    <div class="content">
      <div class="accent-dot"></div>
      <h2 class="cta-heading">This is <span class="highlight">the turning point</span></h2>
      <p class="cta-sub">The gap between companies that adopt AI and those that don't widens every quarter. Starting next quarter is already late.</p>
      <div class="divider-center"></div>
      <div class="handle">@insight.lab</div>
    </div>
    <div class="brand-bottom">Insight Lab</div>
  </div>
</body>
</html>
```

**Principles demonstrated:**

- **Full center symmetry** — `text-align: center` with centered margins; a
  composition reserved for CTA / conclusion slides
- **Contrast with cover** — cover is left-aligned for "beginning" energy;
  CTA is center-aligned for "conclusion" static energy
- **Subtle gradient background** — `#0F172A` → `#162032` vertical gradient
  adds depth beyond solid color; 2-color limit respected
- **Decorative restraint** — corner marks (opacity 0.12) and accent dot only;
  framing effect without excessive decoration
- **4 font weights** — 700 (CTA heading), 600 (handle), 500 (brand), 400 (subtext)
- **Color tone hierarchy via opacity** — `#F8FAFC` (heading), `#3B82F6` (highlight/handle),
  `#94A3B8` (supporting), `rgba(#F8FAFC, 0.3)` (brand) — same 3 colors, 4-level hierarchy

---

## Spatial Composition Comparison

| Slide | Composition | Energy |
|---|---|---|
| 1. Cover | Left-center focus, right whitespace | "Entrance" |
| 2. Data | Top-left → bottom-right diagonal | "Impact" |
| 3. List | Vertical rhythm, asymmetric 2-col | "Information delivery" |
| 4. CTA | Full center, symmetrical | "Conclusion / action" |

If a 4-slide carousel uses the same composition for any two of these roles,
the result reads as a single-template repetition. Each role must feel
spatially distinct.

## See also

- [`card-types.md`](./card-types.md) — the CSS pattern starting points
- [`canvas.md`](./canvas.md) — the centering rule the patterns build on
- [`anti-patterns.md`](./anti-patterns.md) — the verification checklist
