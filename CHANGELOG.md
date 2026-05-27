# Changelog

All notable changes to Card Designer will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
