# Changelog

All notable changes to Card Designer will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] — 2026-05-28

### Added

- **Render-time overflow detection + auto-retry** — `scripts/render.js` now walks every descendant of `.slide`, measures bounding rects, and detects any element extending past the slide box. On overflow, it injects a CSS rule that scales `.content` down 10% per retry (max 2 retries), then re-screenshots. If overflow persists, the PNG is saved and flagged in the summary JSON (`overflow: true`, with offending selectors and px counts).
- **Font fallback detection** — after `document.fonts.ready`, the renderer inspects key text elements' resolved `font-family`. A serif fallback (Times/Georgia/etc.) on the primary family logs a warning, surfacing silent `@import` failures that previously shipped unnoticed.
- **`references/quality-gates.md`** — hard, non-negotiable ceilings: per-role character caps (cover 60 / statement 40 / detail 30+80 / list 5×30 / quote 60+20 / data 1+30 / cta 40), series structural limits (5–7 slides default, max 10, cover first, CTA last, no 3 consecutive same-role), and visual limits (max 3 colors/slide, ≥2 font weights). Violation policy: split, drop, or reject — never silently truncate.
- **`references/asset-handling.md`** — logo and image conventions: `brands/{name}/assets/` directory, base64 vs relative-path tradeoffs, max 80px logo height with preserved aspect ratio, dark-overlay requirement (≥40%) for photo-background covers, SVG-first format priority, and the once-per-asset intake flow.
- **Series Coherence Check (Step [8.5])** — before rendering, the AI must answer 5 carousel-level questions in plain text (cover promise resolved? tone consistent? narrative arc? cover strongest? slides stand alone?). Any "no" forces revision pre-render.
- **Quality Gates step (Step [8.25])** — explicit step that loads `quality-gates.md` and enforces all hard limits before self-verification.

### Changed

- **`scripts/validate.js`** — extended with four new checks: font-weight diversity (only 400/700 → AI-slop warning), AI-slop font detection (Inter/Roboto/Arial/Helvetica as primary family → warning), per-slide color count (>3 distinct colors → warning), and series-level consistency (mixed `.page-number` usage, divergent `.brand-mark` positions, multiple body font-families across slides). Directory mode now emits `{ files, series }` instead of a bare array.
- **`scripts/render.js` summary JSON** — adds `overflowed` count and per-file `overflow`, `overflowElements`, `retries`, `fontFallback` fields.
- **SKILL.md Directory Structure + Reference Files table** — now list `quality-gates.md`, `asset-handling.md`, `scripts/validate.js`, and `brands/{name}/assets/`.
- **SKILL.md Design Variety section** — compressed (~25 lines) without losing rules: each rule is now a single dense sentence rather than a multi-bullet expansion. Net SKILL.md line count unchanged at 698.

## [0.2.0] — 2026-05-28

### Added

- **D<N> Decision Brief format** — structured Korean-facing decision pattern (현재 상태 / ELI10 / 영향 / 추천 / 대안) used when a real design choice needs the user's input. Trivial defaults still get the designer's judgment + visible result, not a question.
- **Session Context Recovery** — every brand now keeps a `timeline.jsonl` (append-only event log: `onboarded`, `direction_selected`, `series_generated`, `profile_edit`, `feedback`, `rule_promoted`). On invocation the skill reads the last 10 entries and shows a brief "Welcome back" summary (last work, recently learned rules, lifetime series count).
- **Rule promotion algorithm** — concrete, enforceable consolidation of `learnings.jsonl`: 3+ semantically grouped entries at confidence ≥7 become a `type: rule` line that is auto-applied to future generations. Rules can be demoted after 2 contradictions.
- **Enforced Completion Status block** — every session now MUST end with a structured `═══ SESSION COMPLETE ═══` block (Status / Brand / Output / Learned / Next). Replaces the previous "soft" status table.

### Changed

- Persona reference (`references/persona.md`) now documents the D<N> brief as part of the designer's speech style.
- Generation Mode Step [4] explicitly loads `type: rule` entries from `learnings.jsonl` and applies them BEFORE writing HTML.
- Step [0] Brand Detection now performs timeline recovery after brand selection.

## [0.1.0] — 2026-05-28

### Initial release

- Brand-aware card news generation via Claude Code skill
- Dynamic HTML/CSS generation guided by design principles (no fixed templates)
- Brand evolution system with confidence-scored taste profiles
- Design shotgun onboarding — 3 visually distinct directions per new brand
- 8 card roles with distinct spatial compositions
- Self-verification anti-pattern checklist
- Puppeteer-based PNG rendering at 2x scale (2160x2160 native output)
- Visual effects library: halftone, glassmorphism, pseudo-3D, SVG illustrations
- Korean typography support (`word-break: keep-all`, Pretendard, Noto Sans KR)
- Element-based screenshot to eliminate edge-bleed artifacts
- Font inlining and disk caching for reliable Puppeteer rendering
