# Contributing to Card Designer

Thanks for your interest in improving Card Designer. This document explains how the project is structured and how to contribute effectively.

## How the skill is built

Card Designer is a Claude Code skill — it has no compile step, no runtime. It is a set of Markdown instructions (`SKILL.md` + `references/`) plus a small Node.js rendering script. Improvements happen by editing prompts and reference docs, then verifying the AI's output quality.

```
card-designer/
├── SKILL.md                    # The entry point — Claude reads this first
├── references/
│   ├── design-principles.md    # Index → routes to the 6 design files below
│   ├── canvas.md               # Canvas + CSS reset + centering pattern
│   ├── typography.md           # Size scale, Korean rules, font selection
│   ├── layout.md               # Spacing, alignment, slide sequence
│   ├── color.md                # Color rules + palette reference
│   ├── card-types.md           # Per-role spatial composition + CSS
│   ├── golden-examples.md      # Reference HTML slides (quality bar)
│   ├── anti-patterns.md        # Self-verification checklist
│   ├── content-principles.md   # Voice, hooks, narrative, Korean style
│   ├── font-presets.md         # Korean/English font recommendations
│   ├── quality-gates.md        # Hard limits (character caps, structure)
│   ├── asset-handling.md       # Logo/image handling
│   ├── persona.md              # Designer voice & tone
│   └── visual-effects.md       # CSS/SVG patterns library
└── scripts/
    ├── render.js               # HTML → PNG via Puppeteer
    └── validate.js             # Static HTML quality checks
```

## What kinds of contributions help

- **Design rule improvements** — sharper, more specific rules in the design files (`canvas.md`, `typography.md`, `layout.md`, `color.md`, `card-types.md`) or new entries in `golden-examples.md`
- **Anti-pattern additions** — new failure modes you've observed in real output → `references/anti-patterns.md`
- **Visual effect recipes** — new CSS/SVG techniques in `references/visual-effects.md` with working code
- **Font preset additions** — more language coverage (Japanese, Chinese, etc.) in `references/font-presets.md`
- **Renderer reliability** — bug fixes in `scripts/render.js` (timeout edge cases, font loading, multi-platform support)
- **Validator coverage** — new static checks in `scripts/validate.js`
- **Documentation** — README clarifications, installation issues per platform

## What does NOT help

- Adding new "features" without changing the design quality bar — the skill's value is output quality, not feature count
- Replacing the dynamic HTML generation with fixed templates — this is a fundamental architecture decision
- Adding heavy dependencies — the skill must stay lean (only Puppeteer)
- AI-slop additions like "make it more colorful" without specific px/ratio values

## Development workflow

1. Fork and clone the repo
2. Symlink into your Claude Code skills directory:
   ```bash
   ln -s "$(pwd)" ~/.claude/skills/card-designer
   ```
3. Install rendering dependencies:
   ```bash
   cd scripts && npm install && npx puppeteer browsers install chrome
   ```
4. Make your changes
5. Test by invoking `/card-designer` in Claude Code and generating a real card series
6. Verify the output PNGs look professional — this is the actual quality gate
7. Submit a PR with before/after screenshots if you changed visual output

## Testing changes

There is no automated test suite for design quality — that judgment requires human eyes. For changes to `scripts/`:

```bash
# Validate generated HTML
node scripts/validate.js path/to/slides/

# Render a test directory
node scripts/render.js path/to/slides/
```

For changes to `references/` or `SKILL.md`: run `/card-designer` with the same prompt before and after your change. Compare the outputs.

## Pull request guidelines

- Keep PRs focused on one concern (one rule, one bug, one effect)
- Include rendered PNG examples when changing visual rules
- For rule changes: explain *why* the existing rule fails and how the new rule produces better output
- For renderer changes: add a comment explaining the edge case

## Licensing

By contributing, you agree your contributions will be licensed under the MIT License.

## Code of Conduct

Be respectful, focus on the work, give honest feedback. We follow the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).
