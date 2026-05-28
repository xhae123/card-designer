# Visual Critique — 추함을 잡는 루프

The missing eye. Renders pass anti-patterns checklist but still look amateur. This file is the structured critique loop that runs AFTER rendering, BEFORE showing the user. Loaded every generation at Step [10.7].

> **Why this exists.** `anti-patterns.md` catches *forbidden* patterns. It does not catch *ugly*. A real designer's eye says "the hierarchy is mush", "those colors clash", "the cover is weaker than slide 3". This loop is the proxy for that eye.

---

## When this fires

Step [10.7] in SKILL.md generation flow, between [10.5] Visual Verification (technical checks: clipping, font load) and [11] Present Preview (showing user). Never skipped.

Input: rendered PNGs from `output-dir/slide_*.png`.
Output: per-slide critique block + go/no-go verdict + retry directives.

---

## The 9 Criteria

For each slide, score each criterion as `pass / minor / fail`. Read the PNG with the Read tool, then write the critique inline.

### 1. Hierarchy clarity
Does the eye land on ONE element first, unambiguously? Largest type or strongest visual mass wins?

- `pass` — focal element clear, eye path obvious
- `minor` — competing focal points but content survives
- `fail` — eye doesn't know where to land. Title and decoration both demanding attention.

### 2. Color harmony
Palette feels intentional. Accent is restrained. No accidental clash. Background color doesn't fight foreground.

- `pass` — colors sing together
- `minor` — one element slightly off, recoverable
- `fail` — clash, muddiness, accidental ugly combination (e.g., orange text on red, low-contrast hex pair)

### 3. Breathing room (negative space)
Cramped? Crowded? ≥40% canvas empty? Korean rule: 여백 부족 = 갑갑함.

- `pass` — content breathes, whitespace concentrates rhythm
- `minor` — one zone tight but slide overall OK
- `fail` — wall-of-stuff feel, no rest for the eye

### 4. Typography contrast
Weight and size differences strong enough to create rhythm? Title visually distinct from body? No "all the same weight" mush?

- `pass` — clear hierarchy via type
- `minor` — could push more, but reads
- `fail` — flat — title and body indistinguishable, or competing weights mid-line

### 5. Cohesion within carousel
Does this slide feel like a sibling of the others? Same mood, palette ratio, light source, stroke stance? Or does it look like it wandered in from another deck?

- `pass` — visually a sibling
- `minor` — minor inconsistency (one extra accent color, slightly different padding)
- `fail` — style drift — different mood, different palette weight, different geometric grammar

### 6. Cover dominance (cover slide only)
Is the cover visually the strongest in the carousel? Largest type or boldest art? Would it win attention as an Instagram thumbnail?

- `pass` — cover is clearly the alpha slide
- `minor` — strong but a body slide is competing
- `fail` — cover is forgettable; a detail slide is doing the cover's job

### 7. Asset balance
If assets present: right size for the slot? Not competing with text? Not absent where the role calls for one? Not redundant (same motif on multiple slides without context-fit)?

- `pass` — asset earns its space
- `minor` — slight scale mismatch, or one slot under-used
- `fail` — asset crowds text, or appears where content doesn't call for it (mascot on serious slide), or budget exceeded

### 8. AI-smell
Does it look generated? Watch for: over-symmetry, dead-center placements that should be off-thirds, suspiciously uniform spacing, identical decorations on every slide, "spinning rainbow gradient because I can".

- `pass` — feels designed, not generated
- `minor` — one tell (e.g., centered when off-third would breathe better)
- `fail` — multiple tells, smells AI

### 9. Brand alignment
Matches `brand-master.md` voice + locked idioms + composition patterns + anti-patterns? Or did the slide drift from brand grammar in pursuit of variety?

- `pass` — on-brand
- `minor` — small drift (one idiom not applied, one composition pattern off)
- `fail` — broke a `hard` rule, or used an asset whose context-fit failed, or violated voice (e.g., sticker-kawaii brand made a brutalist-looking slide)

