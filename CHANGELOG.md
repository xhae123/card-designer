# Changelog

All notable changes to Card Designer will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
