<div align="center">

<img src="docs/hero.png" alt="card-designer" width="800"/>

<h1>card-designer</h1>

<p>A Claude Code skill that doesn't just generate carousels — it accumulates a brand's visual grammar over time.</p>

</div>

---

## What it produces

1080×1080 Instagram carousels rendered at 2× retina (2160px PNG) from a topic and a brand profile. Type, layout, and SVG illustrations are written from scratch each run, guided by the brand's accumulated grammar.

<p align="center">
  <img src="docs/showcase/slide_01.png" width="160"/>
  <img src="docs/showcase/slide_02.png" width="160"/>
  <img src="docs/showcase/slide_03.png" width="160"/>
  <img src="docs/showcase/slide_04.png" width="160"/>
  <img src="docs/showcase/slide_05.png" width="160"/>
</p>

Two outputs per session:

- **Carousel.** `slide_01.png … slide_NN.png` ready to post.
- **Brand assets.** `brand-master.md`, `idioms.json`, `manifest.json`, an SVG library — files that get richer with every session and make the next series sharper.

---

## Install

Drop the repo into your Claude Code skills directory:

```bash
git clone https://github.com/xhae123/card-designer.git ~/.claude/skills/card-designer
cd ~/.claude/skills/card-designer
npm install        # puppeteer for rendering
pip3 install pillow vtracer    # for raster asset intake
brew install pngquant          # optional, compresses embedded PNGs
```

Claude Code picks the skill up on next session. Trigger it with phrases like:

```
카드뉴스 만들어줘
카드뉴스 디자인해줘
card designer
```

---

## Quickstart

**1. Invoke the skill.** Use any of the trigger phrases above.

**2. First time: brand onboarding.** A 7-phase designer interview walks you through voice, mood, signature motifs, idioms, composition patterns, and brand-specific anti-patterns. Upload a logo or any existing assets and they're auto-converted to inline SVG (pixel-perfect via base64 embed). Output: a `brand-master.md` constitution + structured asset library that persists across sessions.

**3. Subsequent runs: just give a topic.**

```
"백엔드 스터디 모집 공지 카드뉴스 7장 만들어줘"
```

The skill loads your brand grammar, plans assets per slide, generates HTML, renders via puppeteer, runs an aesthetic critique, and opens the previews.

Full workflow lives in `SKILL.md`.

---

## How it's different

Most carousel tools handle **surface tokens** — colors, fonts, spacing. Those are trivial to copy from a screenshot.

This skill captures the layers above that:

- **Master vocabulary** — the signature SVGs that identify your brand at a thumbnail glance (mascot, recurring motifs).
- **Visual idioms** — how *your brand specifically* expresses emphasis, lists, big numbers, dividers, success states, containers. One brand uses a black highlight box; another uses an orange underline; another uses a sticker burst.
- **Composition patterns** — the spatial rules your covers follow versus your detail slides versus your CTAs.
- **Voice-visual coupling** — which adjective ("friendly", "precise", "loud") translates to which design move.

These layers can't be lifted from one screenshot. They emerge through use, get logged, and turn into per-brand rules that future sessions enforce automatically.

A brand-asset escape hatch matters too: when you upload a logo PNG, it's preserved pixel-perfectly via SVG-wrapped base64 (the way Figma/Canva export non-vector layers), not eye-traced and degraded. When the AI draws fresh motifs in your brand mood, those are pure editable SVG. Two protocols, never confused.

---

## Project structure

```
card-designer/
├── SKILL.md                  # main workflow — load this first
├── scripts/
│   ├── render.js             # puppeteer renderer
│   └── png-to-svg.py         # raster intake → embedded SVG
├── references/
│   ├── asset-language.md     # WHEN/HOW assets, the two-protocol rule
│   ├── asset-moods.md        # 12-mood SVG technique library (lazy)
│   ├── onboarding-protocol.md # 7-phase brand kickoff
│   ├── visual-critique.md    # 9-criterion self-critique
│   ├── designer-reviewer.md  # opt-in external reviewer agent
│   ├── canvas.md / typography.md / layout.md / color.md
│   ├── card-types.md / content-principles.md / anti-patterns.md
│   ├── quality-gates.md / font-presets.md / visual-effects.md
│   └── external-references.md
└── brands/{name}/            # per-brand accumulated state (gitignored)
    ├── brand-master.md       # the constitution
    ├── idioms.json / manifest.json / evolution.md / timeline.jsonl
    └── assets/{logo.svg, signature/, library/, raw/}
```

Brand directories are user data and stay out of git.

---

## Docs

- Full workflow → `SKILL.md`
- Asset philosophy and the two-protocol rule → `references/asset-language.md`
- Designer kickoff interview → `references/onboarding-protocol.md`
- SVG mood library → `references/asset-moods.md`
- Working example brand → `brands/khu-likelion/` (gitignored locally)

---

## Contributing

Issues and pull requests via [GitHub](https://github.com/xhae123/card-designer). Bug reports with rendered output and the brand profile that produced it are most useful.

## License

MIT.