---

## Verdict logic

After scoring all 9 criteria per slide:

| Score profile | Verdict | Action |
|---|---|---|
| 0 fails AND ≤2 minors | `ship` | Proceed to [11] |
| 0 fails AND 3-4 minors | `polish` | One retry on this slide with specific fixes |
| 1 fail OR ≥5 minors | `retry` | Retry this slide (max 2 retries total) |
| ≥2 fails | `retry-hard` | Retry; if retries exhausted, surface to user with concerns |
| Cover fails criterion 6 | `retry-cover` | Cover MUST dominate — non-negotiable |

**Retry budget per slide: 2.** After 2 retries, ship with noted concerns to the user — never loop infinitely.

**Series-level verdict:** if ≥40% of slides need retry, the issue is brand-grammar level (mood mismatch, idiom misapplication), not slide-level. Halt; surface to user; do not retry individually.

---

## Critique output format

Write the critique inline before the retry decision. One block per slide. Be specific — "title too small relative to subtitle" beats "hierarchy weak".

```
Slide 1 (cover):
  1. Hierarchy: pass — title 138px dominates, subtitle 30px supports
  2. Color: pass — orange accent on dark, single hue, harmonious
  3. Breathing: pass — top 30% empty, bottom-right anchor balances
  4. Typography: pass — 900 vs 600 vs 700-tracked, clear ladder
  5. Cohesion: pass
  6. Cover dominance: pass — strongest of the 5 rendered
  7. Asset balance: minor — iso-objects could be 15% larger to compete with title weight
  8. AI-smell: pass
  9. Brand alignment: pass — kawaii logo top-left, iso accent bottom-right, halftone bg present
  → Verdict: ship (1 minor, recoverable next iteration)

Slide 2 (detail):
  1. Hierarchy: fail — folder-tab title and folder-body 3 black labels equally bold,
                       eye doesn't know which to read first
  3. Breathing: minor — folder body crowded with 3 items
  ...
  → Verdict: retry-hard — restructure folder-body, reduce label box weight or count
```

---

## Common failure patterns + fixes

| Failure | Likely cause | Fix |
|---|---|---|
| Hierarchy fail on detail slide | Idiom-stacking — folder-card + black-box labels + emphasis spans all at once | Cut one idiom layer. Idioms compete when stacked. |
| Color fail (clash) | Accent used outside accent role — orange text on orange container | Move accent to one slot per slide. |
| Breathing fail | Padding violated (boilerplate says 80px) OR too many list items per slide | Reduce items per slide; split into two slides. |
| Cover dominance fail | Title weight ≤ body slide title weight | Push cover title +30% size or +1 weight notch |
| AI-smell fail | All slides center-aligned, all assets dead-center | Shift to rule-of-thirds power points |
| Brand alignment fail | Mascot or signature container used where context-fit fails | Drop the asset; replace with idiom or naked layout |

---

## What NOT to do during critique

- ❌ Critique based on memory of the HTML — always read the PNG. The render can differ from intent (overflow, font fallback, color shift).
- ❌ Mark every slide `ship` to be polite. The user cannot see this output — be honest.
- ❌ Retry forever. 2 retries per slide max.
- ❌ Quietly accept a fail. If shipping with concerns, surface them in [11] Present Preview message.
- ❌ Add new criteria mid-session. The 9 are the 9. Brand-specific rules live in `learnings.jsonl` and are caught by criterion 9 (brand alignment).
- ❌ Critique a slide you haven't actually viewed. Read the PNG first.

---

## Integration with feedback loop

If the user gives `rejected` or edit feedback at Step [12] after critique said `ship`:
- That's a signal the critique missed something. Append a `type: critique-miss` entry to `learnings.jsonl` with the user's stated reason.
- After 3 critique-misses on the same criterion, surface to the user — "이 차원을 제가 자꾸 놓치네요. 어떤 부분이 핵심이에요?"

This is how the eye self-calibrates over time.
